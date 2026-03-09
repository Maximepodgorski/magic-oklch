import "./setup-culori";
import { formatHex, converter } from "culori/fn";
import type { OklchColor, ColorFormat } from "@/types/color";
import { round } from "./utils";

const toRgb = converter("rgb");
const toHsl = converter("hsl");

function toOklchObject(color: OklchColor) {
  return { mode: "oklch" as const, l: color.l, c: color.c, h: color.h || 0 };
}

/**
 * Format an OklchColor to the specified output format.
 */
export function formatColor(
  color: OklchColor,
  format: ColorFormat,
  name?: string,
  step?: number
): string {
  const oklchObj = toOklchObject(color);

  switch (format) {
    case "hex": {
      const rgb = toRgb(oklchObj);
      return formatHex(rgb);
    }
    case "oklch": {
      return `oklch(${round(color.l)} ${round(color.c)} ${round(color.h || 0)})`;
    }
    case "hsl": {
      const hsl = toHsl(oklchObj);
      if (!hsl) return "";
      const h = round(hsl.h || 0, 1);
      const s = round((hsl.s || 0) * 100, 1);
      const l = round((hsl.l || 0) * 100, 1);
      return `hsl(${h}, ${s}%, ${l}%)`;
    }
    case "cssvar": {
      if (!name || step === undefined) return "";
      return `--color-${name}-${step}`;
    }
  }
}

/**
 * Get hex string from OklchColor.
 */
export function toHex(color: OklchColor): string {
  return formatColor(color, "hex");
}

/**
 * Get CSS oklch string from OklchColor.
 */
export function toCssOklch(color: OklchColor): string {
  return formatColor(color, "oklch");
}

/**
 * Get HSL string from OklchColor.
 */
export function toHslString(color: OklchColor): string {
  return formatColor(color, "hsl");
}
