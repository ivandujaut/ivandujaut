import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { useMDXComponent } from "@/lib/mdx";
import { getPostBySlug, getPosts } from "@/lib/content";
import { useMDXComponents } from "@/mdx-components";

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

  return {
    title: post.title,
    description: post.description,
  };
}

export default async function PostPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = getPostBySlug(locale as "es" | "en", slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-2xl px-6 py-24">
      <header className="mb-12">
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
              <span>·</span>
              <span>{post.metadata.readingTime} min read</span>
            </>
          )}
        </div>
      </header>

      <div className="prose-content">
        <MDXContent code={post.content} />
      </div>
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
