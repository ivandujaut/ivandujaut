import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { NavLink } from "@/components/layout/nav-link";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { MobileNav } from "@/components/layout/mobile-nav";

const navLinks = [
  { href: "/", labelKey: "home" },
  { href: "/blog", labelKey: "blog" },
  { href: "/projects", labelKey: "projects" },
  { href: "/about", labelKey: "about" },
] as const;

export function Navbar() {
  const t = useTranslations("common.navigation");

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        {/* Logo / Nombre */}
        <Link
          href="/"
          className="font-mono text-sm font-medium tracking-tight hover:text-muted-foreground transition-colors"
        >
          ivandujaut
        </Link>

        {/* Links desktop */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              activeClassName="text-foreground"
            >
              {t(link.labelKey)}
            </NavLink>
          ))}
        </nav>

        {/* Acciones a la derecha */}
        <div className="flex items-center gap-1">
          <div className="hidden md:flex items-center gap-1">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
