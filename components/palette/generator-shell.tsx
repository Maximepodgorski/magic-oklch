"use client";

import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { usePalette } from "@/hooks/use-palette";
import { useColorFormat } from "@/hooks/use-color-format";
import { generatePalette } from "@/lib/color-engine";
import { PaletteHeader } from "./palette-header";
import { PaletteGrid } from "./palette-grid";
import { ColorInput } from "./color-input";
import { LchSliders } from "./lch-sliders";
import { ExportPalette } from "./export-palette";
import { toHex } from "@/lib/color-formatter";
import type { OklchColor } from "@/types/color";

/** Live slider state — tracks which baseColor it was derived from */
interface LiveState {
  color: OklchColor;
  base: OklchColor;
}

function isSameColor(a: OklchColor, b: OklchColor) {
  return a.l === b.l && a.c === b.c && a.h === b.h;
}

export function GeneratorShell() {
  const { palette, baseColor, name, setFromColor, updateUrl } = usePalette();
  const { format, setFormat } = useColorFormat();
  const prevNameRef = useRef(palette.name);
  const [exportOpen, setExportOpen] = useState(false);

  // Live slider state — auto-invalidates when baseColor changes (no ref/effect needed)
  const [liveState, setLiveState] = useState<LiveState | null>(null);

  // If baseColor changed (URL/color input), liveState is stale — fall back to baseColor
  const activeColor =
    liveState && isSameColor(liveState.base, baseColor)
      ? liveState.color
      : baseColor;

  // Generate palette from active color (instant during drag)
  const activePalette = useMemo(
    () =>
      liveState && isSameColor(liveState.base, baseColor)
        ? generatePalette(liveState.color, name)
        : palette,
    [liveState, baseColor, name, palette]
  );

  // Slider: instant local update
  const handleSliderLive = useCallback(
    (params: { h?: number; c?: number; l?: number }) => {
      setLiveState((prev) => {
        const base = prev?.color ?? baseColor;
        return {
          color: {
            l: params.l ?? base.l,
            c: params.c ?? base.c,
            h: params.h ?? base.h,
          },
          base: baseColor,
        };
      });
    },
    [baseColor]
  );

  // Slider: commit to URL on release (accepts optional color for numeric input race fix)
  const handleSliderCommit = useCallback(
    (color?: OklchColor) => {
      const c = color ?? liveState?.color;
      if (c) {
        updateUrl({ h: c.h, c: c.c, l: c.l });
      }
    },
    [liveState, updateUrl]
  );

  // Announce palette changes to screen readers
  useEffect(() => {
    if (activePalette.name !== prevNameRef.current) {
      prevNameRef.current = activePalette.name;
      const live = document.getElementById("copy-live");
      if (live) live.textContent = `Palette updated: ${activePalette.name}`;
    }
  }, [activePalette.name]);

  return (
    <div className="flex flex-col gap-[var(--layout-gap-2xl)]">
      <div className="flex flex-col gap-[var(--layout-gap-xl)]">
        <div className="flex flex-col gap-[var(--layout-gap-xl)] sm:flex-row sm:items-end">
          <ColorInput
            defaultValue={toHex(baseColor)}
            onColorChange={(color) => setFromColor(color)}
            className="max-w-xs"
          />
        </div>

        <LchSliders
          baseColor={activeColor}
          onLiveChange={handleSliderLive}
          onCommit={handleSliderCommit}
        />
      </div>

      <PaletteHeader
        palette={activePalette}
        format={format}
        onFormatChange={setFormat}
        onExport={() => setExportOpen((v) => !v)}
      />

      <ExportPalette
        palette={activePalette}
        open={exportOpen}
        onClose={() => setExportOpen(false)}
      />

      {activePalette.shades && (
        <PaletteGrid
          shades={activePalette.shades}
          format={format}
          paletteName={activePalette.id}
        />
      )}
    </div>
  );
}
