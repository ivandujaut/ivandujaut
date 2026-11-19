import { ViewTransition } from "react";
import Image from "next/image";
import { ListRow } from "@/components/ui/list-row";

interface PostCover {
  src: string;
  width: number;
  height: number;
  /** Miniatura en base64 que genera Velite; evita el hueco vacío al cargar. */
  blurDataURL?: string;
}

interface PostListItemProps {
  slug: string;
  title: string;
  description: string;
  date: string;
  locale: string;
  /** Minutos ya formateados por quien llama, que es el que tiene las traducciones. */
  readingTime?: string;
  cover?: PostCover;
  /** Va a PostHog como `surface` del evento `card_click`. */
  surface: "blog-index";
}

/**
 * La tarjeta de un post.
 *
 * Es la misma del índice de casos, sin el estado (un post no tiene ciclo de
 * vida) y con la descripción en el lugar de la tesis.
 *
 * Hasta el 18/11/2026 era una fila de texto: título, bajada en gris y fecha,
 * sin imagen. Los cuatro posts tienen portada dibujada a mano, así que el
 * índice tiraba cuatro portadas a la basura mientras `/projects` discutía
 * cuánto espacio darles. En 120 días, 20 sesiones llegaron a `/blog` y los
 * cuatro posts sumaron 9 vistas: cuatro titulares equivalentes en una lista
 * plana es el mismo diagnóstico que llevó a cambiar el índice de casos.
 */
export function PostListItem({
  slug,
  title,
  description,
  date,
  locale,
  readingTime,
  cover,
  surface,
}: PostListItemProps) {
  const publishedAt = new Date(date).toLocaleDateString(locale, {
    month: "short",
    year: "numeric",
  });

  return (
    <ListRow
      href={`/blog/${slug}`}
      data-ph="card_click"
      data-ph-slug={slug}
      data-ph-surface={surface}
      layout="card"
    >
      <article>
        {/* Decorativa y con `alt` vacío: la portada no agrega información que
            el título no dé, y su texto alternativo completo vive en la ficha
            del post, donde sí es la imagen de la pieza. */}
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
          </div>
        )}

        <ViewTransition name={`post-title-${slug}`} share="morph">
          <h3 className="mt-3 text-lg leading-snug font-medium">{title}</h3>
        </ViewTransition>

        <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">{description}</p>

        <p className="mt-2 font-mono text-xs text-muted-foreground">
          <ViewTransition name={`post-date-${slug}`} share="morph">
            <time dateTime={date}>{publishedAt}</time>
          </ViewTransition>
          {readingTime && (
            <>
              {" · "}
              {readingTime}
            </>
          )}
        </p>
      </article>
    </ListRow>
  );
}
