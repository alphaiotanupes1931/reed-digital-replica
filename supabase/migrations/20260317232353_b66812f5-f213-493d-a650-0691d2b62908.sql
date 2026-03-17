
ALTER TABLE public.invoices
  ADD COLUMN deposit_required BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN deposit_amount NUMERIC(10,2),
  ADD COLUMN deposit_due_date DATE,
  ADD COLUMN deposit_paid BOOLEAN NOT NULL DEFAULT false;
