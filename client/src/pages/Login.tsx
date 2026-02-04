import { useStore, UserRole } from '@/lib/store';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { OnboardingModal } from '@/components/OnboardingModal';
import { Shield, GraduationCap, Users, BookOpen } from 'lucide-react';

const roles: { role: UserRole; label: string; icon: React.ReactNode; color: string }[] = [
  { role: 'admin', label: 'Administrator', icon: <Shield className="h-6 w-6" />, color: 'bg-red-500 hover:bg-red-600' },
  { role: 'teacher', label: 'Teacher', icon: <GraduationCap className="h-6 w-6" />, color: 'bg-blue-500 hover:bg-blue-600' },
  { role: 'student', label: 'Student', icon: <BookOpen className="h-6 w-6" />, color: 'bg-green-500 hover:bg-green-600' },
  { role: 'parent', label: 'Parent', icon: <Users className="h-6 w-6" />, color: 'bg-purple-500 hover:bg-purple-600' },
];

export default function Login() {
  const { login } = useStore();
  const [, setLocation] = useLocation();

  const handleLogin = (role: UserRole) => {
    login(role);
    setLocation('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center p-4">
      <OnboardingModal />
      
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-bold text-2xl mb-4 shadow-lg">
            E
          </div>
          <h1 className="text-3xl font-display font-bold" data-testid="text-app-title">EduManage</h1>
          <p className="text-muted-foreground mt-2" data-testid="text-app-subtitle">School Management System</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl" data-testid="text-welcome-title">Welcome to EduManage</CardTitle>
            <CardDescription data-testid="text-welcome-description">
              This is a demo of a comprehensive school management system. Choose a role below to explore different features.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="rounded-lg border bg-muted/20 p-3" data-testid="card-demo-accounts">
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground" data-testid="text-demo-accounts-title">Demo Accounts</div>
              <div className="mt-2 grid gap-2 text-sm">
                <div className="flex items-center justify-between gap-3" data-testid="row-demo-admin">
                  <span className="font-medium">Admin</span>
                  <span className="text-muted-foreground">admin@edumanage.com</span>
                </div>
                <div className="flex items-center justify-between gap-3" data-testid="row-demo-teacher">
                  <span className="font-medium">Teacher</span>
                  <span className="text-muted-foreground">j.wilson@edumanage.com</span>
                </div>
                <div className="flex items-center justify-between gap-3" data-testid="row-demo-student">
                  <span className="font-medium">Student</span>
                  <span className="text-muted-foreground">e.chen@student.edumanage.com</span>
                </div>
                <div className="flex items-center justify-between gap-3" data-testid="row-demo-parent">
                  <span className="font-medium">Parent</span>
                  <span className="text-muted-foreground">m.chen@parent.edumanage.com</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {roles.map(({ role, label, icon, color }) => (
                <Button
                  key={role}
                  variant="secondary"
                  className={`w-full h-14 justify-start gap-4 text-white ${color} transition-all hover:scale-[1.02]`}
                  onClick={() => handleLogin(role)}
                  data-testid={`button-login-${role}`}
                >
                  <div className="p-1.5 rounded-lg bg-white/20">
                    {icon}
                  </div>
                  <div className="flex flex-col items-start leading-tight">
                    <span className="font-medium text-base">{label}</span>
                    <span className="text-xs text-white/80">Continue as {label.toLowerCase()}</span>
                  </div>
                </Button>
              ))}
            </div>

            <div className="rounded-lg border bg-card p-3" data-testid="card-role-details">
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground" data-testid="text-role-details-title">Role Access (Demo)</div>
              <div className="mt-2 space-y-2 text-sm text-muted-foreground">
                <p data-testid="text-role-admin">Admin: Full system access — manage users, classes, fees, settings, analytics; assign teacher to student.</p>
                <p data-testid="text-role-teacher">Teacher: Take attendance, enter grades, post assignments, message parents/students; track fees received for assigned students.</p>
                <p data-testid="text-role-student">Student: View timetable, attendance, grades, assignments, fee status.</p>
                <p data-testid="text-role-parent">Parent: Monitor child’s progress, attendance, grades; communicate with teachers.</p>
              </div>
            </div>

            <div className="rounded-lg border bg-muted/10 p-3" data-testid="card-key-features">
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground" data-testid="text-key-features-title">Key Features</div>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground list-disc pl-5">
                <li data-testid="text-feature-roles">Role-based access with different dashboards and permissions</li>
                <li data-testid="text-feature-crud">CRUD for students, teachers, classes, and subjects</li>
                <li data-testid="text-feature-academics">Attendance tracking, grade management, assignments</li>
                <li data-testid="text-feature-fees">Fee tracking, announcements, messaging</li>
                <li data-testid="text-feature-tools">Search, filter, pagination, CSV export for tables</li>
                <li data-testid="text-feature-audit">Admin audit logs and basic analytics</li>
              </ul>
            </div>

            <p className="text-center text-xs text-muted-foreground" data-testid="text-demo-note">
              Demo data only — no real authentication required.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
