"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Copy01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import type { ComponentPropsWithoutRef, ReactElement } from "react";

interface PreProps extends ComponentPropsWithoutRef<"pre"> {
  children: ReactElement<{ children: string }>;
}

export function Pre({ children, ...props }: PreProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const code = children?.props?.children ?? "";
    if (typeof code !== "string") return;

    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <div className="group relative my-6">
      <pre
        {...props}
        className="overflow-x-auto rounded-lg border border-border bg-muted/40 p-4 font-mono text-sm"
      >
        {children}
      </pre>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? "Copied" : "Copy code"}
        className="absolute right-3 top-3 rounded-md border border-border bg-background p-1.5 opacity-0 transition-opacity hover:bg-muted group-hover:opacity-100 focus-visible:opacity-100"
      >
        <HugeiconsIcon
          icon={copied ? CheckmarkCircle02Icon : Copy01Icon}
          size={14}
          strokeWidth={1.5}
          className={copied ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}
        />
      </button>
    </div>
  );
}
