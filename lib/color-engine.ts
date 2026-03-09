import type {
  OklchColor,
  Palette,
  PaletteShade,
  ShadeStep,
} from "@/types/color";
import { SHADE_STEPS } from "@/types/color";
import { SHADE_LIGHTNESS, CHROMA_MULTIPLIER, getShadeHue } from "./curves";
import { parseColor } from "./color-parser";
import { toHex, toCssOklch, toHslString, formatColor } from "./color-formatter";
import { getGamutStatus, mapToSrgb } from "./gamut";
import { getContrastPair, getBestContrastLevel } from "./contrast";
import { round } from "./utils";

/**
 * Generate a single shade from base color parameters.
 */
function generateShade(
  baseHue: number,
  baseChroma: number,
  step: ShadeStep,
  name: string
): PaletteShade {
  const l = SHADE_LIGHTNESS[step];
  const rawC = baseChroma * CHROMA_MULTIPLIER[step];
  const h = getShadeHue(baseHue, step);

  // Build the raw OKLCH color
  const oklch: OklchColor = { l, c: round(rawC), h: round(h) };

  // Check gamut before any mapping
  const gamut = getGamutStatus(oklch);

  // Map to sRGB for hex/hsl output (gamut-safe values)
  const srgbColor = mapToSrgb(oklch);

  // Compute contrast on the sRGB-mapped color (what the user actually sees)
  const { onWhite, onBlack } = getContrastPair(srgbColor);
  const level = getBestContrastLevel(onWhite, onBlack);

  return {
    step,
    oklch,
    hex: toHex(srgbColor),
    hsl: toHslString(srgbColor),
    cssOklch: toCssOklch(oklch),
    cssVar: formatColor(oklch, "cssvar", name, step),
    gamut,
    contrast: {
      onWhite: round(onWhite, 1),
      onBlack: round(onBlack, 1),
      level,
    },
  };
}

/**
 * Generate a complete 11-shade palette from an OklchColor.
 * Input L is discarded — lightness comes from the SHADE_LIGHTNESS curve.
 * Only hue and chroma from the input are used.
 */
export function generatePalette(
  baseColor: OklchColor,
  name: string
): Palette {
  const id = name.toLowerCase().replace(/\s+/g, "-");
  const safeHue = isNaN(baseColor.h) ? 0 : baseColor.h;

  const shades = SHADE_STEPS.map((step) =>
    generateShade(safeHue, baseColor.c, step, id)
  );

  return {
    id,
    name,
    source: "generated",
    baseColor: { l: baseColor.l, c: baseColor.c, h: safeHue },
    shades,
  };
}

/**
 * Generate a palette from any CSS color string.
 * Convenience wrapper: parse → generate.
 */
export function generatePaletteFromString(
  color: string,
  name?: string
): Palette | null {
  const parsed = parseColor(color);
  if (!parsed) return null;

  const paletteName = name || "custom";
  return generatePalette(parsed, paletteName);
}
