interface PostHeroProps {
  title: string;
  date: string;
  locale: string;
  cover?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
}

export function PostHero({ title, date, locale, cover }: PostHeroProps) {
  // Si el post tiene cover custom, usar esa imagen
  if (cover) {
    return (
      <div className="my-8 overflow-hidden rounded-lg border border-border">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cover.src}
          alt={cover.alt}
          width={cover.width}
          height={cover.height}
          className="h-auto w-full"
        />
      </div>
    );
  }

  // Si no, generar automáticamente con /api/og
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const ogParams = new URLSearchParams({
    title,
    date: new Date(date).toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    subtitle: locale === "es" ? "Blog" : "Blog post",
  });
  const heroUrl = `${baseUrl}/api/og?${ogParams.toString()}`;

  return (
    <div className="my-8 overflow-hidden rounded-lg border border-border">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={heroUrl} alt={title} width={1200} height={630} className="h-auto w-full" />
    </div>
  );
}
