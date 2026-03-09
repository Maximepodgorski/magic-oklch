"use client";

import { useCallback, useEffect, useMemo, useSyncExternalStore } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { generatePalette } from "@/lib/color-engine";
import { useCopy } from "@/hooks/use-copy";
import { useColorFormat } from "@/hooks/use-color-format";
import { PaletteGrid } from "@/components/palette/palette-grid";
import { FormatToggle } from "@/components/palette/format-toggle";
import { Button } from "@/components/ui/button";
import {
  clamp,
  round,
  generateRandomParams,
  getHueLabel,
  getChromaLabel,
} from "@/lib/utils";
import type { OklchColor } from "@/types/color";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export function RandomShell() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { copy } = useCopy();
  const { format, setFormat } = useColorFormat();
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Parse URL params or generate random
  const hasParams = searchParams.has("h") && searchParams.has("c");
  const h = clamp(Number(searchParams.get("h")) || 0, 0, 360);
  const c = clamp(Number(searchParams.get("c")) || 0.15, 0, 0.4);

  // If no params on mount, generate random and set URL
  useEffect(() => {
    if (mounted && !hasParams) {
      const params = generateRandomParams();
      router.replace(`/random?h=${params.h}&c=${params.c}`, { scroll: false });
    }
  }, [mounted, hasParams, router]);

  const baseColor: OklchColor = useMemo(() => ({ l: 0.65, c, h }), [c, h]);
  const palette = useMemo(
    () => generatePalette(baseColor, "random"),
    [baseColor]
  );

  const handleShuffle = useCallback(() => {
    const params = generateRandomParams();
    router.replace(`/random?h=${params.h}&c=${params.c}`, { scroll: false });
  }, [router]);

  const handleOpenInGenerator = useCallback(() => {
    router.push(`/?h=${h}&c=${c}&name=custom`);
  }, [router, h, c]);

  const handleShare = useCallback(() => {
    copy(window.location.href, "Link copied");
  }, [copy]);

  const hueLabel = getHueLabel(h);
  const chromaLabel = getChromaLabel(c);

  return (
    <div className="flex flex-col gap-[var(--layout-gap-2xl)]">
      {/* Header */}
      <div className="flex flex-col gap-[var(--layout-gap-lg)] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-[var(--layout-gap-xs)]">
          <h1 className="text-heading-medium font-accent text-content-primary">
            Random Palette
          </h1>
          <p className="text-content-note text-content-secondary">
            {hueLabel}, {chromaLabel} — Hue {round(h, 1)}° Chroma{" "}
            {round(c, 3)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-[var(--layout-gap-md)]">
          <FormatToggle value={format} onChange={setFormat} />
          <Button variant="primary" size="sm" onClick={handleShuffle}>
            <ShuffleIcon className="h-4 w-4" />
            Shuffle
          </Button>
          <Button variant="secondary" size="sm" onClick={handleOpenInGenerator}>
            Open in Generator
          </Button>
          <Button variant="terciary" size="sm" onClick={handleShare}>
            <ShareIcon className="h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      {/* Palette grid */}
      {palette.shades && (
        <PaletteGrid
          shades={palette.shades}
          format={format}
          paletteName="random"
        />
      )}
    </div>
  );
}

function ShuffleIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <polyline points="16 3 21 3 21 8" />
      <line x1={4} y1={20} x2={21} y2={3} />
      <polyline points="21 16 21 21 16 21" />
      <line x1={15} y1={15} x2={21} y2={21} />
      <line x1={4} y1={4} x2={9} y2={9} />
    </svg>
  );
}

function ShareIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1={12} y1={2} x2={12} y2={15} />
    </svg>
  );
}
