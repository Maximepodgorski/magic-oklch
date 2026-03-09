import type { GamutStatus } from "@/types/color";
import { Badge } from "@/components/ui/badge";

export function GamutBadge({
  gamut,
  className,
}: {
  gamut: GamutStatus;
  className?: string;
}) {
  if (gamut === "srgb") return null;

  return (
    <Badge
      variant={gamut === "p3" ? "brand" : "danger"}
      size="sm"
      type="light"
      aria-label={gamut === "p3" ? "Display P3 gamut" : "Out of gamut"}
      className={className}
    >
      {gamut === "p3" ? "P3" : "Out"}
    </Badge>
  );
}
