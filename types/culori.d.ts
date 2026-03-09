declare module "culori/fn" {
  export function parse(color: string): Color | undefined;
  export function converter(
    mode: string
  ): (color: Color | undefined) => Color | undefined;
  export function formatHex(color: Color | undefined): string;
  export function formatCss(color: Color | undefined): string;
  export function displayable(color: Color | Record<string, unknown>): boolean;
  export function inGamut(
    mode: string
  ): (color: Color | Record<string, unknown>) => boolean;
  export function toGamut(
    mode: string
  ): (color: Color | Record<string, unknown>) => Color;

  export function useMode(mode: unknown): void;
  export function useParser(parser: unknown): void;

  export const modeOklch: unknown;
  export const modeRgb: unknown;
  export const modeHsl: unknown;
  export const modeP3: unknown;
  export const parseHex: unknown;
  export const parseOklch: unknown;
  export const parseHsl: unknown;
  export const parseNamed: unknown;
  export const parseRgb: unknown;

  export interface Color {
    mode: string;
    l?: number;
    c?: number;
    h?: number;
    r?: number;
    g?: number;
    b?: number;
    s?: number;
    alpha?: number;
  }
}
