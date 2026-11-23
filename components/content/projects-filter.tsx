"use client";

import { useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export interface ProjectsFacet {
  /** El valor que viaja en `?topic=` y el que marca cada tarjeta. */
  id: string;
  label: string;
  count: number;
  /** La bajada bajo las pestañas: el país y qué hay en ese mercado. */
  note?: ReactNode;
}

export interface FilteredItem {
  key: string;
  /** A qué pestaña pertenece la tarjeta. */
  facet: string;
  /** La tarjeta, ya renderizada en el servidor. */
  node: ReactNode;
}

export interface FilteredSection {
  id: string;
  title: string;
  items: FilteredItem[];
}

/** La pestaña que muestra todo junto. No es un tema, así que no sale de Velite. */
export const ALL_FACET = "todos";

/**
 * Cuántas tarjetas se muestran antes del "ver más". Con las piezas repartidas
 * en tres mercados, el único que pasa de seis es "todos": en los demás el
 * botón no aparece nunca, y eso está bien. El filtro es lo que mantiene la
 * página corta; el botón es el que evita que "todos" la estire de nuevo.
 */
const VISIBLE = 6;

/** El alto del navbar fijo (`h-14`), que es donde se pega la barra. */
const NAVBAR = 56;

/**
 * El mercado elegido vive en la URL y no en un `useState`.
 *
 * Es para que un link sirva de atajo: en un mensaje directo conviene mandar
 * "mirá los casos de salud" y no la lista entera. Y como la URL ya es estado
 * compartido, leerla con `useSyncExternalStore` evita la copia que habría que
 * mantener sincronizada a mano (y el `setState` dentro de un efecto, que el
 * compilador de React rechaza con razón).
 *
 * `getServerSnapshot` devuelve vacío: en el servidor no hay `location`, así
 * que el HTML sale siempre con el mercado por defecto y React re-renderiza
 * después de hidratar si la URL pedía otro.
 */
const oyentes = new Set<() => void>();

function suscribir(onChange: () => void) {
  oyentes.add(onChange);
  window.addEventListener("popstate", onChange);
  return () => {
    oyentes.delete(onChange);
    window.removeEventListener("popstate", onChange);
  };
}

const leerUrl = () => new URLSearchParams(window.location.search).get("topic") ?? "";
const leerServidor = () => "";

function escribirUrl(id: string, porDefecto: string) {
  const url = new URL(window.location.href);
  if (id === porDefecto) url.searchParams.delete("topic");
  else url.searchParams.set("topic", id);
  // `replaceState` y no `pushState`: cambiar de mercado no es navegar, y con
  // el historial lleno de filtros el botón de atrás deja de sacarte del sitio.
  window.history.replaceState(null, "", url);
  for (const onChange of oyentes) onChange();
}

interface ProjectsFilterProps {
  facets: ProjectsFacet[];
  /** Con qué pestaña abre la página. */
  initialFacet: string;
  sections: FilteredSection[];
}

/**
 * Las pestañas que filtran el listado por mercado, y el "ver más" de cada
 * sección.
 *
 * Las tarjetas llegan ya renderizadas desde el servidor (`node`), así que acá
 * no se vuelve cliente nada del contenido: los dieciséis enlaces están en el
 * HTML aunque sólo se vea un mercado, que es lo que mantiene el listado
 * rastreable y hace que el filtro no cueste SEO.
 *
 * Por qué `aria-pressed` y no un `role="tablist"`: estos botones no abren
 * paneles distintos, filtran una misma lista. Un lector de pantalla que
 * escucha "pestaña" espera poder moverse con las flechas entre paneles
 * hermanos; acá lo que cambia es cuántos elementos tiene una lista que sigue
 * siendo la misma.
 */
export function ProjectsFilter({ facets, initialFacet, sections }: ProjectsFilterProps) {
  const t = useTranslations("projects.index");
  const enUrl = useSyncExternalStore(suscribir, leerUrl, leerServidor);
  // Una URL con un mercado que no existe (un link viejo, un tema que se
  // separó) muestra el de siempre en vez de una página vacía.
  const facet = facets.some((f) => f.id === enUrl) ? enUrl : initialFacet;
  const activo = facets.find((f) => f.id === facet);
  // Desplegado por mercado y sección, así volver a un mercado que ya habías
  // abierto no te lo cierra de nuevo.
  const [expanded, setExpanded] = useState<string[]>([]);
  const reduced = useReducedMotion();
  // Marca dónde empieza el filtro en el flujo de la página, para saber si la
  // barra está pegada bajo el navbar o en su lugar.
  const ancla = useRef<HTMLDivElement>(null);

  function elegir(id: string) {
    escribirUrl(id, initialFacet);
    // Con la barra pegada, cambiar de mercado reemplaza la lista que tenés
    // debajo y te deja a mitad de otra. Se vuelve al principio del listado
    // para que lo primero que veas sea la pieza más nueva del mercado elegido.
    const top = ancla.current?.getBoundingClientRect().top;
    if (top !== undefined && top < NAVBAR) {
      window.scrollTo({
        top: window.scrollY + top - NAVBAR,
        behavior: reduced ? "auto" : "smooth",
      });
    }
  }

  // Un solo contenedor y no un fragmento: la página apila sus bloques con
  // `space-y-14`, y con un fragmento ese margen caía entre las pestañas, la
  // bajada y el listado, que tienen que leerse como una sola pieza.
  return (
    <div>
      {/* `casos-filtro` y `casos-fin` son hitos de `SectionTracker` (ver la
          página): llegó al filtro, y llegó al final del listado que estaba
          mirando. */}
      <div ref={ancla} id="casos-filtro" />
      {/*
        Pestañas sin caja: una línea de base y un subrayado que se desliza.
        Reemplazó al control segmentado del 18/11/2026, que en desktop dejaba
        121 px vacíos dentro de su caja y en mobile se partía en dos filas
        desparejas. Las etiquetas son cortas para que entren en una sola fila
        a 342 px; el país y lo que hay en cada mercado van en la bajada.

        Queda pegada bajo el navbar (`top-14`, sus 56 px) mientras dura el
        listado: con las portadas grandes, el filtro de "todos" quedaba miles
        de píxeles arriba de la última tarjeta.
      */}
      <div className="sticky top-14 z-30 -mx-6 bg-background/90 px-6 backdrop-blur supports-backdrop-filter:bg-background/75">
        <div
          className="flex gap-7 border-b border-foreground/10 max-sm:justify-between max-sm:gap-0"
          role="group"
          aria-label={t("filterLabel")}
        >
          {facets.map((f) => {
            const active = f.id === facet;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => elegir(f.id)}
                aria-pressed={active}
                data-ph="filter_click"
                data-ph-action="market"
                data-ph-facet={f.id}
                className={cn(
                  "relative py-3 text-base font-medium whitespace-nowrap transition-colors",
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {f.label}
                <span className="ml-1 align-[0.4em] font-mono text-[11px] font-normal tabular-nums">
                  {f.count}
                </span>
                {active && (
                  <motion.span
                    layoutId="projects-facet-line"
                    aria-hidden
                    className="absolute inset-x-0 -bottom-px h-0.5 bg-foreground"
                    transition={
                      reduced ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }
                    }
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {activo?.note && (
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground" aria-live="polite">
          {activo.note}
        </p>
      )}

      <div className="mt-8 space-y-14">
        {sections.map((section) => {
          const items =
            facet === ALL_FACET
              ? section.items
              : section.items.filter((item) => item.facet === facet);

          const abierta = `${facet}:${section.id}`;
          const isExpanded = expanded.includes(abierta);
          // Lo que no entra se esconde con CSS en vez de no renderizarse: así
          // los dieciséis enlaces están siempre en el HTML y el índice sigue
          // enlazando a todos los casos aunque se vea un solo mercado. Las
          // portadas escondidas no se descargan igual, porque `next/image`
          // las pide recién cuando entran en pantalla.
          const visible = new Set(
            (isExpanded ? items : items.slice(0, VISIBLE)).map((item) => item.key),
          );

          return (
            <section key={section.id} className={cn(items.length === 0 && "hidden")}>
              <h2 className="mb-6 text-lg font-semibold tracking-tight">{section.title}</h2>
              <div
                className={cn(
                  "grid gap-x-5 gap-y-9",
                  // Una sola pieza va a lo ancho. En la grilla de dos quedaba
                  // media tarjeta suelta con el hueco al lado, y se leía como
                  // una grilla a la que le falta algo.
                  visible.size > 1 && "sm:grid-cols-2",
                )}
              >
                {section.items.map((item) => (
                  <div key={item.key} className={cn("reveal", !visible.has(item.key) && "hidden")}>
                    {item.node}
                  </div>
                ))}
              </div>
              {items.length > VISIBLE && !isExpanded && (
                <button
                  type="button"
                  onClick={() => setExpanded((prev) => [...prev, abierta])}
                  data-ph="filter_click"
                  data-ph-action="expand"
                  data-ph-facet={facet}
                  className="mt-8 w-full rounded-lg border border-foreground/15 bg-foreground/[0.04] px-4 py-2.5 text-sm transition-colors hover:bg-foreground/[0.08]"
                >
                  {t("showAll", { count: items.length })}
                </button>
              )}
            </section>
          );
        })}
      </div>
      <div id="casos-fin" />
    </div>
  );
}
