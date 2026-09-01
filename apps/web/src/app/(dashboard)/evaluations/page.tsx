'use client';
import { Star } from 'lucide-react';
import { EmptyState } from '@/components/ui';

export default function EvaluationsPage() {
  return (
    <div className="p-8">
      <h1 className="page-title mb-6">Evaluations</h1>
      <EmptyState
        icon={<Star className="w-10 h-10" />}
        title="Evaluations module coming soon"
        description="Assigned applications to evaluate and scoring workflows will appear here."
      />
    </div>
  );
}
