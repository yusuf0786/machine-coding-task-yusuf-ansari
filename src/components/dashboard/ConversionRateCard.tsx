// src/components/dashboard/ConversionRateCard.tsx
'use client';

import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import type { Lead } from '@/types';

interface ConversionRateCardProps {
  leads: Lead[];
}

export function ConversionRateCard({ leads }: ConversionRateCardProps) {
  const total = leads.length;
  const converted = leads.filter((l) => l.status === 'Converted').length;
  const qualified = leads.filter((l) => l.status === 'Qualified').length;
  const contacted = leads.filter((l) => l.status === 'Contacted').length;
  const newCount = leads.filter((l) => l.status === 'New').length;
  const lost = leads.filter((l) => l.status === 'Lost').length;

  const rate = total > 0 ? Math.round((converted / total) * 100) : 0;

  const stages = [
    { label: 'New', count: newCount, color: 'bg-sky-500' },
    { label: 'Contacted', count: contacted, color: 'bg-amber-500' },
    { label: 'Qualified', count: qualified, color: 'bg-violet-500' },
    { label: 'Converted', count: converted, color: 'bg-emerald-500' },
    { label: 'Lost', count: lost, color: 'bg-red-500' },
  ];

  return (
    <Card>
      <CardHeader>
        <h3 className="text-[var(--text-base)] font-semibold text-[var(--color-text-primary)]">
          Conversion Funnel
        </h3>
      </CardHeader>
      <CardContent>
        {/* Rate display */}
        <div className="text-center mb-6">
          <p className="text-4xl font-bold text-[var(--color-text-primary)]">
            {rate}%
          </p>
          <p className="text-[var(--text-sm)] text-[var(--color-text-muted)] mt-1">
            Overall Conversion Rate
          </p>
        </div>

        {/* Funnel bars */}
        <div className="space-y-3">
          {stages.map((stage) => {
            const pct = total > 0 ? Math.round((stage.count / total) * 100) : 0;
            return (
              <div key={stage.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[var(--text-xs)] font-medium text-[var(--color-text-secondary)]">
                    {stage.label}
                  </span>
                  <span className="text-[var(--text-xs)] text-[var(--color-text-muted)]">
                    {stage.count} ({pct}%)
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[var(--color-bg-muted)] overflow-hidden">
                  <div
                    className={`h-full rounded-full ${stage.color} transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
