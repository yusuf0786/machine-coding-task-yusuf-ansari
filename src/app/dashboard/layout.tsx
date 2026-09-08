// src/app/dashboard/layout.tsx
import { redirect } from 'next/navigation';
import { createMetadata } from '@/lib/metadata';
import { getSessionUser } from '@/lib/auth';
import { DashboardShell } from '@/components/layout/DashboardShell';

export const metadata = createMetadata({ title: 'Dashboard' });

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!user) {
    redirect('/login');
  }

  return <DashboardShell>{children}</DashboardShell>;
}