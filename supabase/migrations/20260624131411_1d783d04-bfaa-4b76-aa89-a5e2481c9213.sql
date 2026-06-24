
-- 1. tax_income_entries
CREATE TABLE public.tax_income_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_user_id UUID NOT NULL,
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  source TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  notes TEXT,
  invoice_id UUID UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tax_income_entries TO authenticated;
GRANT ALL ON public.tax_income_entries TO service_role;
ALTER TABLE public.tax_income_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owner all tax_income" ON public.tax_income_entries FOR ALL TO authenticated USING (auth.uid() = owner_user_id) WITH CHECK (auth.uid() = owner_user_id);
CREATE TRIGGER trg_tax_income_updated BEFORE UPDATE ON public.tax_income_entries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2. tax_w2_entries
CREATE TABLE public.tax_w2_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_user_id UUID NOT NULL,
  year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE)::int,
  employer TEXT NOT NULL,
  gross_wages NUMERIC NOT NULL DEFAULT 0,
  federal_withheld NUMERIC NOT NULL DEFAULT 0,
  state_withheld NUMERIC NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tax_w2_entries TO authenticated;
GRANT ALL ON public.tax_w2_entries TO service_role;
ALTER TABLE public.tax_w2_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owner all tax_w2" ON public.tax_w2_entries FOR ALL TO authenticated USING (auth.uid() = owner_user_id) WITH CHECK (auth.uid() = owner_user_id);
CREATE TRIGGER trg_tax_w2_updated BEFORE UPDATE ON public.tax_w2_entries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. tax_expenses
CREATE TABLE public.tax_expenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_user_id UUID NOT NULL,
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  category TEXT NOT NULL DEFAULT 'Other',
  description TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  receipt_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tax_expenses TO authenticated;
GRANT ALL ON public.tax_expenses TO service_role;
ALTER TABLE public.tax_expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owner all tax_expenses" ON public.tax_expenses FOR ALL TO authenticated USING (auth.uid() = owner_user_id) WITH CHECK (auth.uid() = owner_user_id);
CREATE TRIGGER trg_tax_expenses_updated BEFORE UPDATE ON public.tax_expenses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. tax_mileage_entries
CREATE TABLE public.tax_mileage_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_user_id UUID NOT NULL,
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  purpose TEXT NOT NULL,
  miles NUMERIC NOT NULL DEFAULT 0,
  gas_amount NUMERIC NOT NULL DEFAULT 0,
  vehicle TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tax_mileage_entries TO authenticated;
GRANT ALL ON public.tax_mileage_entries TO service_role;
ALTER TABLE public.tax_mileage_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owner all tax_mileage" ON public.tax_mileage_entries FOR ALL TO authenticated USING (auth.uid() = owner_user_id) WITH CHECK (auth.uid() = owner_user_id);
CREATE TRIGGER trg_tax_mileage_updated BEFORE UPDATE ON public.tax_mileage_entries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5. profile + accountant_settings additions
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_accountant_notified_at TIMESTAMPTZ;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS accountant_email TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS accountant_name TEXT;
ALTER TABLE public.accountant_settings ADD COLUMN IF NOT EXISTS show_taxes BOOLEAN NOT NULL DEFAULT true;
