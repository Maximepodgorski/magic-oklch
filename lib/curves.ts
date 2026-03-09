import type { ShadeStep } from "@/types/color";
import { SHADE_STEPS } from "@/types/color";
import { normalizeHue } from "./utils";

/**
 * Non-linear lightness curve for 11 shades.
 * Based on Tailwind v4 observed distribution.
 */
export const SHADE_LIGHTNESS: Record<ShadeStep, number> = {
  50: 0.975,
  100: 0.94,
  200: 0.895,
  300: 0.83,
  400: 0.735,
  500: 0.65,
  600: 0.56,
  700: 0.48,
  800: 0.42,
  900: 0.37,
  950: 0.27,
};

/**
 * Chroma multiplier curve.
 * Peak at 500-600, tapers at extremes.
 */
export const CHROMA_MULTIPLIER: Record<ShadeStep, number> = {
  50: 0.1,
  100: 0.2,
  200: 0.4,
  300: 0.65,
  400: 0.85,
  500: 1.0,
  600: 1.05,
  700: 0.9,
  800: 0.75,
  900: 0.6,
  950: 0.4,
};

/**
 * Hue shift per shade (degrees).
 * Warm hues shift more. Light shades shift one way, dark the other.
 *
 * For cool hues (H>180): positive shift at light shades means
 * slight purple shift (higher H), matching Tailwind blue/indigo pattern.
 */
export function getHueShift(baseHue: number, shade: ShadeStep): number {
  const shadeIndex = SHADE_STEPS.indexOf(shade);
  const t = shadeIndex / (SHADE_STEPS.length - 1); // 0 (light) → 1 (dark)

  const isWarm = baseHue < 90 || baseHue > 300;
  const maxShift = isWarm ? 8 : 4;

  return (0.5 - t) * maxShift;
}

/**
 * Compute the final hue for a shade, with hue shift and normalization.
 */
export function getShadeHue(baseHue: number, shade: ShadeStep): number {
  if (isNaN(baseHue)) return 0;
  return normalizeHue(baseHue + getHueShift(baseHue, shade));
}
