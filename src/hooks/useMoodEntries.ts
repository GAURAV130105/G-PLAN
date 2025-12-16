import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';

interface MoodEntry {
  id: string;
  date: string;
  mood_score: number;
  notes: string | null;
}

export function useMoodEntries() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchEntries = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching mood entries",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const setMood = async (date: Date, moodScore: number, notes?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const dateStr = format(date, 'yyyy-MM-dd');
      const existingEntry = entries.find(e => e.date === dateStr);

      if (existingEntry) {
        const { error } = await supabase
          .from('mood_entries')
          .update({ mood_score: moodScore, notes: notes || null })
          .eq('id', existingEntry.id);
        
        if (error) throw error;
        setEntries(prev => prev.map(e => 
          e.id === existingEntry.id ? { ...e, mood_score: moodScore, notes: notes || null } : e
        ));
      } else {
        const { data, error } = await supabase
          .from('mood_entries')
          .insert({
            user_id: user.id,
            date: dateStr,
            mood_score: moodScore,
            notes: notes || null,
          })
          .select()
          .single();

        if (error) throw error;
        setEntries(prev => [data, ...prev]);
      }

      toast({
        title: "Mood recorded",
        description: `Your mood for ${format(date, 'MMM d')} has been saved.`,
      });
    } catch (error: any) {
      toast({
        title: "Error saving mood",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getMoodForDate = (date: Date): number | null => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const entry = entries.find(e => e.date === dateStr);
    return entry?.mood_score ?? null;
  };

  const getNotesForDate = (date: Date): string | null => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const entry = entries.find(e => e.date === dateStr);
    return entry?.notes ?? null;
  };

  const getWeeklyAverage = (): number | null => {
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
    
    const weekMoods = weekDays
      .map(day => getMoodForDate(day))
      .filter((m): m is number => m !== null);
    
    if (weekMoods.length === 0) return null;
    return weekMoods.reduce((sum, m) => sum + m, 0) / weekMoods.length;
  };

  const getLast30DaysStats = () => {
    const today = new Date();
    const stats: { date: string; mood: number | null }[] = [];
    
    for (let i = 29; i >= 0; i--) {
      const day = subDays(today, i);
      stats.push({
        date: format(day, 'MMM d'),
        mood: getMoodForDate(day),
      });
    }
    
    return stats;
  };

  const getMonthlyAverage = (): number | null => {
    const stats = getLast30DaysStats();
    const validMoods = stats.filter(s => s.mood !== null).map(s => s.mood as number);
    if (validMoods.length === 0) return null;
    return validMoods.reduce((sum, m) => sum + m, 0) / validMoods.length;
  };

  return {
    entries,
    loading,
    setMood,
    getMoodForDate,
    getNotesForDate,
    getWeeklyAverage,
    getMonthlyAverage,
    getLast30DaysStats,
  };
}
