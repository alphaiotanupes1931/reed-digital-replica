
-- 1. profiles: account type, accountant id, stripe income fields
DO $$ BEGIN
  CREATE TYPE public.account_type AS ENUM ('owner', 'accountant');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS account_type public.account_type NOT NULL DEFAULT 'owner',
  ADD COLUMN IF NOT EXISTS accountant_id text UNIQUE,
  ADD COLUMN IF NOT EXISTS stripe_income_choice text CHECK (stripe_income_choice IN ('stripe','manual')),
  ADD COLUMN IF NOT EXISTS stripe_income_key text,
  ADD COLUMN IF NOT EXISTS stripe_income_connected_at timestamptz,
  ADD COLUMN IF NOT EXISTS stripe_income_last_synced_at timestamptz,
  ADD COLUMN IF NOT EXISTS linked_accountant_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS tax_season_notified_year int;

-- Generator for accountant_id (reuses pattern from gen_business_id)
CREATE OR REPLACE FUNCTION public.gen_accountant_id()
RETURNS text LANGUAGE plpgsql AS $$
DECLARE
  alphabet text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  code text;
  i int;
  exists_already boolean;
BEGIN
  LOOP
    code := 'A-';
    FOR i IN 1..6 LOOP
      code := code || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
    END LOOP;
    SELECT EXISTS(SELECT 1 FROM public.profiles WHERE accountant_id = code) INTO exists_already;
    EXIT WHEN NOT exists_already;
  END LOOP;
  RETURN code;
END $$;

CREATE OR REPLACE FUNCTION public.set_accountant_id()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.account_type = 'accountant' AND NEW.accountant_id IS NULL THEN
    NEW.accountant_id := public.gen_accountant_id();
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_profiles_accountant_id ON public.profiles;
CREATE TRIGGER trg_profiles_accountant_id
BEFORE INSERT OR UPDATE OF account_type ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.set_accountant_id();

-- 2. tax_income_entries dedupe column for Stripe charges
ALTER TABLE public.tax_income_entries
  ADD COLUMN IF NOT EXISTS stripe_charge_id text;

CREATE UNIQUE INDEX IF NOT EXISTS tax_income_entries_owner_stripe_charge_idx
  ON public.tax_income_entries(owner_user_id, stripe_charge_id)
  WHERE stripe_charge_id IS NOT NULL;

-- 3. accountant_clients link table
CREATE TABLE IF NOT EXISTS public.accountant_clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  accountant_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','active','removed')),
  requested_at timestamptz NOT NULL DEFAULT now(),
  accepted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (accountant_user_id, client_user_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.accountant_clients TO authenticated;
GRANT ALL ON public.accountant_clients TO service_role;
ALTER TABLE public.accountant_clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parties can view their link" ON public.accountant_clients
  FOR SELECT USING (auth.uid() = accountant_user_id OR auth.uid() = client_user_id);
CREATE POLICY "Client can request" ON public.accountant_clients
  FOR INSERT WITH CHECK (auth.uid() = client_user_id);
CREATE POLICY "Accountant updates status" ON public.accountant_clients
  FOR UPDATE USING (auth.uid() = accountant_user_id) WITH CHECK (auth.uid() = accountant_user_id);
CREATE POLICY "Client can remove their request" ON public.accountant_clients
  FOR DELETE USING (auth.uid() = client_user_id);

CREATE TRIGGER trg_accountant_clients_updated
BEFORE UPDATE ON public.accountant_clients
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. system_notifications
CREATE TABLE IF NOT EXISTS public.system_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind text NOT NULL,
  title text NOT NULL,
  body text,
  cta_url text,
  read_at timestamptz,
  dismissed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.system_notifications TO authenticated;
GRANT ALL ON public.system_notifications TO service_role;
ALTER TABLE public.system_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own notifications" ON public.system_notifications
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own notifications" ON public.system_notifications
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own notifications" ON public.system_notifications
  FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Users insert own notifications" ON public.system_notifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS system_notifications_user_unread_idx
  ON public.system_notifications(user_id, created_at DESC)
  WHERE read_at IS NULL AND dismissed_at IS NULL;

-- 5. RPC: connect to accountant by accountant_id
CREATE OR REPLACE FUNCTION public.connect_accountant_by_id(_accountant_id text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _acc_user uuid;
  _client uuid := auth.uid();
  _client_name text;
  _link_id uuid;
BEGIN
  IF _client IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;

  SELECT user_id INTO _acc_user FROM public.profiles
    WHERE upper(accountant_id) = upper(trim(_accountant_id)) AND account_type = 'accountant'
    LIMIT 1;
  IF _acc_user IS NULL THEN RAISE EXCEPTION 'No accountant found with that ID'; END IF;
  IF _acc_user = _client THEN RAISE EXCEPTION 'You cannot link to yourself'; END IF;

  SELECT COALESCE(business_name, full_name, 'A client') INTO _client_name
    FROM public.profiles WHERE user_id = _client;

  INSERT INTO public.accountant_clients (accountant_user_id, client_user_id, status)
    VALUES (_acc_user, _client, 'pending')
    ON CONFLICT (accountant_user_id, client_user_id) DO UPDATE SET status='pending', requested_at=now()
    RETURNING id INTO _link_id;

  UPDATE public.profiles SET linked_accountant_id = _acc_user WHERE user_id = _client;

  INSERT INTO public.system_notifications (user_id, kind, title, body, cta_url)
    VALUES (_acc_user, 'client_request', 'New client request',
      COALESCE(_client_name,'A client') || ' would like to connect.', '/home-office/accountant');

  RETURN _link_id;
END $$;

GRANT EXECUTE ON FUNCTION public.connect_accountant_by_id(text) TO authenticated;

-- 6. RPC: notify accountant (in-app)
CREATE OR REPLACE FUNCTION public.notify_my_accountant(_message text DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _client uuid := auth.uid();
  _acc uuid;
  _name text;
BEGIN
  IF _client IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  SELECT accountant_user_id INTO _acc FROM public.accountant_clients
    WHERE client_user_id = _client AND status = 'active' LIMIT 1;
  IF _acc IS NULL THEN RAISE EXCEPTION 'No active accountant linked'; END IF;
  SELECT COALESCE(business_name, full_name, 'Your client') INTO _name FROM public.profiles WHERE user_id = _client;
  INSERT INTO public.system_notifications (user_id, kind, title, body, cta_url)
    VALUES (_acc, 'client_update', _name || ' updated tax info',
      COALESCE(_message, 'They just updated their tax data.'), '/home-office/accountant');
END $$;

GRANT EXECUTE ON FUNCTION public.notify_my_accountant(text) TO authenticated;
