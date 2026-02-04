import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, decimal, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: varchar("role", { length: 20 }).notNull(), // admin, teacher, student, parent
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Students table
export const students = pgTable("students", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  grade: text("grade").notNull(),
  section: text("section").notNull(),
  parentName: text("parent_name"),
  parentEmail: text("parent_email"),
  parentPhone: text("parent_phone"),
  enrollmentDate: text("enrollment_date"),
  status: varchar("status", { length: 20 }).notNull().default('active'),
  schoolName: text("school_name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Teachers table
export const teachers = pgTable("teachers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subjects: text("subjects").array().notNull().default(sql`'{}'::text[]`),
  classes: text("classes").array().notNull().default(sql`'{}'::text[]`),
  availableDays: text("available_days").array(),
  joinDate: text("join_date"),
  status: varchar("status", { length: 20 }).notNull().default('active'),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Classes table
export const classes = pgTable("classes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  grade: text("grade").notNull(),
  section: text("section").notNull(),
  classTeacher: text("class_teacher").notNull(),
  studentCount: integer("student_count").notNull().default(0),
  room: text("room"),
  days: text("days").array(),
  batchName: text("batch_name"),
  subjects: text("subjects").array(),
  startTime: text("start_time"),
  endTime: text("end_time"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Subjects table
export const subjects = pgTable("subjects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  grade: text("grade").notNull(),
  teacher: text("teacher").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Timetable entries
export const timetable = pgTable("timetable", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  day: text("day").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  subject: text("subject").notNull(),
  teacher: text("teacher").notNull(),
  class: text("class").notNull(),
  room: text("room"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Attendance records
export const attendance = pgTable("attendance", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").notNull(),
  studentName: text("student_name").notNull(),
  date: text("date").notNull(),
  status: varchar("status", { length: 20 }).notNull(),
  class: text("class").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Grades table
export const grades = pgTable("grades", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").notNull(),
  studentName: text("student_name").notNull(),
  subject: text("subject").notNull(),
  term: text("term").notNull(),
  score: integer("score").notNull(),
  maxScore: integer("max_score").notNull(),
  grade: text("grade").notNull(),
  remarks: text("remarks"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Assignments table
export const assignments = pgTable("assignments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  subject: text("subject").notNull(),
  class: text("class").notNull(),
  teacher: text("teacher").notNull(),
  dueDate: text("due_date").notNull(),
  description: text("description"),
  status: varchar("status", { length: 20 }).notNull().default('pending'),
  submissions: integer("submissions").default(0),
  totalStudents: integer("total_students"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Fees table
export const fees = pgTable("fees", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").notNull(),
  studentName: text("student_name").notNull(),
  type: text("type").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  dueDate: text("due_date").notNull(),
  status: varchar("status", { length: 20 }).notNull().default('pending'),
  paidDate: text("paid_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Announcements table
export const announcements = pgTable("announcements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  author: text("author").notNull(),
  authorRole: varchar("author_role", { length: 20 }).notNull(),
  date: text("date").notNull(),
  audience: text("audience").array().notNull(),
  priority: varchar("priority", { length: 10 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Messages table
export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  from: text("from").notNull(),
  fromRole: varchar("from_role", { length: 20 }).notNull(),
  to: text("to").notNull(),
  toRole: varchar("to_role", { length: 20 }).notNull(),
  subject: text("subject").notNull(),
  content: text("content").notNull(),
  date: text("date").notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Audit logs table
export const auditLogs = pgTable("audit_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  action: text("action").notNull(),
  user: text("user").notNull(),
  userRole: varchar("user_role", { length: 20 }).notNull(),
  details: text("details").notNull(),
  timestamp: text("timestamp").notNull(),
  ip: text("ip"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tasks table
export const tasks = pgTable("tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  priority: varchar("priority", { length: 10 }).notNull(),
  dueDate: text("due_date").notNull(),
  assignedTo: varchar("assigned_to").notNull(),
  assignedToRole: varchar("assigned_to_role", { length: 20 }).notNull(),
  assignedBy: varchar("assigned_by").notNull(),
  status: varchar("status", { length: 20 }).notNull().default('pending'),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertStudentSchema = createInsertSchema(students).omit({ id: true, createdAt: true });
export const insertTeacherSchema = createInsertSchema(teachers).omit({ id: true, createdAt: true });
export const insertClassSchema = createInsertSchema(classes).omit({ id: true, createdAt: true });
export const insertSubjectSchema = createInsertSchema(subjects).omit({ id: true, createdAt: true });
export const insertTimetableSchema = createInsertSchema(timetable).omit({ id: true, createdAt: true });
export const insertAttendanceSchema = createInsertSchema(attendance).omit({ id: true, createdAt: true });
export const insertGradeSchema = createInsertSchema(grades).omit({ id: true, createdAt: true });
export const insertAssignmentSchema = createInsertSchema(assignments).omit({ id: true, createdAt: true });
export const insertFeeSchema = createInsertSchema(fees).omit({ id: true, createdAt: true });
export const insertAnnouncementSchema = createInsertSchema(announcements).omit({ id: true, createdAt: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, createdAt: true });
export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({ id: true, createdAt: true });
export const insertTaskSchema = createInsertSchema(tasks).omit({ id: true, createdAt: true });

// Select/Insert types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Student = typeof students.$inferSelect;

export type InsertTeacher = z.infer<typeof insertTeacherSchema>;
export type Teacher = typeof teachers.$inferSelect;

export type InsertClass = z.infer<typeof insertClassSchema>;
export type Class = typeof classes.$inferSelect;

export type InsertSubject = z.infer<typeof insertSubjectSchema>;
export type Subject = typeof subjects.$inferSelect;

export type InsertTimetable = z.infer<typeof insertTimetableSchema>;
export type Timetable = typeof timetable.$inferSelect;

export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;
export type Attendance = typeof attendance.$inferSelect;

export type InsertGrade = z.infer<typeof insertGradeSchema>;
export type Grade = typeof grades.$inferSelect;

export type InsertAssignment = z.infer<typeof insertAssignmentSchema>;
export type Assignment = typeof assignments.$inferSelect;

export type InsertFee = z.infer<typeof insertFeeSchema>;
export type Fee = typeof fees.$inferSelect;

export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;
export type Announcement = typeof announcements.$inferSelect;

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type AuditLog = typeof auditLogs.$inferSelect;

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;
