import { BLOG_LISTED, CASEBOOK_LISTED } from "@/lib/features";

/**
 * Los links del nav, compartidos por la versión de escritorio y la de
 * celular. Estaban duplicados en los dos componentes, y apagar una sección
 * en uno solo dejaba los dos menús distintos.
 *
 * Research sigue afuera hasta que tenga contenido publicado (ver
 * `RESEARCH_ENABLED` en `lib/features.ts`); la ruta responde igual.
 */
export const NAV_LINKS = [
  { href: "/", labelKey: "home" },
  ...(BLOG_LISTED ? [{ href: "/blog", labelKey: "blog" }] : []),
  { href: "/projects", labelKey: "projects" },
  ...(CASEBOOK_LISTED ? [{ href: "/casebook", labelKey: "casebook" }] : []),
  { href: "/about", labelKey: "about" },
] as const;
