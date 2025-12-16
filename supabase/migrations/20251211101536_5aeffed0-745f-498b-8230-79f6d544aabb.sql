-- Add status column to habit_completions to track completed vs missed
ALTER TABLE public.habit_completions 
ADD COLUMN status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'missed'));