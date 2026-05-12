"use client";

import Link from "next/link";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon, Link04Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import type { ReactNode } from "react";

interface AnchorProps {
  id?: string;
  children: ReactNode;
}

interface MdxLinkProps {
  href?: string;
  children: ReactNode;
  className?: string;
}

export function Anchor({ id, children }: AnchorProps) {
  const [copied, setCopied] = useState(false);
  const t = useTranslations("common.mdx");

  if (!id) return <>{children}</>;

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();

    const url = `${window.location.origin}${window.location.pathname}#${id}`;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  return (
    <>
      {children}
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? t("linkCopied") : t("copyLink")}
        className="ml-2 inline-flex cursor-pointer items-center gap-1 align-middle opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
      >
        <HugeiconsIcon
          icon={copied ? CheckmarkCircle02Icon : Link04Icon}
          size={14}
          strokeWidth={1.5}
          className={
            copied
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-muted-foreground hover:text-foreground transition-colors"
          }
        />
        {copied && (
          <span className="font-mono text-xs font-normal text-emerald-600 dark:text-emerald-400">
            {t("linkCopied")}
          </span>
        )}
      </button>
    </>
  );
}

// MdxLink queda igual que antes
export function MdxLink({ href = "#", children, className, ...props }: MdxLinkProps) {
  const isExternal = href.startsWith("http");
  const isAnchor = href.startsWith("#");

  const baseClass =
    "underline decoration-muted-foreground/50 underline-offset-4 transition-colors hover:decoration-foreground";

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClass} inline-flex items-center gap-0.5 ${className ?? ""}`}
        {...props}
      >
        {children}
        <HugeiconsIcon
          icon={ArrowUpRight01Icon}
          size={12}
          strokeWidth={1.5}
          className="opacity-60"
        />
      </a>
    );
  }

  if (isAnchor) {
    return (
      <a href={href} className={`${baseClass} ${className ?? ""}`} {...props}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={`${baseClass} ${className ?? ""}`} {...props}>
      {children}
    </Link>
  );
}
