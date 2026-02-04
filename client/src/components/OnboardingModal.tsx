import { useStore } from '@/lib/store';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, GraduationCap, Users, BookOpen } from 'lucide-react';

export function OnboardingModal() {
  const { showOnboarding, dismissOnboarding } = useStore();

  const demoAccounts = [
    {
      role: 'Admin',
      icon: <Shield className="h-5 w-5" />,
      email: 'admin@edumanage.com',
      description: 'Full system access: manage users, classes, fees, settings, and view analytics.',
      color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    },
    {
      role: 'Teacher',
      icon: <GraduationCap className="h-5 w-5" />,
      email: 'j.wilson@edumanage.com',
      description: 'Take attendance, enter grades, post assignments, and message parents/students.',
      color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    },
    {
      role: 'Student',
      icon: <BookOpen className="h-5 w-5" />,
      email: 'e.chen@student.edumanage.com',
      description: 'View timetable, attendance, grades, assignments, and fee status.',
      color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    },
    {
      role: 'Parent',
      icon: <Users className="h-5 w-5" />,
      email: 'm.chen@parent.edumanage.com',
      description: 'Monitor child\'s progress, attendance, grades, and communicate with teachers.',
      color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    },
  ];

  return (
    <Dialog open={showOnboarding} onOpenChange={(open) => !open && dismissOnboarding()}>
      <DialogContent className="max-w-2xl" data-testid="onboarding-modal">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display">Welcome to EduManage</DialogTitle>
          <DialogDescription className="text-base">
            This is a demo of a comprehensive school management system. Choose a role below to explore different features.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <h3 className="font-semibold text-lg">Demo Accounts</h3>
          <div className="grid gap-3">
            {demoAccounts.map((account) => (
              <div
                key={account.role}
                className="flex items-start gap-4 p-4 rounded-xl border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className={`p-2 rounded-lg ${account.color}`}>
                  {account.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{account.role}</span>
                    <Badge variant="secondary" className="text-xs">
                      {account.email}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{account.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-muted/50 rounded-lg p-4 mt-6">
            <h4 className="font-medium mb-2">Key Features</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Role-based access with different dashboards and permissions</li>
              <li>• CRUD operations for students, teachers, classes, and subjects</li>
              <li>• Attendance tracking, grade management, and assignments</li>
              <li>• Fee tracking, announcements, and messaging system</li>
              <li>• Search, filter, pagination, and CSV export for data tables</li>
              <li>• Admin audit logs and basic analytics</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button onClick={dismissOnboarding} data-testid="button-get-started">
            Get Started
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
