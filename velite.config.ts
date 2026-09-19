import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { defineConfig, defineCollection, s } from "velite";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
// import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkGfm from "remark-gfm";

// ============================================================================
// Helpers compartidos
// ============================================================================

const slugFromPath = (filePath: string): string => {
  const parts = filePath.split("/");
  const fileName = parts[parts.length - 1];

  // Si el archivo se llama "index.mdx", usar el nombre de la carpeta padre.
  // Si no, usar el nombre del archivo sin extensión.
  // Esto soporta tanto la estructura nueva (carpeta/index.mdx)
  // como la vieja (slug.mdx) para retrocompatibilidad.
  if (fileName === "index.mdx") {
    return parts[parts.length - 2];
  }
  return fileName.replace(/\.mdx$/, "");
};

/**
 * Los scripts que git conoce, para validar el campo `code` de un caso.
 *
 * El caso linkea su script a GitHub, así que un archivo que existe en la
 * máquina pero nunca se commiteó daría un link roto en producción y, peor, una
 * promesa de reproducibilidad que no se puede cumplir. Se consulta una vez por
 * build. Si `git` no está disponible (algún entorno de build sin repo), la
 * validación cae a la existencia en disco y no frena nada.
 */
const trackedScripts: Set<string> | null = (() => {
  try {
    const output = execFileSync("git", ["ls-files", "scripts"], { encoding: "utf8" });
    return new Set(output.split("\n").filter(Boolean));
  } catch {
    return null;
  }
})();

const localeFromPath = (filePath: string): "es" | "en" => {
  if (filePath.includes("/es/")) return "es";
  if (filePath.includes("/en/")) return "en";
  throw new Error(`Cannot determine locale from path: ${filePath}`);
};

// ============================================================================
// Posts del blog
// ============================================================================

const posts = defineCollection({
  name: "Post",
  pattern: "posts/**/*.mdx",
  schema: s
    .object({
      title: s.string().max(120),
      description: s.string().max(220),
      date: s.isodate(),
      updated: s.isodate().optional(),
      // Vincula traducciones del mismo post entre idiomas.
      // Ej: post-es.mdx y post-en.mdx con translationKey: "my-first-post"
      translationKey: s.string().optional(),
      tags: s.array(s.string()).default([]),
      draft: s.boolean().default(false),
      cover: s
        .object({
          src: s.image(),
          alt: s.string(),
        })
        .optional(),
      // Auto-generados por Velite
      metadata: s.metadata(),
      excerpt: s.excerpt(),
      content: s.mdx(),
    })
    .transform((data, { meta }) => ({
      ...data,
      slug: slugFromPath(meta.path),
      locale: localeFromPath(meta.path),
      url: `/${localeFromPath(meta.path)}/blog/${slugFromPath(meta.path)}`,
    })),
});

// ============================================================================
// Casos de estudio (projects)
// ============================================================================

