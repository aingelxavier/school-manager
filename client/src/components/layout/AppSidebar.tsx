import { Link, useLocation } from 'wouter';
import { useStore } from '@/lib/store';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  ClipboardCheck,
  FileText,
  IndianRupee,
  Bell,
  MessageSquare,
  Settings,
  BarChart3,
  History,
  School,
  LogOut,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles: string[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="h-5 w-5" />, roles: ['admin', 'teacher', 'student', 'parent'] },
  { label: 'Tasks', href: '/tasks', icon: <ClipboardCheck className="h-5 w-5" />, roles: ['admin', 'teacher', 'student', 'parent'] },
  { label: 'Students', href: '/students', icon: <Users className="h-5 w-5" />, roles: ['admin', 'teacher'] },
  { label: 'Teachers', href: '/teachers', icon: <GraduationCap className="h-5 w-5" />, roles: ['admin'] },
  { label: 'Classes', href: '/classes', icon: <School className="h-5 w-5" />, roles: ['admin', 'teacher'] },
  { label: 'Subjects', href: '/subjects', icon: <BookOpen className="h-5 w-5" />, roles: ['admin', 'teacher'] },
  { label: 'Timetable', href: '/timetable', icon: <Calendar className="h-5 w-5" />, roles: ['admin', 'teacher', 'student', 'parent'] },
  { label: 'Attendance', href: '/attendance', icon: <ClipboardCheck className="h-5 w-5" />, roles: ['admin', 'teacher', 'student', 'parent'] },
  { label: 'Grades', href: '/grades', icon: <FileText className="h-5 w-5" />, roles: ['admin', 'teacher', 'student', 'parent'] },
  { label: 'Assignments', href: '/assignments', icon: <BookOpen className="h-5 w-5" />, roles: ['admin', 'teacher', 'student', 'parent'] },
  { label: 'Fees', href: '/fees', icon: <IndianRupee className="h-5 w-5" />, roles: ['admin', 'student', 'parent'] },
  { label: 'Announcements', href: '/announcements', icon: <Bell className="h-5 w-5" />, roles: ['admin', 'teacher', 'student', 'parent'] },
  { label: 'Messages', href: '/messages', icon: <MessageSquare className="h-5 w-5" />, roles: ['admin', 'teacher', 'student', 'parent'] },
  { label: 'Analytics', href: '/analytics', icon: <BarChart3 className="h-5 w-5" />, roles: ['admin'] },
  { label: 'Audit Logs', href: '/audit-logs', icon: <History className="h-5 w-5" />, roles: ['admin'] },
  { label: 'Settings', href: '/settings', icon: <Settings className="h-5 w-5" />, roles: ['admin'] },
];

interface AppSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AppSidebar({ isOpen, onClose }: AppSidebarProps) {
  const [location] = useLocation();
  const { currentUser, logout } = useStore();

  if (!currentUser) return null;

  const filteredItems = navItems.filter((item) => item.roles.includes(currentUser.role));

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleNavClick = () => {
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-sidebar text-sidebar-foreground flex flex-col w-64 transition-transform duration-300',
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      )}
      data-testid="sidebar"
    >
      <div className="flex items-center justify-between gap-3 p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground font-bold text-lg">
            E
          </div>
          <div>
            <h1 className="font-display font-bold text-lg">School Name</h1>
            <p className="text-xs text-sidebar-foreground/60">School Management</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={onClose}
          data-testid="button-close-sidebar"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-1 px-2">
          {filteredItems.map((item) => {
            const isActive = location === item.href || (item.href !== '/dashboard' && location.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} onClick={handleNavClick}>
                <div
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer',
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  )}
                  data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 bg-sidebar-accent">
            <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground text-sm">
              {getInitials(currentUser.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{currentUser.name}</p>
            <p className="text-xs text-sidebar-foreground/60 capitalize">{currentUser.role}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={handleLogout}
            data-testid="button-logout"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
