import { Suspense } from "react";
import { GeneratorShell } from "@/components/palette/generator-shell";
import { PaletteSkeleton } from "@/components/palette/palette-skeleton";

export default function Home() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
      <Suspense fallback={<PaletteSkeleton />}>
        <GeneratorShell />
      </Suspense>
      {/* Visually-hidden live region for copy + palette change announcements */}
      <div
        id="copy-live"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />
    </div>
  );
}
