#!/usr/bin/env node
/**
 * Lint de contenido MDX. Lo usan dos consumidores:
 *
 *   1. El hook PostToolUse (.claude/settings.json), que le pasa el JSON del
 *      hook por stdin y solo mira el archivo que se acaba de escribir.
 *   2. El skill /content-check, que lo corre con `--all` sobre todo content/.
 *
 * Severidades, según la preferencia de este repo:
 *   ERROR  -> rompe el build o publica algo roto. Sale con código 2 para que
 *             el agente lo vea y lo corrija en el mismo turno.
 *   WARN   -> regla de estilo con excepciones legítimas. Se imprime, no frena.
 *
 * NO chequea links externos: hace red y sería lento en cada edición. Eso vive
 * en /content-check con --links.
 */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { parse as parseYaml } from "yaml";

const ROOT = resolve(dirname(new URL(import.meta.url).pathname), "../..");
const errors = [];
const warns = [];

const err = (file, msg) => errors.push(`${file}: ${msg}`);
const warn = (file, msg) => warns.push(`${file}: ${msg}`);

// Límites del schema de Velite (velite.config.ts). Duplicarlos acá es a
// propósito: el objetivo es avisar antes de que Velite falle, con el nombre del
// campo y el largo real en vez de un error de Zod.
const LIMITS = {
  projects: { title: 120, tagline: 140, description: 300 },
  posts: { title: 120, description: 220 },
  research: { title: 120, description: 300 },
};

const ROLES = ["Product", "Full-stack", "Frontend", "Backend", "Design", "Other"];
const STATUSES = ["shipped", "in-progress", "archived", "concept"];
const KINDS = ["build", "case-study", "design"];

/** Dimensiones reales de un PNG o JPEG, sin dependencias. */
function imageSize(path) {
  const buf = readFileSync(path);
  if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47) {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i < buf.length - 9) {
      if (buf[i] !== 0xff) {
        i++;
        continue;
      }
      const marker = buf[i + 1];
      // SOF0..SOF15, salteando los que no son start-of-frame (C4, C8, CC)
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
      }
      i += 2 + buf.readUInt16BE(i + 2);
    }
  }
  return null; // SVG y demás: no chequeamos dimensiones
}

function collectionOf(file) {
  if (file.includes("content/projects/")) return "projects";
  if (file.includes("content/posts/")) return "posts";
  if (file.includes("content/research/")) return "research";
  return null;
}

/** Slugs existentes por colección, para validar links internos. */
function existingSlugs(collection) {
  const out = new Set();
  for (const locale of ["es", "en"]) {
    const dir = join(ROOT, "content", collection, locale);
    if (!existsSync(dir)) continue;
    for (const entry of readdirSync(dir)) {
      out.add(entry.replace(/\.mdx$/, ""));
    }
  }
  return out;
}

