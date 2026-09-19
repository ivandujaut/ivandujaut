import { ViewTransition } from "react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ProjectListItem } from "@/components/content/project-list-item";
import { KindBadge } from "@/components/content/kind-badge";
import { getProjects, getPublishingCadence } from "@/lib/content";

interface PublishedWorkProps {
  locale: "es" | "en";
}

/**
 * Cuántas piezas entran: la más nueva como tarjeta con imagen y dos más como
 * filas. Arriba de eso la home deja de leerse y empieza a scrollearse.
 */
const HOME_LIMIT = 3;

/**
 * El trabajo publicado en la home.
 *
 * Reemplaza a `FeaturedProjects`, que elegía por el flag `featured` del
 * frontmatter. El flag se desactualizó solo: al 18/09/2026 había seis piezas
 * marcadas, la home mostraba las tres más nuevas de ésas, y las cuatro piezas
 * más recientes del sitio (las tres de Medicare y el pitch de Leqembi) no
 * estaban marcadas, así que la home mostraba trabajo del 8 de septiembre para
 * atrás. Acá la curaduría es la fecha: no hay nada que mantener y la home
 * nunca queda vieja.
 *
 * La primera pieza va con imagen porque la home no tenía ninguna evidencia de
 * que acá se publica algo.
 *
 * Manda la portada y el gráfico queda de reserva. Decisión de Iván el
 * 19/09/2026: la portada es la cara que él le dibuja a cada caso, y es lo que
 * quiere ver anunciando el último publicado.
 *
 * Las dos entran exactas igual, porque las dos traen ancho, alto y blur desde
 * Velite: la portada siempre los tuvo y el `preview` los declara desde el
 * 19/09. Antes el gráfico llegaba como una ruta suelta sin medidas, había que
 * meterlo en una caja de proporción fija y aparecían bandas vacías al costado.
 */
export async function PublishedWork({ locale }: PublishedWorkProps) {
  const projects = getProjects(locale).slice(0, HOME_LIMIT);
  if (projects.length === 0) return null;

  const [lead, ...rest] = projects;
  const t = await getTranslations({ locale, namespace: "home.work" });
  const tReading = await getTranslations({ locale, namespace: "common.reading" });
  const cadence = getPublishingCadence(locale);

  // La portada trae ancho, alto y blur desde Velite, así que se dibuja con su
  // propia proporción y llena la caja exacto. Sin portada no va imagen: un
  // `preview` es una ruta suelta sin medidas y habría que meterlo en una caja
  // de proporción fija, que es lo que producía las bandas vacías al costado.
  const imagen = lead.cover ? { ...lead.cover.src, alt: lead.cover.alt } : null;

  return (
    <section>
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          {t("title")}
        </h2>
        <Link
          href="/projects"
          className="font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          {t("viewAll")}
        </Link>
      </div>

      <Link
        href={`/projects/${lead.slug}`}
        data-ph="card_click"
        data-ph-slug={lead.slug}
        data-ph-surface="home-lead"
        className="group -mx-3 block rounded-lg px-3 py-4 transition-colors hover:bg-muted/40"
      >
        <article>
          {imagen && (
            <Image
              src={imagen.src}
              alt={imagen.alt}
              width={imagen.width}
              height={imagen.height}
              sizes="(max-width: 768px) 100vw, 672px"
              // Es el LCP de la home en escritorio. `priority` está deprecado
              // en Next 16: para una imagen que ya está en el HTML inicial, la
              // recomendación es cargarla sin esperar al viewport y pedirla con
              // prioridad alta.
              loading="eager"
              fetchPriority="high"
              {...(imagen.blurDataURL
                ? { placeholder: "blur" as const, blurDataURL: imagen.blurDataURL }
                : {})}
              className="mb-3 h-auto w-full rounded-lg border border-border"
            />
          )}

          <span className="mb-2 inline-flex flex-wrap gap-1.5">
            <KindBadge kind={lead.kind} />
          </span>
          <ViewTransition name={`project-title-${lead.slug}`} share="morph">
            <h3 className="text-xl font-medium leading-snug">{lead.title}</h3>
          </ViewTransition>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{lead.tagline}</p>
          <p className="mt-2 font-mono text-xs text-muted-foreground">
            <time dateTime={lead.date}>
              {new Date(lead.date).toLocaleDateString(locale, {
                month: "short",
                year: "numeric",
              })}
            </time>
            {lead.metadata && (
              <>
                {" · "}
                {tReading("minutes", { count: lead.metadata.readingTime })}
              </>
            )}
          </p>
        </article>
      </Link>

      <div className="mt-2 space-y-1">
        {rest.map((project) => (
          <ProjectListItem
            key={project.slug}
            slug={project.slug}
            title={project.title}
            tagline={project.tagline}
            date={project.date}
            stack={project.stack}
            status={project.status}
            kind={project.kind}
            locale={locale}
            surface="home"
          />
        ))}
      </div>

      {cadence && (
        <p className="mt-5 text-sm text-muted-foreground">
          {t("cadence", {
            count: cadence.count,
            days: cadence.everyDays,
            since: new Date(cadence.since).toLocaleDateString(locale, {
              month: "long",
              year: "numeric",
            }),
          })}
        </p>
      )}
    </section>
  );
}
