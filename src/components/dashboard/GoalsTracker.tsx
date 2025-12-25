import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Trophy, Target, TrendingUp, Sparkles } from 'lucide-react';
import { Goal, useGoals } from '@/hooks/useGoals';
import { format } from 'date-fns';

interface GoalsTrackerProps {
  goals: Goal[];
  onAddGoal: (goal: Omit<Goal, 'id'>) => void;
  onUpdateGoal: (id: string, updates: Partial<Goal>) => void;
  onDeleteGoal: (id: string) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  general: 'bg-blue-500/20 text-blue-700 dark:text-blue-300',
  fitness: 'bg-green-500/20 text-green-700 dark:text-green-300',
  finance: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300',
  learning: 'bg-purple-500/20 text-purple-700 dark:text-purple-300',
  habit: 'bg-orange-500/20 text-orange-700 dark:text-orange-300',
};

export function GoalsTracker({
  goals,
  onAddGoal,
  onUpdateGoal,
  onDeleteGoal,
}: GoalsTrackerProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [currentValue, setCurrentValue] = useState('0');
  const [unit, setUnit] = useState('points');
  const [category, setCategory] = useState('general');
  const [targetDate, setTargetDate] = useState('');

  const activeGoals = goals.filter((g) => g.status === 'active');
  const completedGoals = goals.filter((g) => g.status === 'completed');

  const handleAddGoal = () => {
    if (!title.trim() || !targetValue) return;

    onAddGoal({
      title: title.trim(),
      description: description.trim() || undefined,
      targetValue: parseFloat(targetValue),
      currentValue: parseFloat(currentValue) || 0,
      unit,
      category,
      targetDate: targetDate || undefined,
      status: 'active',
      milestones: [25, 50, 75].map((p) => (parseFloat(targetValue) * p) / 100),
      completedMilestones: [],
    });

    // Reset form
    setTitle('');
    setDescription('');
    setTargetValue('');
    setCurrentValue('0');
    setUnit('points');
    setCategory('general');
    setTargetDate('');
    setDialogOpen(false);
  };

  const getProgress = (goal: Goal) => {
    return Math.min((goal.currentValue / goal.targetValue) * 100, 100);
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'bg-success';
    if (progress >= 75) return 'bg-primary';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-warning';
    return 'bg-muted';
  };

  return (
    <Card className="animate-slide-up border-border/50 overflow-hidden animate-fade-in">
      <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent" />
            Goals & Milestones
            {activeGoals.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeGoals.length} active
              </Badge>
            )}
          </CardTitle>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="gap-1">
                <Plus className="w-4 h-4" />
                Add Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Goal</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Goal Title *</Label>
                  <Input
                    placeholder="e.g., Read 50 books"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Optional description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Target Value *</Label>
                    <Input
                      type="number"
                      placeholder="50"
                      value={targetValue}
                      onChange={(e) => setTargetValue(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Unit</Label>
                    <Input
                      placeholder="books, points, etc."
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Current Progress</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={currentValue}
                    onChange={(e) => setCurrentValue(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="fitness">Fitness</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="learning">Learning</SelectItem>
                        <SelectItem value="habit">Habit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Target Date</Label>
                    <Input
                      type="date"
                      value={targetDate}
                      onChange={(e) => setTargetDate(e.target.value)}
                    />
                  </div>
                </div>
                <Button onClick={handleAddGoal} className="w-full">
                  Create Goal
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {activeGoals.length === 0 && completedGoals.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No goals yet. Create your first goal to start tracking progress!</p>
          </div>
        ) : (
          <>
            {activeGoals.map((goal) => {
              const progress = getProgress(goal);
              const remaining = goal.targetValue - goal.currentValue;
              const isCompleted = goal.currentValue >= goal.targetValue;

              return (
                <div
                  key={goal.id}
                  className="p-4 rounded-lg border border-border/50 bg-card/50 hover:bg-card/80 transition-all duration-300 hover:shadow-md hover:-translate-y-1 group animate-fade-in"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm">{goal.title}</h3>
                        <Badge
                          variant="secondary"
                          className={CATEGORY_COLORS[goal.category] || ''}
                        >
                          {goal.category}
                        </Badge>
                        {isCompleted && (
                          <Badge variant="default" className="gap-1 bg-success">
                            <Trophy className="w-3 h-3" />
                            Completed
                          </Badge>
                        )}
                      </div>
                      {goal.description && (
                        <p className="text-xs text-muted-foreground mb-2">
                          {goal.description}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => onDeleteGoal(goal.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        {goal.currentValue.toFixed(1)} / {goal.targetValue.toFixed(1)} {goal.unit}
                      </span>
                      <span className="font-medium">{progress.toFixed(0)}%</span>
                    </div>
                    <Progress
                      value={progress}
                      className={`h-2 ${getProgressColor(progress)} animated-progress`}
                    />
                    {goal.milestones.length > 0 && (
                      <div className="flex items-center gap-1 mt-2">
                        {goal.milestones.map((milestone, idx) => {
                          const milestonePercent = (milestone / goal.targetValue) * 100;
                          const isReached = goal.currentValue >= milestone;
                          return (
                            <div
                              key={idx}
                              className="flex-1 h-1.5 rounded-full relative overflow-hidden"
                            >
                              <div
                                className={`absolute inset-0 ${
                                  isReached ? 'bg-primary' : 'bg-muted'
                                } transition-colors duration-300`}
                                style={{
                                  width: `${Math.min(
                                    (goal.currentValue / milestone) * 100,
                                    100
                                  )}%`,
                                }}
                              />
                              {isReached && (
                                <Sparkles className="absolute -top-1 right-0 w-3 h-3 text-primary animate-pulse" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border/30">
                    <div className="flex-1">
                      <Input
                        type="number"
                        placeholder="Update progress"
                        className="h-8 text-xs"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const value = parseFloat(e.currentTarget.value);
                            if (!isNaN(value) && value >= 0) {
                              onUpdateGoal(goal.id, { currentValue: value });
                              e.currentTarget.value = '';
                            }
                          }
                        }}
                      />
                    </div>
                    {goal.targetDate && (
                      <span className="text-xs text-muted-foreground">
                        Target: {format(new Date(goal.targetDate), 'MMM d, yyyy')}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {completedGoals.length > 0 && (
              <div className="mt-6 pt-6 border-t border-border/50">
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-success" />
                  Completed Goals
                </h4>
                <div className="space-y-2">
                  {completedGoals.map((goal) => (
                    <div
                      key={goal.id}
                      className="p-3 rounded-lg border border-success/30 bg-success/5 flex items-center justify-between"
                    >
                      <div>
                        <h5 className="font-medium text-sm">{goal.title}</h5>
                        <p className="text-xs text-muted-foreground">
                          {goal.targetValue} {goal.unit}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => onDeleteGoal(goal.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

