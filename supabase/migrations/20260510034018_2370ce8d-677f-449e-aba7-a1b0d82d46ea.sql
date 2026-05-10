CREATE TABLE public.extra_income (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.extra_income ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read extra_income" ON public.extra_income FOR SELECT USING (true);
CREATE POLICY "Only service role can insert extra_income" ON public.extra_income FOR INSERT TO service_role WITH CHECK (true);
CREATE POLICY "Only service role can update extra_income" ON public.extra_income FOR UPDATE TO service_role USING (true);
CREATE POLICY "Only service role can delete extra_income" ON public.extra_income FOR DELETE TO service_role USING (true);
CREATE TRIGGER update_extra_income_updated_at BEFORE UPDATE ON public.extra_income FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();