import { useTranslations } from "next-intl";
import { HugeiconsIcon } from "@hugeicons/react";
import { GithubIcon, LinkedinIcon, Mail01Icon } from "@hugeicons/core-free-icons";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import { ArrowRight } from "@/components/animate-ui/icons/arrow-right";
import { Download } from "@/components/animate-ui/icons/download";
import { ObfuscatedEmailTrigger } from "@/components/common/obfuscated-email-trigger";
import { Link } from "@/i18n/navigation";
import { CV_PAGE } from "@/lib/cv";

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

  return (
    <section>
      {/* El titular es la tesis y no el nombre.
          Hasta el 18/11/2026 el `h1` decía "Iván Dujaut" a 36px y la tesis
          vivía a 18px, debajo de dos renglones en monoespaciada. Quien llega
          desde LinkedIn ya sabe de quién es el sitio (lo dice el navbar, el
          `title` y el link que clickeó); lo que no sabe es qué hace. El nombre
          sigue acá abajo, y en el JSON-LD, el `title` y el pie.

          El cuerpo sube a 48px en pantallas grandes: el elemento más grande de
          la página era 2,5 veces el cuerpo y nada atraía la mirada. */}
      <h1 className="text-4xl leading-[1.08] font-semibold tracking-tight text-balance sm:text-5xl">
        {t("tagline")}
      </h1>

      {/* Estos tres datos estaban en monoespaciada, igual que las fechas, el
          stack y el tiempo de lectura. A tamaño chico cansa y le da aire de
          terminal a una página que vende criterio de producto. La mono queda
          para los rótulos de tres palabras, que es para lo que sirve. */}
      <p className="mt-6 text-lg text-foreground">
        {t("name")} <span className="text-muted-foreground">· {t("role")}</span>
      </p>

      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
        <span>{t("credentials")}</span>
        <span aria-hidden>·</span>
        <span>{t("location")}</span>
        <span aria-hidden>·</span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
          {t("available")}
        </span>
      </div>

      {/* Arriba del pliegue tiene que haber algo para hacer, no solo algo para
          leer. El destino primario es el trabajo; el CV es la salida rápida
          para quien vino a evaluar un perfil: abre `/cv` en una pestaña nueva,
          en el idioma de la página, y desde ahí se baja.

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
            className="inline-flex items-center gap-1.5 rounded-md border border-transparent bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            <span>{t("ctas.work")}</span>
            <ArrowRight size={16} strokeWidth={1.5} aria-hidden />
          </Link>
        </AnimateIcon>
        <AnimateIcon animateOnHover className="inline-flex">
          <Link
            href={CV_PAGE}
            target="_blank"
            data-ph="contact_click"
            data-ph-kind="cv"
            data-ph-surface="hero"
            // Relleno suave y no sólo borde: al lado del botón oscuro, uno
            // con borde fino se percibía más bajo aunque mida lo mismo.
            className="inline-flex items-center gap-1.5 rounded-md border border-foreground/15 bg-foreground/7 px-4 py-2 text-sm transition-colors hover:bg-foreground/12"
          >
            <Download size={16} strokeWidth={1.5} aria-hidden />
            <span>{t("ctas.cv")}</span>
          </Link>
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
