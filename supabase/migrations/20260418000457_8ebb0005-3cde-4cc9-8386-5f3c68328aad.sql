
ALTER TABLE public.clients
  ADD COLUMN IF NOT EXISTS owner_name text,
  ADD COLUMN IF NOT EXISTS scope_of_work text,
  ADD COLUMN IF NOT EXISTS phases jsonb NOT NULL DEFAULT '[
    {"name":"Discovery","status":"pending"},
    {"name":"Design","status":"pending"},
    {"name":"Development","status":"pending"},
    {"name":"Launch","status":"pending"}
  ]'::jsonb;
