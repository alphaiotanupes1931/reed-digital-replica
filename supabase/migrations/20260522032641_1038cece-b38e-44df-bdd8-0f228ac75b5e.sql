
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS owner_user_id uuid;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS owner_user_id uuid;
ALTER TABLE public.monthly_bills ADD COLUMN IF NOT EXISTS owner_user_id uuid;
ALTER TABLE public.tax_reminders ADD COLUMN IF NOT EXISTS owner_user_id uuid;
ALTER TABLE public.extra_income ADD COLUMN IF NOT EXISTS owner_user_id uuid;
ALTER TABLE public.daily_notes ADD COLUMN IF NOT EXISTS owner_user_id uuid;
ALTER TABLE public.goals ADD COLUMN IF NOT EXISTS owner_user_id uuid;

CREATE INDEX IF NOT EXISTS idx_clients_owner ON public.clients(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_owner ON public.invoices(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_monthly_bills_owner ON public.monthly_bills(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_tax_reminders_owner ON public.tax_reminders(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_extra_income_owner ON public.extra_income(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_daily_notes_owner ON public.daily_notes(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_goals_owner ON public.goals(owner_user_id);

-- Owner CRUD policies (authenticated users manage their own rows)
DO $$
DECLARE
  t text;
BEGIN
  FOR t IN SELECT unnest(ARRAY['clients','invoices','monthly_bills','tax_reminders','extra_income','daily_notes','goals']) LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Owners can insert own %1$s" ON public.%1$I', t);
    EXECUTE format('CREATE POLICY "Owners can insert own %1$s" ON public.%1$I FOR INSERT TO authenticated WITH CHECK (owner_user_id = auth.uid())', t);

    EXECUTE format('DROP POLICY IF EXISTS "Owners can update own %1$s" ON public.%1$I', t);
    EXECUTE format('CREATE POLICY "Owners can update own %1$s" ON public.%1$I FOR UPDATE TO authenticated USING (owner_user_id = auth.uid()) WITH CHECK (owner_user_id = auth.uid())', t);

    EXECUTE format('DROP POLICY IF EXISTS "Owners can delete own %1$s" ON public.%1$I', t);
    EXECUTE format('CREATE POLICY "Owners can delete own %1$s" ON public.%1$I FOR DELETE TO authenticated USING (owner_user_id = auth.uid())', t);

    EXECUTE format('DROP POLICY IF EXISTS "Owners can select own %1$s" ON public.%1$I', t);
    EXECUTE format('CREATE POLICY "Owners can select own %1$s" ON public.%1$I FOR SELECT TO authenticated USING (owner_user_id = auth.uid())', t);
  END LOOP;
END $$;
