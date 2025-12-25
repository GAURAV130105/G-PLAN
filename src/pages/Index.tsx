import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutGrid, LogOut, Sparkles, Moon, Sun, User } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/hooks/useAuth';
import { useAssignments } from '@/hooks/useAssignments';
import { useHabits } from '@/hooks/useHabits';
import { useExpenses } from '@/hooks/useExpenses';
import { useStudySessions } from '@/hooks/useStudySessions';
import { useStudyGoals } from '@/hooks/useStudyGoals';
import { useMoodEntries } from '@/hooks/useMoodEntries';
import { useBudgets, useExpenseStats } from '@/hooks/useBudgets';
<<<<<<< HEAD
import { useNotifications } from '@/hooks/useNotifications';
import { useGoals } from '@/hooks/useGoals';
=======
>>>>>>> 8544b10b557da09312c447cd91d7dfdadad3590e
import { StatsCards } from '@/components/dashboard/StatsCards';
import { AssignmentTable } from '@/components/dashboard/AssignmentTable';
import { HabitTracker } from '@/components/dashboard/HabitTracker';
import { ProgressChart } from '@/components/dashboard/ProgressChart';
import { AddAssignmentDialog } from '@/components/dashboard/AddAssignmentDialog';
import { ExpenseTracker } from '@/components/dashboard/ExpenseTracker';
import { StudyTracker } from '@/components/dashboard/StudyTracker';
import { AssignmentPieChart } from '@/components/dashboard/AssignmentPieChart';
import { MoodTracker } from '@/components/dashboard/MoodTracker';
import { MoodAnalytics } from '@/components/dashboard/MoodAnalytics';
import { CalendarHistoryView } from '@/components/dashboard/CalendarHistoryView';
<<<<<<< HEAD
import { GoalsTracker } from '@/components/dashboard/GoalsTracker';
=======
>>>>>>> 8544b10b557da09312c447cd91d7dfdadad3590e
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  const { assignments, addAssignment, updateAssignment, deleteAssignment, getStats, loading: assignmentsLoading } = useAssignments();
  const { habits, addHabit, setHabitStatus, deleteHabit, getWeeklyStats, getTodayProgress, loading: habitsLoading } = useHabits();
  const { expenses, addExpense, deleteExpense, getTotalByCategory, getMonthlyTotal, loading: expensesLoading } = useExpenses();
  const { sessions, addSession, deleteSession, getTodayTotal, getWeeklyStats: getStudyWeeklyStats, getSubjectBreakdown, loading: sessionsLoading } = useStudySessions();
<<<<<<< HEAD
  const { goals: studyGoals, updateGoals, updateStreak, loading: goalsLoading } = useStudyGoals();
  const { setMood, getMoodForDate, getNotesForDate, getWeeklyAverage, getMonthlyAverage, getLast30DaysStats, loading: moodLoading } = useMoodEntries();
  const { budget, updateBudget, loading: budgetLoading } = useBudgets();
  const { getWeeklyTotal } = useExpenseStats(expenses);
  const { goals, addGoal, updateGoal, deleteGoal, loading: customGoalsLoading } = useGoals();

  // Enable notifications
  useNotifications(
    getMonthlyTotal(),
    budget?.monthlyBudget || null,
    getWeeklyTotal(),
    budget?.weeklyBudget || null,
    habits,
    true
  );
=======
  const { goals, updateGoals, updateStreak, loading: goalsLoading } = useStudyGoals();
  const { setMood, getMoodForDate, getNotesForDate, getWeeklyAverage, getMonthlyAverage, getLast30DaysStats, loading: moodLoading } = useMoodEntries();
  const { budget, updateBudget, loading: budgetLoading } = useBudgets();
  const { getWeeklyTotal } = useExpenseStats(expenses);
