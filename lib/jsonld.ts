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
    // Una sola frase, la misma acá, en la meta de `/about` y en el encabezado de
    // `llms.txt`. Repetirla palabra por palabra es lo que hace que un buscador o
    // un modelo la tome como la descripción del perfil en vez de fabricar una.
    // La anterior decía "analizo mercados", encuadre que Iván rechazó el
    // 2026-09-19: no analiza mercados, agarra un problema, reconstruye contexto
    // y actores, y termina en una decisión.
    description:
      locale === "es"
        ? "Escribo casos sobre salud y seguros: reconstruyo el problema, los actores y los datos públicos, y termino en una decisión. Bioingeniero del ITBA."
        : "I write cases about health and insurance: I rebuild the problem, the players and the public data, and end in a decision. Bioengineer from ITBA.",
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Instituto Tecnológico de Buenos Aires (ITBA)",
      url: "https://www.itba.edu.ar",
    },
    worksFor: {
      "@type": "Organization",
      name: "Prizmstack",
    },
    // `jobTitle` es el cargo (Product Engineer en Prizmstack, que es el real) y
    // `hasOccupation` es la práctica. Son campos distintos y hacían falta los
    // dos: con sólo el cargo, el perfil se resume como ingeniería y el trabajo
    // que lo diferencia no queda declarado en ningún lado legible por máquina.
    hasOccupation: {
      "@type": "Occupation",
      name:
        locale === "es"
          ? "Estrategia de producto y decision analytics"
          : "Product strategy and decision analytics",
    },
    // `knowsAbout` es el campo con el que schema.org declara sobre qué temas
    // hay expertise. Sin él, el buscador infiere los temas del texto suelto de
    // la página, que es exactamente cómo terminaba clasificado como "Next.js".
    // Cada entrada tiene respaldo publicado en /projects.
    knowsAbout:
      locale === "es"
        ? [
            "Acceso al mercado en salud",
            "Análisis de decisiones",
            "Medicare",
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
            "Market access",
            "Decision analytics",
            "Medicare",
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

/**
 * Qué tema trata cada caso, para `about` y `keywords`.
 *
 * Hasta el 2026-09-19 las `keywords` de un caso salían del `stack`, así que el
 * análisis del acceso a Medicare declaraba, en producción, que trataba sobre
 * "Python, matplotlib". El comentario del código lo admitía: describía con qué
 * está hecho y no de qué habla. El tema ya existía en el frontmatter, en
 * `topic`, y sus etiquetas ya estaban curadas en `messages` bajo
 * `projects.topics`; esto es la misma clasificación en forma de entidad.
 */
const TOPIC_SUBJECT: Record<string, { es: string; en: string }> = {
  salud: {
    es: "Acceso al mercado en salud en Estados Unidos",
    en: "Market access in US healthcare",
  },
  seguros: { es: "Mercado asegurador argentino", en: "Argentine insurance market" },
  fintech: { es: "Medios de pago en Brasil", en: "Payments in Brazil" },
  proptech: { es: "Proptech", en: "Proptech" },
  educacion: { es: "Educación", en: "Education" },
  web: { es: "Desarrollo web", en: "Web development" },
};

const TOPIC_KEYWORDS: Record<string, { es: string[]; en: string[] }> = {
  salud: {
    es: ["Acceso al mercado en salud", "Medicare", "Industria farmacéutica", "Estados Unidos"],
    en: ["Market access", "Medicare", "Pharmaceutical industry", "United States"],
  },
  seguros: {
    es: ["Seguros", "Insurtech", "Argentina", "Superintendencia de Seguros de la Nación"],
    en: ["Insurance", "Insurtech", "Argentina", "Argentine insurance regulator"],
  },
  fintech: {
    es: ["Medios de pago", "Fintech", "Brasil"],
    en: ["Payments", "Fintech", "Brazil"],
  },
  proptech: {
    es: ["Proptech", "Mercado inmobiliario"],
    en: ["Proptech", "Real estate"],
  },
  educacion: { es: ["Educación"], en: ["Education"] },
  web: { es: ["Desarrollo web"], en: ["Web development"] },
};

const KIND_KEYWORD: Record<string, { es: string; en: string }> = {
  "case-study": { es: "Caso de estudio", en: "Case study" },
  build: { es: "Producto", en: "Product" },
  design: { es: "Diseño", en: "Design" },
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
  about?: string;
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
    ...(input.about ? { about: { "@type": "Thing", name: input.about } } : {}),
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
  topic: string;
  kind?: string;
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
 * `keywords` y `about` salen de `topic` y de `kind`, no del `stack`. El stack
 * sigue a la vista en la sección de código del caso, que es donde significa
 * algo: ahí dice con qué se calculó, no de qué trata.
 */
export function projectArticleSchema(project: ProjectArticleInput) {
  const { topic, kind, ...rest } = project;
  const temas = TOPIC_KEYWORDS[topic]?.[project.locale] ?? [];
  const tipo = kind ? KIND_KEYWORD[kind]?.[project.locale] : undefined;

  return articleSchema({
    type: "Article",
    basePath: "/projects",
    ...rest,
    about: TOPIC_SUBJECT[topic]?.[project.locale],
    keywords: [...temas, ...(tipo ? [tipo] : [])],
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
