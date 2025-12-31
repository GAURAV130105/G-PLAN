import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Plus, Trash2, PiggyBank, TrendingDown, TrendingUp, Target, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Expense, ExpenseCategory } from '@/types/tracker';
import { format } from 'date-fns';
import { exportExpensesToCSV } from '@/lib/csvExport';

interface ExpenseTrackerProps {
  expenses: Expense[];
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
  onDeleteExpense: (id: string) => void;
  categoryData: { name: string; value: number; category: ExpenseCategory }[];
  monthlyTotal: number;
  weeklyTotal: number;
  budget: { monthlyBudget: number; weeklyBudget: number, monthlySavingsGoal: number } | null;
  onUpdateBudget: (monthly: number, weekly: number, savings: number) => void;
}

const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  food: 'hsl(var(--chart-1))',
  transport: 'hsl(var(--chart-2))',
  entertainment: 'hsl(var(--chart-3))',
  education: 'hsl(var(--chart-4))',
  utilities: 'hsl(var(--chart-5))',
  other: 'hsl(var(--muted-foreground))',
};

const CATEGORY_ICONS: Record<ExpenseCategory, string> = {
  food: '🍔',
  transport: '🚗',
  entertainment: '🎮',
  education: '📚',
  utilities: '💡',
  other: '📦',
};

