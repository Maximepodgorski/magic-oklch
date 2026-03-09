/**
 * Registers culori/fn modes and parsers.
 * Must be imported before any culori usage.
 *
 * culori's useMode/useParser are NOT React hooks — they are
 * registration functions that happen to share the "use" prefix.
 */
/* eslint-disable react-hooks/rules-of-hooks */
import {
  useMode,
  useParser,
  modeOklch,
  modeRgb,
  modeHsl,
  modeP3,
  parseHex,
  parseOklch,
  parseHsl,
  parseNamed,
  parseRgb,
} from "culori/fn";

useMode(modeOklch);
useMode(modeRgb);
useMode(modeHsl);
useMode(modeP3);
useParser(parseHex);
useParser(parseOklch);
useParser(parseHsl);
useParser(parseNamed);
useParser(parseRgb);
/* eslint-enable react-hooks/rules-of-hooks */
