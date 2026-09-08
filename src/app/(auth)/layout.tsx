// src/app/(auth)/layout.tsx

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-base)] px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">LeadPulse</h1>
          <p className="mt-2 text-[var(--text-sm)] text-[var(--color-text-muted)]">
            CRM Dashboard
          </p>
        </div>
        <div className="bg-[var(--color-bg-base)] p-8 rounded-xl border border-[var(--color-border)] shadow-sm">
          {children}
        </div>
      </div>
    </div>
  );
}
