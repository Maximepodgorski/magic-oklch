import type { Palette, OklchColor } from "@/types/color";

/**
 * 22 Tailwind v4 palette base colors.
 * OKLCH values from official tailwindcss/theme.css (shade 500).
 *
 * Shades are generated on-demand by the color engine.
 * The catalogue stripe renders pre-computed hex values (see TAILWIND_STRIPE_COLORS).
 */

interface TailwindPaletteEntry {
  name: string;
  baseColor: OklchColor;
  /** Pre-computed hex values for the 11 shades (50-950) for catalogue stripe */
  stripeHex: string[];
}

export const TAILWIND_ENTRIES: TailwindPaletteEntry[] = [
  { name: "Red", baseColor: { l: 0.637, c: 0.237, h: 25.331 }, stripeHex: ["#fef2f2", "#fee2e2", "#fecaca", "#fca5a5", "#f87171", "#ef4444", "#dc2626", "#b91c1c", "#991b1b", "#7f1d1d", "#450a0a"] },
  { name: "Orange", baseColor: { l: 0.705, c: 0.213, h: 47.604 }, stripeHex: ["#fff7ed", "#ffedd5", "#fed7aa", "#fdba74", "#fb923c", "#f97316", "#ea580c", "#c2410c", "#9a3412", "#7c2d12", "#431407"] },
  { name: "Amber", baseColor: { l: 0.769, c: 0.188, h: 70.08 }, stripeHex: ["#fffbeb", "#fef3c7", "#fde68a", "#fcd34d", "#fbbf24", "#f59e0b", "#d97706", "#b45309", "#92400e", "#78350f", "#451a03"] },
  { name: "Yellow", baseColor: { l: 0.795, c: 0.184, h: 86.047 }, stripeHex: ["#fefce8", "#fef9c3", "#fef08a", "#fde047", "#facc15", "#eab308", "#ca8a04", "#a16207", "#854d0e", "#713f12", "#422006"] },
  { name: "Lime", baseColor: { l: 0.768, c: 0.233, h: 130.85 }, stripeHex: ["#f7fee7", "#ecfccb", "#d9f99d", "#bef264", "#a3e635", "#84cc16", "#65a30d", "#4d7c0f", "#3f6212", "#365314", "#1a2e05"] },
  { name: "Green", baseColor: { l: 0.723, c: 0.219, h: 149.579 }, stripeHex: ["#f0fdf4", "#dcfce7", "#bbf7d0", "#86efac", "#4ade80", "#22c55e", "#16a34a", "#15803d", "#166534", "#14532d", "#052e16"] },
  { name: "Emerald", baseColor: { l: 0.696, c: 0.17, h: 162.48 }, stripeHex: ["#ecfdf5", "#d1fae5", "#a7f3d0", "#6ee7b7", "#34d399", "#10b981", "#059669", "#047857", "#065f46", "#064e3b", "#022c22"] },
  { name: "Teal", baseColor: { l: 0.704, c: 0.14, h: 182.503 }, stripeHex: ["#f0fdfa", "#ccfbf1", "#99f6e4", "#5eead4", "#2dd4bf", "#14b8a6", "#0d9488", "#0f766e", "#115e59", "#134e4a", "#042f2e"] },
  { name: "Cyan", baseColor: { l: 0.715, c: 0.143, h: 215.221 }, stripeHex: ["#ecfeff", "#cffafe", "#a5f3fc", "#67e8f9", "#22d3ee", "#06b6d4", "#0891b2", "#0e7490", "#155e75", "#164e63", "#083344"] },
  { name: "Sky", baseColor: { l: 0.685, c: 0.169, h: 237.323 }, stripeHex: ["#f0f9ff", "#e0f2fe", "#bae6fd", "#7dd3fc", "#38bdf8", "#0ea5e9", "#0284c7", "#0369a1", "#075985", "#0c4a6e", "#082f49"] },
  { name: "Blue", baseColor: { l: 0.623, c: 0.214, h: 259.815 }, stripeHex: ["#eff6ff", "#dbeafe", "#bfdbfe", "#93c5fd", "#60a5fa", "#3b82f6", "#2563eb", "#1d4ed8", "#1e40af", "#1e3a8a", "#172554"] },
  { name: "Indigo", baseColor: { l: 0.585, c: 0.233, h: 277.117 }, stripeHex: ["#eef2ff", "#e0e7ff", "#c7d2fe", "#a5b4fc", "#818cf8", "#6366f1", "#4f46e5", "#4338ca", "#3730a3", "#312e81", "#1e1b4b"] },
  { name: "Violet", baseColor: { l: 0.606, c: 0.25, h: 292.717 }, stripeHex: ["#f5f3ff", "#ede9fe", "#ddd6fe", "#c4b5fd", "#a78bfa", "#8b5cf6", "#7c3aed", "#6d28d9", "#5b21b6", "#4c1d95", "#2e1065"] },
  { name: "Purple", baseColor: { l: 0.627, c: 0.265, h: 303.9 }, stripeHex: ["#faf5ff", "#f3e8ff", "#e9d5ff", "#d8b4fe", "#c084fc", "#a855f7", "#9333ea", "#7e22ce", "#6b21a8", "#581c87", "#3b0764"] },
  { name: "Fuchsia", baseColor: { l: 0.667, c: 0.295, h: 322.15 }, stripeHex: ["#fdf4ff", "#fae8ff", "#f5d0fe", "#f0abfc", "#e879f9", "#d946ef", "#c026d3", "#a21caf", "#86198f", "#701a75", "#4a044e"] },
  { name: "Pink", baseColor: { l: 0.656, c: 0.241, h: 354.308 }, stripeHex: ["#fdf2f8", "#fce7f3", "#fbcfe8", "#f9a8d4", "#f472b6", "#ec4899", "#db2777", "#be185d", "#9d174d", "#831843", "#500724"] },
  { name: "Rose", baseColor: { l: 0.645, c: 0.246, h: 16.439 }, stripeHex: ["#fff1f2", "#ffe4e6", "#fecdd3", "#fda4af", "#fb7185", "#f43f5e", "#e11d48", "#be123c", "#9f1239", "#881337", "#4c0519"] },
  { name: "Slate", baseColor: { l: 0.554, c: 0.046, h: 257.417 }, stripeHex: ["#f8fafc", "#f1f5f9", "#e2e8f0", "#cbd5e1", "#94a3b8", "#64748b", "#475569", "#334155", "#1e293b", "#0f172a", "#020617"] },
  { name: "Gray", baseColor: { l: 0.551, c: 0.027, h: 264.364 }, stripeHex: ["#f9fafb", "#f3f4f6", "#e5e7eb", "#d1d5db", "#9ca3af", "#6b7280", "#4b5563", "#374151", "#1f2937", "#111827", "#030712"] },
  { name: "Zinc", baseColor: { l: 0.552, c: 0.016, h: 285.938 }, stripeHex: ["#fafafa", "#f4f4f5", "#e4e4e7", "#d4d4d8", "#a1a1aa", "#71717a", "#52525b", "#3f3f46", "#27272a", "#18181b", "#09090b"] },
  { name: "Neutral", baseColor: { l: 0.556, c: 0, h: 0 }, stripeHex: ["#fafafa", "#f5f5f5", "#e5e5e5", "#d4d4d4", "#a3a3a3", "#737373", "#525252", "#404040", "#262626", "#171717", "#0a0a0a"] },
  { name: "Stone", baseColor: { l: 0.553, c: 0.013, h: 58.071 }, stripeHex: ["#fafaf9", "#f5f5f4", "#e7e5e4", "#d6d3d1", "#a8a29e", "#78716c", "#57534e", "#44403c", "#292524", "#1c1917", "#0c0a09"] },
];

/**
 * Convert entries to Palette objects for consumption by components.
 */
export const TAILWIND_PALETTES: Palette[] = TAILWIND_ENTRIES.map((entry) => ({
  id: entry.name.toLowerCase(),
  name: entry.name,
  source: "tailwind" as const,
  baseColor: entry.baseColor,
}));

/**
 * Get stripe hex colors for a Tailwind palette by id.
 */
export function getTailwindStripeHex(id: string): string[] | undefined {
  return TAILWIND_ENTRIES.find(
    (e) => e.name.toLowerCase() === id
  )?.stripeHex;
}
