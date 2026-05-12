import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { localePath, type Locale } from "@/lib/seo";

type RelatedPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
};

interface RelatedPostsProps {
  posts: RelatedPost[];
  locale: Locale;
}

export async function RelatedPosts({ posts, locale }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  const t = await getTranslations("blog.related");

  return (
    <aside className="mt-16 border-t border-border pt-8">
      <h2 className="mb-6 font-mono text-xs uppercase tracking-wider text-muted-foreground">
        {t("title")}
      </h2>
      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={localePath(locale, `/blog/${post.slug}`)} className="group block">
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-medium transition-colors group-hover:text-foreground">
                  {post.title}
                </span>
                <time
                  dateTime={post.date}
                  className="shrink-0 font-mono text-xs text-muted-foreground"
                >
                  {new Date(post.date).toLocaleDateString(locale, {
                    year: "numeric",
                    month: "short",
                  })}
                </time>
              </div>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{post.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
