-- Add notes column to mood_entries table
ALTER TABLE public.mood_entries 
ADD COLUMN notes TEXT;