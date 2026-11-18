import { getTranslations } from "next-intl/server";
import { HugeiconsIcon } from "@hugeicons/react";
import { LinkedinIcon, Mail01Icon } from "@hugeicons/core-free-icons";
import { CalendlyIcon } from "@/components/icons/calendly-icon";
import { ObfuscatedEmailTrigger } from "@/components/common/obfuscated-email-trigger";
import { ShareLinkButton } from "@/components/common/share-link-button";
import { Link } from "@/i18n/navigation";

interface CaseStudyCloseProps {
  locale: "es" | "en";
  shareUrl: string;
  shareTitle: string;
}

/**
 * Cierre de un caso de estudio.
 *
 * Un caso son entre 2.500 y 6.000 palabras: quien llega al final ya invirtió
 * varios minutos y es el lector más calificado que va a tener la página. Antes
 * este bloque no existía y el artículo terminaba en "me gusta" y "compartir",
 * sin ninguna salida. El me gusta se sacó del sitio porque en una página cuyo
 * trabajo es empezar una conversación, un toque anónimo es la forma más barata
 * de descargar el impulso de escribir.
 *
 * Orden de los botones, decidido el 11/09/2026 sobre PostHog: en los primeros
 * 24 días de medición el mail no recibió un solo clic en ninguna de sus cinco
 * superficies y Calendly tampoco; lo único que alguien clickeó para contactar
 * fue LinkedIn. Y como el sitio no guarda cookies, la única forma de que un
 * lector vuelva es que siga la cuenta donde sale cada caso nuevo. Por eso
 * LinkedIn va primero y con el estilo principal; mail y Calendly quedan para
 * quien quiera seguir la conversación en privado. Se mide con `contact_click`
 * por `surface`: si el mail vuelve a ganar, se invierte.
 */
export async function CaseStudyClose({ locale, shareUrl, shareTitle }: CaseStudyCloseProps) {
  const t = await getTranslations({ locale, namespace: "projects.close" });

  return (
    <section className="mt-16 border-t border-border pt-10">
      <h2 className="text-xl font-semibold tracking-tight">{t("title")}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t("body")}</p>

      <div className="mt-5 flex flex-wrap gap-3">
        <a
          href="https://www.linkedin.com/in/ivan-dujaut/"
          data-ph="contact_click"
          data-ph-kind="linkedin"
          data-ph-surface="case-close"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-md border border-transparent bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          <HugeiconsIcon icon={LinkedinIcon} size={16} strokeWidth={1.5} aria-hidden />
          <span>{t("ctas.linkedin")}</span>
        </a>
        <ObfuscatedEmailTrigger
          surface="case-close"
          userReversed="navituajud"
          domainReversed="moc.liamg"
          label={t("ctas.email")}
          className="inline-flex items-center gap-1.5 rounded-md border border-foreground/15 bg-foreground/7 px-4 py-2 text-sm transition-colors hover:bg-foreground/12"
        >
          <HugeiconsIcon icon={Mail01Icon} size={16} strokeWidth={1.5} aria-hidden />
          <span>{t("ctas.email")}</span>
        </ObfuscatedEmailTrigger>
        <a
          href="https://calendly.com/ivan-dujaut/nueva-reunion"
          data-ph="contact_click"
          data-ph-kind="calendly"
          data-ph-surface="case-close"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-md border border-foreground/15 bg-foreground/7 px-4 py-2 text-sm transition-colors hover:bg-foreground/12"
        >
          <CalendlyIcon size={16} aria-hidden />
          <span>{t("ctas.call")}</span>
        </a>
        {/* `px-4 py-2` iguala el alto con los otros tres: el botón de compartir
            trae `py-1.5` porque en la cabecera del caso va más chico. El
            relleno suave es el mismo de los secundarios de la portada: al lado
            del botón oscuro, uno con borde fino se percibía más bajo. */}
        <ShareLinkButton
          url={shareUrl}
          title={shareTitle}
          surface="case-close"
          alwaysShowLabel
          triggerClassName="border-foreground/15 bg-foreground/7 px-4 py-2 hover:bg-foreground/12"
        />
      </div>

      <Link
        href="/projects"
        className="mt-6 inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        {t("allProjects")}
      </Link>
    </section>
  );
}
