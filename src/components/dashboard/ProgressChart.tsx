import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProgressChartProps {
  weeklyStats: {
    day: string;
    date: string;
    completed: number;
    total: number;
    percentage: number;
  }[];
}

export function ProgressChart({ weeklyStats }: ProgressChartProps) {
  const today = new Date().toISOString().split('T')[0];

  return (
    <Card className="animate-slide-up border-border/50" style={{ animationDelay: '400ms' }}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-warning" />
          Weekly Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyStats} barCategoryGap="20%">
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                domain={[0, 100]} 
                hide 
              />
              <Bar 
                dataKey="percentage" 
                radius={[6, 6, 0, 0]}
                maxBarSize={40}
              >
                {weeklyStats.map((entry) => (
                  <Cell 
                    key={entry.date}
                    fill={entry.date === today 
                      ? 'hsl(var(--primary))' 
                      : 'hsl(var(--primary) / 0.4)'
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-border/50">
          <div className="text-center">
            <p className="text-2xl font-bold font-mono text-primary">
              {Math.round(weeklyStats.reduce((acc, s) => acc + s.percentage, 0) / 7)}%
            </p>
            <p className="text-xs text-muted-foreground">Weekly Avg</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold font-mono">
              {weeklyStats.reduce((acc, s) => acc + s.completed, 0)}
            </p>
            <p className="text-xs text-muted-foreground">Habits Done</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold font-mono text-success">
              {weeklyStats.filter(s => s.percentage === 100).length}
            </p>
            <p className="text-xs text-muted-foreground">Perfect Days</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
