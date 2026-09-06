// src/components/leads/LeadFilters.tsx
'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { LEAD_STATUSES, LEAD_SOURCES } from '@/lib/constants';
import type { LeadStatus, LeadSource } from '@/types';

interface LeadFiltersProps {
  search: string;
  status: LeadStatus | '';
  source: LeadSource | '';
  onSearchChange: (value: string) => void;
  onStatusChange: (value: LeadStatus | '') => void;
  onSourceChange: (value: LeadSource | '') => void;
  onClear: () => void;
}

export function LeadFilters({
  search,
  status,
  source,
  onSearchChange,
  onStatusChange,
  onSourceChange,
  onClear,
}: LeadFiltersProps) {
  const hasFilters = search || status || source;

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <div className="relative flex-1 min-w-0">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)] pointer-events-none"
          aria-hidden="true"
        />
        <input
          type="text"
          placeholder="Search leads by name, email, or company…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-3 py-2 pl-10 text-[var(--text-sm)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)] transition-colors duration-[var(--duration-base)]"
          aria-label="Search leads"
        />
      </div>

      <div className="flex gap-3 shrink-0">
        <Select
          value={status}
          onChange={(e) => onStatusChange(e.target.value as LeadStatus | '')}
          className="w-36"
          aria-label="Filter by status"
        >
          <option value="">All Statuses</option>
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>

        <Select
          value={source}
          onChange={(e) => onSourceChange(e.target.value as LeadSource | '')}
          className="w-40"
          aria-label="Filter by source"
        >
          <option value="">All Sources</option>
          {LEAD_SOURCES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            aria-label="Clear all filters"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
