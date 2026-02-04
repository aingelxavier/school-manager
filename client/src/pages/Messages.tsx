import { useState } from 'react';
import { useStore } from '@/lib/store';
import { useMessages, useStudents, useTeachers, useCreateMessage, useMarkMessageAsRead } from '@/lib/hooks';
import type { Message as MessageType } from '@shared/schema';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Plus, MessageSquare, Send, Mail, MailOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, parseISO } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Messages() {
  const { currentUser } = useStore();
  const { data: messages = [], isLoading } = useMessages();
  const { data: students = [] } = useStudents();
  const { data: teachers = [] } = useTeachers();
  const createMessage = useCreateMessage();
  const markAsRead = useMarkMessageAsRead();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<MessageType | null>(null);
  const [formData, setFormData] = useState({
    to: '',
    toRole: 'parent' as 'admin' | 'teacher' | 'student' | 'parent',
    subject: '',
    content: '',
  });

  const myMessages = messages.filter(
    (m) => m.from === currentUser?.name || m.to === currentUser?.name || m.to === 'All Teachers'
  );
  const unreadMessages = myMessages.filter((m) => !m.read && m.to === currentUser?.name);

  const handleSubmit = () => {
    if (!formData.to || !formData.subject || !formData.content) {
      toast({ title: 'Error', description: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }

    createMessage.mutate({
      from: currentUser?.name || '',
      fromRole: currentUser?.role || 'admin',
      to: formData.to,
      toRole: formData.toRole,
      subject: formData.subject,
      content: formData.content,
      date: new Date().toISOString().split('T')[0],
      read: false,
    }, {
      onSuccess: () => {
        toast({ title: 'Success', description: 'Message sent successfully' });
        setIsDialogOpen(false);
        setFormData({ to: '', toRole: 'parent', subject: '', content: '' });
      },
    });
  };

  const handleOpenMessage = (message: MessageType) => {
    setSelectedMessage(message);
    if (!message.read && message.to === currentUser?.name) {
      markAsRead.mutate(message.id);
    }
  };

  const recipients = currentUser?.role === 'teacher'
    ? students.map((s) => ({ name: s.parentName || s.name, role: 'parent' as const }))
    : currentUser?.role === 'parent'
    ? teachers.map((t) => ({ name: t.name, role: 'teacher' as const }))
    : [...students.map((s) => ({ name: s.name, role: 'student' as const })), ...teachers.map((t) => ({ name: t.name, role: 'teacher' as const }))];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">Messages</h1>
            <p className="text-muted-foreground">Communicate with teachers, students, and parents</p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)} data-testid="button-compose">
            <Plus className="h-4 w-4 mr-2" />
            Compose
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{myMessages.length}</div>
                  <p className="text-sm text-muted-foreground">Total Messages</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{unreadMessages.length}</div>
                  <p className="text-sm text-muted-foreground">Unread</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-green-100 text-green-600 dark:bg-green-900/30">
                  <Send className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{myMessages.filter((m) => m.from === currentUser?.name).length}</div>
                  <p className="text-sm text-muted-foreground">Sent</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Loading messages...</div>
          </div>
        ) : (
          <Tabs defaultValue="inbox" className="space-y-4">
            <TabsList>
              <TabsTrigger value="inbox" className="gap-2">
                <Mail className="h-4 w-4" />
                Inbox
                {unreadMessages.length > 0 && (
                  <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 justify-center">
                    {unreadMessages.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="sent" className="gap-2">
                <Send className="h-4 w-4" />
                Sent
              </TabsTrigger>
            </TabsList>

            <TabsContent value="inbox" className="space-y-4">
              {myMessages
                .filter((m) => m.to === currentUser?.name || m.to === 'All Teachers')
                .map((message) => (
                  <Card
                    key={message.id}
                    className={`cursor-pointer hover:shadow-md transition-shadow ${!message.read ? 'border-primary' : ''}`}
                    onClick={() => handleOpenMessage(message)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {message.read ? (
                            <MailOpen className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <Mail className="h-5 w-5 text-primary" />
                          )}
                          <div>
                            <CardTitle className={`text-base ${!message.read ? 'font-bold' : ''}`}>
                              {message.subject}
                            </CardTitle>
                            <CardDescription>
                              From: {message.from} ({message.fromRole})
                            </CardDescription>
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">{format(parseISO(message.date), 'd MMM, yyyy')}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">{message.content}</p>
                    </CardContent>
                  </Card>
                ))}
            </TabsContent>

            <TabsContent value="sent" className="space-y-4">
              {myMessages
                .filter((m) => m.from === currentUser?.name)
                .map((message) => (
                  <Card
                    key={message.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleOpenMessage(message)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Send className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <CardTitle className="text-base">{message.subject}</CardTitle>
                            <CardDescription>To: {message.to} ({message.toRole})</CardDescription>
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">{format(parseISO(message.date), 'd MMM, yyyy')}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">{message.content}</p>
                    </CardContent>
                  </Card>
                ))}
            </TabsContent>
          </Tabs>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Compose Message</DialogTitle>
              <DialogDescription>Send a message to a teacher, student, or parent</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>To *</Label>
                <Select 
                  value={formData.to} 
                  onValueChange={(v) => {
                    const recipient = recipients.find((r) => r.name === v);
                    setFormData({ ...formData, to: v, toRole: recipient?.role || 'parent' });
                  }}
                >
                  <SelectTrigger data-testid="select-to">
                    <SelectValue placeholder="Select recipient" />
                  </SelectTrigger>
                  <SelectContent>
                    {recipients.map((r) => (
                      <SelectItem key={r.name} value={r.name}>
                        {r.name} ({r.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Subject *</Label>
                <Input
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Message subject"
                  data-testid="input-subject"
                />
              </div>

              <div className="space-y-2">
                <Label>Message *</Label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write your message..."
                  rows={5}
                  data-testid="input-message"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit} data-testid="button-send">
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedMessage?.subject}</DialogTitle>
              <DialogDescription>
                {selectedMessage?.from === currentUser?.name
                  ? `To: ${selectedMessage?.to}`
                  : `From: ${selectedMessage?.from}`}
                {' • '}
                {selectedMessage && format(parseISO(selectedMessage.date), 'd MMM, yyyy')}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm whitespace-pre-wrap">{selectedMessage?.content}</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
