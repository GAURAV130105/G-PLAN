import { format, startOfWeek, eachDayOfInterval, addDays, subDays, parseISO } from 'date-fns';
<<<<<<< HEAD
import { Plus, Trash2, Check, X, Flame, TrendingUp, Download } from 'lucide-react';
=======
import { Plus, Trash2, Check, X, Flame, TrendingUp } from 'lucide-react';
>>>>>>> 8544b10b557da09312c447cd91d7dfdadad3590e
import { Habit, HabitStatus } from '@/types/tracker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useState, useMemo } from 'react';
<<<<<<< HEAD
import { exportHabitsToCSV } from '@/lib/csvExport';
=======
>>>>>>> 8544b10b557da09312c447cd91d7dfdadad3590e

interface HabitTrackerProps {
  habits: Habit[];
  onSetHabitStatus: (habitId: string, date: Date, status: HabitStatus | null) => void;
  onAddHabit: (name: string, color: string) => void;
  onDeleteHabit: (id: string) => void;
}

const habitColors = [
  'hsl(160, 45%, 45%)',
  'hsl(15, 80%, 60%)',
  'hsl(40, 95%, 55%)',
  'hsl(200, 70%, 50%)',
  'hsl(280, 60%, 55%)',
  'hsl(330, 70%, 55%)',
];

function calculateStreak(completedDates: string[]): number {
  if (completedDates.length === 0) return 0;
  
  const sortedDates = [...completedDates].sort().reverse();
  const today = format(new Date(), 'yyyy-MM-dd');
  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');
  
  // Check if streak is active (completed today or yesterday)
  if (sortedDates[0] !== today && sortedDates[0] !== yesterday) {
    return 0;
  }
  
  let streak = 0;
  let currentDate = sortedDates[0] === today ? new Date() : subDays(new Date(), 1);
  
  for (const dateStr of sortedDates) {
    const expectedDate = format(currentDate, 'yyyy-MM-dd');
    if (dateStr === expectedDate) {
      streak++;
      currentDate = subDays(currentDate, 1);
    } else if (dateStr < expectedDate) {
      break;
    }
  }
  
  return streak;
}

