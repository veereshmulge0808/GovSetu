'use client';
import { useAuthStore } from '@/store/auth.store';
import { Card, CardHeader, CardBody } from '@/components/ui';
import { ROLE_LABELS } from '@/lib/utils';

export default function SettingsPage() {
  const { user } = useAuthStore();
  return (
    <div className="p-8 max-w-2xl">
      <h1 className="page-title mb-6">Settings</h1>
      <Card>
        <CardHeader><h2 className="section-title">Your Profile</h2></CardHeader>
        <CardBody className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-xs text-gray-500 mb-1">First Name</p><p className="text-sm font-medium text-gray-900">{user?.firstName}</p></div>
            <div><p className="text-xs text-gray-500 mb-1">Last Name</p><p className="text-sm font-medium text-gray-900">{user?.lastName}</p></div>
          </div>
          <div><p className="text-xs text-gray-500 mb-1">Email</p><p className="text-sm font-medium text-gray-900">{user?.email}</p></div>
          <div><p className="text-xs text-gray-500 mb-1">Role</p><p className="text-sm font-medium text-gray-900">{user?.role ? ROLE_LABELS[user.role] : ''}</p></div>
        </CardBody>
      </Card>
    </div>
  );
}
