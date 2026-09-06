// src/components/leads/LeadTableRow.tsx
'use client';

import Link from 'next/link';
import { Eye, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LeadStatusBadge } from './LeadStatusBadge';
import { ROUTES } from '@/lib/constants';
import { formatDate, getInitials } from '@/lib/utils';
import type { Lead } from '@/types';

interface LeadTableRowProps {
  lead: Lead;
  onDelete: (lead: Lead) => void;
}

export function LeadTableRow({ lead, onDelete }: LeadTableRowProps) {
  return (
    <tr className="border-b border-[var(--color-border)] hover:bg-[var(--color-bg-muted)]/50 transition-colors duration-[var(--duration-fast)]">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] flex items-center justify-center text-[var(--text-xs)] font-semibold shrink-0">
            {getInitials(lead.name)}
          </div>
          <div className="min-w-0">
            <Link
              href={ROUTES.leadDetail(lead.id)}
              className="text-[var(--text-sm)] font-medium text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors truncate block"
            >
              {lead.name}
            </Link>
            <span className="text-[var(--text-xs)] text-[var(--color-text-muted)] truncate block">
              {lead.email}
            </span>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-[var(--text-sm)] text-[var(--color-text-secondary)] hidden md:table-cell">
        {lead.company}
      </td>
      <td className="px-4 py-3 hidden lg:table-cell">
        <LeadStatusBadge status={lead.status} />
      </td>
      <td className="px-4 py-3 text-[var(--text-sm)] text-[var(--color-text-secondary)] hidden xl:table-cell">
        {lead.source}
      </td>
      <td className="px-4 py-3 text-[var(--text-sm)] text-[var(--color-text-muted)] hidden lg:table-cell">
        {formatDate(lead.createdDate)}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1 justify-end">
          <Link href={ROUTES.leadDetail(lead.id)}>
            <Button variant="icon" size="sm" aria-label={`View ${lead.name}`}>
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            variant="icon"
            size="sm"
            onClick={() => onDelete(lead)}
            aria-label={`Delete ${lead.name}`}
          >
            <Trash2 className="h-4 w-4 text-red-500/70 hover:text-red-500" />
          </Button>
        </div>
      </td>
    </tr>
  );
}
