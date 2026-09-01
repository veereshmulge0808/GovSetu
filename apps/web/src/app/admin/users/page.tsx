'use client';
import { Shield } from 'lucide-react';
import { EmptyState } from '@/components/ui';

export default function AdminUsersPage() {
  return (
    <div className="p-8">
      <h1 className="page-title mb-6">User Management</h1>
      <EmptyState
        icon={<Shield className="w-10 h-10" />}
        title="User management coming soon"
        description="Admin user list, role assignment, and deactivation tools will appear here."
      />
    </div>
  );
}
