import { getPosts } from "@/lib/content";
import { SITE_URL, localePath, type Locale } from "@/lib/seo";
import { routing } from "@/i18n/routing";

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

  const posts = getPosts(locale);
  const channelTitle = locale === "es" ? "Iván Dujaut · Blog" : "Iván Dujaut · Blog";
  const channelDescription =
    locale === "es"
      ? "Pensamientos sobre desarrollo, aprendizaje y vida."
      : "Thoughts on development, learning and life.";
  const channelLink = `${SITE_URL}${localePath(locale, "/blog")}`;
  const feedUrl = `${SITE_URL}${localePath(locale, "/rss.xml")}`;
  const language = locale === "es" ? "es-AR" : "en-US";
  const lastBuildDate = (posts[0]?.updated ?? posts[0]?.date ?? new Date().toISOString()) as string;

  const items = posts
    .map((post) => {
      const postUrl = `${SITE_URL}${localePath(locale, `/blog/${post.slug}`)}`;
      const pubDate = new Date(post.date).toUTCString();
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(post.description)}</description>
${(post.tags ?? []).map((tag) => `      <category>${escapeXml(tag)}</category>`).join("\n")}
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
