import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function normalizeHue(hue: number): number {
  return ((hue % 360) + 360) % 360;
}

export function round(value: number, decimals: number = 3): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

/**
 * Generate constrained random palette parameters.
 */
export function generateRandomParams() {
  const h = round(Math.random() * 360, 1);
  const c = round(0.08 + Math.random() * 0.17, 3); // 0.08–0.25
  return { h, c };
}

/**
 * Human-readable hue label.
 */
export function getHueLabel(hue: number): string {
  if (hue < 15) return "Red";
  if (hue < 45) return "Orange";
  if (hue < 75) return "Yellow";
  if (hue < 105) return "Yellow-green";
  if (hue < 135) return "Green";
  if (hue < 165) return "Teal";
  if (hue < 195) return "Cyan";
  if (hue < 225) return "Sky blue";
  if (hue < 255) return "Blue";
  if (hue < 285) return "Indigo";
  if (hue < 315) return "Purple";
  if (hue < 345) return "Pink";
  return "Red";
}

/**
 * Human-readable chroma label.
 */
export function getChromaLabel(chroma: number): string {
  if (chroma < 0.05) return "near gray";
  if (chroma < 0.1) return "low saturation";
  if (chroma < 0.15) return "medium saturation";
  if (chroma < 0.22) return "high saturation";
  return "vivid";
}
