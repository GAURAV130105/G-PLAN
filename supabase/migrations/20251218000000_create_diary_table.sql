-- Create the diary table
CREATE TABLE public.diary (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    note TEXT,
    photo_url TEXT,
    video_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add comments for clarity
COMMENT ON TABLE public.diary IS 'Stores diary entries for users.';

-- Enable Row Level Security
ALTER TABLE public.diary ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for the diary table
CREATE POLICY "Users can view their own diary entries" 
ON public.diary FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own diary entries" 
ON public.diary FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own diary entries" 
ON public.diary FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own diary entries" 
ON public.diary FOR DELETE
USING (auth.uid() = user_id);

-- Create a storage bucket for diary media
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('diary_media', 'diary_media', true, 52428800, ARRAY['image/*', 'video/*']);

CREATE POLICY "Users can manage their own diary media" 
ON storage.objects FOR ALL
USING (bucket_id = 'diary_media' AND owner = auth.uid())
WITH CHECK (bucket_id = 'diary_media' AND owner = auth.uid());
