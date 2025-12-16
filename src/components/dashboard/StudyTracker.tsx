import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, PieChart, Pie, Tooltip } from 'recharts';
import { Plus, Trash2, BookOpen, Clock, Target, Flame, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { StudySession } from '@/types/tracker';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface StudyGoals {
  dailyGoalMinutes: number;
  weeklyGoalMinutes: number;
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string | null;
}

interface StudyTrackerProps {
  sessions: StudySession[];
  onAddSession: (session: Omit<StudySession, 'id'>) => void;
  onDeleteSession: (id: string) => void;
  todayTotal: number;
  weeklyStats: { day: string; date: string; minutes: number }[];
  subjectBreakdown: { name: string; value: number }[];
  goals: StudyGoals;
  onUpdateGoals: (dailyGoal: number, weeklyGoal: number) => void;
  onUpdateStreak: (todayTotal: number) => void;
}

const SUBJECT_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  'hsl(var(--primary))',
];

export function StudyTracker({
  sessions,
  onAddSession,
  onDeleteSession,
  todayTotal,
  weeklyStats,
  subjectBreakdown,
  goals,
  onUpdateGoals,
  onUpdateStreak,
}: StudyTrackerProps) {
  const [subject, setSubject] = useState('');
  const [duration, setDuration] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [dailyGoalInput, setDailyGoalInput] = useState(goals.dailyGoalMinutes.toString());
  const [weeklyGoalInput, setWeeklyGoalInput] = useState(goals.weeklyGoalMinutes.toString());
  const [goalsDialogOpen, setGoalsDialogOpen] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const weeklyTotal = weeklyStats.reduce((acc, day) => acc + day.minutes, 0);
  const dailyProgress = Math.min((todayTotal / goals.dailyGoalMinutes) * 100, 100);
  const weeklyProgress = Math.min((weeklyTotal / goals.weeklyGoalMinutes) * 100, 100);

  // Update streak when today's goal is met
  useEffect(() => {
    if (todayTotal >= goals.dailyGoalMinutes && goals.lastStudyDate !== today) {
      onUpdateStreak(todayTotal);
    }
  }, [todayTotal, goals.dailyGoalMinutes, goals.lastStudyDate, today, onUpdateStreak]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !duration) return;
    
    onAddSession({
      subject: subject.trim(),
      duration: parseInt(duration),
      date: today,
    });
    
    setSubject('');
    setDuration('');
    setShowForm(false);
  };

  const handleSaveGoals = () => {
    const daily = parseInt(dailyGoalInput) || 60;
    const weekly = parseInt(weeklyGoalInput) || 300;
    onUpdateGoals(daily, weekly);
    setGoalsDialogOpen(false);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const todaySessions = sessions.filter(s => s.date === today);

  return (
    <Card className="animate-slide-up border-border/50" style={{ animationDelay: '600ms' }}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-chart-4" />
            Daily Study Tracker
          </CardTitle>
          <div className="flex items-center gap-1">
            <Dialog open={goalsDialogOpen} onOpenChange={setGoalsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Study Goals</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Daily Goal (minutes)</Label>
                    <Input
                      type="number"
                      value={dailyGoalInput}
                      onChange={(e) => setDailyGoalInput(e.target.value)}
                      placeholder="60"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Weekly Goal (minutes)</Label>
                    <Input
                      type="number"
                      value={weeklyGoalInput}
                      onChange={(e) => setWeeklyGoalInput(e.target.value)}
                      placeholder="300"
                    />
                  </div>
                  <Button onClick={handleSaveGoals} className="w-full">
                    Save Goals
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowForm(!showForm)}
              className="h-8 w-8 p-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Streak Display */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            <span className="text-sm font-medium">Current Streak</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-orange-500">{goals.currentStreak}</span>
            <span className="text-xs text-muted-foreground">Best: {goals.longestStreak}</span>
          </div>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-3 p-3 rounded-lg bg-muted/50">
            <Input
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="h-9"
            />
            <Input
              type="number"
              placeholder="Duration (minutes)"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="h-9"
            />
            <Button type="submit" size="sm" className="w-full">
              Log Study Session
            </Button>
          </form>
        )}

        {/* Goals Progress */}
        <div className="space-y-3">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Daily Goal</span>
              </div>
              <span className="font-mono text-primary">
                {formatDuration(todayTotal)} / {formatDuration(goals.dailyGoalMinutes)}
              </span>
            </div>
            <Progress value={dailyProgress} className="h-2" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-chart-4" />
                <span className="text-muted-foreground">Weekly Goal</span>
              </div>
              <span className="font-mono text-chart-4">
                {formatDuration(weeklyTotal)} / {formatDuration(goals.weeklyGoalMinutes)}
              </span>
            </div>
            <Progress value={weeklyProgress} className="h-2 [&>div]:bg-chart-4" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-2">Weekly Progress</p>
            <div className="h-24">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyStats} barCategoryGap="15%">
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis hide />
                  <Bar 
                    dataKey="minutes" 
                    radius={[3, 3, 0, 0]}
                    maxBarSize={20}
                  >
                    {weeklyStats.map((entry) => (
                      <Cell 
                        key={entry.date}
                        fill={entry.date === today 
                          ? 'hsl(var(--chart-4))' 
                          : 'hsl(var(--chart-4) / 0.4)'
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">By Subject</p>
            <div className="h-24">
              {subjectBreakdown.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={subjectBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={15}
                      outerRadius={35}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {subjectBreakdown.map((_, index) => (
                        <Cell
                          key={index}
                          fill={SUBJECT_COLORS[index % SUBJECT_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [formatDuration(value), '']}
                      contentStyle={{
                        background: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground text-xs">
                  No data
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2 max-h-28 overflow-y-auto">
          {todaySessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-muted/50 group"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="h-3 w-3 text-muted-foreground" />
                <span className="text-sm truncate max-w-24">{session.subject}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono text-muted-foreground">
                  {formatDuration(session.duration)}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDeleteSession(session.id)}
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-3 w-3 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
          {todaySessions.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-2">
              No study sessions today
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
