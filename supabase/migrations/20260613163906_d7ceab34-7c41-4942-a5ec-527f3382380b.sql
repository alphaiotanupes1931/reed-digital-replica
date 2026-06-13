
-- 1. Random short code generator (8 chars, no ambiguous 0/O/1/I)
CREATE OR REPLACE FUNCTION public.gen_business_id()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  alphabet text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  code text;
  i int;
  exists_already boolean;
BEGIN
  LOOP
    code := '';
    FOR i IN 1..8 LOOP
      code := code || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
    END LOOP;
    SELECT EXISTS(SELECT 1 FROM public.profiles WHERE business_id = code) INTO exists_already;
    EXIT WHEN NOT exists_already;
  END LOOP;
  RETURN code;
END;
$$;

-- 2. Column + unique index
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS business_id text;
CREATE UNIQUE INDEX IF NOT EXISTS profiles_business_id_key ON public.profiles(business_id) WHERE business_id IS NOT NULL;

-- 3. Backfill existing rows
UPDATE public.profiles SET business_id = public.gen_business_id() WHERE business_id IS NULL;

-- 4. Trigger to auto-assign on insert
CREATE OR REPLACE FUNCTION public.set_business_id()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.business_id IS NULL THEN
    NEW.business_id := public.gen_business_id();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_set_business_id ON public.profiles;
CREATE TRIGGER profiles_set_business_id
BEFORE INSERT ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.set_business_id();

-- 5. Public lookup RPC
CREATE OR REPLACE FUNCTION public.lookup_business_by_code(p_code text)
RETURNS TABLE(
  user_id uuid,
  business_name text,
  owner_name text,
  has_stripe boolean,
  zelle_handle text,
  cashapp_handle text,
  payment_methods text[]
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    p.user_id,
    COALESCE(p.business_name, 'Business'),
    p.full_name,
    (p.stripe_secret_key IS NOT NULL AND length(p.stripe_secret_key) > 0),
    p.zelle_handle,
    p.cashapp_handle,
    COALESCE(p.payment_methods, '{}'::text[])
  FROM public.profiles p
  WHERE upper(p.business_id) = upper(trim(p_code))
    AND p.business_name IS NOT NULL
    AND length(trim(p.business_name)) > 0
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.lookup_business_by_code(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.gen_business_id() TO authenticated, service_role;
