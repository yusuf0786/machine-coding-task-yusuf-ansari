// src/lib/metadata.ts
import type { Metadata } from 'next';

const BASE_TITLE = 'LeadPulse CRM';
const DESCRIPTION = 'Internal CRM dashboard for managing sales leads';

export function createMetadata(options?: {
  title?: string;
  description?: string;
}): Metadata {
  const title = options?.title
    ? `${options.title} | ${BASE_TITLE}`
    : BASE_TITLE;

  return {
    title,
    description: options?.description ?? DESCRIPTION,
    robots: { index: false, follow: false },
  };
}
