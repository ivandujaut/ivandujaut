import { getPosts, getProjects } from "@/lib/content";
import { SITE_URL, localePath, type Locale } from "@/lib/seo";
import { routing } from "@/i18n/routing";
import esMessages from "@/messages/es.json";
import enMessages from "@/messages/en.json";

/** Los mismos rótulos que muestra el sitio, para no escribirlos de nuevo. */
const KIND_LABELS = {
  es: esMessages.projects.kind,
  en: enMessages.projects.kind,
} as const;

type FeedItem = {
  title: string;
  description: string;
  url: string;
  date: string;
  lastTouched: string;
  categories: string[];
};

interface RouteContext {
  params: Promise<{ locale: string }>;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function isLocale(value: string): value is Locale {
  return (routing.locales as readonly string[]).includes(value);
}

export async function GET(_: Request, context: RouteContext) {
  const { locale } = await context.params;

  if (!isLocale(locale)) {
    return new Response("Not found", { status: 404 });
  }

  // El feed llevaba solo el blog, que está parado desde mayo, mientras todo lo
  // publicado después son casos. Un suscriptor veía el sitio muerto.
  const feedItems: FeedItem[] = [
    ...getPosts(locale).map((post) => ({
      title: post.title,
      description: post.description,
      url: `${SITE_URL}${localePath(locale, `/blog/${post.slug}`)}`,
      date: post.date,
      lastTouched: (post.updated ?? post.date) as string,
      categories: post.tags ?? [],
    })),
    ...getProjects(locale).map((project) => ({
      title: project.title,
      description: project.description,
      url: `${SITE_URL}${localePath(locale, `/projects/${project.slug}`)}`,
      date: project.date,
      lastTouched: project.date,
      // El tipo de pieza es lo que le sirve saber a quien lee el feed: si es un
      // análisis de un producto ajeno o algo que construí. El stack queda
      // afuera a propósito, que ahí es ruido.
      categories: [KIND_LABELS[locale][project.kind]],
    })),
  ].sort((a, b) => +new Date(b.date) - +new Date(a.date));

  const channelTitle = "Iván Dujaut";
  const channelDescription =
    locale === "es"
      ? "Análisis de producto, casos de lo que construyo y notas del blog."
      : "Product analysis, cases of what I build, and posts from the blog.";
  // El canal apunta a la raíz y ya no a /blog: el feed cruza las dos secciones.
  const channelLink = `${SITE_URL}${localePath(locale, "/")}`;
  const feedUrl = `${SITE_URL}${localePath(locale, "/rss.xml")}`;
  const language = locale === "es" ? "es-AR" : "en-US";
  const lastBuildDate = feedItems[0]?.lastTouched ?? new Date().toISOString();

  const items = feedItems
    .map((item) => {
      const pubDate = new Date(item.date).toUTCString();
      return `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${item.url}</link>
      <guid isPermaLink="true">${item.url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(item.description)}</description>
${item.categories.map((c) => `      <category>${escapeXml(c)}</category>`).join("\n")}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(channelTitle)}</title>
    <link>${channelLink}</link>
    <description>${escapeXml(channelDescription)}</description>
    <language>${language}</language>
    <lastBuildDate>${new Date(lastBuildDate).toUTCString()}</lastBuildDate>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
