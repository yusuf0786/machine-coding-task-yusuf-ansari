// src/app/dashboard/leads/[id]/page.tsx
'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/shared/ErrorState';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { LeadDetailCard } from '@/components/leads/LeadDetailCard';
import { ActivityTimeline } from '@/components/leads/ActivityTimeline';
import { StatusChanger } from '@/components/leads/StatusChanger';
import { LeadModal } from '@/components/leads/LeadModal';
import { LeadForm } from '@/components/leads/LeadForm';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { useLead } from '@/hooks/useLead';
import { ROUTES } from '@/lib/constants';
import type { LeadFormValues } from '@/lib/validations';

interface LeadDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function LeadDetailPage(props: LeadDetailPageProps) {
  const { id } = use(props.params);
  const router = useRouter();
  const { lead, isError, isLoading, mutate } = useLead(id);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/leads/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      router.push(ROUTES.dashboard);
    } catch {
      setDeleting(false);
    }
  };

  const handleUpdate = async (data: LeadFormValues) => {
    const res = await fetch(`/api/leads/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update');
    setEditOpen(false);
    mutate();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="rect" className="h-10 w-48" />
        <Skeleton variant="rect" className="h-64" />
        <Skeleton variant="rect" className="h-48" />
      </div>
    );
  }

  if (isError || !lead) {
    return (
      <ErrorState
        title="Lead not found"
        message="The lead you're looking for doesn't exist or has been removed."
        onRetry={() => router.push(ROUTES.dashboard)}
      />
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(ROUTES.dashboard)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => setEditOpen(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Details */}
        <div className="lg:col-span-2 space-y-6">
          <LeadDetailCard lead={lead} />
          <ActivityTimeline events={lead.timeline} />
        </div>

        {/* Right: Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-[var(--text-base)] font-semibold text-[var(--color-text-primary)]">
                Quick Actions
              </h3>
            </CardHeader>
            <CardContent>
              <StatusChanger
                currentStatus={lead.status}
                leadId={lead._id || lead.id || id}
                onStatusChanged={() => mutate()}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit modal */}
      <LeadModal
        open={editOpen}
        title="Edit Lead"
        onClose={() => setEditOpen(false)}
      >
        <LeadForm
          defaultValues={{
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            company: lead.company,
            status: lead.status,
            source: lead.source,
          }}
          onSubmit={handleUpdate}
          onCancel={() => setEditOpen(false)}
          submitLabel="Save Changes"
        />
      </LeadModal>

      {/* Delete dialog */}
      <ConfirmDialog
        open={deleteOpen}
        title="Delete Lead"
        description={`Are you sure you want to delete "${lead.name}"? This action cannot be undone.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </div>
  );
}
