import { useState } from 'react';
import { useStore } from '@/lib/store';
import { useFees, useStudents, useCreateFee, useUpdateFee, useCreateAuditLog } from '@/lib/hooks';
import type { Fee as FeeType } from '@shared/schema';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable } from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, IndianRupee, CheckCircle, Clock, AlertCircle, MessageCircle, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, parseISO } from 'date-fns';

export default function Fees() {
  const { currentUser } = useStore();
  const { data: fees = [], isLoading } = useFees();
  const { data: students = [] } = useStudents();
  const createFee = useCreateFee();
  const updateFee = useUpdateFee();
  const createAuditLog = useCreateAuditLog();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    studentId: '',
    type: 'Tuition Fee',
    amount: 0,
    dueDate: '',
    status: 'pending' as 'paid' | 'pending' | 'overdue',
  });

  const isAdmin = currentUser?.role === 'admin';
  const isStudentOrParent = currentUser?.role === 'student' || currentUser?.role === 'parent';

  const myFees = isStudentOrParent
    ? fees.filter((f) => f.studentId === 's1')
    : fees;

  const handleSubmit = () => {
    if (!formData.studentId || !formData.amount || !formData.dueDate) {
      toast({ title: 'Error', description: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }

    const student = students.find((s) => s.id === formData.studentId);
    createFee.mutate({
      ...formData,
      amount: formData.amount.toString(),
      studentName: student?.name || '',
    }, {
      onSuccess: () => {
        createAuditLog.mutate({
          action: 'Fee Created',
          user: currentUser?.name || '',
          userRole: currentUser?.role || 'admin',
          details: `Created ${formData.type} for ${student?.name}`,
          timestamp: new Date().toISOString(),
          ip: '192.168.1.100',
        });
        toast({ title: 'Success', description: 'Fee created successfully' });
        setIsDialogOpen(false);
        setFormData({ studentId: '', type: 'Tuition Fee', amount: 0, dueDate: '', status: 'pending' });
      },
    });
  };

  const handleMarkPaid = (fee: FeeType) => {
    updateFee.mutate({
      id: fee.id,
      data: { status: 'paid', paidDate: new Date().toISOString().split('T')[0] },
    }, {
      onSuccess: () => {
        createAuditLog.mutate({
          action: 'Fee Paid',
          user: currentUser?.name || '',
          userRole: currentUser?.role || 'admin',
          details: `Marked ${fee.type} as paid for ${fee.studentName}`,
          timestamp: new Date().toISOString(),
          ip: '192.168.1.100',
        });
        toast({ title: 'Success', description: 'Fee marked as paid' });
      },
    });
  };

  const handleSendReminder = (fee: FeeType, method: 'whatsapp' | 'sms') => {
    toast({
      title: 'Reminder Sent',
      description: `Payment reminder sent via ${method === 'whatsapp' ? 'WhatsApp' : 'SMS'} to ${fee.studentName}`,
    });
  };

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { variant: 'default' | 'secondary' | 'destructive'; icon: React.ReactNode }> = {
      paid: { variant: 'default', icon: <CheckCircle className="h-3 w-3" /> },
      pending: { variant: 'secondary', icon: <Clock className="h-3 w-3" /> },
      overdue: { variant: 'destructive', icon: <AlertCircle className="h-3 w-3" /> },
    };
    const config = configs[status];
    return (
      <Badge variant={config.variant} className="gap-1 capitalize">
        {config.icon}
        {status}
      </Badge>
    );
  };

  const columns = [
    { key: 'studentName', label: 'Student', sortable: true },
    { key: 'type', label: 'Fee Type' },
    {
      key: 'amount',
      label: 'Amount',
      render: (fee: FeeType) => `₹${parseFloat(fee.amount).toLocaleString()}`,
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      sortable: true,
      render: (fee: FeeType) => format(parseISO(fee.dueDate), 'd MMM, yyyy'),
    },
    {
      key: 'status',
      label: 'Status',
      render: (fee: FeeType) => getStatusBadge(fee.status),
    },
    {
      key: 'paidDate',
      label: 'Paid Date',
      render: (fee: FeeType) => fee.paidDate ? format(parseISO(fee.paidDate), 'd MMM, yyyy') : '-',
    },
  ];

  const paidFees = myFees.filter((f) => f.status === 'paid');
  const pendingFees = myFees.filter((f) => f.status === 'pending');
  const overdueFees = myFees.filter((f) => f.status === 'overdue');
  const totalPaid = paidFees.reduce((sum, f) => sum + parseFloat(f.amount), 0);
  const totalPending = pendingFees.reduce((sum, f) => sum + parseFloat(f.amount), 0);
  const totalOverdue = overdueFees.reduce((sum, f) => sum + parseFloat(f.amount), 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">Fees & Payments</h1>
            <p className="text-muted-foreground">
              {isStudentOrParent ? 'View your fee status and payment history' : 'Manage student fees and track payments'}
            </p>
          </div>
          {isAdmin && (
            <Button onClick={() => setIsDialogOpen(true)} data-testid="button-add-fee">
              <Plus className="h-4 w-4 mr-2" />
              Add Fee
            </Button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-green-100 text-green-600 dark:bg-green-900/30">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">₹{totalPaid.toLocaleString()}</div>
                  <p className="text-sm text-muted-foreground">Paid</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600">₹{totalPending.toLocaleString()}</div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-red-100 text-red-600 dark:bg-red-900/30">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">₹{totalOverdue.toLocaleString()}</div>
                  <p className="text-sm text-muted-foreground">Overdue</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <IndianRupee className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold">₹{(totalPaid + totalPending + totalOverdue).toLocaleString()}</div>
                  <p className="text-sm text-muted-foreground">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Loading fees...</div>
          </div>
        ) : (
          <DataTable
            data={myFees}
            columns={columns}
            searchKeys={['studentName', 'type']}
            exportFileName="fees"
            actions={isAdmin ? (fee) => (
              fee.status !== 'paid' ? (
                <div className="flex items-center gap-1">
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => handleSendReminder(fee, 'whatsapp')} title="Send WhatsApp Reminder">
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => handleSendReminder(fee, 'sms')} title="Send SMS Reminder">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleMarkPaid(fee)} data-testid={`button-pay-${fee.id}`}>
                    Mark Paid
                  </Button>
                </div>
              ) : null
            ) : undefined}
          />
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Fee</DialogTitle>
              <DialogDescription>Create a new fee record for a student</DialogDescription>
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
                  <Label>Fee Type</Label>
                  <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                    <SelectTrigger data-testid="select-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tuition Fee">Tuition Fee</SelectItem>
                      <SelectItem value="Lab Fee">Lab Fee</SelectItem>
                      <SelectItem value="Library Fee">Library Fee</SelectItem>
                      <SelectItem value="Sports Fee">Sports Fee</SelectItem>
                      <SelectItem value="Transport Fee">Transport Fee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Amount *</Label>
                  <Input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                    data-testid="input-amount"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Due Date *</Label>
                <Input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  data-testid="input-due-date"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit} data-testid="button-save-fee">
                Add Fee
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
