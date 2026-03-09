"use client";

import { useCallback, useRef } from "react";
import { toast } from "@/components/ui/toast";

/**
 * Clipboard write with toast feedback and aria-live announcement.
 */
export function useCopy() {
  const liveRef = useRef<HTMLElement | null>(null);

  const copy = useCallback(async (value: string, label?: string) => {
    try {
      await navigator.clipboard.writeText(value);
      const msg = label ? `Copied ${label}` : `Copied ${value}`;
      toast.success(msg, { duration: 2000 });

      // Announce to screen readers
      const live = liveRef.current ?? document.getElementById("copy-live");
      if (live) live.textContent = msg;
    } catch {
      toast.danger("Copy not supported — select and copy manually", {
        duration: 3000,
      });
    }
  }, []);

  return { copy, liveRef };
}
