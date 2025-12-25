import { useState, useEffect, createElement } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { toast } from '@/components/ui/sonner';
import { Trophy, Sparkles } from 'lucide-react';

export interface Goal {
  id: string;
  title: string;
  description?: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  targetDate?: string;
  category: string;
  status: 'active' | 'completed' | 'paused';
  milestones: number[];
  completedMilestones: number[];
}

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast: hookToast } = useToast();

  useEffect(() => {
    if (!user) {
      setGoals([]);
      setLoading(false);
      return;
    }

    const fetchGoals = async () => {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        hookToast({
          title: "Error loading goals",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setGoals(
          data.map((g) => ({
            id: g.id,
            title: g.title,
            description: g.description,
            targetValue: Number(g.target_value),
            currentValue: Number(g.current_value),
            unit: g.unit,
            targetDate: g.target_date,
            category: g.category,
            status: g.status as 'active' | 'completed' | 'paused',
            milestones: (g.milestones || []) as number[],
            completedMilestones: (g.completed_milestones || []) as number[],
          }))
        );
      }
      setLoading(false);
    };

    fetchGoals();
  }, [user, hookToast]);

  const addGoal = async (goal: Omit<Goal, 'id'>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('goals')
      .insert({
        user_id: user.id,
        title: goal.title,
        description: goal.description,
        target_value: goal.targetValue,
        current_value: goal.currentValue,
        unit: goal.unit,
        target_date: goal.targetDate,
        category: goal.category,
        status: goal.status,
        milestones: goal.milestones,
        completed_milestones: goal.completedMilestones,
      })
      .select()
      .single();

    if (error) {
      hookToast({
        title: "Error adding goal",
        description: error.message,
        variant: "destructive",
      });
    } else {
      const newGoal: Goal = {
        id: data.id,
        title: data.title,
        description: data.description,
        targetValue: Number(data.target_value),
        currentValue: Number(data.current_value),
        unit: data.unit,
        targetDate: data.target_date,
        category: data.category,
        status: data.status as 'active' | 'completed' | 'paused',
        milestones: (data.milestones || []) as number[],
        completedMilestones: (data.completed_milestones || []) as number[],
      };
      setGoals((prev) => [newGoal, ...prev]);
    }
  };

  const updateGoal = async (id: string, updates: Partial<Goal>) => {
    if (!user) return;

    const { error } = await supabase
      .from('goals')
      .update({
        title: updates.title,
        description: updates.description,
        target_value: updates.targetValue,
        current_value: updates.currentValue,
        unit: updates.unit,
        target_date: updates.targetDate,
        category: updates.category,
        status: updates.status,
        milestones: updates.milestones,
        completed_milestones: updates.completedMilestones,
      })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      hookToast({
        title: "Error updating goal",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setGoals((prev) =>
        prev.map((g) => (g.id === id ? { ...g, ...updates } : g))
      );

      // Check for milestone achievements
      const goal = goals.find((g) => g.id === id);
      if (goal && updates.currentValue !== undefined) {
        const newValue = updates.currentValue;
        const progress = (newValue / goal.targetValue) * 100;

        // Check if goal is completed
        if (newValue >= goal.targetValue && goal.status !== 'completed') {
          toast.success('Goal Achieved! 🎉', {
            description: `Congratulations! You've completed "${goal.title}"!`,
            duration: 8000,
            icon: createElement(Trophy, { className: "h-5 w-5" }),
          });
        }

        // Check for milestone achievements
        goal.milestones.forEach((milestone) => {
          if (
            newValue >= milestone &&
            !goal.completedMilestones.includes(milestone)
          ) {
            const milestonePercent = (milestone / goal.targetValue) * 100;
            toast.success('Milestone Reached! ⭐', {
              description: `You've reached ${milestonePercent.toFixed(0)}% of "${goal.title}"!`,
              duration: 6000,
              icon: createElement(Sparkles, { className: "h-5 w-5" }),
            });
          }
        });
      }
    }
  };

  const deleteGoal = async (id: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      hookToast({
        title: "Error deleting goal",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setGoals((prev) => prev.filter((g) => g.id !== id));
    }
  };

  return {
    goals,
    loading,
    addGoal,
    updateGoal,
    deleteGoal,
  };
}

