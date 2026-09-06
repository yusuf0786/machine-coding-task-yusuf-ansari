// src/components/ui/Spinner.tsx
import { cn } from '@/lib/utils';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4 border-[2px]',
  md: 'h-5 w-5 border-[2px]',
  lg: 'h-8 w-8 border-[3px]',
};

export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        'animate-spin rounded-full border-current border-t-transparent opacity-70',
        sizeClasses[size],
        className
      )}
    >
      <span className="sr-only">Loading…</span>
    </div>
  );
}