const projects = defineCollection({
  name: "Project",
  pattern: "projects/**/*.mdx",
  schema: s
    .object({
      title: s.string().max(120),
      tagline: s.string().max(140),
      description: s.string().max(300),
      year: s.number().int().min(2000).max(2100),
      // Fecha real de publicación del caso (para ordenar el listado); year queda solo para mostrar.
      date: s.isodate(),
      // Última edición de fondo, para el `lastmod` del sitemap. Opcional: sin
      // ella el sitemap usa `date`. No se toca por un arreglo de tipeo; se
      // toca cuando cambia algo que a un lector le importaría releer.
      updated: s.isodate().optional(),
      status: s.enum(["shipped", "in-progress", "archived", "concept"]),
      // Qué tipo de trabajo es la pieza: producto construido, caso de mejora
      // sobre un producto ajeno, o diseño. Eje independiente del status.
      kind: s.enum(["build", "case-study", "design"]).default("build"),
      // De quién es el producto del que habla la pieza. Es un eje distinto de
      // `kind` y no se deduce de él: `investor-mode` es un diseño (kind) sobre
      // un producto ajeno (subject), y nada impide que algún día haya un diseño
      // sobre algo propio.
      //
      // El listado agrupa por acá, bajo encabezados que dicen "Productos que
      // construí" y "Productos ajenos que analicé". Una pieza mal marcada queda
      // debajo de un título que afirma algo falso, así que el campo es
      // obligatorio y sin default: cada caso nuevo tiene que declararlo.
      subject: s.enum(["own", "external"]),
      // Tema de la pieza. Elige los "siguientes casos" al pie de cada una:
      // seguros con seguros, salud con salud. Existe desde el 11/09/2026
      // porque los vecinos por fecha no funcionaban: en los primeros 24 días
      // de PostHog nadie terminó dos piezas en la misma sesión, y quien
      // terminaba un caso de seguros encontraba abajo uno de GLP-1. Sin
      // default y obligatorio por la misma razón que `subject`: un caso sin
      // tema aparecería como "siguiente" de cualquier otro.
      topic: s.enum(["seguros", "salud", "fintech", "proptech", "educacion", "web"]),
      // Marca de curaduría. Desde el 18/09/2026 no la lee ninguna página: la
      // home mostraba las tres piezas marcadas más nuevas y el flag se
      // desactualizaba solo (las cuatro piezas más recientes del sitio no
      // estaban marcadas, así que la home mostraba trabajo viejo). Ahora la
      // home toma las tres más nuevas y no hay nada que mantener. El campo
      // queda porque lo declaran los dieciocho casos ya escritos, y porque las
      // dos reglas de abajo siguen siendo ciertas si vuelve a usarse.
      featured: s.boolean().default(false),
      // La pieza por la que conviene empezar a leer el sitio. El índice la
      // ancla arriba de todo, fuera de los grupos, con su propia etiqueta.
      //
      // Existe desde el 18/09/2026: catorce análisis con el mismo badge, el
      // mismo año y portadas abstractas dejaban al visitante eligiendo entre
      // titulares equivalentes, y los replays mostraban gente recorriendo la
      // lista entera sin abrir ninguno. Elegir es trabajo; esto lo hace por él.
      //
      // Se marca una sola pieza por idioma. Si hay más de una, el índice toma
      // la más nueva y las demás quedan en su grupo, sin etiqueta.
      entry: s.boolean().default(false),
      stack: s.array(s.string()).min(1),
      // Las entidades que el caso analiza: empresas, programas, productos y
      // organismos con nombre propio. Van al `about` del JSON-LD, al lado del
      // tema, y son lo que permite que una máquina entienda que la pieza habla
      // de Medicare y de Xarelto, y no sólo de "acceso al mercado en salud".
      //
      // Se escriben con el nombre por el que se los busca, y son los mismos en
      // castellano y en inglés porque son nombres propios. Tres a seis por
      // caso: más que eso diluye, y una entidad que el caso apenas menciona no
      // entra, porque `about` declara de qué habla la pieza y no qué nombra.
      entities: s.array(s.string()).default([]),
      repo: s.string().url().optional(),
      demo: s.string().url().optional(),
      figma: s.string().url().optional(),
      cover: s
        .object({
          src: s.image(),
          alt: s.string(),
        })
        .optional(),
      // Gráficos del caso, exactamente 3. Son rutas públicas y no `s.image()`
      // porque las imágenes de los casos ya viven en `public/`, no junto al
      // MDX.
      //
      // Hoy no lo lee ninguna página, y conviene saberlo antes de apoyarse en
      // él: los tres los usaba el abanico del badge del hero, que salió el
      // 18/09/2026, y la tarjeta de la home muestra la portada (decisión de
      // Iván el 19/09). El campo queda porque siete casos ya lo declaran y
      // porque es el material listo para cuando algo vuelva a mostrar gráficos.
      preview: s
        .array(
          s.object({
            src: s.string(),
            alt: s.string(),
          }),
        )
        .length(3)
        .optional(),
      // Tarjetas del encabezado. Regla: el `value` es UN valor que aterriza
      // solo, nunca una secuencia ("6,9 → 6,9 → 9,2%" no la pudo leer ni el
      // autor). Si la tendencia importa se declara aparte: `trend` es la
      // dirección, `sentiment` dice si esa dirección es buena o mala (la
      // morosidad bajando es verde aunque la flecha apunte para abajo) y
      // `change` es la magnitud ("−1,3 pp"). El sitio dibuja la flecha
      // verde o roja: el lector sabe si es mejora sin leer el caso.
      metrics: s
        .array(
          s
            .object({
              label: s.string(),
              value: s.string(),
              change: s.string().optional(),
              trend: s.enum(["up", "down", "neutral"]).optional(),
              sentiment: s.enum(["good", "bad"]).optional(),
            })
            .refine((m) => !m.trend || m.trend === "neutral" || !!m.sentiment, {
              message:
                "Una métrica con trend up/down exige sentiment: la dirección sola no dice si es mejora",
            }),
        )
        .default([]),
      // Scripts que producen los números del caso, como rutas desde la raíz
      // del repo ("scripts/analysis/pix-brasil.py"). El pie del caso los
      // linkea a GitHub.
      //
      // Existe desde el 18/09/2026. Los scripts estaban commiteados y los
      // casos hablaban de ellos en prosa ("el modelo completo está en el
      // script del caso") sin un solo enlace: la afirmación que sostiene todo
      // el sitio, que cada cifra se puede recalcular, quedaba como algo que el
      // lector tenía que creer.
      //
      // Dos piezas pueden compartir script (`xarelto-sin-visita` y
      // `acceso-parte-d` salen del mismo análisis), y una pieza puede no tener
      // ninguno: un caso hecho a mano sobre cifras publicadas no gana nada con
      // un archivo vacío.
      code: s.array(s.string()).default([]),
      translationKey: s.string().optional(),
      // Slug del pitch del que esta pieza es el análisis completo, en el mismo
      // idioma. Existe desde el 17/09/2026: los lectores decían que un caso de
      // 9 a 12 minutos se lee "como un paper", así que la pieza sale en dos
      // capas, un pitch corto que se lista y el análisis que lo respalda. Con
      // `parent`, la pieza no aparece en ningún listado (índice, home, RSS,
      // llms.txt, siguientes casos): se llega desde el botón al pie del pitch.
      // Sigue en el sitemap y en /stats. Necesita su propio `translationKey`:
      // si comparte el del pitch, el sitemap y los hreflang los mezclan.
      parent: s.string().optional(),
      draft: s.boolean().default(false),
      metadata: s.metadata(),
      content: s.mdx(),
    })
    .refine((data) => !data.featured || data.cover !== undefined, {
      message: "Featured projects require a cover image",
    })
    .refine((data) => !(data.featured && data.parent), {
      message: "An analysis with a parent cannot be featured: readers reach it from its pitch",
    })
    .transform((data, { meta }) => {
      // Va en el transform y no en un `.refine()`: velite trata un refine que
      // falla como `info`, sigue de largo y deja el caso en la salida igual, o
      // sea que avisa donde nadie mira. Acá corta el build.
      //
      // Se valida que el archivo exista **y que git lo trackee**: un script que
      // vive en la máquina y nunca se commiteó da un link roto en producción y,
      // peor, una promesa de reproducibilidad que no se puede cumplir.
      const rotos = data.code.filter(
        (ruta) => !existsSync(ruta) || (trackedScripts && !trackedScripts.has(ruta)),
      );
      if (rotos.length > 0) {
        throw new Error(
          `${meta.path}: el campo \`code\` apunta a ${rotos.join(", ")}, que no existe en disco ` +
            "o que git no trackea. El caso linkea esa ruta a GitHub, así que el archivo tiene que " +
            "estar commiteado antes de declararlo.",
        );
      }

      return {
        ...data,
        slug: slugFromPath(meta.path),
        locale: localeFromPath(meta.path),
        url: `/${localeFromPath(meta.path)}/projects/${slugFromPath(meta.path)}`,
      };
    }),
});

