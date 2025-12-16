import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Assignment, Priority, Status } from '@/types/tracker';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export function useAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch assignments from database
  useEffect(() => {
    if (!user) {
      setAssignments([]);
      setLoading(false);
      return;
    }

    const fetchAssignments = async () => {
      const { data, error } = await supabase
        .from('assignments')
        .select('*')
        .eq('user_id', user.id)
        .order('deadline', { ascending: true });

      if (error) {
        toast({
          title: "Error loading assignments",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setAssignments(
          data.map((a) => ({
            id: a.id,
            title: a.title,
            subject: a.subject,
            deadline: new Date(a.deadline),
            priority: a.priority as Priority,
            status: a.status as Status,
            notes: a.notes || undefined,
          }))
        );
      }
      setLoading(false);
    };

    fetchAssignments();
  }, [user, toast]);

  const addAssignment = async (assignment: Omit<Assignment, 'id'>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('assignments')
      .insert({
        user_id: user.id,
        title: assignment.title,
        subject: assignment.subject,
        deadline: assignment.deadline.toISOString(),
        priority: assignment.priority,
        status: assignment.status,
        notes: assignment.notes,
      })
      .select()
      .single();

    if (error) {
      toast({
        title: "Error adding assignment",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setAssignments((prev) => [
        ...prev,
        {
          id: data.id,
          title: data.title,
          subject: data.subject,
          deadline: new Date(data.deadline),
          priority: data.priority as Priority,
          status: data.status as Status,
          notes: data.notes || undefined,
        },
      ]);
    }
  };

  const updateAssignment = async (id: string, updates: Partial<Assignment>) => {
    if (!user) return;

    const dbUpdates: Record<string, unknown> = {};
    if (updates.title) dbUpdates.title = updates.title;
    if (updates.subject) dbUpdates.subject = updates.subject;
    if (updates.deadline) dbUpdates.deadline = updates.deadline.toISOString();
    if (updates.priority) dbUpdates.priority = updates.priority;
    if (updates.status) dbUpdates.status = updates.status;
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes;

    const { error } = await supabase
      .from('assignments')
      .update(dbUpdates)
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      toast({
        title: "Error updating assignment",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setAssignments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
      );
    }
  };

  const deleteAssignment = async (id: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('assignments')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      toast({
        title: "Error deleting assignment",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setAssignments((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const getStats = () => {
    const total = assignments.length;
    const completed = assignments.filter((a) => a.status === 'completed').length;
    const inProgress = assignments.filter((a) => a.status === 'in-progress').length;
    const overdue = assignments.filter(
      (a) => a.status !== 'completed' && new Date(a.deadline) < new Date()
    ).length;

    return { total, completed, inProgress, overdue };
  };

  return {
    assignments,
    loading,
    addAssignment,
    updateAssignment,
    deleteAssignment,
    getStats,
  };
}
