// src/components/leads/LeadForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { leadFormSchema, type LeadFormValues } from '@/lib/validations';
import { LEAD_STATUSES, LEAD_SOURCES } from '@/lib/constants';

interface LeadFormProps {
  defaultValues?: Partial<LeadFormValues>;
  onSubmit: (data: LeadFormValues) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
  loading?: boolean;
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
        />
        <Input
          label="Email"
          type="email"
          placeholder="jane@company.com"
          error={errors.email?.message}
          required
          {...register('email')}
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
        />
        <Input
          label="Company"
          placeholder="Acme Inc."
          error={errors.company?.message}
          required
          {...register('company')}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Status"
          error={errors.status?.message}
          required
          {...register('status')}
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
        >
          {LEAD_SOURCES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </div>

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
