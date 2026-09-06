// src/hooks/useLead.ts
'use client';

import useSWR from 'swr';
import type { Lead } from '@/types';

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error('Lead not found');
    return res.json();
  });

export function useLead(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Lead>(
    id ? `/api/leads/${id}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    lead: data ?? null,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}
