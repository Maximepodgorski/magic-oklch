"use client";

import { useCallback } from "react";
import { cn } from "@/lib/utils";
import type { OklchColor } from "@/types/color";

interface LchSlidersProps {
  baseColor: OklchColor;
  onLiveChange: (params: { h?: number; c?: number; l?: number }) => void;
  onCommit: (color?: OklchColor) => void;
  className?: string;
}

const SLIDERS = [
  { key: "l" as const, label: "Lightness", min: 0, max: 1, step: 0.01, unit: "%", scale: 100 },
  { key: "c" as const, label: "Chroma", min: 0, max: 0.4, step: 0.001, unit: "", scale: 1 },
  { key: "h" as const, label: "Hue", min: 0, max: 360, step: 1, unit: "°", scale: 1 },
] as const;

export function LchSliders({ baseColor, onLiveChange, onCommit, className }: LchSlidersProps) {
  const handleSliderInput = useCallback(
    (key: "l" | "c" | "h", value: number) => {
      onLiveChange({ [key]: value });
    },
    [onLiveChange]
  );

  const handleNumericInput = useCallback(
    (key: "l" | "c" | "h", raw: string, scale: number) => {
      const num = parseFloat(raw);
      if (isNaN(num)) return;
      const value = scale === 100 ? num / 100 : num;
      onLiveChange({ [key]: value });
      // Pass the computed color directly to avoid React batching race
      const newColor = { ...baseColor, [key]: value };
      onCommit(newColor);
    },
    [onLiveChange, onCommit, baseColor]
  );

  return (
    <div className={cn("flex flex-col gap-[var(--layout-gap-lg)]", className)}>
      {SLIDERS.map(({ key, label, min, max, step, unit, scale }) => {
        const rawValue = baseColor[key];
        const displayValue = scale === 100 ? Math.round(rawValue * 100) : Number(rawValue.toFixed(3));

        return (
          <div key={key} className="flex items-center gap-[var(--layout-gap-md)]">
            <label
              htmlFor={`slider-${key}`}
              className="w-20 shrink-0 text-content-caption font-accent text-content-secondary"
            >
              {label}
            </label>
            <input
              id={`slider-${key}`}
              type="range"
              min={min}
              max={max}
              step={step}
              value={rawValue}
              onInput={(e) => handleSliderInput(key, parseFloat((e.target as HTMLInputElement).value))}
              onChange={() => {}} // controlled — prevent React warning
              onPointerUp={() => onCommit()}
              onKeyUp={(e) => {
                if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "ArrowUp" || e.key === "ArrowDown") {
                  onCommit();
                }
              }}
              className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-surface-secondary accent-[var(--root-color-brand-500)] [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--root-color-brand-500)]"
              aria-label={`${label}: ${displayValue}${unit}`}
            />
            <div className="flex w-20 shrink-0 items-center gap-[var(--layout-gap-xs)]">
              <input
                type="number"
                min={min * scale}
                max={max * scale}
                step={step * scale}
                value={displayValue}
                onChange={(e) => handleNumericInput(key, e.target.value, scale)}
                className="w-16 rounded-[var(--layout-radius-md)] border border-border-secondary bg-surface-primary px-[var(--layout-padding-sm)] py-[var(--layout-padding-2xs)] text-content-caption font-mono text-content-primary text-right"
                aria-label={`${label} value`}
              />
              {unit && (
                <span className="text-content-caption text-content-tertiary">
                  {unit}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
