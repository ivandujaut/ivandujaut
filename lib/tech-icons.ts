import { TECH_ICON_SVG, type TechIconKey } from "./tech-icons.generated";

export { TECH_ICON_SVG, type TechIconKey };

/**
 * Resuelve un valor de `stack` del frontmatter al logo que le corresponde.
 *
 * Los valores los escribe a mano quien redacta el caso, así que hay variantes
 * ("Next.js" y "Next.js 15"), agregados ("Claude (AI SDK)", "OpenAI
 * embeddings") y entradas que directamente no son una tecnología con logo
 * ("Datos abiertos (SSN · SRT)"). En vez de exigir que el frontmatter use
 * claves exactas, normalizamos acá: es el único lugar que hay que tocar cuando
 * aparece un nombre nuevo, y el contenido se sigue escribiendo en prosa.
 */
const ALIASES: Record<string, TechIconKey> = {
  typescript: "typescript",
  javascript: "typescript",
  "next.js": "nextjs",
  nextjs: "nextjs",
  next: "nextjs",
  react: "react",
  "tailwind css": "tailwind",
  tailwindcss: "tailwind",
  tailwind: "tailwind",
  postgresql: "postgresql",
  postgres: "postgresql",
  supabase: "supabase",
  python: "python",
  pandas: "pandas",
  docker: "docker",
  figma: "figma",
  "github actions": "githubActions",
  github: "githubActions",
  hono: "hono",
  playwright: "playwright",
  redis: "redis",
  upstash: "redis",
  claude: "claude",
  anthropic: "claude",
  openai: "openai",
  "node.js": "nodejs",
  nodejs: "nodejs",
  node: "nodejs",
  vercel: "vercel",
  stripe: "stripe",
  paypal: "paypal",
  materialui: "materialui",
  "material ui": "materialui",
  mui: "materialui",
  jira: "jira",
  linear: "linear",
  notion: "notion",
  numpy: "numpy",
  matplotlib: "matplotlib",
  git: "git",
};

/**
 * Normaliza un nombre de tecnología para buscarlo en los alias:
 * baja a minúsculas, saca lo que va entre paréntesis ("Claude (AI SDK)" →
 * "claude") y saca un número de versión al final ("Next.js 15" → "next.js").
 */
function normalize(name: string): string {
  return name
    .toLowerCase()
    .replace(/\([^)]*\)/g, "")
    .replace(/\s+v?\d+(\.\d+)*$/, "")
    .trim();
}

export function resolveTechIcon(name: string): string | undefined {
  const normalized = normalize(name);
  const key = ALIASES[normalized];
  if (key) return TECH_ICON_SVG[key];

  // Segunda pasada: nombres compuestos como "OpenAI embeddings" o
  // "Datos abiertos (SSN · SRT)", donde la marca es la primera palabra.
  const firstWord = normalized.split(/[\s·]/)[0];
  const fallbackKey = ALIASES[firstWord];
  return fallbackKey ? TECH_ICON_SVG[fallbackKey] : undefined;
}

// Nota: no hay fallback de icono a propósito. Lo que no está acá se muestra
// solo con su nombre; ver el comentario en `components/content/stack-list.tsx`.
