import { posts, projects } from "#site/content";

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
 * Devuelve las traducciones de un post (matched por translationKey).
 * Útil para el switcher de idioma en páginas de detail.
 */
export function getPostTranslations(post: { translationKey?: string; slug: string }) {
  if (!post.translationKey) return [];
  return posts.filter((p) => p.translationKey === post.translationKey && p.slug !== post.slug);
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
  return projects.filter(byLocale(locale)).filter(isVisible).sort(byYearDesc);
}

export function getFeaturedProjects(locale: Locale) {
  return getProjects(locale).filter((p) => p.featured);
}

export function getProjectBySlug(locale: Locale, slug: string) {
  return projects.find((p) => p.locale === locale && p.slug === slug);
}

export function getProjectTranslations(project: { translationKey?: string; slug: string }) {
  if (!project.translationKey) return [];
  return projects.filter(
    (p) => p.translationKey === project.translationKey && p.slug !== project.slug,
  );
}
