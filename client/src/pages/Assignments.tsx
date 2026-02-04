import { useState } from 'react';
import { useStore } from '@/lib/store';
import { useAssignments, useSubjects, useClasses, useCreateAssignment, useUpdateAssignment, useDeleteAssignment } from '@/lib/hooks';
import type { Assignment as AssignmentType } from '@shared/schema';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Calendar, BookOpen, Users, Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

export default function Assignments() {
  const { currentUser } = useStore();
  const { data: assignments = [], isLoading } = useAssignments();
  const { data: subjects = [] } = useSubjects();
  const { data: classes = [] } = useClasses();
  const createAssignment = useCreateAssignment();
  const updateAssignment = useUpdateAssignment();
  const deleteAssignment = useDeleteAssignment();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<AssignmentType | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    class: '',
    dueDate: '',
    description: '',
  });

  const isTeacherOrAdmin = currentUser?.role === 'admin' || currentUser?.role === 'teacher';

  const resetForm = () => {
    setFormData({ title: '', subject: '', class: '', dueDate: '', description: '' });
    setEditingAssignment(null);
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.subject || !formData.class || !formData.dueDate) {
      toast({ title: 'Error', description: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }

    if (editingAssignment) {
      updateAssignment.mutate({
        id: editingAssignment.id,
        data: {
          ...formData,
          teacher: currentUser?.name || '',
        },
      }, {
        onSuccess: () => {
          toast({ title: 'Success', description: 'Assignment updated successfully' });
          setIsDialogOpen(false);
          resetForm();
        },
      });
    } else {
      createAssignment.mutate({
        ...formData,
        teacher: currentUser?.name || '',
        status: 'pending',
        submissions: 0,
        totalStudents: 28,
      }, {
        onSuccess: () => {
          toast({ title: 'Success', description: 'Assignment created successfully' });
          setIsDialogOpen(false);
          resetForm();
        },
      });
    }
  };

  const handleEdit = (assignment: AssignmentType) => {
    setEditingAssignment(assignment);
    setFormData({
      title: assignment.title,
      subject: assignment.subject,
      class: assignment.class,
      dueDate: assignment.dueDate,
      description: assignment.description || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (assignment: AssignmentType) => {
    deleteAssignment.mutate(assignment.id, {
      onSuccess: () => {
        toast({ title: 'Success', description: 'Assignment deleted successfully' });
      },
    });
  };

  const getStatusBadge = (status: string, dueDate: string) => {
    const isOverdue = new Date(dueDate) < new Date() && status === 'pending';
    if (isOverdue) return <Badge variant="destructive">Overdue</Badge>;
    if (status === 'graded') return <Badge className="bg-green-500">Graded</Badge>;
    if (status === 'submitted') return <Badge className="bg-blue-500">Submitted</Badge>;
    return <Badge variant="secondary">Pending</Badge>;
  };

  const pendingCount = assignments.filter((a) => a.status === 'pending').length;
  const submittedCount = assignments.filter((a) => a.status === 'submitted').length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">Assignments</h1>
            <p className="text-muted-foreground">
              {isTeacherOrAdmin ? 'Create and manage homework assignments' : 'View your assignments and deadlines'}
            </p>
          </div>
          {isTeacherOrAdmin && (
            <Button onClick={() => { resetForm(); setIsDialogOpen(true); }} data-testid="button-add-assignment">
              <Plus className="h-4 w-4 mr-2" />
              Create Assignment
            </Button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{pendingCount}</div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{submittedCount}</div>
                  <p className="text-sm text-muted-foreground">Submitted</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-green-100 text-green-600 dark:bg-green-900/30">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{assignments.length}</div>
                  <p className="text-sm text-muted-foreground">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Loading assignments...</div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {assignments.map((assignment) => (
              <Card key={assignment.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{assignment.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Badge variant="outline">{assignment.subject}</Badge>
                        <span>•</span>
                        <span>{assignment.class}</span>
                      </CardDescription>
                    </div>
                    {getStatusBadge(assignment.status, assignment.dueDate)}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {assignment.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Calendar className="h-4 w-4" />
                    <span>Due: {assignment.dueDate}</span>
                  </div>

                  {isTeacherOrAdmin && assignment.submissions != null && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Submissions</span>
                        <span>{assignment.submissions}/{assignment.totalStudents}</span>
                      </div>
                      <Progress value={((assignment.submissions ?? 0) / (assignment.totalStudents || 1)) * 100} className="h-2" />
                    </div>
                  )}

                  {isTeacherOrAdmin && (
                    <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(assignment)}>
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(assignment)} className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingAssignment ? 'Edit Assignment' : 'Create Assignment'}</DialogTitle>
              <DialogDescription>
                {editingAssignment ? 'Update assignment details' : 'Create a new homework assignment'}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Assignment title"
                  data-testid="input-title"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Subject *</Label>
                  <Select value={formData.subject} onValueChange={(v) => setFormData({ ...formData, subject: v })}>
                    <SelectTrigger data-testid="select-subject">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((s) => (
                        <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Class *</Label>
                  <Select value={formData.class} onValueChange={(v) => setFormData({ ...formData, class: v })}>
                    <SelectTrigger data-testid="select-class">
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((c) => (
                        <SelectItem key={c.id} value={`${c.grade}-${c.section}`}>
                          Grade {c.grade}-{c.section}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Due Date *</Label>
                <Input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  data-testid="input-due-date"
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Assignment instructions..."
                  rows={4}
                  data-testid="input-description"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit} data-testid="button-save-assignment">
                {editingAssignment ? 'Update' : 'Create'} Assignment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
