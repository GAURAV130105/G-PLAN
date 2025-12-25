import { useEffect, useRef, createElement } from 'react';
import { toast } from '@/components/ui/sonner';
import { format } from 'date-fns';
import { AlertTriangle, TrendingUp, CheckCircle2 } from 'lucide-react';

interface NotificationState {
  budget80WarningShown: { monthly: boolean; weekly: boolean };
  budget100WarningShown: { monthly: boolean; weekly: boolean };
  habitReminderShown: boolean;
}

export function useNotifications(
  monthlyTotal: number,
  monthlyBudget: number | null,
  weeklyTotal: number,
  weeklyBudget: number | null,
  habits: Array<{ completedDates: string[] }>,
  enabled: boolean = true
) {
  const notificationStateRef = useRef<NotificationState>({
    budget80WarningShown: { monthly: false, weekly: false },
    budget100WarningShown: { monthly: false, weekly: false },
    habitReminderShown: false,
  });

  useEffect(() => {
    if (!enabled) return;

    const today = format(new Date(), 'yyyy-MM-dd');
    const state = notificationStateRef.current;

    // Check budget warnings (80% threshold)
    if (monthlyBudget && monthlyBudget > 0) {
      const monthlyProgress = (monthlyTotal / monthlyBudget) * 100;
      
      if (monthlyProgress >= 80 && monthlyProgress < 100 && !state.budget80WarningShown.monthly) {
        const remaining = monthlyBudget - monthlyTotal;
        toast.warning('Budget Alert - Monthly', {
          description: `You've used ${monthlyProgress.toFixed(0)}% of your monthly budget. $${remaining.toFixed(2)} remaining.`,
          duration: 6000,
          icon: createElement(AlertTriangle, { className: "h-5 w-5" }),
        });
        state.budget80WarningShown.monthly = true;
      }

      if (monthlyProgress >= 100 && !state.budget100WarningShown.monthly) {
        const overBudget = monthlyTotal - monthlyBudget;
        toast.error('Budget Exceeded - Monthly', {
          description: `You've exceeded your monthly budget by $${overBudget.toFixed(2)}.`,
          duration: 8000,
          icon: createElement(TrendingUp, { className: "h-5 w-5" }),
        });
        state.budget100WarningShown.monthly = true;
      }

      // Reset if below 80%
      if (monthlyProgress < 80) {
        state.budget80WarningShown.monthly = false;
        state.budget100WarningShown.monthly = false;
      }
    }

    if (weeklyBudget && weeklyBudget > 0) {
      const weeklyProgress = (weeklyTotal / weeklyBudget) * 100;
      
      if (weeklyProgress >= 80 && weeklyProgress < 100 && !state.budget80WarningShown.weekly) {
        const remaining = weeklyBudget - weeklyTotal;
        toast.warning('Budget Alert - Weekly', {
          description: `You've used ${weeklyProgress.toFixed(0)}% of your weekly budget. $${remaining.toFixed(2)} remaining.`,
          duration: 6000,
          icon: createElement(AlertTriangle, { className: "h-5 w-5" }),
        });
        state.budget80WarningShown.weekly = true;
      }

      if (weeklyProgress >= 100 && !state.budget100WarningShown.weekly) {
        const overBudget = weeklyTotal - weeklyBudget;
        toast.error('Budget Exceeded - Weekly', {
          description: `You've exceeded your weekly budget by $${overBudget.toFixed(2)}.`,
          duration: 8000,
          icon: createElement(TrendingUp, { className: "h-5 w-5" }),
        });
        state.budget100WarningShown.weekly = true;
      }

      // Reset if below 80%
      if (weeklyProgress < 80) {
        state.budget80WarningShown.weekly = false;
        state.budget100WarningShown.weekly = false;
      }
    }

    // Check habit reminders (if it's evening and habits aren't completed)
    const currentHour = new Date().getHours();
    const isEvening = currentHour >= 18; // After 6 PM
    
    if (isEvening && habits.length > 0 && !state.habitReminderShown) {
      const incompleteHabits = habits.filter(
        (habit) => !habit.completedDates.includes(today)
      );
      
      if (incompleteHabits.length > 0) {
        toast.info('Habit Reminder', {
          description: `You have ${incompleteHabits.length} habit${incompleteHabits.length > 1 ? 's' : ''} not completed today. Don't break your streak!`,
          duration: 8000,
          icon: createElement(CheckCircle2, { className: "h-5 w-5" }),
        });
        state.habitReminderShown = true;
      }
    }

  }, [
    monthlyTotal,
    monthlyBudget,
    weeklyTotal,
    weeklyBudget,
    habits,
    enabled,
  ]);

  // Reset notifications at the start of a new day
  useEffect(() => {
    const checkDayChange = () => {
      const today = format(new Date(), 'yyyy-MM-dd');
      const lastCheck = localStorage.getItem('notification_last_check');
      
      if (lastCheck !== today) {
        notificationStateRef.current.habitReminderShown = false;
        notificationStateRef.current.budget80WarningShown = { monthly: false, weekly: false };
        notificationStateRef.current.budget100WarningShown = { monthly: false, weekly: false };
        localStorage.setItem('notification_last_check', today);
      }
    };

    checkDayChange();
    const interval = setInterval(checkDayChange, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);
}

