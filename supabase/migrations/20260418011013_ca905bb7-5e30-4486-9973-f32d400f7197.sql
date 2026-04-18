ALTER TABLE public.clients
  ADD COLUMN IF NOT EXISTS project_type text,
  ADD COLUMN IF NOT EXISTS project_build_cost text,
  ADD COLUMN IF NOT EXISTS project_maintenance_cost text,
  ADD COLUMN IF NOT EXISTS project_estimated_total text;