
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS stripe_secret_key text,
  ADD COLUMN IF NOT EXISTS zelle_handle text,
  ADD COLUMN IF NOT EXISTS cashapp_handle text,
  ADD COLUMN IF NOT EXISTS payment_methods text[] NOT NULL DEFAULT '{}'::text[];

CREATE OR REPLACE FUNCTION public.list_businesses()
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
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    p.user_id,
    p.business_name,
    p.full_name,
    (p.stripe_secret_key IS NOT NULL AND length(p.stripe_secret_key) > 0) AS has_stripe,
    p.zelle_handle,
    p.cashapp_handle,
    COALESCE(p.payment_methods, '{}'::text[])
  FROM public.profiles p
  WHERE p.business_name IS NOT NULL
    AND length(trim(p.business_name)) > 0
  ORDER BY p.business_name;
$$;

GRANT EXECUTE ON FUNCTION public.list_businesses() TO anon, authenticated;
