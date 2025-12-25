# Quick Fix: Create Goals Table

If you're seeing the error: **"Could not find the table 'public.goals' in the schema cache"**

This means you need to run the migration to create the `goals` table in your Supabase database.

## Quick Solution (2 minutes)

### Step 1: Open Supabase SQL Editor

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**

### Step 2: Copy and Paste This SQL

Copy the entire SQL script below and paste it into the SQL Editor:

```sql
-- Create function to update timestamps (if it doesn't exist)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create goals table for general goal setting
CREATE TABLE IF NOT EXISTS public.goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  target_value NUMERIC NOT NULL,
  current_value NUMERIC NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT 'points',
  target_date DATE,
  category TEXT NOT NULL DEFAULT 'general',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  milestones JSONB DEFAULT '[]'::jsonb,
  completed_milestones JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own goals" ON public.goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own goals" ON public.goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own goals" ON public.goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own goals" ON public.goals FOR DELETE USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_goals_updated_at
BEFORE UPDATE ON public.goals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
```

### Step 3: Run the SQL

1. Click the **Run** button (or press `Ctrl+Enter` / `Cmd+Enter`)
2. Wait for the success message
3. Refresh your application in the browser

## ✅ Done!

The `goals` table is now created in your database. You should be able to:
- Create goals
- View goals
- Update goals
- Delete goals

The error should be gone! 🎉

## Verify It Worked

After running the SQL, you can verify by:

1. In Supabase Dashboard, go to **Table Editor**
2. You should see a `goals` table in the list
3. Try creating a goal in your app - it should work now!

## Still Having Issues?

If you still see errors:

1. **Refresh your browser** - Clear cache and hard refresh (Ctrl+Shift+R)
2. **Restart dev server** - Stop and restart `npm run dev`
3. **Check for errors** - Look at the Supabase SQL Editor for any error messages
4. **Verify RLS is enabled** - Make sure Row Level Security is enabled (the SQL above does this)

