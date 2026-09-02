'use client';

import { useEffect, useState } from 'react';
import { Rocket, Target, Calendar, BarChart2, Building2 } from 'lucide-react';
import Link from 'next/link';
import { Button, EmptyState, Skeleton, Badge } from '@/components/ui';
import { useAuthStore } from '@/store/auth.store';
import { formatDate } from '@/lib/utils';
import api from '@/lib/api';

interface Pilot {
  id: string;
  title: string;
  status: string;
  budgetApprovedLakh: number | null;
  plannedStartDate: string | null;
  plannedEndDate: string | null;
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
  _count: {
    milestones: number;
    progressReports: number;
  };
}

const getPilotStatusBadge = (status: string) => {
  switch (status) {
    case 'PLANNING': return 'badge-yellow';
    case 'ACTIVE': return 'badge-blue';
    case 'PAUSED': return 'badge-orange';
    case 'COMPLETED': return 'badge-green';
    case 'TERMINATED': return 'badge-red';
    default: return 'badge-gray';
  }
};

export default function PilotsPage() {
  const { user } = useAuthStore();
  const [pilots, setPilots] = useState<Pilot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPilots();
  }, []);

  const fetchPilots = async () => {
    try {
      const res = await api.get<{ data: Pilot[] }>('/pilots');
      setPilots(res.data ?? []);
    } catch {
      setPilots([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="page-title">Pilots & PoCs</h1>
          <p className="page-subtitle">Track active deployments and proof-of-concepts</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      ) : pilots.length === 0 ? (
        <EmptyState
          icon={<Rocket className="w-10 h-10" />}
          title="No active pilots"
          description="There are currently no pilots running. Pilots are created when an application is selected."
        />
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {pilots.map((pilot) => (
            <div key={pilot.id} className="card p-6 flex flex-col hover:border-indigo-200 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="gray">Pilot</Badge>
                    <span className={getPilotStatusBadge(pilot.status)}>
                      {pilot.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 leading-tight mb-2 truncate">
                    {pilot.title}
                  </h3>
                  <div className="flex flex-col gap-1 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5 truncate">
                      <Target className="w-4 h-4 text-gray-400" />
                      Challenge: {pilot.challenge.title}
                    </span>
                    <span className="flex items-center gap-1.5 truncate">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      Startup: {pilot.application.startupProfile.organization.name}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-5 border-y border-gray-100 my-4">
                <div>
                  <span className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Budget</span>
                  <span className="text-sm font-medium text-gray-900">
                    {pilot.budgetApprovedLakh ? `₹${pilot.budgetApprovedLakh}L` : 'TBD'}
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Start Date</span>
                  <span className="text-sm font-medium text-gray-900">
                    {pilot.plannedStartDate ? formatDate(pilot.plannedStartDate) : 'TBD'}
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Milestones</span>
                  <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                    <Target className="w-3.5 h-3.5 text-gray-400" /> {pilot._count.milestones}
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Reports</span>
                  <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                    <BarChart2 className="w-3.5 h-3.5 text-gray-400" /> {pilot._count.progressReports}
                  </span>
                </div>
              </div>

              <div className="mt-auto flex justify-end">
                <Button variant="secondary" disabled>
                  Manage Pilot (Coming Soon)
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
