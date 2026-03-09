export function PaletteSkeleton() {
  return (
    <div className="flex flex-col gap-[var(--layout-gap-2xl)] animate-pulse">
      {/* Input skeleton */}
      <div className="h-10 w-64 rounded-[var(--layout-radius-lg)] bg-surface-secondary" />

      {/* Header skeleton */}
      <div className="flex flex-col gap-[var(--layout-gap-sm)]">
        <div className="h-8 w-32 rounded-[var(--layout-radius-md)] bg-surface-secondary" />
        <div className="h-5 w-64 rounded-[var(--layout-radius-md)] bg-surface-secondary" />
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-2 gap-[var(--layout-gap-md)] sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-11">
        {Array.from({ length: 11 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-[var(--layout-gap-sm)] rounded-[var(--layout-radius-xl)] bg-surface-secondary p-[var(--layout-padding-sm)]"
          >
            <div className="h-16 w-full rounded-[var(--layout-radius-lg)] bg-surface-tertiary" />
            <div className="h-4 w-8 rounded bg-surface-tertiary" />
            <div className="h-4 w-full rounded bg-surface-tertiary" />
            <div className="h-5 w-12 rounded-full bg-surface-tertiary" />
          </div>
        ))}
      </div>
    </div>
  );
}
