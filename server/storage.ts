import {
  users, students, teachers, classes, subjects, timetable,
  attendance, grades, assignments, fees, announcements, messages,
  auditLogs, tasks,
  type User, type InsertUser,
  type Student, type InsertStudent,
  type Teacher, type InsertTeacher,
  type Class, type InsertClass,
  type Subject, type InsertSubject,
  type Timetable, type InsertTimetable,
  type Attendance, type InsertAttendance,
  type Grade, type InsertGrade,
  type Assignment, type InsertAssignment,
  type Fee, type InsertFee,
  type Announcement, type InsertAnnouncement,
  type Message, type InsertMessage,
  type AuditLog, type InsertAuditLog,
  type Task, type InsertTask,
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Students
  getAllStudents(): Promise<Student[]>;
  getStudent(id: string): Promise<Student | undefined>;
  createStudent(student: InsertStudent): Promise<Student>;
  updateStudent(id: string, student: Partial<InsertStudent>): Promise<Student | undefined>;
  deleteStudent(id: string): Promise<boolean>;
  
  // Teachers
  getAllTeachers(): Promise<Teacher[]>;
  getTeacher(id: string): Promise<Teacher | undefined>;
  createTeacher(teacher: InsertTeacher): Promise<Teacher>;
  updateTeacher(id: string, teacher: Partial<InsertTeacher>): Promise<Teacher | undefined>;
  deleteTeacher(id: string): Promise<boolean>;
  
  // Classes
  getAllClasses(): Promise<Class[]>;
  getClass(id: string): Promise<Class | undefined>;
  createClass(classData: InsertClass): Promise<Class>;
  updateClass(id: string, classData: Partial<InsertClass>): Promise<Class | undefined>;
  deleteClass(id: string): Promise<boolean>;
  
  // Subjects
  getAllSubjects(): Promise<Subject[]>;
  getSubject(id: string): Promise<Subject | undefined>;
  createSubject(subject: InsertSubject): Promise<Subject>;
  updateSubject(id: string, subject: Partial<InsertSubject>): Promise<Subject | undefined>;
  deleteSubject(id: string): Promise<boolean>;
  
  // Timetable
  getAllTimetable(): Promise<Timetable[]>;
  getTimetableEntry(id: string): Promise<Timetable | undefined>;
  createTimetableEntry(entry: InsertTimetable): Promise<Timetable>;
  updateTimetableEntry(id: string, entry: Partial<InsertTimetable>): Promise<Timetable | undefined>;
  deleteTimetableEntry(id: string): Promise<boolean>;
  
  // Attendance
  getAllAttendance(): Promise<Attendance[]>;
  getAttendanceRecord(id: string): Promise<Attendance | undefined>;
  createAttendanceRecord(record: InsertAttendance): Promise<Attendance>;
  updateAttendanceRecord(id: string, record: Partial<InsertAttendance>): Promise<Attendance | undefined>;
  
  // Grades
  getAllGrades(): Promise<Grade[]>;
  getGrade(id: string): Promise<Grade | undefined>;
  createGrade(grade: InsertGrade): Promise<Grade>;
  updateGrade(id: string, grade: Partial<InsertGrade>): Promise<Grade | undefined>;
  
  // Assignments
  getAllAssignments(): Promise<Assignment[]>;
  getAssignment(id: string): Promise<Assignment | undefined>;
  createAssignment(assignment: InsertAssignment): Promise<Assignment>;
  updateAssignment(id: string, assignment: Partial<InsertAssignment>): Promise<Assignment | undefined>;
  deleteAssignment(id: string): Promise<boolean>;
  
  // Fees
  getAllFees(): Promise<Fee[]>;
  getFee(id: string): Promise<Fee | undefined>;
  createFee(fee: InsertFee): Promise<Fee>;
  updateFee(id: string, fee: Partial<InsertFee>): Promise<Fee | undefined>;
  
  // Announcements
  getAllAnnouncements(): Promise<Announcement[]>;
  getAnnouncement(id: string): Promise<Announcement | undefined>;
  createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;
  updateAnnouncement(id: string, announcement: Partial<InsertAnnouncement>): Promise<Announcement | undefined>;
  deleteAnnouncement(id: string): Promise<boolean>;
  
  // Messages
  getAllMessages(): Promise<Message[]>;
  getMessage(id: string): Promise<Message | undefined>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(id: string): Promise<boolean>;
  
  // Audit Logs
  getAllAuditLogs(): Promise<AuditLog[]>;
  createAuditLog(log: InsertAuditLog): Promise<AuditLog>;
  
  // Tasks
  getAllTasks(): Promise<Task[]>;
  getTask(id: string): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, task: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Students
  async getAllStudents(): Promise<Student[]> {
    return await db.select().from(students);
  }

  async getStudent(id: string): Promise<Student | undefined> {
    const [student] = await db.select().from(students).where(eq(students.id, id));
    return student || undefined;
  }

  async createStudent(insertStudent: InsertStudent): Promise<Student> {
    const [student] = await db.insert(students).values(insertStudent).returning();
    return student;
  }

  async updateStudent(id: string, updateData: Partial<InsertStudent>): Promise<Student | undefined> {
    const [student] = await db.update(students).set(updateData).where(eq(students.id, id)).returning();
    return student || undefined;
  }

  async deleteStudent(id: string): Promise<boolean> {
    const result = await db.delete(students).where(eq(students.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Teachers
  async getAllTeachers(): Promise<Teacher[]> {
    return await db.select().from(teachers);
  }

  async getTeacher(id: string): Promise<Teacher | undefined> {
    const [teacher] = await db.select().from(teachers).where(eq(teachers.id, id));
    return teacher || undefined;
  }

  async createTeacher(insertTeacher: InsertTeacher): Promise<Teacher> {
    const [teacher] = await db.insert(teachers).values(insertTeacher).returning();
    return teacher;
  }

  async updateTeacher(id: string, updateData: Partial<InsertTeacher>): Promise<Teacher | undefined> {
    const [teacher] = await db.update(teachers).set(updateData).where(eq(teachers.id, id)).returning();
    return teacher || undefined;
  }

  async deleteTeacher(id: string): Promise<boolean> {
    const result = await db.delete(teachers).where(eq(teachers.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Classes
  async getAllClasses(): Promise<Class[]> {
    return await db.select().from(classes);
  }

  async getClass(id: string): Promise<Class | undefined> {
    const [classData] = await db.select().from(classes).where(eq(classes.id, id));
    return classData || undefined;
  }

  async createClass(insertClass: InsertClass): Promise<Class> {
    const [classData] = await db.insert(classes).values(insertClass).returning();
    return classData;
  }

  async updateClass(id: string, updateData: Partial<InsertClass>): Promise<Class | undefined> {
    const [classData] = await db.update(classes).set(updateData).where(eq(classes.id, id)).returning();
    return classData || undefined;
  }

  async deleteClass(id: string): Promise<boolean> {
    const result = await db.delete(classes).where(eq(classes.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Subjects
  async getAllSubjects(): Promise<Subject[]> {
    return await db.select().from(subjects);
  }

  async getSubject(id: string): Promise<Subject | undefined> {
    const [subject] = await db.select().from(subjects).where(eq(subjects.id, id));
    return subject || undefined;
  }

  async createSubject(insertSubject: InsertSubject): Promise<Subject> {
    const [subject] = await db.insert(subjects).values(insertSubject).returning();
    return subject;
  }

  async updateSubject(id: string, updateData: Partial<InsertSubject>): Promise<Subject | undefined> {
    const [subject] = await db.update(subjects).set(updateData).where(eq(subjects.id, id)).returning();
    return subject || undefined;
  }

  async deleteSubject(id: string): Promise<boolean> {
    const result = await db.delete(subjects).where(eq(subjects.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Timetable
  async getAllTimetable(): Promise<Timetable[]> {
    return await db.select().from(timetable);
  }

  async getTimetableEntry(id: string): Promise<Timetable | undefined> {
    const [entry] = await db.select().from(timetable).where(eq(timetable.id, id));
    return entry || undefined;
  }

  async createTimetableEntry(insertEntry: InsertTimetable): Promise<Timetable> {
    const [entry] = await db.insert(timetable).values(insertEntry).returning();
    return entry;
  }

  async updateTimetableEntry(id: string, updateData: Partial<InsertTimetable>): Promise<Timetable | undefined> {
    const [entry] = await db.update(timetable).set(updateData).where(eq(timetable.id, id)).returning();
    return entry || undefined;
  }

  async deleteTimetableEntry(id: string): Promise<boolean> {
    const result = await db.delete(timetable).where(eq(timetable.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Attendance
  async getAllAttendance(): Promise<Attendance[]> {
    return await db.select().from(attendance);
  }

  async getAttendanceRecord(id: string): Promise<Attendance | undefined> {
    const [record] = await db.select().from(attendance).where(eq(attendance.id, id));
    return record || undefined;
  }

  async createAttendanceRecord(insertRecord: InsertAttendance): Promise<Attendance> {
    const [record] = await db.insert(attendance).values(insertRecord).returning();
    return record;
  }

  async updateAttendanceRecord(id: string, updateData: Partial<InsertAttendance>): Promise<Attendance | undefined> {
    const [record] = await db.update(attendance).set(updateData).where(eq(attendance.id, id)).returning();
    return record || undefined;
  }

  // Grades
  async getAllGrades(): Promise<Grade[]> {
    return await db.select().from(grades);
  }

  async getGrade(id: string): Promise<Grade | undefined> {
    const [grade] = await db.select().from(grades).where(eq(grades.id, id));
    return grade || undefined;
  }

  async createGrade(insertGrade: InsertGrade): Promise<Grade> {
    const [grade] = await db.insert(grades).values(insertGrade).returning();
    return grade;
  }

  async updateGrade(id: string, updateData: Partial<InsertGrade>): Promise<Grade | undefined> {
    const [grade] = await db.update(grades).set(updateData).where(eq(grades.id, id)).returning();
    return grade || undefined;
  }

  // Assignments
  async getAllAssignments(): Promise<Assignment[]> {
    return await db.select().from(assignments);
  }

  async getAssignment(id: string): Promise<Assignment | undefined> {
    const [assignment] = await db.select().from(assignments).where(eq(assignments.id, id));
    return assignment || undefined;
  }

  async createAssignment(insertAssignment: InsertAssignment): Promise<Assignment> {
    const [assignment] = await db.insert(assignments).values(insertAssignment).returning();
    return assignment;
  }

  async updateAssignment(id: string, updateData: Partial<InsertAssignment>): Promise<Assignment | undefined> {
    const [assignment] = await db.update(assignments).set(updateData).where(eq(assignments.id, id)).returning();
    return assignment || undefined;
  }

  async deleteAssignment(id: string): Promise<boolean> {
    const result = await db.delete(assignments).where(eq(assignments.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Fees
  async getAllFees(): Promise<Fee[]> {
    return await db.select().from(fees);
  }

  async getFee(id: string): Promise<Fee | undefined> {
    const [fee] = await db.select().from(fees).where(eq(fees.id, id));
    return fee || undefined;
  }

  async createFee(insertFee: InsertFee): Promise<Fee> {
    const [fee] = await db.insert(fees).values(insertFee).returning();
    return fee;
  }

  async updateFee(id: string, updateData: Partial<InsertFee>): Promise<Fee | undefined> {
    const [fee] = await db.update(fees).set(updateData).where(eq(fees.id, id)).returning();
    return fee || undefined;
  }

  // Announcements
  async getAllAnnouncements(): Promise<Announcement[]> {
    return await db.select().from(announcements);
  }

  async getAnnouncement(id: string): Promise<Announcement | undefined> {
    const [announcement] = await db.select().from(announcements).where(eq(announcements.id, id));
    return announcement || undefined;
  }

  async createAnnouncement(insertAnnouncement: InsertAnnouncement): Promise<Announcement> {
    const [announcement] = await db.insert(announcements).values(insertAnnouncement).returning();
    return announcement;
  }

  async updateAnnouncement(id: string, updateData: Partial<InsertAnnouncement>): Promise<Announcement | undefined> {
    const [announcement] = await db.update(announcements).set(updateData).where(eq(announcements.id, id)).returning();
    return announcement || undefined;
  }

  async deleteAnnouncement(id: string): Promise<boolean> {
    const result = await db.delete(announcements).where(eq(announcements.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Messages
  async getAllMessages(): Promise<Message[]> {
    return await db.select().from(messages);
  }

  async getMessage(id: string): Promise<Message | undefined> {
    const [message] = await db.select().from(messages).where(eq(messages.id, id));
    return message || undefined;
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db.insert(messages).values(insertMessage).returning();
    return message;
  }

  async markMessageAsRead(id: string): Promise<boolean> {
    const result = await db.update(messages).set({ read: true }).where(eq(messages.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Audit Logs
  async getAllAuditLogs(): Promise<AuditLog[]> {
    return await db.select().from(auditLogs);
  }

  async createAuditLog(insertLog: InsertAuditLog): Promise<AuditLog> {
    const [log] = await db.insert(auditLogs).values(insertLog).returning();
    return log;
  }

  // Tasks
  async getAllTasks(): Promise<Task[]> {
    return await db.select().from(tasks);
  }

  async getTask(id: string): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task || undefined;
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const [task] = await db.insert(tasks).values(insertTask).returning();
    return task;
  }

  async updateTask(id: string, updateData: Partial<InsertTask>): Promise<Task | undefined> {
    const [task] = await db.update(tasks).set(updateData).where(eq(tasks.id, id)).returning();
    return task || undefined;
  }

  async deleteTask(id: string): Promise<boolean> {
    const result = await db.delete(tasks).where(eq(tasks.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }
}

export const storage = new DatabaseStorage();
