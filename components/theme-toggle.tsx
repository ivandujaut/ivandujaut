"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { HugeiconsIcon } from "@hugeicons/react";
import { ComputerIcon, Sun03Icon } from "@hugeicons/core-free-icons";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import { Sun } from "@/components/animate-ui/icons/sun";
import { Moon } from "@/components/animate-ui/icons/moon";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("common.theme");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    // Antes de hidratar no sabemos el tema resuelto: usamos el icono estático
    // para no montar `motion` en el árbol crítico ni animar en el primer paint.
    return (
      <Button variant="ghost" size="icon" disabled aria-label={t("label")}>
        <HugeiconsIcon icon={Sun03Icon} size={18} strokeWidth={1.5} />
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* `AnimateIcon asChild` mueve el trigger de la animación al botón
            entero: el icono mide 18px dentro de un target de 36px, así que
            animar solo al pasar por el SVG dejaría media zona muerta. */}
        <AnimateIcon animateOnHover asChild>
          <Button variant="ghost" size="icon" aria-label={t("label")}>
            {isDark ? <Moon size={18} strokeWidth={1.5} /> : <Sun size={18} strokeWidth={1.5} />}
          </Button>
        </AnimateIcon>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <AnimateIcon animateOnHover asChild>
          <DropdownMenuItem onClick={() => setTheme("light")}>
            <Sun size={16} strokeWidth={1.5} />
            <span>{t("light")}</span>
            {theme === "light" && (
              <span aria-hidden className="ml-auto text-xs text-muted-foreground">
                ✓
              </span>
            )}
          </DropdownMenuItem>
        </AnimateIcon>
        <AnimateIcon animateOnHover asChild>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            <Moon size={16} strokeWidth={1.5} />
            <span>{t("dark")}</span>
            {theme === "dark" && (
              <span aria-hidden className="ml-auto text-xs text-muted-foreground">
                ✓
              </span>
            )}
          </DropdownMenuItem>
        </AnimateIcon>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <HugeiconsIcon icon={ComputerIcon} size={16} strokeWidth={1.5} />
          <span>{t("system")}</span>
          {theme === "system" && (
            <span aria-hidden className="ml-auto text-xs text-muted-foreground">
              ✓
            </span>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
