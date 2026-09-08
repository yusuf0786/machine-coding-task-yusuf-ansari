// src/components/leads/LeadForm.tsx
'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDown, Search, Check, User as UserIcon, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { leadFormSchema, type LeadFormValues } from '@/lib/validations';
import { LEAD_STATUSES, LEAD_SOURCES } from '@/lib/constants';
import { useUsers } from '@/hooks/useUsers';
import { getInitials } from '@/lib/utils';

interface LeadFormProps {
  defaultValues?: Partial<LeadFormValues>;
  onSubmit: (data: LeadFormValues) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
  loading?: boolean;
}

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

interface AssigneeSelectProps {
  value?: string | null;
  onChange: (value: string | null) => void;
  error?: string;
  disabled?: boolean;
}

function AssigneeSelect({ value, onChange, error, disabled }: AssigneeSelectProps) {
  const { users, isLoading, isError, mutate } = useUsers();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedUser = useMemo(() => {
    if (!value) return null;
    return users.find((u) => u._id === value) || null;
  }, [value, users]);

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;
    const term = search.toLowerCase();
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term)
    );
  }, [users, search]);

  if (isLoading) {
    return (
      <div className="space-y-1.5">
        <label className="block text-[var(--text-sm)] font-medium text-[var(--color-text-primary)]">
          Assign to (optional)
        </label>
        <div className="h-9 w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg-base)] animate-pulse" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-1.5">
        <label className="block text-[var(--text-sm)] font-medium text-[var(--color-text-primary)]">
          Assign to (optional)
        </label>
        <div className="flex items-center gap-2">
          <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value || null)}
            disabled={disabled}
            className="w-full h-9 px-3 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg-base)] text-[var(--text-sm)]"
          >
            <option value="">Unassigned</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name} ({u.email})
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => mutate()}
            className="text-xs text-[var(--color-accent)] hover:underline flex items-center gap-1 shrink-0"
          >
            <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <label className="block text-[var(--text-sm)] font-medium text-[var(--color-text-primary)]">
        Assign to (optional)
      </label>

      {/* Mobile native select */}
      <div className="block sm:hidden">
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value || null)}
          disabled={disabled}
          className="select-themed w-full h-9 px-3 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg-base)] text-[var(--color-text-primary)] text-[var(--text-sm)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
        >
          <option value="">Unassigned</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name} ({u.email})
            </option>
          ))}
        </select>
      </div>

      {/* Desktop custom searchable dropdown */}
      <div className="hidden sm:block relative" ref={dropdownRef}>
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full h-9 px-3 rounded-[var(--radius-sm)] border bg-[var(--color-bg-base)] text-[var(--color-text-primary)] text-[var(--text-sm)] flex items-center justify-between transition-colors ${
            error
              ? 'border-red-500 ring-red-500'
              : 'border-[var(--color-border)] hover:border-[var(--color-border-strong)]'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {selectedUser ? (
            <div className="flex items-center gap-2 truncate">
              <div
                className={`w-5 h-5 rounded-full ${getAvatarColor(
                  selectedUser.name
                )} text-white flex items-center justify-center text-[10px] font-medium shrink-0`}
              >
                {getInitials(selectedUser.name)}
              </div>
              <span className="truncate">{selectedUser.name}</span>
              <span className="text-[var(--text-xs)] text-[var(--color-text-muted)] truncate">
                ({selectedUser.email})
              </span>
            </div>
          ) : (
            <span className="text-[var(--color-text-muted)] flex items-center gap-1.5">
              <UserIcon className="w-4 h-4 text-[var(--color-text-muted)]" />
              Unassigned
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 text-[var(--color-text-muted)] transition-transform duration-150 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute left-0 right-0 top-full mt-1 bg-[var(--color-bg-base)] border border-[var(--color-border)] rounded-lg shadow-xl z-50 overflow-hidden">
            {/* Search Input */}
            <div className="p-2 border-b border-[var(--color-border)] flex items-center gap-2">
              <Search className="w-4 h-4 text-[var(--color-text-muted)] shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search team member..."
                className="w-full bg-transparent text-[var(--text-sm)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none"
                autoFocus
              />
            </div>

            {/* Options List */}
            <div className="max-h-56 overflow-y-auto py-1">
              {/* Unassigned Option */}
              <button
                type="button"
                onClick={() => {
                  onChange(null);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-[var(--text-sm)] flex items-center justify-between hover:bg-[var(--color-bg-muted)] transition-colors ${
                  !value ? 'bg-[var(--color-accent)]/10 font-medium' : ''
                }`}
              >
                <span className="flex items-center gap-2 text-[var(--color-text-muted)]">
                  <UserIcon className="w-4 h-4" />
                  Unassigned
                </span>
                {!value && <Check className="w-4 h-4 text-[var(--color-accent)]" />}
              </button>

              {filteredUsers.length === 0 ? (
                <div className="px-3 py-4 text-center text-[var(--text-xs)] text-[var(--color-text-muted)]">
                  No users found
                </div>
              ) : (
                filteredUsers.map((u) => {
                  const isSelected = value === u._id;
                  return (
                    <button
                      key={u._id}
                      type="button"
                      onClick={() => {
                        onChange(u._id);
                        setIsOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-[var(--text-sm)] flex items-center justify-between hover:bg-[var(--color-bg-muted)] transition-colors ${
                        isSelected ? 'bg-[var(--color-accent)]/10 font-medium' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-6 h-6 rounded-full ${getAvatarColor(
                            u.name
                          )} text-white flex items-center justify-center text-[10px] font-medium shrink-0`}
                        >
                          {getInitials(u.name)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[var(--color-text-primary)] truncate">
                            {u.name}
                          </p>
                          <p className="text-[var(--text-xs)] text-[var(--color-text-muted)] truncate">
                            {u.email}
                          </p>
                        </div>
                      </div>
                      {isSelected && (
                        <Check className="w-4 h-4 text-[var(--color-accent)] shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <p role="alert" className="text-[var(--text-xs)] text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

export function LeadForm({
  defaultValues,
  onSubmit,
  onCancel,
  submitLabel = 'Create Lead',
  loading = false,
}: LeadFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      status: 'New',
      source: 'Website',
      assignedTo: null,
      ...defaultValues,
    },
  });

  const busy = loading || isSubmitting;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
      noValidate
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Name"
          placeholder="Jane Smith"
          error={errors.name?.message}
          required
          {...register('name')}
          disabled={busy}
        />
        <Input
          label="Email"
          type="email"
          placeholder="jane@company.com"
          error={errors.email?.message}
          required
          {...register('email')}
          disabled={busy}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Phone"
          type="tel"
          placeholder="+1-555-123-4567"
          error={errors.phone?.message}
          required
          {...register('phone')}
          disabled={busy}
        />
        <Input
          label="Company"
          placeholder="Acme Inc."
          error={errors.company?.message}
          required
          {...register('company')}
          disabled={busy}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Status"
          error={errors.status?.message}
          required
          {...register('status')}
          disabled={busy}
        >
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>

        <Select
          label="Source"
          error={errors.source?.message}
          {...register('source')}
          disabled={busy}
        >
          {LEAD_SOURCES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </div>

      <Controller
        name="assignedTo"
        control={control}
        render={({ field }) => (
          <AssigneeSelect
            value={field.value}
            onChange={field.onChange}
            error={errors.assignedTo?.message}
            disabled={busy}
          />
        )}
      />

      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={busy}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={busy}
          loadingText="Saving…"
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
