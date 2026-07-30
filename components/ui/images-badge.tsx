"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Origen: Aceternity UI (`shadcn add @aceternity/images-badge`).
 *
 * MODIFICACIONES LOCALES respecto del original. Si actualizás desde el
 * registry, hay que volver a aplicarlas a mano:
 *
 * 1. Táctil. El original es hover puro (`onMouseEnter`/`onMouseLeave`), así que
 *    en mobile el abanico no se abría nunca. Ahora el primer tap lo abre y el
 *    segundo navega, y un tap afuera lo cierra.
 * 2. Teclado. Se abre también con foco, así que quien navega con Tab ve las
 *    imágenes en vez de un link mudo.
 * 3. `next/image` en lugar de `<img>`. Las previews se muestran a ~140px pero
 *    los archivos originales pesan cientos de KB; sin optimizar se bajaba el
 *    PNG completo.
 * 4. `alt` por imagen. El original hardcodea "Preview 1/2/3", que no dice nada.
 * 5. `revealOnInteraction`. Permite apagar el reveal y dejar el badge como link
 *    común. Se usa en viewports chicos, donde el abanico no entra a un tamaño
 *    en el que las imágenes se entiendan (ver el comentario en `hero.tsx`).
 */
interface PreviewImage {
  src: string;
  alt: string;
}

interface ImagesBadgeProps {
  text: string;
  images: PreviewImage[];
  className?: string;
  /** Optional link URL */
  href?: string;
  /** Link target attribute (e.g., "_blank" for new tab) */
  target?: string;
  /** Folder dimensions { width, height } in pixels */
  folderSize?: { width: number; height: number };
  /** Image dimensions when teased (peeking) { width, height } in pixels */
  teaserImageSize?: { width: number; height: number };
  /** Image dimensions when hovered { width, height } in pixels */
  hoverImageSize?: { width: number; height: number };
  /** How far images translate up on hover in pixels */
  hoverTranslateY?: number;
  /** How far images spread horizontally on hover in pixels */
  hoverSpread?: number;
  /** Rotation angle for fanned images on hover in degrees */
  hoverRotation?: number;
  /**
   * Si es `false`, el badge no revela nada: queda como un link común con las
   * imágenes asomando de la carpeta. Para cuando el abanico no entra a un
   * tamaño en que las imágenes se lean, y abrirlo sería pedir una interacción
   * que no devuelve información.
   */
  revealOnInteraction?: boolean;
}

