"use client";

import type { ReactNode } from "react";
import { track } from "@/lib/analytics";

interface ObfuscatedEmailTriggerProps {
  /** Email user reversed. Ej: para "dujautivan" pasar "navituajud". */
  userReversed: string;
  /** Email domain reversed. Ej: para "gmail.com" pasar "moc.liamg". */
  domainReversed: string;
  /** Contenido visible del trigger (texto, ícono, etc.). */
  children: ReactNode;
  /** aria-label necesario cuando children es solo un ícono. */
  label?: string;
  className?: string;
  /**
   * Dónde está este trigger (hero, footer, about, cierre del caso). El mail se
   * ofrece en cinco lugares distintos y sin esto todos los contactos se ven
   * iguales: la pregunta útil es cuál de esas superficies convierte.
   */
  surface?: string;
}

const rev = (s: string) => s.split("").reverse().join("");

/**
 * Botón que arma y abre `mailto:` recién al clickear, usando los
 * segmentos reversed pasados como props. El email nunca aparece
 * en el HTML SSR ni en el DOM hidratado — solo se construye en JS
 * dentro del handler y se asigna a `window.location.href`.
 *
 * Bots que grepean `mailto:` o el patrón usuario@dominio en el HTML
 * no encuentran nada. Bots que ejecutan JS y simulan clicks sobre
 * todos los botones eventualmente sí, pero el objetivo es filtrar el
 * ruido masivo de spam, no proveer secrecy absoluta.
 */
export function ObfuscatedEmailTrigger({
  userReversed,
  domainReversed,
  children,
  label,
  className,
  surface,
}: ObfuscatedEmailTriggerProps) {
  const openMail = () => {
    // El evento va antes de la navegación: `window.location.href` con un
    // `mailto:` puede desmontar la página antes de que salga la request.
    // El mail no se manda como propiedad, obviamente: es el propio.
    track("contact_click", { kind: "email", surface: surface ?? "unknown" });
    const email = `${rev(userReversed)}@${rev(domainReversed)}`;
    window.location.href = `mailto:${email}`;
  };

  return (
    <button
      type="button"
      onClick={openMail}
      aria-label={label}
      className={`cursor-pointer ${className ?? ""}`}
    >
      {children}
    </button>
  );
}
