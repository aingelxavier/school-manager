import { useState } from 'react';
import { useStore } from '@/lib/store';
import { useGrades, useStudents, useSubjects, useCreateGrade } from '@/lib/hooks';
import type { Grade as GradeType } from '@shared/schema';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable } from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, FileText, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function Grades() {
  const { currentUser } = useStore();
  const { data: grades = [], isLoading: gradesLoading } = useGrades();
  const { data: students = [], isLoading: studentsLoading } = useStudents();
  const { data: subjects = [], isLoading: subjectsLoading } = useSubjects();
  const createGrade = useCreateGrade();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    studentId: '',
    subject: '',
    term: 'Term 1',
    score: 0,
    maxScore: 100,
    remarks: '',
  });

  const isLoading = gradesLoading || studentsLoading || subjectsLoading;
  const isTeacherOrAdmin = currentUser?.role === 'admin' || currentUser?.role === 'teacher';
  const isStudentOrParent = currentUser?.role === 'student' || currentUser?.role === 'parent';

  const myGrades = isStudentOrParent
    ? grades.filter((g) => g.studentId === 's1')
    : grades;

  const calculateGrade = (score: number, maxScore: number): string => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    if (percentage >= 40) return 'D';
    return 'F';
  };

  const handleSubmit = () => {
    if (!formData.studentId || !formData.subject || formData.score === 0) {
      toast({ title: 'Error', description: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }

    const student = students.find((s) => s.id === formData.studentId);
    const gradeValue = calculateGrade(formData.score, formData.maxScore);

    createGrade.mutate({
      studentId: formData.studentId,
      studentName: student?.name || '',
      subject: formData.subject,
      term: formData.term,
      score: formData.score,
      maxScore: formData.maxScore,
      grade: gradeValue,
      remarks: formData.remarks,
    }, {
      onSuccess: () => {
        toast({ title: 'Success', description: 'Grade added successfully' });
        setIsDialogOpen(false);
        setFormData({
          studentId: '',
          subject: '',
          term: 'Term 1',
          score: 0,
          maxScore: 100,
          remarks: '',
        });
      },
    });
  };

  const getGradeBadge = (grade: string) => {
    const colors: Record<string, string> = {
      'A+': 'bg-green-500',
      'A': 'bg-green-400',
      'B+': 'bg-blue-500',
      'B': 'bg-blue-400',
      'C': 'bg-yellow-500',
      'D': 'bg-orange-500',
      'F': 'bg-red-500',
    };
    return (
      <Badge className={`${colors[grade] || 'bg-gray-500'} text-white`}>
        {grade}
      </Badge>
    );
  };

  const columns = [
    { key: 'studentName', label: 'Student', sortable: true },
    { key: 'subject', label: 'Subject', sortable: true },
    { key: 'term', label: 'Term' },
    {
      key: 'score',
      label: 'Score',
      render: (grade: GradeType) => `${grade.score}/${grade.maxScore}`,
    },
    {
      key: 'grade',
      label: 'Grade',
      render: (grade: GradeType) => getGradeBadge(grade.grade),
    },
    { key: 'remarks', label: 'Remarks' },
  ];

  const subjectAverages = subjects.slice(0, 5).map((sub) => {
    const subjectGrades = myGrades.filter((g) => g.subject === sub.name);
    const avg = subjectGrades.length > 0
      ? Math.round(subjectGrades.reduce((sum, g) => sum + g.score, 0) / subjectGrades.length)
      : 0;
    return { subject: sub.name, average: avg };
  });

  const overallAverage = myGrades.length > 0
    ? Math.round(myGrades.reduce((sum, g) => sum + g.score, 0) / myGrades.length)
    : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">Grades</h1>
            <p className="text-muted-foreground">
              {isStudentOrParent ? 'View your academic performance' : 'Manage student grades and report cards'}
            </p>
          </div>
          {isTeacherOrAdmin && (
            <Button onClick={() => setIsDialogOpen(true)} data-testid="button-add-grade">
              <Plus className="h-4 w-4 mr-2" />
              Add Grade
            </Button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{myGrades.length}</div>
                  <p className="text-sm text-muted-foreground">Total Grades</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-green-100 text-green-600 dark:bg-green-900/30">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{overallAverage}%</div>
                  <p className="text-sm text-muted-foreground">Overall Average</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{calculateGrade(overallAverage, 100)}</div>
                  <p className="text-sm text-muted-foreground">Overall Grade</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {isStudentOrParent && (
          <Card>
            <CardHeader>
              <CardTitle>Subject Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={subjectAverages}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="subject" className="text-xs" />
                  <YAxis domain={[0, 100]} className="text-xs" />
                  <Tooltip />
                  <Bar dataKey="average" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Loading grades...</div>
          </div>
        ) : (
          <DataTable
            data={myGrades}
            columns={columns}
            searchKeys={['studentName', 'subject']}
            exportFileName="grades"
          />
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Grade</DialogTitle>
              <DialogDescription>Enter grade details for a student</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Student *</Label>
                <Select value={formData.studentId} onValueChange={(v) => setFormData({ ...formData, studentId: v })}>
                  <SelectTrigger data-testid="select-student">
                    <SelectValue placeholder="Select student" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Subject *</Label>
                  <Select value={formData.subject} onValueChange={(v) => setFormData({ ...formData, subject: v })}>
                    <SelectTrigger data-testid="select-subject">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((s) => (
                        <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Term</Label>
                  <Select value={formData.term} onValueChange={(v) => setFormData({ ...formData, term: v })}>
                    <SelectTrigger data-testid="select-term">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Term 1">Term 1</SelectItem>
                      <SelectItem value="Term 2">Term 2</SelectItem>
                      <SelectItem value="Final">Final</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Score *</Label>
                  <Input
                    type="number"
                    value={formData.score}
                    onChange={(e) => setFormData({ ...formData, score: parseInt(e.target.value) || 0 })}
                    data-testid="input-score"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Max Score</Label>
                  <Input
                    type="number"
                    value={formData.maxScore}
                    onChange={(e) => setFormData({ ...formData, maxScore: parseInt(e.target.value) || 100 })}
                    data-testid="input-max-score"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Remarks</Label>
                <Textarea
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  placeholder="Add any comments..."
                  data-testid="input-remarks"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit} data-testid="button-save-grade">
                Add Grade
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
