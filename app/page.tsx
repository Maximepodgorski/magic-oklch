import { Suspense } from "react";
import { GeneratorShell } from "@/components/palette/generator-shell";
import { PaletteSkeleton } from "@/components/palette/palette-skeleton";

export default function Home() {
  return (
    <Suspense fallback={<PaletteSkeleton />}>
      <GeneratorShell />
    </Suspense>
  );
}
