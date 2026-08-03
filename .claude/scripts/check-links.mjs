#!/usr/bin/env node
/**
 * Chequea que los links externos del contenido sigan vivos.
 *
 * Nace de un caso real: una nota de prensa citada en un caso de estudio dejó de
 * existir y el newsroom empezó a redirigir a su home. El link devolvía 200, así
 * que un chequeo de status solo no alcanzaba. Por eso además se reporta cuando
 * una URL con path termina redirigida a la raíz del dominio.
 *
 * No corre en el hook (hace red y es lento). Vive en /content-check.
 *
 *   node .claude/scripts/check-links.mjs [--json]
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname, resolve } from "node:path";

const ROOT = resolve(dirname(new URL(import.meta.url).pathname), "../..");
const TIMEOUT_MS = 15000;
const CONCURRENCY = 6;

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (p.endsWith(".mdx")) out.push(p);
  }
  return out;
}

// Sin argumentos escanea todo content/ (modo cron). Con paths como argumentos
// se acota a esas piezas (modo /content-check): así un link viejo de otro caso
// no bloquea la publicación del nuevo; ese es trabajo del cron, no del gate.
const fileArgs = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const targets = fileArgs.length
  ? fileArgs.map((f) => resolve(ROOT, f)).filter((f) => f.endsWith(".mdx"))
  : walk(join(ROOT, "content"));

// URL -> archivos que la citan
const urls = new Map();
for (const file of targets) {
  const rel = file.replace(`${ROOT}/`, "");
  const body = readFileSync(file, "utf8");
  for (const m of body.matchAll(/\]\((https?:\/\/[^)\s]+)\)/g)) {
    const u = m[1];
    if (!urls.has(u)) urls.set(u, new Set());
    urls.get(u).add(rel);
  }
}

async function probe(url) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  const opts = {
    signal: ctrl.signal,
    redirect: "follow",
    // Varios diarios devuelven 403 a clientes sin UA de navegador.
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36",
      Accept: "text/html,application/xhtml+xml",
    },
  };
  try {
    let res = await fetch(url, { ...opts, method: "HEAD" });
    // Algunos servidores no implementan HEAD; se reintenta con GET.
    if (res.status === 405 || res.status === 501) {
      res = await fetch(url, { ...opts, method: "GET" });
    }
    const final = new URL(res.url);
    const original = new URL(url);
    const hadPath = original.pathname.replace(/\/+$/, "").length > 0;
    const landedOnRoot = final.pathname.replace(/\/+$/, "").length === 0;
    return {
      status: res.status,
      ok: res.ok,
      redirectedToRoot: hadPath && landedOnRoot,
      finalUrl: res.url,
    };
  } catch (e) {
    return { status: 0, ok: false, error: e.name === "AbortError" ? "timeout" : e.message };
  } finally {
    clearTimeout(timer);
  }
}

const entries = [...urls.entries()];
const results = [];
for (let i = 0; i < entries.length; i += CONCURRENCY) {
  const batch = entries.slice(i, i + CONCURRENCY);
  const settled = await Promise.all(
    batch.map(async ([url, files]) => ({ url, files: [...files], ...(await probe(url)) })),
  );
  results.push(...settled);
  process.stderr.write(`\r  chequeando ${Math.min(i + CONCURRENCY, entries.length)}/${entries.length}`);
}
process.stderr.write("\r".padEnd(50) + "\r");

if (process.argv.includes("--json")) {
  console.log(JSON.stringify(results, null, 2));
  process.exit(0);
}

const dead = results.filter((r) => !r.ok);
const suspicious = results.filter((r) => r.ok && r.redirectedToRoot);
// 403 y 999 (el código propio de LinkedIn) son anti-bot, no links muertos: se
// separan para no cortar la verificación por ellos.
const ANTIBOT = [401, 403, 999];
const blocked = dead.filter((r) => ANTIBOT.includes(r.status));
const broken = dead.filter((r) => !ANTIBOT.includes(r.status));

if (broken.length) {
  console.error(`\n✖ Links rotos (${broken.length}):`);
  for (const r of broken) {
    console.error(`  - ${r.status || r.error} ${r.url}`);
    for (const f of r.files) console.error(`      citado en ${f}`);
  }
}
if (suspicious.length) {
  console.error(`\n⚠ Redirigen a la home, probable nota dada de baja (${suspicious.length}):`);
  for (const r of suspicious) {
    console.error(`  - ${r.url}\n      termina en ${r.finalUrl}`);
    for (const f of r.files) console.error(`      citado en ${f}`);
  }
}
if (blocked.length) {
  console.error(`\nℹ Anti-bot (403/999), probablemente no sean links muertos (${blocked.length}):`);
  for (const r of blocked) console.error(`  - ${r.url}`);
}

const okCount = results.length - dead.length - suspicious.length;
console.error(`\n${okCount}/${results.length} links vivos`);
process.exit(broken.length || suspicious.length ? 2 : 0);
