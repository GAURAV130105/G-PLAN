import { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
} from 'date-fns';
import { ChevronLeft, ChevronRight, X, Dot, Edit, Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface MoodTrackerProps {
  getMoodForDate: (date: Date) => number | null;
  getNotesForDate: (date: Date) => string | null;
  onSetMood: (date: Date, mood: number, notes: string) => void;
  onDeleteMood: (date: Date) => void;
}

const moodEmojis = ['😡', '😟', '😐', '😊', '😁'];
const moodColors = ['#ef4444', '#f97316', '#facc15', '#4ade80', '#22c55e'];
const moodLabels = ['Awful', 'Bad', 'Okay', 'Good', 'Great'];

const getMoodColor = (mood: number): string => {
  if (mood <= 2) return 'bg-red-500/80';
  if (mood <= 4) return 'bg-orange-500/80';
  if (mood <= 6) return 'bg-yellow-500/80';
  if (mood <= 8) return 'bg-green-500/80';
  return 'bg-emerald-500/80';
};

const getMoodGradient = (mood: number): string => {
  if (mood <= 2) return 'from-red-500/20 to-red-600/10';
  if (mood <= 4) return 'from-orange-500/20 to-orange-600/10';
  if (mood <= 6) return 'from-yellow-500/20 to-yellow-600/10';
  if (mood <= 8) return 'from-green-500/20 to-green-600/10';
  return 'from-emerald-500/20 to-emerald-600/10';
};

export function MoodTracker({ getMoodForDate, getNotesForDate, onSetMood, onDeleteMood }: MoodTrackerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showMoodPicker, setShowMoodPicker] = useState(false);
  const [selectedMoodScore, setSelectedMoodScore] = useState<number | null>(null);
  const [notes, setNotes] = useState('');

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const today = new Date();

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    const existingMood = getMoodForDate(day);
    const existingNotes = getNotesForDate(day);
    setSelectedMoodScore(existingMood);
    setNotes(existingNotes || '');
    setShowMoodPicker(true);
  };

  const handleMoodSelect = (mood: number) => {
    setSelectedMoodScore(mood);
  };

  const handleSave = () => {
    if (selectedMoodScore) {
      onSetMood(selectedDate, selectedMoodScore, notes);
      setShowMoodPicker(false);
      setNotes('');
      setSelectedMoodScore(null);
    }
  };
  
  const handleDelete = () => {
    onDeleteMood(selectedDate);
    setShowMoodPicker(false);
    setNotes('');
    setSelectedMoodScore(null);
  };

  const firstDayOfWeek = monthStart.getDay();

  // Count moods logged this month
  const moodsLogged = monthDays.filter(day => getMoodForDate(day) !== null).length;
  
  // Calculate average mood
  const monthlyMoods = monthDays.map(day => getMoodForDate(day)).filter(mood => mood !== null) as number[];
  const averageMood = monthlyMoods.length > 0 
    ? monthlyMoods.reduce((sum, mood) => sum + mood, 0) / monthlyMoods.length
    : 0;

  return (
    <Card className="animate-slide-up border-border/30" style={{ animationDelay: '300ms' }}>
      <CardHeader className="flex flex-row items-center justify-between pb-3 bg-gradient-to-r from-accent/5 via-transparent to-primary/5">
        <CardTitle className="text-lg font-semibold">Mood Calendar</CardTitle>
        <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-xs hidden sm:inline">
                {moodsLogged}/{monthDays.length} days logged
            </Badge>
            {averageMood > 0 && (
                <Badge className={`bg-opacity-20 text-white border-0`} style={{backgroundColor: moodColors[Math.round(averageMood/2)-1]}}>
                    Avg: {moodLabels[Math.round(averageMood/2)-1]}
                </Badge>
            )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-semibold">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground mb-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
            <div key={i}>{day}</div>
          ))}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}
          {monthDays.map((day) => {
            const mood = getMoodForDate(day);
            const hasNotes = !!getNotesForDate(day);
            const isToday = isSameDay(day, today);
            const isSelected = isSameDay(day, selectedDate) && showMoodPicker;
            
            return (
              <Popover 
                key={day.toString()}
                open={isSelected}
                onOpenChange={(open) => {
                  if(open) handleDayClick(day);
                  else setShowMoodPicker(false);
                }}
              >
                <PopoverTrigger asChild>
                  <button
                    className={`
                      aspect-square rounded-xl text-xs font-medium flex items-center justify-center 
                      transition-all hover:scale-105 relative group
                      ${isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-105' : ''}
                      ${isToday && !mood ? 'ring-2 ring-primary/40' : ''}
                      ${mood !== null ? `bg-gradient-to-br ${getMoodGradient(mood)} text-white` : 'bg-muted/50'}
                    `}
                  >
                    {mood !== null && hasNotes && (
                      <Dot className="absolute -top-1 -right-1 w-5 h-5 text-primary-foreground/50" />
                    )}
                    <span className="relative z-10">{format(day, 'd')}</span>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-72 p-4" align="center">
                    <div className="flex flex-col gap-4">
                        <p className="text-sm font-semibold text-center">How were you on {format(selectedDate, "MMMM d")}?</p>
                        <div className="flex justify-around">
                            {moodEmojis.map((emoji, index) => {
                                const moodValue = (index + 1) * 2;
                                return (
                                <button
                                    key={index}
                                    onClick={() => handleMoodSelect(moodValue)}
                                    className={`
                                        w-10 h-10 rounded-full text-2xl transition-all
                                        ${selectedMoodScore === moodValue ? 'scale-125' : 'scale-100 opacity-50 hover:opacity-100'}
                                    `}
                                >
                                    {emoji}
                                </button>
                                );
                            })}
                        </div>
                        <Textarea
                            placeholder="Add a note..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="min-h-[60px] text-sm"
                        />
                        <div className="flex items-center gap-2">
                            <Button onClick={handleSave} disabled={!selectedMoodScore} className="w-full">
                                <Save className="w-4 h-4 mr-2" />
                                {getMoodForDate(selectedDate) !== null ? 'Update' : 'Save'}
                            </Button>
                            {getMoodForDate(selectedDate) !== null && (
                                <Button onClick={handleDelete} variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                </PopoverContent>
              </Popover>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
