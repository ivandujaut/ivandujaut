"use client";

import { useLayoutEffect, useRef, type DependencyList, type RefObject } from "react";
import { DESKTOP_QUERY, MOBILE_QUERY, REDUCED_MOTION_QUERY, gsap } from "./gsap";

export interface SectionAnimationContext<T extends HTMLElement> {
  /** Raíz de la sección. Los selectores de `gsap.context` quedan acotados a ella. */
  root: T;
  /** Selector acotado a la sección: `q(".indicator")` devuelve sólo los de esta sección. */
  q: (selector: string) => Element[];
  isDesktop: boolean;
  isMobile: boolean;
}

/**
 * Construye la animación de la sección. Puede devolver una limpieza extra para
 * lo que GSAP no revierte solo (por ejemplo, un `textContent` cambiado a mano).
 */
export type SectionAnimation<T extends HTMLElement> = (
  ctx: SectionAnimationContext<T>,
) => void | (() => void);

/**
 * Una timeline GSAP por sección, aislada y con limpieza.
 *
 * - `gsap.matchMedia` envuelve todo: al desmontar, o al cruzar el breakpoint,
 *   revierte tweens, ScrollTriggers y estilos inline (equivale a
 *   `gsap.context` + `revert`, pero además reacciona al viewport).
 * - Con `prefers-reduced-motion: reduce` no se construye nada: el contenido
 *   se sirve visible en HTML y las animaciones usan `gsap.from`, así que el
 *   estado final es el estático.
 * - Corre en `useLayoutEffect` para fijar el estado inicial antes del primer
 *   paint y evitar el flash de contenido que después "entra".
 */
export function useGsapSection<T extends HTMLElement>(
  animate: SectionAnimation<T>,
  deps: DependencyList = [],
): RefObject<T | null> {
  const ref = useRef<T>(null);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;

    const mm = gsap.matchMedia(root);
    mm.add(
      {
        isDesktop: DESKTOP_QUERY,
        isMobile: MOBILE_QUERY,
        reduceMotion: REDUCED_MOTION_QUERY,
      },
      (context) => {
        const conditions = context.conditions as
          { isDesktop: boolean; isMobile: boolean; reduceMotion: boolean } | undefined;
        if (!conditions || conditions.reduceMotion) return;
        const q = (selector: string) => gsap.utils.toArray<Element>(selector, root);
        return animate({
          root,
          q,
          isDesktop: conditions.isDesktop,
          isMobile: conditions.isMobile,
        });
      },
    );

    return () => mm.revert();
    // `animate` se define inline en cada sección; las dependencias reales
    // (datos, estado) las declara quien llama.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}
