export type Priority = 'high' | 'medium' | 'low';
export type Status = 'not-started' | 'in-progress' | 'completed';

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  deadline: Date;
  priority: Priority;
  status: Status;
  notes?: string;
}

export interface Habit {
  id: string;
  name: string;
  color: string;
  completedDates: string[]; // ISO date strings
  missedDates: string[]; // ISO date strings for missed/not done
}

export type HabitStatus = 'completed' | 'missed';

export interface DayStats {
  date: string;
  completedHabits: number;
  totalHabits: number;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
}

export type ExpenseCategory = 'food' | 'transport' | 'entertainment' | 'education' | 'utilities' | 'other';

export interface StudySession {
  id: string;
  subject: string;
  duration: number; // in minutes
  date: string;
  notes?: string;
}
