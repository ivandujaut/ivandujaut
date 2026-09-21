import { useLocale, useTranslations } from "next-intl";
import { HugeiconsIcon } from "@hugeicons/react";
import { GithubIcon, LinkedinIcon, Mail01Icon } from "@hugeicons/core-free-icons";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import { ArrowRight } from "@/components/animate-ui/icons/arrow-right";
import { Download } from "@/components/animate-ui/icons/download";
import { ObfuscatedEmailTrigger } from "@/components/common/obfuscated-email-trigger";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { CV_PDF } from "@/lib/cv";

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

/**
 * Acá vivía el badge que anunciaba el caso más nuevo: una carpeta con tres
 * miniaturas que se abrían en abanico al pasar el mouse. Se fue el 18/09/2026,
 * cuando `PublishedWork` pasó a abrir con ese mismo caso en una tarjeta con su
 * imagen. Los dos anunciaban lo mismo con 300px de diferencia, y entre un
 * anuncio y la cosa anunciada gana la cosa.
 *
 * El componente sigue en `components/ui/images-badge.tsx` por si vuelve.
 */
export function Hero() {
  const t = useTranslations("home.hero");
  const locale = useLocale() as Locale;

  return (
    <section>
      <h1 className="text-4xl font-semibold tracking-tight">{t("name")}</h1>

      {/* El rol va en su propio renglón. Cuando los tres datos compartían una
          fila con separadores, el rol nuevo ("Product Strategy y Decision
          Analytics", más largo que "Product Engineer") partía en un teléfono y
          el renglón siguiente empezaba con un "·" suelto. */}
      <p className="mt-2 font-mono text-sm text-muted-foreground">{t("role")}</p>

      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-sm text-muted-foreground">
        <span>{t("location")}</span>
        <span aria-hidden>·</span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
          {t("available")}
        </span>
      </div>

      <p className="mt-6 text-lg leading-relaxed text-foreground">{t("tagline")}</p>

      <p className="mt-2 font-mono text-sm text-muted-foreground">{t("credentials")}</p>

      {/* Arriba del pliegue tiene que haber algo para hacer, no solo algo para
          leer. El destino primario es el trabajo; el CV es la salida rápida
          para quien vino a evaluar un perfil, y baja en el idioma de la página.

          Entre el 20 y el 21/09/2026 el botón del CV no estuvo: el PDF viejo
          era de mayo y desmentía a esta misma página. Volvió con el CV nuevo. */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        {/* Nunca `asChild` desde un Server Component. `AnimateIcon` es cliente,
            y los children que cruzan el borde servidor → cliente no llegan
            materializados como elemento durante el SSR: `Slot` lee
            `children.type` antes de su propio `isValidElement`, y revienta con
            "Cannot read properties of undefined (reading 'displayName')".
            La variante con wrapper (un span) capta el hover igual por burbujeo.
            En componentes con "use client" `asChild` sí funciona. */}
        <AnimateIcon animateOnHover className="inline-flex">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            <span>{t("ctas.work")}</span>
            <ArrowRight size={16} strokeWidth={1.5} aria-hidden />
          </Link>
        </AnimateIcon>
        <AnimateIcon animateOnHover className="inline-flex">
          <a
            href={CV_PDF[locale]}
            download
            data-ph="contact_click"
            data-ph-kind="cv"
            data-ph-surface="hero"
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-4 py-2 text-sm transition-colors hover:bg-muted"
          >
            <Download size={16} strokeWidth={1.5} aria-hidden />
            <span>{t("ctas.cv")}</span>
          </a>
        </AnimateIcon>
      </div>

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
          surface="hero"
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
