import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Expense, ExpenseCategory } from '@/types/tracker';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { startOfWeek, endOfWeek } from 'date-fns';

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      setExpenses([]);
      setLoading(false);
      return;
    }

    const fetchExpenses = async () => {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) {
        toast({
          title: "Error loading expenses",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setExpenses(
          data.map((e) => ({
            id: e.id,
            description: e.description,
            amount: Number(e.amount),
            category: e.category as ExpenseCategory,
            date: e.date,
          }))
        );
      }
      setLoading(false);
    };

    fetchExpenses();
  }, [user, toast]);

  const addExpense = async (expense: Omit<Expense, 'id'>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('expenses')
      .insert({
        user_id: user.id,
        description: expense.description,
        amount: expense.amount,
        category: expense.category,
        date: expense.date,
      })
      .select()
      .single();

    if (error) {
      toast({
        title: "Error adding expense",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setExpenses((prev) => [
        {
          id: data.id,
          description: data.description,
          amount: Number(data.amount),
          category: data.category as ExpenseCategory,
          date: data.date,
        },
        ...prev,
      ]);
    }
  };

  const deleteExpense = async (id: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      toast({
        title: "Error deleting expense",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    }
  };

  const getTotalByCategory = () => {
    const totals: Record<ExpenseCategory, number> = {
      food: 0,
      transport: 0,
      entertainment: 0,
      education: 0,
      utilities: 0,
      other: 0,
      savings: 0,
    };

    expenses.forEach((e) => {
      if (e.category in totals) {
        totals[e.category] += e.amount;
      }
    });

    return Object.entries(totals)
      .filter(([, value]) => value > 0)
      .map(([category, value]) => ({
        name: category.charAt(0).toUpperCase() + category.slice(1),
        value: Math.round(value * 100) / 100,
        category: category as ExpenseCategory,
      }));
  };

  const getMonthlyTotal = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return expenses
      .filter((e) => {
        const expenseDate = new Date(e.date);
        return (
          e.category !== 'savings' &&
          expenseDate.getMonth() === currentMonth &&
          expenseDate.getFullYear() === currentYear
        );
      })
      .reduce((acc, e) => acc + e.amount, 0);
  };

  const getWeeklyTotal = () => {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

    return expenses
      .filter((e) => {
        const expenseDate = new Date(e.date);
        return (
          e.category !== 'savings' &&
          expenseDate >= weekStart &&
          expenseDate <= weekEnd
        );
      })
      .reduce((acc, e) => acc + e.amount, 0);
  }

  return {
    expenses,
    loading,
    addExpense,
    deleteExpense,
    getTotalByCategory,
    getMonthlyTotal,
    getWeeklyTotal,
  };
}
