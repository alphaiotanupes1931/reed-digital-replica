ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS paid_at timestamptz;

UPDATE public.invoices SET paid_at = updated_at WHERE status = 'paid' AND paid_at IS NULL;

CREATE OR REPLACE FUNCTION public.set_invoice_paid_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'paid' AND (OLD.status IS DISTINCT FROM 'paid') AND NEW.paid_at IS NULL THEN
    NEW.paid_at := now();
  ELSIF NEW.status <> 'paid' THEN
    NEW.paid_at := NULL;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_invoices_set_paid_at ON public.invoices;
CREATE TRIGGER trg_invoices_set_paid_at
BEFORE UPDATE ON public.invoices
FOR EACH ROW
EXECUTE FUNCTION public.set_invoice_paid_at();