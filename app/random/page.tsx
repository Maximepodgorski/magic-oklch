import type { Metadata } from "next";
import { Suspense } from "react";
import { RandomShell } from "@/components/random/random-shell";
import { PaletteSkeleton } from "@/components/palette/palette-skeleton";

export const metadata: Metadata = {
  title: "Random Palette — MagicOKLCH",
  description:
    "Generate random OKLCH color palettes for inspiration. Shuffle until you find one you love.",
};

export default function RandomPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
      <Suspense fallback={<PaletteSkeleton />}>
        <RandomShell />
      </Suspense>
      <div
        id="copy-live"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />
    </div>
  );
}
