-- Add UPDATE policy for habit_completions
CREATE POLICY "Users can update their own habit completions"
ON public.habit_completions
FOR UPDATE
USING (auth.uid() = user_id);