// src/hooks/useToast.ts
'use client';

import { useState, useCallback } from 'react';
import type { ToastMessage } from '@/types';

let toastId = 0;

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback(
    (type: ToastMessage['type'], message: string, duration = 4000) => {
      const id = `toast-${++toastId}`;
      const toast: ToastMessage = { id, type, message };
      setToasts((prev) => [...prev, toast]);

      if (duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
      }

      return id;
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback(
    (message: string) => addToast('success', message),
    [addToast]
  );

  const error = useCallback(
    (message: string) => addToast('error', message),
    [addToast]
  );

  const info = useCallback(
    (message: string) => addToast('info', message),
    [addToast]
  );

  return { toasts, addToast, removeToast, success, error, info };
}
