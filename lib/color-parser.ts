import "./setup-culori";
import { parse, converter } from "culori/fn";
import type { OklchColor, ColorInput } from "@/types/color";

const toOklch = converter("oklch");

/**
 * Parse any CSS color string into OklchColor.
 * Returns null for invalid input (never throws).
 */
export function parseColor(input: unknown): OklchColor | null {
  if (typeof input !== "string" || !input.trim()) return null;

  try {
    const parsed = parse(input.trim());
    if (!parsed) return null;

    const oklch = toOklch(parsed);
    if (!oklch) return null;

    return {
      l: oklch.l ?? 0,
      c: oklch.c ?? 0,
      h: oklch.h == null || isNaN(oklch.h) ? 0 : oklch.h,
    };
  } catch {
    return null;
  }
}

/**
 * Detect the format of a color input string.
 */
export function detectFormat(
  input: string
): ColorInput["format"] {
  const trimmed = input.trim().toLowerCase();
  if (trimmed.startsWith("#")) return "hex";
  if (trimmed.startsWith("oklch")) return "oklch";
  if (trimmed.startsWith("hsl")) return "hsl";
  if (trimmed.startsWith("rgb")) return "rgb";
  if (/^[a-z]+$/.test(trimmed)) return "named";
  return "unknown";
}

/**
 * Parse input into a full ColorInput object.
 */
export function parseColorInput(raw: string): ColorInput {
  return {
    raw,
    parsed: parseColor(raw),
    format: detectFormat(raw),
  };
}