export function HabitTracker({ habits, onSetHabitStatus, onAddHabit, onDeleteHabit }: HabitTrackerProps) {
  const [newHabitName, setNewHabitName] = useState('');
  const [selectedColor, setSelectedColor] = useState(habitColors[0]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: addDays(weekStart, 6) });

  const handleAddHabit = () => {
    if (newHabitName.trim()) {
      onAddHabit(newHabitName.trim(), selectedColor);
      setNewHabitName('');
      setSelectedColor(habitColors[0]);
      setDialogOpen(false);
    }
  };

  const habitStreaks = useMemo(() => {
    return habits.reduce((acc, habit) => {
      acc[habit.id] = calculateStreak(habit.completedDates);
      return acc;
    }, {} as Record<string, number>);
  }, [habits]);

  const totalActiveStreaks = Object.values(habitStreaks).filter(s => s > 0).length;
  const longestStreak = Math.max(...Object.values(habitStreaks), 0);

  return (
<<<<<<< HEAD
    <Card className="animate-slide-up border-border/50 overflow-hidden card-hover" style={{ animationDelay: '300ms' }}>
=======
    <Card className="animate-slide-up border-border/50 overflow-hidden" style={{ animationDelay: '300ms' }}>
>>>>>>> 8544b10b557da09312c447cd91d7dfdadad3590e
      <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent" />
              Daily Habit Tracker
            </CardTitle>
            <div className="flex items-center gap-3 mt-2">
              {totalActiveStreaks > 0 && (
                <Badge variant="secondary" className="gap-1 bg-warning/20 text-warning-foreground border-warning/30">
                  <Flame className="w-3 h-3" />
                  {totalActiveStreaks} active streak{totalActiveStreaks > 1 ? 's' : ''}
                </Badge>
              )}
              {longestStreak > 0 && (
                <Badge variant="outline" className="gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Best: {longestStreak} days
                </Badge>
              )}
            </div>
          </div>
<<<<<<< HEAD
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={() => exportHabitsToCSV(habits)}
              title="Export habits to CSV"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="gap-1">
                  <Plus className="w-4 h-4" />
                  Add
                </Button>
              </DialogTrigger>
=======
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="gap-1">
                <Plus className="w-4 h-4" />
                Add
              </Button>
            </DialogTrigger>
>>>>>>> 8544b10b557da09312c447cd91d7dfdadad3590e
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Habit</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <Input
                  placeholder="Habit name"
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddHabit()}
                />
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Choose a color</p>
                  <div className="flex gap-2">
                    {habitColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-full transition-all duration-200 ${
                          selectedColor === color ? 'scale-125 ring-2 ring-offset-2 ring-foreground/20' : 'hover:scale-110'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                <Button onClick={handleAddHabit} className="w-full">
                  Add Habit
                </Button>
              </div>
            </DialogContent>
          </Dialog>
<<<<<<< HEAD
          </div>
=======
>>>>>>> 8544b10b557da09312c447cd91d7dfdadad3590e
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50 bg-muted/30">
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider min-w-[180px]">
                  Habit
                </th>
                {weekDays.map((day) => (
                  <th
                    key={day.toISOString()}
                    className={`py-3 px-2 text-center text-xs font-semibold uppercase tracking-wider min-w-[70px] ${
                      format(day, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
                        ? 'text-primary bg-primary/5'
                        : 'text-muted-foreground'
                    }`}
                  >
                    <div>{format(day, 'EEE')}</div>
                    <div className="text-base font-bold font-mono">{format(day, 'd')}</div>
                  </th>
                ))}
                <th className="py-3 px-2 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {habits.map((habit) => {
                const streak = habitStreaks[habit.id] || 0;
                return (
                  <tr key={habit.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full flex-shrink-0 shadow-sm"
                          style={{ backgroundColor: habit.color, boxShadow: `0 0 0 2px ${habit.color}30` }}
                        />
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{habit.name}</span>
                          {streak > 0 && (
                            <span className="text-xs text-warning flex items-center gap-1">
                              <Flame className="w-3 h-3" />
                              {streak} day{streak > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    {weekDays.map((day) => {
                      const dateStr = format(day, 'yyyy-MM-dd');
                      const isCompleted = habit.completedDates.includes(dateStr);
                      const isMissed = habit.missedDates.includes(dateStr);
                      const isToday = format(day, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
                      
                      return (
                        <td key={dateStr} className={`py-3 px-2 text-center ${isToday ? 'bg-primary/5' : ''}`}>
                          {isCompleted ? (
                            <button
                              onClick={() => onSetHabitStatus(habit.id, day, null)}
<<<<<<< HEAD
                              className="h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-12 mx-auto shadow-sm hover-glow"
=======
                              className="h-8 w-8 rounded-lg flex items-center justify-center transition-all hover:scale-110 mx-auto shadow-sm"
>>>>>>> 8544b10b557da09312c447cd91d7dfdadad3590e
                              style={{ backgroundColor: habit.color }}
                              title="Click to clear"
                            >
                              <Check className="w-4 h-4 text-white" />
                            </button>
                          ) : isMissed ? (
                            <button
                              onClick={() => onSetHabitStatus(habit.id, day, null)}
                              className="h-8 w-8 rounded-lg flex items-center justify-center transition-all hover:scale-110 mx-auto bg-destructive shadow-sm"
                              title="Click to clear"
                            >
                              <X className="w-4 h-4 text-white" />
                            </button>
                          ) : (
<<<<<<< HEAD
                            <div className="flex items-center justify-center gap-1 opacity-60 group-hover:opacity-100 transition-all duration-300">
                              <button
                                onClick={() => onSetHabitStatus(habit.id, day, 'completed')}
                                className={`h-7 w-7 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-12 border-2 ${
                                  isToday 
                                    ? 'border-primary/40 hover:border-primary hover:bg-primary/20 hover-glow' 
=======
                            <div className="flex items-center justify-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => onSetHabitStatus(habit.id, day, 'completed')}
                                className={`h-7 w-7 rounded-lg flex items-center justify-center transition-all hover:scale-110 border-2 ${
                                  isToday 
                                    ? 'border-primary/40 hover:border-primary hover:bg-primary/20' 
>>>>>>> 8544b10b557da09312c447cd91d7dfdadad3590e
                                    : 'border-muted-foreground/20 hover:border-primary/50 hover:bg-primary/10'
                                }`}
                                title="Mark as done"
                              >
<<<<<<< HEAD
                                <Check className="w-3.5 h-3.5 text-muted-foreground/50 transition-colors duration-300" />
                              </button>
                              <button
                                onClick={() => onSetHabitStatus(habit.id, day, 'missed')}
                                className={`h-7 w-7 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-12 border-2 ${
=======
                                <Check className="w-3.5 h-3.5 text-muted-foreground/50" />
                              </button>
                              <button
                                onClick={() => onSetHabitStatus(habit.id, day, 'missed')}
                                className={`h-7 w-7 rounded-lg flex items-center justify-center transition-all hover:scale-110 border-2 ${
>>>>>>> 8544b10b557da09312c447cd91d7dfdadad3590e
                                  isToday 
                                    ? 'border-primary/40 hover:border-destructive hover:bg-destructive/20' 
                                    : 'border-muted-foreground/20 hover:border-destructive hover:bg-destructive/10'
                                }`}
                                title="Mark as not done"
                              >
<<<<<<< HEAD
                                <X className="w-3.5 h-3.5 text-muted-foreground/50 transition-colors duration-300" />
=======
                                <X className="w-3.5 h-3.5 text-muted-foreground/50" />
>>>>>>> 8544b10b557da09312c447cd91d7dfdadad3590e
                              </button>
                            </div>
                          )}
                        </td>
                      );
                    })}
                    <td className="py-3 px-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => onDeleteHabit(habit.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
              {habits.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <Plus className="w-8 h-8 opacity-50" />
                      <p>No habits yet. Add your first habit to start tracking!</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
