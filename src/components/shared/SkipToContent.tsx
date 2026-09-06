// src/components/shared/SkipToContent.tsx
export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="fixed top-0 left-0 z-[100] -translate-y-full focus:translate-y-0 bg-[var(--color-accent)] text-[var(--color-accent-text)] px-4 py-2 text-[var(--text-sm)] font-medium rounded-br-[var(--radius-sm)] transition-transform duration-[var(--duration-base)]"
    >
      Skip to main content
    </a>
  );
}
