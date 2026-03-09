"use client";

import { Input } from "@/components/ui/input";

type SourceFilter = "all" | "tailwind" | "curated";

export function CatalogueFilter({
  search,
  onSearchChange,
  source,
  onSourceChange,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  source: SourceFilter;
  onSourceChange: (value: SourceFilter) => void;
}) {
  return (
    <div className="flex flex-col gap-[var(--layout-gap-md)] sm:flex-row sm:items-center">
      <Input
        size="md"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search palettes..."
        aria-label="Search palettes"
        className="max-w-xs"
      />

      <div
        role="tablist"
        aria-label="Source filter"
        className="inline-flex items-center gap-[var(--layout-gap-xs)] rounded-[var(--layout-radius-lg)] bg-surface-secondary p-[var(--layout-padding-2xs)]"
      >
        {(["all", "tailwind", "curated"] as const).map((s) => (
          <button
            key={s}
            role="tab"
            aria-selected={source === s}
            onClick={() => onSourceChange(s)}
            className={`rounded-[var(--layout-radius-md)] px-[var(--layout-padding-md)] py-[var(--layout-padding-xs)] text-content-caption font-accent transition-colors cursor-pointer ${
              source === s
                ? "bg-surface-primary text-content-primary shadow-sm"
                : "text-content-secondary hover:text-content-primary"
            }`}
          >
            {s === "all" ? "All" : s === "tailwind" ? "Tailwind" : "Curated"}
          </button>
        ))}
      </div>
    </div>
  );
}
