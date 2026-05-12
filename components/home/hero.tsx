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

export function Hero() {
  const t = useTranslations("home.hero");

  return (
    <section>
      <h1 className="text-4xl font-semibold tracking-tight">{t("name")}</h1>

      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-sm text-muted-foreground">
        <span>{t("role")}</span>
        <span aria-hidden>·</span>
        <span>{t("location")}</span>
        <span aria-hidden>·</span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
          {t("available")}
        </span>
      </div>

      <p className="mt-6 text-lg leading-relaxed text-foreground">{t("tagline")}</p>

      <p className="mt-2 font-mono text-sm text-muted-foreground">{t("credentials")}</p>

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
        <ObfuscatedEmailTrigger
          userReversed="navituajud"
          domainReversed="moc.liamg"
          label="Email"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          <HugeiconsIcon icon={Mail01Icon} size={20} strokeWidth={1.5} />
        </ObfuscatedEmailTrigger>
      </div>
    </section>
  );
}
