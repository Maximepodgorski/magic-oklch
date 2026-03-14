import type { Metadata } from "next";
import { Suspense } from "react";
import { BlocksShell } from "@/components/blocks/blocks-shell";

export const metadata: Metadata = {
  title: "Blocks — Live Palette Preview",
  description:
    "Preview how your OKLCH palettes look on realistic UI templates. Switch Brand and Neutral palettes to see live color theming on login forms, settings pages, and more.",
  alternates: { canonical: "/blocks" },
};

export default function BlocksPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 animate-pulse px-4 py-8 lg:px-10">
          <div className="h-10 w-48 rounded-[var(--layout-radius-lg)] bg-surface-secondary" />
        </div>
      }
    >
      <BlocksShell />
    </Suspense>
  );
}
