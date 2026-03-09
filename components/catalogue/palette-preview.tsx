"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Palette } from "@/types/color";

export function PalettePreview({
  palette,
  stripeHex,
  className,
}: {
  palette: Palette;
  stripeHex: string[];
  className?: string;
}) {
  const sourceLabel = palette.source === "tailwind" ? "Tailwind-inspired" : "Curated";
  const sourceVariant = palette.source === "tailwind" ? "brand" : "neutral";

  return (
    <Link
      href={`/?h=${palette.baseColor.h}&c=${palette.baseColor.c}&name=${palette.id}`}
      aria-label={`${palette.name} palette, ${sourceLabel}, 11 shades`}
      className={cn(
        "group flex flex-col gap-[var(--layout-gap-md)] rounded-[var(--layout-radius-xl)] bg-surface-primary border border-border-secondary p-[var(--layout-padding-md)] transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current",
        className
      )}
    >
      {/* Color stripe */}
      <div className="flex h-8 overflow-hidden rounded-[var(--layout-radius-lg)]" aria-hidden="true">
        {stripeHex.map((hex, i) => (
          <div
            key={i}
            className="flex-1"
            style={{ backgroundColor: hex, forcedColorAdjust: "none" }}
          />
        ))}
      </div>

      {/* Name + source */}
      <div className="flex items-center justify-between">
        <span className="text-content-note font-accent text-content-primary capitalize">
          {palette.name}
        </span>
        <Badge variant={sourceVariant} size="sm" type="light">
          {sourceLabel}
        </Badge>
      </div>
    </Link>
  );
}
