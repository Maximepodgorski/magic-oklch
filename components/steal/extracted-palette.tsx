"use client";

import { useRouter } from "next/navigation";
import { useCopy } from "@/hooks/use-copy";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { round } from "@/lib/utils";
import type { ExtractedPalette } from "@/types/color";

interface ExtractedPaletteRowProps {
  palette: ExtractedPalette;
}

export function ExtractedPaletteRow({ palette }: ExtractedPaletteRowProps) {
  const { copy } = useCopy();
  const router = useRouter();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-medium text-foreground">{palette.label}</h3>
        <span className="text-xs text-muted-foreground">
          {palette.colors.length} color{palette.colors.length !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {palette.colors.map((color) => (
          <Tooltip key={color.hex}>
            <TooltipTrigger asChild>
              <button
                onClick={() =>
                  copy(
                    `oklch(${round(color.oklch.l, 3)} ${round(color.oklch.c, 3)} ${round(color.oklch.h, 1)})`,
                    color.hex
                  )
                }
                className="group relative flex h-16 w-16 shrink-0 cursor-pointer items-center justify-center rounded-[var(--layout-radius-xl)] border border-border transition-transform hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                style={{ backgroundColor: color.hex }}
                aria-label={`${color.hex} — click to copy OKLCH`}
              >
                <span
                  className="absolute inset-x-0 bottom-0 rounded-b-[var(--layout-radius-xl)] px-1 pb-0.5 pt-3 text-center font-mono text-[9px] leading-tight opacity-0 transition-opacity group-hover:opacity-100"
                  style={{
                    color: color.oklch.l > 0.65 ? "#1a1a1a" : "#ffffff",
                    background:
                      color.oklch.l > 0.65
                        ? "linear-gradient(transparent, rgba(255,255,255,0.7))"
                        : "linear-gradient(transparent, rgba(0,0,0,0.5))",
                  }}
                >
                  {color.hex.toUpperCase()}
                </span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" size="sm" className="max-w-none">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-xs">
                  oklch({round(color.oklch.l, 3)} {round(color.oklch.c, 3)}{" "}
                  {round(color.oklch.h, 1)})
                </span>
                <Button
                  variant="secondary"
                  size="xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(
                      `/?h=${round(color.oklch.h, 1)}&c=${round(color.oklch.c, 3)}&name=stolen`
                    );
                  }}
                >
                  Generate palette
                </Button>
              </div>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}
