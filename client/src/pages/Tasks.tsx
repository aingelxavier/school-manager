import { useState } from 'react';
import { useStore, UserRole } from '@/lib/store';
import { useTasks, useStudents, useTeachers, useCreateTask, useDeleteTask } from '@/lib/hooks';
import type { Task as TaskType } from '@shared/schema';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Calendar as CalendarIcon,
  List,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
} from 'lucide-react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  parseISO,
} from 'date-fns';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Tasks() {
  const { currentUser } = useStore();
  const { data: tasks = [], isLoading } = useTasks();
  const { data: students = [] } = useStudents();
  const { data: teachers = [] } = useTeachers();
  const createTask = useCreateTask();
  const deleteTask = useDeleteTask();
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [newTask, setNewTask] = useState<Partial<TaskType>>({
    priority: 'medium',
    status: 'pending',
    assignedToRole: 'student',
  });

  if (!currentUser) return null;

  const filteredTasks = tasks.filter((task) => {
    if (currentUser.role !== 'admin') {
      const isAssignedToMe = task.assignedTo === currentUser.id;
      const isCreatedByMe = task.assignedBy === currentUser.id;
      
      if (!isAssignedToMe && !isCreatedByMe) {
        return false;
      }
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        task.title.toLowerCase().includes(query) ||
        (task.description || '').toLowerCase().includes(query)
      );
    }

    return true;
  });

  const handleCreateTask = () => {
    if (!newTask.title || !newTask.dueDate || !newTask.assignedTo) return;

    createTask.mutate({
      title: newTask.title,
      description: newTask.description || '',
      priority: newTask.priority as 'low' | 'medium' | 'high',
      dueDate: newTask.dueDate,
      assignedTo: newTask.assignedTo,
      assignedToRole: newTask.assignedToRole as UserRole,
      assignedBy: currentUser.id,
      status: 'pending',
    }, {
      onSuccess: () => {
        setIsCreateOpen(false);
        setNewTask({ priority: 'medium', status: 'pending', assignedToRole: 'student' });
      },
    });
  };

  const handleDeleteTask = (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTask.mutate(id);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'low':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getAssignees = () => {
    switch (newTask.assignedToRole) {
      case 'student':
        return students;
      case 'teacher':
        return teachers;
      case 'admin':
        return [currentUser]; 
      default:
        return [];
    }
  };

  const CalendarView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    return (
      <div className="bg-card rounded-lg border shadow-sm">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold text-lg">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-7 border-b text-center text-sm font-medium text-muted-foreground bg-muted/50">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="py-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 auto-rows-[minmax(120px,auto)]">
          {days.map((day) => {
            const dayTasks = filteredTasks.filter((task) =>
              isSameDay(parseISO(task.dueDate), day)
            );

            return (
              <div
                key={day.toString()}
                className={cn(
                  'border-b border-r p-2 transition-colors hover:bg-muted/10',
                  !isSameMonth(day, monthStart) && 'bg-muted/20 text-muted-foreground',
                  isSameDay(day, new Date()) && 'bg-blue-50/50'
                )}
              >
                <div className="text-right text-sm mb-1">
                  <span
                    className={cn(
                      'inline-flex h-6 w-6 items-center justify-center rounded-full',
                      isSameDay(day, new Date()) &&
                        'bg-primary text-primary-foreground'
                    )}
                  >
                    {format(day, 'd')}
                  </span>
                </div>
                <div className="space-y-1">
                  {dayTasks.map((task) => (
                    <div
                      key={task.id}
                      className={cn(
                        'text-xs p-1.5 rounded border truncate cursor-pointer hover:opacity-80',
                        getPriorityColor(task.priority)
                      )}
                    >
                      <div className="font-medium truncate">{task.title}</div>
                      {currentUser.role === 'admin' && (
                         <div className="text-[10px] opacity-75 truncate">
                           To: {students.find(s => s.id === task.assignedTo)?.name || 
                                teachers.find(t => t.id === task.assignedTo)?.name || 
                                'User'}
                         </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const ListView = () => {
    return (
      <div className="bg-card rounded-lg border shadow-sm">
        <div className="p-0">
          {filteredTasks.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No tasks found.
            </div>
          ) : (
            <div className="divide-y">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        'mt-1 h-2 w-2 rounded-full',
                        task.priority === 'high'
                          ? 'bg-red-500'
                          : task.priority === 'medium'
                          ? 'bg-orange-500'
                          : 'bg-green-500'
                      )}
                    />
                    <div>
                      <h3 className="font-medium text-sm">{task.title}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {task.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Badge variant="outline" className="text-[10px] px-1.5 h-5">
                          {task.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <CalendarIcon className="h-3 w-3" />
                          {format(parseISO(task.dueDate), 'd MMM, yyyy')}
                        </span>
                        {currentUser.role === 'admin' && (
                            <span className="text-xs text-muted-foreground">
                                • Assigned to: {students.find(s => s.id === task.assignedTo)?.name || 
                                                teachers.find(t => t.id === task.assignedTo)?.name || 
                                                'User'}
                            </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {currentUser.role === 'admin' && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold">Tasks</h1>
            <p className="text-muted-foreground">
              Manage your tasks and schedule.
            </p>
          </div>
          {currentUser.role === 'admin' && (
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Task
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
                  <DialogDescription>
                    Add a new task to the schedule.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      placeholder="Task title"
                      value={newTask.title || ''}
                      onChange={(e) =>
                        setNewTask({ ...newTask, title: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      placeholder="Task description"
                      value={newTask.description || ''}
                      onChange={(e) =>
                        setNewTask({ ...newTask, description: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Priority</Label>
                      <Select
                        value={newTask.priority}
                        onValueChange={(value) =>
                          setNewTask({ ...newTask, priority: value as any })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Due Date</Label>
                      <Input
                        type="date"
                        value={newTask.dueDate || ''}
                        onChange={(e) =>
                          setNewTask({ ...newTask, dueDate: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Assignee Role</Label>
                        <Select
                            value={newTask.assignedToRole}
                            onValueChange={(value) =>
                            setNewTask({ ...newTask, assignedToRole: value as any, assignedTo: '' })
                            }
                        >
                            <SelectTrigger>
                            <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectItem value="student">Student</SelectItem>
                            <SelectItem value="teacher">Teacher</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Assignee</Label>
                        <Select
                            value={newTask.assignedTo}
                            onValueChange={(value) =>
                            setNewTask({ ...newTask, assignedTo: value })
                            }
                            disabled={!newTask.assignedToRole}
                        >
                            <SelectTrigger>
                            <SelectValue placeholder="Select user" />
                            </SelectTrigger>
                            <SelectContent>
                            {getAssignees().map((user: any) => (
                                <SelectItem key={user.id} value={user.id}>
                                {user.name}
                                </SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateTask}>Create Task</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex bg-muted p-1 rounded-lg">
            <Button
              variant={view === 'calendar' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setView('calendar')}
              className="h-8"
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              Calendar
            </Button>
            <Button
              variant={view === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setView('list')}
              className="h-8"
            >
              <List className="h-4 w-4 mr-2" />
              List
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Loading tasks...</div>
          </div>
        ) : (
          view === 'calendar' ? <CalendarView /> : <ListView />
        )}
      </div>
    </DashboardLayout>
  );
}
