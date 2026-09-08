// src/components/leads/LeadDetailCard.tsx
'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Mail,
  Phone,
  Building2,
  Globe,
  Calendar,
  Hash,
  User,
  ChevronDown,
  Search,
  Check,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { LeadStatusBadge } from './LeadStatusBadge';
import { formatDate, formatPhone, getInitials } from '@/lib/utils';
import { useUsers } from '@/hooks/useUsers';
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

interface LeadDetailCardProps {
  lead: Lead;
}

function InfoRow({
  icon: Icon,
  label,
  value,
  children
}: {
  icon: React.ElementType;
  label: string;
  value?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 py-2">
      <Icon
        className="h-4 w-4 text-[var(--color-text-muted)] mt-0.5 shrink-0"
        aria-hidden="true"
      />
      <div className="min-w-0 flex-1">
        <dt className="text-[var(--text-xs)] text-[var(--color-text-muted)] uppercase tracking-wider">
          {label}
        </dt>
        <dd className="text-[var(--text-sm)] text-[var(--color-text-primary)] mt-0.5 break-all">
          {children ?? value}
        </dd>
      </div>
    </div>
  );
}

function InlineAssigneeEdit({ lead, leadId }: { lead: Lead; leadId: string }) {
  const router = useRouter();
  const { users, isLoading, isError } = useUsers();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
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

  const currentValue = lead.assignedTo || null;
  const currentUserObj = lead.assignedToUser || null;

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;
    const term = search.toLowerCase();
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term)
    );
  }, [users, search]);

  const handleUpdate = async (userId: string | null) => {
    if (userId === currentValue) {
      setIsOpen(false);
      return;
    }

    setIsUpdating(true);
    setErrorMsg('');

    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignedTo: userId }),
      });

      if (!res.ok) {
        throw new Error('Failed to reassign lead');
      }

      setIsOpen(false);
      router.refresh();
    } catch (error) {
      setErrorMsg('Update failed. Try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isUpdating}
        className="group flex items-center gap-2 py-1 px-1.5 -ml-1.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {isUpdating ? (
          <Loader2 className="w-4 h-4 animate-spin text-zinc-500" />
        ) : currentUserObj ? (
          <div className="flex items-center gap-2">
            <div
              className={`w-5 h-5 rounded-full ${getAvatarColor(
                currentUserObj.name
              )} text-white flex items-center justify-center text-[10px] font-medium shrink-0`}
            >
              {getInitials(currentUserObj.name)}
            </div>
            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {currentUserObj.name}
            </span>
          </div>
        ) : (
          <span className="text-sm text-zinc-500 italic">Unassigned</span>
        )}
        <ChevronDown className="w-3.5 h-3.5 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>

      {errorMsg && <p className="text-xs text-red-500 mt-1">{errorMsg}</p>}

      {isOpen && (
        <div className="absolute left-0 top-full mt-1 w-64 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-xl z-50 overflow-hidden">
          {isLoading ? (
            <div className="p-4 text-sm text-zinc-500 text-center flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading team...
            </div>
          ) : isError ? (
            <div className="p-4 text-sm text-red-500 text-center flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4" /> Failed to load users
            </div>
          ) : (
            <>
              {/* Search Input */}
              <div className="p-2 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-2 bg-zinc-50/50 dark:bg-zinc-900/50">
                <Search className="w-4 h-4 text-zinc-400 shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search team..."
                  className="w-full bg-transparent text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none"
                  autoFocus
                />
              </div>

              {/* Options List */}
              <div className="max-h-56 overflow-y-auto py-1">
                {/* Unassigned Option */}
                <button
                  type="button"
                  onClick={() => handleUpdate(null)}
                  className={`w-full px-3 py-2 text-left text-sm flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors ${
                    !currentValue ? 'bg-indigo-50 dark:bg-indigo-900/20 font-medium' : ''
                  }`}
                >
                  <span className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                    <User className="w-4 h-4" />
                    Unassigned
                  </span>
                  {!currentValue && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                </button>

                {filteredUsers.length === 0 ? (
                  <div className="px-3 py-4 text-center text-xs text-zinc-500">
                    No users found
                  </div>
                ) : (
                  filteredUsers.map((u) => {
                    const isSelected = currentValue === u._id;
                    return (
                      <button
                        key={u._id}
                        type="button"
                        onClick={() => handleUpdate(u._id)}
                        className={`w-full px-3 py-2 text-left text-sm flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors ${
                          isSelected ? 'bg-indigo-50 dark:bg-indigo-900/20 font-medium' : ''
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
                            <p className="text-zinc-900 dark:text-zinc-100 truncate">
                              {u.name}
                            </p>
                            <p className="text-xs text-zinc-500 truncate">
                              {u.email}
                            </p>
                          </div>
                        </div>
                        {isSelected && (
                          <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export function LeadDetailCard({ lead }: LeadDetailCardProps) {
  const leadId = lead._id || lead.id || '';

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] flex items-center justify-center text-[var(--text-lg)] font-bold shrink-0">
          {getInitials(lead.name)}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-[var(--text-xl)] font-bold text-[var(--color-text-primary)] truncate">
            {lead.name}
          </h2>
          <p className="text-[var(--text-sm)] text-[var(--color-text-muted)]">
            {lead.company}
          </p>
        </div>
        <LeadStatusBadge status={lead.status} size="md" />
      </CardHeader>

      <CardContent>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 divide-y divide-[var(--color-border)] sm:divide-y-0">
          <InfoRow icon={Mail} label="Email" value={lead.email} />
          <InfoRow icon={Phone} label="Phone" value={formatPhone(lead.phone)} />
          <InfoRow icon={Building2} label="Company" value={lead.company} />
          <InfoRow icon={Globe} label="Source" value={lead.source} />
          <InfoRow icon={Calendar} label="Created" value={formatDate(lead.createdAt)} />
          <InfoRow icon={User} label="Assigned to">
            <InlineAssigneeEdit lead={lead} leadId={leadId as string} />
          </InfoRow>
          <InfoRow icon={Hash} label="ID" value={leadId as string} />
        </dl>
      </CardContent>
    </Card>
  );
}
