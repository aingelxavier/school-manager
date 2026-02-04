import { useStore } from '@/lib/store';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/StatCard';
import {
  Users,
  GraduationCap,
  BookOpen,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';

const monthlyEnrollment = [
  { month: 'Jul', students: 180 },
  { month: 'Aug', students: 195 },
  { month: 'Sep', students: 220 },
  { month: 'Oct', students: 218 },
  { month: 'Nov', students: 215 },
  { month: 'Dec', students: 210 },
  { month: 'Jan', students: 225 },
];

const attendanceTrend = [
  { week: 'Week 1', rate: 94 },
  { week: 'Week 2', rate: 92 },
  { week: 'Week 3', rate: 96 },
  { week: 'Week 4', rate: 91 },
  { week: 'Week 5', rate: 93 },
  { week: 'Week 6', rate: 95 },
];

const gradeDistribution = [
  { grade: 'A+', count: 45, color: '#22c55e' },
  { grade: 'A', count: 62, color: '#4ade80' },
  { grade: 'B+', count: 48, color: '#3b82f6' },
  { grade: 'B', count: 35, color: '#60a5fa' },
  { grade: 'C', count: 22, color: '#f59e0b' },
  { grade: 'D', count: 8, color: '#f97316' },
  { grade: 'F', count: 5, color: '#ef4444' },
];

const revenueData = [
  { month: 'Jul', revenue: 45000 },
  { month: 'Aug', revenue: 52000 },
  { month: 'Sep', revenue: 68000 },
  { month: 'Oct', revenue: 42000 },
  { month: 'Nov', revenue: 38000 },
  { month: 'Dec', revenue: 35000 },
  { month: 'Jan', revenue: 55000 },
];

const subjectPerformance = [
  { subject: 'Math', avg: 78 },
  { subject: 'English', avg: 82 },
  { subject: 'Physics', avg: 75 },
  { subject: 'Chemistry', avg: 71 },
  { subject: 'Biology', avg: 84 },
  { subject: 'History', avg: 79 },
  { subject: 'CS', avg: 88 },
];

export default function Analytics() {
  const { students, teachers, classes, fees } = useStore();

  const totalRevenue = fees.filter((f) => f.status === 'paid').reduce((sum, f) => sum + f.amount, 0);
  const pendingRevenue = fees.filter((f) => f.status !== 'paid').reduce((sum, f) => sum + f.amount, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold">Analytics</h1>
          <p className="text-muted-foreground">School performance insights and statistics</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Students"
            value={students.length}
            icon={<Users className="h-6 w-6" />}
            trend={{ value: 12, label: 'vs last year' }}
          />
          <StatCard
            title="Total Teachers"
            value={teachers.length}
            icon={<GraduationCap className="h-6 w-6" />}
            trend={{ value: 5, label: 'vs last year' }}
          />
          <StatCard
            title="Active Classes"
            value={classes.length}
            icon={<BookOpen className="h-6 w-6" />}
          />
          <StatCard
            title="Revenue (YTD)"
            value={`$${totalRevenue.toLocaleString()}`}
            icon={<DollarSign className="h-6 w-6" />}
            trend={{ value: 18, label: 'vs last year' }}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Enrollment Trend
              </CardTitle>
              <CardDescription>Student enrollment over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={monthlyEnrollment}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="students"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Attendance Rate</CardTitle>
              <CardDescription>Weekly attendance percentage</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={attendanceTrend}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="week" className="text-xs" />
                  <YAxis domain={[85, 100]} className="text-xs" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--chart-2))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Grade Distribution</CardTitle>
              <CardDescription>Overall student grade breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={gradeDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="count"
                      label={({ grade, count }) => `${grade}: ${count}`}
                    >
                      {gradeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Subject Performance</CardTitle>
              <CardDescription>Average scores by subject</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={subjectPerformance} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" domain={[0, 100]} className="text-xs" />
                  <YAxis dataKey="subject" type="category" width={60} className="text-xs" />
                  <Tooltip />
                  <Bar dataKey="avg" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Revenue Overview
            </CardTitle>
            <CardDescription>Monthly fee collection</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                <Bar dataKey="revenue" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600">92%</div>
                <p className="text-sm text-muted-foreground mt-1">Average Attendance</p>
                <div className="flex items-center justify-center gap-1 mt-2 text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm">+2.3% from last month</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">78%</div>
                <p className="text-sm text-muted-foreground mt-1">Average Grade</p>
                <div className="flex items-center justify-center gap-1 mt-2 text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm">+5.1% from last term</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-600">68%</div>
                <p className="text-sm text-muted-foreground mt-1">Fee Collection Rate</p>
                <div className="flex items-center justify-center gap-1 mt-2 text-red-600">
                  <TrendingDown className="h-4 w-4" />
                  <span className="text-sm">-3.2% from last month</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
