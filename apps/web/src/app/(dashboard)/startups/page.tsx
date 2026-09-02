'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Search, MapPin, Users, Activity, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Button, EmptyState, Skeleton, Badge } from '@/components/ui';
import { useAuthStore, isGovernmentUser } from '@/store/auth.store';
import api from '@/lib/api';

interface StartupProfile {
  id: string;
  foundingYear: number | null;
  teamSize: number | null;
  fundingStage: string | null;
  technologies: string[];
  industries: string[];
  govtExperience: boolean;
  organization: {
    id: string;
    name: string;
    logoUrl: string | null;
    state: string | null;
    website: string | null;
  };
  _count: {
    applications: number;
  };
}

interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function StartupsPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [startups, setStartups] = useState<StartupProfile[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (user && !isGovernmentUser(user.role)) {
      router.push(user.role === 'STARTUP_USER' ? '/startups/profile' : '/dashboard');
      return;
    }
    fetchStartups();
  }, [user, page]);

  const fetchStartups = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '12' });
      if (search) params.set('search', search);

      const res = await api.get<{ data: StartupProfile[]; meta: Meta }>(`/startups?${params}`);
      setStartups(res.data ?? []);
      setMeta(res.meta ?? null);
    } catch {
      setStartups([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchStartups();
  };

  if (user && !isGovernmentUser(user.role)) return null;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="page-title">Startup Ecosystem</h1>
          <p className="page-subtitle">
            {meta ? `Showing ${meta.total} registered startup${meta.total !== 1 ? 's' : ''}` : 'Browse innovators'}
          </p>
        </div>
        <form onSubmit={handleSearch} className="relative w-full md:w-80">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search startups by name..."
            className="input pl-10 h-11 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-56 rounded-xl" />
          ))}
        </div>
      ) : startups.length === 0 ? (
        <EmptyState
          icon={<Building2 className="w-10 h-10" />}
          title="No startups found"
          description={search ? `No results matching "${search}"` : "No startups have registered yet."}
          action={search ? <Button variant="secondary" onClick={() => { setSearch(''); setPage(1); }}>Clear Search</Button> : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {startups.map((startup) => (
            <div key={startup.id} className="card p-6 flex flex-col h-full hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center shrink-0 border border-indigo-100">
                    {startup.organization.logoUrl ? (
                      <img src={startup.organization.logoUrl} alt="Logo" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <Building2 className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 leading-tight truncate max-w-[200px]">
                      {startup.organization.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                      <MapPin className="w-3 h-3" />
                      {startup.organization.state || 'India'}
                    </div>
                  </div>
                </div>
                {startup.govtExperience && (
                  <Badge variant="blue">Govt Exp</Badge>
                )}
              </div>

              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Funding</span>
                    <span className="text-sm font-medium text-gray-900">{startup.fundingStage?.replace(/_/g, ' ') || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Team Size</span>
                    <span className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-gray-400" /> {startup.teamSize || 'N/A'}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Key Technologies</span>
                  <div className="flex flex-wrap gap-1.5">
                    {startup.technologies.slice(0, 3).map(t => (
                      <span key={t} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[11px] rounded-md border border-gray-200">{t}</span>
                    ))}
                    {startup.technologies.length > 3 && (
                      <span className="px-2 py-0.5 bg-gray-50 text-gray-500 text-[11px] rounded-md">+{startup.technologies.length - 3}</span>
                    )}
                    {startup.technologies.length === 0 && <span className="text-sm text-gray-400">Not specified</span>}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="text-xs text-gray-500 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-gray-400" />
                  {startup._count.applications} applications
                </div>
                {startup.organization.website && (
                  <a href={startup.organization.website} target="_blank" rel="noreferrer" className="text-sm text-indigo-600 font-medium hover:text-indigo-700 flex items-center gap-1">
                    Website <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
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