function lintFile(file) {
  const rel = file.replace(`${ROOT}/`, "");
  const collection = collectionOf(file);
  if (!collection) return;

  const raw = readFileSync(file, "utf8");
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!fmMatch) {
    err(rel, "no tiene frontmatter delimitado por ---");
    return;
  }

  let fm;
  try {
    fm = parseYaml(fmMatch[1]) ?? {};
  } catch (e) {
    err(rel, `frontmatter YAML inválido: ${e.message}`);
    return;
  }

  // Los bloques y spans de código se sacan antes de cualquier chequeo: adentro
  // puede haber `<Figure fullBleed>` como ejemplo de documentación, o un guion
  // largo dentro de un snippet, y ninguno de los dos es una violación.
  const body = fmMatch[2]
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`\n]*`/g, "");

  // ---------------------------------------------------------------- ERRORES

  for (const [field, max] of Object.entries(LIMITS[collection])) {
    const v = fm[field];
    if (typeof v === "string" && v.length > max) {
      err(rel, `${field} tiene ${v.length} caracteres, el máximo es ${max}`);
    }
  }

  if (collection === "projects") {
    if (fm.role && !ROLES.includes(fm.role)) {
      err(rel, `role "${fm.role}" no es válido. Opciones: ${ROLES.join(", ")}`);
    }
    if (fm.status && !STATUSES.includes(fm.status)) {
      err(rel, `status "${fm.status}" no es válido. Opciones: ${STATUSES.join(", ")}`);
    }
    if (fm.kind && !KINDS.includes(fm.kind)) {
      err(rel, `kind "${fm.kind}" no es válido. Opciones: ${KINDS.join(", ")}`);
    }
    if (fm.featured === true && !fm.cover) {
      err(rel, "featured: true exige cover (lo pide el refine de Velite)");
    }
    if (fm.preview && fm.preview.length !== 3) {
      err(rel, `preview tiene ${fm.preview.length} imágenes, el schema pide exactamente 3`);
    }
    if (Array.isArray(fm.stack) && fm.stack.length === 0) {
      err(rel, "stack no puede estar vacío");
    }
  }

  // Cover relativa: vive al lado del MDX porque Velite la procesa con s.image()
  if (fm.cover?.src?.startsWith?.("./")) {
    const p = join(dirname(file), fm.cover.src.slice(2));
    if (!existsSync(p)) err(rel, `cover apunta a ${fm.cover.src} y ese archivo no existe`);
  }

  // Imágenes de preview: rutas públicas
  for (const item of fm.preview ?? []) {
    if (item?.src?.startsWith("/") && !existsSync(join(ROOT, "public", item.src))) {
      err(rel, `preview referencia ${item.src} y no existe en public/`);
    }
  }

  // <Figure>: el archivo tiene que existir y width/height coincidir con el real.
  // El mismatch de 1px no rompe nada visible, pero descoloca el placeholder de
  // aspect-ratio y es señal de que el PNG se regeneró sin actualizar el MDX.
  const figureRe = /<Figure\b[\s\S]*?\/>/g;
  for (const tag of body.match(figureRe) ?? []) {
    const src = tag.match(/src="([^"]+)"/)?.[1];
    if (!src) {
      err(rel, "hay un <Figure> sin src");
      continue;
    }
    if (!tag.includes("alt=")) err(rel, `<Figure src="${src}"> no tiene alt`);
    if (!src.startsWith("/")) continue;

    const abs = join(ROOT, "public", src);
    if (!existsSync(abs)) {
      err(rel, `<Figure> referencia ${src} y no existe en public/`);
      continue;
    }
    const declaredW = Number(tag.match(/width=\{(\d+)\}/)?.[1]);
    const declaredH = Number(tag.match(/height=\{(\d+)\}/)?.[1]);
    const real = imageSize(abs);
    if (real && declaredW && declaredH) {
      // Declarar el tamaño CSS a 1x con un asset 2x es el patrón retina y es
      // correcto. El chequeo por proporción con tolerancia porcentual no sirve:
      // un off-by-one (887 vs 886, la falla que motivó esto) mueve la proporción
      // 0,1% y pasaba. En cambio: se estima el divisor entero y se exige que lo
      // declarado sea el real dividido por él, con margen de medio píxel por el
      // redondeo de dimensiones impares.
      const n = Math.max(1, Math.round(real.width / declaredW));
      const dw = Math.abs(declaredW - real.width / n);
      const dh = Math.abs(declaredH - real.height / n);
      if (dw > 0.5 || dh > 0.5) {
        err(
          rel,
          `<Figure src="${src}"> declara ${declaredW}x${declaredH} y el archivo mide ${real.width}x${real.height}` +
            (n > 1 ? ` (a ${n}x correspondería ${Math.round(real.width / n)}x${Math.round(real.height / n)})` : ""),
        );
      }
    }
  }

  // Presupuesto de peso: un asset que pesa >5x la mediana de sus hermanos de
  // carpeta suele ser un SVG sin optimizar o un PNG sin comprimir (el logo de
  // matplotlib llegó a 85KB contra pares de 2KB). WARN, no error: a veces el
  // gráfico principal legítimamente pesa más.
  const figSrcs = [...body.matchAll(/<Figure\b[\s\S]*?src="(\/[^"]+)"/g)].map((m) => m[1]);
  for (const src of figSrcs) {
    const abs = join(ROOT, "public", src);
    if (!existsSync(abs)) continue;
    const siblings = readdirSync(dirname(abs))
      .map((f) => join(dirname(abs), f))
      .filter((p) => /\.(png|jpe?g|webp|svg)$/i.test(p) && statSync(p).isFile());
    if (siblings.length < 3) continue;
    const sizes = siblings.map((p) => statSync(p).size).sort((a, b) => a - b);
    const median = sizes[Math.floor(sizes.length / 2)];
    const own = statSync(abs).size;
    if (own > median * 5) {
      warn(
        rel,
        `${src} pesa ${Math.round(own / 1024)}KB contra una mediana de ${Math.round(median / 1024)}KB entre sus pares: revisar compresión`,
      );
    }
  }

  // Links internos a otras entradas del sitio
  for (const m of body.matchAll(/\]\((\/(?:projects|blog|research)\/[a-z0-9-]+)\)/g)) {
    const [, href] = m;
    const [, section, slug] = href.split("/");
    const collectionForHref = section === "blog" ? "posts" : section;
    if (!existingSlugs(collectionForHref).has(slug)) {
      err(rel, `link interno ${href} no corresponde a ninguna entrada de content/${collectionForHref}/`);
    }
  }

  // ------------------------------------------------------------------ WARNS

  // Las URLs se sacan para los chequeos de estilo: el slug de una nota ajena
  // ("...lanza-dos-innovadoras-coberturas") no es prosa propia.
  const prose = body.replace(/\]\(https?:\/\/[^)]+\)/g, "]()").replace(/https?:\/\/\S+/g, "");

  const emDashes = (prose.match(/—/g) ?? []).length;
  if (emDashes > 0) {
    warn(rel, `${emDashes} guion(es) largo(s) (—). Usar paréntesis, dos puntos o frase nueva`);
  }

  // "No es X. Es Y." y sus variantes usadas como remate. Máximo una por pieza.
  // Acepta coma como separador y "fue" en la segunda cláusula: "no fue una
  // decisión, fue una consecuencia" es el mismo molde. Las variantes con verbo
  // repetido ("no compite contra A, compite contra B") las cuenta el auditor
  // del nodo 5, no este regex: automatizarlas da demasiados falsos positivos.
  const noEsPattern = /\bno (?:es|son|fue|era|se trata de)\b[^.;:,]{0,60}[.;:,]\s*(?:es|son|era|fue)\b/gi;
  const hits = prose.match(noEsPattern) ?? [];
  if (hits.length > 1) {
    warn(
      rel,
      `la estructura "No es X. Es Y." aparece ${hits.length} veces (máximo 1). Primera: "${hits[0].trim().slice(0, 70)}"`,
    );
  }

  for (const m of prose.matchAll(/\b(revolucionari\w+|disruptiv\w+|game.?changer|innovador\w*)\b/gi)) {
    warn(rel, `adjetivo inflador sin dato atrás: "${m[1]}"`);
  }

  for (const m of prose.matchAll(/\b(simulé el rol|como si fuera (?:un )?PM|con fines de portfolio)\b/gi)) {
    warn(rel, `lenguaje de aspirante: "${m[1]}"`);
  }

  if (/\b(tú|debes|puedes|tienes que)\b/.test(prose)) {
    warn(rel, "aparece tuteo peninsular. El sitio usa voseo rioplatense");
  }
}

