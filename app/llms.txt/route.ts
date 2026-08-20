import { getPosts, getProjects, getResearch } from "@/lib/content";
import { RESEARCH_ENABLED } from "@/lib/features";
import { SITE_URL, localePath, type Locale } from "@/lib/seo";

// `llms.txt` es una convención propuesta, no un estándar que las empresas de IA
// se hayan comprometido a consumir. Se genera desde el mismo contenido que el
// sitemap justamente porque el costo de mantenerlo tiene que ser cero: si la
// convención no prende, el archivo no le debe trabajo a nadie.
export const dynamic = "force-static";

function absoluteUrl(locale: Locale, pathWithoutLocale: string): string {
  const path = localePath(locale, pathWithoutLocale);
  return `${SITE_URL}${path === "/" ? "" : path}`;
}

/** Las descripciones vienen del frontmatter y pueden traer saltos de línea. */
function oneLine(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

type Entry = { title: string; description: string; slug: string };

function section(
  heading: string,
  entries: Entry[],
  locale: Locale,
  basePath: "/blog" | "/projects" | "/research",
  level: 2 | 3 = 2,
): string[] {
  if (entries.length === 0) return [];
  return [
    `${"#".repeat(level)} ${heading}`,
    "",
    ...entries.map(
      (e) =>
        `- [${oneLine(e.title)}](${absoluteUrl(locale, `${basePath}/${e.slug}`)}): ${oneLine(e.description)}`,
    ),
    "",
  ];
}

function build(): string {
  const lines: string[] = [
    "# Iván Dujaut",
    "",
    "> Product Engineer. Casos de estudio sobre producto y seguros, fintech y" +
      " cobranzas en Argentina y Brasil, más un blog sobre oficio y carrera.",
    "",
    "El sitio es bilingüe. El español es la versión canónica y las traducciones" +
      " al inglés viven bajo `/en/`. Cada pieza declara `hreflang` y su canonical.",
    "",
    "Los casos de estudio sobre productos ajenos son análisis independientes," +
      " sin afiliación con las empresas que analizan. Cada uno declara qué es dato" +
      " medido y qué es supuesto propio.",
    "",
  ];

  lines.push(
    ...section("Casos de estudio", getProjects("es"), "es", "/projects"),
    ...section("Blog", getPosts("es"), "es", "/blog"),
  );

  if (RESEARCH_ENABLED) {
    lines.push(...section("Research", getResearch("es"), "es", "/research"));
  }

  lines.push(
    "## Páginas",
    "",
    `- [Sobre mí](${absoluteUrl("es", "/about")}): experiencia, formación y stack.`,
    `- [Sitemap](${SITE_URL}/sitemap.xml): todas las URLs, con sus alternates por idioma.`,
    "",
    // La sección `Optional` de la convención marca contenido que se puede
    // saltear si el contexto es corto. Las traducciones son eso: el mismo
    // contenido en otro idioma. Van como `###` para quedar dentro de ella y no
    // abrir secciones hermanas que la darían por terminada.
    "## Optional",
    "",
    "Traducciones al inglés de todo lo anterior. Mismo contenido, otro idioma.",
    "",
  );

  lines.push(
    ...section("Case studies (English)", getProjects("en"), "en", "/projects", 3),
    ...section("Blog (English)", getPosts("en"), "en", "/blog", 3),
  );

  if (RESEARCH_ENABLED) {
    lines.push(...section("Research (English)", getResearch("en"), "en", "/research", 3));
  }

  lines.push(
    "### Pages (English)",
    "",
    `- [About](${absoluteUrl("en", "/about")}): experience, education and stack.`,
    "",
  );

  return lines.join("\n");
}

export function GET() {
  return new Response(build(), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=0, must-revalidate",
    },
  });
}
