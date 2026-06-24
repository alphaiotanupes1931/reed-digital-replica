
-- 1. Precision flag on income entries
ALTER TABLE public.tax_income_entries
  ADD COLUMN IF NOT EXISTS date_precision text NOT NULL DEFAULT 'day';
ALTER TABLE public.tax_income_entries
  DROP CONSTRAINT IF EXISTS tax_income_entries_date_precision_chk;
ALTER TABLE public.tax_income_entries
  ADD CONSTRAINT tax_income_entries_date_precision_chk CHECK (date_precision IN ('day','month'));

-- 2. W-2 document uploads
CREATE TABLE IF NOT EXISTS public.tax_w2_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  year integer NOT NULL,
  employer text NOT NULL,
  file_path text NOT NULL,
  file_name text NOT NULL,
  mime_type text,
  size_bytes integer,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.tax_w2_documents TO authenticated;
GRANT ALL ON public.tax_w2_documents TO service_role;

ALTER TABLE public.tax_w2_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners read own w2 docs" ON public.tax_w2_documents
  FOR SELECT TO authenticated USING (auth.uid() = owner_user_id);
CREATE POLICY "Owners insert own w2 docs" ON public.tax_w2_documents
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_user_id);
CREATE POLICY "Owners update own w2 docs" ON public.tax_w2_documents
  FOR UPDATE TO authenticated USING (auth.uid() = owner_user_id) WITH CHECK (auth.uid() = owner_user_id);
CREATE POLICY "Owners delete own w2 docs" ON public.tax_w2_documents
  FOR DELETE TO authenticated USING (auth.uid() = owner_user_id);

CREATE TRIGGER tax_w2_documents_updated_at
  BEFORE UPDATE ON public.tax_w2_documents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS tax_w2_documents_owner_year_idx
  ON public.tax_w2_documents (owner_user_id, year DESC);
