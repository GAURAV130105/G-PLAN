import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useBudgets } from './useBudgets';
import { useExpenses } from './useExpenses';

export function useSavings() {
  const { user } = useAuth();
  const { budget } = useBudgets();
  const { expenses } = useExpenses();
  const [savings, setSavings] = useState(0);

  useEffect(() => {
    if (budget) {
      const monthlyExpenses = expenses.reduce((acc, expense) => acc + expense.amount, 0);
      const calculatedSavings = budget.monthlyBudget - monthlyExpenses;
      setSavings(calculatedSavings);
    }
  }, [budget, expenses]);

  return { savings };
}
