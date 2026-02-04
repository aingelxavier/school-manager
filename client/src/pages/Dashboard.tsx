import { useStore } from '@/lib/store';
import { useStudents, useTeachers, useClasses, useFees, useAnnouncements, useTasks, useAssignments, useAttendance, useGrades, useTimetable } from '@/lib/hooks';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/StatCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  GraduationCap,
  BookOpen,
  IndianRupee,
  Calendar,
  ClipboardCheck,
  FileText,
  Bell,
  TrendingUp,
  Clock,
  CheckSquare,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { format, parseISO } from 'date-fns';

const attendanceData = [
  { day: 'Mon', present: 92, absent: 8 },
  { day: 'Tue', present: 88, absent: 12 },
  { day: 'Wed', present: 95, absent: 5 },
  { day: 'Thu', present: 90, absent: 10 },
  { day: 'Fri', present: 87, absent: 13 },
];

const feeData = [
  { name: 'Paid', value: 68, color: '#22c55e' },
  { name: 'Pending', value: 22, color: '#f59e0b' },
  { name: 'Overdue', value: 10, color: '#ef4444' },
];

function AdminDashboard() {
  const { currentUser } = useStore();
  const { data: students = [] } = useStudents();
  const { data: teachers = [] } = useTeachers();
  const { data: classes = [] } = useClasses();
  const { data: fees = [] } = useFees();
  const { data: announcements = [] } = useAnnouncements();
  const { data: tasks = [] } = useTasks();

  const paidFees = fees.filter(f => f.status === 'paid');
  const totalRevenue = paidFees.reduce((sum, f) => sum + parseFloat(f.amount), 0);

  const myTasks = tasks.filter(t => t.assignedTo === currentUser?.id && t.status !== 'completed');
  const upcomingTasks = myTasks.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your school.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Students"
          value={students.length}
          icon={<Users className="h-6 w-6" />}
          trend={{ value: 12, label: 'from last month' }}
        />
        <StatCard
          title="Total Teachers"
          value={teachers.length}
          icon={<GraduationCap className="h-6 w-6" />}
          trend={{ value: 5, label: 'from last month' }}
        />
        <StatCard
          title="Active Classes"
          value={classes.length}
          icon={<BookOpen className="h-6 w-6" />}
        />
        <StatCard
          title="Revenue (This Month)"
          value={`₹${totalRevenue.toLocaleString()}`}
          icon={<IndianRupee className="h-6 w-6" />}
          trend={{ value: 8, label: 'from last month' }}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5" />
              Weekly Attendance
            </CardTitle>
            <CardDescription>Student attendance rate this week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="day" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Bar dataKey="present" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5" />
              My Tasks
            </CardTitle>
            <CardDescription>Your upcoming tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingTasks.length === 0 ? (
                <p className="text-sm text-muted-foreground">No pending tasks.</p>
            ) : (
                upcomingTasks.map(task => (
                    <div key={task.id} className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                        <div className={`mt-1 h-2 w-2 rounded-full ${
                            task.priority === 'high' ? 'bg-red-500' : 
                            task.priority === 'medium' ? 'bg-orange-500' : 'bg-green-500'
                        }`} />
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{task.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {format(parseISO(task.dueDate), 'd MMM')}
                                </span>
                                <Badge variant="outline" className="text-[10px] px-1 h-4">{task.priority}</Badge>
                            </div>
                        </div>
                    </div>
                ))
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IndianRupee className="h-5 w-5" />
              Fee Collection Status
            </CardTitle>
            <CardDescription>Overview of fee payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={feeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {feeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              {feeData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm">{item.name}: {item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Recent Announcements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {announcements.slice(0, 3).map((ann) => (
              <div key={ann.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className={`h-2 w-2 rounded-full mt-2 ${
                  ann.priority === 'high' ? 'bg-red-500' : ann.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{ann.title}</p>
                  <p className="text-sm text-muted-foreground">{format(parseISO(ann.date), 'd MMM, yyyy')}</p>
                </div>
                <Badge variant={ann.priority === 'high' ? 'destructive' : 'secondary'}>
                  {ann.priority}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Quick Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">Attendance Rate</span>
                <span className="text-sm font-medium">92%</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">Fee Collection</span>
                <span className="text-sm font-medium">68%</span>
              </div>
              <Progress value={68} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">Assignment Completion</span>
                <span className="text-sm font-medium">85%</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">Parent Engagement</span>
                <span className="text-sm font-medium">73%</span>
              </div>
              <Progress value={73} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TeacherDashboard() {
  const { currentUser } = useStore();
  const { data: assignments = [] } = useAssignments();
  const { data: attendance = [] } = useAttendance();
  const { data: tasks = [] } = useTasks();

  const todayAttendance = attendance.filter(a => a.date === '2026-01-08');
  const pendingAssignments = assignments.filter(a => a.status === 'pending');
  
  const myTasks = tasks.filter(t => t.assignedTo === currentUser?.id && t.status !== 'completed');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Teacher Dashboard</h1>
        <p className="text-muted-foreground">Manage your classes and track student progress.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="My Classes"
          value={3}
          icon={<BookOpen className="h-6 w-6" />}
        />
        <StatCard
          title="Today's Attendance"
          value={`${todayAttendance.length} recorded`}
          icon={<ClipboardCheck className="h-6 w-6" />}
        />
        <StatCard
          title="Pending Tasks"
          value={myTasks.length}
          icon={<CheckSquare className="h-6 w-6" />}
        />
        <StatCard
          title="Upcoming Classes"
          value={4}
          icon={<Calendar className="h-6 w-6" />}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
            <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Today's Schedule
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {[
                { time: '08:00 - 09:00', subject: 'Mathematics', class: '10-A', room: 'Room 101' },
                { time: '09:00 - 10:00', subject: 'Physics', class: '11-A', room: 'Lab 1' },
                { time: '10:15 - 11:15', subject: 'Mathematics', class: '12-A', room: 'Room 301' },
                { time: '11:15 - 12:15', subject: 'Physics', class: '10-A', room: 'Lab 1' },
                ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg border bg-card">
                    <div className="text-sm font-medium text-muted-foreground w-28">{item.time}</div>
                    <div className="flex-1">
                    <p className="font-medium">{item.subject}</p>
                    <p className="text-sm text-muted-foreground">{item.class} • {item.room}</p>
                    </div>
                </div>
                ))}
            </CardContent>
            </Card>

            <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Pending Assignments
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {pendingAssignments.slice(0, 4).map((assignment) => (
                <div key={assignment.id} className="flex items-center gap-4 p-3 rounded-lg border bg-card">
                    <div className="flex-1">
                    <p className="font-medium">{assignment.title}</p>
                    <p className="text-sm text-muted-foreground">{assignment.subject} • {assignment.class}</p>
                    </div>
                    <div className="text-right">
                    <p className="text-sm font-medium">{assignment.submissions ?? 0}/{assignment.totalStudents}</p>
                    <p className="text-xs text-muted-foreground">submitted</p>
                    </div>
                </div>
                ))}
            </CardContent>
            </Card>
        </div>

        <div>
            <Card className="h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5" />
                My Tasks
                </CardTitle>
                <CardDescription>Your to-do list</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {myTasks.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No pending tasks.</p>
                ) : (
                    myTasks.slice(0, 5).map(task => (
                        <div key={task.id} className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                            <div className={`mt-1 h-2 w-2 rounded-full ${
                                task.priority === 'high' ? 'bg-red-500' : 
                                task.priority === 'medium' ? 'bg-orange-500' : 'bg-green-500'
                            }`} />
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">{task.title}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {format(parseISO(task.dueDate), 'MMM d')}
                                    </span>
                                    <Badge variant="outline" className="text-[10px] px-1 h-4">{task.priority}</Badge>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

function StudentDashboard() {
  const { currentUser } = useStore();
  const { data: timetable = [] } = useTimetable();
  const { data: assignments = [] } = useAssignments();
  const { data: grades = [] } = useGrades();
  const { data: attendance = [] } = useAttendance();
  const { data: fees = [] } = useFees();
  const { data: tasks = [] } = useTasks();

  const myGrades = grades.filter(g => g.studentId === 's1');
  const myAttendance = attendance.filter(a => a.studentId === 's1');
  const presentDays = myAttendance.filter(a => a.status === 'present').length;
  const attendanceRate = myAttendance.length > 0 ? Math.round((presentDays / myAttendance.length) * 100) : 0;
  const avgGrade = myGrades.length > 0 
    ? Math.round(myGrades.reduce((sum, g) => sum + g.score, 0) / myGrades.length)
    : 0;

  const pendingAssignments = assignments.filter(a => a.status === 'pending');
  const myFees = fees.filter(f => f.studentId === 's1');
  const pendingFees = myFees.filter(f => f.status === 'pending' || f.status === 'overdue');
  
  const myTasks = tasks.filter(t => t.assignedTo === currentUser?.id && t.status !== 'completed');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">My Dashboard</h1>
        <p className="text-muted-foreground">Track your academic progress and stay updated.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Average Grade"
          value={`${avgGrade}%`}
          icon={<FileText className="h-6 w-6" />}
        />
        <StatCard
          title="Attendance Rate"
          value={`${attendanceRate}%`}
          icon={<ClipboardCheck className="h-6 w-6" />}
        />
        <StatCard
          title="Pending Tasks"
          value={myTasks.length}
          icon={<CheckSquare className="h-6 w-6" />}
        />
        <StatCard
          title="Pending Fees"
          value={pendingFees.length}
          icon={<IndianRupee className="h-6 w-6" />}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Today's Classes
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {timetable.filter(t => t.day === 'Monday').slice(0, 4).map((entry) => (
                    <div key={entry.id} className="flex items-center gap-4 p-3 rounded-lg border bg-card">
                        <div className="text-sm font-medium text-muted-foreground w-28">
                        {entry.startTime} - {entry.endTime}
                        </div>
                        <div className="flex-1">
                        <p className="font-medium">{entry.subject}</p>
                        <p className="text-sm text-muted-foreground">{entry.teacher} • {entry.room}</p>
                        </div>
                    </div>
                    ))}
                </CardContent>
                </Card>

                <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Recent Grades
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {myGrades.slice(0, 4).map((grade) => (
                    <div key={grade.id} className="flex items-center gap-4 p-3 rounded-lg border bg-card">
                        <div className="flex-1">
                        <p className="font-medium">{grade.subject}</p>
                        <p className="text-sm text-muted-foreground">{grade.term}</p>
                        </div>
                        <div className="text-right">
                        <Badge variant={grade.score >= 80 ? 'default' : grade.score >= 60 ? 'secondary' : 'destructive'}>
                            {grade.grade}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">{grade.score}/{grade.maxScore}</p>
                        </div>
                    </div>
                    ))}
                </CardContent>
                </Card>
            </div>
        </div>

        <div>
            <Card className="h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5" />
                My Tasks
                </CardTitle>
                <CardDescription>Your to-do list</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {myTasks.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No pending tasks.</p>
                ) : (
                    myTasks.slice(0, 5).map(task => (
                        <div key={task.id} className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                            <div className={`mt-1 h-2 w-2 rounded-full ${
                                task.priority === 'high' ? 'bg-red-500' : 
                                task.priority === 'medium' ? 'bg-orange-500' : 'bg-green-500'
                            }`} />
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">{task.title}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {format(parseISO(task.dueDate), 'MMM d')}
                                    </span>
                                    <Badge variant="outline" className="text-[10px] px-1 h-4">{task.priority}</Badge>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </CardContent>
            </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Upcoming Assignments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {pendingAssignments.slice(0, 4).map((assignment) => (
              <div key={assignment.id} className="p-4 rounded-lg border bg-card">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium">{assignment.title}</h4>
                  <Badge variant="outline">{assignment.subject}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{assignment.description}</p>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Due: {assignment.dueDate}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ParentDashboard() {
  const { data: grades = [] } = useGrades();
  const { data: attendance = [] } = useAttendance();
  const { data: fees = [] } = useFees();
  const { data: announcements = [] } = useAnnouncements();

  const childGrades = grades.filter(g => g.studentId === 's1');
  const childAttendance = attendance.filter(a => a.studentId === 's1');
  const presentDays = childAttendance.filter(a => a.status === 'present').length;
  const attendanceRate = childAttendance.length > 0 ? Math.round((presentDays / childAttendance.length) * 100) : 0;
  const childFees = fees.filter(f => f.studentId === 's1');
  const pendingFees = childFees.filter(f => f.status === 'pending' || f.status === 'overdue');
  const totalPending = pendingFees.reduce((sum, f) => sum + parseFloat(f.amount), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Parent Dashboard</h1>
        <p className="text-muted-foreground">Monitor your child's academic progress.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Attendance Rate"
          value={`${attendanceRate}%`}
          icon={<ClipboardCheck className="h-6 w-6" />}
        />
        <StatCard
          title="Grades Recorded"
          value={childGrades.length}
          icon={<FileText className="h-6 w-6" />}
        />
        <StatCard
          title="Pending Fees"
          value={`₹${totalPending.toLocaleString()}`}
          icon={<IndianRupee className="h-6 w-6" />}
        />
        <StatCard
          title="Announcements"
          value={announcements.length}
          icon={<Bell className="h-6 w-6" />}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Grades
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {childGrades.slice(0, 5).map((grade) => (
              <div key={grade.id} className="flex items-center gap-4 p-3 rounded-lg border bg-card">
                <div className="flex-1">
                  <p className="font-medium">{grade.subject}</p>
                  <p className="text-sm text-muted-foreground">{grade.term}</p>
                </div>
                <div className="text-right">
                  <Badge variant={grade.score >= 80 ? 'default' : grade.score >= 60 ? 'secondary' : 'destructive'}>
                    {grade.grade}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">{grade.score}/{grade.maxScore}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Recent Announcements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {announcements.slice(0, 4).map((ann) => (
              <div key={ann.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className={`h-2 w-2 rounded-full mt-2 ${
                  ann.priority === 'high' ? 'bg-red-500' : ann.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{ann.title}</p>
                  <p className="text-sm text-muted-foreground">{format(parseISO(ann.date), 'd MMM, yyyy')}</p>
                </div>
                <Badge variant={ann.priority === 'high' ? 'destructive' : 'secondary'}>
                  {ann.priority}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { currentUser } = useStore();

  const getDashboard = () => {
    switch (currentUser?.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'teacher':
        return <TeacherDashboard />;
      case 'student':
        return <StudentDashboard />;
      case 'parent':
        return <ParentDashboard />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <DashboardLayout>
      {getDashboard()}
    </DashboardLayout>
  );
}
