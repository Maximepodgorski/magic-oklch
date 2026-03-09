declare module "apca-w3" {
  /**
   * Calculate APCA contrast between foreground and background.
   * Returns signed Lc value: positive for dark-on-light, negative for light-on-dark.
   * Range: approximately -108 to +108.
   */
  export function calcAPCA(
    foreground: string | number,
    background: string | number
  ): number;
}
