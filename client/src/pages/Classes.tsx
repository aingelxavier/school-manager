import { useState } from 'react';
import { useStore } from '@/lib/store';
import { useClasses, useCreateClass, useUpdateClass, useDeleteClass, useTeachers, useSubjects, useCreateAuditLog } from '@/lib/hooks';
import type { Class } from '@shared/schema';
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
import { Plus, Pencil, Trash2, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Classes() {
  const { currentUser } = useStore();
  const { data: classes = [], isLoading } = useClasses();
  const { data: teachers = [] } = useTeachers();
  const { data: allSubjects = [] } = useSubjects();
  const createClass = useCreateClass();
  const updateClass = useUpdateClass();
  const deleteClass = useDeleteClass();
  const createAuditLog = useCreateAuditLog();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    grade: '',
    section: '',
    classTeacher: '',
    studentCount: 0,
    room: '',
    days: [] as string[],
    batchName: '',
    subjects: [] as string[],
    startTime: '',
    endTime: '',
  });

  const isAdmin = currentUser?.role === 'admin';
  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const resetForm = () => {
    setFormData({
      name: '',
      grade: '',
      section: '',
      classTeacher: '',
      studentCount: 0,
      room: '',
      days: [],
      batchName: '',
      subjects: [],
      startTime: '',
      endTime: '',
    });
    setEditingClass(null);
  };

  const handleDayToggle = (day: string) => {
    setFormData(prev => {
      const days = prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day];
      // Sort days based on weekDays order
      return {
        ...prev,
        days: days.sort((a, b) => weekDays.indexOf(a) - weekDays.indexOf(b))
      };
    });
  };

  const handleSubmit = () => {
    if (!formData.grade || !formData.room) {
      toast({ title: 'Error', description: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }

    let className = '';
    if (formData.batchName) {
      className = `${formData.batchName} (${formData.grade})`;
    } else {
      className = `Grade ${formData.grade}`;
    }
    
    if (formData.startTime && formData.endTime) {
      className += ` [${formData.startTime}-${formData.endTime}]`;
    }

    const data = { ...formData, name: className };

    if (editingClass) {
      updateClass.mutate({ id: editingClass.id, data }, {
        onSuccess: () => {
          createAuditLog.mutate({
            action: 'Class Updated',
            user: currentUser?.name || '',
            userRole: currentUser?.role || 'admin',
            details: `Updated class: ${className}`,
            timestamp: new Date().toISOString(),
            ip: '192.168.1.100',
          });
          toast({ title: 'Success', description: 'Class updated successfully' });
          setIsDialogOpen(false);
          resetForm();
        },
      });
    } else {
      createClass.mutate(data, {
        onSuccess: () => {
          createAuditLog.mutate({
            action: 'Class Added',
            user: currentUser?.name || '',
            userRole: currentUser?.role || 'admin',
            details: `Added new class: ${className}`,
            timestamp: new Date().toISOString(),
            ip: '192.168.1.100',
          });
          toast({ title: 'Success', description: 'Class added successfully' });
          setIsDialogOpen(false);
          resetForm();
        },
      });
    }
  };

  const handleEdit = (cls: Class) => {
    setEditingClass(cls);
    setFormData({
      name: cls.name,
      grade: cls.grade,
      section: cls.section,
      classTeacher: cls.classTeacher,
      studentCount: cls.studentCount,
      room: cls.room,
      days: cls.days || [],
      batchName: cls.batchName || '',
      subjects: cls.subjects || [],
      startTime: cls.startTime || '',
      endTime: cls.endTime || '',
    });
    setIsDialogOpen(true);
  };

  const addSubject = (subjectName: string) => {
    if (!formData.subjects.includes(subjectName)) {
      setFormData({
        ...formData,
        subjects: [...formData.subjects, subjectName]
      });
    }
  };

  const removeSubject = (subjectName: string) => {
    setFormData({
      ...formData,
      subjects: formData.subjects.filter(s => s !== subjectName)
    });
  };

  const handleDelete = (cls: Class) => {
    deleteClass.mutate(cls.id, {
      onSuccess: () => {
        createAuditLog.mutate({
          action: 'Class Deleted',
          user: currentUser?.name || '',
          userRole: currentUser?.role || 'admin',
          details: `Deleted class: ${cls.name}`,
          timestamp: new Date().toISOString(),
          ip: '192.168.1.100',
        });
        toast({ title: 'Success', description: 'Class deleted successfully' });
      },
    });
  };

  const columns = [
    { key: 'name', label: 'Class Name', sortable: true },
    { key: 'grade', label: 'Grade', sortable: true },
    { 
      key: 'time', 
      label: 'Time',
      render: (cls: Class) => (
        cls.startTime && cls.endTime ? (
          <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
            {cls.startTime} - {cls.endTime}
          </span>
        ) : <span className="text-muted-foreground">-</span>
      )
    },
    { key: 'classTeacher', label: 'Class Teacher' },
    {
      key: 'days',
      label: 'Schedule',
      render: (cls: Class) => (
        <div className="flex flex-wrap gap-1">
          {cls.days && cls.days.length > 0 ? (
            cls.days.map((day) => (
              <Badge key={day} variant="outline" className="text-xs">
                {day.substring(0, 3)}
              </Badge>
            ))
          ) : (
            <span className="text-muted-foreground text-sm">-</span>
          )}
        </div>
      ),
    },
    {
      key: 'studentCount',
      label: 'Students',
      render: (cls: Class) => (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span>{cls.studentCount}</span>
        </div>
      ),
    },
    { key: 'room', label: 'Room' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">Classes</h1>
            <p className="text-muted-foreground">Manage class sections and assignments</p>
          </div>
          {isAdmin && (
            <Button onClick={() => { resetForm(); setIsDialogOpen(true); }} data-testid="button-add-class">
              <Plus className="h-4 w-4 mr-2" />
              Add Class
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Loading classes...</div>
          </div>
        ) : (
          <DataTable
            data={classes}
            columns={columns}
            searchKeys={['name', 'classTeacher', 'room']}
            exportFileName="classes"
            actions={isAdmin ? (cls) => (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => handleEdit(cls)} data-testid={`button-edit-${cls.id}`}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(cls)} data-testid={`button-delete-${cls.id}`}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ) : undefined}
          />
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingClass ? 'Edit Class' : 'Add New Class'}</DialogTitle>
              <DialogDescription>
                {editingClass ? 'Update class information' : 'Enter the details for the new class'}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="batchName">Batch / Student Group Name</Label>
                <Input
                  id="batchName"
                  value={formData.batchName}
                  onChange={(e) => setFormData({ ...formData, batchName: e.target.value })}
                  placeholder="e.g., IIT Prep Batch A"
                  data-testid="input-batch-name"
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
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="classTeacher">Class Teacher</Label>
                <Select value={formData.classTeacher} onValueChange={(v) => setFormData({ ...formData, classTeacher: v })}>
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

              <div className="space-y-2">
                <Label>Subjects</Label>
                <Select onValueChange={addSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject to add" />
                  </SelectTrigger>
                  <SelectContent>
                    {allSubjects.map((s) => (
                      <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="room">Room *</Label>
                  <Input
                    id="room"
                    value={formData.room}
                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                    placeholder="e.g., Room 101"
                    data-testid="input-room"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="studentCount">Student Count</Label>
                  <Input
                    id="studentCount"
                    type="number"
                    value={formData.studentCount}
                    onChange={(e) => setFormData({ ...formData, studentCount: parseInt(e.target.value) || 0 })}
                    data-testid="input-student-count"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Class Days</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {weekDays.map((day) => (
                    <div key={day} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`day-${day}`} 
                        checked={formData.days.includes(day)}
                        onCheckedChange={() => handleDayToggle(day)}
                      />
                      <label
                        htmlFor={`day-${day}`}
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
              <Button onClick={handleSubmit} data-testid="button-save-class">
                {editingClass ? 'Update' : 'Add'} Class
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
