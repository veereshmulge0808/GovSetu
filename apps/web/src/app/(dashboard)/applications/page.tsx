'use client';
import { FileText } from 'lucide-react';
import { EmptyState } from '@/components/ui';
import Link from 'next/link';

export default function ApplicationsPage() {
  return (
    <div className="p-8">
      <h1 className="page-title mb-6">Applications</h1>
      <EmptyState
        icon={<FileText className="w-10 h-10" />}
        title="Applications module coming soon"
        description="Startup applications, evaluation status, and shortlisting will appear here."
        action={<Link href="/challenges" className="btn-primary btn btn-sm">Browse Challenges</Link>}
      />
    </div>
  );
}
