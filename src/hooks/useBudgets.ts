import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { format, startOfWeek, endOfWeek } from 'date-fns';

interface Budget {
  id: string;
  monthlyBudget: number;
  weeklyBudget: number;
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
          monthYear: data.month_year,
        });
      }
      setLoading(false);
    };

    fetchBudget();
  }, [user, toast, currentMonthYear]);

  const updateBudget = async (monthlyBudget: number, weeklyBudget: number) => {
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

export function useExpenseStats(expenses: { date: string; amount: number }[]) {
  const getWeeklyTotal = () => {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

    return expenses
      .filter((e) => {
        const expenseDate = new Date(e.date);
        return expenseDate >= weekStart && expenseDate <= weekEnd;
      })
      .reduce((acc, e) => acc + e.amount, 0);
  };

  const getMonthlyTotal = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return expenses
      .filter((e) => {
        const expenseDate = new Date(e.date);
        return (
          expenseDate.getMonth() === currentMonth &&
          expenseDate.getFullYear() === currentYear
        );
      })
      .reduce((acc, e) => acc + e.amount, 0);
  };

  return { getWeeklyTotal, getMonthlyTotal };
}
