'use client';
import { FlaskConical } from 'lucide-react';
import { EmptyState } from '@/components/ui';

export default function PilotsPage() {
  return (
    <div className="p-8">
      <h1 className="page-title mb-6">Pilots</h1>
      <EmptyState
        icon={<FlaskConical className="w-10 h-10" />}
        title="Pilot management coming soon"
        description="Active pilots, KPI tracking, and milestone management will appear here."
      />
    </div>
  );
}
