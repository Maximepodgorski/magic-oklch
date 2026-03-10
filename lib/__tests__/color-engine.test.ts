import { describe, it, expect } from "vitest";
import { generatePalette, generatePaletteFromString } from "../color-engine";
import { SHADE_STEPS } from "@/types/color";
import type { OklchColor } from "@/types/color";

const blueBase: OklchColor = { l: 0.65, c: 0.2, h: 259 };

describe("generatePalette", () => {
  const palette = generatePalette(blueBase, "Blue");

  it("returns 12 shades", () => {
    expect(palette.shades).toHaveLength(12);
  });

  it("has all shade steps in order", () => {
    const steps = palette.shades!.map((s) => s.step);
    expect(steps).toEqual(SHADE_STEPS);
  });

  it("sets id as lowercase slug", () => {
    expect(palette.id).toBe("blue");
  });

  it("preserves base color hue and chroma", () => {
    expect(palette.baseColor.h).toBe(259);
    expect(palette.baseColor.c).toBe(0.2);
  });

  it("source is generated", () => {
    expect(palette.source).toBe("generated");
  });

  it("shade 50 is lightest, shade 950 is darkest", () => {
    const shade50 = palette.shades!.find((s) => s.step === 50)!;
    const shade950 = palette.shades!.find((s) => s.step === 950)!;
    expect(shade50.oklch.l).toBeGreaterThan(shade950.oklch.l);
  });

  it("every shade has hex, hsl, cssOklch", () => {
    for (const shade of palette.shades!) {
      expect(shade.hex).toMatch(/^#[0-9a-f]{6}$/);
      expect(shade.hsl).toContain("hsl(");
      expect(shade.cssOklch).toContain("oklch(");
    }
  });

  it("every shade has contrast data", () => {
    for (const shade of palette.shades!) {
      expect(shade.contrast.onWhite).toBeGreaterThanOrEqual(0);
      expect(shade.contrast.onBlack).toBeGreaterThanOrEqual(0);
      expect(["AAA", "AA", "A", "Fail"]).toContain(shade.contrast.level);
    }
  });

  it("every shade has gamut status", () => {
    for (const shade of palette.shades!) {
      expect(["srgb", "p3", "out"]).toContain(shade.gamut);
    }
  });

  it("generates cssVar correctly", () => {
    const shade500 = palette.shades!.find((s) => s.step === 500)!;
    expect(shade500.cssVar).toBe("--color-blue-500");
  });
});

describe("generatePalette — achromatic", () => {
  it("handles gray (hue=0, chroma=0)", () => {
    const gray: OklchColor = { l: 0.5, c: 0, h: 0 };
    const palette = generatePalette(gray, "Gray");
    expect(palette.shades).toHaveLength(12);
    // All chroma values should be 0
    for (const shade of palette.shades!) {
      expect(shade.oklch.c).toBe(0);
    }
  });
});

describe("generatePaletteFromString", () => {
  it("generates from hex string", () => {
    const palette = generatePaletteFromString("#3b82f6", "Blue");
    expect(palette).not.toBeNull();
    expect(palette!.shades).toHaveLength(12);
    expect(palette!.name).toBe("Blue");
  });

  it("generates from oklch string", () => {
    const palette = generatePaletteFromString("oklch(0.65 0.2 259)");
    expect(palette).not.toBeNull();
    expect(palette!.name).toBe("custom");
  });

  it("returns null for invalid color", () => {
    expect(generatePaletteFromString("not-a-color-xyz")).toBeNull();
  });
});
