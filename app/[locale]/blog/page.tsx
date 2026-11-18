import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPosts } from "@/lib/content";
import { PostListItem } from "@/components/content/post-list-item";
import { buildDefaultOgUrl } from "@/lib/og";
import { buildStaticAlternates, localePath, SITE_URL } from "@/lib/seo";
import { Eyebrow } from "@/components/ui/eyebrow";
import { PageShell } from "@/components/ui/page-shell";

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

  const typedLocale = locale as "es" | "en";
  const posts = getPosts(typedLocale);
  const tReading = await getTranslations({ locale, namespace: "common.reading" });
  // El formateo de los minutos vive acá, que es donde están las traducciones;
  // la tarjeta sólo recibe el texto ya armado. Mismo criterio que en /projects.
  const minutos = (count?: number) => (count ? tReading("minutes", { count }) : undefined);

  // Agrupar posts por año
  const postsByYear = posts.reduce<Record<string, typeof posts>>((acc, post) => {
    const year = new Date(post.date).getFullYear().toString();
    if (!acc[year]) acc[year] = [];
    acc[year].push(post);
    return acc;
  }, {});

  const years = Object.keys(postsByYear).sort((a, b) => parseInt(b) - parseInt(a));

  return (
    <PageShell id="main">
      <BlogHeader />

      <div className="mt-16 space-y-12">
        {posts.length === 0 ? (
          <p className="text-muted-foreground">No posts yet.</p>
        ) : (
          years.map((year) => (
            <section key={year}>
              <Eyebrow as="h2" className="mb-4">
                {year}
              </Eyebrow>
              {/* Una pieza sola va a lo ancho, igual que en el índice de
                  casos: media tarjeta con el hueco al lado se lee como una
                  grilla a la que le falta algo. */}
              <div
                className={`grid gap-x-5 gap-y-9 ${
                  postsByYear[year].length > 1 ? "sm:grid-cols-2" : ""
                }`}
              >
                {postsByYear[year].map((post) => (
                  <PostListItem
                    key={post.slug}
                    slug={post.slug}
                    title={post.title}
                    description={post.description}
                    date={post.date}
                    locale={locale}
                    readingTime={minutos(post.metadata?.readingTime)}
                    surface="blog-index"
                    cover={
                      post.cover
                        ? {
                            src: post.cover.src.src,
                            width: post.cover.src.width,
                            height: post.cover.src.height,
                            blurDataURL: post.cover.src.blurDataURL,
                          }
                        : undefined
                    }
                  />
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </PageShell>
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
