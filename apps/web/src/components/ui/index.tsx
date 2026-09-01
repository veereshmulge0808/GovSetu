'use client';

import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const variantClass = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    danger: 'btn-danger',
  }[variant];

  const sizeClass = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg',
    icon: 'btn-icon',
  }[size];

  return (
    <button
      className={cn(variantClass, sizeClass, className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}

interface BadgeProps {
  variant?: 'indigo' | 'green' | 'yellow' | 'red' | 'gray' | 'blue' | 'orange' | 'purple';
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = 'gray', children, className }: BadgeProps) {
  return (
    <span className={cn(`badge-${variant}`, className)}>
      {children}
    </span>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton', className)} />;
}

export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' }[size];
  return <Loader2 className={cn(sizeClass, 'animate-spin text-indigo-600')} />;
}

interface AlertProps {
  variant: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Alert({ variant, title, children, className }: AlertProps) {
  return (
    <div className={cn(`alert-${variant}`, className)}>
      <div>
        {title && <p className="font-semibold mb-0.5">{title}</p>}
        <div className="text-sm">{children}</div>
      </div>
    </div>
  );
}

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      {icon && <div className="empty-state-icon">{icon}</div>}
      <p className="empty-state-title">{title}</p>
      {description && <p className="empty-state-description mt-1">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

interface CardProps {
  className?: string;
  children: React.ReactNode;
}
export function Card({ className, children }: CardProps) {
  return <div className={cn('card', className)}>{children}</div>;
}
export function CardHeader({ className, children }: CardProps) {
  return <div className={cn('card-header', className)}>{children}</div>;
}
export function CardBody({ className, children }: CardProps) {
  return <div className={cn('card-body', className)}>{children}</div>;
}
export function CardFooter({ className, children }: CardProps) {
  return <div className={cn('card-footer', className)}>{children}</div>;
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: { value: number; label: string };
  className?: string;
}
export function StatCard({ label, value, icon, trend, className }: StatCardProps) {
  return (
    <div className={cn('stat-card', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="stat-label">{label}</p>
          <p className="stat-value mt-1">{value}</p>
        </div>
        {icon && (
          <div className="p-2.5 bg-indigo-50 rounded-lg text-indigo-600">
            {icon}
          </div>
        )}
      </div>
      {trend && (
        <p className={trend.value >= 0 ? 'stat-change-up' : 'stat-change-down'}>
          {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}% {trend.label}
        </p>
      )}
    </div>
  );
}
