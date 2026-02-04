import { create } from 'zustand';

export type UserRole = 'admin' | 'teacher' | 'student' | 'parent';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  grade: string;
  section: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  enrollmentDate: string;
  status: 'active' | 'inactive' | 'trial';
  schoolName?: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  subjects: string[];
  classes: string[];
  joinDate: string;
  status: 'active' | 'inactive';
  availableDays?: string[];
}

export interface ClassSection {
  id: string;
  name: string;
  grade: string;
  section: string;
  classTeacher: string;
  studentCount: number;
  room: string;
  days?: string[];
  batchName?: string;
  subjects?: string[];
  startTime?: string;
  endTime?: string;
}

export interface Subject {
  id: string;
  name: string;
  grade: string;
  teacher: string;
}

export interface TimetableEntry {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  subject: string;
  teacher: string;
  class: string;
  room: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  class: string;
}

export interface Grade {
  id: string;
  studentId: string;
  studentName: string;
  subject: string;
  term: string;
  score: number;
  maxScore: number;
  grade: string;
  remarks: string;
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  class: string;
  teacher: string;
  dueDate: string;
  description: string;
  status: 'pending' | 'submitted' | 'graded';
  submissions?: number;
  totalStudents?: number;
}

export interface Fee {
  id: string;
  studentId: string;
  studentName: string;
  type: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  paidDate?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  authorRole: UserRole;
  date: string;
  audience: string[];
  priority: 'low' | 'medium' | 'high';
}

export interface Message {
  id: string;
  from: string;
  fromRole: UserRole;
  to: string;
  toRole: UserRole;
  subject: string;
  content: string;
  date: string;
  read: boolean;
}

export interface AuditLog {
  id: string;
  action: string;
  user: string;
  userRole: UserRole;
  details: string;
  timestamp: string;
  ip: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  assignedTo: string; // ID of user
  assignedToRole: UserRole;
  assignedBy: string; // ID of admin
  status: 'pending' | 'in-progress' | 'completed';
}

interface AppState {
  currentUser: User | null;
  showOnboarding: boolean;
  students: Student[];
  teachers: Teacher[];
  classes: ClassSection[];
  subjects: Subject[];
  timetable: TimetableEntry[];
  attendance: AttendanceRecord[];
  grades: Grade[];
  assignments: Assignment[];
  fees: Fee[];
  announcements: Announcement[];
  messages: Message[];
  auditLogs: AuditLog[];
  notifications: { id: string; message: string; read: boolean; date: string }[];
  tasks: Task[];
  
