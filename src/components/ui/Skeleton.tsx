// src/components/ui/Skeleton.tsx
import { cn } from '@/lib/utils';

interface SkeletonProps {
  variant?: 'text' | 'rect' | 'circle';
  width?: string | number;
  height?: string | number;
  className?: string;
}

export function Skeleton({
  variant = 'text',
  width,
  height,
  className,
}: SkeletonProps) {
  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div
      aria-hidden="true"
      className={cn(
        'skeleton-shimmer',
        variant === 'text' && 'h-4 rounded',
        variant === 'rect' && 'rounded-[var(--radius-sm)]',
        variant === 'circle' && 'rounded-full',
        className
      )}
      style={style}
    />
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-5 py-3.5 border-b border-[var(--color-border)]">
      <Skeleton variant="circle" width={32} height={32} />
      <div className="flex-1 space-y-2">
        <Skeleton width="40%" height={14} />
        <Skeleton width="25%" height={12} />
      </div>
      <Skeleton width={120} height={14} className="hidden sm:block" />
      <Skeleton width={120} height={14} className="hidden md:block" />
      <Skeleton width={80} height={14} className="hidden lg:block" />
      <Skeleton variant="rect" width={72} height={24} />
      <Skeleton width={80} height={14} className="hidden lg:block" />
      <Skeleton width={60} height={28} />
    </div>
  );
}
