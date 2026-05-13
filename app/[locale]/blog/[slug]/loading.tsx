export default function BlogPostLoading() {
  return (
    <main id="main" aria-busy="true">
      <article className="mx-auto max-w-2xl px-6 py-24">
        <div className="mb-6 h-3 w-1/3 animate-pulse rounded bg-muted" />

        <header className="mb-8">
          <div className="flex items-start justify-between gap-4">
            <div className="h-10 w-3/4 animate-pulse rounded bg-muted" />
            <div className="mt-2 h-8 w-28 shrink-0 animate-pulse rounded-md bg-muted" />
          </div>
          <div className="mt-4 flex items-center gap-2">
            <div className="h-3 w-24 animate-pulse rounded bg-muted" />
            <div className="h-3 w-3 animate-pulse rounded bg-muted" />
            <div className="h-3 w-20 animate-pulse rounded bg-muted" />
            <div className="h-3 w-3 animate-pulse rounded bg-muted" />
            <div className="h-3 w-16 animate-pulse rounded bg-muted" />
          </div>
        </header>

        <div className="mb-12 h-48 animate-pulse rounded-lg bg-muted" />

        <div className="space-y-4">
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
          <div className="h-4 w-11/12 animate-pulse rounded bg-muted" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
        </div>
      </article>
    </main>
  );
}
