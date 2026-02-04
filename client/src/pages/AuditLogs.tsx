import { useAuditLogs } from '@/lib/hooks';
import type { AuditLog as AuditLogType } from '@shared/schema';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable } from '@/components/DataTable';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { History, Shield, AlertTriangle, Info } from 'lucide-react';

export default function AuditLogs() {
  const { data: auditLogs = [], isLoading } = useAuditLogs();

  const getActionBadge = (action: string) => {
    if (action.includes('Deleted')) {
      return <Badge variant="destructive">{action}</Badge>;
    }
    if (action.includes('Added') || action.includes('Created')) {
      return <Badge className="bg-green-500">{action}</Badge>;
    }
    if (action.includes('Updated') || action.includes('Paid')) {
      return <Badge className="bg-blue-500">{action}</Badge>;
    }
    return <Badge variant="secondary">{action}</Badge>;
  };

  const columns = [
    {
      key: 'timestamp',
      label: 'Timestamp',
      sortable: true,
      render: (log: AuditLogType) => new Date(log.timestamp).toLocaleString(),
    },
    {
      key: 'action',
      label: 'Action',
      render: (log: AuditLogType) => getActionBadge(log.action),
    },
    { key: 'user', label: 'User', sortable: true },
    {
      key: 'userRole',
      label: 'Role',
      render: (log: AuditLogType) => (
        <Badge variant="outline" className="capitalize">
          {log.userRole}
        </Badge>
      ),
    },
    { key: 'details', label: 'Details' },
    { key: 'ip', label: 'IP Address' },
  ];

  const totalActions = auditLogs.length;
  const addActions = auditLogs.filter((l) => l.action.includes('Added') || l.action.includes('Created')).length;
  const updateActions = auditLogs.filter((l) => l.action.includes('Updated') || l.action.includes('Paid')).length;
  const deleteActions = auditLogs.filter((l) => l.action.includes('Deleted')).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold">Audit Logs</h1>
          <p className="text-muted-foreground">Track all administrative actions and changes</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <History className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{totalActions}</div>
                  <p className="text-sm text-muted-foreground">Total Actions</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-green-100 text-green-600 dark:bg-green-900/30">
                  <Info className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{addActions}</div>
                  <p className="text-sm text-muted-foreground">Creations</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{updateActions}</div>
                  <p className="text-sm text-muted-foreground">Updates</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-red-100 text-red-600 dark:bg-red-900/30">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{deleteActions}</div>
                  <p className="text-sm text-muted-foreground">Deletions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Loading audit logs...</div>
          </div>
        ) : (
          <DataTable
            data={auditLogs}
            columns={columns}
            searchKeys={['action', 'user', 'details']}
            exportFileName="audit-logs"
          />
        )}
      </div>
    </DashboardLayout>
  );
}