// ============================================================================
// Research papers (long-form academic / technical write-ups)
// ============================================================================

const research = defineCollection({
  name: "Research",
  pattern: "research/**/*.mdx",
  schema: s
    .object({
      title: s.string().max(160),
      tagline: s.string().max(180),
      description: s.string().max(320),
      // Publication year. Same range as projects.
      year: s.number().int().min(2000).max(2100),
      // Where this paper sits in its lifecycle.
      status: s.enum(["draft", "preprint", "published", "archived"]),
      // Optional external publication (journal, repo, arXiv).
      venue: s.string().optional(),
      doi: s.string().optional(),
      pdf: s.string().optional(),
      tags: s.array(s.string()).default([]),
      featured: s.boolean().default(false),
      translationKey: s.string().optional(),
      draft: s.boolean().default(false),
      cover: s
        .object({
          src: s.image(),
          alt: s.string(),
        })
        .optional(),
      metadata: s.metadata(),
      content: s.mdx(),
    })
    .transform((data, { meta }) => ({
      ...data,
      slug: slugFromPath(meta.path),
      locale: localeFromPath(meta.path),
      url: `/${localeFromPath(meta.path)}/research/${slugFromPath(meta.path)}`,
    })),
});

// ============================================================================
// Config principal
// ============================================================================

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
  collections: { posts, projects, research },
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypePrettyCode,
        {
          theme: { dark: "github-dark", light: "github-light" },
          keepBackground: false,
        },
      ],
      // [
      //   rehypeAutolinkHeadings,
      //   {
      //     behavior: "wrap",
      //     properties: { className: ["heading-anchor"] },
      //   },
      // ],
    ],
  },
});
