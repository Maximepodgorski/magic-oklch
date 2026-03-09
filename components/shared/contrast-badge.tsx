import type { ContrastLevel } from "@/types/color";
import { Badge } from "@/components/ui/badge";

const LEVEL_VARIANT = {
  AAA: "success",
  AA: "brand",
  A: "warning",
  Fail: "danger",
} as const;

export function ContrastBadge({
  level,
  lc,
  className,
}: {
  level: ContrastLevel;
  lc: number;
  className?: string;
}) {
  return (
    <Badge
      variant={LEVEL_VARIANT[level]}
      size="sm"
      type="light"
      aria-label={`Contrast: ${level}, Lc ${lc}`}
      className={className}
    >
      {level} {lc}
    </Badge>
  );
}
