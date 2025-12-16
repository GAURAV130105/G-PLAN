import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AssignmentPieChartProps {
  stats: {
    total: number;
    completed: number;
    inProgress: number;
    overdue: number;
  };
}

const STATUS_DATA = [
  { key: 'completed', label: 'Completed', color: 'hsl(var(--success))' },
  { key: 'inProgress', label: 'In Progress', color: 'hsl(var(--warning))' },
  { key: 'overdue', label: 'Overdue', color: 'hsl(var(--destructive))' },
];

export function AssignmentPieChart({ stats }: AssignmentPieChartProps) {
  const notStarted = stats.total - stats.completed - stats.inProgress - stats.overdue;
  
  const data = [
    { name: 'Completed', value: stats.completed, color: 'hsl(var(--success))' },
    { name: 'In Progress', value: stats.inProgress, color: 'hsl(var(--warning))' },
    { name: 'Overdue', value: stats.overdue, color: 'hsl(var(--destructive))' },
    { name: 'Not Started', value: Math.max(0, notStarted), color: 'hsl(var(--muted))' },
  ].filter(d => d.value > 0);

  if (data.length === 0) {
    data.push({ name: 'No Data', value: 1, color: 'hsl(var(--muted))' });
  }

  return (
    <Card className="animate-slide-up border-border/50" style={{ animationDelay: '350ms' }}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-success" />
          Assignment Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={3}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-4 mt-2 flex-wrap">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-1.5 text-xs">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: item.color }}
              />
              <span className="text-muted-foreground">{item.name}</span>
              <span className="font-semibold">{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
