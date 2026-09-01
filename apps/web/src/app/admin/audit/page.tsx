'use client';
import { useEffect, useState } from 'react';
import { Shield } from 'lucide-react';
import { Card, CardHeader, CardBody, Skeleton, EmptyState } from '@/components/ui';
import { formatDateTime } from '@/lib/utils';
import api from '@/lib/api';

interface AuditLog { id: string; action: string; entityType: string; entityId: string; createdAt: string; actor: { email: string; firstName: string; lastName: string } }

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ data: AuditLog[] }>('/audit')
      .then(r => setLogs(r.data ?? []))
      .catch(() => setLogs([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8">
      <h1 className="page-title mb-6">Audit Log</h1>
      <Card>
        <CardHeader><h2 className="section-title">All Activity</h2></CardHeader>
        {loading ? (
          <div className="p-6 space-y-3">{Array.from({length:5}).map((_,i)=><Skeleton key={i} className="h-10 rounded"/>)}</div>
        ) : logs.length === 0 ? (
          <EmptyState icon={<Shield className="w-8 h-8"/>} title="No audit logs yet" description="All system actions will be recorded here." />
        ) : (
          <div className="table-container rounded-t-none border-t-0">
            <table className="table">
              <thead><tr><th>Action</th><th>Entity</th><th>Actor</th><th>Time</th></tr></thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log.id}>
                    <td><span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{log.action}</span></td>
                    <td><span className="text-xs text-gray-500">{log.entityType}</span> <span className="text-xs text-gray-400 font-mono">{log.entityId.slice(0,8)}…</span></td>
                    <td className="text-sm">{log.actor?.firstName} {log.actor?.lastName}</td>
                    <td className="text-xs text-gray-500">{formatDateTime(log.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
