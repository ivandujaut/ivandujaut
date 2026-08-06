import { ViewTransition } from "react";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { Link } from "@/i18n/navigation";
import { StatusBadge, type ProjectStatus } from "@/components/content/status-badge";
import { KindBadge, type ProjectKind } from "@/components/content/kind-badge";

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
  year: number;
  stack: string[];
  status: ProjectStatus;
  kind: ProjectKind;
  /** "row" es el bloque compacto de la home; "list" es el listado de /projects. */
  variant?: "row" | "list";
  cover?: ProjectCover;
}

/** Cuántas tecnologías entran antes de pasar a contador. */
const STACK_VISIBLE = 2;

export function ProjectListItem({
  slug,
  title,
  tagline,
  year,
  stack,
  status,
  kind,
  variant = "row",
  cover,
}: ProjectListItemProps) {
  // Para casos de mejora y diseños, "Concepto" es redundante con el tipo de
  // pieza (la propuesta siempre es conceptual); el ciclo de vida solo aporta
  // información en productos construidos.
  const showStatus = kind === "build" || status !== "concept";

  if (variant === "list") {
    return (
      <Link
        href={`/projects/${slug}`}
        className="group -mx-3 flex items-center gap-4 rounded-lg px-3 py-4 transition-colors hover:bg-muted/40"
      >
        <article className="min-w-0 flex-1">
          <span className="mb-1.5 inline-flex flex-wrap gap-1.5">
            <KindBadge kind={kind} />
            {showStatus && <StatusBadge status={status} />}
          </span>
          <ViewTransition name={`project-title-${slug}`} share="morph">
            <h3 className="text-lg font-medium leading-snug">{title}</h3>
          </ViewTransition>
          {/* Dos líneas y corte. Antes algunas taglines ocupaban tres y, sumadas
              a la portada y a las píldoras de stack, dejaban dos proyectos por
              pantalla en un teléfono. */}
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{tagline}</p>
          <p className="mt-2 font-mono text-xs text-muted-foreground">
            <ViewTransition name={`project-year-${slug}`} share="morph">
              <span>{year}</span>
            </ViewTransition>
            {" · "}
            {stack.slice(0, STACK_VISIBLE).join(" · ")}
            {stack.length > STACK_VISIBLE && ` +${stack.length - STACK_VISIBLE}`}
          </p>
        </article>

        {/* La miniatura no aparece en mobile: estas portadas son ilustraciones
            abstractas, no explican el caso, y en una lista que se escanea el
            título es lo que decide. Oculta y con carga diferida, el navegador
            tampoco la descarga en pantallas chicas. Desde `sm` entra como ancla
            visual, donde el espacio no compite con nada. */}
        {cover && (
          <Image
            src={cover.src}
            alt=""
            width={cover.width}
            height={cover.height}
            aria-hidden
            loading="lazy"
            sizes="112px"
            className="hidden h-20 w-28 shrink-0 rounded-md object-cover sm:block"
            {...(cover.blurDataURL
              ? { placeholder: "blur" as const, blurDataURL: cover.blurDataURL }
              : {})}
          />
        )}

        {/* En un teléfono no hay hover que revele que la fila es clickeable. */}
        <HugeiconsIcon
          icon={ArrowRight01Icon}
          size={18}
          strokeWidth={1.5}
          aria-hidden
          className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
        />
      </Link>
    );
  }

  return (
    <Link
      href={`/projects/${slug}`}
      className="group -mx-3 block rounded-lg px-3 py-4 transition-colors hover:bg-muted/40"
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
            <span className="shrink-0 font-mono text-xs text-muted-foreground">{year}</span>
          </ViewTransition>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{tagline}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="font-mono">{stack.slice(0, 3).join(" · ")}</span>
          {stack.length > 3 && <span className="font-mono">+{stack.length - 3}</span>}
        </div>
      </article>
    </Link>
  );
}
