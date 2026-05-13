import { ViewTransition } from "react";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { useMDXComponent } from "@/lib/mdx";
import { getPostBySlug, getPosts, getPostTranslations, getRelatedPosts } from "@/lib/content";
import { buildContentAlternates, localePath, SITE_URL } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { blogPostingSchema, breadcrumbSchema } from "@/lib/jsonld";
import { useMDXComponents } from "@/mdx-components";
import { ViewCounter } from "@/components/blog/view-counter";
import { getCachedViews } from "@/lib/views";
import { LikeButton } from "@/components/blog/like-button";
import { PostHero } from "@/components/blog/post-hero";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { RelatedPosts } from "@/components/blog/related-posts";
import { buildCoverUrl, buildPostOgUrl, formatOgDate } from "@/lib/og";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  const allPosts = [...getPosts("es"), ...getPosts("en")];
  return allPosts.map((post) => ({
    locale: post.locale,
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const post = getPostBySlug(locale as "es" | "en", slug);

  if (!post) return {};

  const ogImageUrl = buildPostOgUrl({
    title: post.title,
    description: post.description,
    date: formatOgDate(post.date, locale as "es" | "en"),
    readingTime: post.metadata?.readingTime,
    tags: post.tags,
    coverUrl: buildCoverUrl(post.cover?.src.src),
    locale: locale as "es" | "en",
  });

  const translations = getPostTranslations(post);
  const typedLocale = locale as "es" | "en";
  const isEs = typedLocale === "es";
  const pageUrl = `${SITE_URL}${localePath(typedLocale, `/blog/${post.slug}`)}`;

  return {
    title: post.title,
    description: post.description,
    alternates: buildContentAlternates({
      current: { locale: typedLocale, slug: post.slug },
      translations: translations.map((t) => ({ locale: t.locale, slug: t.slug })),
      basePath: "/blog",
    }),
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: pageUrl,
      locale: isEs ? "es_AR" : "en_US",
      alternateLocale: isEs ? ["en_US"] : ["es_AR"],
      publishedTime: post.date,
      modifiedTime: post.updated,
      tags: post.tags,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [ogImageUrl],
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = getPostBySlug(locale as "es" | "en", slug);
  if (!post) notFound();

  const typedLocale = locale as "es" | "en";
  const heroImage = post.cover?.src.src
    ? `${SITE_URL}${post.cover.src.src}`
    : buildPostOgUrl({
        title: post.title,
        description: post.description,
        date: formatOgDate(post.date, typedLocale),
        readingTime: post.metadata?.readingTime,
        tags: post.tags,
        locale: typedLocale,
      });

  const t = await getTranslations({ locale: typedLocale, namespace: "common.navigation" });
  const homeLabel = t("home");
  const blogLabel = t("blog");
  const homePath = localePath(typedLocale, "/");
  const blogIndexPath = localePath(typedLocale, "/blog");
  const postPath = localePath(typedLocale, `/blog/${post.slug}`);

  const breadcrumbItems = [
    { label: homeLabel, href: homePath },
    { label: blogLabel, href: blogIndexPath },
    { label: post.title },
  ];

  const jsonLd = [
    blogPostingSchema({
      title: post.title,
      description: post.description,
      slug: post.slug,
      locale: typedLocale,
      datePublished: post.date,
      dateModified: post.updated,
      tags: post.tags,
      image: heroImage,
    }),
    breadcrumbSchema([
      { name: homeLabel, path: homePath },
      { name: blogLabel, path: blogIndexPath },
      { name: post.title, path: postPath },
    ]),
  ];

  const related = getRelatedPosts({ locale: typedLocale, slug: post.slug, tags: post.tags }, 3);
  const initialViews = await getCachedViews("blog", slug);

  return (
    <article className="mx-auto max-w-2xl px-6 py-24">
      <JsonLd data={jsonLd} />
      <Breadcrumbs items={breadcrumbItems} className="mb-6" />
      <header className="mb-8">
        <ViewTransition name={`post-title-${slug}`} share="morph">
          <h1 className="text-4xl font-semibold tracking-tight">{post.title}</h1>
        </ViewTransition>
        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <ViewTransition name={`post-date-${slug}`} share="morph">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString(locale, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </ViewTransition>
          {post.metadata && (
            <>
              <span aria-hidden>·</span>
              <span>{post.metadata.readingTime} min read</span>
            </>
          )}
          <span aria-hidden>·</span>
          <ViewCounter kind="blog" slug={slug} initialViews={initialViews} />
        </div>
      </header>

      <PostHero
        title={post.title}
        date={post.date}
        description={post.description}
        readingTime={post.metadata?.readingTime}
        tags={post.tags}
        locale={locale as "es" | "en"}
        cover={
          post.cover
            ? {
                src: post.cover.src.src,
                alt: post.cover.alt,
                width: post.cover.src.width,
                height: post.cover.src.height,
              }
            : undefined
        }
      />

      <div className="prose-content">
        <MDXContent code={post.content} />
      </div>

      <footer className="mt-16 border-t border-border pt-8">
        <LikeButton slug={slug} />
      </footer>

      <RelatedPosts
        posts={related.map((p) => ({
          slug: p.slug,
          title: p.title,
          description: p.description,
          date: p.date,
        }))}
        locale={typedLocale}
      />
    </article>
  );
}

function MDXContent({ code }: { code: string }) {
  const Component = useMDXComponent(code);
  const components = useMDXComponents({});
  // Server Component: corre una vez por request, no hay re-render que pueda
  // reiniciar estado del componente compilado por Velite.
  // eslint-disable-next-line react-hooks/static-components
  return <Component components={components} />;
}
