CREATE TABLE public.monthly_bills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.monthly_bills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read monthly_bills"
ON public.monthly_bills FOR SELECT
USING (true);

CREATE POLICY "Only service role can insert monthly_bills"
ON public.monthly_bills FOR INSERT
TO service_role
WITH CHECK (true);

CREATE POLICY "Only service role can update monthly_bills"
ON public.monthly_bills FOR UPDATE
TO service_role
USING (true);

CREATE POLICY "Only service role can delete monthly_bills"
ON public.monthly_bills FOR DELETE
TO service_role
USING (true);

CREATE TRIGGER update_monthly_bills_updated_at
BEFORE UPDATE ON public.monthly_bills
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();