  login: (role: UserRole) => void;
  logout: () => void;
  dismissOnboarding: () => void;
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  addTeacher: (teacher: Omit<Teacher, 'id'>) => void;
  updateTeacher: (id: string, teacher: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;
  addClass: (cls: Omit<ClassSection, 'id'>) => void;
  updateClass: (id: string, cls: Partial<ClassSection>) => void;
  deleteClass: (id: string) => void;
  addSubject: (subject: Omit<Subject, 'id'>) => void;
  updateSubject: (id: string, subject: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;
  addAttendance: (record: Omit<AttendanceRecord, 'id'>) => void;
  updateAttendance: (id: string, record: Partial<AttendanceRecord>) => void;
  addGrade: (grade: Omit<Grade, 'id'>) => void;
  updateGrade: (id: string, grade: Partial<Grade>) => void;
  addAssignment: (assignment: Omit<Assignment, 'id'>) => void;
  updateAssignment: (id: string, assignment: Partial<Assignment>) => void;
  deleteAssignment: (id: string) => void;
  addFee: (fee: Omit<Fee, 'id'>) => void;
  updateFee: (id: string, fee: Partial<Fee>) => void;
  addAnnouncement: (announcement: Omit<Announcement, 'id'>) => void;
  updateAnnouncement: (id: string, announcement: Partial<Announcement>) => void;
  deleteAnnouncement: (id: string) => void;
  addMessage: (message: Omit<Message, 'id'>) => void;
  markMessageRead: (id: string) => void;
  markNotificationRead: (id: string) => void;
  addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
}

const demoUsers: Record<UserRole, User> = {
  admin: { id: 'admin-1', name: 'Dr. Sarah Johnson', email: 'admin@edumanage.com', role: 'admin' },
  teacher: { id: 'teacher-1', name: 'Mr. James Wilson', email: 'j.wilson@edumanage.com', role: 'teacher' },
  student: { id: 'student-1', name: 'Emily Chen', email: 'e.chen@student.edumanage.com', role: 'student' },
  parent: { id: 'parent-1', name: 'Michael Chen', email: 'm.chen@parent.edumanage.com', role: 'parent' },
};

const initialStudents: Student[] = [
  { id: 's1', name: 'Emily Chen', email: 'e.chen@student.edumanage.com', grade: '10', section: 'A', parentName: 'Michael Chen', parentEmail: 'm.chen@parent.edumanage.com', parentPhone: '555-0101', enrollmentDate: '2023-09-01', status: 'active' },
  { id: 's2', name: 'Alex Johnson', email: 'a.johnson@student.edumanage.com', grade: '10', section: 'A', parentName: 'Robert Johnson', parentEmail: 'r.johnson@email.com', parentPhone: '555-0102', enrollmentDate: '2023-09-01', status: 'active' },
  { id: 's3', name: 'Maria Garcia', email: 'm.garcia@student.edumanage.com', grade: '10', section: 'B', parentName: 'Carlos Garcia', parentEmail: 'c.garcia@email.com', parentPhone: '555-0103', enrollmentDate: '2023-09-01', status: 'active' },
  { id: 's4', name: 'David Kim', email: 'd.kim@student.edumanage.com', grade: '11', section: 'A', parentName: 'Jin Kim', parentEmail: 'j.kim@email.com', parentPhone: '555-0104', enrollmentDate: '2022-09-01', status: 'active' },
  { id: 's5', name: 'Sophie Brown', email: 's.brown@student.edumanage.com', grade: '11', section: 'A', parentName: 'Emma Brown', parentEmail: 'e.brown@email.com', parentPhone: '555-0105', enrollmentDate: '2022-09-01', status: 'active' },
  { id: 's6', name: 'James Lee', email: 'j.lee@student.edumanage.com', grade: '11', section: 'B', parentName: 'William Lee', parentEmail: 'w.lee@email.com', parentPhone: '555-0106', enrollmentDate: '2022-09-01', status: 'inactive' },
  { id: 's7', name: 'Olivia Martinez', email: 'o.martinez@student.edumanage.com', grade: '12', section: 'A', parentName: 'Jose Martinez', parentEmail: 'j.martinez@email.com', parentPhone: '555-0107', enrollmentDate: '2021-09-01', status: 'active' },
  { id: 's8', name: 'Ethan Davis', email: 'e.davis@student.edumanage.com', grade: '12', section: 'A', parentName: 'Sarah Davis', parentEmail: 's.davis@email.com', parentPhone: '555-0108', enrollmentDate: '2021-09-01', status: 'active' },
];

const initialTeachers: Teacher[] = [
  { id: 't1', name: 'Mr. James Wilson', email: 'j.wilson@edumanage.com', phone: '555-1001', subjects: ['Mathematics', 'Physics'], classes: ['10-A', '11-A', '12-A'], joinDate: '2020-08-15', status: 'active' },
  { id: 't2', name: 'Ms. Rebecca Taylor', email: 'r.taylor@edumanage.com', phone: '555-1002', subjects: ['English', 'Literature'], classes: ['10-A', '10-B', '11-A'], joinDate: '2019-08-15', status: 'active' },
  { id: 't3', name: 'Dr. Robert Anderson', email: 'r.anderson@edumanage.com', phone: '555-1003', subjects: ['Chemistry', 'Biology'], classes: ['11-A', '11-B', '12-A'], joinDate: '2018-08-15', status: 'active' },
  { id: 't4', name: 'Mrs. Patricia White', email: 'p.white@edumanage.com', phone: '555-1004', subjects: ['History', 'Geography'], classes: ['10-A', '10-B'], joinDate: '2021-08-15', status: 'active' },
  { id: 't5', name: 'Mr. Kevin Brown', email: 'k.brown@edumanage.com', phone: '555-1005', subjects: ['Computer Science'], classes: ['10-A', '11-A', '12-A'], joinDate: '2022-01-10', status: 'active' },
];

const initialClasses: ClassSection[] = [
  { id: 'c1', name: 'Grade 10 - Section A', grade: '10', section: 'A', classTeacher: 'Mr. James Wilson', studentCount: 28, room: 'Room 101' },
  { id: 'c2', name: 'Grade 10 - Section B', grade: '10', section: 'B', classTeacher: 'Ms. Rebecca Taylor', studentCount: 26, room: 'Room 102' },
  { id: 'c3', name: 'Grade 11 - Section A', grade: '11', section: 'A', classTeacher: 'Dr. Robert Anderson', studentCount: 24, room: 'Room 201' },
  { id: 'c4', name: 'Grade 11 - Section B', grade: '11', section: 'B', classTeacher: 'Mrs. Patricia White', studentCount: 25, room: 'Room 202' },
  { id: 'c5', name: 'Grade 12 - Section A', grade: '12', section: 'A', classTeacher: 'Mr. Kevin Brown', studentCount: 22, room: 'Room 301' },
];

const initialSubjects: Subject[] = [
  { id: 'sub1', name: 'Mathematics', grade: '10', teacher: 'Mr. James Wilson' },
  { id: 'sub2', name: 'English', grade: '10', teacher: 'Ms. Rebecca Taylor' },
  { id: 'sub3', name: 'Physics', grade: '10', teacher: 'Mr. James Wilson' },
  { id: 'sub4', name: 'Chemistry', grade: '11', teacher: 'Dr. Robert Anderson' },
  { id: 'sub5', name: 'Biology', grade: '11', teacher: 'Dr. Robert Anderson' },
  { id: 'sub6', name: 'History', grade: '10', teacher: 'Mrs. Patricia White' },
  { id: 'sub7', name: 'Computer Science', grade: '11', teacher: 'Mr. Kevin Brown' },
];

const initialTimetable: TimetableEntry[] = [
  { id: 'tt1', day: 'Monday', startTime: '08:00', endTime: '09:00', subject: 'Mathematics', teacher: 'Mr. James Wilson', class: '10-A', room: 'Room 101' },
  { id: 'tt2', day: 'Monday', startTime: '09:00', endTime: '10:00', subject: 'English', teacher: 'Ms. Rebecca Taylor', class: '10-A', room: 'Room 101' },
  { id: 'tt3', day: 'Monday', startTime: '10:15', endTime: '11:15', subject: 'Physics', teacher: 'Mr. James Wilson', class: '10-A', room: 'Lab 1' },
  { id: 'tt4', day: 'Monday', startTime: '11:15', endTime: '12:15', subject: 'History', teacher: 'Mrs. Patricia White', class: '10-A', room: 'Room 101' },
  { id: 'tt5', day: 'Tuesday', startTime: '08:00', endTime: '09:00', subject: 'Chemistry', teacher: 'Dr. Robert Anderson', class: '10-A', room: 'Lab 2' },
  { id: 'tt6', day: 'Tuesday', startTime: '09:00', endTime: '10:00', subject: 'Mathematics', teacher: 'Mr. James Wilson', class: '10-A', room: 'Room 101' },
  { id: 'tt7', day: 'Tuesday', startTime: '10:15', endTime: '11:15', subject: 'Computer Science', teacher: 'Mr. Kevin Brown', class: '10-A', room: 'Computer Lab' },
  { id: 'tt8', day: 'Wednesday', startTime: '08:00', endTime: '09:00', subject: 'English', teacher: 'Ms. Rebecca Taylor', class: '10-A', room: 'Room 101' },
  { id: 'tt9', day: 'Wednesday', startTime: '09:00', endTime: '10:00', subject: 'Physics', teacher: 'Mr. James Wilson', class: '10-A', room: 'Lab 1' },
  { id: 'tt10', day: 'Thursday', startTime: '08:00', endTime: '09:00', subject: 'Mathematics', teacher: 'Mr. James Wilson', class: '10-A', room: 'Room 101' },
  { id: 'tt11', day: 'Friday', startTime: '08:00', endTime: '09:00', subject: 'Biology', teacher: 'Dr. Robert Anderson', class: '10-A', room: 'Lab 3' },
];

const initialAttendance: AttendanceRecord[] = [
  { id: 'a1', studentId: 's1', studentName: 'Emily Chen', date: '2026-01-08', status: 'present', class: '10-A' },
  { id: 'a2', studentId: 's2', studentName: 'Alex Johnson', date: '2026-01-08', status: 'present', class: '10-A' },
  { id: 'a3', studentId: 's3', studentName: 'Maria Garcia', date: '2026-01-08', status: 'late', class: '10-B' },
  { id: 'a4', studentId: 's1', studentName: 'Emily Chen', date: '2026-01-07', status: 'present', class: '10-A' },
  { id: 'a5', studentId: 's2', studentName: 'Alex Johnson', date: '2026-01-07', status: 'absent', class: '10-A' },
  { id: 'a6', studentId: 's1', studentName: 'Emily Chen', date: '2026-01-06', status: 'present', class: '10-A' },
  { id: 'a7', studentId: 's2', studentName: 'Alex Johnson', date: '2026-01-06', status: 'present', class: '10-A' },
];

const initialGrades: Grade[] = [
  { id: 'g1', studentId: 's1', studentName: 'Emily Chen', subject: 'Mathematics', term: 'Term 1', score: 92, maxScore: 100, grade: 'A', remarks: 'Excellent performance' },
  { id: 'g2', studentId: 's1', studentName: 'Emily Chen', subject: 'English', term: 'Term 1', score: 88, maxScore: 100, grade: 'B+', remarks: 'Good work' },
  { id: 'g3', studentId: 's1', studentName: 'Emily Chen', subject: 'Physics', term: 'Term 1', score: 95, maxScore: 100, grade: 'A+', remarks: 'Outstanding' },
  { id: 'g4', studentId: 's2', studentName: 'Alex Johnson', subject: 'Mathematics', term: 'Term 1', score: 78, maxScore: 100, grade: 'B', remarks: 'Good effort' },
  { id: 'g5', studentId: 's2', studentName: 'Alex Johnson', subject: 'English', term: 'Term 1', score: 85, maxScore: 100, grade: 'B+', remarks: 'Well done' },
  { id: 'g6', studentId: 's3', studentName: 'Maria Garcia', subject: 'Mathematics', term: 'Term 1', score: 90, maxScore: 100, grade: 'A', remarks: 'Great progress' },
];

const initialAssignments: Assignment[] = [
  { id: 'hw1', title: 'Quadratic Equations Practice', subject: 'Mathematics', class: '10-A', teacher: 'Mr. James Wilson', dueDate: '2026-01-15', description: 'Complete exercises 5.1-5.20 from the textbook. Show all working.', status: 'pending', submissions: 18, totalStudents: 28 },
  { id: 'hw2', title: 'Shakespeare Essay', subject: 'English', class: '10-A', teacher: 'Ms. Rebecca Taylor', dueDate: '2026-01-12', description: 'Write a 1000-word essay analyzing the themes in Hamlet.', status: 'pending', submissions: 22, totalStudents: 28 },
  { id: 'hw3', title: 'Newton\'s Laws Lab Report', subject: 'Physics', class: '10-A', teacher: 'Mr. James Wilson', dueDate: '2026-01-10', description: 'Submit the lab report for the Newton\'s Laws experiment conducted on Monday.', status: 'submitted', submissions: 28, totalStudents: 28 },
  { id: 'hw4', title: 'World War II Timeline', subject: 'History', class: '10-A', teacher: 'Mrs. Patricia White', dueDate: '2026-01-20', description: 'Create an illustrated timeline of major events in WWII.', status: 'pending', submissions: 5, totalStudents: 28 },
];

const initialFees: Fee[] = [
  { id: 'f1', studentId: 's1', studentName: 'Emily Chen', type: 'Tuition Fee', amount: 2500, dueDate: '2026-01-31', status: 'paid', paidDate: '2026-01-05' },
  { id: 'f2', studentId: 's1', studentName: 'Emily Chen', type: 'Lab Fee', amount: 150, dueDate: '2026-01-31', status: 'paid', paidDate: '2026-01-05' },
  { id: 'f3', studentId: 's2', studentName: 'Alex Johnson', type: 'Tuition Fee', amount: 2500, dueDate: '2026-01-31', status: 'pending' },
  { id: 'f4', studentId: 's3', studentName: 'Maria Garcia', type: 'Tuition Fee', amount: 2500, dueDate: '2025-12-31', status: 'overdue' },
  { id: 'f5', studentId: 's4', studentName: 'David Kim', type: 'Tuition Fee', amount: 2500, dueDate: '2026-01-31', status: 'paid', paidDate: '2026-01-02' },
  { id: 'f6', studentId: 's5', studentName: 'Sophie Brown', type: 'Tuition Fee', amount: 2500, dueDate: '2026-01-31', status: 'pending' },
];

const initialAnnouncements: Announcement[] = [
  { id: 'ann1', title: 'Winter Break Schedule', content: 'School will be closed from December 23rd to January 3rd for Winter Break. Classes resume on January 4th.', author: 'Dr. Sarah Johnson', authorRole: 'admin', date: '2025-12-15', audience: ['all'], priority: 'high' },
  { id: 'ann2', title: 'Science Fair Registration Open', content: 'Registration for the annual Science Fair is now open. Students interested in participating should register by January 20th.', author: 'Dr. Robert Anderson', authorRole: 'teacher', date: '2026-01-05', audience: ['students', 'parents'], priority: 'medium' },
  { id: 'ann3', title: 'Parent-Teacher Conference', content: 'Parent-Teacher conferences will be held on January 25th from 2 PM to 6 PM. Please book your slot through the school portal.', author: 'Dr. Sarah Johnson', authorRole: 'admin', date: '2026-01-08', audience: ['parents', 'teachers'], priority: 'high' },
  { id: 'ann4', title: 'Library Extended Hours', content: 'The school library will have extended hours (until 6 PM) during exam preparation week starting January 15th.', author: 'Mrs. Patricia White', authorRole: 'teacher', date: '2026-01-07', audience: ['students'], priority: 'low' },
];

const initialMessages: Message[] = [
  { id: 'm1', from: 'Mr. James Wilson', fromRole: 'teacher', to: 'Michael Chen', toRole: 'parent', subject: 'Emily\'s Progress Report', content: 'Dear Mr. Chen, I wanted to share some positive feedback about Emily\'s performance in Mathematics this term. She has shown excellent understanding of complex concepts.', date: '2026-01-07', read: false },
  { id: 'm2', from: 'Dr. Sarah Johnson', fromRole: 'admin', to: 'All Teachers', toRole: 'teacher', subject: 'Staff Meeting Reminder', content: 'This is a reminder that our monthly staff meeting is scheduled for Friday at 3:30 PM in the conference room.', date: '2026-01-06', read: true },
];

const initialAuditLogs: AuditLog[] = [
  { id: 'log1', action: 'User Login', user: 'Dr. Sarah Johnson', userRole: 'admin', details: 'Logged in successfully', timestamp: '2026-01-09T08:30:00Z', ip: '192.168.1.100' },
  { id: 'log2', action: 'Student Added', user: 'Dr. Sarah Johnson', userRole: 'admin', details: 'Added new student: Emily Chen', timestamp: '2026-01-08T10:15:00Z', ip: '192.168.1.100' },
  { id: 'log3', action: 'Fee Updated', user: 'Dr. Sarah Johnson', userRole: 'admin', details: 'Updated fee status for Emily Chen', timestamp: '2026-01-08T11:30:00Z', ip: '192.168.1.100' },
  { id: 'log4', action: 'Announcement Created', user: 'Dr. Sarah Johnson', userRole: 'admin', details: 'Created announcement: Parent-Teacher Conference', timestamp: '2026-01-08T14:00:00Z', ip: '192.168.1.100' },
];

const initialNotifications = [
  { id: 'n1', message: 'New assignment posted: Quadratic Equations Practice', read: false, date: '2026-01-08' },
  { id: 'n2', message: 'Fee payment due in 23 days', read: false, date: '2026-01-08' },
  { id: 'n3', message: 'Parent-Teacher Conference scheduled for Jan 25', read: true, date: '2026-01-08' },
];

const initialTasks: Task[] = [
  { id: 't1', title: 'Prepare for Science Fair', description: 'Setup the booth and organize materials', priority: 'high', dueDate: '2026-01-20', assignedTo: 's1', assignedToRole: 'student', assignedBy: 'admin-1', status: 'pending' },
  { id: 't2', title: 'Grade Mid-term Papers', description: 'Review and grade grade 10 math papers', priority: 'medium', dueDate: '2026-01-15', assignedTo: 't1', assignedToRole: 'teacher', assignedBy: 'admin-1', status: 'in-progress' },
  { id: 't3', title: 'Update Curriculum', description: 'Review syllabus for next term', priority: 'low', dueDate: '2026-02-01', assignedTo: 'admin-1', assignedToRole: 'admin', assignedBy: 'admin-1', status: 'pending' },
];

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useStore = create<AppState>((set, get) => ({
  currentUser: null,
  showOnboarding: true,
  students: initialStudents,
  teachers: initialTeachers,
  classes: initialClasses,
  subjects: initialSubjects,
  timetable: initialTimetable,
  attendance: initialAttendance,
  grades: initialGrades,
  assignments: initialAssignments,
  fees: initialFees,
  announcements: initialAnnouncements,
  messages: initialMessages,
  auditLogs: initialAuditLogs,
  notifications: initialNotifications,
  tasks: initialTasks,

  login: (role) => {
    set({ currentUser: demoUsers[role] });
    get().addAuditLog({ action: 'User Login', user: demoUsers[role].name, userRole: role, details: 'Logged in successfully', ip: '192.168.1.100' });
  },
  logout: () => set({ currentUser: null }),
  dismissOnboarding: () => set({ showOnboarding: false }),

  addStudent: (student) => set((state) => ({ students: [...state.students, { ...student, id: generateId() }] })),
  updateStudent: (id, student) => set((state) => ({ students: state.students.map((s) => s.id === id ? { ...s, ...student } : s) })),
  deleteStudent: (id) => set((state) => ({ students: state.students.filter((s) => s.id !== id) })),

  addTeacher: (teacher) => set((state) => ({ teachers: [...state.teachers, { ...teacher, id: generateId() }] })),
  updateTeacher: (id, teacher) => set((state) => ({ teachers: state.teachers.map((t) => t.id === id ? { ...t, ...teacher } : t) })),
  deleteTeacher: (id) => set((state) => ({ teachers: state.teachers.filter((t) => t.id !== id) })),

  addClass: (cls) => set((state) => ({ classes: [...state.classes, { ...cls, id: generateId() }] })),
  updateClass: (id, cls) => set((state) => ({ classes: state.classes.map((c) => c.id === id ? { ...c, ...cls } : c) })),
  deleteClass: (id) => set((state) => ({ classes: state.classes.filter((c) => c.id !== id) })),

  addSubject: (subject) => set((state) => ({ subjects: [...state.subjects, { ...subject, id: generateId() }] })),
  updateSubject: (id, subject) => set((state) => ({ subjects: state.subjects.map((s) => s.id === id ? { ...s, ...subject } : s) })),
  deleteSubject: (id) => set((state) => ({ subjects: state.subjects.filter((s) => s.id !== id) })),

  addAttendance: (record) => set((state) => ({ attendance: [...state.attendance, { ...record, id: generateId() }] })),
  updateAttendance: (id, record) => set((state) => ({ attendance: state.attendance.map((a) => a.id === id ? { ...a, ...record } : a) })),

  addGrade: (grade) => set((state) => ({ grades: [...state.grades, { ...grade, id: generateId() }] })),
  updateGrade: (id, grade) => set((state) => ({ grades: state.grades.map((g) => g.id === id ? { ...g, ...grade } : g) })),

  addAssignment: (assignment) => set((state) => ({ assignments: [...state.assignments, { ...assignment, id: generateId() }] })),
  updateAssignment: (id, assignment) => set((state) => ({ assignments: state.assignments.map((a) => a.id === id ? { ...a, ...assignment } : a) })),
  deleteAssignment: (id) => set((state) => ({ assignments: state.assignments.filter((a) => a.id !== id) })),

  addFee: (fee) => set((state) => ({ fees: [...state.fees, { ...fee, id: generateId() }] })),
  updateFee: (id, fee) => set((state) => ({ fees: state.fees.map((f) => f.id === id ? { ...f, ...fee } : f) })),

  addAnnouncement: (announcement) => set((state) => ({ announcements: [{ ...announcement, id: generateId() }, ...state.announcements] })),
  updateAnnouncement: (id, announcement) => set((state) => ({ announcements: state.announcements.map((a) => a.id === id ? { ...a, ...announcement } : a) })),
  deleteAnnouncement: (id) => set((state) => ({ announcements: state.announcements.filter((a) => a.id !== id) })),

  addMessage: (message) => set((state) => ({ messages: [{ ...message, id: generateId() }, ...state.messages] })),
  markMessageRead: (id) => set((state) => ({ messages: state.messages.map((m) => m.id === id ? { ...m, read: true } : m) })),
  markNotificationRead: (id) => set((state) => ({ notifications: state.notifications.map((n) => n.id === id ? { ...n, read: true } : n) })),

  addAuditLog: (log) => set((state) => ({ auditLogs: [{ ...log, id: generateId(), timestamp: new Date().toISOString() }, ...state.auditLogs] })),

  addTask: (task) => set((state) => ({ tasks: [...state.tasks, { ...task, id: generateId() }] })),
  updateTask: (id, task) => set((state) => ({ tasks: state.tasks.map((t) => t.id === id ? { ...t, ...task } : t) })),
  deleteTask: (id) => set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),
}));
