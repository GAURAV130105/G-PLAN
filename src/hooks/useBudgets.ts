import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { format } from 'date-fns';

interface Budget {
  id: string;
  monthlyBudget: number;
  weeklyBudget: number;
  monthlySavingsGoal: number;
  monthYear: string;
}

export function useBudgets() {
  const [budget, setBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const currentMonthYear = format(new Date(), 'yyyy-MM');

  useEffect(() => {
    if (!user) {
      setBudget(null);
      setLoading(false);
      return;
    }

    const fetchBudget = async () => {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', user.id)
        .eq('month_year', currentMonthYear)
        .maybeSingle();

      if (error) {
        toast({
          title: "Error loading budget",
          description: error.message,
          variant: "destructive",
        });
      } else if (data) {
        setBudget({
          id: data.id,
          monthlyBudget: Number(data.monthly_budget),
          weeklyBudget: Number(data.weekly_budget),
          monthlySavingsGoal: Number(data.monthly_savings_goal),
          monthYear: data.month_year,
        });
      }
      setLoading(false);
    };

    fetchBudget();
  }, [user, toast, currentMonthYear]);

  const updateBudget = async (monthlyBudget: number, weeklyBudget: number, monthlySavingsGoal: number) => {
    if (!user) return;

    const { data: existing } = await supabase
      .from('budgets')
      .select('id')
      .eq('user_id', user.id)
      .eq('month_year', currentMonthYear)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from('budgets')
        .update({
          monthly_budget: monthlyBudget,
          weekly_budget: weeklyBudget,
          monthly_savings_goal: monthlySavingsGoal,
        })
        .eq('user_id', user.id)
        .eq('month_year', currentMonthYear);

      if (error) {
        toast({
          title: "Error updating budget",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setBudget((prev) => ({
          id: prev?.id || '',
          monthlyBudget,
          weeklyBudget,
          monthlySavingsGoal,
          monthYear: currentMonthYear,
        }));
        toast({ title: "Budget updated!" });
      }
    } else {
      const { data, error } = await supabase
        .from('budgets')
        .insert({
          user_id: user.id,
          monthly_budget: monthlyBudget,
          weekly_budget: weeklyBudget,
          monthly_savings_goal: monthlySavingsGoal,
          month_year: currentMonthYear,
        })
        .select()
        .single();

      if (error) {
        toast({
          title: "Error creating budget",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setBudget({
          id: data.id,
          monthlyBudget: Number(data.monthly_budget),
          weeklyBudget: Number(data.weekly_budget),
          monthlySavingsGoal: Number(data.monthly_savings_goal),
          monthYear: data.month_year,
        });
        toast({ title: "Budget saved!" });
      }
    }
  };

  return {
    budget,
    loading,
    updateBudget,
    currentMonthYear,
  };
}
