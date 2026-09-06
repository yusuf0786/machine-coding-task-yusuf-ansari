// src/hooks/useLeads.ts
'use client';

import useSWR from 'swr';
import type { Lead, PaginatedResponse, LeadFilters } from '@/types';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useLeads(filters: LeadFilters = {}) {
  const params = new URLSearchParams();

  if (filters.search) params.set('search', filters.search);
  if (filters.status) params.set('status', filters.status);
  if (filters.source) params.set('source', filters.source);
  if (filters.sortDir) params.set('sortDir', filters.sortDir);
  if (filters.page) params.set('page', String(filters.page));
  if (filters.pageSize) params.set('pageSize', String(filters.pageSize));

  const queryString = params.toString();
  const url = `/api/leads${queryString ? `?${queryString}` : ''}`;

  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<Lead>>(
    url,
    fetcher,
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
    }
  );

  return {
    leads: data?.data ?? [],
    total: data?.total ?? 0,
    page: data?.page ?? 1,
    pageSize: data?.pageSize ?? 8,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}
