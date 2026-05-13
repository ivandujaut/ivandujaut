"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

const PREFERENCE_COOKIE = "language-preference";
const DISMISSED_COOKIE = "language-banner-dismissed";

function detectBrowserLocale(): "es" | "en" | null {
  if (typeof navigator === "undefined") return null;
  const candidates = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const raw of candidates) {
    const lang = raw.toLowerCase().split("-")[0];
    if (routing.locales.includes(lang as "es" | "en")) {
      return lang as "es" | "en";
    }
  }
  return null;
}

const messages = {
  en: {
    text: "This site is also available in English.",
    accept: "Switch to English",
    dismiss: "Dismiss",
  },
  es: {
    text: "Este sitio también está disponible en español.",
    accept: "Cambiar a español",
    dismiss: "Cerrar",
  },
};

function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : undefined;
}

function setCookie(name: string, value: string, maxAgeSeconds: number) {
  document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${maxAgeSeconds}; path=/; samesite=lax`;
}

export function LanguageSuggestionBanner() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();
  const [suggestedLocale, setSuggestedLocale] = useState<"es" | "en" | null>(null);

  useEffect(() => {
    const preference = getCookie(PREFERENCE_COOKIE);
    const dismissed = getCookie(DISMISSED_COOKIE);

    // Si el usuario ya tomó una decisión, no mostramos el banner
    if (preference || dismissed) return;

    const browserLocale = detectBrowserLocale();
    if (browserLocale && browserLocale !== currentLocale) {
      // Reading navigator is a client-only operation that requires syncing
      // server-rendered state (null) with client state. This is the documented
      // pattern in React for hydration-safe client-only data.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSuggestedLocale(browserLocale);
    }
  }, [currentLocale]);

  if (!suggestedLocale) return null;

  const t = messages[suggestedLocale];

  function handleAccept() {
    if (!suggestedLocale) return;

    setCookie(PREFERENCE_COOKIE, suggestedLocale, 60 * 60 * 24 * 365);

    router.replace(pathname, { locale: suggestedLocale });
  }

  function handleDismiss() {
    setCookie(DISMISSED_COOKIE, "1", 60 * 60 * 24 * 30);
    setSuggestedLocale(null);
  }

  return (
    <div role="region" aria-label={t.text} className="border-b border-border bg-muted/40">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-2.5 text-sm">
        <p className="text-muted-foreground">{t.text}</p>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="default" onClick={handleAccept}>
            {t.accept}
          </Button>
          <Button size="sm" variant="ghost" onClick={handleDismiss} aria-label={t.dismiss}>
            <HugeiconsIcon icon={Cancel01Icon} size={16} strokeWidth={1.5} aria-hidden />
          </Button>
        </div>
      </div>
    </div>
  );
}
