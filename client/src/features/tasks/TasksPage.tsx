import { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTasks, useUpdateTask, useDeleteTask } from '@/hooks/useApi';
import { formatDate, getInitials, getStatusColor, getStatusLabel } from '@/lib/utils';
import { Plus, Search, Filter, Trash2, Calendar, User } from 'lucide-react';
import toast from 'react-hot-toast';

export function TasksPage() {
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const { data, isLoading } = useTasks({ status, priority, limit: 50 });
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const tasks = data?.tasks || [];

  const handleToggleStatus = (task: any) => {
    const newStatus = task.status === 'done' ? 'todo' : 'done';
    updateTask.mutate({ id: task._id, status: newStatus });
  };

  const handleDelete = (id: string) => {
    deleteTask.mutate(id, { onSuccess: () => toast.success('Task deleted') });
  };

  return (
    <div>
      <Header title="Tasks" />
      <div className="p-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-3">
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-[130px]"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value=" ">All</SelectItem>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="w-[130px]"><SelectValue placeholder="Priority" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value=" ">All</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button><Plus className="h-4 w-4 mr-2" /> Add Task</Button>
          </div>

          <div className="space-y-2">
            {isLoading ? (
              [...Array(5)].map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)
            ) : tasks.length === 0 ? (
              <Card><CardContent className="text-center py-16 text-muted-foreground"><p>No tasks found</p></CardContent></Card>
            ) : (
              tasks.map((task: any) => (
                <Card key={task._id} className={`transition-all hover:shadow-md ${task.status === 'done' ? 'opacity-60' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={task.status === 'done'}
                        onCheckedChange={() => handleToggleStatus(task)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className={`text-sm font-medium ${task.status === 'done' ? 'line-through' : ''}`}>{task.title}</p>
                          <Badge variant="outline" className={getStatusColor(task.priority)}>{getStatusLabel(task.priority)}</Badge>
                          <Badge variant="outline" className={getStatusColor(task.status)}>{getStatusLabel(task.status)}</Badge>
                        </div>
                        {task.description && <p className="text-xs text-muted-foreground mt-1">{task.description}</p>}
                        <div className="flex items-center gap-4 mt-2">
                          {task.dueDate && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" /> {formatDate(task.dueDate)}
                            </div>
                          )}
                          {task.assignedTo && (
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Avatar className="h-5 w-5"><AvatarFallback className="text-[8px]">{getInitials(task.assignedTo.name)}</AvatarFallback></Avatar>
                              {task.assignedTo.name}
                            </div>
                          )}
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-500" onClick={() => handleDelete(task._id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
