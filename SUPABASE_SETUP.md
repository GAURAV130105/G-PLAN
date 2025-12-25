# Supabase Setup Guide

This project uses Supabase as the backend database and authentication service. Follow these steps to connect your project to Supabase.

## ✅ Supabase is Already Integrated!

The project already has Supabase integrated with:
- ✅ Supabase client configured (`src/integrations/supabase/client.ts`)
- ✅ TypeScript types generated (`src/integrations/supabase/types.ts`)
- ✅ All hooks using Supabase (authentication, data fetching, etc.)
- ✅ Database migrations ready (`supabase/migrations/`)

You just need to:
1. Create a Supabase project (or use existing)
2. Run the database migrations
3. Configure environment variables

---

## Step 1: Create/Get Supabase Project

### Option A: Create New Project

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Click **New Project**
3. Fill in details:
   - **Name**: `g-plan` (or your preferred name)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
4. Wait 2-3 minutes for project creation

### Option B: Use Existing Project

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your existing project

---

## Step 2: Get Your Supabase Credentials

1. In your Supabase project, go to **Settings** → **API**
2. Copy these values:

   - **Project URL** 
     - Found under "Project URL" section
     - Format: `https://xxxxx.supabase.co`
   
   - **anon public key**
     - Found under "Project API keys" → "anon public"
     - This is safe to use in client-side code

---

## Step 3: Create Environment File

1. In the project root (`GS-PLAN/excel-task-forge-main/`), create a `.env` file
2. Copy the content from `.env.example`:

```bash
# Copy the example file
cp .env.example .env
```

Or manually create `.env` with:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-public-key-here
```

3. Replace the placeholder values with your actual Supabase credentials

**Example:**
```env
VITE_SUPABASE_URL=https://csluwvmdbaehjwjztrxz.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzbHV3dm1kYmFlaGp3anp0cnh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk...
```

---

## Step 4: Run Database Migrations

You need to create all the database tables. Choose one method:

### Method A: Via Supabase Dashboard (Recommended for Beginners)

1. Go to your Supabase Dashboard → **SQL Editor**
2. Click **New Query**
3. For each migration file in `supabase/migrations/`, in order:
   - Open the file
   - Copy the entire SQL code
   - Paste into SQL Editor
   - Click **Run**
   - Wait for success message

**Migration files to run (in order):**
1. `20251210081013_cae1e0ed-8574-4b1e-b2b2-b15f50ae613b.sql` (base tables + function)
2. `20251210081551_fd66bc1d-3573-4d9d-914e-a1fb85423ce1.sql` (study_goals)
3. `20251211095754_d1edfd01-6185-4ea9-9225-72c0bfe8bfa3.sql` (mood_entries)
4. `20251211100056_3646b2b4-46fd-4d8d-a088-60d5f03b6c3c.sql` (updates)
5. `20251211101536_5aeffed0-745f-498b-8230-79f6d544aabb.sql` (habit_completions status)
6. `20251211101602_8593eb15-9615-44ac-8d7e-af4fcdd2d43c.sql` (updates)
7. `20251212135203_fcbfedd2-025b-45e6-b2ba-30c09f6b46dd.sql` (budgets)
8. `20251216112448_409dba55-45db-4bfd-98c0-e5abb0fe1158.sql` (avatars storage)
9. `20251217000000_goals_system.sql` (goals table) ⭐ **NEW**

### Method B: Via Supabase CLI (Advanced)

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Link your project:
   ```bash
   cd GS-PLAN/excel-task-forge-main
   supabase link --project-ref your-project-ref
   ```
   (Find your project ref in your Supabase dashboard URL)

3. Push migrations:
   ```bash
   supabase db push
   ```

---

## Step 5: Verify Connection

1. **Restart your dev server** (if running):
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

2. **Test in the app**:
   - Open `http://localhost:5173` (or your dev server URL)
   - Try to sign up / sign in
   - If successful, Supabase is connected! ✅

3. **Check Supabase Dashboard**:
   - Go to **Table Editor**
   - You should see tables: `profiles`, `assignments`, `habits`, `expenses`, `goals`, etc.

---

## 🎉 You're Connected!

Your project is now connected to Supabase. You can:

- ✅ Sign up and sign in users
- ✅ Store and retrieve data
- ✅ Use all features (assignments, habits, expenses, goals, etc.)

---

## Troubleshooting

### "Failed to fetch" or Connection Errors

- **Check `.env` file exists** in project root
- **Verify credentials** are correct (no extra spaces)
- **Restart dev server** after creating/updating `.env`
- **Check Supabase project** is active (not paused)

### "Table does not exist" Errors

- **Run migrations** - All tables need to be created
- **Check migration order** - Run them in chronological order
- **Verify in Table Editor** - Check if tables exist in Supabase

### Authentication Issues

- **Check RLS policies** - Row Level Security must be enabled
- **Verify policies exist** - All tables should have SELECT, INSERT, UPDATE, DELETE policies
- **Check user is logged in** - Use browser dev tools to check auth state

### Environment Variables Not Working

- **File must be named `.env`** (not `.env.local` or `.env.development`)
- **Variables must start with `VITE_`** (required for Vite)
- **Restart dev server** after changes
- **Check for typos** in variable names

---

## Project Structure

```
GS-PLAN/excel-task-forge-main/
├── .env                          # Your credentials (not in git)
├── .env.example                  # Template file (in git)
├── src/
│   ├── integrations/
│   │   └── supabase/
│   │       ├── client.ts         # Supabase client setup
│   │       └── types.ts          # Database TypeScript types
│   └── hooks/
│       ├── useAuth.ts            # Authentication
│       ├── useExpenses.ts        # Expenses data
│       ├── useHabits.ts          # Habits data
│       ├── useGoals.ts           # Goals data
│       └── ...                   # Other hooks
└── supabase/
    └── migrations/               # Database schema migrations
```

---

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Dashboard](https://app.supabase.com/)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)

---

## Security Notes

- ✅ The `anon` key is safe to use in client-side code
- ✅ Row Level Security (RLS) is enabled on all tables
- ✅ Each user can only access their own data
- ❌ Never commit `.env` file to git (already in .gitignore)
- ❌ Never use the `service_role` key in client-side code

---

**Need Help?** Check the main [SETUP.md](./SETUP.md) file for more detailed setup instructions.

