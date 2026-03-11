"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { BiDroplet } from "react-icons/bi";
import { PageHeader } from "@/components/layout/page-header";
import { HowItWorksModal } from "./how-it-works-modal";
import { ExtractedPaletteRow } from "./extracted-palette";
import { parseColorsParam, clusterByHue } from "@/lib/color-clusterer";
import {
  generateBookmarkletHref,
  PRODUCTION_BASE_URL,
} from "@/lib/bookmarklet";

function useBaseUrl() {
  if (typeof window === "undefined") return PRODUCTION_BASE_URL;
  return window.location.origin;
}

const COLOR_DOTS = [
  { color: "#2563EB", size: 12 },
  { color: "#3B82F6", size: 12 },
  { color: "#60A5FA", size: 12 },
  { color: "#22C55E", size: 14 },
  { color: "#4ADE80", size: 14 },
  { color: "#F59E0B", size: 16 },
  { color: "#EF4444", size: 16 },
  { color: "#A855F7", size: 14 },
  { color: "#EC4899", size: 14 },
  { color: "#06B6D4", size: 12 },
  { color: "#14B8A6", size: 12 },
] as const;

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex items-center rounded-[var(--layout-radius-sm)] border border-border bg-[var(--background-neutral-faint-default)] px-1.5 py-0.5 font-mono text-[11px] font-semibold text-muted-foreground tracking-wide">
      {children}
    </kbd>
  );
}

function BookmarkletButton({
  href,
}: {
  href: string;
}) {
  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault();
        alert(
          "Drag this button to your bookmarks bar — don't click it here!"
        );
      }}
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "copy";
        e.dataTransfer.setData("text/uri-list", href);
        e.dataTransfer.setData("text/plain", href);
      }}
      className="inline-flex w-fit items-center gap-2.5 rounded-[var(--layout-radius-xl)] border-2 border-dashed border-border bg-[var(--background-neutral-faint-default)] px-7 py-3.5 font-semibold text-[15px] text-foreground transition-all duration-300 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] hover:bg-[var(--background-neutral-faint-hover)] hover:-translate-y-1.5 hover:-rotate-3 hover:scale-[1.02] hover:shadow-xl cursor-grab active:cursor-grabbing active:translate-y-0 active:rotate-1 active:scale-100 active:shadow-none"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-[18px] shrink-0"
      >
        <path d="M6 0C9.31369 0 12 2.68631 12 6V18C12 21.3137 9.31369 24 6 24C2.68631 24 0 21.3137 0 18C0 14.6863 2.68631 12 6 12C2.68631 12 0 9.31369 0 6C0 2.68631 2.68631 0 6 0ZM18 12C14.6863 12 12 9.31369 12 6C12 2.68631 14.6863 0 18 0C21.3137 0 24 2.68631 24 6V18C24 21.3137 21.3137 24 18 24C14.6863 24 12 21.3137 12 18C12 14.6863 14.6863 12 18 12Z" />
      </svg>
      Steal colors
    </a>
  );
}

function ColorDotsStrip() {
  return (
    <div className="flex items-center justify-center gap-1.5">
      {COLOR_DOTS.map(({ color, size }, i) => (
        <span
          key={i}
          className="rounded-full transition-transform duration-300 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1.5"
          style={{
            width: size,
            height: size,
            backgroundColor: `${color}40`,
            border: `1.5px solid ${color}`,
          }}
        />
      ))}
    </div>
  );
}

function OnboardingSteps() {
  return (
    <div className="flex items-start gap-8">
      {/* Step 1 */}
      <div className="flex w-[200px] flex-col items-center gap-1.5">
        <div className="mb-0.5 flex size-8 items-center justify-center rounded-full border border-border bg-[var(--background-neutral-faint-default)]">
          <span className="text-[13px] font-semibold text-muted-foreground">1</span>
        </div>
        <span className="text-[13px] font-semibold text-foreground">Install bookmark</span>
        <span className="text-center text-xs leading-relaxed text-[var(--text-base-moderate)]">
          Show your bookmarks bar first:
        </span>
        <div className="flex items-center gap-1.5">
          <Kbd>⌘ Shift B</Kbd>
          <span className="text-[11px] text-[var(--text-base-moderate)]">or</span>
          <Kbd>Ctrl Shift B</Kbd>
        </div>
        <span className="text-[11px] text-[var(--text-base-moderate)]">Then drag the button above.</span>
      </div>

      {/* Step 2 */}
      <div className="flex w-[200px] flex-col items-center gap-1.5">
        <div className="mb-0.5 flex size-8 items-center justify-center rounded-full border border-border bg-[var(--background-neutral-faint-default)]">
          <span className="text-[13px] font-semibold text-muted-foreground">2</span>
        </div>
        <span className="text-[13px] font-semibold text-foreground">Visit any website</span>
        <span className="text-center text-xs leading-relaxed text-[var(--text-base-moderate)]">
          Go to any site whose colors you want to extract.
        </span>
      </div>

      {/* Step 3 */}
      <div className="flex w-[200px] flex-col items-center gap-1.5">
        <div className="mb-0.5 flex size-8 items-center justify-center rounded-full border border-border bg-[var(--background-neutral-faint-default)]">
          <span className="text-[13px] font-semibold text-muted-foreground">3</span>
        </div>
        <span className="text-[13px] font-semibold text-foreground">Click the bookmark</span>
        <span className="text-center text-xs leading-relaxed text-[var(--text-base-moderate)]">
          Colors are extracted and organized into OKLCH palettes.
        </span>
      </div>
    </div>
  );
}

export function StealShell() {
  const searchParams = useSearchParams();
  const colorsParam = searchParams.get("colors") || "";
  const baseUrl = useBaseUrl();

  const extracted = useMemo(
    () => parseColorsParam(colorsParam),
    [colorsParam]
  );
  const clusters = useMemo(() => clusterByHue(extracted), [extracted]);
  const bookmarkletHref = useMemo(
    () => generateBookmarkletHref(baseUrl),
    [baseUrl]
  );

  const hasColors = extracted.length > 0;

  if (!hasColors) {
    return (
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex flex-1 flex-col items-center justify-center gap-10 px-20">
          {/* Hero top */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-[10px] border border-border bg-[var(--background-neutral-faint-default)]">
              <BiDroplet size={24} className="text-foreground" />
            </div>
            <div className="flex flex-col items-center gap-1">
              <h1 className="font-[var(--font-family-heading)] text-[28px] font-semibold tracking-[-0.02em] text-foreground">
                Steal any website&apos;s colors
              </h1>
              <p className="text-[15px] text-muted-foreground">
                Extract a full color palette from any site with one click.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center gap-3">
            <BookmarkletButton href={bookmarkletHref} />
            <p className="text-[13px] text-[var(--text-base-moderate)]">
              Drag this button to your bookmarks bar
            </p>
          </div>

          {/* Color dots */}
          <ColorDotsStrip />

          {/* Steps */}
          <OnboardingSteps />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <PageHeader
          icon={BiDroplet}
          title="Steal"
          subtitle={`${extracted.length} color${extracted.length !== 1 ? "s" : ""} extracted`}
          rightContent={<HowItWorksModal />}
        />

        <div className="px-10 py-7">
          <div className="flex flex-col gap-8">
            {clusters.map((cluster) => (
              <ExtractedPaletteRow key={cluster.label} palette={cluster} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
