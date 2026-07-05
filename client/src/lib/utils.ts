import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...options,
  });
}

export function formatDateTime(date: string | Date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });
}

export function formatCurrency(amount: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    active: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    inactive: 'bg-gray-500/10 text-gray-600 dark:text-gray-400',
    lead: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    churned: 'bg-red-500/10 text-red-600 dark:text-red-400',
    new: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    contacted: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
    qualified: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    proposal: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
    negotiation: 'bg-pink-500/10 text-pink-600 dark:text-pink-400',
    won: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    lost: 'bg-red-500/10 text-red-600 dark:text-red-400',
    todo: 'bg-gray-500/10 text-gray-600 dark:text-gray-400',
    in_progress: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    review: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
    done: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    draft: 'bg-gray-500/10 text-gray-600 dark:text-gray-400',
    sent: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    paid: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    overdue: 'bg-red-500/10 text-red-600 dark:text-red-400',
    cancelled: 'bg-gray-500/10 text-gray-600 dark:text-gray-400',
    scheduled: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    completed: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    low: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    medium: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
    high: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
    urgent: 'bg-red-500/10 text-red-600 dark:text-red-400',
  };
  return colors[status] || 'bg-gray-500/10 text-gray-600 dark:text-gray-400';
}

export function getStatusLabel(status: string) {
  return status
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
}

export function truncate(str: string, length = 50) {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}
