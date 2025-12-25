import { CheckCircle2, Clock, AlertTriangle, FileText, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatsCardsProps {
  assignmentStats: {
    total: number;
    completed: number;
    inProgress: number;
    overdue: number;
  };
  habitProgress: {
    completed: number;
    total: number;
  };
}

export function StatsCards({ assignmentStats, habitProgress }: StatsCardsProps) {
  const completionRate = assignmentStats.total > 0 
    ? Math.round((assignmentStats.completed / assignmentStats.total) * 100) 
    : 0;

  const stats = [
    {
      label: 'Total Tasks',
      value: assignmentStats.total,
      icon: FileText,
      gradient: 'from-primary/20 to-primary/5',
      iconBg: 'bg-primary/20',
      iconColor: 'text-primary',
      ring: 'ring-primary/20',
    },
    {
      label: 'Completed',
      value: assignmentStats.completed,
      icon: CheckCircle2,
      gradient: 'from-success/20 to-success/5',
      iconBg: 'bg-success/20',
      iconColor: 'text-success',
      ring: 'ring-success/20',
      badge: completionRate > 0 ? `${completionRate}%` : null,
    },
    {
      label: 'In Progress',
      value: assignmentStats.inProgress,
      icon: Clock,
      gradient: 'from-warning/20 to-warning/5',
      iconBg: 'bg-warning/20',
      iconColor: 'text-warning',
      ring: 'ring-warning/20',
    },
    {
      label: 'Overdue',
      value: assignmentStats.overdue,
      icon: AlertTriangle,
      gradient: 'from-destructive/20 to-destructive/5',
      iconBg: 'bg-destructive/20',
      iconColor: 'text-destructive',
      ring: 'ring-destructive/20',
      alert: assignmentStats.overdue > 0,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card 
          key={stat.label} 
          className={`
            animate-slide-up border-border/30 overflow-hidden group hover-lift card-hover
            ${stat.alert ? 'ring-2 ring-destructive/30 animate-pulse-slow' : ''}
          `}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CardContent className="p-0">
            <div className={`p-5 bg-gradient-to-br ${stat.gradient} relative`}>
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-card/50 to-transparent rounded-bl-full" />
              
              <div className="flex items-start justify-between relative">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold font-mono tracking-tight">{stat.value}</p>
                    {stat.badge && (
                      <span className="text-xs font-medium text-success bg-success/10 px-1.5 py-0.5 rounded-full">
                        {stat.badge}
                      </span>
                    )}
                  </div>
                </div>
                <div className={`p-2.5 rounded-xl ${stat.iconBg} ring-4 ${stat.ring} transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 hover-glow`}>
                  <stat.icon className={`w-5 h-5 ${stat.iconColor} transition-transform duration-300`} />
                </div>
              </div>
              
              {/* Progress bar for completed */}
              {stat.label === 'Completed' && assignmentStats.total > 0 && (
                <div className="mt-3 h-1.5 bg-muted/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-success rounded-full animated-progress"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
