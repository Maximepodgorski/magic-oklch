import "./setup-culori";
import { displayable, inGamut, toGamut, converter } from "culori/fn";
import type { OklchColor, GamutStatus } from "@/types/color";

const toOklchMode = converter("oklch");

function toOklchObject(color: OklchColor) {
  return { mode: "oklch" as const, l: color.l, c: color.c, h: color.h || 0 };
}

/**
 * Check gamut status of an OKLCH color.
 * Checks on original OKLCH values (not post-conversion).
 */
export function getGamutStatus(color: OklchColor): GamutStatus {
  const oklchObj = toOklchObject(color);

  // Check sRGB first (tighter gamut)
  if (displayable(oklchObj)) return "srgb";

  // Check P3
  if (inGamut("p3")(oklchObj)) return "p3";

  // Outside both
  return "out";
}

/**
 * Map an OKLCH color to sRGB gamut.
 * Returns a new OklchColor that fits within sRGB.
 */
export function mapToSrgb(color: OklchColor): OklchColor {
  const oklchObj = toOklchObject(color);

  if (displayable(oklchObj)) return color;

  // toGamut("rgb") returns RGB-mode color — convert back to OKLCH
  const mapped = toGamut("rgb")(oklchObj);
  const oklchMapped = toOklchMode(mapped);

  if (oklchMapped) {
    return {
      l: oklchMapped.l ?? color.l,
      c: oklchMapped.c ?? 0,
      h: color.h, // preserve original hue
    };
  }

  // Fallback: clamp chroma aggressively
  return { ...color, c: Math.max(0, color.c * 0.8) };
}
