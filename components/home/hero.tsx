import { useTranslations } from "next-intl";
import { HugeiconsIcon } from "@hugeicons/react";
import { GithubIcon, LinkedinIcon, Mail01Icon } from "@hugeicons/core-free-icons";

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
  {
    href: "mailto:dujautivan@gmail.com",
    label: "Email",
    icon: Mail01Icon,
  },
];

export function Hero() {
  const t = useTranslations("home.hero");

  return (
    <section>
      <h1 className="text-4xl font-semibold tracking-tight">{t("name")}</h1>
      <p className="mt-3 text-lg text-muted-foreground">{t("tagline")}</p>

      <div className="mt-6 flex items-center gap-3">
        {socialLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <HugeiconsIcon icon={link.icon} size={20} strokeWidth={1.5} />
          </a>
        ))}
      </div>
    </section>
  );
}
