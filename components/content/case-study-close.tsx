import { getTranslations } from "next-intl/server";
import { HugeiconsIcon } from "@hugeicons/react";
import { Mail01Icon } from "@hugeicons/core-free-icons";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import { ArrowRight } from "@/components/animate-ui/icons/arrow-right";
import { CalendlyIcon } from "@/components/icons/calendly-icon";
import { ObfuscatedEmailTrigger } from "@/components/common/obfuscated-email-trigger";
import { KindBadge, type ProjectKind } from "@/components/content/kind-badge";
import { ShareLinkButton } from "@/components/common/share-link-button";
import { Link } from "@/i18n/navigation";

interface AdjacentProject {
  slug: string;
  title: string;
  tagline: string;
  kind: ProjectKind;
}

interface CaseStudyCloseProps {
  locale: "es" | "en";
  previous?: AdjacentProject;
  next?: AdjacentProject;
  shareUrl: string;
  shareTitle: string;
}

/**
 * Cierre de un caso de estudio.
 *
 * Un caso son entre 2.500 y 6.000 palabras: quien llega al final ya invirtió
 * varios minutos y es el lector más calificado que va a tener la página. Antes
 * este bloque no existía y el artículo terminaba en "me gusta" y "compartir",
 * sin ninguna salida. Ahora reúne las tres acciones que tienen sentido ahí, en
 * orden de valor: escribir, agendar, compartir. El me gusta se sacó del sitio
 * porque en una página cuyo trabajo es empezar una conversación, un toque
 * anónimo es la forma más barata de descargar el impulso de escribir.
 */
export async function CaseStudyClose({
  locale,
  previous,
  next,
  shareUrl,
  shareTitle,
}: CaseStudyCloseProps) {
  const t = await getTranslations({ locale, namespace: "projects.close" });
  const hasNeighbours = Boolean(previous || next);

  return (
    <section className="mt-16 border-t border-border pt-10">
      <h2 className="text-xl font-semibold tracking-tight">{t("title")}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t("body")}</p>

      <div className="mt-5 flex flex-wrap gap-3">
        <ObfuscatedEmailTrigger
          userReversed="navituajud"
          domainReversed="moc.liamg"
          label={t("ctas.email")}
          className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          <HugeiconsIcon icon={Mail01Icon} size={16} strokeWidth={1.5} aria-hidden />
          <span>{t("ctas.email")}</span>
        </ObfuscatedEmailTrigger>
        <a
          href="https://calendly.com/ivan-dujaut/nueva-reunion"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-4 py-2 text-sm transition-colors hover:bg-muted"
        >
          <CalendlyIcon size={16} aria-hidden />
          <span>{t("ctas.call")}</span>
        </a>
        <ShareLinkButton url={shareUrl} title={shareTitle} alwaysShowLabel />
      </div>

      {hasNeighbours && (
        // Dos columnas solo si hay dos casos vecinos: en los extremos del
        // listado hay uno solo y a media columna queda huérfano.
        <nav
          aria-label={t("moreLabel")}
          className={`mt-10 grid gap-3 ${previous && next ? "sm:grid-cols-2" : "grid-cols-1"}`}
        >
          {previous && <NeighbourCard project={previous} label={t("newer")} />}
          {next && <NeighbourCard project={next} label={t("older")} />}
        </nav>
      )}

      <Link
        href="/projects"
        className="mt-6 inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        {t("allProjects")}
      </Link>
    </section>
  );
}

function NeighbourCard({ project, label }: { project: AdjacentProject; label: string }) {
  return (
    // Sin `asChild`: rompe con el `Link` de next-intl (ver stats-grid.tsx).
    <AnimateIcon animateOnHover className="block h-full">
      <Link
        href={`/projects/${project.slug}`}
        className="group flex h-full flex-col rounded-lg border border-border p-4 transition-colors hover:bg-muted/40"
      >
        {/* La flecha apunta siempre a la derecha: significa "abrí este caso",
            no una dirección en el tiempo. Rotarla contradecía el label. */}
        <span className="flex items-center gap-1.5 font-mono text-[0.7rem] uppercase tracking-wider text-muted-foreground">
          {label}
          <ArrowRight size={12} strokeWidth={1.5} aria-hidden animation="pointing" />
        </span>
        <span className="mt-2 flex flex-wrap gap-1.5">
          <KindBadge kind={project.kind} />
        </span>
        <span className="mt-2 text-sm font-medium">{project.title}</span>
        <span className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {project.tagline}
        </span>
      </Link>
    </AnimateIcon>
  );
}
