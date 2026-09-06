// src/components/shared/EmptyState.tsx
import { InboxIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface EmptyStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryLabel?: string;
  onSecondaryAction?: () => void;
}

export function EmptyState({
  title = 'No leads found',
  message = 'Get started by adding your first lead.',
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondaryAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-12 h-12 rounded-full bg-[var(--color-bg-muted)] flex items-center justify-center mb-4">
        <InboxIcon
          className="h-6 w-6 text-[var(--color-text-muted)]"
          aria-hidden="true"
        />
      </div>
      <h3 className="text-[var(--text-base)] font-semibold text-[var(--color-text-primary)] mb-1">
        {title}
      </h3>
      <p className="text-[var(--text-sm)] text-[var(--color-text-muted)] max-w-sm mb-6">
        {message}
      </p>
      <div className="flex gap-3">
        {actionLabel && onAction && (
          <Button variant="primary" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
        {secondaryLabel && onSecondaryAction && (
          <Button variant="secondary" onClick={onSecondaryAction}>
            {secondaryLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
