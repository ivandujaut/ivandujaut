"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { HugeiconsIcon } from "@hugeicons/react";
import { Menu01Icon } from "@hugeicons/core-free-icons";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";

const navLinks = [
  { href: "/", labelKey: "home" },
  { href: "/blog", labelKey: "blog" },
  { href: "/projects", labelKey: "projects" },
  { href: "/about", labelKey: "about" },
] as const;

export function MobileNav() {
  const t = useTranslations("common.navigation");
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden" aria-label={t("openMenu")}>
          <HugeiconsIcon icon={Menu01Icon} size={20} strokeWidth={1.5} />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[280px] data-[state=open]:duration-500 data-[state=closed]:duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in data-[state=closed]:fade-out data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right"
      >
        <SheetHeader>
          <SheetTitle className="text-left font-mono text-sm">ivandujaut</SheetTitle>
        </SheetHeader>

        <nav className="mt-6 flex flex-col gap-1 px-4">
          {navLinks.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              style={{ animationDelay: `${index * 50}ms` }}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors animate-in fade-in slide-in-from-right-2 duration-300 fill-mode-both"
            >
              {t(link.labelKey)}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-6 left-4 right-4 flex items-center justify-between border-t border-border pt-4 animate-in fade-in duration-500">
          <div className="flex items-center gap-1">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
