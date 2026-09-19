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
 * Manda la portada y el gráfico queda de reserva, al revés que el 18/09/2026.
 * El argumento de entonces era que un gráfico prueba que adentro hay análisis;
 * el problema es que un gráfico llega como una ruta suelta, sin medidas, así
 * que hay que meterlo en una caja fija y ahí aparecen las bandas vacías a los
 * costados. La portada trae sus medidas desde Velite y está dibujada a 16:9
 * para este lugar: entra exacta. Todos los casos publicados tienen una.
 */
export async function PublishedWork({ locale }: PublishedWorkProps) {
  const projects = getProjects(locale).slice(0, HOME_LIMIT);
  if (projects.length === 0) return null;

  const [lead, ...rest] = projects;
  const t = await getTranslations({ locale, namespace: "home.work" });
  const tReading = await getTranslations({ locale, namespace: "common.reading" });
  const cadence = getPublishingCadence(locale);

  // La portada trae sus medidas desde Velite, así que se dibuja con su propia
  // proporción y llena la caja exacto. El `preview` es una ruta suelta sin
  // dimensiones: ahí hace falta una caja fija, y va sin recortar porque son
  // gráficos (un recorte se come el título o el eje).
  const portada = lead.cover
    ? {
        src: lead.cover.src.src,
        alt: lead.cover.alt,
        width: lead.cover.src.width,
        height: lead.cover.src.height,
        blurDataURL: lead.cover.src.blurDataURL,
      }
    : null;
  const grafico = portada ? null : (lead.preview?.[0] ?? null);

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
          {portada && (
            <Image
              src={portada.src}
              alt={portada.alt}
              width={portada.width}
              height={portada.height}
              sizes="(max-width: 768px) 100vw, 672px"
              // Es el LCP de la home en escritorio. `priority` está deprecado
              // en Next 16: para una imagen que ya está en el HTML inicial, la
              // recomendación es cargarla sin esperar al viewport y pedirla con
              // prioridad alta.
              loading="eager"
              fetchPriority="high"
              {...(portada.blurDataURL
                ? { placeholder: "blur" as const, blurDataURL: portada.blurDataURL }
                : {})}
              className="mb-3 h-auto w-full rounded-lg border border-border"
            />
          )}

          {grafico && (
            <div className="relative mb-3 aspect-[16/10] overflow-hidden rounded-lg border border-border bg-muted/30">
              <Image
                src={grafico.src}
                alt={grafico.alt}
                fill
                sizes="(max-width: 768px) 100vw, 672px"
                loading="eager"
                fetchPriority="high"
                className="object-contain"
              />
            </div>
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
