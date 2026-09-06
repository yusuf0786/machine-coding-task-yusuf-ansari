// src/components/dashboard/LeadsOverTimeChart.tsx
'use client';

import dynamic from 'next/dynamic';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { formatShortDate } from '@/lib/utils';
import type { Lead } from '@/types';

const AreaChart = dynamic(
  () => import('recharts').then((m) => m.AreaChart),
  { ssr: false }
);
const Area = dynamic(
  () => import('recharts').then((m) => m.Area),
  { ssr: false }
);
const XAxis = dynamic(
  () => import('recharts').then((m) => m.XAxis),
  { ssr: false }
);
const YAxis = dynamic(
  () => import('recharts').then((m) => m.YAxis),
  { ssr: false }
);
const CartesianGrid = dynamic(
  () => import('recharts').then((m) => m.CartesianGrid),
  { ssr: false }
);
const Tooltip = dynamic(
  () => import('recharts').then((m) => m.Tooltip),
  { ssr: false }
);
const ResponsiveContainer = dynamic(
  () => import('recharts').then((m) => m.ResponsiveContainer),
  { ssr: false }
);

interface LeadsOverTimeChartProps {
  leads: Lead[];
}

export function LeadsOverTimeChart({ leads }: LeadsOverTimeChartProps) {
  // Group leads by day and show cumulative count
  const sorted = [...leads].sort(
    (a, b) =>
      new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime()
  );

  const dailyMap = new Map<string, number>();
  for (const lead of sorted) {
    const day = lead.createdDate.slice(0, 10); // YYYY-MM-DD
    dailyMap.set(day, (dailyMap.get(day) ?? 0) + 1);
  }

  let cumulative = 0;
  const data = Array.from(dailyMap.entries()).map(([date, count]) => {
    cumulative += count;
    return {
      date: formatShortDate(date),
      rawDate: date,
      newLeads: count,
      total: cumulative,
    };
  });

  return (
    <Card>
      <CardHeader>
        <h3 className="text-[var(--text-base)] font-semibold text-[var(--color-text-primary)]">
          Leads Over Time
        </h3>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-border)"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-bg-subtle)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--text-sm)',
              }}
            />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#0ea5e9"
              strokeWidth={2}
              fill="url(#colorLeads)"
              name="Total Leads"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
