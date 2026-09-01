'use client';
import { useEffect, useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { StatCard, Skeleton, Card, CardHeader, CardBody } from '@/components/ui';
import { Users, FileText, FlaskConical, ShoppingCart } from 'lucide-react';
import api from '@/lib/api';

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<any>('/analytics/platform')
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8">
      <h1 className="page-title mb-2">Analytics</h1>
      <p className="page-subtitle mb-8">Platform-wide metrics and performance data</p>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({length: 4}).map((_,i) => <Skeleton key={i} className="h-28 rounded-xl"/>)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Users" value={stats?.users?.total ?? '—'} icon={<Users className="w-5 h-5"/>} />
          <StatCard label="Total Challenges" value={stats?.challenges?.total ?? '—'} icon={<FileText className="w-5 h-5"/>} />
          <StatCard label="Active Pilots" value={stats?.pilots?.active ?? '—'} icon={<FlaskConical className="w-5 h-5"/>} />
          <StatCard label="Procurements" value={stats?.procurement?.total ?? '—'} icon={<ShoppingCart className="w-5 h-5"/>} />
        </div>
      )}

      <Card>
        <CardHeader><h2 className="section-title">Detailed Charts</h2></CardHeader>
        <CardBody>
          <p className="text-sm text-gray-500">Advanced analytics charts (Recharts integration) coming in next iteration.</p>
        </CardBody>
      </Card>
    </div>
  );
}
