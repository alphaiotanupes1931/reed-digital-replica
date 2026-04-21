ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS payment_type text NOT NULL DEFAULT 'one_time',
  ADD COLUMN IF NOT EXISTS stripe_subscription_id text;