export function ExpenseTracker({
  expenses,
  onAddExpense,
  onDeleteExpense,
  categoryData,
  monthlyTotal,
  weeklyTotal,
  budget,
  onUpdateBudget,
}: ExpenseTrackerProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('food');
  const [showForm, setShowForm] = useState(false);
  const [budgetDialogOpen, setBudgetDialogOpen] = useState(false);
  const [monthlyBudgetInput, setMonthlyBudgetInput] = useState(budget?.monthlyBudget?.toString() || '');
  const [weeklyBudgetInput, setWeeklyBudgetInput] = useState(budget?.weeklyBudget?.toString() || '');
  const [monthlySavingsInput, setMonthlySavingsInput] = useState(budget?.monthlySavingsGoal?.toString() || '');


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !amount) return;
    
    onAddExpense({
      description: description.trim(),
      amount: parseFloat(amount),
      category,
      date: new Date().toISOString().split('T')[0],
    });
    
    setDescription('');
    setAmount('');
    setCategory('food');
    setShowForm(false);
  };

  const handleSaveBudget = () => {
    const monthly = parseFloat(monthlyBudgetInput) || 0;
    const weekly = parseFloat(weeklyBudgetInput) || 0;
    const savings = parseFloat(monthlySavingsInput) || 0;
    onUpdateBudget(monthly, weekly, savings);
    setBudgetDialogOpen(false);
  };

  const recentExpenses = expenses.slice(0, 5);
  
  const monthlyProgress = budget?.monthlyBudget ? (monthlyTotal / budget.monthlyBudget) * 100 : 0;
  const weeklyProgress = budget?.weeklyBudget ? (weeklyTotal / budget.weeklyBudget) * 100 : 0;
  const monthlyRemaining = budget?.monthlyBudget ? budget.monthlyBudget - monthlyTotal : 0;
  const weeklyRemaining = budget?.weeklyBudget ? budget.weeklyBudget - weeklyTotal : 0;

  const savedThisMonth = budget?.monthlyBudget ? Math.max(0, budget.monthlyBudget - monthlyTotal) : 0;
  const savingsProgress = budget?.monthlySavingsGoal ? (savedThisMonth / budget.monthlySavingsGoal) * 100 : 0;

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'bg-destructive';
    if (progress >= 80) return 'bg-warning';
    return 'bg-primary';
  };

  return (
    <Card className="animate-slide-up border-border/50 overflow-hidden card-hover" style={{ animationDelay: '500ms' }}>
      <CardHeader className="pb-3 bg-gradient-to-r from-accent/5 to-primary/5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent" />
            Budget & Expenses
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={() => exportExpensesToCSV(expenses)}
              title="Export expenses to CSV"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Dialog open={budgetDialogOpen} onOpenChange={setBudgetDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <Target className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Set Budget & Savings Goals</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Monthly Budget (₹)</label>
                    <Input
                      type="number"
                      placeholder="e.g., 50000"
                      value={monthlyBudgetInput}
                      onChange={(e) => setMonthlyBudgetInput(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Weekly Budget (₹)</label>
                    <Input
                      type="number"
                      placeholder="e.g., 12500"
                      value={weeklyBudgetInput}
                      onChange={(e) => setWeeklyBudgetInput(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Monthly Savings Goal (₹)</label>
                    <Input
                      type="number"
                      placeholder="e.g., 10000"
                      value={monthlySavingsInput}
                      onChange={(e) => setMonthlySavingsInput(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleSaveBudget} className="w-full">
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
      <CardContent className="space-y-4 pt-4">
        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-3 p-3 rounded-lg bg-muted/50 border border-border/50">
            <Input
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-9"
            />
            <div className="flex gap-2">
              <Input
                type="number"
                step="1"
                placeholder="Amount (₹)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="h-9 flex-1"
              />
              <Select value={category} onValueChange={(v) => setCategory(v as ExpenseCategory)}>
                <SelectTrigger className="h-9 w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CATEGORY_ICONS).map(([cat, icon]) => (
                    <SelectItem key={cat} value={cat}>
                      {icon} {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" size="sm" className="w-full">
              Add Expense
            </Button>
          </form>
        )}

        <Tabs defaultValue="monthly" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="monthly" className="text-xs">Monthly</TabsTrigger>
            <TabsTrigger value="weekly" className="text-xs">Weekly</TabsTrigger>
            <TabsTrigger value="savings" className="text-xs">Savings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="monthly" className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-28 w-28 flex-shrink-0">
                {categoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={28}
                        outerRadius={45}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {categoryData.map((entry) => (
                          <Cell
                            key={entry.category}
                            fill={CATEGORY_COLORS[entry.category]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => [`₹${value.toFixed(2)}`, '']}
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
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold font-mono">₹{monthlyTotal.toFixed(2)}</span>
                </div>
                {budget?.monthlyBudget ? (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">of ₹{budget.monthlyBudget}</span>
                      <Badge 
                        variant={monthlyRemaining >= 0 ? "secondary" : "destructive"}
                        className="text-xs"
                      >
                        {monthlyRemaining >= 0 ? (
                          <><TrendingDown className="w-3 h-3 mr-1" /> ₹{monthlyRemaining.toFixed(0)} left</>
                        ) : (
                          <><TrendingUp className="w-3 h-3 mr-1" /> ₹{Math.abs(monthlyRemaining).toFixed(0)} over</>
                        )}
                      </Badge>
                    </div>
                    <Progress 
                      value={Math.min(monthlyProgress, 100)} 
                      className={`h-2 ${getProgressColor(monthlyProgress)}`}
                    />
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">This month • Set a budget to track progress</p>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="weekly" className="space-y-4">
             <div className="flex items-center gap-4">
                <div className="h-28 w-28 flex-shrink-0 flex items-center justify-center">
                    <div className="text-center">
                        <span className="text-3xl font-bold font-mono">₹{weeklyTotal.toFixed(2)}</span>
                    </div>
                </div>
                <div className="flex-1 space-y-2">
                    <p className="text-sm font-medium">This Week's Spending</p>
                    {budget?.weeklyBudget ? (
                    <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">of ₹{budget.weeklyBudget}</span>
                        <Badge 
                            variant={weeklyRemaining >= 0 ? "secondary" : "destructive"}
                            className="text-xs"
                        >
                            {weeklyRemaining >= 0 ? (
                            <><TrendingDown className="w-3 h-3 mr-1" /> ₹{weeklyRemaining.toFixed(0)} left</>
                            ) : (
                            <><TrendingUp className="w-3 h-3 mr-1" /> ₹{Math.abs(weeklyRemaining).toFixed(0)} over</>
                            )}
                        </Badge>
                        </div>
                        <Progress 
                        value={Math.min(weeklyProgress, 100)} 
                        className={`h-2 ${getProgressColor(weeklyProgress)}`}
                        />
                    </div>
                    ) : (
                    <p className="text-xs text-muted-foreground">Set a weekly budget to track progress</p>
                    )}
                </div>
             </div>
          </TabsContent>

          <TabsContent value="savings" className="space-y-4">
            <div className="flex items-center gap-4">
                <div className="h-28 w-28 flex-shrink-0 flex items-center justify-center">
                    <div className="text-center">
                        <PiggyBank className="h-10 w-10 text-accent mx-auto mb-2" />
                        <span className="text-2xl font-bold font-mono">₹{savedThisMonth.toFixed(0)}</span>
                    </div>
                </div>
                <div className="flex-1 space-y-2">
                    <p className="text-sm font-medium">Saved This Month</p>
                    {budget?.monthlySavingsGoal ? (
                    <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Goal: ₹{budget.monthlySavingsGoal}</span>
                        <Badge 
                            variant={savingsProgress >= 100 ? "success" : "secondary"}
                            className="text-xs"
                        >
                            {savingsProgress.toFixed(0)}%
                        </Badge>
                        </div>
                        <Progress value={Math.min(savingsProgress, 100)} className="h-2 bg-green-400" />
                    </div>
                    ) : (
                    <p className="text-xs text-muted-foreground">Set a savings goal to track progress</p>
                    )}
                </div>
             </div>
          </TabsContent>
        </Tabs>

        <div className="flex flex-wrap gap-2 pt-2 border-t border-border/30">
          {categoryData.slice(0, 4).map((cat) => (
            <div
              key={cat.category}
              className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-full bg-muted/50"
            >
              <span>{CATEGORY_ICONS[cat.category]}</span>
              <span className="text-muted-foreground">{cat.name}</span>
              <span className="font-mono font-medium">₹{cat.value.toFixed(0)}</span>
            </div>
          ))}
        </div>

        <div className="space-y-1 max-h-28 overflow-y-auto">
          {recentExpenses.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-muted/50 group transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">{CATEGORY_ICONS[expense.category]}</span>
                <div className="flex flex-col">
                  <span className="text-sm truncate max-w-28">{expense.description}</span>
                  <span className="text-xs text-muted-foreground">{format(new Date(expense.date), 'MMM d')}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono font-medium">₹{expense.amount.toFixed(2)}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDeleteExpense(expense.id)}
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-3 w-3 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
          {recentExpenses.length === 0 && (
            <div className="py-4 text-center text-muted-foreground text-sm">
              No expenses yet
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
