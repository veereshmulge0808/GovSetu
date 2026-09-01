'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAuthStore, isAdmin } from '@/store/auth.store';
import { Spinner, Alert } from '@/components/ui';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    } else if (user?.role && !isAdmin(user.role)) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user) {
    return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;
  }

  if (!isAdmin(user.role)) {
    return (
      <div className="p-8">
        <Alert variant="error">You do not have permission to access admin pages.</Alert>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
