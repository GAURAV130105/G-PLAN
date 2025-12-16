import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

interface StudyGoals {
  dailyGoalMinutes: number;
  weeklyGoalMinutes: number;
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string | null;
}

export function useStudyGoals() {
  const [goals, setGoals] = useState<StudyGoals>({
    dailyGoalMinutes: 60,
    weeklyGoalMinutes: 300,
    currentStreak: 0,
    longestStreak: 0,
    lastStudyDate: null,
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchGoals = async () => {
      const { data, error } = await supabase
        .from('study_goals')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        toast({
          title: "Error loading study goals",
          description: error.message,
          variant: "destructive",
        });
      } else if (data) {
        setGoals({
          dailyGoalMinutes: data.daily_goal_minutes,
          weeklyGoalMinutes: data.weekly_goal_minutes,
          currentStreak: data.current_streak,
          longestStreak: data.longest_streak,
          lastStudyDate: data.last_study_date,
        });
      }
      setLoading(false);
    };

    fetchGoals();
  }, [user, toast]);

  const updateGoals = async (dailyGoal: number, weeklyGoal: number) => {
    if (!user) return;

    const { data: existing } = await supabase
      .from('study_goals')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from('study_goals')
        .update({
          daily_goal_minutes: dailyGoal,
          weekly_goal_minutes: weeklyGoal,
        })
        .eq('user_id', user.id);

      if (error) {
        toast({
          title: "Error updating goals",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setGoals((prev) => ({
          ...prev,
          dailyGoalMinutes: dailyGoal,
          weeklyGoalMinutes: weeklyGoal,
        }));
        toast({ title: "Goals updated!" });
      }
    } else {
      const { error } = await supabase
        .from('study_goals')
        .insert({
          user_id: user.id,
          daily_goal_minutes: dailyGoal,
          weekly_goal_minutes: weeklyGoal,
        });

      if (error) {
        toast({
          title: "Error creating goals",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setGoals((prev) => ({
          ...prev,
          dailyGoalMinutes: dailyGoal,
          weeklyGoalMinutes: weeklyGoal,
        }));
        toast({ title: "Goals saved!" });
      }
    }
  };

  const updateStreak = async (todayTotal: number) => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // Check if user met daily goal today
    if (todayTotal < goals.dailyGoalMinutes) return;

    let newStreak = goals.currentStreak;
    
    // If last study was yesterday, continue streak
    if (goals.lastStudyDate === yesterday) {
      newStreak = goals.currentStreak + 1;
    } 
    // If already logged today, don't update
    else if (goals.lastStudyDate === today) {
      return;
    }
    // Otherwise start new streak
    else {
      newStreak = 1;
    }

    const newLongest = Math.max(newStreak, goals.longestStreak);

    const { data: existing } = await supabase
      .from('study_goals')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from('study_goals')
        .update({
          current_streak: newStreak,
          longest_streak: newLongest,
          last_study_date: today,
        })
        .eq('user_id', user.id);

      if (!error) {
        setGoals((prev) => ({
          ...prev,
          currentStreak: newStreak,
          longestStreak: newLongest,
          lastStudyDate: today,
        }));
      }
    } else {
      const { error } = await supabase
        .from('study_goals')
        .insert({
          user_id: user.id,
          current_streak: newStreak,
          longest_streak: newLongest,
          last_study_date: today,
        });

      if (!error) {
        setGoals((prev) => ({
          ...prev,
          currentStreak: newStreak,
          longestStreak: newLongest,
          lastStudyDate: today,
        }));
      }
    }
  };

  return {
    goals,
    loading,
    updateGoals,
    updateStreak,
  };
}
