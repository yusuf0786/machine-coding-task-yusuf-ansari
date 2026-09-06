// src/components/leads/LeadStatusBadge.tsx
import { Badge } from '@/components/ui/Badge';
import { STATUS_CONFIG } from '@/lib/constants';
import type { LeadStatus } from '@/types';

interface LeadStatusBadgeProps {
  status: LeadStatus;
  size?: 'sm' | 'md';
}

const VARIANT_MAP: Record<LeadStatus, 'primary' | 'success' | 'warning' | 'danger' | 'info'> = {
  New: 'info',
  Contacted: 'warning',
  Qualified: 'primary',
  Converted: 'success',
  Lost: 'danger',
};

export function LeadStatusBadge({ status, size = 'sm' }: LeadStatusBadgeProps) {
  return (
    <Badge variant={VARIANT_MAP[status]} size={size} dot>
      {status}
    </Badge>
  );
}
