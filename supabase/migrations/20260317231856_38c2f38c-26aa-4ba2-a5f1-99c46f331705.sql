
-- Drop overly permissive write policies
DROP POLICY "Service role can insert clients" ON public.clients;
DROP POLICY "Service role can update clients" ON public.clients;
DROP POLICY "Service role can insert invoices" ON public.invoices;
DROP POLICY "Service role can update invoices" ON public.invoices;
DROP POLICY "Service role can delete invoices" ON public.invoices;

-- Recreate with service_role restriction (only edge functions with service role can write)
CREATE POLICY "Only service role can insert clients" ON public.clients
  FOR INSERT TO service_role WITH CHECK (true);

CREATE POLICY "Only service role can update clients" ON public.clients
  FOR UPDATE TO service_role USING (true);

CREATE POLICY "Only service role can insert invoices" ON public.invoices
  FOR INSERT TO service_role WITH CHECK (true);

CREATE POLICY "Only service role can update invoices" ON public.invoices
  FOR UPDATE TO service_role USING (true);

CREATE POLICY "Only service role can delete invoices" ON public.invoices
  FOR DELETE TO service_role USING (true);
