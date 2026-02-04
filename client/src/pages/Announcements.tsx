import { useState } from 'react';
import { useStore } from '@/lib/store';
import { useAnnouncements, useCreateAnnouncement, useUpdateAnnouncement, useDeleteAnnouncement, useCreateAuditLog } from '@/lib/hooks';
import type { Announcement as AnnouncementType } from '@shared/schema';
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
import { format, parseISO } from 'date-fns';
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
import { Plus, Bell, Megaphone, Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Announcements() {
  const { currentUser } = useStore();
  const { data: announcements = [], isLoading } = useAnnouncements();
  const createAnnouncement = useCreateAnnouncement();
  const updateAnnouncement = useUpdateAnnouncement();
  const deleteAnnouncement = useDeleteAnnouncement();
  const createAuditLog = useCreateAuditLog();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<AnnouncementType | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    audience: ['all'] as string[],
  });

  const isTeacherOrAdmin = currentUser?.role === 'admin' || currentUser?.role === 'teacher';

  const resetForm = () => {
    setFormData({ title: '', content: '', priority: 'medium', audience: ['all'] });
    setEditingAnnouncement(null);
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.content) {
      toast({ title: 'Error', description: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }

    if (editingAnnouncement) {
      updateAnnouncement.mutate({
        id: editingAnnouncement.id,
        data: formData,
      }, {
        onSuccess: () => {
          toast({ title: 'Success', description: 'Announcement updated successfully' });
          setIsDialogOpen(false);
          resetForm();
        },
      });
    } else {
      createAnnouncement.mutate({
        ...formData,
        author: currentUser?.name || '',
        authorRole: currentUser?.role || 'admin',
        date: new Date().toISOString().split('T')[0],
      }, {
        onSuccess: () => {
          createAuditLog.mutate({
            action: 'Announcement Created',
            user: currentUser?.name || '',
            userRole: currentUser?.role || 'admin',
            details: `Created announcement: ${formData.title}`,
            timestamp: new Date().toISOString(),
            ip: '192.168.1.100',
          });
          toast({ title: 'Success', description: 'Announcement created successfully' });
          setIsDialogOpen(false);
          resetForm();
        },
      });
    }
  };

  const handleEdit = (announcement: AnnouncementType) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      priority: announcement.priority as 'low' | 'medium' | 'high',
      audience: announcement.audience,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (announcement: AnnouncementType) => {
    deleteAnnouncement.mutate(announcement.id, {
      onSuccess: () => {
        createAuditLog.mutate({
          action: 'Announcement Deleted',
          user: currentUser?.name || '',
          userRole: currentUser?.role || 'admin',
          details: `Deleted announcement: ${announcement.title}`,
          timestamp: new Date().toISOString(),
          ip: '192.168.1.100',
        });
        toast({ title: 'Success', description: 'Announcement deleted successfully' });
      },
    });
  };

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      high: 'destructive',
      medium: 'default',
      low: 'secondary',
    };
    return <Badge variant={variants[priority]}>{priority}</Badge>;
  };

  const highPriority = announcements.filter((a) => a.priority === 'high');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">Announcements</h1>
            <p className="text-muted-foreground">
              {isTeacherOrAdmin ? 'Create and manage school announcements' : 'Stay updated with school news'}
            </p>
          </div>
          {isTeacherOrAdmin && (
            <Button onClick={() => { resetForm(); setIsDialogOpen(true); }} data-testid="button-add-announcement">
              <Plus className="h-4 w-4 mr-2" />
              Create Announcement
            </Button>
          )}
        </div>

        {highPriority.length > 0 && (
          <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <Megaphone className="h-5 w-5" />
                Important Announcements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {highPriority.map((ann) => (
                <div key={ann.id} className="p-4 rounded-lg bg-white dark:bg-card border">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold">{ann.title}</h4>
                    <span className="text-sm text-muted-foreground">{format(parseISO(ann.date), 'd MMM, yyyy')}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{ann.content}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Loading announcements...</div>
          </div>
        ) : (
          <div className="grid gap-4">
            {announcements.map((announcement) => (
              <Card key={announcement.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5 text-muted-foreground" />
                        {announcement.title}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <span>{announcement.author}</span>
                        <span>•</span>
                        <span className="capitalize">{announcement.authorRole}</span>
                        <span>•</span>
                        <span>{format(parseISO(announcement.date), 'd MMM, yyyy')}</span>
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {getPriorityBadge(announcement.priority)}
                      {isTeacherOrAdmin && (
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(announcement)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(announcement)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{announcement.content}</p>
                  <div className="flex gap-2 mt-4">
                    {announcement.audience.map((aud) => (
                      <Badge key={aud} variant="outline" className="capitalize">
                        {aud}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingAnnouncement ? 'Edit Announcement' : 'Create Announcement'}</DialogTitle>
              <DialogDescription>
                {editingAnnouncement ? 'Update announcement details' : 'Create a new announcement'}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Announcement title"
                  data-testid="input-title"
                />
              </div>

              <div className="space-y-2">
                <Label>Content *</Label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Announcement content..."
                  rows={4}
                  data-testid="input-content"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={formData.priority} onValueChange={(v: 'low' | 'medium' | 'high') => setFormData({ ...formData, priority: v })}>
                    <SelectTrigger data-testid="select-priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Audience</Label>
                  <Select 
                    value={formData.audience[0]} 
                    onValueChange={(v) => setFormData({ ...formData, audience: [v] })}
                  >
                    <SelectTrigger data-testid="select-audience">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="students">Students</SelectItem>
                      <SelectItem value="teachers">Teachers</SelectItem>
                      <SelectItem value="parents">Parents</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit} data-testid="button-save-announcement">
                {editingAnnouncement ? 'Update' : 'Create'} Announcement
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
