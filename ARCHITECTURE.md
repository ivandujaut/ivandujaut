# ivandujaut.com

Bilingual portfolio and writing site. Next.js 16 with the App Router, MDX content compiled by Velite,
deployed on Vercel.

> These are the notes for someone reading the code. The `README.md` is a different document on
> purpose: this repository is named after the account, so GitHub renders that file on the profile,
> where the reader is deciding whether to keep reading rather than how the thing is built.
>
> This file lived at `.github/README.md` for three days. That path takes precedence over the root
> one **on the profile too**, not only on the repository page as the docs suggest, so the profile
> ended up showing the engineering notes. Do not move it back.

## Running it

```bash
npm install
cp .env.example .env.local   # every key is optional in development
npm run dev                  # velite --watch + next dev --turbopack
```

`npm run build`, `npm run typecheck`, `npm run lint`. Husky runs lint-staged on commit and typecheck on
push.

## How it is put together

**Content is data.** Every case study and post is MDX under `content/<collection>/<locale>/<slug>/`,
compiled by Velite against a Zod schema in `velite.config.ts`. The schema is where the editorial rules
live: a featured entry requires a cover, `preview` needs exactly three images, and a metric with an
up-or-down trend must declare whether that direction is good, because an arrow alone does not say
whether a number moving is an improvement.

**Two locales, one slug.** `next-intl` with `localePrefix: "as-needed"`: Spanish at `/`, English at
`/en`. Locale detection is off on purpose so responses stay cacheable at the edge (every `Set-Cookie`
marks them private), and a client-side banner offers the switch instead.

**Analysis ships with its scripts.** The numbers in the case studies come from `scripts/analysis/`,
which pulls from public regulator data (Brazil's central bank, Argentina's SSN and SRT) and writes the
charts from `scripts/charts/`. Anyone can recompute a figure without trusting the article.

**Reading is measured, not displayed.** A view counts whoever opened a piece; a read counts whoever
crossed 75% of the article and stayed at least a quarter of the declared reading time with the tab in
front. Both live in Redis, split by locale, and neither is rendered on the page: reads over views is a
number that helps the author and means nothing to the reader.

## Layout

```
app/[locale]/      routes; the pages are Server Components
components/        ui, mdx components, layout
content/           MDX, the source of truth for every piece
lib/               content queries, seo, redis, feature flags
scripts/analysis/  the code behind the figures in the case studies
scripts/charts/    chart generation, matplotlib
```

## Decisions worth knowing before changing things

- **Never open an MDX body with `# `.** The layout already renders the title as the page's only `<h1>`,
  so a level-one heading in the body creates a second one and splits the outline a screen reader
  announces.
- **Drafts are `noindex`.** `getProjectBySlug` deliberately does not filter by `draft` so a preview can
  be shared by link; without the robots tag that would make a draft unlisted rather than unpublished.
- **Wide tables scroll inside their own container.** They used to be `w-full` with no wrapper, which did
  not overflow the page, it squeezed cells up to eleven lines tall.
- **`/research` is behind a flag** in `lib/features.ts`, single source of truth. Flipping it also means
  uncommenting the nav links in `components/layout/`.

## License

No license file, so default copyright applies: all rights reserved. The code is here to be read, not
reused. If you want to use a piece of it, ask.
