import type {
  Student, Teacher, Class, Subject, Timetable, Attendance, Grade,
  Assignment, Fee, Announcement, Message, AuditLog, Task, User,
  InsertStudent, InsertTeacher, InsertClass, InsertSubject, InsertTimetable,
  InsertAttendance, InsertGrade, InsertAssignment, InsertFee,
  InsertAnnouncement, InsertMessage, InsertAuditLog, InsertTask
} from "@shared/schema";

const API_BASE = "/api";

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export const api = {
  auth: {
    login: (email: string, role: string) =>
      fetchAPI<{ user: User }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, role }),
      }),
  },

  students: {
    getAll: () => fetchAPI<Student[]>("/students"),
    getById: (id: string) => fetchAPI<Student>(`/students/${id}`),
    create: (data: InsertStudent) =>
      fetchAPI<Student>("/students", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<InsertStudent>) =>
      fetchAPI<Student>(`/students/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      fetchAPI<void>(`/students/${id}`, {
        method: "DELETE",
      }),
  },

  teachers: {
    getAll: () => fetchAPI<Teacher[]>("/teachers"),
    create: (data: InsertTeacher) =>
      fetchAPI<Teacher>("/teachers", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<InsertTeacher>) =>
      fetchAPI<Teacher>(`/teachers/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      fetchAPI<void>(`/teachers/${id}`, {
        method: "DELETE",
      }),
  },

  classes: {
    getAll: () => fetchAPI<Class[]>("/classes"),
    create: (data: InsertClass) =>
      fetchAPI<Class>("/classes", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<InsertClass>) =>
      fetchAPI<Class>(`/classes/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      fetchAPI<void>(`/classes/${id}`, {
        method: "DELETE",
      }),
  },

  subjects: {
    getAll: () => fetchAPI<Subject[]>("/subjects"),
    create: (data: InsertSubject) =>
      fetchAPI<Subject>("/subjects", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<InsertSubject>) =>
      fetchAPI<Subject>(`/subjects/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      fetchAPI<void>(`/subjects/${id}`, {
        method: "DELETE",
      }),
  },

  timetable: {
    getAll: () => fetchAPI<Timetable[]>("/timetable"),
    create: (data: InsertTimetable) =>
      fetchAPI<Timetable>("/timetable", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<InsertTimetable>) =>
      fetchAPI<Timetable>(`/timetable/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      fetchAPI<void>(`/timetable/${id}`, {
        method: "DELETE",
      }),
  },

  attendance: {
    getAll: () => fetchAPI<Attendance[]>("/attendance"),
    create: (data: InsertAttendance) =>
      fetchAPI<Attendance>("/attendance", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<InsertAttendance>) =>
      fetchAPI<Attendance>(`/attendance/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
  },

  grades: {
    getAll: () => fetchAPI<Grade[]>("/grades"),
    create: (data: InsertGrade) =>
      fetchAPI<Grade>("/grades", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<InsertGrade>) =>
      fetchAPI<Grade>(`/grades/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
  },

  assignments: {
    getAll: () => fetchAPI<Assignment[]>("/assignments"),
    create: (data: InsertAssignment) =>
      fetchAPI<Assignment>("/assignments", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<InsertAssignment>) =>
      fetchAPI<Assignment>(`/assignments/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      fetchAPI<void>(`/assignments/${id}`, {
        method: "DELETE",
      }),
  },

  fees: {
    getAll: () => fetchAPI<Fee[]>("/fees"),
    create: (data: InsertFee) =>
      fetchAPI<Fee>("/fees", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<InsertFee>) =>
      fetchAPI<Fee>(`/fees/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
  },

  announcements: {
    getAll: () => fetchAPI<Announcement[]>("/announcements"),
    create: (data: InsertAnnouncement) =>
      fetchAPI<Announcement>("/announcements", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<InsertAnnouncement>) =>
      fetchAPI<Announcement>(`/announcements/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      fetchAPI<void>(`/announcements/${id}`, {
        method: "DELETE",
      }),
  },

  messages: {
    getAll: () => fetchAPI<Message[]>("/messages"),
    create: (data: InsertMessage) =>
      fetchAPI<Message>("/messages", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    markAsRead: (id: string) =>
      fetchAPI<void>(`/messages/${id}/read`, {
        method: "PATCH",
      }),
  },

  auditLogs: {
    getAll: () => fetchAPI<AuditLog[]>("/audit-logs"),
    create: (data: InsertAuditLog) =>
      fetchAPI<AuditLog>("/audit-logs", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },

  tasks: {
    getAll: () => fetchAPI<Task[]>("/tasks"),
    create: (data: InsertTask) =>
      fetchAPI<Task>("/tasks", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<InsertTask>) =>
      fetchAPI<Task>(`/tasks/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      fetchAPI<void>(`/tasks/${id}`, {
        method: "DELETE",
      }),
  },
};
