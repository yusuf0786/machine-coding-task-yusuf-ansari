// src/components/layout/Topbar.tsx
'use client';

import { Menu, Bell } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { UserMenu } from '@/components/shared/UserMenu';

interface TopbarProps {
  onMenuToggle: () => void;
}

export function Topbar({ onMenuToggle }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg-base)]/80 backdrop-blur-md px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <Button
          variant="icon"
          size="sm"
          onClick={onMenuToggle}
          className="lg:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-[var(--text-sm)] font-medium text-[var(--color-text-muted)] hidden sm:block">
          CRM Dashboard
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button variant="icon" size="sm" aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </Button>
        <div className="pl-2 border-l border-[var(--color-border)] ml-1">
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
