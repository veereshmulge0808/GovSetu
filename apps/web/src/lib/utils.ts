import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a date to a readable local string */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

/** Format a date-time to a readable local string */
export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return '—';
  return new Date(date).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

/** Relative time from now */
export function timeAgo(date: string | Date): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(date);
}

/** Format INR lakhs */
export function formatLakh(value: number | null | undefined): string {
  if (value == null) return '—';
  if (value >= 100) return `₹${(value / 100).toFixed(1)} Cr`;
  return `₹${value} L`;
}

/** Truncate text */
export function truncate(str: string | null | undefined, max = 80): string {
  if (!str) return '';
  return str.length > max ? str.slice(0, max) + '…' : str;
}

/** Get initials from name */
export function getInitials(firstName?: string, lastName?: string): string {
  return `${(firstName?.[0] ?? '').toUpperCase()}${(lastName?.[0] ?? '').toUpperCase()}`;
}

/** Challenge status → badge variant */
export function getChallengeStatusBadge(status: string): string {
  const map: Record<string, string> = {
    DRAFT: 'badge-gray',
    INTERNAL_REVIEW: 'badge-yellow',
    APPROVED: 'badge-blue',
    PUBLISHED: 'badge-green',
    STARTUP_DISCOVERY: 'badge-indigo',
    EVALUATION: 'badge-purple',
    PILOT: 'badge-orange',
    PROCUREMENT: 'badge-blue',
    COMPLETED: 'badge-green',
    CANCELLED: 'badge-red',
  };
  return map[status] ?? 'badge-gray';
}

/** Application status → badge variant */
export function getApplicationStatusBadge(status: string): string {
  const map: Record<string, string> = {
    DRAFT: 'badge-gray',
    SUBMITTED: 'badge-blue',
    UNDER_REVIEW: 'badge-yellow',
    ADDITIONAL_INFO_REQUIRED: 'badge-orange',
    SHORTLISTED: 'badge-indigo',
    REJECTED: 'badge-red',
    SELECTED: 'badge-green',
    PILOT_STAGE: 'badge-purple',
    COMPLETED: 'badge-green',
  };
  return map[status] ?? 'badge-gray';
}

/** User role display labels */
export const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  GOVERNMENT_OFFICER: 'Govt. Officer',
  PILOT_MANAGER: 'Pilot Manager',
  PROCUREMENT_OFFICER: 'Procurement Officer',
  EVALUATOR: 'Evaluator',
  STARTUP_USER: 'Startup',
};

/** Challenge status display labels */
export const CHALLENGE_STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Draft',
  INTERNAL_REVIEW: 'Under Review',
  APPROVED: 'Approved',
  PUBLISHED: 'Published',
  STARTUP_DISCOVERY: 'Discovery Phase',
  EVALUATION: 'Evaluation',
  PILOT: 'Pilot',
  PROCUREMENT: 'Procurement',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};
