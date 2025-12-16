import { TrendingUp, TrendingDown, Minus, BarChart3, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MoodAnalyticsProps {
  weeklyAverage: number | null;
  monthlyAverage: number | null;
  last30DaysStats: { date: string; mood: number | null }[];
}

const moodEmojis = ['😢', '😞', '😔', '😕', '😐', '🙂', '😊', '😄', '😁', '🤩'];

const getMoodLabel = (mood: number): string => {
  if (mood <= 2) return 'Struggling';
  if (mood <= 4) return 'Low';
  if (mood <= 6) return 'Okay';
  if (mood <= 8) return 'Good';
  return 'Great';
};

const getMoodColor = (mood: number): string => {
  if (mood <= 2) return 'hsl(0 70% 60%)';
  if (mood <= 4) return 'hsl(30 70% 55%)';
  if (mood <= 6) return 'hsl(45 80% 55%)';
  if (mood <= 8) return 'hsl(90 60% 50%)';
  return 'hsl(140 60% 45%)';
};

export function MoodAnalytics({ weeklyAverage, monthlyAverage, last30DaysStats }: MoodAnalyticsProps) {
  const chartData = last30DaysStats.map(s => ({
    ...s,
    mood: s.mood ?? undefined,
  }));

  const trend = weeklyAverage && monthlyAverage 
    ? weeklyAverage - monthlyAverage 
    : null;

  const validDays = last30DaysStats.filter(s => s.mood !== null).length;
  const trackingRate = Math.round((validDays / 30) * 100);

  return (
    <Card className="animate-slide-up border-border/30 overflow-hidden" style={{ animationDelay: '400ms' }}>
      <CardHeader className="pb-3 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/20">
              <Activity className="w-4 h-4 text-primary" />
            </div>
            Mood Insights
          </CardTitle>
          <Badge variant="secondary" className="text-[10px]">
            {trackingRate}% tracked
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          {/* Weekly Average */}
          <div className="bg-gradient-to-br from-muted/50 to-muted/30 rounded-2xl p-4 text-center border border-border/30 group hover:border-primary/30 transition-all">
            <p className="text-[10px] text-muted-foreground mb-2 uppercase tracking-wider">This Week</p>
            {weeklyAverage ? (
              <>
                <span className="text-3xl block group-hover:scale-110 transition-transform">{moodEmojis[Math.round(weeklyAverage) - 1]}</span>
                <p className="text-lg font-bold font-mono mt-1">{weeklyAverage.toFixed(1)}</p>
                <Badge 
                  variant="outline" 
                  className="mt-1 text-[10px]"
                  style={{ borderColor: getMoodColor(weeklyAverage), color: getMoodColor(weeklyAverage) }}
                >
                  {getMoodLabel(weeklyAverage)}
                </Badge>
              </>
            ) : (
              <p className="text-sm text-muted-foreground py-4">No data</p>
            )}
          </div>

          {/* Monthly Average */}
          <div className="bg-gradient-to-br from-muted/50 to-muted/30 rounded-2xl p-4 text-center border border-border/30 group hover:border-accent/30 transition-all">
            <p className="text-[10px] text-muted-foreground mb-2 uppercase tracking-wider">Last 30 Days</p>
            {monthlyAverage ? (
              <>
                <span className="text-3xl block group-hover:scale-110 transition-transform">{moodEmojis[Math.round(monthlyAverage) - 1]}</span>
                <p className="text-lg font-bold font-mono mt-1">{monthlyAverage.toFixed(1)}</p>
                <Badge 
                  variant="outline" 
                  className="mt-1 text-[10px]"
                  style={{ borderColor: getMoodColor(monthlyAverage), color: getMoodColor(monthlyAverage) }}
                >
                  {getMoodLabel(monthlyAverage)}
                </Badge>
              </>
            ) : (
              <p className="text-sm text-muted-foreground py-4">No data</p>
            )}
          </div>

          {/* Trend */}
          <div className="bg-gradient-to-br from-muted/50 to-muted/30 rounded-2xl p-4 text-center border border-border/30 group hover:border-success/30 transition-all">
            <p className="text-[10px] text-muted-foreground mb-2 uppercase tracking-wider">Trend</p>
            {trend !== null ? (
              <>
                <div className="flex justify-center">
                  {trend > 0.5 ? (
                    <div className="p-2 rounded-xl bg-success/20 group-hover:scale-110 transition-transform">
                      <TrendingUp className="w-6 h-6 text-success" />
                    </div>
                  ) : trend < -0.5 ? (
                    <div className="p-2 rounded-xl bg-destructive/20 group-hover:scale-110 transition-transform">
                      <TrendingDown className="w-6 h-6 text-destructive" />
                    </div>
                  ) : (
                    <div className="p-2 rounded-xl bg-warning/20 group-hover:scale-110 transition-transform">
                      <Minus className="w-6 h-6 text-warning" />
                    </div>
                  )}
                </div>
                <p className="text-lg font-bold font-mono mt-1">
                  {trend > 0 ? '+' : ''}{trend.toFixed(1)}
                </p>
                <Badge 
                  variant={trend > 0.5 ? 'default' : trend < -0.5 ? 'destructive' : 'secondary'}
                  className="mt-1 text-[10px]"
                >
                  {trend > 0.5 ? 'Improving' : trend < -0.5 ? 'Declining' : 'Stable'}
                </Badge>
              </>
            ) : (
              <p className="text-sm text-muted-foreground py-4">Need more data</p>
            )}
          </div>
        </div>

        {/* Chart */}
        <div className="h-[180px] bg-gradient-to-br from-muted/30 to-transparent rounded-2xl p-4 border border-border/20">
          {validDays > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  interval={6}
                  className="text-muted-foreground"
                />
                <YAxis 
                  domain={[1, 10]} 
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  ticks={[1, 5, 10]}
                  className="text-muted-foreground"
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length && payload[0].value) {
                      const mood = payload[0].value as number;
                      return (
                        <div className="bg-popover/95 backdrop-blur-sm border border-border rounded-xl p-3 shadow-xl">
                          <p className="text-xs text-muted-foreground">{payload[0].payload.date}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-2xl">{moodEmojis[Math.round(mood) - 1]}</span>
                            <span className="font-bold font-mono">{mood}/10</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="mood"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  fill="url(#moodGradient)"
                  connectNulls
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
              <BarChart3 className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-sm">Start tracking your mood to see trends</p>
            </div>
          )}
        </div>

        {/* Days tracked indicator */}
        <div className="flex items-center justify-center gap-2">
          <div className="h-1.5 flex-1 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
              style={{ width: `${trackingRate}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground font-mono">{validDays}/30 days</span>
        </div>
      </CardContent>
    </Card>
  );
}
