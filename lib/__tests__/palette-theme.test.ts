import { describe, it, expect } from "vitest";
import {
  brandScopeCss,
  neutralScopeCss,
  BRAND_SEMANTIC_TOKENS_LIGHT,
  BRAND_SEMANTIC_TOKENS_DARK,
  NEUTRAL_SEMANTIC_TOKENS_LIGHT,
  NEUTRAL_SEMANTIC_TOKENS_DARK,
  BRAND_BRIDGE_TOKENS,
  NEUTRAL_BRIDGE_TOKENS,
} from "../palette-theme";
import { getStripeHex } from "@/data/all-palettes";

// Use real stripeHex values (canonical Tailwind reference)
const blueHex = getStripeHex("blue");
const slateHex = getStripeHex("slate");

const scopeId = ":r0:";

describe("brandScopeCss", () => {
  const css = brandScopeCss(scopeId, blueHex);

  it("returns a non-empty CSS string", () => {
    expect(css).toBeTruthy();
    expect(typeof css).toBe("string");
  });

  it("contains quoted scope selector for colon-containing IDs", () => {
    expect(css).toContain('[data-blocks-scope=":r0:"]');
  });

  // AC-3: Brand primitives
  it("emits all 11 brand primitive overrides (050-950)", () => {
    const steps = [
      "050", "100", "200", "300", "400", "500",
      "600", "700", "800", "900", "950",
    ];
    for (const step of steps) {
      expect(css).toContain(`--root-color-brand-${step}:`);
    }
  });

  it("uses hex values from the stripeHex array", () => {
    // blueHex[5] is shade 500
    expect(css).toContain(blueHex[5]);
  });

  // FH-2: Bridge tokens included
  it("emits bridge tokens (--primary, --ring, etc.)", () => {
    expect(css).toContain("--primary:");
    expect(css).toContain("--ring:");
    expect(css).toContain("--sidebar-primary:");
    expect(css).toContain("--sidebar-ring:");
    expect(css).toContain("--chart-1:");
  });

  // AC-6 + FH-1: Light/dark mode semantic tokens differ
  it("contains light-mode block with :root:not(.dark) selector", () => {
    expect(css).toContain(":root:not(.dark)");
  });

  it("contains dark-mode block with .dark selector", () => {
    expect(css).toContain('.dark [data-blocks-scope=":r0:"]');
  });

  it("light-mode semantics differ from dark-mode semantics", () => {
    expect(BRAND_SEMANTIC_TOKENS_LIGHT["--background-brand-bolder-default"]).toBe(
      "var(--root-color-brand-400)"
    );
    expect(BRAND_SEMANTIC_TOKENS_DARK["--background-brand-bolder-default"]).toBe(
      "var(--root-color-brand-600)"
    );
  });

  // Opacity tokens recomputed
  it("emits opacity tokens using color-mix()", () => {
    expect(css).toContain("--root-opacity-brand-");
    expect(css).toContain("color-mix(");
  });

  // Brand semantic tokens
  it("emits brand semantic tokens for light mode", () => {
    expect(css).toContain("--background-brand-strong-default:");
    expect(css).toContain("--border-selected:");
    expect(css).toContain("--icon-selected:");
    expect(css).toContain("--text-selected:");
    expect(css).toContain("--link-primary-default:");
  });

  it("emits brand semantic tokens for dark mode", () => {
    const darkBlockStart = css.indexOf(".dark");
    const darkBlock = css.slice(darkBlockStart);
    expect(darkBlock).toContain("--background-brand-strong-default:");
    expect(darkBlock).toContain("--background-selected:");
  });

  it("does NOT emit neutral primitives", () => {
    expect(css).not.toContain("--root-color-neutral-");
  });
});

describe("neutralScopeCss", () => {
  const css = neutralScopeCss(scopeId, slateHex);

  it("returns a non-empty CSS string", () => {
    expect(css).toBeTruthy();
    expect(typeof css).toBe("string");
  });

  // AC-4: Neutral primitives
  it("emits all 11 neutral primitive overrides (050-950)", () => {
    const steps = [
      "050", "100", "200", "300", "400", "500",
      "600", "700", "800", "900", "950",
    ];
    for (const step of steps) {
      expect(css).toContain(`--root-color-neutral-${step}:`);
    }
  });

  // Bridge tokens for neutral
  it("emits neutral bridge tokens (--background, --foreground, --card, etc.)", () => {
    expect(css).toContain("--background:");
    expect(css).toContain("--foreground:");
    expect(css).toContain("--card:");
    expect(css).toContain("--secondary:");
    expect(css).toContain("--muted:");
    expect(css).toContain("--accent:");
    expect(css).toContain("--border:");
    expect(css).toContain("--input:");
  });

  // Neutral semantic tokens
  it("emits neutral semantic tokens for light mode", () => {
    expect(css).toContain("--background-base:");
    expect(css).toContain("--background-neutral-faint-default:");
    expect(css).toContain("--text-base-strong:");
    expect(css).toContain("--border-default:");
  });

  // AC-6: Light/dark mode
  it("contains both light and dark mode blocks", () => {
    expect(css).toContain(":root:not(.dark)");
    expect(css).toContain(".dark");
  });

  it("light-mode semantics differ from dark-mode semantics", () => {
    expect(NEUTRAL_SEMANTIC_TOKENS_LIGHT["--background-base"]).toBe(
      "var(--root-color-neutral-050)"
    );
    expect(NEUTRAL_SEMANTIC_TOKENS_DARK["--background-base"]).toBe(
      "var(--root-color-neutral-950)"
    );
  });

  // Opacity tokens
  it("emits neutral opacity tokens using color-mix()", () => {
    expect(css).toContain("--root-opacity-neutral-");
    expect(css).toContain("color-mix(");
  });

  it("does NOT emit brand primitives", () => {
    expect(css).not.toContain("--root-color-brand-");
  });
});

