"use client";

import { useTranslations, useLocale } from "next-intl";
import { HugeiconsIcon } from "@hugeicons/react";
import { TranslateIcon } from "@hugeicons/core-free-icons";
import { useRouter, usePathname } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const PREFERENCE_COOKIE = "language-preference";

function setCookie(name: string, value: string, maxAgeSeconds: number) {
  document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${maxAgeSeconds}; path=/; samesite=lax`;
}

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();
  const t = useTranslations("common.language");

  function handleSelect(locale: "es" | "en") {
    if (locale === currentLocale) return;

    // Guardar preferencia para que el banner de sugerencia no aparezca más
    setCookie(PREFERENCE_COOKIE, locale, 60 * 60 * 24 * 365);

    // Navegar a la versión en el idioma elegido
    router.replace(pathname, { locale });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t("label")}>
          <HugeiconsIcon icon={TranslateIcon} size={18} strokeWidth={1.5} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleSelect("es")}>
          <span>{t("spanish")}</span>
          {currentLocale === "es" && (
            <span aria-hidden className="ml-auto text-xs text-muted-foreground">
              ✓
            </span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSelect("en")}>
          <span>{t("english")}</span>
          {currentLocale === "en" && (
            <span aria-hidden className="ml-auto text-xs text-muted-foreground">
              ✓
            </span>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
