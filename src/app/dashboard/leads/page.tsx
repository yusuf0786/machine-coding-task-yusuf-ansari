// src/app/dashboard/leads/page.tsx
'use client';

import { useState } from 'react';
import { LeadTable } from '@/components/leads/LeadTable';
import { LeadFilters } from '@/components/leads/LeadFilters';
import { LeadModal } from '@/components/leads/LeadModal';
import { LeadForm } from '@/components/leads/LeadForm';
import { Button } from '@/components/ui/Button';
import { useLeads } from '@/hooks/useLeads';
import { useDebounce } from '@/hooks/useDebounce';
import { PAGE_SIZE, DEBOUNCE_MS } from '@/lib/constants';
import { Plus } from 'lucide-react';
import type { LeadStatus, LeadSource } from '@/types';
import type { LeadFormValues } from '@/lib/validations';

export default function LeadsPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<LeadStatus | ''>('');
  const [source, setSource] = useState<LeadSource | ''>('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);

  const debouncedSearch = useDebounce(search, DEBOUNCE_MS);

  const { leads: tableLeads, total, page: currentPage, pageSize, isLoading, error, mutate } = useLeads({
    search: debouncedSearch,
    status,
    source,
    sortDir,
    page,
    pageSize: PAGE_SIZE,
  });

  // Reconstruct PaginatedResponse for LeadTable
  const tableData = tableLeads.length > 0 || !isLoading
    ? { data: tableLeads, total, page: currentPage, pageSize }
    : undefined;

  const handleClearFilters = () => {
    setSearch('');
    setStatus('');
    setSource('');
    setPage(1);
  };

  const handleCreateLead = async (formData: LeadFormValues) => {
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (!res.ok) throw new Error('Failed to create lead');
    setModalOpen(false);
    mutate();
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between mb-6">
        <div className="flex items-center gap-4 mb-3 sm:mb-0">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
              Leads
            </h1>
            <p className="text-[var(--text-sm)] text-[var(--color-text-muted)] mt-1">
              Manage your lead pipeline
            </p>
          </div>
        </div>
        <Button className='w-full sm:w-auto' variant="primary" onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Lead
        </Button>
      </div>

      {/* Filters */}
      <LeadFilters
        search={search}
        status={status}
        source={source}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        onStatusChange={(v) => {
          setStatus(v);
          setPage(1);
        }}
        onSourceChange={(v) => {
          setSource(v);
          setPage(1);
        }}
        onClear={handleClearFilters}
      />

      {/* Lead table */}
      <LeadTable
        data={tableData}
        isLoading={isLoading}
        error={error}
        sortDir={sortDir}
        onSortToggle={() =>
          setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
        }
        onPageChange={setPage}
        onRetry={() => mutate()}
        onAddNew={() => setModalOpen(true)}
      />

      {/* Create modal */}
      <LeadModal
        open={modalOpen}
        title="Create New Lead"
        onClose={() => setModalOpen(false)}
      >
        <LeadForm
          onSubmit={handleCreateLead}
          onCancel={() => setModalOpen(false)}
        />
      </LeadModal>
    </div>
  );
}