
ALTER TABLE public.clients
  ADD COLUMN IF NOT EXISTS sow_status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS sow_comments jsonb NOT NULL DEFAULT '[]'::jsonb;
