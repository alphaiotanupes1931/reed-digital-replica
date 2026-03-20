
-- Add deliverables column (JSONB array of links) to invoices
ALTER TABLE public.invoices ADD COLUMN deliverables jsonb DEFAULT '[]'::jsonb;
