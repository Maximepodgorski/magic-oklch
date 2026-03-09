"use client";

import { useCallback, useRef } from "react";
import { ShadeCard } from "./shade-card";
import { useCopy } from "@/hooks/use-copy";
import type { PaletteShade, ColorFormat } from "@/types/color";

export function PaletteGrid({
  shades,
  format,
  paletteName,
}: {
  shades: PaletteShade[];
  format: ColorFormat;
  paletteName: string;
}) {
  const { copy } = useCopy();
  const gridRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!gridRef.current) return;
      const items = Array.from(
        gridRef.current.querySelectorAll<HTMLButtonElement>("[role=listitem]")
      );
      const currentIdx = items.indexOf(e.target as HTMLButtonElement);
      if (currentIdx < 0) return;

      let nextIdx = -1;
      if (e.key === "ArrowRight") nextIdx = Math.min(currentIdx + 1, items.length - 1);
      if (e.key === "ArrowLeft") nextIdx = Math.max(currentIdx - 1, 0);

      if (nextIdx >= 0 && nextIdx !== currentIdx) {
        e.preventDefault();
        items[currentIdx].tabIndex = -1;
        items[nextIdx].tabIndex = 0;
        items[nextIdx].focus();
      }
    },
    []
  );

  return (
    <div
      ref={gridRef}
      role="list"
      aria-label="Palette shades"
      onKeyDown={handleKeyDown}
      className="grid grid-cols-2 gap-[var(--layout-gap-md)] sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-11"
    >
      {shades.map((shade, i) => (
        <ShadeCard
          key={shade.step}
          shade={shade}
          format={format}
          paletteName={paletteName}
          onCopy={(value) => copy(value, `${paletteName}-${shade.step}`)}
          tabIndex={i === 0 ? 0 : -1}
        />
      ))}
    </div>
  );
}
