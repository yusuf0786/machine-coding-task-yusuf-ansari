// src/components/leads/LeadTableRow.tsx
'use client';

import Link from 'next/link';
import { Eye, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LeadStatusBadge } from './LeadStatusBadge';
import { ROUTES } from '@/lib/constants';
import { formatDate, getInitials } from '@/lib/utils';
import type { Lead } from '@/types';

// 8 predefined accent colors for deterministic avatar coloring
const AVATAR_COLORS = [
  'bg-blue-600',
  'bg-emerald-600',
  'bg-violet-600',
  'bg-amber-600',
  'bg-rose-600',
  'bg-cyan-600',
  'bg-indigo-600',
  'bg-fuchsia-600',
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

interface LeadTableRowProps {
  lead: Lead;
  onDelete: (lead: Lead) => void;
}

export function LeadTableRow({ lead, onDelete }: LeadTableRowProps) {
  const leadId = lead.id || '';

  return (
    <tr className="border-b border-[var(--color-border)] hover:bg-[var(--color-bg-muted)]/50 transition-colors duration-[var(--duration-fast)]">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] flex items-center justify-center text-[var(--text-xs)] font-semibold shrink-0">
            {getInitials(lead.name)}
          </div>
          <div className="min-w-0">
            <Link
              href={ROUTES.leadDetail(leadId)}
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
      <td className="px-4 py-3 text-[var(--text-sm)] text-[var(--color-text-secondary)] hidden lg:table-cell">
        {lead.assignedToUser ? (
          <div className="flex items-center gap-2">
            <div
              className={`w-5 h-5 rounded-full ${getAvatarColor(
                lead.assignedToUser.name
              )} text-white flex items-center justify-center text-[10px] font-medium shrink-0`}
            >
              {getInitials(lead.assignedToUser.name)}
            </div>
            <span className="truncate max-w-[120px]">{lead.assignedToUser.name}</span>
          </div>
        ) : (
          <span className="text-[var(--color-text-muted)]">—</span>
        )}
      </td>
      <td className="px-4 py-3 text-[var(--text-sm)] text-[var(--color-text-secondary)] hidden xl:table-cell">
        {lead.source}
      </td>
      <td className="px-4 py-3 text-[var(--text-sm)] text-[var(--color-text-muted)] hidden lg:table-cell">
        {formatDate(lead.createdAt)}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1 justify-end">
          <Link href={ROUTES.leadDetail(leadId)}>
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
