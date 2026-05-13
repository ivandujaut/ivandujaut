"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { HugeiconsIcon } from "@hugeicons/react";
import { Sun03Icon, Moon02Icon, ComputerIcon } from "@hugeicons/core-free-icons";
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
        <Button variant="ghost" size="icon" aria-label={t("label")}>
          <HugeiconsIcon icon={isDark ? Moon02Icon : Sun03Icon} size={18} strokeWidth={1.5} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <HugeiconsIcon icon={Sun03Icon} size={16} strokeWidth={1.5} />
          <span>{t("light")}</span>
          {theme === "light" && (
            <span aria-hidden className="ml-auto text-xs text-muted-foreground">
              ✓
            </span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <HugeiconsIcon icon={Moon02Icon} size={16} strokeWidth={1.5} />
          <span>{t("dark")}</span>
          {theme === "dark" && (
            <span aria-hidden className="ml-auto text-xs text-muted-foreground">
              ✓
            </span>
          )}
        </DropdownMenuItem>
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
