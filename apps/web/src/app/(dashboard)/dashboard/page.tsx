'use client';

import { useEffect, useState } from 'react';
import { useAuthStore, isGovernmentUser, isAdmin, isStartup } from '@/store/auth.store';
import { StatCard, EmptyState, Skeleton, Card, CardBody, CardHeader } from '@/components/ui';
import {
  FileText, Users, FlaskConical, BarChart3,
  TrendingUp, Clock, CheckCircle2, AlertCircle, Plus,
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { formatDate, CHALLENGE_STATUS_LABELS, getChallengeStatusBadge } from '@/lib/utils';

interface DashboardStats {
  challenges?: { total: number; published: number };
  applications?: { total: number };
  pilots?: { total: number; active: number };
  users?: { total: number };
}

interface RecentChallenge {
  id: string;
  title: string;
  status: string;
  sector: string | null;
  createdAt: string;
  _count?: { applications: number };
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentChallenges, setRecentChallenges] = useState<RecentChallenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const role = user?.role;
        if (!role) return;

        const [challengeRes] = await Promise.allSettled([
          api.get<{ data: RecentChallenge[]; meta: { total: number } }>('/challenges?limit=5'),
        ]);

        if (challengeRes.status === 'fulfilled') {
          setRecentChallenges(challengeRes.value?.data ?? []);
          setStats((prev) => ({ ...prev, challenges: { total: challengeRes.value?.meta?.total ?? 0, published: 0 } }));
        }

        if (role && isAdmin(role)) {
          const platformStats = await api.get<any>('/analytics/platform').catch(() => null);
          if (platformStats) {
            setStats({
              challenges: platformStats.challenges,
              applications: platformStats.applications,
              pilots: platformStats.pilots,
              users: platformStats.users,
            });
          }
        }
      } catch (e) {
        // silently handle — shows empty state
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const role = user?.role;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="page-title">
          Good day, {user?.firstName} 👋
        </h1>
        <p className="page-subtitle">
          Here's what's happening on GovSetu today.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))
        ) : (
          <>
            <StatCard
              label="Total Challenges"
              value={stats?.challenges?.total ?? '—'}
              icon={<FileText className="w-5 h-5" />}
              trend={{ value: 12, label: 'this month' }}
            />
            <StatCard
              label="Applications"
              value={stats?.applications?.total ?? '—'}
              icon={<Users className="w-5 h-5" />}
            />
            <StatCard
              label="Active Pilots"
              value={stats?.pilots?.active ?? '—'}
              icon={<FlaskConical className="w-5 h-5" />}
              trend={{ value: 5, label: 'vs last month' }}
            />
            {role && isAdmin(role) ? (
              <StatCard
                label="Platform Users"
                value={stats?.users?.total ?? '—'}
                icon={<BarChart3 className="w-5 h-5" />}
              />
            ) : (
              <StatCard
                label="Published"
                value={stats?.challenges?.published ?? '—'}
                icon={<CheckCircle2 className="w-5 h-5" />}
              />
            )}
          </>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Challenges — 2/3 width */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="section-title">Recent Challenges</h2>
                <div className="flex items-center gap-2">
                  {role && isGovernmentUser(role) && (
                    <Link href="/challenges/new" className="btn-primary btn btn-sm gap-1.5">
                      <Plus className="w-3.5 h-3.5" />
                      New
                    </Link>
                  )}
                  <Link href="/challenges" className="btn-secondary btn btn-sm">
                    View all
                  </Link>
                </div>
              </div>
            </CardHeader>
            <div className="divide-y divide-gray-50">
              {loading ? (
                <div className="p-6 space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="h-9 w-9 rounded-lg" />
                      <div className="flex-1 space-y-1.5">
                        <Skeleton className="h-3.5 w-3/4 rounded" />
                        <Skeleton className="h-3 w-1/2 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentChallenges.length === 0 ? (
                <EmptyState
                  icon={<FileText className="w-10 h-10" />}
                  title="No challenges yet"
                  description="Create your first innovation challenge to get started."
                  action={
                    role && isGovernmentUser(role) ? (
                      <Link href="/challenges/new" className="btn-primary btn btn-sm">
                        Post a challenge
                      </Link>
                    ) : undefined
                  }
                />
              ) : (
                recentChallenges.map((c) => (
                  <Link
                    key={c.id}
                    href={`/challenges/${c.id}`}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/60 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate leading-snug">
                        {c.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {c.sector && <span className="text-xs text-gray-400">{c.sector}</span>}
                        {c.sector && c._count && <span className="text-gray-300">·</span>}
                        {c._count && (
                          <span className="text-xs text-gray-400">{c._count.applications} applications</span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className={getChallengeStatusBadge(c.status)}>
                        {CHALLENGE_STATUS_LABELS[c.status] ?? c.status}
                      </span>
                      <span className="text-[11px] text-gray-400">{formatDate(c.createdAt)}</span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar Widgets — 1/3 width */}
        <div className="space-y-4">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <h2 className="section-title">Quick Actions</h2>
            </CardHeader>
            <CardBody className="space-y-2 pt-0">
              {role && isGovernmentUser(role) && (
                <Link href="/challenges/new" className="flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-50 transition-colors group">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                    <Plus className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Post Challenge</p>
                    <p className="text-xs text-gray-500">Create new innovation challenge</p>
                  </div>
                </Link>
              )}
              {role && isStartup(role) && (
                <Link href="/challenges" className="flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-50 transition-colors group">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                    <FileText className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Browse Challenges</p>
                    <p className="text-xs text-gray-500">Find opportunities to apply</p>
                  </div>
                </Link>
              )}
              <Link href="/analytics" className="flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-50 transition-colors group">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                  <TrendingUp className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">View Analytics</p>
                  <p className="text-xs text-gray-500">Platform metrics & reports</p>
                </div>
              </Link>
            </CardBody>
          </Card>

          {/* Platform Health */}
          <Card>
            <CardHeader>
              <h2 className="section-title">Platform Status</h2>
            </CardHeader>
            <CardBody className="space-y-3 pt-0">
              {[
                { label: 'API Server', status: 'operational', icon: <CheckCircle2 className="w-4 h-4 text-green-500" /> },
                { label: 'AI Matching', status: 'operational', icon: <CheckCircle2 className="w-4 h-4 text-green-500" /> },
                { label: 'Document Storage', status: 'operational', icon: <CheckCircle2 className="w-4 h-4 text-green-500" /> },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <span className="text-sm text-gray-700">{item.label}</span>
                  </div>
                  <span className="text-xs text-green-600 font-medium capitalize">{item.status}</span>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
