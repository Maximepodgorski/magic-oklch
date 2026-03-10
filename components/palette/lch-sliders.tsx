"use client";

import { useCallback, useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { OklchColor } from "@/types/color";

interface LchSlidersProps {
  baseColor: OklchColor;
  onLiveChange: (params: { h?: number; c?: number; l?: number }) => void;
  onCommit: (color?: OklchColor) => void;
  className?: string;
}

const SLIDERS = [
  {
    key: "l" as const,
    label: "Lightness",
    min: 0,
    max: 1,
    step: 0.01,
    unit: "%",
    scale: 100,
  },
  {
    key: "c" as const,
    label: "Chroma",
    min: 0,
    max: 0.4,
    step: 0.001,
    unit: "C",
    scale: 1,
  },
  {
    key: "h" as const,
    label: "Hue",
    min: 0,
    max: 360,
    step: 1,
    unit: "",
    scale: 1,
  },
] as const;

function getTrackGradient(key: "l" | "c" | "h", baseColor: OklchColor): string {
  if (key === "h") {
    return "linear-gradient(to right, hsl(0,100%,50%), hsl(60,100%,50%), hsl(120,100%,50%), hsl(180,100%,50%), hsl(240,100%,50%), hsl(300,100%,50%), hsl(360,100%,50%))";
  }
  if (key === "l") {
    const h = Math.round(baseColor.h);
    return `linear-gradient(to right, oklch(0 ${baseColor.c} ${h}), oklch(0.5 ${baseColor.c} ${h}), oklch(1 0 ${h}))`;
  }
  // chroma
  const h = Math.round(baseColor.h);
  return `linear-gradient(to right, oklch(${baseColor.l} 0 ${h}), oklch(${baseColor.l} 0.3 ${h}))`;
}

function SliderValueInput({
  value,
  unit,
  min,
  max,
  onCommit,
}: {
  value: number;
  unit: string;
  min: number;
  max: number;
  onCommit: (value: number) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  const commit = () => {
    setEditing(false);
    const parsed = parseFloat(draft);
    if (isNaN(parsed)) return;
    const clamped = Math.min(max, Math.max(min, parsed));
    onCommit(clamped);
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        type="text"
        inputMode="decimal"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") setEditing(false);
        }}
        className="w-16 rounded-[var(--layout-radius-md)] bg-muted px-2 py-0.5 text-right font-mono text-xs text-foreground outline-none ring-1 ring-ring"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        setDraft(String(value));
        setEditing(true);
      }}
      className="cursor-text rounded-[var(--layout-radius-md)] bg-muted px-2 py-0.5 font-mono text-xs text-foreground hover:ring-1 hover:ring-border"
    >
      {value}
      {unit ? ` ${unit}` : "°"}
    </button>
  );
}

export function LchSliders({
  baseColor,
  onLiveChange,
  onCommit,
  className,
}: LchSlidersProps) {
  const handleSliderInput = useCallback(
    (key: "l" | "c" | "h", value: number) => {
      onLiveChange({ [key]: value });
    },
    [onLiveChange]
  );

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6 md:grid-cols-3",
        className
      )}
    >
      {SLIDERS.map(({ key, label, min, max, step, unit, scale }) => {
        const rawValue = baseColor[key];
        const displayValue =
          scale === 100
            ? Math.round(rawValue * 100)
            : key === "h"
              ? Math.round(rawValue)
              : Number(rawValue.toFixed(3));

        return (
          <div key={key} className="flex flex-col gap-2">
            {/* Label + value badge */}
            <div className="flex items-center justify-between">
              <label
                htmlFor={`slider-${key}`}
                className="text-[13px] font-medium text-foreground"
              >
                {label}
              </label>
              <SliderValueInput
                value={displayValue}
                unit={unit}
                min={min * scale}
                max={max * scale}
                onCommit={(v) => {
                  const raw = v / scale;
                  const clamped = Math.min(max, Math.max(min, raw));
                  onLiveChange({ [key]: clamped });
                  onCommit({ ...baseColor, [key]: clamped });
                }}
              />
            </div>

            {/* Slider with gradient track */}
            <div className="relative h-3">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: getTrackGradient(key, baseColor),
                }}
              />
              <input
                id={`slider-${key}`}
                type="range"
                min={min}
                max={max}
                step={step}
                value={rawValue}
                onInput={(e) =>
                  handleSliderInput(
                    key,
                    parseFloat((e.target as HTMLInputElement).value)
                  )
                }
                onChange={() => {}}
                onPointerUp={() => onCommit()}
                onKeyUp={(e) => {
                  if (
                    ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(
                      e.key
                    )
                  ) {
                    onCommit();
                  }
                }}
                className="slider-gradient absolute inset-0 w-full cursor-pointer appearance-none bg-transparent"
                aria-label={`${label}: ${displayValue}${unit}`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
