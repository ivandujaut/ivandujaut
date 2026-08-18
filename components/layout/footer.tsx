import { useTranslations } from "next-intl";
import { HugeiconsIcon } from "@hugeicons/react";
import { GithubIcon, LinkedinIcon, Mail01Icon } from "@hugeicons/core-free-icons";
import { ObfuscatedEmailTrigger } from "@/components/common/obfuscated-email-trigger";

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
  const currentYear = new Date().getFullYear();
  const newTabLabel = tA11y("opensInNewTab");

  return (
    <footer className="mt-24 border-t border-border/40">
      <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-between gap-4 px-6 py-8">
        <p className="text-xs text-muted-foreground">
          © {currentYear} <span aria-hidden>·</span>{" "}
          {t.rich("madeBy", {
            author: (chunks) => (
              <a
                href="https://www.linkedin.com/in/ivan-dujaut/"
                data-ph="contact_click"
                data-ph-kind="linkedin"
                data-ph-surface="footer"
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
            surface="footer"
            userReversed="navituajud"
            domainReversed="moc.liamg"
            label="Email"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <HugeiconsIcon icon={Mail01Icon} size={16} strokeWidth={1.5} />
          </ObfuscatedEmailTrigger>
        </div>
      </div>
    </footer>
  );
}
