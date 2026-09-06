// src/app/page.tsx — redirect to dashboard
import { redirect } from 'next/navigation';
import { ROUTES } from '@/lib/constants';

export default function Home() {
  redirect(ROUTES.dashboard);
}
