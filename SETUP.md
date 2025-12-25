# Setup Guide - G-PLAN

This guide will help you set up and run the G-PLAN project locally.

## Prerequisites

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager (comes with Node.js)
- **Supabase Account** - [Sign up here](https://supabase.com/)
- **Git** (optional, if cloning from repository)

## Step-by-Step Setup

### 1. Install Dependencies

Navigate to the project directory and install all required packages:

```bash
cd GS-PLAN/excel-task-forge-main
npm install
```

or if you're using yarn:

```bash
yarn install
```

### 2. Set Up Supabase

#### Option A: Using Existing Supabase Project

If you already have a Supabase project:

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Go to **Settings** → **API**
4. Copy the following:
   - **Project URL** (found under "Project URL")
   - **anon/public key** (found under "Project API keys" → "anon public")

#### Option B: Create New Supabase Project

1. Go to [Supabase](https://supabase.com/) and sign in
2. Click **New Project**
3. Fill in your project details:
   - Name: `g-plan` (or any name you prefer)
   - Database Password: (create a strong password)
   - Region: (choose closest to you)
4. Wait for the project to be created (2-3 minutes)
5. Once created, go to **Settings** → **API**
6. Copy the **Project URL** and **anon/public key**

### 3. Run Database Migrations

You need to run the database migrations to create all required tables. You have two options:

#### Option A: Using Supabase CLI (Recommended)

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Link your project:
   ```bash
   supabase link --project-ref your-project-ref
   ```
   (You can find your project ref in your Supabase dashboard URL)

3. Run migrations:
   ```bash
   supabase db push
   ```

#### Option B: Manual Migration via Supabase Dashboard

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Open each migration file from `supabase/migrations/` in order:
   - `20251210081013_cae1e0ed-8574-4b1e-b2b2-b15f50ae613b.sql`
   - `20251210081551_fd66bc1d-3573-4d9d-914e-a1fb85423ce1.sql`
   - `20251211095754_d1edfd01-6185-4ea9-9225-72c0bfe8bfa3.sql`
   - `20251211100056_3646b2b4-46fd-4d8d-a088-60d5f03b6c3c.sql`
   - `20251211101536_5aeffed0-745f-498b-8230-79f6d544aabb.sql`
   - `20251211101602_8593eb15-9615-44ac-8d7e-af4fcdd2d43c.sql`
   - `20251212135203_fcbfedd2-025b-45e6-b2ba-30c09f6b46dd.sql`
   - `20251216112448_409dba55-45db-4bfd-98c0-e5abb0fe1158.sql`
   - `20251217000000_goals_system.sql` (NEW - for goals feature)
4. Copy and paste the SQL code into the SQL Editor
5. Click **Run** to execute each migration

### 4. Create Environment Variables File

Create a `.env` file in the root directory (`GS-PLAN/excel-task-forge-main/.env`):

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-public-key-here
```

Replace:
- `your-project-ref` with your actual Supabase project reference ID
- `your-anon-public-key-here` with your actual anon/public key from Supabase

**Example:**
```env
VITE_SUPABASE_URL=https://csluwvmdbaehjwjztrxz.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzbHV3dm1kYmFlaGp3anp0cnh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk...
```

### 5. Start the Development Server

Run the development server:

```bash
npm run dev
```

or with yarn:

```bash
yarn dev
```

The server will start and you should see output like:

```
  VITE v7.3.0  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### 6. Open in Browser

Open your browser and navigate to:
```
http://localhost:5173
```

(Note: The port may vary if 5173 is already in use)

## 🎉 You're All Set!

The application should now be running. You can:

1. **Sign Up** - Create a new account with email and password
2. **Sign In** - Login with your credentials
3. **Start Using** - Begin tracking your assignments, expenses, habits, and more!

## Available Scripts

```bash
# Development
npm run dev          # Start development server (with hot reload)
npm run build        # Build for production
npm run preview      # Preview production build locally

# Code Quality
npm run lint         # Run ESLint to check for code issues
```

## Troubleshooting

### Port Already in Use

If port 5173 is already in use, Vite will automatically try the next available port. Check the terminal output for the actual port number.

### Environment Variables Not Working

- Make sure the `.env` file is in the root directory (same level as `package.json`)
- Restart the development server after creating/modifying `.env`
- Check that variable names start with `VITE_` (required for Vite)

### Database Connection Issues

- Verify your Supabase URL and key are correct in `.env`
- Check that all migrations have been run successfully
- Ensure your Supabase project is active (not paused)
- Check Supabase dashboard for any errors or issues

### Module Not Found Errors

- Delete `node_modules` folder and `package-lock.json`
- Run `npm install` again
- If issues persist, try clearing npm cache: `npm cache clean --force`

### TypeScript Errors

- Run `npm run build` to see detailed TypeScript errors
- Make sure all types are properly imported
- Check that database types match your Supabase schema

### Migration Errors

If you get errors running migrations:
- Make sure you're running them in the correct order
- Check that previous migrations completed successfully
- Some migrations depend on functions created in earlier migrations (like `update_updated_at_column()`)

## New Features Setup

The project now includes these new features that require the database migration:

1. **Goals System** - Requires `20251217000000_goals_system.sql` migration
2. **Notifications** - Works automatically once database is set up
3. **CSV Export** - Works automatically, no additional setup needed
4. **Enhanced Animations** - Works automatically, no additional setup needed

Make sure to run all migrations including the new `goals_system.sql` migration for full functionality.

## Next Steps

- Explore the dashboard and all features
- Set up your budget goals
- Create some habits to track
- Add assignments and start tracking your productivity!

Happy tracking! 🚀

