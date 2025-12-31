import { format, isPast, isToday, isTomorrow } from 'date-fns';
import { MoreHorizontal, Trash2, Check, Clock, AlertCircle } from 'lucide-react';
import { Assignment, Status, Priority } from '@/types/tracker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AssignmentTableProps {
  assignments: Assignment[];
  onUpdateAssignment: (id: string, updates: Partial<Assignment>) => void;
  onDeleteAssignment: (id: string) => void;
}

const priorityConfig: Record<Priority, { bg: string; text: string; border: string; icon: string }> = {
  high: { bg: 'bg-sky-500/10', text: 'text-sky-600', border: 'border-sky-500/30', icon: '🔵' },
  medium: { bg: 'bg-warning/10', text: 'text-warning-foreground', border: 'border-warning/30', icon: '🟡' },
  low: { bg: 'bg-success/10', text: 'text-success', border: 'border-success/30', icon: '🟢' },
};

const statusConfig: Record<Status, { bg: string; text: string; icon: typeof Clock }> = {
  'not-started': { bg: 'bg-muted', text: 'text-muted-foreground', icon: Clock },
  'in-progress': { bg: 'bg-primary/10', text: 'text-primary', icon: Clock },
  completed: { bg: 'bg-success/10', text: 'text-success', icon: Check },
};

function getDeadlineLabel(date: Date) {
  if (isToday(date)) return { label: 'Today', urgent: true };
  if (isTomorrow(date)) return { label: 'Tomorrow', urgent: false };
  if (isPast(date)) return { label: 'Overdue', urgent: true };
  return { label: format(date, 'MMM d'), urgent: false };
}

export function AssignmentTable({
  assignments,
  onUpdateAssignment,
  onDeleteAssignment,
}: AssignmentTableProps) {
  const sortedAssignments = [...assignments].sort((a, b) => {
    if (a.status === 'completed' && b.status !== 'completed') return 1;
    if (a.status !== 'completed' && b.status === 'completed') return -1;
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
  });

  return (
    <Card className="animate-slide-up border-border/30 overflow-hidden" style={{ animationDelay: '200ms' }}>
      <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 via-transparent to-accent/5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-accent animate-pulse" />
            Assignment Tracker
          </CardTitle>
          <Badge variant="secondary" className="font-mono text-xs">
            {assignments.filter(a => a.status !== 'completed').length} active
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="max-h-[400px]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="sticky top-0 z-10">
                <tr className="border-b border-border/50 bg-muted/50 backdrop-blur-sm">
                  <th className="text-left py-3 px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Task</th>
                  <th className="text-left py-3 px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Subject</th>
                  <th className="text-left py-3 px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Deadline</th>
                  <th className="text-left py-3 px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Priority</th>
                  <th className="text-left py-3 px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="py-3 px-4 w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {sortedAssignments.map((assignment, index) => {
                  const isOverdue = isPast(assignment.deadline) && assignment.status !== 'completed';
                  const deadline = getDeadlineLabel(assignment.deadline);
                  const priority = priorityConfig[assignment.priority];
                  const status = statusConfig[assignment.status];
                  
                  return (
                    <tr 
                      key={assignment.id} 
                      className={`
                        hover:bg-muted/30 transition-all group
                        ${assignment.status === 'completed' ? 'opacity-50' : ''}
                        ${isOverdue ? 'bg-destructive/5' : ''}
                      `}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-start gap-2">
                          <span className="text-sm">{priority.icon}</span>
                          <div>
                            <span className={`font-medium text-sm ${assignment.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                              {assignment.title}
                            </span>
                            {assignment.notes && (
                              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{assignment.notes}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="font-normal text-xs bg-card/50">
                          {assignment.subject}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className={`
                          inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-lg
                          ${deadline.urgent && !assignment.status.includes('completed') 
                            ? 'bg-destructive/10 text-destructive' 
                            : 'bg-muted/50 text-muted-foreground'
                          }
                        `}>
                          {isOverdue && <AlertCircle className="w-3 h-3" />}
                          <span className="font-mono">{deadline.label}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={`${priority.bg} ${priority.text} border ${priority.border} text-xs`}>
                          {assignment.priority}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Select
                          value={assignment.status}
                          onValueChange={(value: Status) =>
                            onUpdateAssignment(assignment.id, { status: value })
                          }
                        >
                          <SelectTrigger className={`w-28 h-7 text-xs ${status.bg} ${status.text} border-0`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="not-started">Not Started</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="py-3 px-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            {assignment.status !== 'completed' && (
                              <DropdownMenuItem
                                onClick={() => onUpdateAssignment(assignment.id, { status: 'completed' })}
                                className="text-success"
                              >
                                <Check className="w-4 h-4 mr-2" />
                                Mark Complete
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => onDeleteAssignment(assignment.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
                {sortedAssignments.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <div className="w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center">
                          <Clock className="w-6 h-6" />
                        </div>
                        <p className="text-sm">No assignments yet</p>
                        <p className="text-xs">Add your first task to get started</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
