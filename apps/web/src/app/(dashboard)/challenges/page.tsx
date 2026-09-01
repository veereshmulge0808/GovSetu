'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FileText, Plus, Search, Filter, Building2,
  ChevronRight, Calendar, Users,
} from 'lucide-react';
import { Button, EmptyState, Skeleton, Badge } from '@/components/ui';
import { useAuthStore, isGovernmentUser } from '@/store/auth.store';
import { cn, formatDate, truncate, getChallengeStatusBadge, CHALLENGE_STATUS_LABELS } from '@/lib/utils';
import api from '@/lib/api';

interface Challenge {
  id: string;
  title: string;
  status: string;
  sector: string | null;
  domain: string | null;
  location: string | null;
  state: string | null;
  budgetMinLakh: number | null;
  budgetMaxLakh: number | null;
  submissionDeadline: string | null;
  createdAt: string;
  problemStatement: string;
  organization: { id: string; name: string; logoUrl: string | null };
  _count: { applications: number };
}

interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const STATUS_FILTERS = [
  { value: '', label: 'All' },
  { value: 'PUBLISHED', label: 'Published' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'EVALUATION', label: 'Evaluation' },
  { value: 'PILOT', label: 'Pilot' },
  { value: 'COMPLETED', label: 'Completed' },
];

export default function ChallengesPage() {
  const { user } = useAuthStore();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  const fetchChallenges = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '12' });
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);

      const res = await api.get<{ data: Challenge[]; meta: Meta }>(`/challenges?${params}`);
      setChallenges(res.data ?? []);
      setMeta(res.meta ?? null);
    } catch {
      setChallenges([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchChallenges(); }, [page, statusFilter]);
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); fetchChallenges(); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const role = user?.role;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Challenges</h1>
          <p className="page-subtitle">
            {meta ? `${meta.total} challenge${meta.total !== 1 ? 's' : ''} found` : 'Browse innovation challenges'}
          </p>
        </div>
        {role && isGovernmentUser(role) && (
          <Link href="/challenges/new">
            <Button variant="primary">
              <Plus className="w-4 h-4" />
              Post Challenge
            </Button>
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="search"
            placeholder="Search challenges…"
            className="input pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
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

      {/* Challenge Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-56 rounded-xl" />
          ))}
        </div>
      ) : challenges.length === 0 ? (
        <EmptyState
          icon={<FileText className="w-10 h-10" />}
          title="No challenges found"
          description={search ? `No results for "${search}"` : 'Be the first to post an innovation challenge.'}
          action={role && isGovernmentUser(role) ? (
            <Link href="/challenges/new"><Button variant="primary"><Plus className="w-4 h-4" />Post Challenge</Button></Link>
          ) : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {challenges.map((c) => (
            <Link
              key={c.id}
              href={`/challenges/${c.id}`}
              className="card hover:shadow-md hover:border-indigo-100 transition-all duration-200 group block"
            >
              <div className="p-5">
                {/* Status + Sector */}
                <div className="flex items-center gap-2 mb-3">
                  <span className={getChallengeStatusBadge(c.status)}>
                    {CHALLENGE_STATUS_LABELS[c.status] ?? c.status}
                  </span>
                  {c.sector && (
                    <span className="badge-gray text-[11px]">{c.sector}</span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-sm font-semibold text-gray-900 leading-snug mb-2 group-hover:text-indigo-700 transition-colors line-clamp-2">
                  {c.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-2">
                  {c.problemStatement}
                </p>

                {/* Meta footer */}
                <div className="pt-3 border-t border-gray-50 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Building2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="truncate">{c.organization?.name}</span>
                    {c.state && <><span className="text-gray-300">·</span><span>{c.state}</span></>}
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-gray-400" />
                      <span>{c._count?.applications ?? 0} applications</span>
                    </div>
                    {c.submissionDeadline && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span>Due {formatDate(c.submissionDeadline)}</span>
                      </div>
                    )}
                  </div>
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
