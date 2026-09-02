'use client';

import { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Target, Rocket, Users, Briefcase } from 'lucide-react';
import { Skeleton, EmptyState } from '@/components/ui';
import { useAuthStore } from '@/store/auth.store';
import api from '@/lib/api';

interface AnalyticsData {
  challenges: {
    active: number;
    completed: number;
    total: number;
    byStatus: Record<string, number>;
  };
  applications: {
    total: number;
    pendingReview: number;
    shortlisted: number;
    selected: number;
  };
  pilots: {
    active: number;
    completed: number;
    total: number;
  };
  procurement: {
    totalValueLakh: number;
  };
}

const StatCard = ({ title, value, icon: Icon, trend }: any) => (
  <div className="card p-6 flex flex-col justify-between">
    <div className="flex items-start justify-between mb-4">
      <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
        <Icon className="w-6 h-6" />
      </div>
      {trend && (
        <span className="flex items-center text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
          <TrendingUp className="w-3 h-3 mr-1" />
          {trend}
        </span>
      )}
    </div>
    <div>
      <h3 className="text-3xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-sm font-medium text-gray-500">{title}</p>
    </div>
  </div>
);

export default function AnalyticsPage() {
  const { user } = useAuthStore();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get<AnalyticsData>('/analytics/dashboard');
      setData(res);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <Skeleton className="h-10 w-48 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8">
        <h1 className="page-title mb-6">Analytics & Reports</h1>
        <EmptyState
          icon={<BarChart3 className="w-10 h-10" />}
          title="Analytics unavailable"
          description="Failed to load analytics data or you do not have permission."
        />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="page-title">Analytics Dashboard</h1>
        <p className="page-subtitle">Platform metrics and performance indicators</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Challenges" value={data.challenges.active} icon={Target} />
        <StatCard title="Total Applications" value={data.applications.total} icon={Briefcase} />
        <StatCard title="Active Pilots" value={data.pilots.active} icon={Rocket} />
        <StatCard title="Procurement (Lakhs)" value={`₹${data.procurement.totalValueLakh || 0}`} icon={BarChart3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Application Funnel */}
        <div className="card p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Application Funnel</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700">Total Submitted</span>
                <span className="font-bold text-gray-900">{data.applications.total}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div className="bg-blue-500 h-3 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700">Pending Review</span>
                <span className="font-bold text-gray-900">{data.applications.pendingReview}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div className="bg-yellow-500 h-3 rounded-full" style={{ width: `${(data.applications.pendingReview / Math.max(data.applications.total, 1)) * 100}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700">Shortlisted</span>
                <span className="font-bold text-gray-900">{data.applications.shortlisted}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div className="bg-indigo-500 h-3 rounded-full" style={{ width: `${(data.applications.shortlisted / Math.max(data.applications.total, 1)) * 100}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700">Selected for Pilot</span>
                <span className="font-bold text-gray-900">{data.applications.selected}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div className="bg-green-500 h-3 rounded-full" style={{ width: `${(data.applications.selected / Math.max(data.applications.total, 1)) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Challenge Status */}
        <div className="card p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Challenge Distribution</h2>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(data.challenges.byStatus || {}).map(([status, count]) => (
              <div key={status} className="p-4 bg-gray-50 rounded-lg border border-gray-100 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-bold text-gray-900 mb-1">{count}</span>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{status.replace(/_/g, ' ')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