// ------------------------------------------------------------------ entrada

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (p.endsWith(".mdx")) out.push(p);
  }
  return out;
}

const argv = process.argv.slice(2);
let files = [];

if (argv.includes("--all")) {
  files = walk(join(ROOT, "content"));
} else if (argv.length > 0) {
  files = argv.map((f) => resolve(ROOT, f));
} else {
  // Modo hook: el payload llega por stdin
  let stdin = "";
  try {
    stdin = readFileSync(0, "utf8");
  } catch {
    /* sin stdin */
  }
  try {
    const payload = JSON.parse(stdin);
    const p = payload?.tool_input?.file_path;
    if (p) files = [p];
  } catch {
    /* stdin vacío o no-JSON: nada que lintear */
  }
}

files = files.filter((f) => f.includes("/content/") && f.endsWith(".mdx") && existsSync(f));
if (files.length === 0) process.exit(0);

for (const f of files) lintFile(f);

if (warns.length) {
  console.error(`\n⚠ Estilo (${warns.length}):`);
  for (const w of warns) console.error(`  - ${w}`);
}
if (errors.length) {
  console.error(`\n✖ Errores que hay que corregir (${errors.length}):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(2);
}
if (warns.length) process.exit(0);

if (argv.includes("--all")) console.error(`✓ ${files.length} archivos sin problemas`);
process.exit(0);
