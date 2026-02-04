import { useState } from 'react';
import { useStore } from '@/lib/store';
import { useSubjects, useCreateSubject, useUpdateSubject, useDeleteSubject, useTeachers, useCreateAuditLog } from '@/lib/hooks';
import type { Subject } from '@shared/schema';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable } from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Subjects() {
  const { currentUser } = useStore();
  const { data: subjects = [], isLoading } = useSubjects();
  const { data: teachers = [] } = useTeachers();
  const createSubject = useCreateSubject();
  const updateSubject = useUpdateSubject();
  const deleteSubject = useDeleteSubject();
  const createAuditLog = useCreateAuditLog();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    grade: '',
    teacher: '',
  });

  const isAdmin = currentUser?.role === 'admin';

  const resetForm = () => {
    setFormData({
      name: '',
      grade: '',
      teacher: '',
    });
    setEditingSubject(null);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.grade) {
      toast({ title: 'Error', description: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }

    if (editingSubject) {
      updateSubject.mutate({ id: editingSubject.id, data: formData }, {
        onSuccess: () => {
          createAuditLog.mutate({
            action: 'Subject Updated',
            user: currentUser?.name || '',
            userRole: currentUser?.role || 'admin',
            details: `Updated subject: ${formData.name}`,
            timestamp: new Date().toISOString(),
            ip: '192.168.1.100',
          });
          toast({ title: 'Success', description: 'Subject updated successfully' });
          setIsDialogOpen(false);
          resetForm();
        },
      });
    } else {
      createSubject.mutate(formData, {
        onSuccess: () => {
          createAuditLog.mutate({
            action: 'Subject Added',
            user: currentUser?.name || '',
            userRole: currentUser?.role || 'admin',
            details: `Added new subject: ${formData.name}`,
            timestamp: new Date().toISOString(),
            ip: '192.168.1.100',
          });
          toast({ title: 'Success', description: 'Subject added successfully' });
          setIsDialogOpen(false);
          resetForm();
        },
      });
    }
  };

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name,
      grade: subject.grade,
      teacher: subject.teacher,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (subject: Subject) => {
    deleteSubject.mutate(subject.id, {
      onSuccess: () => {
        createAuditLog.mutate({
          action: 'Subject Deleted',
          user: currentUser?.name || '',
          userRole: currentUser?.role || 'admin',
          details: `Deleted subject: ${subject.name}`,
          timestamp: new Date().toISOString(),
          ip: '192.168.1.100',
        });
        toast({ title: 'Success', description: 'Subject deleted successfully' });
      },
    });
  };

  const columns = [
    { key: 'name', label: 'Subject Name', sortable: true },
    { key: 'grade', label: 'Grade', sortable: true },
    { key: 'teacher', label: 'Teacher' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">Subjects</h1>
            <p className="text-muted-foreground">Manage curriculum subjects and teacher assignments</p>
          </div>
          {isAdmin && (
            <Button onClick={() => { resetForm(); setIsDialogOpen(true); }} data-testid="button-add-subject">
              <Plus className="h-4 w-4 mr-2" />
              Add Subject
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Loading subjects...</div>
          </div>
        ) : (
          <DataTable
            data={subjects}
          columns={columns}
          searchKeys={['name', 'teacher']}
          exportFileName="subjects"
          actions={isAdmin ? (subject) => (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => handleEdit(subject)} data-testid={`button-edit-${subject.id}`}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(subject)} data-testid={`button-delete-${subject.id}`}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ) : undefined}
          />
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingSubject ? 'Edit Subject' : 'Add New Subject'}</DialogTitle>
              <DialogDescription>
                {editingSubject ? 'Update subject information' : 'Enter the details for the new subject'}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Subject Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  data-testid="input-subject-name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="grade">Grade *</Label>
                  <Select value={formData.grade} onValueChange={(v) => setFormData({ ...formData, grade: v })}>
                    <SelectTrigger data-testid="select-grade">
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {['Kindergarten', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map((g) => (
                        <SelectItem key={g} value={g}>{g === 'Kindergarten' ? g : `Grade ${g}`}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teacher">Teacher</Label>
                  <Select value={formData.teacher} onValueChange={(v) => setFormData({ ...formData, teacher: v })}>
                    <SelectTrigger data-testid="select-teacher">
                      <SelectValue placeholder="Select teacher" />
                    </SelectTrigger>
                    <SelectContent>
                      {teachers.map((t) => (
                        <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit} data-testid="button-save-subject">
                {editingSubject ? 'Update' : 'Add'} Subject
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
