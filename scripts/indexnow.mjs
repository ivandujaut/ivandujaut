#!/usr/bin/env node
// @ts-check
/**
 * Pingueá IndexNow (Bing + Yandex) con una o más URLs.
 *
 * Uso:
 *   npm run indexnow -- https://ivandujaut.com/blog/un-post
 *   npm run indexnow -- https://ivandujaut.com/blog/a https://ivandujaut.com/blog/b
 *
 * Sin argumentos, pingueá la home en ambos locales (smoke test).
 *
 * Requiere INDEXNOW_KEY y NEXT_PUBLIC_SITE_URL en .env.local.
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// Carga liviana de .env.local sin sumar dependency.
function loadEnvLocal() {
  try {
    const raw = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) continue;
      const k = trimmed.slice(0, eqIdx).trim();
      const v = trimmed
        .slice(eqIdx + 1)
        .trim()
        .replace(/^['"]|['"]$/g, "");
      if (!(k in process.env)) process.env[k] = v;
    }
  } catch {
    // .env.local opcional
  }
}

loadEnvLocal();

const key = process.env.INDEXNOW_KEY;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

if (!key) {
  console.error("Missing INDEXNOW_KEY in env");
  process.exit(1);
}

if (!siteUrl) {
  console.error("Missing NEXT_PUBLIC_SITE_URL in env");
  process.exit(1);
}

const args = process.argv.slice(2);
const urls = args.length > 0 ? args : [siteUrl, `${siteUrl}/en`];

const host = new URL(siteUrl).host;

// Guard: IndexNow rechaza URLs que no pertenezcan al host verificado y
// rate-limitea agresivamente cuando le mandás URLs inválidas. Si tu
// .env.local apunta a localhost (caso típico durante dev), abortamos
// antes de quemar el rate limit.
if (host === "localhost" || host.startsWith("localhost:") || host === "127.0.0.1") {
  console.error(
    `Refusing to ping IndexNow with host "${host}".\n` +
      `IndexNow solo acepta URLs del dominio verificado.\n` +
      `Pasá URLs de producción como argumentos, o seteá NEXT_PUBLIC_SITE_URL\n` +
      `temporalmente a tu dominio público:\n\n` +
      `  NEXT_PUBLIC_SITE_URL=https://tu-dominio.com npm run indexnow\n`,
  );
  process.exit(1);
}

for (const u of urls) {
  const uHost = new URL(u).host;
  if (uHost !== host) {
    console.error(`URL "${u}" no pertenece al host verificado "${host}". IndexNow la rechazaría.`);
    process.exit(1);
  }
}

const body = {
  host,
  key,
  keyLocation: `${siteUrl}/${key}.txt`,
  urlList: urls,
};

console.log(`→ Pinging IndexNow for ${urls.length} URL(s):`);
for (const u of urls) console.log(`  · ${u}`);

const res = await fetch("https://api.indexnow.org/IndexNow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(body),
});

// IndexNow responses:
//   200 → accepted
//   202 → accepted, pending verification
//   400 → bad request
//   403 → key not valid (verification file missing or wrong content)
//   422 → URL(s) outside host scope
//   429 → too many requests
console.log(`← ${res.status} ${res.statusText}`);

if (!res.ok && res.status !== 202) {
  const text = await res.text();
  if (text) console.error(text);
  process.exit(1);
}
