// src/components/dashboard/LeadsByStatusChart.tsx
'use client';

import dynamic from 'next/dynamic';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { STATUS_CONFIG } from '@/lib/constants';
import type { Lead, LeadStatus } from '@/types';

const PieChart = dynamic(
  () => import('recharts').then((m) => m.PieChart),
  { ssr: false }
);
const Pie = dynamic(
  () => import('recharts').then((m) => m.Pie),
  { ssr: false }
);
const Cell = dynamic(
  () => import('recharts').then((m) => m.Cell),
  { ssr: false }
);
const Tooltip = dynamic(
  () => import('recharts').then((m) => m.Tooltip),
  { ssr: false }
);
const Legend = dynamic(
  () => import('recharts').then((m) => m.Legend),
  { ssr: false }
);
const ResponsiveContainer = dynamic(
  () => import('recharts').then((m) => m.ResponsiveContainer),
  { ssr: false }
);

const COLOR_MAP: Record<LeadStatus, string> = {
  New: '#0ea5e9',
  Contacted: '#f59e0b',
  Qualified: '#8b5cf6',
  Converted: '#10b981',
  Lost: '#ef4444',
};

interface LeadsByStatusChartProps {
  leads: Lead[];
}

export function LeadsByStatusChart({ leads }: LeadsByStatusChartProps) {
  const data = Object.entries(
    leads.reduce<Record<string, number>>((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-[var(--text-base)] font-semibold text-[var(--color-text-primary)]">
            Leads by Status
          </h3>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <p className="text-[var(--text-sm)] text-[var(--color-text-muted)]">
            No data available
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h3 className="text-[var(--text-base)] font-semibold text-[var(--color-text-primary)]">
          Leads by Status
        </h3>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
              nameKey="name"
            >
              {data.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={COLOR_MAP[entry.name as LeadStatus] ?? '#6b7280'}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-bg-subtle)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--text-sm)',
              }}
            />
            <Legend
              formatter={(value: string) => (
                <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-xs)' }}>
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
