// src/components/layout/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Plus,
  Zap,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAV_LINKS, ROUTES } from '@/lib/constants';

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard,
  Users,
  BarChart3,
};

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[var(--color-bg-base)] border-r border-[var(--color-border)] transition-transform duration-[var(--duration-base)] lg:static lg:z-auto lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
        aria-label="Primary navigation"
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-[var(--color-border)]">
          <Link
            href={ROUTES.dashboard}
            className="flex items-center gap-2 group"
            onClick={onClose}
          >
            <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-[var(--color-accent)] flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" aria-hidden="true" />
            </div>
            <span className="text-[var(--text-base)] font-bold text-[var(--color-text-primary)]">
              LeadPulse
            </span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_LINKS.map((link) => {
            const Icon = ICON_MAP[link.icon] ?? LayoutDashboard;
            const isActive =
              link.href === ROUTES.dashboard
                ? pathname === ROUTES.dashboard
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 rounded-[var(--radius-sm)] px-3 py-2.5 text-[var(--text-sm)] font-medium transition-colors duration-[var(--duration-base)]',
                  isActive
                    ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-muted)] hover:text-[var(--color-text-primary)]'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* New lead CTA */}
        <div className="p-4 border-t border-[var(--color-border)]">
          <Link
            href={ROUTES.newLead}
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full rounded-[var(--radius-sm)] bg-[var(--color-accent)] text-white px-4 py-2.5 text-[var(--text-sm)] font-medium hover:brightness-110 transition-all duration-[var(--duration-base)]"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            New Lead
          </Link>
        </div>
      </aside>
    </>
  );
}
