import { Expense } from '@/types/tracker';
import { Habit } from '@/types/tracker';

export function exportExpensesToCSV(expenses: Expense[]): void {
  if (expenses.length === 0) {
    alert('No expenses to export');
    return;
  }

  // CSV header
  const headers = ['Date', 'Description', 'Category', 'Amount'];
  const rows = expenses.map((expense) => [
    expense.date,
    expense.description,
    expense.category,
    expense.amount.toFixed(2),
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `expenses_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportHabitsToCSV(habits: Habit[]): void {
  if (habits.length === 0) {
    alert('No habits to export');
    return;
  }

  // CSV header
  const headers = ['Habit Name', 'Total Completed Days', 'Completion Dates', 'Missed Dates'];
  
  const rows = habits.map((habit) => {
    const completedDates = habit.completedDates.join('; ');
    const missedDates = habit.missedDates.join('; ');
    return [
      habit.name,
      habit.completedDates.length.toString(),
      completedDates || 'None',
      missedDates || 'None',
    ];
  });

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `habits_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

