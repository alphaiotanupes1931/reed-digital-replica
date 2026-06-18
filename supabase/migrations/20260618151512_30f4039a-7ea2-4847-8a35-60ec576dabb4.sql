-- Add recovery fields to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS birthdate date,
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS security_question_1 text,
  ADD COLUMN IF NOT EXISTS security_answer_1_hash text,
  ADD COLUMN IF NOT EXISTS security_question_2 text,
  ADD COLUMN IF NOT EXISTS security_answer_2_hash text,
  ADD COLUMN IF NOT EXISTS recovery_setup_complete boolean NOT NULL DEFAULT false;