// src/components/dashboard/MetricCard.tsx
'use client';

import { cn } from '@/lib/utils';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  type LucideIcon,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
}

export function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  iconColor = 'text-[var(--color-accent)]',
  iconBg = 'bg-[var(--color-accent)]/10',
}: MetricCardProps) {
  const TrendIcon =
    change === undefined || change === 0
      ? Minus
      : change > 0
        ? TrendingUp
        : TrendingDown;

  const trendColor =
    change === undefined || change === 0
      ? 'text-[var(--color-text-muted)]'
      : change > 0
        ? 'text-emerald-500'
        : 'text-red-500';

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-[var(--text-xs)] font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
            {title}
          </p>
          <p className="text-2xl font-bold text-[var(--color-text-primary)] mt-1">
            {value}
          </p>
          {change !== undefined && (
            <div className={cn('flex items-center gap-1 mt-1', trendColor)}>
              <TrendIcon className="h-3 w-3" aria-hidden="true" />
              <span className="text-[var(--text-xs)] font-medium">
                {change > 0 ? '+' : ''}
                {change}%
              </span>
              <span className="text-[var(--text-xs)] text-[var(--color-text-muted)]">
                vs last month
              </span>
            </div>
          )}
        </div>
        <div
          className={cn(
            'w-10 h-10 rounded-[var(--radius-sm)] flex items-center justify-center shrink-0',
            iconBg
          )}
        >
          <Icon className={cn('h-5 w-5', iconColor)} aria-hidden="true" />
        </div>
      </div>
    </Card>
  );
}
