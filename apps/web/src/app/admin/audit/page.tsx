'use client';

import { useEffect, useState } from 'react';
import { Shield, Clock, Search, Filter } from 'lucide-react';
import { Skeleton, EmptyState, Badge, Button } from '@/components/ui';
import { formatDate } from '@/lib/utils';
import api from '@/lib/api';

interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  actorId: string;
  previousValue: any;
  newValue: any;
  ipAddress: string | null;
  userAgent: string | null;
  timestamp: string;
  actor: {
    email: string;
    firstName: string;
    lastName: string;
  };
}

interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [entityType, setEntityType] = useState('');

  useEffect(() => {
    fetchLogs();
  }, [page, entityType]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (entityType) params.set('entityType', entityType);

      const res = await api.get<{ data: AuditLog[]; meta: Meta }>(`/audit?${params}`);
      setLogs(res.data ?? []);
      setMeta(res.meta ?? null);
    } catch {
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Audit Logs</h1>
          <p className="page-subtitle">Immutable record of platform activity</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            className="input h-10"
            value={entityType}
            onChange={(e) => { setEntityType(e.target.value); setPage(1); }}
          >
            <option value="">All Entities</option>
            <option value="Challenge">Challenges</option>
            <option value="Application">Applications</option>
            <option value="User">Users</option>
            <option value="Pilot">Pilots</option>
          </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : logs.length === 0 ? (
          <EmptyState
            icon={<Shield className="w-10 h-10" />}
            title="No audit logs found"
            description="No matching activity found in the system."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 uppercase font-semibold text-xs border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">Actor</th>
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">Entity</th>
                  <th className="px-6 py-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {formatDate(log.timestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{log.actor?.firstName} {log.actor?.lastName}</div>
                      <div className="text-gray-500 text-xs">{log.actor?.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="gray">{log.action}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{log.entityType}</div>
                      <div className="text-gray-500 text-[10px] font-mono">{log.entityId.slice(0, 8)}...</div>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500 max-w-xs truncate">
                      {log.newValue ? JSON.stringify(log.newValue) : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
          <span className="text-sm text-gray-600">Page {meta.page} of {meta.totalPages}</span>
          <Button variant="secondary" size="sm" disabled={page >= meta.totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
        </div>
      )}
    </div>
  );
}
