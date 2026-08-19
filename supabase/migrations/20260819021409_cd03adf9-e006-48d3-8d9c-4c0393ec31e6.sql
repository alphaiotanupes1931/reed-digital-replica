ALTER TABLE public.monthly_bills ADD COLUMN need boolean NOT NULL DEFAULT false;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.monthly_bills TO authenticated;
GRANT ALL ON public.monthly_bills TO service_role;