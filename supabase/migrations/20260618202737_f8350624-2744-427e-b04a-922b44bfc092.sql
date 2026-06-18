
ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS payment_plan TEXT NOT NULL DEFAULT 'one_time',
  ADD COLUMN IF NOT EXISTS plan_start_date DATE,
  ADD COLUMN IF NOT EXISTS plan_end_date DATE,
  ADD COLUMN IF NOT EXISTS plan_months INTEGER,
  ADD COLUMN IF NOT EXISTS plan_monthly_amount NUMERIC;
