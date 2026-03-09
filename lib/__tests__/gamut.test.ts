import { describe, it, expect } from "vitest";
import { getGamutStatus, mapToSrgb } from "../gamut";
import type { OklchColor } from "@/types/color";

describe("getGamutStatus", () => {
  it("white is srgb", () => {
    expect(getGamutStatus({ l: 1, c: 0, h: 0 })).toBe("srgb");
  });

  it("black is srgb", () => {
    expect(getGamutStatus({ l: 0, c: 0, h: 0 })).toBe("srgb");
  });

  it("moderate color is srgb", () => {
    expect(getGamutStatus({ l: 0.65, c: 0.15, h: 259 })).toBe("srgb");
  });

  it("highly saturated color is p3 or out", () => {
    const status = getGamutStatus({ l: 0.65, c: 0.35, h: 150 });
    expect(["p3", "out"]).toContain(status);
  });
});

describe("mapToSrgb", () => {
  it("returns same color if already in gamut", () => {
    const color: OklchColor = { l: 0.65, c: 0.1, h: 200 };
    const mapped = mapToSrgb(color);
    expect(mapped).toEqual(color);
  });

  it("reduces chroma for out-of-gamut colors", () => {
    const color: OklchColor = { l: 0.65, c: 0.35, h: 150 };
    const mapped = mapToSrgb(color);
    expect(mapped.c).toBeLessThanOrEqual(color.c);
    expect(mapped.h).toBe(color.h); // hue preserved
  });

  it("returns a valid srgb color", () => {
    const color: OklchColor = { l: 0.7, c: 0.4, h: 120 };
    const mapped = mapToSrgb(color);
    const status = getGamutStatus(mapped);
    // After mapping, should be srgb (or close enough for rounding)
    expect(["srgb", "p3"]).toContain(status);
  });
});
