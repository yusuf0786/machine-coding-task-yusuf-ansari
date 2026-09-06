import type { Metadata } from "next";
import { inter } from "@/lib/fonts";
import { createMetadata } from "@/lib/metadata";
import { SkipToContent } from "@/components/shared/SkipToContent";
import "./globals.css";

export const metadata: Metadata = createMetadata();

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans bg-[var(--color-bg-base)] text-[var(--color-text-primary)]">
        <SkipToContent />
        {children}
      </body>
    </html>
  );
}
