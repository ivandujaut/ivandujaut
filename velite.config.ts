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
      role: s.enum(["Full-stack", "Frontend", "Backend", "Design", "Other"]),
      status: s.enum(["shipped", "in-progress", "archived", "concept"]),
      featured: s.boolean().default(false),
      stack: s.array(s.string()).min(1),
      repo: s.string().url().optional(),
      demo: s.string().url().optional(),
      cover: s
        .object({
          src: s.image(),
          alt: s.string(),
        })
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
  collections: { posts, projects },
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
