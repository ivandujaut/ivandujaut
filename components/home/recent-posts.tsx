import { Link } from "@/i18n/navigation";
import { PostListItem } from "@/components/content/post-list-item";
import { getPosts } from "@/lib/content";

interface RecentPostsProps {
  locale: "es" | "en";
}

const labels = {
  es: { title: "Escritos recientes", viewAll: "Ver todos" },
  en: { title: "Recent writing", viewAll: "View all" },
};

export function RecentPosts({ locale }: RecentPostsProps) {
  const posts = getPosts(locale).slice(0, 3);

  if (posts.length === 0) return null;

  const t = labels[locale];

  return (
    <section>
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          {t.title}
        </h2>
        <Link
          href="/blog"
          className="font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          {t.viewAll}
        </Link>
      </div>
      <div className="space-y-1">
        {posts.map((post) => (
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
  );
}
