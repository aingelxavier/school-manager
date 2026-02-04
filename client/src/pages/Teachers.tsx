import { useState } from 'react';
import { useStore } from '@/lib/store';
import { useTeachers, useCreateTeacher, useUpdateTeacher, useDeleteTeacher, useCreateAuditLog } from '@/lib/hooks';
import type { Teacher } from '@shared/schema';
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
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Teachers() {
  const { currentUser } = useStore();
  const { data: teachers = [], isLoading } = useTeachers();
  const createTeacher = useCreateTeacher();
  const updateTeacher = useUpdateTeacher();
  const deleteTeacher = useDeleteTeacher();
  const createAuditLog = useCreateAuditLog();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subjects: [] as string[],
    classes: [] as string[],
    status: 'active' as 'active' | 'inactive',
    availableDays: [] as string[],
  });

  const [newSubject, setNewSubject] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  
  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      subjects: [],
      classes: [],
      status: 'active',
      availableDays: [],
    });
    setEditingTeacher(null);
    setNewSubject('');
    setSelectedGrade('');
  };

  const handleAddSubject = () => {
    if (newSubject && !formData.subjects.includes(newSubject)) {
      setFormData({
        ...formData,
        subjects: [...formData.subjects, newSubject],
      });
      setNewSubject('');
    }
  };

  const handleAddClass = () => {
    if (selectedGrade) {
      const className = selectedGrade === 'Kindergarten' 
        ? `Kindergarten` 
        : `Grade ${selectedGrade}`;
      
      if (!formData.classes.includes(className)) {
        setFormData({
          ...formData,
          classes: [...formData.classes, className],
        });
        setSelectedGrade('');
      }
    }
  };

  const handleDayToggle = (day: string) => {
    setFormData(prev => {
      const days = prev.availableDays?.includes(day)
        ? prev.availableDays.filter(d => d !== day)
        : [...(prev.availableDays || []), day];
      
      return {
        ...prev,
        availableDays: days.sort((a, b) => weekDays.indexOf(a) - weekDays.indexOf(b))
      };
    });
  };

  const removeSubject = (subject: string) => {
    setFormData({
      ...formData,
      subjects: formData.subjects.filter((s) => s !== subject),
    });
  };

  const removeClass = (cls: string) => {
    setFormData({
      ...formData,
      classes: formData.classes.filter((c) => c !== cls),
    });
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.email) {
      toast({ title: 'Error', description: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }

    if (editingTeacher) {
      updateTeacher.mutate({ id: editingTeacher.id, data: formData }, {
        onSuccess: () => {
          createAuditLog.mutate({
            action: 'Teacher Updated',
            user: currentUser?.name || '',
            userRole: currentUser?.role || 'admin',
            details: `Updated teacher: ${formData.name}`,
            timestamp: new Date().toISOString(),
            ip: '192.168.1.100',
          });
          toast({ title: 'Success', description: 'Teacher updated successfully' });
          setIsDialogOpen(false);
          resetForm();
        },
      });
    } else {
      createTeacher.mutate({ ...formData, joinDate: new Date().toISOString().split('T')[0] }, {
        onSuccess: () => {
          createAuditLog.mutate({
            action: 'Teacher Added',
            user: currentUser?.name || '',
            userRole: currentUser?.role || 'admin',
            details: `Added new teacher: ${formData.name}`,
            timestamp: new Date().toISOString(),
            ip: '192.168.1.100',
          });
          toast({ title: 'Success', description: 'Teacher added successfully' });
          setIsDialogOpen(false);
          resetForm();
        },
      });
    }
  };

  const handleEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      name: teacher.name,
      email: teacher.email,
      phone: teacher.phone,
      subjects: teacher.subjects,
      classes: teacher.classes,
      status: teacher.status,
      availableDays: teacher.availableDays || [],
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (teacher: Teacher) => {
    deleteTeacher.mutate(teacher.id, {
      onSuccess: () => {
        createAuditLog.mutate({
          action: 'Teacher Deleted',
          user: currentUser?.name || '',
          userRole: currentUser?.role || 'admin',
          details: `Deleted teacher: ${teacher.name}`,
          timestamp: new Date().toISOString(),
          ip: '192.168.1.100',
        });
        toast({ title: 'Success', description: 'Teacher deleted successfully' });
      },
    });
  };

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    {
      key: 'subjects',
      label: 'Subjects',
      render: (teacher: Teacher) => (
        <div className="flex flex-wrap gap-1">
          {teacher.subjects.map((s) => (
            <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
          ))}
        </div>
      ),
    },
    {
      key: 'classes',
      label: 'Classes',
      render: (teacher: Teacher) => (
        <div className="flex flex-wrap gap-1">
          {teacher.classes.map((c) => (
            <Badge key={c} variant="outline" className="text-xs">{c}</Badge>
          ))}
        </div>
      ),
    },
    {
      key: 'availableDays',
      label: 'Availability',
      render: (teacher: Teacher) => (
        <div className="flex flex-wrap gap-1">
          {teacher.availableDays && teacher.availableDays.length > 0 ? (
            teacher.availableDays.map((day) => (
              <Badge key={day} variant="outline" className="text-xs">
                {day.substring(0, 3)}
              </Badge>
            ))
          ) : (
            <span className="text-muted-foreground text-xs">-</span>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (teacher: Teacher) => (
        <Badge variant={teacher.status === 'active' ? 'default' : 'secondary'}>
          {teacher.status}
        </Badge>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">Teachers</h1>
            <p className="text-muted-foreground">Manage teacher profiles and assignments</p>
          </div>
          <Button onClick={() => { resetForm(); setIsDialogOpen(true); }} data-testid="button-add-teacher">
            <Plus className="h-4 w-4 mr-2" />
            Add Teacher
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Loading teachers...</div>
          </div>
        ) : (
          <DataTable
            data={teachers}
          columns={columns}
          searchKeys={['name', 'email']}
          exportFileName="teachers"
          actions={(teacher) => (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => handleEdit(teacher)} data-testid={`button-edit-${teacher.id}`}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(teacher)} data-testid={`button-delete-${teacher.id}`}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          )}
          />
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}</DialogTitle>
              <DialogDescription>
                {editingTeacher ? 'Update teacher information' : 'Enter the details for the new teacher'}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    data-testid="input-teacher-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    data-testid="input-teacher-email"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    data-testid="input-teacher-phone"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(v: 'active' | 'inactive') => setFormData({ ...formData, status: v })}>
                    <SelectTrigger data-testid="select-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Subjects</Label>
                <div className="flex gap-2">
                  <Input 
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    placeholder="Enter subject (e.g. Mathematics)"
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSubject();
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddSubject} size="sm">Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.subjects.map((subject) => (
                    <Badge
                      key={subject}
                      variant="secondary"
                      className="cursor-pointer hover:bg-destructive/10 hover:text-destructive flex items-center gap-1"
                      onClick={() => removeSubject(subject)}
                    >
                      {subject}
                      <span className="sr-only">Remove</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="opacity-50"
                      >
                        <path d="M18 6 6 18" />
                        <path d="m6 6 18 18" />
                      </svg>
                    </Badge>
                  ))}
                  {formData.subjects.length === 0 && (
                    <span className="text-sm text-muted-foreground">No subjects added</span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Classes</Label>
                <div className="flex gap-2">
                  <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {['Kindergarten', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map((g) => (
                        <SelectItem key={g} value={g}>{g === 'Kindergarten' ? g : `Grade ${g}`}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button type="button" onClick={handleAddClass} size="sm">Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.classes.map((cls) => (
                    <Badge
                      key={cls}
                      variant="secondary"
                      className="cursor-pointer hover:bg-destructive/10 hover:text-destructive flex items-center gap-1"
                      onClick={() => removeClass(cls)}
                    >
                      {cls}
                      <span className="sr-only">Remove</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="opacity-50"
                      >
                        <path d="M18 6 6 18" />
                        <path d="m6 6 18 18" />
                      </svg>
                    </Badge>
                  ))}
                  {formData.classes.length === 0 && (
                    <span className="text-sm text-muted-foreground">No classes assigned</span>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Available Days</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {weekDays.map((day) => (
                    <div key={day} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`teacher-day-${day}`} 
                        checked={formData.availableDays?.includes(day)}
                        onCheckedChange={() => handleDayToggle(day)}
                      />
                      <label
                        htmlFor={`teacher-day-${day}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {day}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit} data-testid="button-save-teacher">
                {editingTeacher ? 'Update' : 'Add'} Teacher
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
