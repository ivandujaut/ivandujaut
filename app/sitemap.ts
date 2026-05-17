import type { MetadataRoute } from "next";
import { getPosts, getProjects, getResearch } from "@/lib/content";
import { SITE_URL, localePath, type Locale } from "@/lib/seo";

// TODO: flip to true when /research has published content. Keeps the section
// out of the sitemap (and out of search engines) while the routes 404.
const RESEARCH_ENABLED = false;

// Construye URLs absolutas para el sitemap manteniendo la misma forma que
// los canonicals emitidos por Next.js: el root sin trailing slash, para que
// Search Console no reporte inconsistencias entre `<loc>` y `rel="canonical"`.
function absoluteUrl(locale: Locale, pathWithoutLocale: string): string {
  const path = localePath(locale, pathWithoutLocale);
  return `${SITE_URL}${path === "/" ? "" : path}`;
}

type Translatable = { locale: Locale; slug: string; translationKey?: string };

function groupByTranslationKey<T extends Translatable>(items: T[]): T[][] {
  const groups = new Map<string, T[]>();
  for (const item of items) {
    const key = item.translationKey ?? `__solo__${item.locale}__${item.slug}`;
    const bucket = groups.get(key);
    if (bucket) bucket.push(item);
    else groups.set(key, [item]);
  }
  return [...groups.values()];
}

function buildLanguages(group: Translatable[], basePath: "/blog" | "/projects" | "/research") {
  const byLocale = new Map<Locale, string>();
  for (const item of group) {
    byLocale.set(item.locale, absoluteUrl(item.locale, `${basePath}/${item.slug}`));
  }
  const languages: Record<string, string> = {};
  const es = byLocale.get("es");
  const en = byLocale.get("en");
  if (es) languages.es = es;
  if (en) languages.en = en;
  languages["x-default"] = es ?? en!;
  return languages;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: Array<{
    path: string;
    priority: number;
    changeFrequency: "daily" | "weekly" | "monthly";
  }> = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" },
    { path: "/blog", priority: 0.8, changeFrequency: "weekly" },
    { path: "/projects", priority: 0.8, changeFrequency: "monthly" },
    ...(RESEARCH_ENABLED
      ? ([{ path: "/research", priority: 0.8, changeFrequency: "monthly" }] as const)
      : []),
    { path: "/about", priority: 0.7, changeFrequency: "monthly" },
  ];

  const locales: Locale[] = ["es", "en"];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.flatMap((route) => {
    const languages: Record<string, string> = {
      es: absoluteUrl("es", route.path),
      en: absoluteUrl("en", route.path),
      "x-default": absoluteUrl("es", route.path),
    };
    return locales.map((locale) => ({
      url: absoluteUrl(locale, route.path),
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: { languages },
    }));
  });

  const posts = [...getPosts("es"), ...getPosts("en")];
  const postGroups = groupByTranslationKey(posts);
  const postEntries: MetadataRoute.Sitemap = postGroups.flatMap((group) => {
    const languages = buildLanguages(group, "/blog");
    return group.map((post) => ({
      url: absoluteUrl(post.locale, `/blog/${post.slug}`),
      lastModified: new Date(post.updated ?? post.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
      alternates: { languages },
    }));
  });

  const projects = [...getProjects("es"), ...getProjects("en")];
  const projectGroups = groupByTranslationKey(projects);
  const projectEntries: MetadataRoute.Sitemap = projectGroups.flatMap((group) => {
    const languages = buildLanguages(group, "/projects");
    return group.map((project) => ({
      url: absoluteUrl(project.locale, `/projects/${project.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
      alternates: { languages },
    }));
  });

  const paperEntries: MetadataRoute.Sitemap = RESEARCH_ENABLED
    ? groupByTranslationKey([...getResearch("es"), ...getResearch("en")]).flatMap((group) => {
        const languages = buildLanguages(group, "/research");
        return group.map((paper) => ({
          url: absoluteUrl(paper.locale, `/research/${paper.slug}`),
          lastModified: now,
          changeFrequency: "monthly" as const,
          priority: 0.6,
          alternates: { languages },
        }));
      })
    : [];

  return [...staticEntries, ...postEntries, ...projectEntries, ...paperEntries];
}
