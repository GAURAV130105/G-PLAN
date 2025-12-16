import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { StudySession } from '@/types/tracker';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export function useStudySessions() {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      setSessions([]);
      setLoading(false);
      return;
    }

    const fetchSessions = async () => {
      const { data, error } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) {
        toast({
          title: "Error loading study sessions",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setSessions(
          data.map((s) => ({
            id: s.id,
            subject: s.subject,
            duration: s.duration,
            date: s.date,
            notes: s.notes || undefined,
          }))
        );
      }
      setLoading(false);
    };

    fetchSessions();
  }, [user, toast]);

  const addSession = async (session: Omit<StudySession, 'id'>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('study_sessions')
      .insert({
        user_id: user.id,
        subject: session.subject,
        duration: session.duration,
        date: session.date,
        notes: session.notes,
      })
      .select()
      .single();

    if (error) {
      toast({
        title: "Error adding study session",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setSessions((prev) => [
        {
          id: data.id,
          subject: data.subject,
          duration: data.duration,
          date: data.date,
          notes: data.notes || undefined,
        },
        ...prev,
      ]);
    }
  };

  const deleteSession = async (id: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('study_sessions')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      toast({
        title: "Error deleting study session",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setSessions((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const getTodayTotal = () => {
    const today = new Date().toISOString().split('T')[0];
    return sessions.filter((s) => s.date === today).reduce((acc, s) => acc + s.duration, 0);
  };

  const getWeeklyStats = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const stats: { day: string; date: string; minutes: number }[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayMinutes = sessions
        .filter((s) => s.date === dateStr)
        .reduce((acc, s) => acc + s.duration, 0);

      stats.push({
        day: days[date.getDay()],
        date: dateStr,
        minutes: dayMinutes,
      });
    }

    return stats;
  };

  const getSubjectBreakdown = () => {
    const breakdown: Record<string, number> = {};

    sessions.forEach((s) => {
      if (!breakdown[s.subject]) {
        breakdown[s.subject] = 0;
      }
      breakdown[s.subject] += s.duration;
    });

    return Object.entries(breakdown).map(([name, value]) => ({
      name,
      value,
    }));
  };

  return {
    sessions,
    loading,
    addSession,
    deleteSession,
    getTodayTotal,
    getWeeklyStats,
    getSubjectBreakdown,
  };
}
