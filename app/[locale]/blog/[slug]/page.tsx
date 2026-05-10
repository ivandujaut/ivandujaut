import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { useMDXComponent } from "@/lib/mdx";
import { getPostBySlug, getPosts } from "@/lib/content";
import { useMDXComponents } from "@/mdx-components";
import { ViewCounter } from "@/components/blog/view-counter";
import { LikeButton } from "@/components/blog/like-button";
import { PostHero } from "@/components/blog/post-hero";

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

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const ogParams = new URLSearchParams({
    title: post.title,
    date: new Date(post.date).toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    subtitle: locale === "es" ? "Blog" : "Blog post",
  });
  const ogImageUrl = `${baseUrl}/api/og?${ogParams.toString()}`;

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
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

  return (
    <article className="mx-auto max-w-2xl px-6 py-24">
      <header className="mb-8">
        <h1 className="text-4xl font-semibold tracking-tight">{post.title}</h1>
        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString(locale, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          {post.metadata && (
            <>
              <span aria-hidden>·</span>
              <span>{post.metadata.readingTime} min read</span>
            </>
          )}
          <span aria-hidden>·</span>
          <ViewCounter slug={slug} />
        </div>
      </header>

      <PostHero
        title={post.title}
        date={post.date}
        locale={locale}
        cover={
          post.cover
            ? {
                src: post.cover.src,
                alt: post.title,
                width: post.cover.width,
                height: post.cover.height,
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
