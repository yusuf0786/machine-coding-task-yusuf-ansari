// src/components/leads/LeadTable.tsx
'use client';

import { useState } from 'react';
import { ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SkeletonRow } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { LeadTableRow } from './LeadTableRow';
import type { Lead, PaginatedResponse } from '@/types';

interface LeadTableProps {
  data: PaginatedResponse<Lead> | undefined;
  isLoading: boolean;
  error: Error | undefined;
  sortDir: 'asc' | 'desc';
  onSortToggle: () => void;
  onPageChange: (page: number) => void;
  onRetry: () => void;
  onAddNew: () => void;
}

export function LeadTable({
  data,
  isLoading,
  error,
  sortDir,
  onSortToggle,
  onPageChange,
  onRetry,
  onAddNew,
}: LeadTableProps) {
  const [deleteTarget, setDeleteTarget] = useState<Lead | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const leadId = deleteTarget.id;
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete');
      setDeleteTarget(null);
      onRetry(); // refresh
    } catch {
      // keep dialog open so user can retry
    } finally {
      setDeleting(false);
    }
  };

  if (error) {
    return (
      <Card>
        <ErrorState onRetry={onRetry} />
      </Card>
    );
  }

  const totalPages = data ? Math.ceil(data.total / data.pageSize) : 0;

  return (
    <>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left" role="table">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-muted)]/50">
                <th className="px-4 py-3 text-[var(--text-xs)] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-[var(--text-xs)] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider hidden md:table-cell">
                  Company
                </th>
                <th className="px-4 py-3 text-[var(--text-xs)] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider hidden lg:table-cell">
                  Status
                </th>
                <th className="px-4 py-3 text-[var(--text-xs)] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider hidden lg:table-cell">
                  Assigned To
                </th>
                <th className="px-4 py-3 text-[var(--text-xs)] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider hidden xl:table-cell">
                  Source
                </th>
                <th className="px-4 py-3 text-[var(--text-xs)] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider hidden lg:table-cell">
                  <button
                    onClick={onSortToggle}
                    className="flex items-center gap-1 hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
                    aria-label={`Sort by date ${sortDir === 'asc' ? 'descending' : 'ascending'}`}
                  >
                    Date
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-4 py-3 text-[var(--text-xs)] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading && !data ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-[var(--color-border)]">
                    <td colSpan={7} className="px-4 py-3">
                      <SkeletonRow />
                    </td>
                  </tr>
                ))
              ) : data && data.data.length > 0 ? (
                data.data.map((lead) => (
                  <LeadTableRow
                    key={lead.id}
                    lead={lead}
                    onDelete={setDeleteTarget}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={7}>
                    <EmptyState
                      title="No leads found"
                      message="Try adjusting your filters or add a new lead to get started."
                      actionLabel="Add Lead"
                      onAction={onAddNew}
                      secondaryLabel="Clear Filters"
                      onSecondaryAction={onRetry}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && data.total > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--color-border)]">
            <p className="text-[var(--text-sm)] text-[var(--color-text-muted)]">
              Showing{' '}
              <span className="font-medium text-[var(--color-text-primary)]">
                {(data.page - 1) * data.pageSize + 1}
              </span>{' '}
              to{' '}
              <span className="font-medium text-[var(--color-text-primary)]">
                {Math.min(data.page * data.pageSize, data.total)}
              </span>{' '}
              of{' '}
              <span className="font-medium text-[var(--color-text-primary)]">
                {data.total}
              </span>{' '}
              leads
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onPageChange(data.page - 1)}
                disabled={data.page <= 1}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-[var(--text-sm)] text-[var(--color-text-secondary)] min-w-[80px] text-center">
                Page {data.page} of {totalPages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onPageChange(data.page + 1)}
                disabled={data.page >= totalPages}
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Lead"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
