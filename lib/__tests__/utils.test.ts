import { describe, it, expect } from "vitest";
import { clamp, normalizeHue, round } from "../utils";

describe("clamp", () => {
  it("returns value when within range", () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it("clamps to min", () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  it("clamps to max", () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it("handles equal min/max", () => {
    expect(clamp(5, 3, 3)).toBe(3);
  });
});

describe("normalizeHue", () => {
  it("returns hue within 0-360 unchanged", () => {
    expect(normalizeHue(180)).toBe(180);
  });

  it("wraps negative hue", () => {
    expect(normalizeHue(-10)).toBe(350);
  });

  it("wraps hue > 360", () => {
    expect(normalizeHue(370)).toBe(10);
  });

  it("returns 0 for 360", () => {
    expect(normalizeHue(360)).toBe(0);
  });

  it("handles large negative", () => {
    expect(normalizeHue(-720)).toBe(0);
  });
});

describe("round", () => {
  it("rounds to 3 decimals by default", () => {
    expect(round(1.23456)).toBe(1.235);
  });

  it("rounds to specified decimals", () => {
    expect(round(1.23456, 1)).toBe(1.2);
  });

  it("rounds to 0 decimals", () => {
    expect(round(1.7, 0)).toBe(2);
  });

  it("handles whole numbers", () => {
    expect(round(5, 2)).toBe(5);
  });
});
