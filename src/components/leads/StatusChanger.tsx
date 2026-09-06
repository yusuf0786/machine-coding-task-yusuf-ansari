// src/components/leads/StatusChanger.tsx
'use client';

import { useState } from 'react';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { LEAD_STATUSES } from '@/lib/constants';
import type { LeadStatus } from '@/types';

interface StatusChangerProps {
  currentStatus: LeadStatus;
  leadId: string;
  onStatusChanged: () => void;
}

export function StatusChanger({
  currentStatus,
  leadId,
  onStatusChanged,
}: StatusChangerProps) {
  const [status, setStatus] = useState<LeadStatus>(currentStatus);
  const [saving, setSaving] = useState(false);

  const hasChanged = status !== currentStatus;

  const handleSave = async () => {
    if (!hasChanged) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      onStatusChanged();
    } catch {
      // reset on error
      setStatus(currentStatus);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex items-end gap-3">
      <div className="flex-1">
        <Select
          label="Change Status"
          value={status}
          onChange={(e) => setStatus(e.target.value as LeadStatus)}
        >
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </div>
      <Button
        variant="primary"
        size="sm"
        onClick={handleSave}
        disabled={!hasChanged}
        loading={saving}
        loadingText="Saving…"
        className="mb-[2px]"
      >
        Update
      </Button>
    </div>
  );
}
