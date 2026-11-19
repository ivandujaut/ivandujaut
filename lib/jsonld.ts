import { SITE_URL, type Locale } from "@/lib/seo";
import { PROFILE_DESCRIPTION } from "@/lib/profile";

const PERSON_ID = `${SITE_URL}/#person`;

export function personSchema(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: "Iván Dujaut",
    url: SITE_URL,
    image: `${SITE_URL}/api/og?title=Iv%C3%A1n+Dujaut&subtitle=Portfolio&locale=${locale}`,
    // Hasta el 14/10/2026 era "Product Engineer", el cargo en Prizmstack. Ese
    // contrato termina en octubre de 2026 y el CV pasó a encabezar con "AI
    // Product Manager", así que el campo sigue al CV: es como Iván se presenta,
    // no un empleo. Los cargos reales siguen en /about, uno por experiencia.
    jobTitle: "AI Product Manager",
    // Una sola frase, la misma acá, en la meta de cada página y en llms.txt.
    // Vive en `lib/profile.ts`, con el historial de por qué dice lo que dice.
    description: PROFILE_DESCRIPTION[locale],
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Instituto Tecnológico de Buenos Aires (ITBA)",
      url: "https://www.itba.edu.ar",
    },
    // `jobTitle` es el titular y `hasOccupation` es la práctica. Son campos
    // distintos y hacen falta los dos: con sólo el titular, el trabajo que lo
    // diferencia no queda declarado en ningún lado legible por máquina.
    //
    // Son tres y no una desde el 19/11/2026, que es la versión legible por
    // máquina de la línea que /about dice en prosa: el puesto puede llamarse
    // product manager, product owner o analista, y el trabajo es el mismo.
    // Hasta ese día era una sola, "Gestión de producto y análisis de datos",
    // una etiqueta que no coincide con ningún aviso.
    //
    // Los tres títulos salen de contar avisos y no de intuición: en Argentina
    // y a 30 días, Product Manager tenía 109, Business Analyst 89 y Product
    // Owner 49. "Analista de Producto" y "Product Analyst" devolvían el
    // fallback de LinkedIn, indistinguible de buscar un puesto inventado, así
    // que no entran aunque describan mejor lo que hace.
    hasOccupation: (locale === "es"
      ? ["Product Manager", "Product Owner", "Analista de negocio"]
      : ["Product Manager", "Product Owner", "Business Analyst"]
    ).map((name) => ({ "@type": "Occupation", name })),
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
            "Gestión de producto",
            "Priorización de roadmap",
            "IA generativa",
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
            "Product management",
            "Roadmap prioritisation",
            "Generative AI",
            "Bioengineering",
            "Machine learning",
          ],
    knowsLanguage: ["es", "en"],
    sameAs: ["https://linkedin.com/in/ivan-dujaut", "https://github.com/ivandujaut"],
  };
}

/**
 * La página "sobre mí", declarada como `ProfilePage`.
 *
 * Es el tipo que Google define para una página cuyo tema es una persona, y el
 * que hace explícito algo que hasta el 19/11/2026 había que deducir: que
 * `/about` no es una página más que menciona a Iván, sino la página que habla
 * de él. Antes emitía un `Person` suelto, igual que la home, y las dos se
 * leían como equivalentes.
 *
 * `mainEntity` lleva el `Person` entero y no una referencia por `@id`, por la
 * misma razón que `AUTHOR` más abajo: un validador que analiza la página
 * aislada tiene que poder leer el nombre y la URL sin resolver referencias
 * entre páginas. El `@id` se conserva adentro, así que para un motor que sí
 * cruza páginas sigue siendo la misma entidad que declara la home.
 *
 * `dateModified` existe porque es la señal de frescura que un motor usa para
 * decidir si vuelve a leer la página.
 */
export function profilePageSchema(locale: Locale, dateModified: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${SITE_URL}${locale === "es" ? "" : "/en"}/about#profile`,
    url: `${SITE_URL}${locale === "es" ? "" : "/en"}/about`,
    dateModified,
    mainEntity: personSchema(locale),
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
  seoTitle?: string;
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
  entities?: string[];
  sources?: Array<{ name: string; url: string }>;
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
    // El título para el buscador, cuando la pieza lo declara. `headline` queda
    // con el editorial porque tiene que coincidir con el h1 visible.
    ...(input.seoTitle ? { alternativeHeadline: input.seoTitle } : {}),
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
    // `about` es una lista: primero el tema, después cada entidad con nombre
    // propio. El tema hace que la pieza se ubique en un campo; las entidades son
    // las que la hacen aparecer cuando alguien pregunta por Medicare o por
    // Xarelto, que es como se pregunta en realidad.
    ...(input.about || input.entities?.length
      ? {
          about: [
            ...(input.about ? [{ "@type": "Thing", name: input.about }] : []),
            ...(input.entities ?? []).map((name) => ({ "@type": "Thing", name })),
          ],
        }
      : {}),
    // `citation` dice de dónde salieron los números. Es lo que separa a una
    // página que afirma algo de una que lo puede sostener, y es lo primero que
    // mira cualquiera (o cualquier modelo) que evalúe si vale citarla.
    ...(input.sources?.length
      ? {
          citation: input.sources.map((s) => ({
            "@type": "CreativeWork",
            name: s.name,
            url: s.url,
          })),
        }
      : {}),
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
  seoTitle?: string;
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
  seoTitle?: string;
  description: string;
  slug: string;
  locale: Locale;
  datePublished: string;
  topic: string;
  kind?: string;
  entities?: string[];
  sources?: Array<{ name: string; url: string }>;
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
