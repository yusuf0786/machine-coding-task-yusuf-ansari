// src/app/dashboard/analytics/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/Skeleton';
import { LeadsByStatusChart } from '@/components/dashboard/LeadsByStatusChart';
import { LeadsBySourceChart } from '@/components/dashboard/LeadsBySourceChart';
import { ConversionRateCard } from '@/components/dashboard/ConversionRateCard';
import { LeadsOverTimeChart } from '@/components/dashboard/LeadsOverTimeChart';
import type { Lead } from '@/types';

export default function AnalyticsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/leads?pageSize=200')
      .then((r) => r.json())
      .then((d) => {
        setLeads(d.data ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">
          Analytics
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton variant="rect" className="h-80" />
          <Skeleton variant="rect" className="h-80" />
          <Skeleton variant="rect" className="h-80" />
          <Skeleton variant="rect" className="h-80" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Analytics
        </h1>
        <p className="text-[var(--text-sm)] text-[var(--color-text-muted)] mt-1">
          Insights and trends across your lead pipeline
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LeadsOverTimeChart leads={leads} />
        <LeadsByStatusChart leads={leads} />
        <LeadsBySourceChart leads={leads} />
        <ConversionRateCard leads={leads} />
      </div>
    </div>
  );
}
