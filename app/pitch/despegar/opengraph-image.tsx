import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { hero, journey, og } from "./despegar.data";

/**
 * La imagen del link compartido: el titular de la portada a la izquierda y el
 * pasaje dado vuelta a la derecha (USD 412 tachado, USD 486). Se genera una
 * vez, en el build.
 *
 * Tipografías: Rubik, la de la página, se pide a Google Fonts sólo con los
 * caracteres que se usan (el generador necesita TTF, y `next/font` sólo deja
 * WOFF2). Si el build no tiene red, cae en Archivo, que está en `public/fonts`.
 * La mono es Chivo Mono, también local.
 */

export const alt = og.alt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const C = {
  bg: "#f3effc",
  paper: "#fffdf8",
  ink: "#1d1340",
  dim: "rgba(29, 19, 64, 0.74)",
  faint: "rgba(29, 19, 64, 0.42)",
  rule: "rgba(29, 19, 64, 0.14)",
  seen: "#4300d2",
  paid: "#b81404",
};

const t = journey.ticket;
const title = [hero.title, hero.titleAccent];

async function rubik(weight: number, text: string): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=Rubik:wght@${weight}&text=${encodeURIComponent(text)}`,
    ).then((r) => r.text());
    const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    if (!url) return null;
    return await fetch(url).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

async function local(file: string) {
  const buf = await readFile(join(process.cwd(), "public/fonts", file));
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
}

export default async function Image() {
  const sansText = [...title, t.from, t.to, t.seen.price, t.paid.price, hero.board.label].join(" ");
  const sans = (await rubik(600, sansText)) ?? (await local("Archivo-600.ttf"));
  const mono = await local("ChivoMono-400.ttf");

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        padding: "0 72px",
        background: C.bg,
        color: C.ink,
        fontFamily: "Sans",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", width: 560 }}>
        <div style={{ fontFamily: "Mono", fontSize: 22, color: C.dim }}>{hero.kicker}</div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 28,
            fontSize: 54,
            lineHeight: 1.12,
            letterSpacing: -1,
          }}
        >
          <span style={{ textWrap: "balance" }}>{title[0]}</span>
          <span style={{ marginTop: 14, textWrap: "balance" }}>{title[1]}</span>
        </div>
        <div style={{ marginTop: 44, fontFamily: "Mono", fontSize: 20, color: C.dim }}>
          {og.footer}
        </div>
      </div>

      <div
        style={{ display: "flex", flexDirection: "column", alignItems: "center", marginLeft: 48 }}
      >
        {/* El dorso del pasaje: talón a la izquierda, cuerpo a la derecha. */}
        <div
          style={{
            display: "flex",
            width: 470,
            height: 220,
            borderRadius: 16,
            background: C.paper,
            border: `1.5px solid ${C.rule}`,
            transform: "rotate(-5deg)",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              width: 120,
              alignItems: "center",
              justifyContent: "center",
              borderRight: `2px dashed ${C.faint}`,
            }}
          >
            <div style={{ display: "flex", gap: 3, height: 150 }}>
              {[3, 1, 2, 1, 4, 1, 1, 3, 2, 1, 2, 3, 1, 2].map((w, i) => (
                <div key={i} style={{ width: w * 2, height: "100%", background: C.ink }} />
              ))}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              padding: "22px 26px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontFamily: "Mono",
                fontSize: 15,
                color: C.dim,
              }}
            >
              <span>{`${t.label} · ${t.outbound}`}</span>
              <span>{t.date}</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 10,
                fontSize: 52,
              }}
            >
              <span>{t.from}</span>
              <div
                style={{
                  display: "flex",
                  flex: 1,
                  margin: "0 16px",
                  borderTop: `2px dashed ${C.faint}`,
                }}
              />
              <span>{t.to}</span>
            </div>
            <div style={{ marginTop: 10, fontFamily: "Mono", fontSize: 15, color: C.dim }}>
              {t.paid.step}
            </div>
            <div
              style={{
                display: "flex",
                // El generador no alinea bien por línea de base: se alinean los
                // pies con interlineado 1 y el chico sube lo que le falta (la
                // diferencia de descendente entre 42 y 24 de cuerpo en Rubik).
                alignItems: "flex-end",
                justifyContent: "space-between",
                gap: 18,
                marginTop: 4,
              }}
            >
              <span style={{ fontSize: 42, lineHeight: 1, color: C.paid, whiteSpace: "nowrap" }}>
                {t.paid.price}
              </span>
              <span
                style={{
                  fontSize: 24,
                  lineHeight: 1,
                  marginBottom: 3,
                  color: C.dim,
                  textDecoration: "line-through",
                  whiteSpace: "nowrap",
                }}
              >
                {t.seen.price}
              </span>
            </div>
          </div>
          {/* Las muescas del troquel, del color del fondo. */}
          <div
            style={{
              position: "absolute",
              left: 106,
              top: -14,
              width: 28,
              height: 28,
              borderRadius: 14,
              background: C.bg,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 106,
              bottom: -14,
              width: 28,
              height: 28,
              borderRadius: 14,
              background: C.bg,
            }}
          />
        </div>
        <div
          style={{
            marginTop: 40,
            padding: "4px 12px",
            border: `1.5px dashed ${C.faint}`,
            borderRadius: 6,
            fontSize: 16,
            color: C.dim,
          }}
        >
          {hero.board.label}
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Sans", data: sans, style: "normal", weight: 600 },
        { name: "Mono", data: mono, style: "normal", weight: 400 },
      ],
    },
  );
}
