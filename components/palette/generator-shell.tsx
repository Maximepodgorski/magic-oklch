"use client";

import { useRef, useEffect } from "react";
import { usePalette } from "@/hooks/use-palette";
import { useColorFormat } from "@/hooks/use-color-format";
import { PaletteHeader } from "./palette-header";
import { PaletteGrid } from "./palette-grid";
import { ColorInput } from "./color-input";
import { toHex } from "@/lib/color-formatter";

export function GeneratorShell() {
  const { palette, baseColor, setFromColor } = usePalette();
  const { format, setFormat } = useColorFormat();
  const prevNameRef = useRef(palette.name);

  // Announce palette changes to screen readers
  useEffect(() => {
    if (palette.name !== prevNameRef.current) {
      prevNameRef.current = palette.name;
      const live = document.getElementById("copy-live");
      if (live) live.textContent = `Palette updated: ${palette.name}`;
    }
  }, [palette.name]);

  return (
    <div className="flex flex-col gap-[var(--layout-gap-2xl)]">
      <div className="flex flex-col gap-[var(--layout-gap-xl)] sm:flex-row sm:items-end">
        <ColorInput
          defaultValue={toHex(baseColor)}
          onColorChange={(color) => setFromColor(color)}
          className="max-w-xs"
        />
      </div>

      <PaletteHeader
        palette={palette}
        format={format}
        onFormatChange={setFormat}
      />

      {palette.shades && (
        <PaletteGrid
          shades={palette.shades}
          format={format}
          paletteName={palette.id}
        />
      )}
    </div>
  );
}
