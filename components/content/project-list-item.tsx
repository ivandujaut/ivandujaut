import { ViewTransition } from "react";
import Image from "next/image";
import { StatusBadge, type ProjectStatus } from "@/components/content/status-badge";
import { KindBadge, type ProjectKind } from "@/components/content/kind-badge";
import { ListRow } from "@/components/ui/list-row";

interface ProjectCover {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Miniatura en base64 que genera Velite; evita el hueco vacío al cargar. */
  blurDataURL?: string;
}

interface ProjectListItemProps {
  slug: string;
  title: string;
  tagline: string;
  /**
   * Fecha de publicación. Antes acá iba sólo `year`, y con dieciséis piezas
   * del mismo año el listado entero mostraba "2026" dieciséis veces: la
   * cadencia de publicación, que es el mejor argumento del sitio, no se veía.
   */
  date: string;
  locale: "es" | "en";
  stack: string[];
  /**
   * Minutos de lectura, ya formateados por quien llama (que es el que tiene las
   * traducciones). En un caso ocupa el lugar del stack.
   */
  readingTime?: string;
  status: ProjectStatus;
  kind: ProjectKind;
  /** "row" es el bloque compacto de la home; "list" es el listado de /projects. */
  variant?: "row" | "list";
  /**
   * Muestra las fuentes de datos debajo del título. Va en `false` en /about,
   * donde las tarjetas son una muestra del trabajo y no un catálogo: ahí la
   * línea repite el párrafo de herramientas que está más abajo en la misma
   * página.
   */
  showStack?: boolean;
  cover?: ProjectCover;
  /**
   * Desde dónde se muestra la tarjeta. Va a PostHog como `surface` del evento
   * `card_click`, para saber qué tarjeta se elige y desde qué página. Es
   * obligatorio para que ninguna tarjeta quede sin medir.
   */
  surface: "home" | "index" | "next";
  /**
   * Sólo en `surface: "next"`: si la pieza se eligió por compartir tema con la
   * que se está leyendo (`topic`) o por ser su vecina en el tiempo (`date`).
   * Va a PostHog como `relation`, que es la comparación que justifica elegir
   * por tema.
   */
  relation?: "topic" | "date";
}

/** Cuántas tecnologías entran antes de pasar a contador. */
const STACK_VISIBLE = 2;

export function ProjectListItem({
  slug,
  title,
  tagline,
  date,
  locale,
  stack,
  readingTime,
  status,
  kind,
  variant = "row",
  showStack = true,
  cover,
  surface,
  relation,
}: ProjectListItemProps) {
  // Para casos de mejora y diseños, "Concepto" es redundante con el tipo de
  // pieza (la propuesta siempre es conceptual); el ciclo de vida solo aporta
  // información en productos construidos.
  const showStatus = kind === "build" || status !== "concept";

  // Qué se muestra al pie de la tarjeta.
  //
  // En un caso de estudio, las tecnologías no aportan: nadie elige leer un
  // análisis de Medicare porque esté hecho con matplotlib. Lo que decide si
  // alguien lo abre es cuánto le va a llevar, así que ahí va el tiempo de
  // lectura (feedback de un lector, 2026-09-19).
  //
  // En lo que se construyó sí aportan, porque el stack ES parte de lo que se
  // muestra. Eso incluye el diseño: "Figma" dice qué se hizo.
  const pieDeTarjeta =
    kind === "case-study"
      ? readingTime
      : [
          stack.slice(0, STACK_VISIBLE).join(" · "),
          stack.length > STACK_VISIBLE ? `+${stack.length - STACK_VISIBLE}` : "",
        ]
          .filter(Boolean)
          .join(" ");

  const publishedAt = new Date(date).toLocaleDateString(locale, {
    month: "short",
    year: "numeric",
  });

  if (variant === "list") {
    return (
      <ListRow
        href={`/projects/${slug}`}
        data-ph="card_click"
        data-ph-slug={slug}
        data-ph-surface={surface}
        data-ph-relation={relation}
        layout="card"
      >
        <article>
          {/* La portada deja de ser una miniatura de 112px al costado y pasa a
              ser lo primero de la tarjeta.

              Hasta el 18/11/2026 se renderizaba a `h-20 w-28` y estaba oculta
              en mobile. El argumento de entonces era que en una lista densa el
              título es lo que decide, y era cierto para una miniatura; deja de
              serlo cuando la portada es el elemento principal y cada una está
              dibujada a mano siguiendo `cover-style.md`. Era el activo visual
              más distintivo del sitio y el que menos espacio tenía. */}
          {cover && (
            <div className="relative overflow-hidden rounded-lg bg-muted">
              <Image
                src={cover.src}
                alt=""
                width={cover.width}
                height={cover.height}
                aria-hidden
                loading="lazy"
                sizes="(min-width: 640px) 320px, 100vw"
                className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                {...(cover.blurDataURL
                  ? { placeholder: "blur" as const, blurDataURL: cover.blurDataURL }
                  : {})}
              />
              {/* El estado va sobre la portada y el tipo de pieza no va: el
                  encabezado del grupo ya dice si es algo que analizó o algo que
                  construyó, así que repetirlo en cada tarjeta era la misma
                  etiqueta trece veces. El estado sí aporta, y sólo en lo
                  construido. */}
              {showStatus && (
                <span className="absolute top-2.5 left-2.5">
                  <StatusBadge status={status} className="bg-background/90 backdrop-blur-sm" />
                </span>
              )}
            </div>
          )}

          <ViewTransition name={`project-title-${slug}`} share="morph">
            <h3 className="mt-3 text-lg leading-snug font-medium">{title}</h3>
          </ViewTransition>

          {/* La tagline es la tesis del caso en una oración, y es lo que decide
              el clic. Con dos líneas, en un teléfono 8 de 12 quedaban cortadas
              justo en la tensión ("...y ninguna me mostró el precio sin..."),
              medido el 11/09/2026. Con la tarjeta en una columna por fila en
              mobile entra entera. */}
          <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">{tagline}</p>

          <p className="mt-2 font-mono text-xs text-muted-foreground">
            <ViewTransition name={`project-year-${slug}`} share="morph">
              <time dateTime={date}>{publishedAt}</time>
            </ViewTransition>
            {pieDeTarjeta && (
              <>
                {" · "}
                {pieDeTarjeta}
              </>
            )}
          </p>
        </article>
      </ListRow>
    );
  }

  return (
    <ListRow
      href={`/projects/${slug}`}
      data-ph="card_click"
      data-ph-slug={slug}
      data-ph-surface={surface}
    >
      <article>
        <span className="mb-2 inline-flex flex-wrap gap-1.5">
          <KindBadge kind={kind} />
          {showStatus && <StatusBadge status={status} />}
        </span>
        <div className="flex items-baseline justify-between gap-4">
          <ViewTransition name={`project-title-${slug}`} share="morph">
            <h3 className="text-base font-medium">{title}</h3>
          </ViewTransition>
          <ViewTransition name={`project-year-${slug}`} share="morph">
            <time dateTime={date} className="shrink-0 font-mono text-xs text-muted-foreground">
              {publishedAt}
            </time>
          </ViewTransition>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{tagline}</p>
        {/* Dos entradas y no tres: las fuentes de datos tienen nombres largos
            ("Datos abiertos de CMS (parte B, parte D y Open Payments)") y con
            tres la fila se iba a dos renglones de monospace gris, que era lo
            más pesado de una tarjeta cuyo trabajo es que se lea el título. */}
        {showStack && pieDeTarjeta && (
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="font-mono">{pieDeTarjeta}</span>
          </div>
        )}
      </article>
    </ListRow>
  );
}
