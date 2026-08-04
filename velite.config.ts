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
      featured: s.boolean().default(false),
      stack: s.array(s.string()).min(1),
      repo: s.string().url().optional(),
      demo: s.string().url().optional(),
      figma: s.string().url().optional(),
      cover: s
        .object({
          src: s.image(),
          alt: s.string(),
        })
        .optional(),
      // Imágenes para el badge de la home (`ImagesBadge`). Exactamente 3:
      // el abanico en tamaño LARGE está diseñado para ese número y con menos
      // queda flojo. Son rutas públicas y no `s.image()` porque las imágenes
      // de los casos ya viven en `public/`, no junto al MDX.
      //
      // Ojo con la proporción: se muestran a 140x108 (ratio 1.30) con
      // `object-cover`. Una panorámica de 2000x250 se recorta a una tira
      // central sin sentido. Elegí imágenes entre ~1.1 y ~1.7 de ratio.
      //
      // El campo es opcional a propósito: la home toma el caso más nuevo que
      // lo tenga, así que un caso sin imágenes buenas simplemente no compite.
      preview: s
        .array(
          s.object({
            src: s.string(),
            alt: s.string(),
          }),
        )
        .length(3)
        .optional(),
      metrics: s
        .array(
          s.object({
            label: s.string(),
            value: s.string(),
            change: s.string().optional(),
            trend: s.enum(["up", "down", "neutral"]).optional(),
          }),
        )
        .default([]),
      translationKey: s.string().optional(),
      draft: s.boolean().default(false),
      metadata: s.metadata(),
      content: s.mdx(),
    })
    .refine((data) => !data.featured || data.cover !== undefined, {
      message: "Featured projects require a cover image",
    })
    .transform((data, { meta }) => ({
      ...data,
      slug: slugFromPath(meta.path),
      locale: localeFromPath(meta.path),
      url: `/${localeFromPath(meta.path)}/projects/${slugFromPath(meta.path)}`,
    })),
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
