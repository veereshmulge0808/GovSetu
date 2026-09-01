'use client';
import { Zap } from 'lucide-react';
import { EmptyState } from '@/components/ui';

export default function StartupsPage() {
  return (
    <div className="p-8">
      <h1 className="page-title mb-6">Startups</h1>
      <EmptyState
        icon={<Zap className="w-10 h-10" />}
        title="Startup discovery coming soon"
        description="Browse and discover verified startups with AI-powered matching scores."
      />
    </div>
  );
}
