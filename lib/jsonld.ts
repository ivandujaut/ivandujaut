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
    // La descripción anterior ("construyo producto con Next.js, TypeScript...")
    // era la única frase que un buscador tenía para resumir el perfil, y la
    // resumía como desarrollo web: el AI Overview de Google la parafraseaba
    // literal. Acá se declara el trabajo que diferencia, no el stack.
    description:
      locale === "es"
        ? "Analizo mercados y productos con datos públicos y termino en recomendaciones: seguros, fintech y pagos en Argentina y Brasil. Bioingeniero del ITBA."
        : "I analyze markets and products with public data and end in recommendations: insurance, fintech and payments in Argentina and Brazil. Bioengineer from ITBA.",
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Instituto Tecnológico de Buenos Aires (ITBA)",
      url: "https://www.itba.edu.ar",
    },
    worksFor: {
      "@type": "Organization",
      name: "Prizmstack",
    },
    // `knowsAbout` es el campo con el que schema.org declara sobre qué temas
    // hay expertise. Sin él, el buscador infiere los temas del texto suelto de
    // la página, que es exactamente cómo terminaba clasificado como "Next.js".
    // Cada entrada tiene respaldo publicado en /projects.
    knowsAbout:
      locale === "es"
        ? [
            "Seguros",
            "Insurtech",
            "Fintech",
            "Medios de pago",
            "Análisis de datos",
            "Estrategia de producto",
            "Análisis de producto",
            "Bioingeniería",
            "Aprendizaje automático",
          ]
        : [
            "Insurance",
            "Insurtech",
            "Fintech",
            "Payments",
            "Data analysis",
            "Product strategy",
            "Product analytics",
            "Bioengineering",
            "Machine learning",
          ],
    knowsLanguage: ["es", "en"],
    sameAs: ["https://linkedin.com/in/ivan-dujaut", "https://github.com/ivandujaut"],
  };
}

// Person inline (no como referencia por @id) para que validators que
// analizan la página en aislamiento — como Google Rich Results Test —
// puedan leer name/url directamente sin resolver referencias entre pages.
const AUTHOR = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: "Iván Dujaut",
  url: SITE_URL,
  sameAs: ["https://linkedin.com/in/ivan-dujaut", "https://github.com/ivandujaut"],
};

// Google's Article spec exige `publisher` como Organization. Para un blog
// personal usamos el nombre del autor como organización y el icon SVG como logo.
const PUBLISHER = {
  "@type": "Organization",
  name: "Iván Dujaut",
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/icon.svg`,
  },
};

type ArticleInput = {
  type: "BlogPosting" | "Article";
  basePath: "/blog" | "/projects";
  title: string;
  description: string;
  slug: string;
  locale: Locale;
  datePublished: string;
  dateModified?: string;
  keywords?: string[];
  image: string;
  inLanguage?: string;
  wordCount?: number;
  readingTimeMinutes?: number;
};

/**
 * Base común de las dos piezas largas del sitio. `wordCount` y `timeRequired`
 * van al final y solo si llegan, así que la salida del blog queda igual que
 * antes de compartir esta función.
 */
function articleSchema(input: ArticleInput) {
  const prefix = input.locale === "en" ? "/en" : "";
  const url = `${SITE_URL}${prefix}${input.basePath}/${input.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": input.type,
    headline: input.title,
    description: input.description,
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    inLanguage: input.inLanguage ?? input.locale,
    keywords: input.keywords?.join(", "),
    image: {
      "@type": "ImageObject",
      url: input.image,
      width: 1200,
      height: 630,
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    author: AUTHOR,
    publisher: PUBLISHER,
    ...(input.wordCount ? { wordCount: input.wordCount } : {}),
    ...(input.readingTimeMinutes ? { timeRequired: `PT${input.readingTimeMinutes}M` } : {}),
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
  return articleSchema({
    type: "BlogPosting",
    basePath: "/blog",
    ...post,
    keywords: post.tags,
  });
}

type ProjectArticleInput = {
  title: string;
  description: string;
  slug: string;
  locale: Locale;
  datePublished: string;
  stack?: string[];
  image: string;
  wordCount?: number;
  readingTimeMinutes?: number;
};

/**
 * Los casos viven en `/projects`, pero para un buscador son artículos: texto
 * largo, con autor y fecha. Hasta acá la ruta emitía solo el breadcrumb, así
 * que un análisis de 2.400 palabras declaraba menos que un post de 250.
 *
 * El tipo es `Article` y no `BlogPosting` (no son entradas del blog, que es
 * otra sección) ni `CreativeWork` (Google solo arma el rich result de artículo
 * con Article, NewsArticle y BlogPosting). Vale igual para los tres `kind`:
 * la página es un artículo sobre el trabajo, sea propio o ajeno.
 *
 * `keywords` sale del stack, que es lo único con forma de etiqueta que declara
 * un caso. No describe el tema, describe con qué está hecho.
 */
export function projectArticleSchema(project: ProjectArticleInput) {
  return articleSchema({
    type: "Article",
    basePath: "/projects",
    ...project,
    keywords: project.stack,
  });
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
