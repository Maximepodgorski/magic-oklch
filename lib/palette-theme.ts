/**
 * Scoped CSS generation for the Blocks page.
 *
 * Generates CSS that overrides the 3-layer token system on a scoped wrapper element:
 *   Layer 1: Primitives (--root-color-brand-*, --root-color-neutral-*)
 *   Layer 2: Semantic tokens (light + dark mode blocks)
 *   Layer 3: Bridge tokens (--primary, --background, etc.)
 *
 * Source of truth for semantic token mappings: styles/lyse/semantic-colors.css
 * Source of truth for bridge token mappings: styles/lyse/shadcn-bridge.css
 */
// ---------------------------------------------------------------------------
// Shade step suffixes
// ---------------------------------------------------------------------------

const BRAND_SUFFIXES = ["050", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"];
const NEUTRAL_SUFFIXES = ["050", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"];

// ---------------------------------------------------------------------------
// Opacity alpha percentages (derived from root-colors.css hex alpha suffixes)
// ---------------------------------------------------------------------------

const BRAND_OPACITY_ALPHA: Record<string, number> = {
  "050": 2,
  "100": 3,
  "200": 5,
  "300": 8,
  "400": 13,
  "500": 21,
  "600": 34,
  "700": 55,
  "800": 80,
  "900": 100,
  "950": 100,
};

const NEUTRAL_OPACITY_ALPHA: Record<string, number> = {
  "050": 2,
  "100": 3,
  "200": 5,
  "300": 8,
  "400": 13,
  "500": 21,
  "600": 34,
  "700": 55,
  "800": 89,
  "900": 100,
  "950": 100,
};

// ---------------------------------------------------------------------------
// Brand semantic tokens (from semantic-colors.css)
// Only tokens that reference --root-color-brand-* or --root-opacity-brand-*
// ---------------------------------------------------------------------------

/** Light mode (:root) brand semantic tokens */
export const BRAND_SEMANTIC_TOKENS_LIGHT: Record<string, string> = {
  // Background
  "--background-selected": "var(--root-color-brand-050)",
  "--background-brand-bolder-default": "var(--root-color-brand-400)",
  "--background-brand-bolder-hover": "var(--root-color-brand-300)",
  "--background-brand-bolder-pressed": "var(--root-color-brand-300)",
  "--background-brand-faint-default": "var(--root-color-brand-050)",
  "--background-brand-faint-hover": "var(--root-color-brand-100)",
  "--background-brand-faint-pressed": "var(--root-color-brand-100)",
  "--background-brand-lighter-default": "var(--root-color-brand-100)",
  "--background-brand-lighter-hover": "var(--root-color-brand-200)",
  "--background-brand-lighter-pressed": "var(--root-color-brand-200)",
  "--background-brand-medium-default": "var(--root-color-brand-200)",
  "--background-brand-medium-hover": "var(--root-color-brand-300)",
  "--background-brand-medium-pressed": "var(--root-color-brand-300)",
  "--background-brand-moderate-default": "var(--root-color-brand-300)",
  "--background-brand-moderate-hover": "var(--root-color-brand-200)",
  "--background-brand-moderate-pressed": "var(--root-color-brand-200)",
  "--background-brand-strong-default": "var(--root-color-brand-500)",
  "--background-brand-strong-hover": "var(--root-color-brand-400)",
  "--background-brand-strong-pressed": "var(--root-color-brand-400)",
  // Border
  "--border-selected": "var(--root-color-brand-500)",
  "--border-brand-bolder": "var(--root-color-brand-400)",
  "--border-brand-lighter": "var(--root-color-brand-100)",
  "--border-brand-medium": "var(--root-color-brand-200)",
  "--border-brand-moderate": "var(--root-color-brand-300)",
  "--border-brand-strong": "var(--root-color-brand-500)",
  // Icon
  "--icon-selected": "var(--root-color-brand-500)",
  "--icon-brand-bolder": "var(--root-color-brand-600)",
  "--icon-brand-lighter": "var(--root-color-brand-050)",
  "--icon-brand-medium": "var(--root-color-brand-200)",
  "--icon-brand-moderate": "var(--root-color-brand-500)",
  "--icon-brand-strong": "var(--root-color-brand-800)",
  // Link
  "--link-primary-default": "var(--root-color-brand-500)",
  "--link-primary-hover": "var(--root-color-brand-400)",
  "--link-primary-pressed": "var(--root-color-brand-400)",
  "--link-primary-visited": "var(--root-color-brand-400)",
  // Overlay
  "--overlay-brand-default": "var(--root-opacity-brand-300)",
  // Shadow
  "--shadow-brand-bolder": "var(--root-opacity-brand-800)",
  "--shadow-brand-lighter": "var(--root-opacity-brand-200)",
  "--shadow-brand-medium": "var(--root-opacity-brand-400)",
  "--shadow-brand-moderate": "var(--root-opacity-brand-600)",
  "--shadow-brand-strong": "var(--root-opacity-brand-900)",
  // Text
  "--text-selected": "var(--root-color-brand-500)",
  "--text-brand-bolder": "var(--root-color-brand-800)",
  "--text-brand-lighter": "var(--root-color-brand-200)",
  "--text-brand-medium": "var(--root-color-brand-400)",
  "--text-brand-moderate": "var(--root-color-brand-500)",
  "--text-brand-strong": "var(--root-color-brand-950)",
};

/** Dark mode (.dark) brand semantic tokens */
export const BRAND_SEMANTIC_TOKENS_DARK: Record<string, string> = {
  // Background
  "--background-selected": "var(--root-color-brand-950)",
  "--background-brand-bolder-default": "var(--root-color-brand-600)",
  "--background-brand-bolder-hover": "var(--root-color-brand-700)",
  "--background-brand-bolder-pressed": "var(--root-color-brand-700)",
  "--background-brand-faint-default": "var(--root-color-brand-950)",
  "--background-brand-faint-hover": "var(--root-color-brand-900)",
  "--background-brand-faint-pressed": "var(--root-color-brand-900)",
  "--background-brand-lighter-default": "var(--root-color-brand-900)",
  "--background-brand-lighter-hover": "var(--root-color-brand-800)",
  "--background-brand-lighter-pressed": "var(--root-color-brand-800)",
  "--background-brand-medium-default": "var(--root-color-brand-800)",
  "--background-brand-medium-hover": "var(--root-color-brand-700)",
  "--background-brand-medium-pressed": "var(--root-color-brand-700)",
  "--background-brand-moderate-default": "var(--root-color-brand-700)",
  "--background-brand-moderate-hover": "var(--root-color-brand-800)",
  "--background-brand-moderate-pressed": "var(--root-color-brand-800)",
  "--background-brand-strong-default": "var(--root-color-brand-500)",
  "--background-brand-strong-hover": "var(--root-color-brand-600)",
  "--background-brand-strong-pressed": "var(--root-color-brand-600)",
  // Border
  "--border-selected": "var(--root-color-brand-500)",
  "--border-brand-bolder": "var(--root-color-brand-600)",
  "--border-brand-lighter": "var(--root-color-brand-900)",
  "--border-brand-medium": "var(--root-color-brand-800)",
  "--border-brand-moderate": "var(--root-color-brand-700)",
  "--border-brand-strong": "var(--root-color-brand-500)",
  // Icon
  "--icon-selected": "var(--root-color-brand-500)",
  "--icon-brand-bolder": "var(--root-color-brand-200)",
  "--icon-brand-lighter": "var(--root-color-brand-800)",
  "--icon-brand-medium": "var(--root-color-brand-600)",
  "--icon-brand-moderate": "var(--root-color-brand-500)",
  "--icon-brand-strong": "var(--root-color-brand-050)",
  // Link
  "--link-primary-default": "var(--root-color-brand-500)",
  "--link-primary-hover": "var(--root-color-brand-600)",
  "--link-primary-pressed": "var(--root-color-brand-600)",
  "--link-primary-visited": "var(--root-color-brand-600)",
  // Overlay
  "--overlay-brand-default": "var(--root-opacity-brand-400)",
  // Shadow
  "--shadow-brand-bolder": "var(--root-opacity-brand-800)",
  "--shadow-brand-lighter": "var(--root-opacity-brand-200)",
  "--shadow-brand-medium": "var(--root-opacity-brand-400)",
  "--shadow-brand-moderate": "var(--root-opacity-brand-600)",
  "--shadow-brand-strong": "var(--root-opacity-brand-900)",
  // Text
  "--text-selected": "var(--root-color-brand-500)",
  "--text-brand-bolder": "var(--root-color-brand-200)",
  "--text-brand-lighter": "var(--root-color-brand-800)",
  "--text-brand-medium": "var(--root-color-brand-600)",
  "--text-brand-moderate": "var(--root-color-brand-500)",
  "--text-brand-strong": "var(--root-color-brand-050)",
};

// ---------------------------------------------------------------------------
// Neutral semantic tokens (from semantic-colors.css)
// Only tokens that reference --root-color-neutral-* or --root-opacity-neutral-*
// Some tokens reference --root-color-base-white/black (mode-invariant, included)
// ---------------------------------------------------------------------------

/** Light mode (:root) neutral semantic tokens */
export const NEUTRAL_SEMANTIC_TOKENS_LIGHT: Record<string, string> = {
  // Background — Base
  "--background-base": "var(--root-color-neutral-050)",
  "--background-disabled": "var(--root-opacity-neutral-300)",
  "--background-elevated": "var(--root-color-neutral-050)",
  "--background-fixed": "var(--root-color-neutral-050)",
  // Background — Neutral
  "--background-neutral-bolder-default": "var(--root-color-neutral-300)",
  "--background-neutral-bolder-hover": "var(--root-color-neutral-200)",
  "--background-neutral-bolder-pressed": "var(--root-color-neutral-200)",
  "--background-neutral-faint-default": "var(--root-color-base-white)",
  "--background-neutral-faint-hover": "var(--root-color-neutral-100)",
  "--background-neutral-faint-pressed": "var(--root-color-neutral-200)",
  "--background-neutral-lighter-default": "var(--root-color-neutral-100)",
  "--background-neutral-lighter-hover": "var(--root-color-neutral-200)",
  "--background-neutral-lighter-pressed": "var(--root-color-neutral-300)",
  "--background-neutral-medium-default": "var(--root-color-neutral-100)",
  "--background-neutral-medium-hover": "var(--root-color-neutral-200)",
  "--background-neutral-medium-pressed": "var(--root-color-neutral-200)",
  "--background-neutral-moderate-default": "var(--root-color-neutral-200)",
  "--background-neutral-moderate-hover": "var(--root-color-neutral-100)",
  "--background-neutral-moderate-pressed": "var(--root-color-neutral-100)",
  "--background-neutral-strong-default": "var(--root-color-neutral-950)",
  "--background-neutral-strong-hover": "var(--root-color-neutral-900)",
  "--background-neutral-strong-pressed": "var(--root-color-neutral-800)",
  // Border
  "--border-base": "var(--root-color-base-white)",
  "--border-default": "var(--root-opacity-neutral-300)",
  "--border-disabled": "var(--root-opacity-neutral-100)",
  "--border-divider": "var(--root-opacity-neutral-300)",
  "--border-neutral-bolder": "var(--root-color-neutral-300)",
  "--border-neutral-lighter": "var(--root-color-neutral-050)",
  "--border-neutral-medium": "var(--root-color-neutral-100)",
  "--border-neutral-moderate": "var(--root-color-neutral-200)",
  "--border-neutral-strong": "var(--root-color-neutral-950)",
  // Icon
  "--icon-disabled": "var(--root-opacity-neutral-500)",
  "--icon-neutral-bolder": "var(--root-color-neutral-600)",
  "--icon-neutral-lighter": "var(--root-color-neutral-050)",
  "--icon-neutral-medium": "var(--root-color-neutral-200)",
  "--icon-neutral-moderate": "var(--root-color-neutral-400)",
  "--icon-neutral-strong": "var(--root-color-neutral-800)",
  // Overlay
  "--overlay-neutral-default": "var(--root-opacity-neutral-200)",
  // Text
  "--text-disabled": "var(--root-opacity-neutral-500)",
  "--text-fixed": "var(--root-color-neutral-050)",
  "--text-base-bolder": "var(--root-color-neutral-800)",
  "--text-base-lighter": "var(--root-color-neutral-200)",
  "--text-base-medium": "var(--root-color-neutral-400)",
  "--text-base-moderate": "var(--root-color-neutral-600)",
  "--text-base-strong": "var(--root-color-neutral-950)",
};

/** Dark mode (.dark) neutral semantic tokens */
export const NEUTRAL_SEMANTIC_TOKENS_DARK: Record<string, string> = {
  // Background — Base
  "--background-base": "var(--root-color-neutral-950)",
  "--background-disabled": "var(--root-opacity-inverse-200)",
  "--background-elevated": "var(--root-color-neutral-950)",
  "--background-fixed": "var(--root-color-neutral-050)",
  // Background — Neutral
  "--background-neutral-bolder-default": "var(--root-color-neutral-500)",
  "--background-neutral-bolder-hover": "var(--root-color-neutral-400)",
  "--background-neutral-bolder-pressed": "var(--root-color-neutral-400)",
  "--background-neutral-faint-default": "var(--root-color-neutral-900)",
  "--background-neutral-faint-hover": "var(--root-color-neutral-800)",
  "--background-neutral-faint-pressed": "var(--root-color-neutral-700)",
  "--background-neutral-lighter-default": "var(--root-color-neutral-800)",
  "--background-neutral-lighter-hover": "var(--root-color-neutral-700)",
  "--background-neutral-lighter-pressed": "var(--root-color-neutral-700)",
  "--background-neutral-medium-default": "var(--root-color-neutral-700)",
  "--background-neutral-medium-hover": "var(--root-color-neutral-600)",
  "--background-neutral-medium-pressed": "var(--root-color-neutral-600)",
  "--background-neutral-moderate-default": "var(--root-color-neutral-600)",
  "--background-neutral-moderate-hover": "var(--root-color-neutral-500)",
  "--background-neutral-moderate-pressed": "var(--root-color-neutral-500)",
  "--background-neutral-strong-default": "var(--root-color-neutral-050)",
  "--background-neutral-strong-hover": "var(--root-color-neutral-300)",
  "--background-neutral-strong-pressed": "var(--root-color-neutral-400)",
  // Border
  "--border-base": "var(--root-color-base-black)",
  "--border-default": "var(--root-opacity-inverse-300)",
  "--border-disabled": "var(--root-opacity-inverse-100)",
  "--border-divider": "var(--root-opacity-inverse-200)",
  "--border-neutral-bolder": "var(--root-color-neutral-600)",
  "--border-neutral-lighter": "var(--root-color-neutral-950)",
  "--border-neutral-medium": "var(--root-color-neutral-800)",
  "--border-neutral-moderate": "var(--root-color-neutral-700)",
  "--border-neutral-strong": "var(--root-color-neutral-050)",
  // Icon
  "--icon-disabled": "var(--root-opacity-inverse-500)",
  "--icon-neutral-bolder": "var(--root-color-neutral-200)",
  "--icon-neutral-lighter": "var(--root-color-neutral-800)",
  "--icon-neutral-medium": "var(--root-color-neutral-600)",
  "--icon-neutral-moderate": "var(--root-color-neutral-400)",
  "--icon-neutral-strong": "var(--root-color-neutral-050)",
  // Overlay
  "--overlay-neutral-default": "var(--root-opacity-inverse-300)",
  // Text
  "--text-disabled": "var(--root-opacity-inverse-500)",
  "--text-fixed": "var(--root-color-neutral-050)",
  "--text-base-bolder": "var(--root-color-neutral-200)",
  "--text-base-lighter": "var(--root-color-neutral-800)",
  "--text-base-medium": "var(--root-color-neutral-600)",
  "--text-base-moderate": "var(--root-color-neutral-400)",
  "--text-base-strong": "var(--root-color-neutral-050)",
};

// ---------------------------------------------------------------------------
// Bridge tokens (from shadcn-bridge.css)
// Split into brand-dependent and neutral-dependent
// ---------------------------------------------------------------------------

/** Bridge tokens that depend on brand semantic tokens */
export const BRAND_BRIDGE_TOKENS: Record<string, string> = {
  "--primary": "var(--background-brand-strong-default)",
  "--ring": "var(--border-selected)",
  "--chart-1": "var(--root-color-brand-500)",
  "--chart-5": "var(--root-color-brand-300)",
  "--sidebar-primary": "var(--background-brand-strong-default)",
  "--sidebar-ring": "var(--border-selected)",
};

/** Bridge tokens that depend on neutral semantic tokens */
export const NEUTRAL_BRIDGE_TOKENS: Record<string, string> = {
  "--background": "var(--background-base)",
  "--foreground": "var(--text-base-strong)",
  "--card": "var(--background-elevated)",
  "--card-foreground": "var(--text-base-strong)",
  "--popover": "var(--background-elevated)",
  "--popover-foreground": "var(--text-base-strong)",
  "--primary-foreground": "var(--root-color-base-white)",
  "--secondary": "var(--background-neutral-lighter-default)",
  "--secondary-foreground": "var(--text-base-strong)",
  "--muted": "var(--background-neutral-faint-default)",
  "--muted-foreground": "var(--text-base-moderate)",
  "--accent": "var(--background-neutral-lighter-default)",
  "--accent-foreground": "var(--text-base-strong)",
  "--border": "var(--border-default)",
  "--input": "var(--border-default)",
  "--sidebar": "var(--background-base)",
  "--sidebar-foreground": "var(--text-base-strong)",
  "--sidebar-accent": "var(--background-neutral-lighter-default)",
  "--sidebar-accent-foreground": "var(--text-base-strong)",
  "--sidebar-border": "var(--border-divider)",
};

// ---------------------------------------------------------------------------
// CSS generation helpers
// ---------------------------------------------------------------------------

function buildProps(tokens: Record<string, string>): string {
  return Object.entries(tokens)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join("\n");
}

function buildPrimitives(
  prefix: "brand" | "neutral",
  hexValues: string[]
): string {
  const suffixes = prefix === "brand" ? BRAND_SUFFIXES : NEUTRAL_SUFFIXES;

  return suffixes
    .map((suffix, i) => {
      const hex = hexValues[i] ?? "#000000";
      return `  --root-color-${prefix}-${suffix}: ${hex};`;
    })
    .join("\n");
}

function buildOpacity(
  prefix: "brand" | "neutral",
  hexValues: string[]
): string {
  const alphaMap =
    prefix === "brand" ? BRAND_OPACITY_ALPHA : NEUTRAL_OPACITY_ALPHA;
  // Use index 5 (shade 500) as the base color for opacity tokens
  const baseHex = hexValues[5] ?? "#000000";

  return Object.entries(alphaMap)
    .map(([suffix, alpha]) => {
      if (alpha === 100) {
        return `  --root-opacity-${prefix}-${suffix}: ${baseHex};`;
      }
      return `  --root-opacity-${prefix}-${suffix}: color-mix(in srgb, ${baseHex} ${alpha}%, transparent);`;
    })
    .join("\n");
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Generate scoped CSS for brand palette overrides.
 * Emits all 3 layers: primitives + semantic tokens (light/dark) + bridge tokens.
 *
 * @param scopeId - The useId() value used in [data-blocks-scope="scopeId"]
 * @param hexValues - Array of 11 hex strings (shades 050–950), e.g. from stripeHex
 */
export function brandScopeCss(scopeId: string, hexValues: string[]): string {
  if (hexValues.length === 0) return "";

  const sel = `[data-blocks-scope="${scopeId}"]`;
  const primitives = buildPrimitives("brand", hexValues);
  const opacity = buildOpacity("brand", hexValues);
  const bridge = buildProps(BRAND_BRIDGE_TOKENS);
  const lightSemantics = buildProps(BRAND_SEMANTIC_TOKENS_LIGHT);
  const darkSemantics = buildProps(BRAND_SEMANTIC_TOKENS_DARK);

  return [
    `${sel} {`,
    primitives,
    opacity,
    `}`,
    `:root:not(.dark) ${sel} {`,
    lightSemantics,
    bridge,
    `}`,
    `.dark ${sel} {`,
    darkSemantics,
    bridge,
    `}`,
  ].join("\n");
}

/**
 * Generate scoped CSS for neutral palette overrides.
 * Emits all 3 layers: primitives + semantic tokens (light/dark) + bridge tokens.
 *
 * @param scopeId - The useId() value used in [data-blocks-scope="scopeId"]
 * @param hexValues - Array of 11 hex strings (shades 050–950), e.g. from stripeHex
 */
export function neutralScopeCss(
  scopeId: string,
  hexValues: string[]
): string {
  if (hexValues.length === 0) return "";

  const sel = `[data-blocks-scope="${scopeId}"]`;
  const primitives = buildPrimitives("neutral", hexValues);
  const opacity = buildOpacity("neutral", hexValues);
  const bridge = buildProps(NEUTRAL_BRIDGE_TOKENS);
  const lightSemantics = buildProps(NEUTRAL_SEMANTIC_TOKENS_LIGHT);
  const darkSemantics = buildProps(NEUTRAL_SEMANTIC_TOKENS_DARK);

  return [
    `${sel} {`,
    primitives,
    opacity,
    `}`,
    `:root:not(.dark) ${sel} {`,
    lightSemantics,
    bridge,
    `}`,
    `.dark ${sel} {`,
    darkSemantics,
    bridge,
    `}`,
  ].join("\n");
}
