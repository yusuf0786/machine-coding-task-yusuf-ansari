// src/components/shared/ErrorState.tsx
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'An error occurred while loading data. Please try again.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
        <AlertTriangle
          className="h-6 w-6 text-red-500"
          aria-hidden="true"
        />
      </div>
      <h3 className="text-[var(--text-base)] font-semibold text-[var(--color-text-primary)] mb-1">
        {title}
      </h3>
      <p className="text-[var(--text-sm)] text-[var(--color-text-muted)] max-w-sm mb-6">
        {message}
      </p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
