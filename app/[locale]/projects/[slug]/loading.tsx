export default function ProjectLoading() {
  return (
    <main id="main" aria-busy="true">
      <article className="mx-auto max-w-2xl px-6 py-24">
        <div className="mb-6 h-3 w-1/3 animate-pulse rounded bg-muted" />

        <header className="mb-12">
          <div className="mb-3 h-5 w-20 animate-pulse rounded-full bg-muted" />

          <div className="flex items-start justify-between gap-4">
            <div className="h-10 w-3/4 animate-pulse rounded bg-muted" />
            <div className="mt-2 h-8 w-28 shrink-0 animate-pulse rounded-md bg-muted" />
          </div>

          <div className="mt-3 h-5 w-2/3 animate-pulse rounded bg-muted" />

          <div className="mt-6 flex items-center gap-2">
            <div className="h-3 w-12 animate-pulse rounded bg-muted" />
            <div className="h-3 w-3 animate-pulse rounded bg-muted" />
            <div className="h-3 w-20 animate-pulse rounded bg-muted" />
            <div className="h-3 w-3 animate-pulse rounded bg-muted" />
            <div className="h-3 w-16 animate-pulse rounded bg-muted" />
          </div>

          <div className="mt-8">
            <div className="mb-2 h-3 w-16 animate-pulse rounded bg-muted" />
            <div className="flex flex-wrap gap-2">
              <div className="h-6 w-16 animate-pulse rounded-full bg-muted" />
              <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
              <div className="h-6 w-14 animate-pulse rounded-full bg-muted" />
              <div className="h-6 w-24 animate-pulse rounded-full bg-muted" />
            </div>
          </div>
        </header>

        <hr className="mb-12 border-border" />

        <div className="space-y-4">
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
          <div className="h-4 w-11/12 animate-pulse rounded bg-muted" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
        </div>
      </article>
    </main>
  );
}
