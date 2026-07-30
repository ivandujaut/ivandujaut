"use client";

import * as React from "react";
import { motion, isMotionComponent, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Origen: Animate UI (`shadcn add @animate-ui/icons-*`).
 *
 * MODIFICACIÓN LOCAL: el `Slot` de upstream lee `children.type` antes de su
 * propio `isValidElement`, así que con children inválidos revienta en vez de
 * caer al guard. Ver el comentario dentro de `Slot`. Si actualizás desde el
 * registry hay que volver a aplicarlo a mano.
 */

type AnyProps = Record<string, unknown>;

type DOMMotionProps<T extends HTMLElement = HTMLElement> = Omit<
  HTMLMotionProps<keyof HTMLElementTagNameMap>,
  "ref"
> & { ref?: React.Ref<T> };

type WithAsChild<Base extends object> =
  | (Base & { asChild: true; children: React.ReactElement })
  | (Base & { asChild?: false | undefined });

type SlotProps<T extends HTMLElement = HTMLElement> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: any;
} & DOMMotionProps<T>;

function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]): React.RefCallback<T> {
  return (node) => {
    refs.forEach((ref) => {
      if (!ref) return;
      if (typeof ref === "function") {
        ref(node);
      } else {
        (ref as React.RefObject<T | null>).current = node;
      }
    });
  };
}

function mergeProps<T extends HTMLElement>(
  childProps: AnyProps,
  slotProps: DOMMotionProps<T>,
): AnyProps {
  const merged: AnyProps = { ...childProps, ...slotProps };

  if (childProps.className || slotProps.className) {
    merged.className = cn(childProps.className as string, slotProps.className as string);
  }

  if (childProps.style || slotProps.style) {
    merged.style = {
      ...(childProps.style as React.CSSProperties),
      ...(slotProps.style as React.CSSProperties),
    };
  }

  return merged;
}

function Slot<T extends HTMLElement = HTMLElement>({ children, ref, ...props }: SlotProps<T>) {
  // `children` puede no ser un elemento válido. Pasa cuando `asChild` se usa
  // desde un Server Component: los children que cruzan el borde servidor →
  // cliente no llegan materializados durante el SSR.
  //
  // El original leía `children.type` acá arriba y recién chequeaba
  // `isValidElement` después del `useMemo`, así que explotaba antes de llegar
  // al guard con "Cannot read properties of undefined (reading 'displayName')".
  // El guard no se puede subir tal cual porque `useMemo` es un hook y no puede
  // quedar detrás de un return condicional, así que resolvemos el tipo de forma
  // segura y el hook corre siempre.
  const isValidChild = React.isValidElement(children);
  const childType: React.ElementType | null = isValidChild
    ? (children.type as React.ElementType)
    : null;

  const isAlreadyMotion =
    typeof childType === "object" && childType !== null && isMotionComponent(childType);

  const Base = React.useMemo(
    () => (childType === null ? null : isAlreadyMotion ? childType : motion.create(childType)),
    [isAlreadyMotion, childType],
  );

  if (Base === null) {
    // El original devolvía `null` acá. Preferimos renderizar el hijo tal cual:
    // se pierde la animación, pero no desaparece contenido. En este sitio los
    // `asChild` envuelven CTAs (el botón del CV, la card de stats), y que un
    // CTA se esfume en silencio es peor falla que una animación que no corre.
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[animate-ui/Slot] `asChild` recibió children que no son un elemento válido. " +
          "Suele ser `AnimateIcon asChild` usado desde un Server Component: " +
          "usá la variante con wrapper (`<AnimateIcon className=...>`) o mové el " +
          'uso a un componente con "use client". Se renderiza el hijo sin animar.',
      );
    }
    return <>{children}</>;
  }

  const { ref: childRef, ...childProps } = children.props as AnyProps;

  const mergedProps = mergeProps(childProps, props);

  return <Base {...mergedProps} ref={mergeRefs(childRef as React.Ref<T>, ref)} />;
}

export { Slot, type SlotProps, type WithAsChild, type DOMMotionProps, type AnyProps };
