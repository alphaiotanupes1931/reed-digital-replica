
-- Create daily_notes table
CREATE TABLE public.daily_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  note_type TEXT NOT NULL DEFAULT 'note',
  note_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.daily_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read daily_notes" ON public.daily_notes FOR SELECT TO public USING (true);
CREATE POLICY "Only service role can insert daily_notes" ON public.daily_notes FOR INSERT TO service_role WITH CHECK (true);
CREATE POLICY "Only service role can update daily_notes" ON public.daily_notes FOR UPDATE TO service_role USING (true);
CREATE POLICY "Only service role can delete daily_notes" ON public.daily_notes FOR DELETE TO service_role USING (true);

-- Create goals table
CREATE TABLE public.goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read goals" ON public.goals FOR SELECT TO public USING (true);
CREATE POLICY "Only service role can insert goals" ON public.goals FOR INSERT TO service_role WITH CHECK (true);
CREATE POLICY "Only service role can update goals" ON public.goals FOR UPDATE TO service_role USING (true);
CREATE POLICY "Only service role can delete goals" ON public.goals FOR DELETE TO service_role USING (true);
