// src/components/ui/Toast.tsx
'use client';

import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ToastMessage } from '@/types';

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const styleMap = {
  success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500',
  error: 'border-red-500/30 bg-red-500/10 text-red-500',
  info: 'border-sky-500/30 bg-sky-500/10 text-sky-500',
};

interface ToastProps {
  toast: ToastMessage;
  onRemove: (id: string) => void;
}

function Toast({ toast, onRemove }: ToastProps) {
  const Icon = iconMap[toast.type];

  return (
    <div
      role="status"
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] border shadow-[var(--shadow-lg)] bg-[var(--color-bg-subtle)] min-w-[300px] max-w-[420px]',
        'animate-in slide-in-from-right duration-300',
        styleMap[toast.type]
      )}
    >
      <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
      <p className="flex-1 text-[var(--text-sm)] text-[var(--color-text-primary)]">
        {toast.message}
      </p>
      <button
        onClick={() => onRemove(toast.id)}
        className="shrink-0 rounded-full p-1 hover:bg-[var(--color-bg-muted)] transition-colors cursor-pointer"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4 text-[var(--color-text-muted)]" />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-label="Notifications"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}
