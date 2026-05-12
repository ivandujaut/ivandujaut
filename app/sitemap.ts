import type { MetadataRoute } from "next";
import { getPosts, getProjects } from "@/lib/content";
import { SITE_URL, localePath, type Locale } from "@/lib/seo";

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

function buildLanguages(group: Translatable[], basePath: "/blog" | "/projects") {
  const byLocale = new Map<Locale, string>();
  for (const item of group) {
    byLocale.set(item.locale, `${SITE_URL}${localePath(item.locale, `${basePath}/${item.slug}`)}`);
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
    { path: "/about", priority: 0.7, changeFrequency: "monthly" },
  ];

  const locales: Locale[] = ["es", "en"];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.flatMap((route) => {
    const languages: Record<string, string> = {
      es: `${SITE_URL}${localePath("es", route.path)}`,
      en: `${SITE_URL}${localePath("en", route.path)}`,
      "x-default": `${SITE_URL}${localePath("es", route.path)}`,
    };
    return locales.map((locale) => ({
      url: `${SITE_URL}${localePath(locale, route.path)}`,
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
      url: `${SITE_URL}${localePath(post.locale, `/blog/${post.slug}`)}`,
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
      url: `${SITE_URL}${localePath(project.locale, `/projects/${project.slug}`)}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
      alternates: { languages },
    }));
  });

  return [...staticEntries, ...postEntries, ...projectEntries];
}
