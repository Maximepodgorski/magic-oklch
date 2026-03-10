import { describe, it, expect } from "vitest";
import {
  SHADE_LIGHTNESS,
  CHROMA_MULTIPLIER,
  getHueShift,
  getShadeHue,
} from "../curves";
import { SHADE_STEPS } from "@/types/color";

describe("SHADE_LIGHTNESS", () => {
  it("has all 12 shade steps", () => {
    expect(Object.keys(SHADE_LIGHTNESS)).toHaveLength(12);
  });

  it("is monotonically decreasing (lighter → darker)", () => {
    for (let i = 1; i < SHADE_STEPS.length; i++) {
      expect(SHADE_LIGHTNESS[SHADE_STEPS[i]]).toBeLessThan(
        SHADE_LIGHTNESS[SHADE_STEPS[i - 1]]
      );
    }
  });

  it("shade 50 is near-white", () => {
    expect(SHADE_LIGHTNESS[50]).toBeGreaterThan(0.95);
  });

  it("shade 950 is near-black", () => {
    expect(SHADE_LIGHTNESS[950]).toBeLessThan(0.3);
  });
});

describe("CHROMA_MULTIPLIER", () => {
  it("peaks at 500-600", () => {
    const peak = Math.max(...SHADE_STEPS.map((s) => CHROMA_MULTIPLIER[s]));
    expect(CHROMA_MULTIPLIER[600]).toBe(peak);
  });

  it("tapers at extremes", () => {
    expect(CHROMA_MULTIPLIER[50]).toBeLessThan(CHROMA_MULTIPLIER[500]);
    expect(CHROMA_MULTIPLIER[950]).toBeLessThan(CHROMA_MULTIPLIER[500]);
  });
});

describe("getHueShift", () => {
  it("warm hues shift more than cool hues", () => {
    const warmShift = Math.abs(getHueShift(30, 50)); // red-orange
    const coolShift = Math.abs(getHueShift(200, 50)); // blue
    expect(warmShift).toBeGreaterThan(coolShift);
  });

  it("returns near-zero shift at mid-shade", () => {
    // 500 is near the middle of the 12-step scale
    expect(getHueShift(200, 500)).toBeCloseTo(0, 0);
  });

  it("light shades shift positive, dark shades shift negative", () => {
    expect(getHueShift(200, 50)).toBeGreaterThan(0); // light
    expect(getHueShift(200, 950)).toBeLessThan(0); // dark
  });
});

describe("getShadeHue", () => {
  it("returns 0 for NaN baseHue", () => {
    expect(getShadeHue(NaN, 500)).toBe(0);
  });

  it("wraps hue into 0-360", () => {
    const hue = getShadeHue(358, 50); // 358 + positive shift could exceed 360
    expect(hue).toBeGreaterThanOrEqual(0);
    expect(hue).toBeLessThan(360);
  });

  it("mid-shade returns approximately the base hue", () => {
    expect(getShadeHue(200, 500)).toBeCloseTo(200, 0);
  });
});