>>>>>>> 8544b10b557da09312c447cd91d7dfdadad3590e

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    } else {
      navigate('/auth');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent animate-pulse" />
            <div className="absolute inset-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent blur-xl opacity-50 animate-pulse" />
          </div>
          <p className="text-muted-foreground text-sm animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

<<<<<<< HEAD
  const isLoading = assignmentsLoading || habitsLoading || expensesLoading || sessionsLoading || goalsLoading || moodLoading || budgetLoading || customGoalsLoading;
=======
  const isLoading = assignmentsLoading || habitsLoading || expensesLoading || sessionsLoading || goalsLoading || moodLoading || budgetLoading;
>>>>>>> 8544b10b557da09312c447cd91d7dfdadad3590e
  const assignmentStats = getStats();
  const habitProgress = getTodayProgress();
  const weeklyStats = getWeeklyStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                  <LayoutGrid className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">G-PLAN</h1>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Work Tracker Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                <Sparkles className="w-3 h-3 text-primary" />
                <span className="text-xs text-muted-foreground">{user.email}</span>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="rounded-xl border-border/50 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all"
                title="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigate('/profile')}
                className="rounded-xl border-border/50 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all"
                title="Profile settings"
              >
                <User className="h-4 w-4" />
              </Button>
              <AddAssignmentDialog onAddAssignment={addAssignment} />
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleSignOut} 
                title="Sign out"
                className="rounded-xl border-border/50 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent animate-pulse" />
                <div className="absolute inset-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent blur-xl opacity-50 animate-pulse" />
              </div>
              <p className="text-muted-foreground text-sm animate-pulse">Loading your data...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            <StatsCards assignmentStats={assignmentStats} habitProgress={habitProgress} />

            {/* Assignment Tracker */}
            <AssignmentTable
              assignments={assignments}
              onUpdateAssignment={updateAssignment}
              onDeleteAssignment={deleteAssignment}
            />

            {/* Charts Row: Assignment Pie + Progress Bar */}
            <div className="grid lg:grid-cols-2 gap-6">
              <AssignmentPieChart stats={assignmentStats} />
              <ProgressChart weeklyStats={weeklyStats} />
            </div>

            {/* Calendar History View */}
            <CalendarHistoryView 
              expenses={expenses}
              habits={habits}
              getMoodForDate={getMoodForDate}
            />

            {/* Trackers Row: Expense + Study */}
            <div className="grid lg:grid-cols-2 gap-6">
              <ExpenseTracker
                expenses={expenses}
                onAddExpense={addExpense}
                onDeleteExpense={deleteExpense}
                categoryData={getTotalByCategory()}
                monthlyTotal={getMonthlyTotal()}
                weeklyTotal={getWeeklyTotal()}
                budget={budget}
                onUpdateBudget={updateBudget}
              />
              <StudyTracker
                sessions={sessions}
                onAddSession={addSession}
                onDeleteSession={deleteSession}
                todayTotal={getTodayTotal()}
                weeklyStats={getStudyWeeklyStats()}
                subjectBreakdown={getSubjectBreakdown()}
<<<<<<< HEAD
                goals={studyGoals}
=======
                goals={goals}
>>>>>>> 8544b10b557da09312c447cd91d7dfdadad3590e
                onUpdateGoals={updateGoals}
                onUpdateStreak={updateStreak}
              />
            </div>

            {/* Mood Tracker + Habit Tracker */}
            <div className="grid lg:grid-cols-2 gap-6">
              <MoodTracker
                getMoodForDate={getMoodForDate}
                getNotesForDate={getNotesForDate}
                onSetMood={setMood}
              />
              <HabitTracker
                habits={habits}
                onSetHabitStatus={setHabitStatus}
                onAddHabit={addHabit}
                onDeleteHabit={deleteHabit}
              />
            </div>

            {/* Mood Analytics */}
            <MoodAnalytics
              weeklyAverage={getWeeklyAverage()}
              monthlyAverage={getMonthlyAverage()}
              last30DaysStats={getLast30DaysStats()}
            />
<<<<<<< HEAD

            {/* Goals Tracker */}
            <GoalsTracker
              goals={goals}
              onAddGoal={addGoal}
              onUpdateGoal={updateGoal}
              onDeleteGoal={deleteGoal}
            />
=======
>>>>>>> 8544b10b557da09312c447cd91d7dfdadad3590e
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
