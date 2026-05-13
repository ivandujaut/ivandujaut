"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { HugeiconsIcon } from "@hugeicons/react";
import { Copy01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";

interface ShareLinkButtonProps {
  url?: string;
  className?: string;
  /**
   * Si es `true`, el label se muestra en todos los breakpoints.
   * Por defecto el label se oculta en mobile (`< sm:`) y aparece desde `sm:`.
   */
  alwaysShowLabel?: boolean;
}

export function ShareLinkButton({ url, className, alwaysShowLabel = false }: ShareLinkButtonProps) {
  const [copied, setCopied] = useState(false);
  const t = useTranslations("common.share");

  async function handleClick() {
    try {
      const target = url ?? window.location.href;
      await navigator.clipboard.writeText(target);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy share link:", error);
    }
  }

  const label = copied ? t("copied") : t("label");

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={label}
      className={`inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:bg-muted ${className ?? ""}`.trim()}
    >
      <HugeiconsIcon
        icon={copied ? CheckmarkCircle02Icon : Copy01Icon}
        size={14}
        strokeWidth={1.5}
        aria-hidden
        className={copied ? "text-emerald-600 dark:text-emerald-400" : undefined}
      />
      <span className={alwaysShowLabel ? "inline" : "hidden sm:inline"}>{label}</span>
    </button>
  );
}
