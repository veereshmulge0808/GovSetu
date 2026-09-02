'use client';

import { useEffect, useState } from 'react';
import { ShoppingCart, Target, Calendar, Building2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button, EmptyState, Skeleton, Badge } from '@/components/ui';
import { useAuthStore } from '@/store/auth.store';
import { formatDate } from '@/lib/utils';
import api from '@/lib/api';

interface Procurement {
  id: string;
  status: string;
  contractValueLakh: number | null;
  contractDuration: string | null;
  approvedAt: string | null;
  pilot: {
    id: string;
    title: string;
    challenge: {
      id: string;
      title: string;
    };
    application: {
      startupProfile: {
        organization: {
          id: string;
          name: string;
          logoUrl: string | null;
        };
      };
    };
  };
}

const getProcurementStatusBadge = (status: string) => {
  switch (status) {
    case 'PENDING': return 'badge-yellow';
    case 'COMPLIANCE_REVIEW':
    case 'DOCUMENTATION':
    case 'APPROVAL':
      return 'badge-orange';
    case 'CONTRACTING':
    case 'IMPLEMENTATION':
      return 'badge-blue';
    case 'COMPLETED': return 'badge-green';
    case 'CANCELLED': return 'badge-red';
    default: return 'badge-gray';
  }
};

export default function ProcurementPage() {
  const { user } = useAuthStore();
  const [procurements, setProcurements] = useState<Procurement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProcurements();
  }, []);

  const fetchProcurements = async () => {
    try {
      const res = await api.get<{ data: Procurement[] }>('/procurement');
      setProcurements(res.data ?? []);
    } catch {
      setProcurements([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="page-title">Procurement</h1>
          <p className="page-subtitle">Track and manage innovation procurement lifecycles</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      ) : procurements.length === 0 ? (
        <EmptyState
          icon={<ShoppingCart className="w-10 h-10" />}
          title="No procurement records"
          description={
            user?.role === 'STARTUP_USER'
              ? "You don't have any active procurement processes yet. Successfully complete a pilot to initiate procurement."
              : "No procurement processes have been initiated yet. Procurement begins after a successful pilot is recommended."
          }
        />
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {procurements.map((proc) => (
            <div key={proc.id} className="card p-6 flex flex-col hover:border-indigo-200 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="gray">Procurement</Badge>
                    <span className={getProcurementStatusBadge(proc.status)}>
                      {proc.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 leading-tight mb-2 truncate">
                    {proc.pilot.title}
                  </h3>
                  <div className="flex flex-col gap-1 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5 truncate">
                      <Target className="w-4 h-4 text-gray-400" />
                      Challenge: {proc.pilot.challenge.title}
                    </span>
                    <span className="flex items-center gap-1.5 truncate">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      Startup: {proc.pilot.application.startupProfile.organization.name}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-5 border-y border-gray-100 my-4">
                <div>
                  <span className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Contract Value</span>
                  <span className="text-sm font-medium text-gray-900">
                    {proc.contractValueLakh ? `₹${proc.contractValueLakh}L` : 'TBD'}
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Duration</span>
                  <span className="text-sm font-medium text-gray-900">
                    {proc.contractDuration || 'TBD'}
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Approved Date</span>
                  <span className="text-sm font-medium text-gray-900">
                    {proc.approvedAt ? formatDate(proc.approvedAt) : 'Pending'}
                  </span>
                </div>
              </div>

              <div className="mt-auto flex justify-end">
                <Button variant="secondary" disabled>
                  Manage Procurement (Coming Soon)
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
