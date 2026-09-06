// src/components/dashboard/MetricsGrid.tsx
'use client';

import {
  Users,
  UserCheck,
  UserPlus,
  Trophy,
  PhoneCall,
  Target,
  TrendingUp,
} from 'lucide-react';
import { MetricCard } from './MetricCard';
import type { Lead } from '@/types';

interface MetricsGridProps {
  leads: Lead[];
}

export function MetricsGrid({ leads }: MetricsGridProps) {
  const total = leads.length;
  const newCount = leads.filter((l) => l.status === 'New').length;
  const contactedCount = leads.filter((l) => l.status === 'Contacted').length;
  const qualifiedCount = leads.filter((l) => l.status === 'Qualified').length;
  const convertedCount = leads.filter((l) => l.status === 'Converted').length;
  const lostCount = leads.filter((l) => l.status === 'Lost').length;

  const conversionRate =
    total > 0 ? Math.round((convertedCount / total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
      <MetricCard
        title="Total Leads"
        value={total}
        change={12}
        icon={Users}
        iconColor="text-[var(--color-accent)]"
        iconBg="bg-[var(--color-accent)]/10"
      />
      <MetricCard
        title="New"
        value={newCount}
        change={8}
        icon={UserPlus}
        iconColor="text-sky-500"
        iconBg="bg-sky-500/10"
      />
      <MetricCard
        title="Contacted"
        value={contactedCount}
        change={-3}
        icon={PhoneCall}
        iconColor="text-amber-500"
        iconBg="bg-amber-500/10"
      />
      <MetricCard
        title="Qualified"
        value={qualifiedCount}
        change={15}
        icon={Target}
        iconColor="text-violet-500"
        iconBg="bg-violet-500/10"
      />
      <MetricCard
        title="Converted"
        value={convertedCount}
        change={22}
        icon={Trophy}
        iconColor="text-emerald-500"
        iconBg="bg-emerald-500/10"
      />
      <MetricCard
        title="Lost"
        value={lostCount}
        change={-5}
        icon={UserCheck}
        iconColor="text-red-500"
        iconBg="bg-red-500/10"
      />
      <MetricCard
        title="Conversion Rate"
        value={`${conversionRate}%`}
        change={4}
        icon={TrendingUp}
        iconColor="text-emerald-500"
        iconBg="bg-emerald-500/10"
      />
    </div>
  );
}