describe("fallback behavior (AC-E1)", () => {
  it("brandScopeCss handles empty hex array gracefully", () => {
    expect(() => brandScopeCss(scopeId, [])).not.toThrow();
  });

  it("neutralScopeCss handles empty hex array gracefully", () => {
    expect(() => neutralScopeCss(scopeId, [])).not.toThrow();
  });
});

describe("custom brand pipeline (AC-2, AC-E1)", () => {
  it("generatePalette produces 12 shades, filtering step 975 yields 11 hex values", async () => {
    const { generatePalette } = await import("../color-engine");
    const palette = generatePalette({ l: 0.65, c: 0.214, h: 259 }, "custom");
    expect(palette.shades).toHaveLength(12);

    const hexValues = palette.shades!
      .filter((s) => s.step !== 975)
      .map((s) => s.hex);
    expect(hexValues).toHaveLength(11);
    hexValues.forEach((hex) => expect(hex).toMatch(/^#[0-9a-f]{6}$/i));
  });

  it("filtered custom hex produces valid brandScopeCss output", async () => {
    const { generatePalette } = await import("../color-engine");
    const palette = generatePalette({ l: 0.65, c: 0.214, h: 259 }, "custom");
    const hexValues = palette.shades!
      .filter((s) => s.step !== 975)
      .map((s) => s.hex);

    const css = brandScopeCss(scopeId, hexValues);
    expect(css).toContain("--root-color-brand-050:");
    expect(css).toContain("--root-color-brand-950:");
    expect(css).toContain("--primary:");
  });

  it("getStripeHex returns empty for unknown 'custom' id (fallback trigger)", () => {
    const hex = getStripeHex("custom");
    expect(hex).toEqual([]);
  });
});

describe("token data integrity", () => {
  it("brand light semantic tokens all reference --root-color-brand-* or --root-opacity-brand-*", () => {
    for (const [, value] of Object.entries(BRAND_SEMANTIC_TOKENS_LIGHT)) {
      expect(value).toMatch(/var\(--root-(color|opacity)-brand-/);
    }
  });

  it("brand dark semantic tokens all reference --root-color-brand-* or --root-opacity-brand-*", () => {
    for (const [, value] of Object.entries(BRAND_SEMANTIC_TOKENS_DARK)) {
      expect(value).toMatch(/var\(--root-(color|opacity)-brand-/);
    }
  });

  it("neutral light semantic tokens all reference --root-color-neutral-* or --root-opacity-neutral-* or --root-color-base-*", () => {
    for (const [, value] of Object.entries(NEUTRAL_SEMANTIC_TOKENS_LIGHT)) {
      expect(value).toMatch(
        /var\(--root-(color-neutral|opacity-neutral|color-base)-/
      );
    }
  });

  it("neutral dark semantic tokens all reference --root-color-neutral-* or --root-opacity-neutral-* or --root-color-base-* or --root-opacity-inverse-*", () => {
    for (const [, value] of Object.entries(NEUTRAL_SEMANTIC_TOKENS_DARK)) {
      expect(value).toMatch(
        /var\(--root-(color-neutral|opacity-neutral|color-base|opacity-inverse)-/
      );
    }
  });

  it("brand bridge tokens all reference brand-dependent semantic tokens", () => {
    for (const [, value] of Object.entries(BRAND_BRIDGE_TOKENS)) {
      expect(value).toMatch(
        /var\(--(background-brand|border-selected|root-color-brand|icon-selected|text-selected|link-primary|sidebar-primary|sidebar-ring)/
      );
    }
  });

  it("neutral bridge tokens all reference neutral-dependent semantic tokens", () => {
    for (const [, value] of Object.entries(NEUTRAL_BRIDGE_TOKENS)) {
      expect(value).toMatch(
        /var\(--(background-base|background-elevated|background-neutral|text-base|border-default|border-divider|root-color-base)/
      );
    }
  });
});
