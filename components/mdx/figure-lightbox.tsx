"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal, flushSync } from "react-dom";
import Image from "next/image";

interface FigureLightboxProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  /**
   * El mismo `sizes` que usa la miniatura, para que la copia ampliada pida el
   * candidato ya cacheado y el morph de apertura no salte esperando la descarga.
   */
  sizes: string;
  openLabel: string;
  closeLabel: string;
  children: ReactNode;
}

/**
 * Abre la imagen de una figura ampliada al click, con la transición nativa del
 * navegador (View Transitions API): la miniatura se transforma en la imagen
 * grande en vez de aparecer una nueva.
 *
 * El morph lo hace el `view-transition-name` compartido entre la miniatura y la
 * copia ampliada. Sólo uno de los dos lo lleva en cada snapshot —la miniatura
 * cuando está cerrado, la copia cuando está abierto—, que es la condición para
 * que el navegador los una. El nombre es único por figura (`useId`) para que
 * abrir una no choque con las miniaturas de las otras.
 *
 * Next.js activa la feature con `experimental.viewTransition` (ya en
 * next.config.ts). React expone `<ViewTransition>` pensado para navegación y no
 * se dispara con un `setState` normal, así que acá se usa la API imperativa que
 * está debajo: `document.startViewTransition` envuelve un `flushSync` para que
 * React confirme el cambio de DOM antes de que el navegador saque la segunda
 * foto. Sin soporte o con `prefers-reduced-motion`, el cambio es instantáneo,
 * que es la degradación que recomienda la guía de Next.
 */
export function FigureLightbox({
  src,
  alt,
  width,
  height,
  sizes,
  openLabel,
  closeLabel,
  children,
}: FigureLightboxProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const vtName = `fig-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

  // Cambia el estado dentro de una view transition cuando el navegador la
  // soporta y el usuario no pidió menos movimiento. `flushSync` es obligatorio:
  // el navegador saca la foto "después" apenas vuelve el callback, así que el
  // DOM ya tiene que estar actualizado.
  const withTransition = (update: () => void) => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof document === "undefined" || !document.startViewTransition) {
      update();
      return;
    }
    document.startViewTransition(() => flushSync(update));
  };

  // Al abrir, la copia ampliada usa el mismo candidato que la miniatura, que ya
  // está en caché. Decodificarlo antes de arrancar la transición garantiza que
  // la segunda foto del morph tenga el bitmap listo, sin el salto que se ve
  // cuando el navegador todavía lo está decodificando.
  const openLightbox = async () => {
    const img = triggerRef.current?.querySelector("img");
    try {
      await img?.decode();
    } catch {
      // Imagen aún sin cargar: abrimos igual, sólo sin la garantía de fluidez.
    }
    withTransition(() => setOpen(true));
  };

  useEffect(() => {
    if (!open) return;
    // El botón que abrió: se guarda al entrar al efecto para devolverle el foco
    // al cerrar, sin leer el ref en el cleanup (donde ya podría haber cambiado).
    const trigger = triggerRef.current;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") withTransition(() => setOpen(false));
    };
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      document.documentElement.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
      trigger?.focus({ preventScroll: true });
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={openLabel}
        onClick={openLightbox}
        className="block w-full cursor-zoom-in rounded-[inherit] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        // La miniatura sólo lleva el nombre cuando está cerrada; con el overlay
        // abierto lo lleva la copia ampliada, y no pueden coincidir.
        style={{ viewTransitionName: open ? undefined : vtName }}
      >
        {children}
      </button>

      {open &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={alt}
            className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center p-4 sm:p-8"
            onClick={() => withTransition(() => setOpen(false))}
          >
            <div className="absolute inset-0 bg-black/90" />
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              sizes={sizes}
              loading="eager"
              className="relative max-h-[88vh] w-auto max-w-[94vw] rounded-lg object-contain shadow-2xl"
              style={{ viewTransitionName: vtName }}
            />
            <button
              ref={closeRef}
              type="button"
              aria-label={closeLabel}
              onClick={(e) => {
                e.stopPropagation();
                withTransition(() => setOpen(false));
              }}
              className="absolute right-4 top-4 rounded-full bg-black/50 p-2 text-white/90 transition-colors hover:bg-black/70 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>,
          document.body,
        )}
    </>
  );
}
