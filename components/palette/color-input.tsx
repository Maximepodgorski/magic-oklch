"use client";

import { useState, useCallback, useRef, useEffect, useId } from "react";
import { Input, InputField, InputLabel, InputHint } from "@/components/ui/input";
import { parseColor } from "@/lib/color-parser";

const DEBOUNCE_MS = 300;

export function ColorInput({
  defaultValue,
  onColorChange,
  className,
}: {
  defaultValue?: string;
  onColorChange: (color: string) => boolean;
  className?: string;
}) {
  const [value, setValue] = useState(defaultValue || "");
  const [error, setError] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const errorId = useId();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      setValue(raw);

      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        if (!raw.trim()) {
          setError(false);
          return;
        }

        const parsed = parseColor(raw);
        if (!parsed) {
          setError(true);
          return;
        }

        setError(false);
        onColorChange(raw);
      }, DEBOUNCE_MS);
    },
    [onColorChange]
  );

  // Cleanup
  useEffect(() => {
    return () => clearTimeout(debounceRef.current);
  }, []);

  return (
    <InputField className={className}>
      <InputLabel htmlFor="color-input">Base color</InputLabel>
      <Input
        id="color-input"
        variant={error ? "destructive" : "default"}
        size="md"
        value={value}
        onChange={handleChange}
        placeholder="#3b82f6 or oklch(0.65 0.2 259)"
        aria-invalid={error || undefined}
        aria-describedby={error ? errorId : undefined}
        autoComplete="off"
        spellCheck={false}
      />
      {error && (
        <InputHint id={errorId} variant="destructive">
          Invalid color format
        </InputHint>
      )}
    </InputField>
  );
}
