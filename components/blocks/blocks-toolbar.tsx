/**
 * Blocks Toolbar — Neutral/Brand palette selectors with color dot previews.
 * Lives OUTSIDE the scoped CSS wrapper (toolbar itself uses app theme, not preview theme).
 */
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { BRAND_PALETTES, NEUTRAL_PALETTES, getStripeHex } from "@/data/all-palettes";
import type { Palette } from "@/types/color";

interface BlocksToolbarProps {
  brandId: string;
  neutralId: string;
  onBrandChange: (id: string) => void;
  onNeutralChange: (id: string) => void;
}

function PaletteDots({ paletteId }: { paletteId: string }) {
  const stripeHex = getStripeHex(paletteId);
  // Show 5 evenly spaced dots: indices 0, 2, 4, 6, 8 of the 11-shade stripe
  const dotIndices = [0, 2, 4, 6, 8];

  return (
    <div className="flex items-center gap-1">
      {dotIndices.map((idx) => (
        <span
          key={idx}
          className="inline-block size-3 rounded-full border border-[var(--border-default)]"
          style={{ backgroundColor: stripeHex[idx] ?? "#888" }}
        />
      ))}
    </div>
  );
}

function PaletteSelect({
  label,
  value,
  onChange,
  palettes,
}: {
  label: string;
  value: string;
  onChange: (id: string) => void;
  palettes: Palette[];
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-[var(--text-base-moderate)]">
        {label}
      </span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger size="md" className="w-auto min-w-[140px] gap-2">
          <div className="flex items-center gap-2">
            <PaletteDots paletteId={value} />
            <SelectValue />
          </div>
        </SelectTrigger>
        <SelectContent>
          {palettes.map((p) => (
            <SelectItem key={p.id} value={p.id}>
              {p.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function BlocksToolbar({
  brandId,
  neutralId,
  onBrandChange,
  onNeutralChange,
}: BlocksToolbarProps) {
  return (
    <div
      data-slot="blocks-toolbar"
      className="flex flex-wrap items-center gap-4"
    >
      <PaletteSelect
        label="Neutral"
        value={neutralId}
        onChange={onNeutralChange}
        palettes={NEUTRAL_PALETTES}
      />
      <PaletteSelect
        label="Brand"
        value={brandId}
        onChange={onBrandChange}
        palettes={BRAND_PALETTES}
      />
    </div>
  );
}
