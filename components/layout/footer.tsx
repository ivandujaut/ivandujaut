import { useLocale, useTranslations } from "next-intl";
import { HugeiconsIcon } from "@hugeicons/react";
import { GithubIcon, LinkedinIcon, Mail01Icon, RssIcon } from "@hugeicons/core-free-icons";
import { ObfuscatedEmailTrigger } from "@/components/common/obfuscated-email-trigger";
import { localePath } from "@/lib/seo";

const socialLinks = [
  {
    href: "https://github.com/ivandujaut",
    label: "GitHub",
    icon: GithubIcon,
  },
  {
    href: "https://www.linkedin.com/in/ivan-dujaut/",
    label: "LinkedIn",
    icon: LinkedinIcon,
  },
];

export function Footer() {
  const t = useTranslations("common.footer");
  const tA11y = useTranslations("common.a11y");
  const locale = useLocale() as "es" | "en";
  const currentYear = new Date().getFullYear();
  const newTabLabel = tA11y("opensInNewTab");

  return (
    <footer className="mt-24 border-t border-border/40">
      {/* Dos filas y no tres columnas: alineado a la columna del contenido
          (max-w-2xl) no entran copyright + links + iconos en una sola línea. */}
      <div className="mx-auto flex max-w-2xl flex-col gap-4 px-6 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {currentYear} <span aria-hidden>·</span>{" "}
            {t.rich("madeBy", {
              author: (chunks) => (
                <a
                  href="https://www.linkedin.com/in/ivan-dujaut/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Iván Dujaut — LinkedIn (${newTabLabel})`}
                  className="underline-offset-2 transition-colors hover:text-foreground hover:underline"
                >
                  {chunks}
                </a>
              ),
            })}
          </p>

          <div className="flex items-center gap-3">
            {socialLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${link.label} (${newTabLabel})`}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <HugeiconsIcon icon={link.icon} size={16} strokeWidth={1.5} />
              </a>
            ))}
            <ObfuscatedEmailTrigger
              userReversed="navituajud"
              domainReversed="moc.liamg"
              label="Email"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <HugeiconsIcon icon={Mail01Icon} size={16} strokeWidth={1.5} />
            </ObfuscatedEmailTrigger>
          </div>
        </div>

        {/* El feed existía (`/rss.xml`) pero nada lo linkeaba, y estas dos
            claves de traducción estaban escritas sin usarse en ningún lado. */}
        <nav className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted-foreground">
          <a
            href={localePath(locale, "/rss.xml")}
            className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
          >
            <HugeiconsIcon icon={RssIcon} size={14} strokeWidth={1.5} aria-hidden />
            <span>RSS</span>
          </a>
          <span aria-hidden>·</span>
          <a
            href="https://github.com/ivandujaut/ivandujaut"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${t("viewSource")} (${newTabLabel})`}
            className="transition-colors hover:text-foreground"
          >
            {t("viewSource")}
          </a>
          <span aria-hidden>·</span>
          <span>{t("builtWith")} Next.js</span>
        </nav>
      </div>
    </footer>
  );
}
