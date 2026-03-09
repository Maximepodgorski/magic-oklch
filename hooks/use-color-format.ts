"use client";

import { useState, useCallback, useSyncExternalStore } from "react";
import type { ColorFormat } from "@/types/color";

const STORAGE_KEY = "color-format";
const DEFAULT_FORMAT: ColorFormat = "hex";
const VALID_FORMATS: ColorFormat[] = ["hex", "oklch", "hsl", "cssvar"];

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * Color format preference stored in localStorage.
 * Returns null on server / before mount to avoid hydration mismatch.
 */
export function useColorFormat() {
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const [format, setFormatState] = useState<ColorFormat>(() => {
    if (typeof window === "undefined") return DEFAULT_FORMAT;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && VALID_FORMATS.includes(stored as ColorFormat)) {
      return stored as ColorFormat;
    }
    return DEFAULT_FORMAT;
  });

  const setFormat = useCallback((f: ColorFormat) => {
    setFormatState(f);
    try {
      localStorage.setItem(STORAGE_KEY, f);
    } catch {
      // localStorage unavailable
    }
  }, []);

  return {
    format: mounted ? format : DEFAULT_FORMAT,
    setFormat,
    mounted,
  };
}
