// src/components/leads/ActivityTimeline.tsx
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { formatDate } from '@/lib/utils';
import type { TimelineEvent } from '@/types';

interface ActivityTimelineProps {
  events: TimelineEvent[];
}

export function ActivityTimeline({ events }: ActivityTimelineProps) {
  const sorted = [...events].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Card>
      <CardHeader>
        <h3 className="text-[var(--text-base)] font-semibold text-[var(--color-text-primary)]">
          Activity Timeline
        </h3>
      </CardHeader>
      <CardContent>
        {sorted.length === 0 ? (
          <p className="text-[var(--text-sm)] text-[var(--color-text-muted)] py-4 text-center">
            No activity yet.
          </p>
        ) : (
          <ol className="relative border-l-2 border-[var(--color-border)] ml-3 space-y-6">
            {sorted.map((event, i) => (
              <li key={`${event.date}-${i}`} className="relative pl-6">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
                  <div className="w-2 h-2 rounded-full bg-[var(--color-accent)] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <time className="text-[var(--text-xs)] text-[var(--color-text-muted)] block mb-0.5">
                  {formatDate(event.date)}
                </time>
                <p className="text-[var(--text-sm)] text-[var(--color-text-primary)]">
                  {event.label}
                </p>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}
