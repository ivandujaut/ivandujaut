// Baja los logos de la colección `logos` de Iconify (gilbarbara/svg-logos, CC0)
// y genera un módulo TS con el markup inline. Se corre una vez; el resultado se
// commitea. Así no sumamos otro runtime de iconos al bundle.
import { writeFileSync } from "node:fs";

const ICONS = {
  typescript: "typescript-icon",
  nextjs: "nextjs-icon",
  react: "react",
  tailwind: "tailwindcss-icon",
  postgresql: "postgresql",
  supabase: "supabase-icon",
  python: "python",
  pandas: "pandas-icon",
  docker: "docker-icon",
  figma: "figma",
  githubActions: "github-actions",
  hono: "hono",
  playwright: "playwright",
  redis: "redis",
  claude: "claude-icon",
  openai: "openai-icon",
  nodejs: "nodejs-icon",
  vercel: "vercel-icon",
  stripe: "stripe",
  paypal: "paypal",
  materialui: "material-ui",
  jira: "jira",
  linear: "linear-icon",
  notion: "notion-icon",
  numpy: "numpy",
  git: "git-icon",
};

const entries = [];
for (const [key, name] of Object.entries(ICONS)) {
  const res = await fetch(`https://api.iconify.design/logos/${name}.svg`);
  if (!res.ok) {
    console.error(`FALLO ${name}: ${res.status}`);
    continue;
  }
  let svg = (await res.text()).trim();
  // El endpoint devuelve width/height fijos; los sacamos para que el tamaño lo
  // controle la clase CSS y el icono no rompa el layout.
  svg = svg.replace(/\s(width|height)="[^"]*"/g, "");
  svg = svg.replace("<svg", '<svg class="h-full w-full" aria-hidden="true" focusable="false"');
  entries.push([key, name, svg]);
  console.error(`ok ${name} (${svg.length} bytes)`);
}

const body = entries
  .map(([key, name, svg]) => `  // logos:${name}\n  ${key}: \`${svg.replace(/`/g, "\\`")}\`,`)
  .join("\n");

writeFileSync(
  "lib/tech-icons.generated.ts",
  `// GENERADO - no editar a mano.
// Origen: colección \`logos\` de Iconify (gilbarbara/svg-logos, CC0). Los logos
// son marcas de sus dueños; se usan solo para identificar la tecnología.
// Para regenerar: ver scripts/fetch-tech-icons.mjs

export const TECH_ICON_SVG = {
${body}
} as const;

export type TechIconKey = keyof typeof TECH_ICON_SVG;
`,
);

console.error(`\n${entries.length} iconos escritos en lib/tech-icons.generated.ts`);
