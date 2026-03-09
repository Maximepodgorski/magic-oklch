import { describe, it, expect } from "vitest";
import { parseColor, detectFormat, parseColorInput } from "../color-parser";

describe("parseColor", () => {
  it("parses hex color", () => {
    const result = parseColor("#ff0000");
    expect(result).not.toBeNull();
    expect(result!.l).toBeGreaterThan(0);
    expect(result!.c).toBeGreaterThan(0);
    expect(result!.h).toBeGreaterThan(0);
  });

  it("parses named color", () => {
    const result = parseColor("red");
    expect(result).not.toBeNull();
    expect(result!.l).toBeGreaterThan(0);
  });

  it("parses oklch string", () => {
    const result = parseColor("oklch(0.65 0.2 259)");
    expect(result).not.toBeNull();
    expect(result!.l).toBeCloseTo(0.65, 1);
    expect(result!.c).toBeCloseTo(0.2, 1);
    expect(result!.h).toBeCloseTo(259, 0);
  });

  it("parses hsl string", () => {
    const result = parseColor("hsl(200, 80%, 50%)");
    expect(result).not.toBeNull();
    expect(result!.h).toBeGreaterThan(0);
  });

  it("returns null for invalid input", () => {
    expect(parseColor("not-a-color-xyz")).toBeNull();
  });

  it("returns null for empty string", () => {
    expect(parseColor("")).toBeNull();
  });

  it("returns null for non-string input", () => {
    expect(parseColor(42)).toBeNull();
    expect(parseColor(null)).toBeNull();
    expect(parseColor(undefined)).toBeNull();
  });

  it("handles achromatic colors (gray) with h=0", () => {
    const result = parseColor("#808080");
    expect(result).not.toBeNull();
    expect(result!.h).toBe(0); // NaN hue → 0
    expect(result!.c).toBeCloseTo(0, 2);
  });
});

describe("detectFormat", () => {
  it("detects hex", () => {
    expect(detectFormat("#ff0000")).toBe("hex");
  });

  it("detects oklch", () => {
    expect(detectFormat("oklch(0.65 0.2 259)")).toBe("oklch");
  });

  it("detects hsl", () => {
    expect(detectFormat("hsl(200, 80%, 50%)")).toBe("hsl");
  });

  it("detects rgb", () => {
    expect(detectFormat("rgb(255, 0, 0)")).toBe("rgb");
  });

  it("detects named", () => {
    expect(detectFormat("red")).toBe("named");
  });

  it("returns unknown for unrecognized", () => {
    expect(detectFormat("123")).toBe("unknown");
  });
});

describe("parseColorInput", () => {
  it("returns full ColorInput object", () => {
    const result = parseColorInput("#ff0000");
    expect(result.raw).toBe("#ff0000");
    expect(result.format).toBe("hex");
    expect(result.parsed).not.toBeNull();
  });

  it("returns null parsed for invalid input", () => {
    const result = parseColorInput("garbage");
    expect(result.raw).toBe("garbage");
    expect(result.parsed).toBeNull();
  });
});
