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

export function GeneratorShell() {
  const { palette, baseColor, name, setFromColor, updateUrl } = usePalette();
  const { format, setFormat } = useColorFormat();
  const prevNameRef = useRef(palette.name);
  const [exportOpen, setExportOpen] = useState(false);

  // Local color for real-time slider preview (bypasses URL roundtrip)
  const [liveColor, setLiveColor] = useState<OklchColor | null>(null);

  // Sync liveColor when URL-driven baseColor changes (e.g. from color input)
  const prevBaseRef = useRef(baseColor);
  useEffect(() => {
    if (
      prevBaseRef.current.l !== baseColor.l ||
      prevBaseRef.current.c !== baseColor.c ||
      prevBaseRef.current.h !== baseColor.h
    ) {
      prevBaseRef.current = baseColor;
      setLiveColor(null); // clear override, use URL value
    }
  }, [baseColor]);

  // The color used for palette generation — local override during drag, URL otherwise
  const activeColor = liveColor ?? baseColor;

  // Generate palette from active color (instant during drag)
  const activePalette = useMemo(
    () => (liveColor ? generatePalette(liveColor, name) : palette),
    [liveColor, name, palette]
  );

  // Slider: instant local update
  const handleSliderLive = useCallback((params: { h?: number; c?: number; l?: number }) => {
    setLiveColor((prev) => {
      const base = prev ?? baseColor;
      return {
        l: params.l ?? base.l,
        c: params.c ?? base.c,
        h: params.h ?? base.h,
      };
    });
  }, [baseColor]);

  // Slider: commit to URL on release (accepts optional color for numeric input race fix)
  const handleSliderCommit = useCallback((color?: OklchColor) => {
    const c = color ?? liveColor;
    if (c) {
      updateUrl({ h: c.h, c: c.c, l: c.l });
    }
  }, [liveColor, updateUrl]);

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
