ALTER TABLE public.monthly_bills
  ADD COLUMN IF NOT EXISTS makes_money boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS saves_money boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS saves_time boolean NOT NULL DEFAULT false;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.monthly_bills TO service_role;