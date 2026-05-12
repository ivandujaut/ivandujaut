import { SITE_URL, type Locale } from "@/lib/seo";

const PERSON_ID = `${SITE_URL}/#person`;

export function personSchema(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: "Iván Dujaut",
    url: SITE_URL,
    image: `${SITE_URL}/api/og?title=Iv%C3%A1n+Dujaut&subtitle=Portfolio&locale=${locale}`,
    jobTitle: locale === "es" ? "Product Engineer" : "Product Engineer",
    description:
      locale === "es"
        ? "Product Engineer y Bioingeniero del ITBA. Construyo producto con Next.js, TypeScript y foco en métricas."
        : "Product Engineer and Bioengineer from ITBA. I build product with Next.js, TypeScript and a metrics-first lens.",
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Instituto Tecnológico de Buenos Aires (ITBA)",
      url: "https://www.itba.edu.ar",
    },
    knowsLanguage: ["es", "en"],
    sameAs: ["https://linkedin.com/in/ivan-dujaut", "https://github.com/ivandujaut"],
  };
}

type BlogPostingInput = {
  title: string;
  description: string;
  slug: string;
  locale: Locale;
  datePublished: string;
  dateModified?: string;
  tags?: string[];
  image: string;
  inLanguage?: string;
};

export function blogPostingSchema(post: BlogPostingInput) {
  const prefix = post.locale === "en" ? "/en" : "";
  const url = `${SITE_URL}${prefix}/blog/${post.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.datePublished,
    dateModified: post.dateModified ?? post.datePublished,
    inLanguage: post.inLanguage ?? post.locale,
    keywords: post.tags?.join(", "),
    image: post.image,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    author: { "@id": PERSON_ID },
    publisher: { "@id": PERSON_ID },
  };
}

type BreadcrumbInput = Array<{ name: string; path: string }>;

export function breadcrumbSchema(items: BreadcrumbInput) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}
