ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS subscribed boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS stripe_customer_id text;