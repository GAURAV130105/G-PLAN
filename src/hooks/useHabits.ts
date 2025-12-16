import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Habit, HabitStatus } from '@/types/tracker';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch habits and their completions
  useEffect(() => {
    if (!user) {
      setHabits([]);
      setLoading(false);
      return;
    }

    const fetchHabits = async () => {
      // Fetch habits
      const { data: habitsData, error: habitsError } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id);

      if (habitsError) {
        toast({
          title: "Error loading habits",
          description: habitsError.message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Fetch completions for all habits
      const { data: completionsData, error: completionsError } = await supabase
        .from('habit_completions')
        .select('*')
        .eq('user_id', user.id);

      if (completionsError) {
        toast({
          title: "Error loading habit completions",
          description: completionsError.message,
          variant: "destructive",
        });
      }

      const completedByHabit = new Map<string, string[]>();
      const missedByHabit = new Map<string, string[]>();
      
      completionsData?.forEach((c) => {
        const status = (c as any).status || 'completed';
        if (status === 'completed') {
          const existing = completedByHabit.get(c.habit_id) || [];
          existing.push(c.completed_date);
          completedByHabit.set(c.habit_id, existing);
        } else if (status === 'missed') {
          const existing = missedByHabit.get(c.habit_id) || [];
          existing.push(c.completed_date);
          missedByHabit.set(c.habit_id, existing);
        }
      });

      setHabits(
        habitsData.map((h) => ({
          id: h.id,
          name: h.name,
          color: h.color,
          completedDates: completedByHabit.get(h.id) || [],
          missedDates: missedByHabit.get(h.id) || [],
        }))
      );
      setLoading(false);
    };

    fetchHabits();
  }, [user, toast]);

  const addHabit = async (name: string, color: string) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('habits')
      .insert({
        user_id: user.id,
        name,
        color,
      })
      .select()
      .single();

    if (error) {
      toast({
        title: "Error adding habit",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setHabits((prev) => [
        ...prev,
        { id: data.id, name: data.name, color: data.color, completedDates: [], missedDates: [] },
      ]);
    }
  };

  const setHabitStatus = async (habitId: string, date: Date, status: HabitStatus | null) => {
    if (!user) return;

    const dateStr = format(date, 'yyyy-MM-dd');
    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return;

    const isCompleted = habit.completedDates.includes(dateStr);
    const isMissed = habit.missedDates.includes(dateStr);
    const hasEntry = isCompleted || isMissed;

    // If status is null, remove any existing entry (clear the cell)
    if (status === null) {
      if (hasEntry) {
        const { error } = await supabase
          .from('habit_completions')
          .delete()
          .eq('habit_id', habitId)
          .eq('completed_date', dateStr)
          .eq('user_id', user.id);

        if (error) {
          toast({
            title: "Error updating habit",
            description: error.message,
            variant: "destructive",
          });
        } else {
          setHabits((prev) =>
            prev.map((h) =>
              h.id === habitId
                ? {
                    ...h,
                    completedDates: h.completedDates.filter((d) => d !== dateStr),
                    missedDates: h.missedDates.filter((d) => d !== dateStr),
                  }
                : h
            )
          );
        }
      }
      return;
    }

    // If there's an existing entry, update it
    if (hasEntry) {
      const { error } = await supabase
        .from('habit_completions')
        .update({ status })
        .eq('habit_id', habitId)
        .eq('completed_date', dateStr)
        .eq('user_id', user.id);

      if (error) {
        toast({
          title: "Error updating habit",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setHabits((prev) =>
          prev.map((h) => {
            if (h.id !== habitId) return h;
            return {
              ...h,
              completedDates: status === 'completed'
                ? [...h.completedDates.filter((d) => d !== dateStr), dateStr]
                : h.completedDates.filter((d) => d !== dateStr),
              missedDates: status === 'missed'
                ? [...h.missedDates.filter((d) => d !== dateStr), dateStr]
                : h.missedDates.filter((d) => d !== dateStr),
            };
          })
        );
      }
    } else {
      // Insert new entry
      const { error } = await supabase
        .from('habit_completions')
        .insert({
          habit_id: habitId,
          user_id: user.id,
          completed_date: dateStr,
          status,
        });

      if (error) {
        toast({
          title: "Error updating habit",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setHabits((prev) =>
          prev.map((h) => {
            if (h.id !== habitId) return h;
            return {
              ...h,
              completedDates: status === 'completed'
                ? [...h.completedDates, dateStr]
                : h.completedDates,
              missedDates: status === 'missed'
                ? [...h.missedDates, dateStr]
                : h.missedDates,
            };
          })
        );
      }
    }
  };

  const deleteHabit = async (id: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      toast({
        title: "Error deleting habit",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setHabits((prev) => prev.filter((h) => h.id !== id));
    }
  };

  const getWeeklyStats = () => {
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
    const daysOfWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return daysOfWeek.map((day) => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const completed = habits.reduce(
        (acc, habit) => acc + (habit.completedDates.includes(dateStr) ? 1 : 0),
        0
      );
      return {
        day: format(day, 'EEE'),
        date: dateStr,
        completed,
        total: habits.length,
        percentage: habits.length > 0 ? Math.round((completed / habits.length) * 100) : 0,
      };
    });
  };

  const getTodayProgress = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const completed = habits.filter((h) => h.completedDates.includes(today)).length;
    return { completed, total: habits.length };
  };

  return {
    habits,
    loading,
    addHabit,
    setHabitStatus,
    deleteHabit,
    getWeeklyStats,
    getTodayProgress,
  };
}
