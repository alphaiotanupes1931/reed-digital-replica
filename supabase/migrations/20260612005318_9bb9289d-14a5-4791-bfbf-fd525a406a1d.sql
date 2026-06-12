
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS referral_source TEXT;

UPDATE public.daily_notes SET owner_user_id = '1f979745-5786-4ad2-9dbc-00706e0921f0' WHERE owner_user_id IS NULL;
UPDATE public.goals SET owner_user_id = '1f979745-5786-4ad2-9dbc-00706e0921f0' WHERE owner_user_id IS NULL;
UPDATE public.monthly_bills SET owner_user_id = '1f979745-5786-4ad2-9dbc-00706e0921f0' WHERE owner_user_id IS NULL;
UPDATE public.extra_income SET owner_user_id = '1f979745-5786-4ad2-9dbc-00706e0921f0' WHERE owner_user_id IS NULL;
UPDATE public.tax_reminders SET owner_user_id = '1f979745-5786-4ad2-9dbc-00706e0921f0' WHERE owner_user_id IS NULL;

UPDATE public.profiles SET onboarded = true WHERE user_id = '1f979745-5786-4ad2-9dbc-00706e0921f0';
