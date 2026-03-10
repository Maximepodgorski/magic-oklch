import type { Metadata } from "next";
import { Suspense } from "react";
import { RandomShell } from "@/components/random/random-shell";
import { PaletteSkeleton } from "@/components/palette/palette-skeleton";

export const metadata: Metadata = {
  title: "Shuffle Random Palettes",
  description:
    "Generate random OKLCH color palettes for design inspiration. Each shuffle creates 11 perceptually uniform shades with a new hue and chroma.",
  alternates: { canonical: "/random" },
};

export default function RandomPage() {
  return (
    <Suspense fallback={<PaletteSkeleton />}>
      <RandomShell />
    </Suspense>
  );
}
