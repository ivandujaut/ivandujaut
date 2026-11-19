"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ScrollTrigger } from "../../_template/lib/gsap";

/**
 * Contenido plegado con `<details>`. Al abrirlo cambia el alto de la página:
 * ScrollTrigger tiene que recalcular dónde empieza cada animación, si no las
 * entradas de lo que estaba cerrado (o de lo que viene después) se disparan
 * en el lugar equivocado.
 *
 * Con `openOnHash`, se abre solo si el link apunta a ese id (por ejemplo
 * `/despegar#tablero`), así un link directo a una sección del anexo sigue
 * llevando a la sección y no a un renglón cerrado.
 */
export function Fold({
  summary,
  children,
  className,
  summaryClassName,
  openOnHash,
}: {
  summary: ReactNode;
  children: ReactNode;
  className?: string;
  summaryClassName?: string;
  openOnHash?: string;
}) {
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    if (!openOnHash) return;
    const check = () => {
      const details = ref.current;
      if (!details || window.location.hash !== `#${openOnHash}`) return;
      details.open = true;
      requestAnimationFrame(() => document.getElementById(openOnHash)?.scrollIntoView());
    };
    check();
    window.addEventListener("hashchange", check);
    return () => window.removeEventListener("hashchange", check);
  }, [openOnHash]);

  return (
    <details ref={ref} className={className} onToggle={() => ScrollTrigger.refresh()}>
      <summary className={summaryClassName}>{summary}</summary>
      {children}
    </details>
  );
}
