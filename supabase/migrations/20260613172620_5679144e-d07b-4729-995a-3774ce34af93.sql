
-- accountant_settings: one row per owner
CREATE TABLE public.accountant_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  published BOOLEAN NOT NULL DEFAULT false,
  show_bills BOOLEAN NOT NULL DEFAULT true,
  show_invoices BOOLEAN NOT NULL DEFAULT true,
  show_writeoffs BOOLEAN NOT NULL DEFAULT true,
  show_notes BOOLEAN NOT NULL DEFAULT false,
  share_token TEXT UNIQUE,
  share_passcode_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.accountant_settings TO authenticated;
GRANT ALL ON public.accountant_settings TO service_role;

ALTER TABLE public.accountant_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners manage their accountant settings"
  ON public.accountant_settings FOR ALL
  USING (auth.uid() = owner_user_id)
  WITH CHECK (auth.uid() = owner_user_id);

CREATE TRIGGER update_accountant_settings_updated_at
  BEFORE UPDATE ON public.accountant_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- accountant_invites
CREATE TABLE public.accountant_invites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  accountant_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  invite_token TEXT NOT NULL UNIQUE,
  accepted_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX accountant_invites_owner_idx ON public.accountant_invites(owner_user_id);
CREATE INDEX accountant_invites_accountant_idx ON public.accountant_invites(accountant_user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.accountant_invites TO authenticated;
GRANT ALL ON public.accountant_invites TO service_role;

ALTER TABLE public.accountant_invites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners manage their invites"
  ON public.accountant_invites FOR ALL
  USING (auth.uid() = owner_user_id)
  WITH CHECK (auth.uid() = owner_user_id);

CREATE POLICY "Accountants can see invites for them"
  ON public.accountant_invites FOR SELECT
  USING (auth.uid() = accountant_user_id);

CREATE TRIGGER update_accountant_invites_updated_at
  BEFORE UPDATE ON public.accountant_invites
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- month_closes: soft close per owner per month
CREATE TABLE public.month_closes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  year INT NOT NULL,
  month INT NOT NULL CHECK (month BETWEEN 1 AND 12),
  closed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (owner_user_id, year, month)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.month_closes TO authenticated;
GRANT ALL ON public.month_closes TO service_role;

ALTER TABLE public.month_closes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners manage their month closes"
  ON public.month_closes FOR ALL
  USING (auth.uid() = owner_user_id)
  WITH CHECK (auth.uid() = owner_user_id);

CREATE TRIGGER update_month_closes_updated_at
  BEFORE UPDATE ON public.month_closes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
