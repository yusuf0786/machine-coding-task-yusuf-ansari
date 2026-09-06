// src/app/dashboard/layout.tsx
import { createMetadata } from '@/lib/metadata';
import { DashboardShell } from '@/components/layout/DashboardShell';

export const metadata = createMetadata({ title: 'Dashboard' });

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