export function ImagesBadge({
  text,
  images,
  className,
  href,
  target,
  folderSize = { width: 32, height: 24 },
  teaserImageSize = { width: 20, height: 14 },
  hoverImageSize = { width: 48, height: 32 },
  hoverTranslateY = -35,
  hoverSpread = 20,
  hoverRotation = 15,
  revealOnInteraction = true,
}: ImagesBadgeProps) {
  const [isHovered, setIsHovered] = useState(false);
  // En táctil el abanico queda "pegado" hasta que se toque afuera o se navegue.
  const openedByTouchRef = useRef(false);
  const rootRef = useRef<HTMLElement>(null);
  // `pointerdown` siempre llega antes que `click` y trae el `pointerType`, así
  // que el tipo de puntero lo guardamos acá. Mirar el evento de click no sirve:
  // en varios browsers el click táctil llega como `MouseEvent` sin
  // `pointerType`, y un `instanceof` falla además entre realms.
  const lastPointerTypeRef = useRef<string>("mouse");

  // Un tap afuera cierra el abanico abierto por táctil. No se registra el
  // listener si no hay nada abierto por táctil, así que en desktop no cuesta.
  useEffect(() => {
    if (!revealOnInteraction || !isHovered || !openedByTouchRef.current) return;

    function handlePointerDownOutside(event: PointerEvent) {
      if (rootRef.current?.contains(event.target as Node)) return;
      openedByTouchRef.current = false;
      setIsHovered(false);
    }

    document.addEventListener("pointerdown", handlePointerDownOutside);
    return () => document.removeEventListener("pointerdown", handlePointerDownOutside);
  }, [isHovered, revealOnInteraction]);

  function handlePointerEnter(event: React.PointerEvent<HTMLElement>) {
    // Un tap dispara pointerenter además de click. Lo ignoramos para que la
    // apertura en táctil la maneje el click y el primer tap no navegue.
    if (!revealOnInteraction || event.pointerType === "touch") return;
    setIsHovered(true);
  }

  function handlePointerLeave(event: React.PointerEvent<HTMLElement>) {
    if (!revealOnInteraction || event.pointerType === "touch") return;
    setIsHovered(false);
  }

  function handlePointerDown(event: React.PointerEvent<HTMLElement>) {
    lastPointerTypeRef.current = event.pointerType || "mouse";
  }

  function handleClick(event: React.MouseEvent<HTMLElement>) {
    // Solo interceptamos el táctil. Con mouse el hover ya mostró las imágenes y
    // con teclado las mostró el foco (`detail === 0` es Enter/Space, que no
    // viene precedido de ningún pointerdown), así que en esos casos el click
    // navega de una y nadie tiene que activar dos veces.
    const isKeyboardActivation = event.detail === 0;
    if (
      !revealOnInteraction ||
      isKeyboardActivation ||
      lastPointerTypeRef.current !== "touch" ||
      isHovered
    ) {
      return;
    }
    // Primer tap: mostrar el abanico en vez de navegar.
    event.preventDefault();
    openedByTouchRef.current = true;
    setIsHovered(true);
  }

  // Limit to max 3 images
  const displayImages = images.slice(0, 3);

  // Calculate folder tab dimensions proportionally
  const tabWidth = folderSize.width * 0.375;
  const tabHeight = folderSize.height * 0.25;

  const Component = href ? "a" : "div";

  return (
    <Component
      ref={rootRef as React.Ref<never>}
      href={href}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      className={cn(
        "inline-flex cursor-pointer items-center gap-2 perspective-[1000px] transform-3d",
        className,
      )}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      onFocus={() => revealOnInteraction && setIsHovered(true)}
      onBlur={() => {
        openedByTouchRef.current = false;
        setIsHovered(false);
      }}
    >
      {/* Folder Container */}
      <motion.div
        className="relative"
        style={{
          width: folderSize.width,
          height: folderSize.height,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Folder Back */}
        <div className="absolute inset-0 rounded-lg bg-linear-to-b from-amber-400 to-amber-500 shadow-sm dark:from-amber-500 dark:to-amber-600">
          {/* Folder Tab */}
          <div
            className="absolute left-0.5 rounded-t-[2px] bg-linear-to-b from-amber-300 to-amber-400 dark:from-amber-400 dark:to-amber-500"
            style={{
              top: -tabHeight * 0.65,
              width: tabWidth,
              height: tabHeight,
            }}
          />
        </div>

        {/* Images that pop out */}
        {displayImages.map((image, index) => {
          const totalImages = displayImages.length;

          // Calculate rotation based on index
          const baseRotation =
            totalImages === 1
              ? 0
              : totalImages === 2
                ? (index - 0.5) * hoverRotation
                : (index - 1) * hoverRotation;

          // Hover positions - fan out
          const hoverY = hoverTranslateY - (totalImages - 1 - index) * 3;
          const hoverX =
            totalImages === 1
              ? 0
              : totalImages === 2
                ? (index - 0.5) * hoverSpread
                : (index - 1) * hoverSpread;

          // Teaser positions - slight peek from folder
          const teaseY = -4 - (totalImages - 1 - index) * 1;
          const teaseRotation =
            totalImages === 1 ? 0 : totalImages === 2 ? (index - 0.5) * 3 : (index - 1) * 3;

          return (
            <motion.div
              key={index}
              className="absolute top-0.5 left-1/2 origin-bottom overflow-hidden rounded-[3px] bg-white shadow-sm ring-1 shadow-black/10 ring-black/10 dark:bg-neutral-800 dark:shadow-white/10 dark:ring-white/10"
              animate={{
                x: `calc(-50% + ${isHovered ? hoverX : 0}px)`,
                y: isHovered ? hoverY : teaseY,
                rotate: isHovered ? baseRotation : teaseRotation,
                width: isHovered ? hoverImageSize.width : teaserImageSize.width,
                height: isHovered ? hoverImageSize.height : teaserImageSize.height,
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 25,
                delay: index * 0.03,
              }}
              style={{
                zIndex: 10 + index,
              }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={hoverImageSize.width}
                height={hoverImageSize.height}
                className="h-full w-full object-cover"
              />
            </motion.div>
          );
        })}

        {/* Folder Front (flattens on hover) */}
        <motion.div
          className="absolute inset-x-0 bottom-0 h-[85%] origin-bottom rounded-lg bg-linear-to-b from-amber-300 to-amber-400 shadow-sm dark:from-amber-400 dark:to-amber-500"
          animate={{
            rotateX: isHovered ? -45 : -25,
            scaleY: isHovered ? 0.8 : 1,
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 25,
          }}
          style={{
            transformStyle: "preserve-3d",
            zIndex: 20,
          }}
        >
          {/* Folder line detail */}
          <div className="absolute top-1 right-1 left-1 h-px bg-amber-200/50 dark:bg-amber-300/50" />
        </motion.div>
      </motion.div>

      {/* Text */}
      <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">{text}</span>
    </Component>
  );
}
