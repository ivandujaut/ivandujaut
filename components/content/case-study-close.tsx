import { getTranslations } from "next-intl/server";
import { HugeiconsIcon } from "@hugeicons/react";
import { LinkedinIcon, Mail01Icon } from "@hugeicons/core-free-icons";
import { CalendlyIcon } from "@/components/icons/calendly-icon";
import { RssIcon } from "@/components/icons/rss-icon";
import { ObfuscatedEmailTrigger } from "@/components/common/obfuscated-email-trigger";
import { ShareLinkButton } from "@/components/common/share-link-button";
import { Link } from "@/i18n/navigation";
import { localePath } from "@/lib/seo";

interface CaseStudyCloseProps {
  locale: "es" | "en";
  shareUrl: string;
  shareTitle: string;
}

const PRINCIPAL =
  "inline-flex items-center gap-1.5 rounded-md border border-transparent bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90";
// Relleno suave y no sólo borde: al lado del botón oscuro, uno con borde fino
// se percibía más bajo aunque mida lo mismo.
const SECUNDARIO =
  "inline-flex items-center gap-1.5 rounded-md border border-foreground/15 bg-foreground/7 px-4 py-2 text-sm transition-colors hover:bg-foreground/12";

/**
 * Qué se ofrece primero, y en qué orden, según el idioma de la página.
 *
 * En castellano manda LinkedIn, y eso no se toca: se decidió el 11/09/2026
 * sobre PostHog, cuando en 24 días el mail no recibió un solo clic en ninguna
 * de sus cinco superficies, Calendly tampoco, y lo único que alguien clickeó
 * para contactar fue LinkedIn.
 *
 * En inglés manda el mail, y el motivo es que la cuenta de LinkedIn publica en
 * castellano. El 18/11/2026, de las 253 personas que habían abierto
 * `acceso-parte-d` en 120 días, 242 entraron por `/en/`: son lectores de
 * Estados Unidos que llegan por Google, y a ellos "seguime en LinkedIn" les
 * ofrece un feed que no van a entender. El mail es además la vía que no exige
 * hablar en vivo, que importa cuando el inglés propio es de lectura y
 * escritura antes que de conversación.
 *
 * El feed va sólo en inglés por lo mismo: es la única forma de volver al sitio
 * que funciona sin saber castellano. En castellano queda donde estaba, en el
 * pie, porque ahí LinkedIn ya cumple esa función (ver `components/layout/footer.tsx`).
 */
const ORDEN = {
  es: ["linkedin", "email", "call"],
  en: ["email", "linkedin", "feed", "call"],
} as const;

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
 * Desde el 18/11/2026 el encabezado pregunta qué haría distinto el lector en
 * vez de proponer una charla. Es la misma pregunta que estaba enterrada en el
 * párrafo, y es la única que el lector puede contestar: el bloque abría
 * hablando de lo que quiere el autor.
 *
 * Se mide con `contact_click` y `feed_click` por `surface`. Si en inglés el
 * mail no gana, se invierte.
 */
export async function CaseStudyClose({ locale, shareUrl, shareTitle }: CaseStudyCloseProps) {
  const t = await getTranslations({ locale, namespace: "projects.close" });

  function accion(id: (typeof ORDEN)[keyof typeof ORDEN][number], principal: boolean) {
    const className = principal ? PRINCIPAL : SECUNDARIO;

    if (id === "email") {
      return (
        <ObfuscatedEmailTrigger
          key={id}
          surface="case-close"
          userReversed="navituajud"
          domainReversed="moc.liamg"
          label={t("ctas.email")}
          className={className}
        >
          <HugeiconsIcon icon={Mail01Icon} size={16} strokeWidth={1.5} aria-hidden />
          <span>{t("ctas.email")}</span>
        </ObfuscatedEmailTrigger>
      );
    }

    if (id === "feed") {
      return (
        <a
          key={id}
          href={localePath(locale, "/rss.xml")}
          data-ph="feed_click"
          data-ph-surface="case-close"
          data-ph-locale={locale}
          className={className}
        >
          <RssIcon size={16} />
          <span>{t("ctas.feed")}</span>
        </a>
      );
    }

    const links = {
      linkedin: {
        href: "https://www.linkedin.com/in/ivan-dujaut/",
        kind: "linkedin",
        icon: <HugeiconsIcon icon={LinkedinIcon} size={16} strokeWidth={1.5} aria-hidden />,
        label: t("ctas.linkedin"),
      },
      call: {
        href: "https://calendly.com/ivan-dujaut/nueva-reunion",
        kind: "calendly",
        icon: <CalendlyIcon size={16} aria-hidden />,
        label: t("ctas.call"),
      },
    }[id];

    return (
      <a
        key={id}
        href={links.href}
        data-ph="contact_click"
        data-ph-kind={links.kind}
        data-ph-surface="case-close"
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {links.icon}
        <span>{links.label}</span>
      </a>
    );
  }

  return (
    <section className="mt-16 border-t border-border pt-10">
      <h2 className="text-xl font-semibold tracking-tight">{t("title")}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t("body")}</p>

      <div className="mt-5 flex flex-wrap gap-3">
        {ORDEN[locale].map((id, i) => accion(id, i === 0))}
        {/* `px-4 py-2` iguala el alto con los otros: el botón de compartir
            trae `py-1.5` porque en la cabecera del caso va más chico. */}
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
