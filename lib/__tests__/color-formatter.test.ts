import { describe, it, expect } from "vitest";
import {
  formatColor,
  toHex,
  toCssOklch,
  toHslString,
} from "../color-formatter";
import type { OklchColor } from "@/types/color";

const blue: OklchColor = { l: 0.65, c: 0.2, h: 259 };
const red: OklchColor = { l: 0.628, c: 0.258, h: 29.23 };

describe("toHex", () => {
  it("returns a hex string starting with #", () => {
    const hex = toHex(blue);
    expect(hex).toMatch(/^#[0-9a-f]{6}$/);
  });

  it("is deterministic", () => {
    expect(toHex(blue)).toBe(toHex(blue));
  });
});

describe("toCssOklch", () => {
  it("returns oklch() format", () => {
    const css = toCssOklch(blue);
    expect(css).toMatch(/^oklch\([\d.]+ [\d.]+ [\d.]+\)$/);
  });

  it("includes correct values", () => {
    const css = toCssOklch(blue);
    expect(css).toContain("0.65");
    expect(css).toContain("0.2");
    expect(css).toContain("259");
  });
});

describe("toHslString", () => {
  it("returns hsl() format", () => {
    const hsl = toHslString(blue);
    expect(hsl).toMatch(/^hsl\([\d.]+, [\d.]+%, [\d.]+%\)$/);
  });
});

describe("formatColor", () => {
  it("formats as hex", () => {
    expect(formatColor(blue, "hex")).toMatch(/^#[0-9a-f]{6}$/);
  });

  it("formats as oklch", () => {
    expect(formatColor(blue, "oklch")).toContain("oklch(");
  });

  it("formats as hsl", () => {
    expect(formatColor(red, "hsl")).toContain("hsl(");
  });

  it("formats as cssvar with name and step", () => {
    expect(formatColor(blue, "cssvar", "blue", 500)).toBe("--color-blue-500");
  });

  it("cssvar returns empty without name", () => {
    expect(formatColor(blue, "cssvar")).toBe("");
  });
});
