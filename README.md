<<<<<<< HEAD
# G-PLAN - Productivity & Life Tracker Dashboard

<div align="center">

![G-PLAN](https://img.shields.io/badge/G--PLAN-Productivity%20Tracker-22c55e?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3-61dafb?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ecf8e?style=for-the-badge&logo=supabase)

A modern, comprehensive productivity application for tracking assignments, expenses, habits, goals, study sessions, and personal well-being. Built with React, TypeScript, Vite, and Supabase.

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Tech Stack](#️-tech-stack)

</div>

---
=======
# G-PLAN - Work Tracker Dashboard

A modern, comprehensive productivity application for tracking assignments, expenses, habits, study sessions, and personal well-being. Built with React, TypeScript, and Supabase.
>>>>>>> 8544b10b557da09312c447cd91d7dfdadad3590e

## ✨ Features

### 📊 Dashboard Overview
<<<<<<< HEAD
- **Real-time Statistics**: Live updates of productivity metrics with animated cards
- **Progress Visualization**: Interactive charts and graphs for performance tracking
- **Quick Actions**: Easy access to frequently used features
- **Modern Animations**: Smooth, polished UI with dynamic transitions

### ✅ Assignment Management
- **Task Creation**: Add assignments with deadlines and priorities
- **Status Tracking**: Monitor progress with completion status (not-started, in-progress, completed)
- **Priority Levels**: Organize tasks by importance (high, medium, low)
- **Due Date Management**: Never miss important deadlines
- **Visual Analytics**: Pie charts showing task distribution by status

### 💰 Expense Tracking
- **Budget Management**: Set and monitor monthly and weekly budgets
- **Category Organization**: Track expenses across 6 categories (food, transport, entertainment, education, utilities, other)
- **Spending Analytics**: Visual breakdown of spending patterns with charts
- **Budget Alerts**: Smart notifications at 80% and 100% budget usage ⚠️ **NEW**
- **CSV Export**: Download expense reports as CSV files 📥 **NEW**

### 🎯 Goal Tracking ⭐ **NEW**
- **Custom Goals**: Create goals with titles, descriptions, target values, and units
- **Progress Tracking**: Visual progress bars showing goal completion
- **Milestone System**: Automatic milestones at 25%, 50%, and 75% progress
- **Celebrations**: Toast notifications for milestone achievements 🎉
- **Categories**: Organize goals by category (general, fitness, finance, learning, habit)
- **Status Management**: Track active, completed, and paused goals

### 📈 Habit Tracking
- **Daily Routines**: Track daily habits with color-coded visualizations
- **Streak Counters**: Monitor consistency with streak tracking
- **Progress History**: View habit completion over time
- **Habit Reminders**: Evening notifications for incomplete habits ⏰ **NEW**
- **CSV Export**: Download habit data as CSV files 📥 **NEW**
=======
- **Real-time Statistics**: Live updates of productivity metrics
- **Progress Visualization**: Charts and graphs for performance tracking
- **Quick Actions**: Easy access to frequently used features

### ✅ Assignment Management
- **Task Creation**: Add assignments with deadlines and priorities
- **Status Tracking**: Monitor progress with completion status
- **Priority Levels**: Organize tasks by importance
- **Due Date Alerts**: Never miss important deadlines

### 💰 Expense Tracking
- **Budget Management**: Set and monitor monthly budgets
- **Category Organization**: Track expenses by category
- **Spending Analytics**: Visual breakdown of spending patterns
- **Financial Goals**: Set and track savings objectives

### 🎯 Habit Tracking
- **Daily Routines**: Track daily habits and routines
- **Streak Counters**: Monitor consistency with streak tracking
- **Progress History**: View habit completion over time
- **Customizable Goals**: Set personal habit targets
>>>>>>> 8544b10b557da09312c447cd91d7dfdadad3590e

### 📚 Study Session Management
- **Session Logging**: Record study time and subjects
- **Goal Setting**: Set weekly/monthly study targets
- **Subject Breakdown**: Analyze time spent per subject
<<<<<<< HEAD
- **Progress Tracking**: Monitor academic progress with streaks
- **Weekly Statistics**: View study patterns over time

### 😊 Mood & Wellness Tracking
- **Daily Mood Logging**: Track emotional well-being (1-5 scale)
- **Mood Analytics**: View mood patterns over time with charts
- **Notes & Reflections**: Add personal notes and insights
- **Wellness Insights**: Understand emotional trends and averages
- **Calendar View**: Visual calendar showing mood history

### 🔔 Smart Notifications ⚠️ **NEW**
- **Budget Warnings**: Get alerted when approaching budget limits (80% threshold)
- **Budget Alerts**: Notifications when exceeding monthly/weekly budgets
- **Habit Reminders**: Evening reminders (after 6 PM) for incomplete habits
- **Goal Achievements**: Celebrate when reaching milestones and completing goals 🎉

### 📥 Data Export 📥 **NEW**
- **Expense Reports**: Export all expenses to CSV with date, description, category, and amount
- **Habit Data**: Export habit tracking data including completion dates
- **Easy Download**: One-click CSV export functionality

### 🎨 Modern UI/UX
- **Smooth Animations**: Enhanced UI with polished transitions and hover effects ✨ **NEW**
- **Dark/Light Mode**: Automatic system preference detection with manual toggle
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Accessible**: WCAG compliant with proper ARIA labels
- **Gradient Effects**: Beautiful gradient borders and text effects

### 🔐 User Authentication
- **Secure Login**: Supabase-powered email/password authentication
- **User Profiles**: Personalized dashboard experience
- **Data Privacy**: Secure cloud-based data storage with Row Level Security (RLS)
- **Session Management**: Automatic token refresh and persistence

---
=======
- **Progress Tracking**: Monitor academic progress

### 😊 Mood & Wellness Tracking
- **Daily Mood Logging**: Track emotional well-being
- **Mood Analytics**: View mood patterns over time
- **Notes & Reflections**: Add personal notes and insights
- **Wellness Insights**: Understand emotional trends

### 🔐 User Authentication
- **Secure Login**: Supabase-powered authentication
- **User Profiles**: Personalized dashboard experience
- **Data Privacy**: Secure cloud-based data storage
>>>>>>> 8544b10b557da09312c447cd91d7dfdadad3590e

## 🚀 Quick Start

### Prerequisites
<<<<<<< HEAD
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Supabase Account** - [Sign up for free](https://supabase.com/)
=======
- Node.js (v16 or higher)
- npm or yarn package manager
>>>>>>> 8544b10b557da09312c447cd91d7dfdadad3590e

### Installation

1. **Clone and navigate to the project**:
   ```bash
   cd GS-PLAN/excel-task-forge-main
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

<<<<<<< HEAD
3. **Set up Supabase**:
   - Create a `.env` file in the root directory
   - Add your Supabase credentials (see [Supabase Setup Guide](./SUPABASE_SETUP.md)):
   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-public-key-here
   ```

4. **Run database migrations**:
   - Follow the detailed guide in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
   - Or run migrations via Supabase Dashboard SQL Editor
   - Make sure to run `20251217000000_goals_system.sql` for goals feature

5. **Start the development server**:
=======
3. **Configure environment variables**:
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=https://your_supabase_project_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```

4. **Start the development server**:
>>>>>>> 8544b10b557da09312c447cd91d7dfdadad3590e
   ```bash
   npm run dev
   ```

<<<<<<< HEAD
6. **Open your browser**:
   Navigate to `http://localhost:5173` (or the port shown in terminal)

### 📚 Detailed Setup

For comprehensive setup instructions, see:
- **[SETUP.md](./SETUP.md)** - Complete setup guide
- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Supabase configuration guide
- **[QUICK_FIX_GOALS_TABLE.md](./QUICK_FIX_GOALS_TABLE.md)** - Quick fix for goals table

---
=======
5. **Open your browser**:
   Navigate to `http://localhost:8080`
>>>>>>> 8544b10b557da09312c447cd91d7dfdadad3590e

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
<<<<<<< HEAD
- **TypeScript 5.8** - Type-safe JavaScript for better development experience
- **Vite 7** - Fast build tool and development server
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible UI components (50+ components)
- **Radix UI** - Unstyled, accessible UI primitives
=======
- **TypeScript** - Type-safe JavaScript for better development experience
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible UI components
>>>>>>> 8544b10b557da09312c447cd91d7dfdadad3590e

### Backend & Database
- **Supabase** - Open-source Firebase alternative
  - PostgreSQL database
  - Real-time subscriptions
  - Authentication
<<<<<<< HEAD
  - File storage (avatars)
  - Row Level Security (RLS)

### State Management & Data
=======
  - File storage

### State Management
>>>>>>> 8544b10b557da09312c447cd91d7dfdadad3590e
- **React Query (TanStack Query)** - Powerful data synchronization
- **React Hook Form** - Performant forms with easy validation
- **Zod** - TypeScript-first schema validation

### UI Components & Libraries
<<<<<<< HEAD
- **Lucide React** - Beautiful & consistent icon library
- **Recharts** - Composable charting library
- **Date-fns** - Modern JavaScript date utility library
- **React Router 6** - Declarative routing for React
- **Sonner** - Beautiful toast notifications
- **next-themes** - Theme management

---
=======
- **Radix UI** - Unstyled, accessible UI primitives
- **Lucide React** - Beautiful & consistent icon library
- **Recharts** - Composable charting library
- **Date-fns** - Modern JavaScript date utility library
- **React Router** - Declarative routing for React
>>>>>>> 8544b10b557da09312c447cd91d7dfdadad3590e

## 📁 Project Structure

```
GS-PLAN/excel-task-forge-main/
├── public/
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
├── src/
│   ├── components/
<<<<<<< HEAD
│   │   ├── dashboard/              # Main dashboard components
=======
│   │   ├── dashboard/          # Main dashboard components
>>>>>>> 8544b10b557da09312c447cd91d7dfdadad3590e
│   │   │   ├── AddAssignmentDialog.tsx
│   │   │   ├── AssignmentPieChart.tsx
│   │   │   ├── AssignmentTable.tsx
│   │   │   ├── CalendarHistoryView.tsx
│   │   │   ├── ExpenseTracker.tsx
<<<<<<< HEAD
│   │   │   ├── GoalsTracker.tsx        ⭐ NEW
=======
>>>>>>> 8544b10b557da09312c447cd91d7dfdadad3590e
│   │   │   ├── HabitTracker.tsx
│   │   │   ├── MoodAnalytics.tsx
│   │   │   ├── MoodTracker.tsx
│   │   │   ├── ProgressChart.tsx
│   │   │   ├── StatsCards.tsx
│   │   │   └── StudyTracker.tsx
<<<<<<< HEAD
│   │   └── ui/                     # Reusable UI components (50+)
│   ├── hooks/                      # Custom React hooks
=======
│   │   └── ui/                 # Reusable UI components (50+ components)
│   ├── hooks/                  # Custom React hooks
>>>>>>> 8544b10b557da09312c447cd91d7dfdadad3590e
│   │   ├── useAssignments.ts
│   │   ├── useAuth.ts
│   │   ├── useBudgets.ts
│   │   ├── useExpenses.ts
<<<<<<< HEAD
│   │   ├── useGoals.ts             ⭐ NEW
│   │   ├── useHabits.ts
│   │   ├── useMoodEntries.ts
│   │   ├── useNotifications.ts     ⭐ NEW
│   │   ├── useStudyGoals.ts
│   │   └── useStudySessions.ts
│   ├── integrations/
│   │   └── supabase/               # Supabase client and types
│   │       ├── client.ts
│   │       └── types.ts
│   ├── lib/
│   │   ├── csvExport.ts            ⭐ NEW
│   │   └── utils.ts
│   ├── pages/                      # Route components
│   │   ├── Auth.tsx
│   │   ├── Index.tsx
│   │   ├── NotFound.tsx
│   │   └── Profile.tsx
│   ├── types/                      # TypeScript type definitions
│   │   └── tracker.ts
│   ├── App.tsx                     # Main application component
│   ├── main.tsx                    # Application entry point
│   └── index.css                   # Global styles with animations
├── supabase/
│   ├── config.toml                 # Supabase project configuration
│   └── migrations/                 # Database schema migrations
│       ├── 20251210081013_*.sql    # Base tables
│       ├── 20251210081551_*.sql    # Study goals
│       ├── 20251211095754_*.sql    # Mood entries
│       ├── 20251211100056_*.sql    # Updates
│       ├── 20251211101536_*.sql    # Habit completions status
│       ├── 20251211101602_*.sql    # Updates
│       ├── 20251212135203_*.sql    # Budgets
│       ├── 20251216112448_*.sql    # Avatars storage
│       └── 20251217000000_*.sql    # Goals system ⭐ NEW
├── .env                            # Environment variables (not in git)
├── .env.example                    # Environment template
├── .gitignore
├── index.html                      # HTML entry point
├── package.json
├── tailwind.config.ts
├── vite.config.ts
├── tsconfig.json
└── README.md                       # This file
```

---

## 🗄️ Database Schema

The application uses Supabase PostgreSQL with the following tables:

### Core Tables
- **profiles** - User profile information (display name, email, avatar)
- **assignments** - Task and assignment tracking (title, subject, deadline, priority, status)
- **habits** - Habit definitions (name, color)
- **habit_completions** - Habit tracking data (completed dates, missed dates, status)
- **expenses** - Expense records (description, amount, category, date)
- **budgets** - Budget goals (monthly and weekly budgets by month)
- **study_sessions** - Study time logging (subject, duration, date)
- **study_goals** - Academic goal setting (daily/weekly targets, streaks)
- **mood_entries** - Mood and wellness tracking (mood score, notes, date)
- **goals** ⭐ **NEW** - General goal tracking (title, description, target value, progress, milestones)

### Security
- **Row Level Security (RLS)**: Enabled on all tables
- **Policies**: Users can only access their own data (SELECT, INSERT, UPDATE, DELETE)
- **Authentication**: Supabase Auth handles user authentication
- **Triggers**: Automatic timestamp updates on `updated_at` columns

---
=======
│   │   ├── useHabits.ts
│   │   ├── useMoodEntries.ts
│   │   ├── useStudyGoals.ts
│   │   └── useStudySessions.ts
│   ├── integrations/
│   │   └── supabase/           # Supabase client and types
│   ├── lib/
│   │   └── utils.ts            # Utility functions
│   ├── pages/                  # Route components
│   │   ├── Auth.tsx
│   │   ├── Index.tsx
│   │   └── NotFound.tsx
│   ├── types/                  # TypeScript type definitions
│   ├── App.tsx                 # Main application component
│   ├── main.tsx                # Application entry point
│   └── index.css               # Global styles
├── supabase/
│   ├── config.toml             # Supabase project configuration
│   └── migrations/             # Database schema migrations
├── package.json                # Dependencies and scripts
├── tailwind.config.ts          # Tailwind CSS configuration
├── vite.config.ts              # Vite configuration
└── README.md                   # This file
```

## 🗄️ Database Schema

The application uses Supabase with the following main tables:

### Core Tables
- **profiles** - User profile information
- **assignments** - Task and assignment tracking
- **habits** - Habit tracking data
- **expenses** - Expense and budget tracking
- **study_sessions** - Study time logging
- **study_goals** - Academic goal setting
- **mood_entries** - Mood and wellness tracking

### Relationships
- All tables are linked to user profiles via `user_id`
- Assignments include priority levels and completion status
- Expenses are categorized and linked to budgets
- Study sessions track time by subject and date
>>>>>>> 8544b10b557da09312c447cd91d7dfdadad3590e

## 🎨 UI/UX Design

### Design Principles
- **Modern & Clean**: Contemporary design with focus on usability
- **Responsive**: Optimized for desktop, tablet, and mobile devices
- **Accessible**: WCAG compliant with proper ARIA labels
- **Consistent**: Unified design system across all components

### Theme System
- **Light/Dark Mode**: Automatic system preference detection
<<<<<<< HEAD
- **Manual Toggle**: Easy theme switching via header button
- **Consistent Colors**: Carefully chosen color palette with CSS variables
- **Smooth Transitions**: Theme switching with smooth animations

### Animations & Effects ✨ **NEW**
- **Slide Animations**: Smooth card entrance animations
- **Hover Effects**: Interactive hover states with scale and glow
- **Progress Animations**: Animated progress bars
- **Loading States**: Beautiful loading spinners and skeletons
- **Toast Notifications**: Elegant notification system with Sonner

### Component Library
- **shadcn/ui**: 50+ pre-built, accessible components
- **Radix Primitives**: Unstyled, accessible UI primitives
- **Tailwind CSS**: Utility-first styling approach
- **Custom Components**: Dashboard-specific components with animations

---
=======
- **Customizable**: Easy theme switching
- **Consistent Colors**: Carefully chosen color palette

### Component Library
- **shadcn/ui**: 50+ pre-built components
- **Radix Primitives**: Accessible, unstyled UI primitives
- **Tailwind CSS**: Utility-first styling approach
>>>>>>> 8544b10b557da09312c447cd91d7dfdadad3590e

## 🔧 Development

### Available Scripts

```bash
# Development
<<<<<<< HEAD
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run preview      # Preview production build locally

# Code Quality
npm run lint         # Run ESLint to check for code issues
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-public-key-here
```

**Important**: 
- Variables must start with `VITE_` (required for Vite)
- Never commit `.env` file to git (already in .gitignore)
- Use `.env.example` as a template

### Database Migrations

Run migrations in order via Supabase SQL Editor or Supabase CLI:

```bash
# Using Supabase CLI
supabase link --project-ref your-project-ref
supabase db push
```

Or manually run each SQL file from `supabase/migrations/` in chronological order.

See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed instructions.
=======
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
```

### Environment Setup

1. **Supabase Configuration**:
   - Create a new Supabase project
   - Copy the project URL and anon key to `.env`
   - Run database migrations: `supabase db push`

2. **Development Environment**:
   - Ensure Node.js v16+ is installed
   - Install dependencies: `npm install`
   - Start development server: `npm run dev`
>>>>>>> 8544b10b557da09312c447cd91d7dfdadad3590e

### Code Quality

The project maintains high code quality standards:

- **TypeScript**: Full type safety and IntelliSense support
- **ESLint**: Code linting and formatting consistency
<<<<<<< HEAD
- **Type Safety**: Generated Supabase types for database interactions
- **Component Structure**: Well-organized, reusable components

---
=======
- **Prettier**: Automated code formatting
- **Husky**: Git hooks for quality checks
>>>>>>> 8544b10b557da09312c447cd91d7dfdadad3590e

## 🚀 Deployment

### Build for Production
<<<<<<< HEAD

=======
>>>>>>> 8544b10b557da09312c447cd91d7dfdadad3590e
```bash
npm run build
```

<<<<<<< HEAD
This creates an optimized production build in the `dist` folder.

=======
>>>>>>> 8544b10b557da09312c447cd91d7dfdadad3590e
### Deploy Options

1. **Vercel** (Recommended):
   ```bash
   npm install -g vercel
   vercel --prod
   ```
<<<<<<< HEAD
   - Automatic deployments from Git
   - Environment variables configuration in dashboard

2. **Netlify**:
   - Connect your repository
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Add environment variables in site settings

3. **Manual Deployment**:
   - Upload the `dist` folder to any static hosting service
   - Configure environment variables in hosting platform
   - Ensure HTTPS is enabled

### Environment Variables in Production

Remember to add your Supabase credentials as environment variables in your hosting platform:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

---
=======

2. **Netlify**:
   - Connect your repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`

3. **Manual Deployment**:
   - Upload the `dist` folder to any static hosting service
   - Ensure environment variables are configured
>>>>>>> 8544b10b557da09312c447cd91d7dfdadad3590e

## 🔐 Authentication & Security

### Supabase Auth Features
<<<<<<< HEAD
- **Email/Password Authentication**: Secure sign up and sign in
- **Session Management**: Automatic token refresh and persistence
- **Password Reset**: Built-in password recovery (via Supabase)
- **Social Login**: Can be enabled via Supabase dashboard (Google, GitHub, etc.)
=======
- **Email/Password Authentication**
- **Social Login** (Google, GitHub, etc.)
- **Password Reset**
- **Session Management**
- **Row Level Security (RLS)**
>>>>>>> 8544b10b557da09312c447cd91d7dfdadad3590e

### Security Best Practices
- **Environment Variables**: Sensitive data stored securely
- **HTTPS Only**: All communications encrypted
<<<<<<< HEAD
- **Row Level Security (RLS)**: Database-level security policies
- **Input Validation**: Type-safe forms with TypeScript and Zod
- **XSS Protection**: React's built-in XSS protection
- **CSRF Protection**: Supabase's built-in security

### Data Privacy
- **User Isolation**: Each user can only access their own data
- **RLS Policies**: Enforced at the database level
- **Secure Storage**: Data stored in Supabase PostgreSQL
- **No Data Sharing**: User data is never shared between accounts

---
=======
- **CSRF Protection**: Built-in Supabase security
- **Input Validation**: Zod schema validation
>>>>>>> 8544b10b557da09312c447cd91d7dfdadad3590e

## 📊 Data Management

### State Management Strategy
<<<<<<< HEAD
- **Server State**: React Query for API data synchronization
- **Local State**: React hooks (useState, useReducer) for UI state
- **Persistent State**: Supabase for long-term data storage
- **Form State**: React Hook Form for performant form handling

### Data Flow
1. **User Action** → Component event handler
2. **Hook Function** → Calls Supabase client
3. **Supabase** → Database operation (with RLS)
4. **State Update** → React state updated
5. **UI Re-render** → Component updates

### Real-time Features
- **Live Updates**: Supabase subscriptions ready for real-time features
- **Optimistic Updates**: Immediate UI feedback before server confirmation
- **Error Handling**: Comprehensive error boundaries and toast notifications

---

## 🐛 Troubleshooting

### Common Issues

#### "Could not find table 'public.goals' in schema cache"
- **Solution**: Run the goals migration (`20251217000000_goals_system.sql`)
- See [QUICK_FIX_GOALS_TABLE.md](./QUICK_FIX_GOALS_TABLE.md)

#### "Failed to fetch" or Connection Errors
- Check `.env` file exists and has correct credentials
- Verify Supabase project is active (not paused)
- Restart dev server after creating/updating `.env`

#### "Function update_updated_at_column() does not exist"
- **Solution**: The migration file includes function creation
- Make sure to run migrations in order
- First migration creates the function

#### Environment Variables Not Working
- File must be named `.env` (not `.env.local`)
- Variables must start with `VITE_`
- Restart dev server after changes
- Check for typos in variable names

#### Authentication Issues
- Verify RLS policies exist and are correct
- Check user is logged in (browser dev tools)
- Clear browser storage and try again
- Verify Supabase Auth is enabled in dashboard

#### Build Errors
- Clear node_modules: `rm -rf node_modules && npm install`
- Check TypeScript errors: Look for type mismatches
- Verify all dependencies are installed: `npm install`

---

## 📚 Documentation

### Setup Guides
- **[SETUP.md](./SETUP.md)** - Complete project setup guide
- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Detailed Supabase configuration
- **[QUICK_FIX_GOALS_TABLE.md](./QUICK_FIX_GOALS_TABLE.md)** - Quick fix for goals table

### External Resources
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Vite Documentation](https://vitejs.dev/)

### Community
- [React Discord](https://discord.gg/react)
- [Supabase Discord](https://discord.gg/supabase)

---

## 🎯 Key Features Explained

### Budget Alerts ⚠️
- Automatic notifications when spending reaches 80% of budget
- Alerts when budget is exceeded
- Separate alerts for monthly and weekly budgets
- Uses Sonner toast notifications

### Habit Reminders ⏰
- Evening reminders (after 6 PM) for incomplete habits
- Only shows once per day
- Helps maintain streaks

### Goal Milestones 🎉
- Automatic milestone detection at 25%, 50%, 75%
- Celebration notifications with icons
- Goal completion celebrations
- Progress visualization with animated progress bars

### CSV Export 📥
- Export expenses with all details (date, description, category, amount)
- Export habits with completion history
- One-click download functionality
- Formatted CSV files ready for Excel/Google Sheets

### Enhanced Animations ✨
- Smooth card entrance animations
- Hover effects with scale and glow
- Animated progress bars
- Loading states with skeletons
- Transition effects throughout UI

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Test thoroughly**
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to branch**: `git push origin feature/amazing-feature`
=======
- **Server State**: React Query for API data
- **Local State**: React hooks for UI state
- **Persistent State**: Supabase for long-term storage

### Real-time Updates
- **Supabase Subscriptions**: Live data synchronization
- **Optimistic Updates**: Immediate UI feedback
- **Error Handling**: Comprehensive error boundaries

## 🧪 Testing

### Testing Strategy
- **Unit Tests**: Component and utility function testing
- **Integration Tests**: API and database interactions
- **E2E Tests**: Full user workflow testing

### Testing Tools
- **Vitest**: Fast unit testing framework
- **React Testing Library**: Component testing utilities
- **Playwright**: End-to-end testing

## 🤝 Contributing

### Development Workflow
1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/new-feature`
3. **Make your changes**
4. **Run tests**: `npm run test`
5. **Commit your changes**: `git commit -m 'Add new feature'`
6. **Push to branch**: `git push origin feature/new-feature`
>>>>>>> 8544b10b557da09312c447cd91d7dfdadad3590e
7. **Open a Pull Request**

### Code Standards
- Follow TypeScript best practices
- Use meaningful commit messages
<<<<<<< HEAD
- Write clean, readable code
- Add comments for complex logic
- Update documentation as needed

---

## 📈 Performance

### Optimization Features
- **Code Splitting**: Automatic code splitting with Vite
- **Tree Shaking**: Unused code elimination
- **Minification**: Production builds are minified
- **CSS Optimization**: Tailwind CSS purges unused styles

### Performance Metrics
- **Fast Loading**: Optimized bundle size
- **Smooth Animations**: 60fps animations
- **Responsive**: Fast interactions and transitions
- **Efficient Re-renders**: React optimization with proper hooks usage

---
=======
- Write tests for new features
- Update documentation as needed

## 📈 Performance

### Optimization Features
- **Code Splitting**: Lazy loading of routes and components
- **Image Optimization**: Next.js-like image handling
- **Bundle Analysis**: Webpack bundle analyzer integration
- **Caching**: Intelligent caching strategies

### Performance Metrics
- **Lighthouse Score**: 90+ on all categories
- **Bundle Size**: Optimized for fast loading
- **Runtime Performance**: Smooth 60fps animations

## 🐛 Troubleshooting

### Common Issues

**Authentication Problems**:
- Check Supabase credentials in `.env`
- Verify RLS policies are correctly configured
- Clear browser storage and try again

**Build Errors**:
- Clear node_modules: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run type-check`
- Verify all dependencies are installed

**Performance Issues**:
- Enable production build optimizations
- Check network tab for large assets
- Optimize images and bundle size

## 📚 Resources

### Documentation
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Community
- [React Discord](https://discord.gg/react)
- [Supabase Discord](https://discord.gg/supabase)
>>>>>>> 8544b10b557da09312c447cd91d7dfdadad3590e

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

<<<<<<< HEAD
---

## 🙏 Acknowledgments

- **shadcn/ui** for the beautiful, accessible component library
- **Supabase** for the amazing backend-as-a-service platform
- **Radix UI** for accessible UI primitives
- **Tailwind CSS** for the utility-first CSS framework
- **Vite** for the blazing-fast build tool
- **React Team** for the excellent framework

---

<div align="center">

**Built with ❤️ for productivity and personal growth**

[⬆ Back to Top](#g-plan---productivity--life-tracker-dashboard)

</div>
=======
## 🙏 Acknowledgments

- **shadcn/ui** for the beautiful component library
- **Supabase** for the amazing backend-as-a-service platform
- **Radix UI** for accessible UI primitives
- **Tailwind CSS** for the utility-first CSS framework

---

**Built with ❤️ for productivity and personal growth**
>>>>>>> 8544b10b557da09312c447cd91d7dfdadad3590e
