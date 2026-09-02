'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FileText, Search, Filter, Building2, ChevronRight, Calendar, Users, Briefcase
} from 'lucide-react';
import { Button, EmptyState, Skeleton, Badge } from '@/components/ui';
import { useAuthStore, isStartup, isGovernmentUser, isEvaluator } from '@/store/auth.store';
import { cn, formatDate, truncate, getChallengeStatusBadge } from '@/lib/utils';
import api from '@/lib/api';

interface Application {
  id: string;
  status: string;
  challengeId: string;
  startupProfileId: string;
  submittedAt: string | null;
  createdAt: string;
  challenge: {
    id: string;
    title: string;
    status: string;
  };
  startupProfile: {
    organization: {
      id: string;
      name: string;
      logoUrl: string | null;
    };
  };
  _count: {
    evaluatorAssignments: number;
  };
}

interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const STATUS_FILTERS = [
  { value: '', label: 'All' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'SUBMITTED', label: 'Submitted' },
  { value: 'UNDER_REVIEW', label: 'Under Review' },
  { value: 'SHORTLISTED', label: 'Shortlisted' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'SELECTED', label: 'Selected' },
  { value: 'PILOT_STAGE', label: 'Pilot Stage' },
  { value: 'COMPLETED', label: 'Completed' },
];

const getAppStatusBadge = (status: string) => {
  switch (status) {
    case 'DRAFT': return 'badge-gray';
    case 'SUBMITTED': return 'badge-blue';
    case 'UNDER_REVIEW': return 'badge-yellow';
    case 'ADDITIONAL_INFO_REQUIRED': return 'badge-orange';
    case 'SHORTLISTED': return 'badge-indigo';
    case 'REJECTED': return 'badge-red';
    case 'SELECTED': return 'badge-green';
    case 'PILOT_STAGE': return 'badge-purple';
    case 'COMPLETED': return 'badge-green';
    default: return 'badge-gray';
  }
};

const getAppStatusLabel = (status: string) => {
  return status.replace(/_/g, ' ');
};

export default function ApplicationsPage() {
  const { user } = useAuthStore();
  const [applications, setApplications] = useState<Application[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '12' });
      if (statusFilter) params.set('status', statusFilter);

      const res = await api.get<{ data: Application[]; meta: Meta }>(`/applications?${params}`);
      setApplications(res.data ?? []);
      setMeta(res.meta ?? null);
    } catch {
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchApplications(); }, [page, statusFilter]);

  const role = user?.role;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Applications</h1>
          <p className="page-subtitle">
            {meta ? `${meta.total} application${meta.total !== 1 ? 's' : ''} found` : 'Manage applications'}
          </p>
        </div>
        {role && isStartup(role) && (
          <Link href="/challenges">
            <Button variant="primary">
              Browse Challenges
            </Button>
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
        <div className="flex items-center gap-1.5 flex-wrap">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => { setStatusFilter(f.value); setPage(1); }}
              className={cn(
                'px-3.5 py-1.5 rounded-full text-xs font-medium transition-all',
                statusFilter === f.value
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300 hover:text-indigo-600',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <EmptyState
          icon={<FileText className="w-10 h-10" />}
          title="No applications found"
          description={statusFilter ? `No applications in ${statusFilter.replace(/_/g, ' ').toLowerCase()} status.` : role === 'STARTUP_USER' ? 'You have not submitted any applications yet.' : 'No applications found.'}
          action={role && isStartup(role) ? (
            <Link href="/challenges"><Button variant="primary">Browse Challenges</Button></Link>
          ) : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {applications.map((app) => (
            <Link
              key={app.id}
              href={`/applications/${app.id}`}
              className="card hover:shadow-md hover:border-indigo-100 transition-all duration-200 group block"
            >
              <div className="p-5">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={getAppStatusBadge(app.status)}>
                    {getAppStatusLabel(app.status)}
                  </span>
                  <span className="text-[11px] text-gray-400">
                    {formatDate(app.submittedAt ?? app.createdAt)}
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-gray-900 leading-snug mb-2 group-hover:text-indigo-700 transition-colors line-clamp-2">
                  Challenge: {app.challenge?.title}
                </h3>

                <div className="pt-3 border-t border-gray-50 space-y-2 mt-4">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Building2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="truncate">{app.startupProfile?.organization?.name}</span>
                  </div>
                  {isGovernmentUser(role) && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Users className="w-3.5 h-3.5 text-gray-400" />
                      <span>{app._count?.evaluatorAssignments ?? 0} evaluators assigned</span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button
            variant="secondary"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {meta.page} of {meta.totalPages}
          </span>
          <Button
            variant="secondary"
            size="sm"
            disabled={page >= meta.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
