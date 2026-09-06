// src/components/ui/Button.tsx
'use client';

import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Spinner } from './Spinner';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-medium transition-all duration-[var(--duration-base)] ease-[var(--ease-default)] rounded-[var(--radius-sm)] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]',
  {
    variants: {
      variant: {
        primary:
          'bg-[var(--color-accent)] text-[var(--color-accent-text)] hover:bg-[var(--color-accent-hover)] shadow-[var(--shadow-sm)]',
        secondary:
          'bg-[var(--color-bg-subtle)] text-[var(--color-text-primary)] border border-[var(--color-border)] hover:bg-[var(--color-bg-muted)]',
        ghost:
          'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-muted)] hover:text-[var(--color-text-primary)]',
        destructive:
          'bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500/20',
        icon: 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-muted)]',
      },
      size: {
        sm: 'h-8 px-3 text-[var(--text-xs)]',
        md: 'h-9 px-4 text-[var(--text-sm)]',
        lg: 'h-11 px-6 text-[var(--text-base)]',
      },
    },
    compoundVariants: [
      {
        variant: 'icon',
        size: 'sm',
        class: 'h-8 w-8 p-0',
      },
      {
        variant: 'icon',
        size: 'md',
        class: 'h-9 w-9 p-0',
      },
      {
        variant: 'icon',
        size: 'lg',
        class: 'h-11 w-11 p-0',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  loadingText?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading = false,
      loadingText = 'Saving…',
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading ? (
          <>
            <Spinner size="sm" />
            <span>{loadingText}</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { buttonVariants };
