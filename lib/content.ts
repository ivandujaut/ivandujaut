import { posts, projects, research } from "#site/content";

type Locale = "es" | "en";

// ============================================================================
// Filtros base reutilizables
// ============================================================================

const isVisible = <T extends { draft: boolean }>(item: T): boolean =>
  process.env.NODE_ENV === "development" || !item.draft;

const byLocale =
  <T extends { locale: string }>(locale: Locale) =>
  (item: T): boolean =>
    item.locale === locale;

const byDateDesc = <T extends { date: string }>(a: T, b: T): number =>
  +new Date(b.date) - +new Date(a.date);

const byYearDesc = <T extends { year: number }>(a: T, b: T): number => b.year - a.year;

// ============================================================================
// Posts
// ============================================================================

export function getPosts(locale: Locale) {
  return posts.filter(byLocale(locale)).filter(isVisible).sort(byDateDesc);
}

export function getPostBySlug(locale: Locale, slug: string) {
  return posts.find((p) => p.locale === locale && p.slug === slug);
}

/**
 * Busca un post por slug ignorando el locale.
 * Útil para detectar el caso en que el usuario llega con un slug que existe
 * en otro idioma (por ejemplo, /en/blog/hola-mundo).
 */
export function findPostInAnyLocale(slug: string) {
  return posts.find((p) => p.slug === slug);
}

/**
 * Dado un translationKey, busca su versión en el locale solicitado.
 * Devuelve undefined si no hay traducción en ese idioma.
 */
export function findTranslatedPostInLocale(translationKey: string | undefined, locale: Locale) {
  if (!translationKey) return undefined;
  return posts.find((p) => p.translationKey === translationKey && p.locale === locale);
}

/**
 * Devuelve las traducciones de un post (matched por translationKey).
 * Útil para el switcher de idioma en páginas de detail.
 */
export function getPostTranslations(post: { translationKey?: string; locale: Locale }) {
  if (!post.translationKey) return [];
  return posts.filter((p) => p.translationKey === post.translationKey && p.locale !== post.locale);
}

/**
 * Posts relacionados al actual dentro del mismo locale.
 * Scoring: cantidad de tags en común (desempate por fecha desc).
 * Si no hay overlap suficiente, completa con los más recientes del mismo locale.
 */
export function getRelatedPosts(
  current: { locale: Locale; slug: string; tags?: string[] },
  limit = 3,
) {
  const sameLocale = getPosts(current.locale).filter((p) => p.slug !== current.slug);
  const currentTags = new Set(current.tags ?? []);

  const scored = sameLocale.map((post) => {
    const overlap = post.tags.filter((tag) => currentTags.has(tag)).length;
    return { post, overlap };
  });

  scored.sort((a, b) => {
    if (b.overlap !== a.overlap) return b.overlap - a.overlap;
    return +new Date(b.post.date) - +new Date(a.post.date);
  });

  return scored.slice(0, limit).map((entry) => entry.post);
}

// ============================================================================
// Projects
// ============================================================================

export function getProjects(locale: Locale) {
  return projects.filter(byLocale(locale)).filter(isVisible).sort(byDateDesc);
}

export function getFeaturedProjects(locale: Locale) {
  return getProjects(locale).filter((p) => p.featured);
}

export function getProjectBySlug(locale: Locale, slug: string) {
  return projects.find((p) => p.locale === locale && p.slug === slug);
}

export function findProjectInAnyLocale(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function findTranslatedProjectInLocale(translationKey: string | undefined, locale: Locale) {
  if (!translationKey) return undefined;
  return projects.find((p) => p.translationKey === translationKey && p.locale === locale);
}

export function getProjectTranslations(project: { translationKey?: string; locale: Locale }) {
  if (!project.translationKey) return [];
  return projects.filter(
    (p) => p.translationKey === project.translationKey && p.locale !== project.locale,
  );
}

/**
 * Casos vecinos en el listado, para que un caso de estudio no termine en un
 * callejón sin salida.
 *
 * "next" es el siguiente en el orden del listado (más viejo, porque ordenamos
 * por fecha descendente) y "previous" el anterior (más nuevo). Devuelve
 * `undefined` en los extremos; con un solo caso publicado, ambos son
 * `undefined`.
 */
export function getAdjacentProjects(locale: Locale, slug: string) {
  const all = getProjects(locale);
  const index = all.findIndex((p) => p.slug === slug);

  if (index === -1) return { previous: undefined, next: undefined };

  return {
    previous: index > 0 ? all[index - 1] : undefined,
    next: index < all.length - 1 ? all[index + 1] : undefined,
  };
}

// ============================================================================
// Research (paper-style long-form)
// ============================================================================

export function getResearch(locale: Locale) {
  return research.filter(byLocale(locale)).filter(isVisible).sort(byYearDesc);
}

export function getFeaturedResearch(locale: Locale) {
  return getResearch(locale).filter((r) => r.featured);
}

export function getResearchBySlug(locale: Locale, slug: string) {
  return research.find((r) => r.locale === locale && r.slug === slug);
}

export function findResearchInAnyLocale(slug: string) {
  return research.find((r) => r.slug === slug);
}

export function findTranslatedResearchInLocale(translationKey: string | undefined, locale: Locale) {
  if (!translationKey) return undefined;
  return research.find((r) => r.translationKey === translationKey && r.locale === locale);
}

export function getResearchTranslations(paper: { translationKey?: string; locale: Locale }) {
  if (!paper.translationKey) return [];
  return research.filter(
    (r) => r.translationKey === paper.translationKey && r.locale !== paper.locale,
  );
}
