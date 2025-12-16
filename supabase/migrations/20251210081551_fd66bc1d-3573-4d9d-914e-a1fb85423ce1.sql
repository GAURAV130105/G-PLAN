
-- Create study_goals table
CREATE TABLE public.study_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  daily_goal_minutes INTEGER NOT NULL DEFAULT 60,
  weekly_goal_minutes INTEGER NOT NULL DEFAULT 300,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_study_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.study_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own study goals" ON public.study_goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own study goals" ON public.study_goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own study goals" ON public.study_goals FOR UPDATE USING (auth.uid() = user_id);

CREATE TRIGGER update_study_goals_updated_at BEFORE UPDATE ON public.study_goals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
