"use client";

import { cn } from "@/lib/utils";
import { formatColor } from "@/lib/color-formatter";
import { ContrastBadge } from "@/components/shared/contrast-badge";
import { GamutBadge } from "@/components/shared/gamut-badge";
import type { PaletteShade, ColorFormat } from "@/types/color";

export function ShadeCard({
  shade,
  format,
  paletteName,
  onCopy,
  tabIndex = 0,
  className,
}: {
  shade: PaletteShade;
  format: ColorFormat;
  paletteName: string;
  onCopy: (value: string) => void;
  tabIndex?: number;
  className?: string;
}) {
  const displayValue =
    format === "cssvar"
      ? shade.cssVar
      : formatColor(shade.oklch, format, paletteName, shade.step);

  const bestOnWhite = shade.contrast.onWhite >= shade.contrast.onBlack;

  const ariaLabel = [
    `Shade ${shade.step}`,
    displayValue,
    `contrast ${shade.contrast.level}`,
    shade.gamut !== "srgb" ? `gamut ${shade.gamut}` : "",
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <button
      role="listitem"
      tabIndex={tabIndex}
      aria-label={ariaLabel}
      onClick={() => onCopy(displayValue)}
      className={cn(
        "group flex flex-col gap-[var(--layout-gap-sm)] rounded-[var(--layout-radius-xl)] p-[var(--layout-padding-sm)] text-left transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current",
        "bg-surface-primary border border-border-secondary",
        className
      )}
    >
      {/* Color swatch */}
      <div
        className="h-16 w-full rounded-[var(--layout-radius-lg)]"
        style={{
          backgroundColor: shade.hex,
          forcedColorAdjust: "none",
        }}
      />

      {/* Step label */}
      <div className="flex items-center justify-between px-[var(--layout-padding-xs)]">
        <span className="text-content-caption font-accent text-content-secondary">
          {shade.step}
        </span>
        <GamutBadge gamut={shade.gamut} />
      </div>

      {/* Color value */}
      <span
        className={cn(
          "px-[var(--layout-padding-xs)] font-mono text-content-caption truncate",
          "text-content-primary"
        )}
        title={displayValue}
      >
        {displayValue}
      </span>

      {/* Contrast badges */}
      <div className="flex flex-wrap gap-[var(--layout-gap-xs)] px-[var(--layout-padding-xs)]">
        <ContrastBadge
          level={shade.contrast.level}
          lc={bestOnWhite ? shade.contrast.onWhite : shade.contrast.onBlack}
        />
      </div>
    </button>
  );
}
