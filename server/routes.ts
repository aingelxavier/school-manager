import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertStudentSchema, insertTeacherSchema, insertClassSchema, insertSubjectSchema,
  insertTimetableSchema, insertAttendanceSchema, insertGradeSchema, insertAssignmentSchema,
  insertFeeSchema, insertAnnouncementSchema, insertMessageSchema, insertAuditLogSchema,
  insertTaskSchema, insertUserSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Helper function for validation
  const validate = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
    return schema.parse(data);
  };

  // ========== AUTH ROUTES ==========
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, role } = req.body;
      const user = await storage.getUserByEmail(email);
      
      // For demo purposes, auto-create users if they don't exist
      if (!user) {
        const newUser = await storage.createUser({
          email,
          name: email.split('@')[0],
          password: 'demo', // In production, use proper hashing
          role
        });
        return res.json({ user: newUser });
      }
      
      res.json({ user });
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  // ========== STUDENTS ROUTES ==========
  app.get("/api/students", async (_req, res) => {
    try {
      const students = await storage.getAllStudents();
      res.json(students);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch students" });
    }
  });

  app.get("/api/students/:id", async (req, res) => {
    try {
      const student = await storage.getStudent(req.params.id);
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }
      res.json(student);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch student" });
    }
  });

  app.post("/api/students", async (req, res) => {
    try {
      const data = validate(insertStudentSchema, req.body);
      const student = await storage.createStudent(data);
      res.status(201).json(student);
    } catch (error) {
      res.status(400).json({ error: "Invalid student data" });
    }
  });

  app.patch("/api/students/:id", async (req, res) => {
    try {
      const student = await storage.updateStudent(req.params.id, req.body);
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }
      res.json(student);
    } catch (error) {
      res.status(400).json({ error: "Failed to update student" });
    }
  });

  app.delete("/api/students/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteStudent(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Student not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete student" });
    }
  });

  // ========== TEACHERS ROUTES ==========
  app.get("/api/teachers", async (_req, res) => {
    try {
      const teachers = await storage.getAllTeachers();
      res.json(teachers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch teachers" });
    }
  });

  app.post("/api/teachers", async (req, res) => {
    try {
      const data = validate(insertTeacherSchema, req.body);
      const teacher = await storage.createTeacher(data);
      res.status(201).json(teacher);
    } catch (error) {
      res.status(400).json({ error: "Invalid teacher data" });
    }
  });

  app.patch("/api/teachers/:id", async (req, res) => {
    try {
      const teacher = await storage.updateTeacher(req.params.id, req.body);
      if (!teacher) {
        return res.status(404).json({ error: "Teacher not found" });
      }
      res.json(teacher);
    } catch (error) {
      res.status(400).json({ error: "Failed to update teacher" });
    }
  });

  app.delete("/api/teachers/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteTeacher(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Teacher not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete teacher" });
    }
  });

  // ========== CLASSES ROUTES ==========
  app.get("/api/classes", async (_req, res) => {
    try {
      const classes = await storage.getAllClasses();
      res.json(classes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch classes" });
    }
  });

  app.post("/api/classes", async (req, res) => {
    try {
      const data = validate(insertClassSchema, req.body);
      const classData = await storage.createClass(data);
      res.status(201).json(classData);
    } catch (error) {
      res.status(400).json({ error: "Invalid class data" });
    }
  });

  app.patch("/api/classes/:id", async (req, res) => {
    try {
      const classData = await storage.updateClass(req.params.id, req.body);
      if (!classData) {
        return res.status(404).json({ error: "Class not found" });
      }
      res.json(classData);
    } catch (error) {
      res.status(400).json({ error: "Failed to update class" });
    }
  });

  app.delete("/api/classes/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteClass(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Class not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete class" });
    }
  });

  // ========== SUBJECTS ROUTES ==========
  app.get("/api/subjects", async (_req, res) => {
    try {
      const subjects = await storage.getAllSubjects();
      res.json(subjects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch subjects" });
    }
  });

  app.post("/api/subjects", async (req, res) => {
    try {
      const data = validate(insertSubjectSchema, req.body);
      const subject = await storage.createSubject(data);
      res.status(201).json(subject);
    } catch (error) {
      res.status(400).json({ error: "Invalid subject data" });
    }
  });

  app.patch("/api/subjects/:id", async (req, res) => {
    try {
      const subject = await storage.updateSubject(req.params.id, req.body);
      if (!subject) {
        return res.status(404).json({ error: "Subject not found" });
      }
      res.json(subject);
    } catch (error) {
      res.status(400).json({ error: "Failed to update subject" });
    }
  });

  app.delete("/api/subjects/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteSubject(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Subject not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete subject" });
    }
  });

  // ========== TIMETABLE ROUTES ==========
  app.get("/api/timetable", async (_req, res) => {
    try {
      const timetable = await storage.getAllTimetable();
      res.json(timetable);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch timetable" });
    }
  });

  app.post("/api/timetable", async (req, res) => {
    try {
      const data = validate(insertTimetableSchema, req.body);
      const entry = await storage.createTimetableEntry(data);
      res.status(201).json(entry);
    } catch (error) {
      res.status(400).json({ error: "Invalid timetable data" });
    }
  });

  app.patch("/api/timetable/:id", async (req, res) => {
    try {
      const entry = await storage.updateTimetableEntry(req.params.id, req.body);
      if (!entry) {
        return res.status(404).json({ error: "Timetable entry not found" });
      }
      res.json(entry);
    } catch (error) {
      res.status(400).json({ error: "Failed to update timetable entry" });
    }
  });

  app.delete("/api/timetable/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteTimetableEntry(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Timetable entry not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete timetable entry" });
    }
  });

  // ========== ATTENDANCE ROUTES ==========
  app.get("/api/attendance", async (_req, res) => {
    try {
      const attendance = await storage.getAllAttendance();
      res.json(attendance);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch attendance" });
    }
  });

  app.post("/api/attendance", async (req, res) => {
    try {
      const data = validate(insertAttendanceSchema, req.body);
      const record = await storage.createAttendanceRecord(data);
      res.status(201).json(record);
    } catch (error) {
      res.status(400).json({ error: "Invalid attendance data" });
    }
  });

  app.patch("/api/attendance/:id", async (req, res) => {
    try {
      const record = await storage.updateAttendanceRecord(req.params.id, req.body);
      if (!record) {
        return res.status(404).json({ error: "Attendance record not found" });
      }
      res.json(record);
    } catch (error) {
      res.status(400).json({ error: "Failed to update attendance" });
    }
  });

  // ========== GRADES ROUTES ==========
  app.get("/api/grades", async (_req, res) => {
    try {
      const grades = await storage.getAllGrades();
      res.json(grades);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch grades" });
    }
  });

  app.post("/api/grades", async (req, res) => {
    try {
      const data = validate(insertGradeSchema, req.body);
      const grade = await storage.createGrade(data);
      res.status(201).json(grade);
    } catch (error) {
      res.status(400).json({ error: "Invalid grade data" });
    }
  });

  app.patch("/api/grades/:id", async (req, res) => {
    try {
      const grade = await storage.updateGrade(req.params.id, req.body);
      if (!grade) {
        return res.status(404).json({ error: "Grade not found" });
      }
      res.json(grade);
    } catch (error) {
      res.status(400).json({ error: "Failed to update grade" });
    }
  });

  // ========== ASSIGNMENTS ROUTES ==========
  app.get("/api/assignments", async (_req, res) => {
    try {
      const assignments = await storage.getAllAssignments();
      res.json(assignments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch assignments" });
    }
  });

  app.post("/api/assignments", async (req, res) => {
    try {
      const data = validate(insertAssignmentSchema, req.body);
      const assignment = await storage.createAssignment(data);
      res.status(201).json(assignment);
    } catch (error) {
      res.status(400).json({ error: "Invalid assignment data" });
    }
  });

  app.patch("/api/assignments/:id", async (req, res) => {
    try {
      const assignment = await storage.updateAssignment(req.params.id, req.body);
      if (!assignment) {
        return res.status(404).json({ error: "Assignment not found" });
      }
      res.json(assignment);
    } catch (error) {
      res.status(400).json({ error: "Failed to update assignment" });
    }
  });

  app.delete("/api/assignments/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteAssignment(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Assignment not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete assignment" });
    }
  });

  // ========== FEES ROUTES ==========
  app.get("/api/fees", async (_req, res) => {
    try {
      const fees = await storage.getAllFees();
      res.json(fees);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch fees" });
    }
  });

  app.post("/api/fees", async (req, res) => {
    try {
      const data = validate(insertFeeSchema, req.body);
      const fee = await storage.createFee(data);
      res.status(201).json(fee);
    } catch (error) {
      res.status(400).json({ error: "Invalid fee data" });
    }
  });

  app.patch("/api/fees/:id", async (req, res) => {
    try {
      const fee = await storage.updateFee(req.params.id, req.body);
      if (!fee) {
        return res.status(404).json({ error: "Fee not found" });
      }
      res.json(fee);
    } catch (error) {
      res.status(400).json({ error: "Failed to update fee" });
    }
  });

  // ========== ANNOUNCEMENTS ROUTES ==========
  app.get("/api/announcements", async (_req, res) => {
    try {
      const announcements = await storage.getAllAnnouncements();
      res.json(announcements);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch announcements" });
    }
  });

  app.post("/api/announcements", async (req, res) => {
    try {
      const data = validate(insertAnnouncementSchema, req.body);
      const announcement = await storage.createAnnouncement(data);
      res.status(201).json(announcement);
    } catch (error) {
      res.status(400).json({ error: "Invalid announcement data" });
    }
  });

  app.patch("/api/announcements/:id", async (req, res) => {
    try {
      const announcement = await storage.updateAnnouncement(req.params.id, req.body);
      if (!announcement) {
        return res.status(404).json({ error: "Announcement not found" });
      }
      res.json(announcement);
    } catch (error) {
      res.status(400).json({ error: "Failed to update announcement" });
    }
  });

  app.delete("/api/announcements/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteAnnouncement(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Announcement not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete announcement" });
    }
  });

  // ========== MESSAGES ROUTES ==========
  app.get("/api/messages", async (_req, res) => {
    try {
      const messages = await storage.getAllMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  app.post("/api/messages", async (req, res) => {
    try {
      const data = validate(insertMessageSchema, req.body);
      const message = await storage.createMessage(data);
      res.status(201).json(message);
    } catch (error) {
      res.status(400).json({ error: "Invalid message data" });
    }
  });

  app.patch("/api/messages/:id/read", async (req, res) => {
    try {
      const updated = await storage.markMessageAsRead(req.params.id);
      if (!updated) {
        return res.status(404).json({ error: "Message not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to mark message as read" });
    }
  });

  // ========== AUDIT LOGS ROUTES ==========
  app.get("/api/audit-logs", async (_req, res) => {
    try {
      const logs = await storage.getAllAuditLogs();
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch audit logs" });
    }
  });

  app.post("/api/audit-logs", async (req, res) => {
    try {
      const data = validate(insertAuditLogSchema, req.body);
      const log = await storage.createAuditLog(data);
      res.status(201).json(log);
    } catch (error) {
      res.status(400).json({ error: "Invalid audit log data" });
    }
  });

  // ========== TASKS ROUTES ==========
  app.get("/api/tasks", async (_req, res) => {
    try {
      const tasks = await storage.getAllTasks();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const data = validate(insertTaskSchema, req.body);
      const task = await storage.createTask(data);
      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ error: "Invalid task data" });
    }
  });

  app.patch("/api/tasks/:id", async (req, res) => {
    try {
      const task = await storage.updateTask(req.params.id, req.body);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      res.status(400).json({ error: "Failed to update task" });
    }
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteTask(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete task" });
    }
  });

  return httpServer;
}
