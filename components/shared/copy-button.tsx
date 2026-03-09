"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useCopy } from "@/hooks/use-copy";

export function CopyButton({
  value,
  label,
  children,
  className,
  variant = "terciary",
  size = "xs",
}: {
  value: string;
  label?: string;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "terciary";
  size?: "xs" | "sm" | "md" | "lg";
}) {
  const { copy } = useCopy();
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await copy(value, label);
    setCopied(true);
    const timer = setTimeout(() => setCopied(false), 300);
    return () => clearTimeout(timer);
  }, [copy, value, label]);

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleCopy}
      className={className}
      aria-label={label ? `Copy ${label}` : `Copy ${value}`}
    >
      {copied ? <CheckIcon className="h-3.5 w-3.5" /> : children}
    </Button>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
