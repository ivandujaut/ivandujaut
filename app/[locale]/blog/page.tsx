import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { getPosts } from "@/lib/content";
import { PostListItem } from "@/components/content/post-list-item";
import { buildDefaultOgUrl } from "@/lib/og";
import { buildStaticAlternates, localePath, SITE_URL } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const isEs = locale === "es";

  const title = isEs ? "Blog" : "Blog";
  const description = isEs
    ? "Pensamientos sobre desarrollo, producto y aprendizaje."
    : "Thoughts on development, product and learning.";

  const ogImageUrl = buildDefaultOgUrl({
    title,
    description,
    locale: locale as "es" | "en",
  });

  const typedLocale = locale as "es" | "en";
  const pageUrl = `${SITE_URL}${localePath(typedLocale, "/blog")}`;

  return {
    title,
    description,
    alternates: buildStaticAlternates(typedLocale, "/blog"),
    openGraph: {
      title,
      description,
      url: pageUrl,
      locale: isEs ? "es_AR" : "en_US",
      alternateLocale: isEs ? ["en_US"] : ["es_AR"],
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const posts = getPosts(locale as "es" | "en");

  // Agrupar posts por año
  const postsByYear = posts.reduce<Record<string, typeof posts>>((acc, post) => {
    const year = new Date(post.date).getFullYear().toString();
    if (!acc[year]) acc[year] = [];
    acc[year].push(post);
    return acc;
  }, {});

  const years = Object.keys(postsByYear).sort((a, b) => parseInt(b) - parseInt(a));

  return (
    <main className="mx-auto max-w-2xl px-6 py-24">
      <BlogHeader />

      <div className="mt-16 space-y-12">
        {posts.length === 0 ? (
          <p className="text-muted-foreground">No posts yet.</p>
        ) : (
          years.map((year) => (
            <section key={year}>
              <h2 className="mb-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                {year}
              </h2>
              <div className="space-y-1">
                {postsByYear[year].map((post) => (
                  <PostListItem
                    key={post.slug}
                    slug={post.slug}
                    title={post.title}
                    description={post.description}
                    date={post.date}
                    locale={locale}
                  />
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </main>
  );
}

function BlogHeader() {
  const t = useTranslations("blog");
  return (
    <>
      <h1 className="text-4xl font-semibold tracking-tight">{t("title")}</h1>
      <p className="mt-3 text-muted-foreground">{t("description")}</p>
    </>
  );
}
