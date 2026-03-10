import type { Metadata } from "next";
import { Suspense } from "react";
import { GeneratorShell } from "@/components/palette/generator-shell";
import { PaletteSkeleton } from "@/components/palette/palette-skeleton";

export const metadata: Metadata = {
  title: "Generator — OKLCH Palette Generator",
  description:
    "Generate 11 OKLCH color shades from any CSS color. Perceptually uniform lightness, APCA contrast scores, sRGB and P3 gamut detection. Export as HEX, HSL, OKLCH, or CSS variables.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <Suspense fallback={<PaletteSkeleton />}>
      <GeneratorShell />
    </Suspense>
  );
}
