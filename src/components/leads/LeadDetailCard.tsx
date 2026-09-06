// src/components/leads/LeadDetailCard.tsx
import {
  Mail,
  Phone,
  Building2,
  Globe,
  Calendar,
  Hash,
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { LeadStatusBadge } from './LeadStatusBadge';
import { formatDate, formatPhone, getInitials } from '@/lib/utils';
import type { Lead } from '@/types';

interface LeadDetailCardProps {
  lead: Lead;
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 py-2">
      <Icon
        className="h-4 w-4 text-[var(--color-text-muted)] mt-0.5 shrink-0"
        aria-hidden="true"
      />
      <div className="min-w-0">
        <dt className="text-[var(--text-xs)] text-[var(--color-text-muted)] uppercase tracking-wider">
          {label}
        </dt>
        <dd className="text-[var(--text-sm)] text-[var(--color-text-primary)] mt-0.5 break-all">
          {value}
        </dd>
      </div>
    </div>
  );
}

export function LeadDetailCard({ lead }: LeadDetailCardProps) {
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
          <InfoRow icon={Calendar} label="Created" value={formatDate(lead.createdDate)} />
          <InfoRow icon={Hash} label="ID" value={lead.id} />
        </dl>
      </CardContent>
    </Card>
  );
}
