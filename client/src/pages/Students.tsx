import { useState } from 'react';
import { useStore } from '@/lib/store';
import { useStudents, useCreateStudent, useUpdateStudent, useDeleteStudent, useCreateAuditLog } from '@/lib/hooks';
import type { Student } from '@shared/schema';
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
import { Plus, Pencil, Trash2, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export default function Students() {
  const { currentUser } = useStore();
  const { data: students = [], isLoading } = useStudents();
  const createStudent = useCreateStudent();
  const updateStudent = useUpdateStudent();
  const deleteStudent = useDeleteStudent();
  const createAuditLog = useCreateAuditLog();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    grade: '',
    section: '',
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    status: 'active' as 'active' | 'inactive' | 'trial',
    schoolName: '',
  });

  const isAdmin = currentUser?.role === 'admin';

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      grade: '',
      section: '',
      parentName: '',
      parentEmail: '',
      parentPhone: '',
      status: 'active',
      schoolName: '',
    });
    setEditingStudent(null);
  };

  const handleView = (student: Student) => {
    setViewingStudent(student);
    setIsViewOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.grade || !formData.section) {
      toast({ title: 'Error', description: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }

    if (editingStudent) {
      updateStudent.mutate({ id: editingStudent.id, data: formData }, {
        onSuccess: () => {
          createAuditLog.mutate({
            action: 'Student Updated',
            user: currentUser?.name || '',
            userRole: currentUser?.role || 'admin',
            details: `Updated student: ${formData.name}`,
            timestamp: new Date().toISOString(),
            ip: '192.168.1.100',
          });
          toast({ title: 'Success', description: 'Student updated successfully' });
          setIsDialogOpen(false);
          resetForm();
        },
      });
    } else {
      createStudent.mutate({ ...formData, enrollmentDate: new Date().toISOString().split('T')[0] }, {
        onSuccess: () => {
          createAuditLog.mutate({
            action: 'Student Added',
            user: currentUser?.name || '',
            userRole: currentUser?.role || 'admin',
            details: `Added new student: ${formData.name}`,
            timestamp: new Date().toISOString(),
            ip: '192.168.1.100',
          });
          toast({ title: 'Success', description: 'Student added successfully' });
          setIsDialogOpen(false);
          resetForm();
        },
      });
    }
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      email: student.email,
      grade: student.grade,
      section: student.section,
      parentName: student.parentName,
      parentEmail: student.parentEmail,
      parentPhone: student.parentPhone,
      status: student.status,
      schoolName: student.schoolName || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (student: Student) => {
    deleteStudent.mutate(student.id, {
      onSuccess: () => {
        createAuditLog.mutate({
          action: 'Student Deleted',
          user: currentUser?.name || '',
          userRole: currentUser?.role || 'admin',
          details: `Deleted student: ${student.name}`,
          timestamp: new Date().toISOString(),
          ip: '192.168.1.100',
        });
        toast({ title: 'Success', description: 'Student deleted successfully' });
      },
    });
  };

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email' },
    { key: 'schoolName', label: 'School' },
    { key: 'grade', label: 'Grade', sortable: true },
    { key: 'section', label: 'Section' },
    { key: 'parentName', label: 'Parent' },
    {
      key: 'status',
      label: 'Status',
      render: (student: Student) => {
        const variants: Record<string, 'default' | 'secondary' | 'outline'> = {
          active: 'default',
          inactive: 'secondary',
          trial: 'outline',
        };
        return (
          <Badge variant={variants[student.status] || 'default'} className={student.status === 'trial' ? 'border-blue-500 text-blue-500' : ''}>
            {student.status}
          </Badge>
        );
      },
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">Students</h1>
            <p className="text-muted-foreground">Manage student records and information</p>
          </div>
          {isAdmin && (
            <Button onClick={() => { resetForm(); setIsDialogOpen(true); }} data-testid="button-add-student">
              <Plus className="h-4 w-4 mr-2" />
              Add Student
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Loading students...</div>
          </div>
        ) : (
          <DataTable
            data={students}
            columns={columns}
            searchKeys={['name', 'email', 'parentName']}
            exportFileName="students"
            actions={isAdmin ? (student) => (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => handleView(student)} data-testid={`button-view-${student.id}`}>
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleEdit(student)} data-testid={`button-edit-${student.id}`}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(student)} data-testid={`button-delete-${student.id}`}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ) : (student) => (
            <Button variant="ghost" size="icon" onClick={() => handleView(student)} data-testid={`button-view-${student.id}`}>
              <Eye className="h-4 w-4" />
            </Button>
          )}
          />
        )}

        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Student Details</DialogTitle>
              <DialogDescription>
                Complete profile information
              </DialogDescription>
            </DialogHeader>
            {viewingStudent && (
              <div className="grid gap-6 py-4">
                <div className="flex items-center gap-4 border-b pb-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                    {viewingStudent.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{viewingStudent.name}</h3>
                    <p className="text-muted-foreground">{viewingStudent.email}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline">
                        {viewingStudent.grade === 'Kindergarten' ? 'Kindergarten' : `Grade ${viewingStudent.grade}`} - {viewingStudent.section}
                      </Badge>
                      <Badge variant={viewingStudent.status === 'active' ? 'default' : 'secondary'}>
                        {viewingStudent.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                  <div>
                    <h4 className="font-semibold mb-2 text-sm text-muted-foreground uppercase tracking-wider">Academic Info</h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium block">School Name</span>
                        <span className="text-sm">{viewingStudent.schoolName || '-'}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium block">Enrollment Date</span>
                        <span className="text-sm">
                          {viewingStudent.enrollmentDate ? format(new Date(viewingStudent.enrollmentDate), 'd MMMM, yyyy') : '-'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 text-sm text-muted-foreground uppercase tracking-wider">Parent/Guardian Info</h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium block">Name</span>
                        <span className="text-sm">{viewingStudent.parentName || '-'}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium block">Email</span>
                        <span className="text-sm">{viewingStudent.parentEmail || '-'}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium block">Phone</span>
                        <span className="text-sm">{viewingStudent.parentPhone || '-'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button onClick={() => setIsViewOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingStudent ? 'Edit Student' : 'Add New Student'}</DialogTitle>
              <DialogDescription>
                {editingStudent ? 'Update student information' : 'Enter the details for the new student'}
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
                    data-testid="input-student-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    data-testid="input-student-email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="schoolName">School Name</Label>
                  <Input
                    id="schoolName"
                    value={formData.schoolName}
                    onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                    data-testid="input-school-name"
                    placeholder="Enter school name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
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
                  <Label htmlFor="section">Section *</Label>
                  <Select value={formData.section} onValueChange={(v) => setFormData({ ...formData, section: v })}>
                    <SelectTrigger data-testid="select-section">
                      <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                    <SelectContent>
                      {['Morning', 'Afternoon', 'Saturday', 'Sunday'].map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(v: 'active' | 'inactive' | 'trial') => setFormData({ ...formData, status: v })}>
                    <SelectTrigger data-testid="select-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="trial">Trial Class</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="border-t pt-4 mt-2">
                <h4 className="font-medium mb-3">Parent/Guardian Information</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="parentName">Parent Name</Label>
                    <Input
                      id="parentName"
                      value={formData.parentName}
                      onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                      data-testid="input-parent-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parentEmail">Parent Email</Label>
                    <Input
                      id="parentEmail"
                      type="email"
                      value={formData.parentEmail}
                      onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                      data-testid="input-parent-email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parentPhone">Parent Phone</Label>
                    <Input
                      id="parentPhone"
                      value={formData.parentPhone}
                      onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                      data-testid="input-parent-phone"
                    />
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit} data-testid="button-save-student">
                {editingStudent ? 'Update' : 'Add'} Student
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
