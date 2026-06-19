ALTER TABLE public.clients
  ADD COLUMN IF NOT EXISTS contract_text text,
  ADD COLUMN IF NOT EXISTS contract_hidden boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS contract_signed_name text,
  ADD COLUMN IF NOT EXISTS contract_signed_at timestamptz;