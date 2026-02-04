import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Students from "@/pages/Students";
import Teachers from "@/pages/Teachers";
import Classes from "@/pages/Classes";
import Subjects from "@/pages/Subjects";
import Timetable from "@/pages/Timetable";
import Attendance from "@/pages/Attendance";
import Grades from "@/pages/Grades";
import Assignments from "@/pages/Assignments";
import Fees from "@/pages/Fees";
import Announcements from "@/pages/Announcements";
import Messages from "@/pages/Messages";
import Analytics from "@/pages/Analytics";
import AuditLogs from "@/pages/AuditLogs";
import Settings from "@/pages/Settings";
import Tasks from "@/pages/Tasks";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Login} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/students" component={Students} />
      <Route path="/teachers" component={Teachers} />
      <Route path="/classes" component={Classes} />
      <Route path="/subjects" component={Subjects} />
      <Route path="/timetable" component={Timetable} />
      <Route path="/attendance" component={Attendance} />
      <Route path="/grades" component={Grades} />
      <Route path="/assignments" component={Assignments} />
      <Route path="/fees" component={Fees} />
      <Route path="/announcements" component={Announcements} />
      <Route path="/messages" component={Messages} />
      <Route path="/tasks" component={Tasks} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/audit-logs" component={AuditLogs} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
