import type { ReactNode } from "react";

interface AnnexProps {
  /** Lo que se lee con el anexo cerrado. Tiene que decir qué hay adentro. */
  title: string;
  /** Una línea debajo del título: para quién es y por qué está plegado. */
  hint?: string;
  children: ReactNode;
}

/**
 * Bloque plegado para el material que sostiene un caso pero no hace falta
 * para seguir el argumento: tablas de decisiones metodológicas, mapas de
 * fuentes, verificaciones.
 *
 * Existe desde el 11/09/2026 por glp1-open-payments. Era la pieza más larga del
 * sitio (18.000 px en un teléfono, el doble que seguro-hogar) y los replays
 * mostraron a dos lectores móviles que le dedicaron entre 4 y 7 minutos a las
 * primeras secciones y abandonaron en la zona de las primeras figuras. Las
 * dos tablas metodológicas pesaban un cuarto de la página y estaban en el
 * medio, entre la recomendación y los límites del análisis.
 *
 * Es un `<details>` nativo y no un acordeón con estado: no hidrata nada, se
 * abre sin JavaScript, y el navegador lo despliega solo cuando se busca texto
 * adentro con Ctrl+F o se navega a un ancla interna. Cerrado, su contenido no
 * cuenta para la altura del artículo, así que el 75% del `ReadTracker` mide
 * el argumento y no las tablas. La tabla de contenido salta los títulos que
 * quedan adentro (ver `PaperToc`).
 */
export function Annex({ title, hint, children }: AnnexProps) {
  return (
    <details
      data-annex
      className="group my-10 rounded-lg border border-border bg-muted/30 open:bg-transparent"
    >
      <summary className="cursor-pointer list-none px-5 py-4 [&::-webkit-details-marker]:hidden">
        <span className="flex items-start gap-3">
          <span
            aria-hidden
            className="mt-1 inline-block font-mono text-xs text-muted-foreground transition-transform group-open:rotate-90"
          >
            ▶
          </span>
          <span className="flex-1">
            <span className="block font-semibold">{title}</span>
            {hint && (
              <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                {hint}
              </span>
            )}
          </span>
        </span>
      </summary>
      <div className="border-t border-border px-5 pb-2 [&>h2:first-child]:mt-6">{children}</div>
    </details>
  );
}
