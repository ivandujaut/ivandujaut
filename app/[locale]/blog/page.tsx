import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getPosts } from "@/lib/content";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const posts = getPosts(locale as "es" | "en");

  return (
    <main className="mx-auto max-w-2xl px-6 py-24">
      <BlogHeader />

      <div className="mt-12 space-y-6">
        {posts.length === 0 ? (
          <p className="text-muted-foreground">No posts yet.</p>
        ) : (
          posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block border-b border-border pb-6 transition-colors hover:bg-muted/30 -mx-6 px-6 rounded-lg"
            >
              <article>
                <h2 className="text-lg font-medium">{post.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{post.description}</p>
                <p className="mt-2 text-xs text-muted-foreground font-mono">
                  {new Date(post.date).toLocaleDateString(locale, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </article>
            </Link>
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
