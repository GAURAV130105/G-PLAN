import { useState, useMemo } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameDay, 
  addMonths, 
  subMonths,
  startOfWeek,
  endOfWeek,
  isToday
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar, DollarSign, CheckCircle2, X, Flame, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Expense, Habit } from '@/types/tracker';

interface CalendarHistoryViewProps {
  expenses: Expense[];
  habits: Habit[];
  getMoodForDate: (date: Date) => number | null;
}

const moodEmojis = ['😢', '😞', '😔', '😕', '😐', '🙂', '😊', '😄', '😁', '🤩'];

const getMoodColor = (mood: number): string => {
  if (mood <= 2) return 'hsl(0 70% 60%)';
  if (mood <= 4) return 'hsl(30 70% 55%)';
  if (mood <= 6) return 'hsl(45 80% 55%)';
  if (mood <= 8) return 'hsl(90 60% 50%)';
  return 'hsl(140 60% 45%)';
};

interface DaySummary {
  date: Date;
  totalExpenses: number;
  expenseCount: number;
  habitsCompleted: number;
  habitsMissed: number;
  totalHabits: number;
  mood: number | null;
}

export function CalendarHistoryView({ expenses, habits, getMoodForDate }: CalendarHistoryViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const dailySummaries = useMemo(() => {
    const summaries: Record<string, DaySummary> = {};
    
    calendarDays.forEach(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      
      // Expenses for this day
      const dayExpenses = expenses.filter(e => e.date === dateStr);
      const totalExpenses = dayExpenses.reduce((sum, e) => sum + e.amount, 0);
      
      // Habits for this day
      const habitsCompleted = habits.filter(h => h.completedDates.includes(dateStr)).length;
      const habitsMissed = habits.filter(h => h.missedDates.includes(dateStr)).length;
      
      // Mood for this day
      const mood = getMoodForDate(day);
      
      summaries[dateStr] = {
        date: day,
        totalExpenses,
        expenseCount: dayExpenses.length,
        habitsCompleted,
        habitsMissed,
        totalHabits: habits.length,
        mood,
      };
    });
    
    return summaries;
  }, [calendarDays, expenses, habits, getMoodForDate]);

  const selectedDaySummary = selectedDate 
    ? dailySummaries[format(selectedDate, 'yyyy-MM-dd')] 
    : null;

  const selectedDayExpenses = selectedDate 
    ? expenses.filter(e => e.date === format(selectedDate, 'yyyy-MM-dd'))
    : [];

  const selectedDayHabits = selectedDate 
    ? habits.map(h => ({
        ...h,
        completed: h.completedDates.includes(format(selectedDate, 'yyyy-MM-dd')),
        missed: h.missedDates.includes(format(selectedDate, 'yyyy-MM-dd')),
      }))
    : [];

  // Stats for the month
  const monthStats = useMemo(() => {
    const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
    let totalExpenses = 0;
    let totalHabitsCompleted = 0;
    let daysWithMood = 0;
    let totalMood = 0;

    monthDays.forEach(day => {
      const summary = dailySummaries[format(day, 'yyyy-MM-dd')];
      if (summary) {
        totalExpenses += summary.totalExpenses;
        totalHabitsCompleted += summary.habitsCompleted;
        if (summary.mood) {
          daysWithMood++;
          totalMood += summary.mood;
        }
      }
    });

    return {
      totalExpenses,
      totalHabitsCompleted,
      avgMood: daysWithMood > 0 ? totalMood / daysWithMood : null,
    };
  }, [dailySummaries, monthStart, monthEnd]);

  return (
    <Card className="animate-slide-up border-border/50 overflow-hidden" style={{ animationDelay: '450ms' }}>
      <CardHeader className="pb-3 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/20">
              <Calendar className="w-4 h-4 text-primary" />
            </div>
            Activity History
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-primary/10"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium min-w-[120px] text-center px-2">
              {format(currentMonth, 'MMMM yyyy')}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-primary/10"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Month Stats */}
        <div className="grid grid-cols-3 gap-2 mt-3">
          <div className="bg-card/80 backdrop-blur rounded-xl p-2.5 text-center border border-border/30">
            <DollarSign className="w-4 h-4 mx-auto text-accent mb-1" />
            <p className="text-lg font-bold font-mono">${monthStats.totalExpenses.toFixed(0)}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Spent</p>
          </div>
          <div className="bg-card/80 backdrop-blur rounded-xl p-2.5 text-center border border-border/30">
            <CheckCircle2 className="w-4 h-4 mx-auto text-success mb-1" />
            <p className="text-lg font-bold font-mono">{monthStats.totalHabitsCompleted}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Habits Done</p>
          </div>
          <div className="bg-card/80 backdrop-blur rounded-xl p-2.5 text-center border border-border/30">
            {monthStats.avgMood ? (
              <>
                <span className="text-lg">{moodEmojis[Math.round(monthStats.avgMood) - 1]}</span>
                <p className="text-lg font-bold font-mono">{monthStats.avgMood.toFixed(1)}</p>
              </>
            ) : (
              <>
                <span className="text-lg">😐</span>
                <p className="text-xs text-muted-foreground">No data</p>
              </>
            )}
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Avg Mood</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="grid lg:grid-cols-[1fr,280px] gap-4">
          {/* Calendar Grid */}
          <div>
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-[10px] font-semibold text-muted-foreground py-1 uppercase tracking-wider">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day) => {
                const dateStr = format(day, 'yyyy-MM-dd');
                const summary = dailySummaries[dateStr];
                const isCurrentMonth = day >= monthStart && day <= monthEnd;
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const hasActivity = summary && (summary.expenseCount > 0 || summary.habitsCompleted > 0 || summary.mood);
                
                return (
                  <button
                    key={dateStr}
                    onClick={() => setSelectedDate(day)}
                    className={`
                      aspect-square rounded-xl p-1 flex flex-col items-center justify-center gap-0.5 transition-all relative group
                      ${!isCurrentMonth ? 'opacity-30' : ''}
                      ${isSelected ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-background scale-105' : 'hover:bg-muted/80'}
                      ${isToday(day) && !isSelected ? 'ring-2 ring-primary/50' : ''}
                    `}
                  >
                    <span className={`text-xs font-medium ${isSelected ? '' : isToday(day) ? 'text-primary font-bold' : ''}`}>
                      {format(day, 'd')}
                    </span>
                    
                    {/* Activity indicators */}
                    {hasActivity && !isSelected && (
                      <div className="flex items-center gap-0.5">
                        {summary.mood && (
                          <span className="text-[10px]">{moodEmojis[summary.mood - 1]}</span>
                        )}
                        {summary.habitsCompleted > 0 && (
                          <div className="w-1.5 h-1.5 rounded-full bg-success" />
                        )}
                        {summary.expenseCount > 0 && (
                          <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                        )}
                      </div>
                    )}
                    
                    {/* Hover tooltip */}
                    {hasActivity && (
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-popover border border-border rounded-lg px-2 py-1 text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg">
                        {summary.expenseCount > 0 && <span className="text-accent">${summary.totalExpenses.toFixed(0)}</span>}
                        {summary.expenseCount > 0 && summary.habitsCompleted > 0 && ' • '}
                        {summary.habitsCompleted > 0 && <span className="text-success">{summary.habitsCompleted} habits</span>}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            
            {/* Legend */}
            <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t border-border/30">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-success" />
                <span className="text-[10px] text-muted-foreground">Habits</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-accent" />
                <span className="text-[10px] text-muted-foreground">Expenses</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm">😊</span>
                <span className="text-[10px] text-muted-foreground">Mood</span>
              </div>
            </div>
          </div>
          
          {/* Day Details Panel */}
          <div className="bg-muted/30 rounded-xl p-3 border border-border/30">
            {selectedDate ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm">
                    {isToday(selectedDate) ? 'Today' : format(selectedDate, 'EEEE, MMM d')}
                  </h4>
                  {selectedDaySummary?.mood && (
                    <span className="text-xl">{moodEmojis[selectedDaySummary.mood - 1]}</span>
                  )}
                </div>
                
                {/* Expenses Section */}
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <DollarSign className="w-3.5 h-3.5 text-accent" />
                    <span className="text-xs font-medium">Expenses</span>
                    <Badge variant="secondary" className="text-[10px] h-4 px-1.5">
                      ${selectedDaySummary?.totalExpenses.toFixed(2) || '0.00'}
                    </Badge>
                  </div>
                  <ScrollArea className="h-20">
                    {selectedDayExpenses.length > 0 ? (
                      <div className="space-y-1">
                        {selectedDayExpenses.map((expense) => (
                          <div key={expense.id} className="flex items-center justify-between text-xs bg-card/50 rounded-lg px-2 py-1.5">
                            <span className="truncate flex-1">{expense.description}</span>
                            <span className="font-mono text-accent">${expense.amount.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground text-center py-2">No expenses</p>
                    )}
                  </ScrollArea>
                </div>
                
                {/* Habits Section */}
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                    <span className="text-xs font-medium">Habits</span>
                    <Badge variant="secondary" className="text-[10px] h-4 px-1.5">
                      {selectedDaySummary?.habitsCompleted || 0}/{selectedDaySummary?.totalHabits || 0}
                    </Badge>
                  </div>
                  <ScrollArea className="h-20">
                    {selectedDayHabits.length > 0 ? (
                      <div className="space-y-1">
                        {selectedDayHabits.map((habit) => (
                          <div key={habit.id} className="flex items-center gap-2 text-xs bg-card/50 rounded-lg px-2 py-1.5">
                            <div 
                              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                              style={{ backgroundColor: habit.color }}
                            />
                            <span className="truncate flex-1">{habit.name}</span>
                            {habit.completed ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-success flex-shrink-0" />
                            ) : habit.missed ? (
                              <X className="w-3.5 h-3.5 text-destructive flex-shrink-0" />
                            ) : (
                              <div className="w-3.5 h-3.5 rounded-full border border-muted-foreground/30 flex-shrink-0" />
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground text-center py-2">No habits tracked</p>
                    )}
                  </ScrollArea>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-8">
                <Calendar className="w-8 h-8 text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">Select a day to view details</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
