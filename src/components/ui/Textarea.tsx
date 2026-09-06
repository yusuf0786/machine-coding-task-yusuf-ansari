// src/components/ui/Textarea.tsx
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const textareaId = id || props.name;
    const errorId = error ? `${textareaId}-error` : undefined;

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-[var(--text-sm)] font-medium text-[var(--color-text-primary)]"
          >
            {label}
            {props.required && (
              <span className="text-red-500 ml-0.5" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'w-full px-3 py-2 rounded-[var(--radius-sm)] border bg-[var(--color-bg-base)] text-[var(--color-text-primary)] text-[var(--text-sm)] placeholder:text-[var(--color-text-muted)] transition-colors duration-[var(--duration-fast)] resize-y min-h-[80px]',
            'focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent',
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-[var(--color-border)] hover:border-[var(--color-border-strong)]',
            className
          )}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={errorId}
          aria-required={props.required}
          {...props}
        />
        {error && (
          <p id={errorId} role="alert" className="text-[var(--text-xs)] text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
