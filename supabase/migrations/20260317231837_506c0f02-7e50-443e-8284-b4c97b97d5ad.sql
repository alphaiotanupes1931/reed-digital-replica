
-- Create invoice status enum
CREATE TYPE public.invoice_status AS ENUM ('draft', 'approved', 'sent', 'paid');

-- Create clients table
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create invoices table
CREATE TABLE public.invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  service TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  due_date DATE NOT NULL,
  status public.invoice_status NOT NULL DEFAULT 'draft',
  stripe_payment_intent_id TEXT,
  stripe_checkout_session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Public read policies (customers access via email validation, no auth)
CREATE POLICY "Anyone can read clients by email" ON public.clients
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read approved/sent/paid invoices" ON public.invoices
  FOR SELECT USING (status IN ('approved', 'sent', 'paid'));

-- Insert/update policies for service role (admin operations via edge functions)
CREATE POLICY "Service role can insert clients" ON public.clients
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can update clients" ON public.clients
  FOR UPDATE USING (true);

CREATE POLICY "Service role can insert invoices" ON public.invoices
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can update invoices" ON public.invoices
  FOR UPDATE USING (true);

CREATE POLICY "Service role can delete invoices" ON public.invoices
  FOR DELETE USING (true);

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
