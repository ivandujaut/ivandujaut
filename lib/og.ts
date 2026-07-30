/**
 * Helpers para construir URLs del endpoint /api/og.
 *
 * Centraliza la lógica de construcción de URLs OG para que cada página
 * solo tenga que llamar al helper correspondiente con los datos del contenido.
 *
 * El endpoint /api/og acepta el parámetro `template` que determina qué layout
 * usar (post, project, default) y otros parámetros específicos del contenido.
 */

import { appendSignature } from "@/lib/og-sign";

export function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

/**
 * Construye URL OG para un blog post.
 */
export function buildPostOgUrl(params: {
  title: string;
  description?: string;
  date?: string;
  readingTime?: number | string;
  tags?: string[];
  coverUrl?: string;
  locale: "es" | "en";
  theme?: "light" | "dark";
}): string {
  const baseUrl = getBaseUrl();
  const searchParams = new URLSearchParams({
    template: "post",
    title: params.title,
    locale: params.locale,
  });

  if (params.theme) {
    searchParams.set("theme", params.theme);
  }

  if (params.description) {
    searchParams.set("description", params.description);
  }
  if (params.date) {
    searchParams.set("date", params.date);
  }
  if (params.readingTime !== undefined) {
    const rt =
      typeof params.readingTime === "number" ? `${params.readingTime} min` : params.readingTime;
    searchParams.set("readingTime", rt);
  }
  if (params.tags && params.tags.length > 0) {
    searchParams.set("tags", params.tags.join(","));
  }
  if (params.coverUrl) {
    searchParams.set("coverUrl", params.coverUrl);
  }

  return `${baseUrl}/api/og?${appendSignature(searchParams).toString()}`;
}

/**
 * Construye URL OG para un project.
 */
export function buildProjectOgUrl(params: {
  title: string;
  description?: string;
  stack?: string[];
  status?: "shipped" | "in-progress" | "archived" | "concept";
  kind?: "build" | "case-study" | "design";
  coverUrl?: string;
  locale: "es" | "en";
  theme?: "light" | "dark";
}): string {
  const baseUrl = getBaseUrl();
  const searchParams = new URLSearchParams({
    template: "project",
    title: params.title,
    locale: params.locale,
  });

  if (params.theme) {
    searchParams.set("theme", params.theme);
  }

  if (params.description) {
    searchParams.set("description", params.description);
  }
  if (params.stack && params.stack.length > 0) {
    searchParams.set("stack", params.stack.join(","));
  }
  if (params.status) {
    searchParams.set("status", params.status);
  }
  if (params.kind) {
    searchParams.set("kind", params.kind);
  }
  if (params.coverUrl) {
    searchParams.set("coverUrl", params.coverUrl);
  }

  return `${baseUrl}/api/og?${appendSignature(searchParams).toString()}`;
}

/**
 * Construye URL OG default (home, about, list pages, 404, etc).
 */
export function buildDefaultOgUrl(params: {
  title?: string;
  description?: string;
  locale: "es" | "en";
  theme?: "light" | "dark";
}): string {
  const baseUrl = getBaseUrl();
  const searchParams = new URLSearchParams({
    template: "default",
    locale: params.locale,
  });

  if (params.theme) {
    searchParams.set("theme", params.theme);
  }
  if (params.title) {
    searchParams.set("title", params.title);
  }
  if (params.description) {
    searchParams.set("description", params.description);
  }

  return `${baseUrl}/api/og?${appendSignature(searchParams).toString()}`;
}

/**
 * Formatea una fecha según locale para mostrar en OG y metadata.
 */
export function formatOgDate(date: string | Date, locale: "es" | "en"): string {
  return new Date(date).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Construye URL absoluta para el cover de un post.
 * El cover viene de Velite como path relativo (/static/...), lo convertimos
 * a URL absoluta usando el dominio configurado.
 */
export function buildCoverUrl(coverSrc: string | undefined): string | undefined {
  if (!coverSrc) return undefined;
  const baseUrl = getBaseUrl();
  // Si ya es absoluta, devolverla tal cual
  if (coverSrc.startsWith("http")) return coverSrc;
  return `${baseUrl}${coverSrc}`;
}
