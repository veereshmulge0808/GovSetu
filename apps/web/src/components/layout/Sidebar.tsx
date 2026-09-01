'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn, getInitials, ROLE_LABELS } from '@/lib/utils';
import { useAuthStore, isAdmin, isGovernmentUser, isStartup, canEvaluate } from '@/store/auth.store';
import {
  LayoutDashboard, FileText, Users, Building2,
  FlaskConical, ShoppingCart, BarChart3, Bell,
  Settings, LogOut, Zap, ChevronRight, Shield,
  ClipboardList, Star,
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  roles?: string[];
}

const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard',       label: 'Dashboard',     icon: <LayoutDashboard className="w-4 h-4" /> },
  { href: '/challenges',      label: 'Challenges',    icon: <FileText className="w-4 h-4" /> },
  { href: '/startups',        label: 'Startups',      icon: <Zap className="w-4 h-4" />,     roles: ['GOVERNMENT_OFFICER', 'ADMIN', 'SUPER_ADMIN', 'EVALUATOR'] },
  { href: '/applications',    label: 'Applications',  icon: <ClipboardList className="w-4 h-4" /> },
  { href: '/evaluations',     label: 'Evaluations',   icon: <Star className="w-4 h-4" />,     roles: ['EVALUATOR', 'GOVERNMENT_OFFICER', 'ADMIN', 'SUPER_ADMIN'] },
  { href: '/pilots',          label: 'Pilots',        icon: <FlaskConical className="w-4 h-4" />, roles: ['GOVERNMENT_OFFICER', 'PILOT_MANAGER', 'ADMIN', 'SUPER_ADMIN'] },
  { href: '/procurement',     label: 'Procurement',   icon: <ShoppingCart className="w-4 h-4" />, roles: ['GOVERNMENT_OFFICER', 'PROCUREMENT_OFFICER', 'ADMIN', 'SUPER_ADMIN'] },
  { href: '/analytics',       label: 'Analytics',     icon: <BarChart3 className="w-4 h-4" />, roles: ['GOVERNMENT_OFFICER', 'ADMIN', 'SUPER_ADMIN'] },
];

const ADMIN_NAV_ITEMS: NavItem[] = [
  { href: '/admin/users', label: 'Users',     icon: <Users className="w-4 h-4" /> },
  { href: '/admin/audit', label: 'Audit Log', icon: <Shield className="w-4 h-4" /> },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, clearAuth } = useAuthStore();

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === href : pathname.startsWith(href);

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.roles || (user?.role && item.roles.includes(user.role)),
  );

  return (
    <aside className="flex flex-col w-60 min-h-screen bg-white border-r border-gray-100 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <Building2 className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="font-bold text-gray-900 text-sm leading-tight">GovSetu</p>
          <p className="text-[10px] text-gray-400 leading-tight">Innovation Platform</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-thin">
        {visibleItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn('sidebar-link', isActive(item.href) && 'sidebar-link-active')}
          >
            {item.icon}
            <span className="flex-1">{item.label}</span>
            {isActive(item.href) && <ChevronRight className="w-3.5 h-3.5 opacity-50" />}
          </Link>
        ))}

        {/* Admin Section */}
        {user?.role && isAdmin(user.role) && (
          <>
            <div className="pt-4 pb-1 px-3">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                Administration
              </p>
            </div>
            {ADMIN_NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn('sidebar-link', isActive(item.href) && 'sidebar-link-active')}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </>
        )}
      </nav>

      {/* Bottom — user profile */}
      <div className="border-t border-gray-100 p-3">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="avatar-sm shrink-0">
            {getInitials(user?.firstName, user?.lastName)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate leading-tight">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-[11px] text-gray-400 leading-tight">
              {user?.role ? ROLE_LABELS[user.role] : ''}
            </p>
          </div>
        </div>
        <div className="mt-1 space-y-0.5">
          <Link href="/settings" className={cn('sidebar-link', isActive('/settings') && 'sidebar-link-active')}>
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </Link>
          <button
            onClick={() => {
              clearAuth();
              window.location.href = '/login';
            }}
            className="sidebar-link w-full text-red-500 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

export function TopBar({ title }: { title?: string }) {
  const { user } = useAuthStore();

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0">
      <h1 className="text-base font-semibold text-gray-900">{title}</h1>
      <div className="flex items-center gap-3">
        <Link href="/notifications" className="btn-icon btn text-gray-500 hover:text-gray-700 hover:bg-gray-100">
          <Bell className="w-4 h-4" />
        </Link>
        <div className="avatar-sm">
          {getInitials(user?.firstName, user?.lastName)}
        </div>
      </div>
    </header>
  );
}
