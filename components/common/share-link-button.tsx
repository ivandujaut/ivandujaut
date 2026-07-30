"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { HugeiconsIcon } from "@hugeicons/react";
import { Share08Icon, LinkedinIcon, Mail01Icon, NewTwitterIcon } from "@hugeicons/core-free-icons";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import { Check } from "@/components/animate-ui/icons/check";
import { Copy } from "@/components/animate-ui/icons/copy";

interface ShareLinkButtonProps {
  url?: string;
  title?: string;
  className?: string;
  /**
   * Si es `true`, el label se muestra en todos los breakpoints.
   * Por defecto el label se oculta en mobile (`< sm:`) y aparece desde `sm:`.
   */
  alwaysShowLabel?: boolean;
}

/**
 * Botón de compartir híbrido:
 * - Si el browser soporta `navigator.share` (mobile + algunos desktop), usa
 *   el share sheet nativo del sistema.
 * - Si no, abre un popover con X, LinkedIn, Email y "copiar enlace".
 *
 * El estado de "copiado" sigue mostrándose con un checkmark verde para feedback
 * inmediato cuando el usuario elige "copiar enlace" desde el popover o cuando
 * el navegador no permite share nativo y caemos al copy directo.
 */
export function ShareLinkButton({
  url,
  title,
  className,
  alwaysShowLabel = false,
}: ShareLinkButtonProps) {
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const firstItemRef = useRef<HTMLAnchorElement>(null);
  const t = useTranslations("common.share");

  useEffect(() => {
    if (!menuOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen) firstItemRef.current?.focus();
  }, [menuOpen]);

  const resolveUrl = useCallback(
    () => url ?? (typeof window !== "undefined" ? window.location.href : ""),
    [url],
  );

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(resolveUrl());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy share link:", error);
    }
  }, [resolveUrl]);

  async function handleTriggerClick() {
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({ url: resolveUrl(), title, text: title });
        return;
      } catch (error) {
        if ((error as DOMException)?.name === "AbortError") return;
        // Si falla por motivo distinto a cancelación, caemos al popover.
      }
    }
    setMenuOpen((open) => !open);
  }

  const shareUrl = resolveUrl();
  const triggerLabel = copied ? t("copied") : t("label");
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title ?? "");
  const encodedSubject = encodeURIComponent(title ?? t("emailSubject"));

  const xHref = `https://twitter.com/intent/tweet?url=${encodedUrl}${
    title ? `&text=${encodedTitle}` : ""
  }`;
  const linkedinHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  const mailtoHref = `mailto:?subject=${encodedSubject}&body=${encodedUrl}`;

  return (
    <div ref={containerRef} className={`relative inline-block ${className ?? ""}`.trim()}>
      <button
        ref={triggerRef}
        type="button"
        onClick={handleTriggerClick}
        aria-label={triggerLabel}
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:bg-muted"
      >
        {copied ? (
          <Check
            size={14}
            strokeWidth={1.5}
            animate
            aria-hidden
            className="text-emerald-600 dark:text-emerald-400"
          />
        ) : (
          <HugeiconsIcon icon={Share08Icon} size={14} strokeWidth={1.5} aria-hidden />
        )}
        <span className={alwaysShowLabel ? "inline" : "hidden sm:inline"}>{triggerLabel}</span>
      </button>

      {menuOpen && (
        <div
          role="menu"
          aria-label={t("menuLabel")}
          className="absolute right-0 z-20 mt-2 min-w-48 overflow-hidden rounded-md border border-border bg-background shadow-md"
        >
          <a
            ref={firstItemRef}
            role="menuitem"
            href={xHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-muted focus:bg-muted focus:outline-none"
          >
            <HugeiconsIcon icon={NewTwitterIcon} size={14} strokeWidth={1.5} aria-hidden />
            <span>{t("shareOnX")}</span>
          </a>
          <a
            role="menuitem"
            href={linkedinHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-muted focus:bg-muted focus:outline-none"
          >
            <HugeiconsIcon icon={LinkedinIcon} size={14} strokeWidth={1.5} aria-hidden />
            <span>{t("shareOnLinkedIn")}</span>
          </a>
          <a
            role="menuitem"
            href={mailtoHref}
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-muted focus:bg-muted focus:outline-none"
          >
            <HugeiconsIcon icon={Mail01Icon} size={14} strokeWidth={1.5} aria-hidden />
            <span>{t("shareByEmail")}</span>
          </a>
          <AnimateIcon animateOnHover asChild>
            <button
              type="button"
              role="menuitem"
              onClick={async () => {
                await copyToClipboard();
                setMenuOpen(false);
              }}
              className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-muted focus:bg-muted focus:outline-none"
            >
              <Copy size={14} strokeWidth={1.5} aria-hidden />
              <span>{t("copyLink")}</span>
            </button>
          </AnimateIcon>
        </div>
      )}
    </div>
  );
}
