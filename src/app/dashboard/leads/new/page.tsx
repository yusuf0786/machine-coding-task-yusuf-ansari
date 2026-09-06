// src/app/dashboard/leads/new/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { LeadForm } from '@/components/leads/LeadForm';
import { ROUTES } from '@/lib/constants';
import type { LeadFormValues } from '@/lib/validations';

export default function NewLeadPage() {
  const router = useRouter();

  const handleSubmit = async (data: LeadFormValues) => {
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create lead');
    const created = await res.json();
    router.push(ROUTES.leadDetail(created.id));
  };

  return (
    <div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push(ROUTES.dashboard)}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Button>

      <Card className="max-w-2xl">
        <CardHeader>
          <h1 className="text-[var(--text-xl)] font-bold text-[var(--color-text-primary)]">
            Create New Lead
          </h1>
          <p className="text-[var(--text-sm)] text-[var(--color-text-muted)] mt-1">
            Fill in the details below to add a new lead to the pipeline.
          </p>
        </CardHeader>
        <CardContent>
          <LeadForm
            onSubmit={handleSubmit}
            onCancel={() => router.push(ROUTES.dashboard)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
