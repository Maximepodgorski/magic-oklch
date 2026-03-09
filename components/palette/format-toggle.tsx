"use client";

import { cn } from "@/lib/utils";
import type { ColorFormat } from "@/types/color";

const FORMATS: { value: ColorFormat; label: string }[] = [
  { value: "hex", label: "HEX" },
  { value: "oklch", label: "OKLCH" },
  { value: "hsl", label: "HSL" },
  { value: "cssvar", label: "var" },
];

export function FormatToggle({
  value,
  onChange,
  className,
}: {
  value: ColorFormat;
  onChange: (format: ColorFormat) => void;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      aria-label="Color format"
      className={cn(
        "inline-flex items-center gap-[var(--layout-gap-xs)] rounded-[var(--layout-radius-lg)] bg-surface-secondary p-[var(--layout-padding-2xs)]",
        className
      )}
    >
      {FORMATS.map(({ value: fmt, label }) => (
        <button
          key={fmt}
          role="tab"
          aria-selected={value === fmt}
          onClick={() => onChange(fmt)}
          className={cn(
            "rounded-[var(--layout-radius-md)] px-[var(--layout-padding-md)] py-[var(--layout-padding-xs)] text-content-caption font-accent transition-colors cursor-pointer",
            value === fmt
              ? "bg-surface-primary text-content-primary shadow-sm"
              : "text-content-secondary hover:text-content-primary"
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
