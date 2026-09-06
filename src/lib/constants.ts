// src/lib/constants.ts
import type { LeadStatus, LeadSource } from '@/types';

export const LEAD_STATUSES: LeadStatus[] = [
  'New',
  'Contacted',
  'Qualified',
  'Converted',
  'Lost',
];

export const LEAD_SOURCES: LeadSource[] = [
  'Website',
  'Referral',
  'LinkedIn',
  'Cold Call',
  'Email Campaign',
  'Trade Show',
  'Other',
];

export const STATUS_CONFIG: Record<
  LeadStatus,
  { color: string; bg: string; border: string; dot: string; icon: string }
> = {
  New: {
    color: 'text-sky-500',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/30',
    dot: 'bg-sky-500',
    icon: 'Sparkles',
  },
  Contacted: {
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    dot: 'bg-amber-500',
    icon: 'Phone',
  },
  Qualified: {
    color: 'text-violet-500',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/30',
    dot: 'bg-violet-500',
    icon: 'CheckCircle',
  },
  Converted: {
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    dot: 'bg-emerald-500',
    icon: 'Trophy',
  },
  Lost: {
    color: 'text-red-500',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    dot: 'bg-red-500',
    icon: 'XCircle',
  },
};

export const ROUTES = {
  home: '/',
  dashboard: '/dashboard',
  leads: '/dashboard/leads',
  leadDetail: (id: string) => `/dashboard/leads/${id}`,
  newLead: '/dashboard/leads/new',
  analytics: '/dashboard/analytics',
} as const;

export const NAV_LINKS = [
  { href: ROUTES.dashboard, label: 'Dashboard', icon: 'LayoutDashboard' },
  { href: ROUTES.leads, label: 'Leads', icon: 'Users' },
  { href: ROUTES.analytics, label: 'Analytics', icon: 'BarChart3' },
] as const;

export const PAGE_SIZE = 8;
export const DEBOUNCE_MS = 350;
