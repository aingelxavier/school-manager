import { useState } from 'react';
import { useStore } from '@/lib/store';
import { useAttendance, useStudents, useClasses, useCreateAttendanceRecord } from '@/lib/hooks';
import type { Attendance as AttendanceType } from '@shared/schema';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable } from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, parseISO } from 'date-fns';
import { CalendarIcon, Check, X, Clock, UserCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function Attendance() {
  const { currentUser } = useStore();
  const { data: attendance = [], isLoading: attendanceLoading } = useAttendance();
  const { data: students = [], isLoading: studentsLoading } = useStudents();
  const { data: classes = [], isLoading: classesLoading } = useClasses();
  const createAttendance = useCreateAttendanceRecord();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedClass, setSelectedClass] = useState('10-A');
  const [attendanceData, setAttendanceData] = useState<Record<string, 'present' | 'absent' | 'late' | 'excused'>>({});

  const isLoading = attendanceLoading || studentsLoading || classesLoading;
  const isTeacherOrAdmin = currentUser?.role === 'admin' || currentUser?.role === 'teacher';
  const isStudentOrParent = currentUser?.role === 'student' || currentUser?.role === 'parent';

  const classStudents = students.filter((s) => `${s.grade}-${s.section}` === selectedClass);

  const handleTakeAttendance = () => {
    const initialData: Record<string, 'present' | 'absent' | 'late' | 'excused'> = {};
    classStudents.forEach((s) => {
      initialData[s.id] = 'present';
    });
    setAttendanceData(initialData);
    setIsDialogOpen(true);
  };

  const handleSaveAttendance = () => {
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    
    Object.entries(attendanceData).forEach(([studentId, status]) => {
      const student = students.find((s) => s.id === studentId);
      if (student) {
        createAttendance.mutate({
          studentId,
          studentName: student.name,
          date: dateStr,
          status,
          class: selectedClass,
        });
      }
    });

    toast({ title: 'Success', description: 'Attendance recorded successfully' });
    setIsDialogOpen(false);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ReactNode }> = {
      present: { variant: 'default', icon: <Check className="h-3 w-3" /> },
      absent: { variant: 'destructive', icon: <X className="h-3 w-3" /> },
      late: { variant: 'secondary', icon: <Clock className="h-3 w-3" /> },
      excused: { variant: 'outline', icon: <UserCheck className="h-3 w-3" /> },
    };
    const config = variants[status] || variants.present;
    return (
      <Badge variant={config.variant} className="gap-1">
        {config.icon}
        {status}
      </Badge>
    );
  };

  const myAttendance = isStudentOrParent
    ? attendance.filter((a) => a.studentId === 's1')
    : attendance;

  const columns = [
    { key: 'studentName', label: 'Student', sortable: true },
    {
      key: 'date',
      label: 'Date',
      sortable: true,
      render: (record: AttendanceType) => format(parseISO(record.date), 'd MMM, yyyy'),
    },
    { key: 'class', label: 'Class' },
    {
      key: 'status',
      label: 'Status',
      render: (record: AttendanceType) => getStatusBadge(record.status),
    },
  ];

  const presentCount = myAttendance.filter((a) => a.status === 'present').length;
  const absentCount = myAttendance.filter((a) => a.status === 'absent').length;
  const lateCount = myAttendance.filter((a) => a.status === 'late').length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">Attendance</h1>
            <p className="text-muted-foreground">
              {isStudentOrParent ? 'View your attendance history' : 'Track and manage student attendance'}
            </p>
          </div>
          {isTeacherOrAdmin && (
            <div className="flex items-center gap-3">
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((c) => (
                    <SelectItem key={c.id} value={`${c.grade}-${c.section}`}>
                      Grade {c.grade}-{c.section}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleTakeAttendance} data-testid="button-take-attendance">
                <UserCheck className="h-4 w-4 mr-2" />
                Take Attendance
              </Button>
            </div>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">{presentCount}</div>
              <p className="text-sm text-muted-foreground">Present</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-600">{absentCount}</div>
              <p className="text-sm text-muted-foreground">Absent</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-yellow-600">{lateCount}</div>
              <p className="text-sm text-muted-foreground">Late</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-primary">
                {myAttendance.length > 0 ? Math.round((presentCount / myAttendance.length) * 100) : 0}%
              </div>
              <p className="text-sm text-muted-foreground">Attendance Rate</p>
            </CardContent>
          </Card>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Loading attendance...</div>
          </div>
        ) : (
          <DataTable
            data={myAttendance}
            columns={columns}
            searchKeys={['studentName', 'date']}
            exportFileName="attendance"
          />
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Take Attendance</DialogTitle>
              <DialogDescription>
                Record attendance for {selectedClass} on {format(selectedDate, 'd MMMM, yyyy')}
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <div className="flex items-center gap-4 mb-6">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn('w-[240px] justify-start text-left font-normal')}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(selectedDate, 'd MMMM, yyyy')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {classStudents.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                      <span className="font-medium">{student.name}</span>
                      <div className="flex gap-2">
                      {(['present', 'absent', 'late', 'excused'] as const).map((status) => (
                        <Button
                          key={status}
                          size="sm"
                          variant={attendanceData[student.id] === status ? 'default' : 'outline'}
                          onClick={() => setAttendanceData({ ...attendanceData, [student.id]: status })}
                          className="capitalize"
                        >
                          {status}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveAttendance} data-testid="button-save-attendance">
                Save Attendance
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
