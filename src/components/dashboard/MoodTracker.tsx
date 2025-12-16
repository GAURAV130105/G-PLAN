import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, Smile, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface MoodTrackerProps {
  getMoodForDate: (date: Date) => number | null;
  getNotesForDate: (date: Date) => string | null;
  onSetMood: (date: Date, mood: number, notes?: string) => void;
}

const moodEmojis = ['😢', '😞', '😔', '😕', '😐', '🙂', '😊', '😄', '😁', '🤩'];

const getMoodColor = (mood: number): string => {
  if (mood <= 2) return 'hsl(0 70% 60%)';
  if (mood <= 4) return 'hsl(30 70% 55%)';
  if (mood <= 6) return 'hsl(45 80% 55%)';
  if (mood <= 8) return 'hsl(90 60% 50%)';
  return 'hsl(140 60% 45%)';
};

const getMoodGradient = (mood: number): string => {
  if (mood <= 2) return 'from-red-500/20 to-red-600/10';
  if (mood <= 4) return 'from-orange-500/20 to-orange-600/10';
  if (mood <= 6) return 'from-yellow-500/20 to-yellow-600/10';
  if (mood <= 8) return 'from-green-500/20 to-green-600/10';
  return 'from-emerald-500/20 to-emerald-600/10';
};

export function MoodTracker({ getMoodForDate, getNotesForDate, onSetMood }: MoodTrackerProps) {
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

  const firstDayOfWeek = monthStart.getDay();

  // Count moods logged this month
  const moodsLogged = monthDays.filter(day => getMoodForDate(day) !== null).length;

  return (
    <Card className="animate-slide-up border-border/30 overflow-hidden" style={{ animationDelay: '350ms' }}>
      <CardHeader className="pb-3 bg-gradient-to-r from-accent/10 via-primary/5 to-accent/10">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-accent/20">
                <Smile className="w-4 h-4 text-accent" />
              </div>
              Mood Journal
            </CardTitle>
            <Badge variant="secondary" className="mt-1 text-[10px]">
              {moodsLogged} days logged
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-accent/10"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium min-w-[100px] text-center">
              {format(currentMonth, 'MMMM yyyy')}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-accent/10"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {/* Calendar */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
            <div key={i} className="text-[10px] font-semibold text-muted-foreground py-1 uppercase tracking-wider">
              {day}
            </div>
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
              <button
                key={day.toISOString()}
                onClick={() => handleDayClick(day)}
                className={`
                  aspect-square rounded-xl text-xs font-medium flex items-center justify-center 
                  transition-all hover:scale-105 relative group
                  ${isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-105' : ''}
                  ${isToday && !mood ? 'ring-2 ring-primary/40' : ''}
                  ${mood ? `bg-gradient-to-br ${getMoodGradient(mood)}` : 'hover:bg-muted/50'}
                `}
              >
                {mood ? (
                  <span className="text-lg group-hover:scale-110 transition-transform">{moodEmojis[mood - 1]}</span>
                ) : (
                  <span className={isToday ? 'text-primary font-bold' : 'text-muted-foreground'}>
                    {format(day, 'd')}
                  </span>
                )}
                {hasNotes && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-accent rounded-full animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Mood Picker with Notes */}
        {showMoodPicker && (
          <div className="bg-gradient-to-br from-muted/50 to-muted/30 rounded-2xl p-4 space-y-3 border border-border/30">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              <p className="text-sm text-center font-medium">
                How was {isSameDay(selectedDate, today) ? 'your day' : format(selectedDate, 'MMM d')}?
              </p>
            </div>
            <div className="flex justify-center gap-1 flex-wrap">
              {moodEmojis.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => handleMoodSelect(index + 1)}
                  className={`
                    w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all 
                    hover:scale-110 hover:bg-card/80
                    ${selectedMoodScore === index + 1 
                      ? 'bg-primary/20 scale-110 ring-2 ring-primary shadow-lg shadow-primary/20' 
                      : 'bg-card/50'
                    }
                  `}
                  title={`${index + 1}/10`}
                >
                  {emoji}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground px-1">
              <span>😢 Terrible</span>
              <span>🤩 Amazing</span>
            </div>
            
            <Textarea
              placeholder="Write about your day... (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[80px] resize-none text-sm bg-card/50 border-border/30 rounded-xl"
            />
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 rounded-xl"
                onClick={() => {
                  setShowMoodPicker(false);
                  setNotes('');
                  setSelectedMoodScore(null);
                }}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="flex-1 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90"
                onClick={handleSave}
                disabled={!selectedMoodScore}
              >
                Save Mood
              </Button>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="flex items-center justify-center gap-3 pt-2 border-t border-border/30">
          {[
            { mood: 2, label: 'Bad' },
            { mood: 5, label: 'Okay' },
            { mood: 8, label: 'Good' },
            { mood: 10, label: 'Great' },
          ].map(({ mood, label }) => (
            <div key={mood} className="flex items-center gap-1.5">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: getMoodColor(mood) }} 
              />
              <span className="text-[10px] text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
