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
