"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { HugeiconsIcon } from "@hugeicons/react";
import { Copy01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

interface PreProps extends ComponentPropsWithoutRef<"pre"> {
  children: ReactNode;
}

/**
 * Code block wrapper with a copy-to-clipboard affordance.
 *
 * The button is discoverable at low opacity by default (so mobile and desktop
 * users find it), full opacity on hover/focus, and confirms with a green
 * checkmark icon for 2 seconds after a successful copy.
 *
 * Implementation note: rehype-pretty-code transforms the code into a tree of
 * highlighted spans, so reading `children.props.children` as a string fails.
 * Instead we read `innerText` off the rendered `<pre>` via ref — works
 * regardless of how the children were transformed.
 */
export function Pre({ children, ...props }: PreProps) {
  const t = useTranslations("common.mdx");
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const code = preRef.current?.innerText ?? "";
    if (!code) return;

    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const label = copied ? t("codeCopied") : t("copyCode");

  return (
    <div className="group relative my-6">
      <pre
        ref={preRef}
        {...props}
        className="overflow-x-auto rounded-lg border border-border bg-muted/40 p-4 pr-14 font-mono text-sm"
      >
        {children}
      </pre>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={label}
        aria-live="polite"
        className={`absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-md border transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
          copied
            ? "border-emerald-500/40 bg-emerald-50 text-emerald-700 opacity-100 dark:bg-emerald-950/40 dark:text-emerald-300"
            : "border-border bg-background/80 text-muted-foreground opacity-70 backdrop-blur-sm hover:bg-muted hover:text-foreground hover:opacity-100 focus-visible:opacity-100 group-hover:opacity-100"
        }`}
      >
        <HugeiconsIcon
          icon={copied ? CheckmarkCircle02Icon : Copy01Icon}
          size={16}
          strokeWidth={1.5}
          aria-hidden
        />
      </button>
    </div>
  );
}
