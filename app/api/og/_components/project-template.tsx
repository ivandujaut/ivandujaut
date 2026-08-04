/* eslint-disable @next/next/no-img-element */
import { Logo, Footer, Background, Tag, getTokens, type OgTheme } from "./shared";
import esMessages from "@/messages/es.json";
import enMessages from "@/messages/en.json";

/** Única fuente de los rótulos de tipo: los mismos que muestra el detalle. */
const KIND_LABELS = {
  es: esMessages.projects.kind,
  en: enMessages.projects.kind,
} as const;

/**
 * Copy del CTA. Vive acá y no en `messages` a propósito: el sitio no tiene este
 * botón en ninguna parte, así que no hay contra qué derivar. Los rótulos de
 * tipo sí existen en los dos lados, y por eso se importan.
 */
const CTA_LABELS = {
  es: {
    build: "Ver el proyecto",
    "case-study": "Leer el análisis",
    design: "Ver la propuesta",
  },
  en: {
    build: "View the project",
    "case-study": "Read the analysis",
    design: "View the proposal",
  },
} as const;

/**
 * La columna izquierda de la tarjeta no scrollea: lo que pasa de los 630px se
 * pierde, y lo último de la pila es justo el CTA y el pie con el dominio. Las
 * constantes de abajo son el presupuesto de alto de esa columna, medido sobre
 * las tarjetas reales. Son estimaciones: Satori no expone la medición del
 * texto, así que se aproxima el ancho por carácter y se verifica renderizando.
 */
const COL_W = 532; // 660 de ancho menos 64 de padding a cada lado
const COL_H = 518; // 630 de alto menos 56 arriba y abajo
const HEADER_H = 70; // logo + rótulo de tipo
const SPACER_H = 32; // el separador flexible, en su mínimo
const TITLE_GAP = 20;
const BLOCK_GAP = 32; // margen del bloque de stack + CTA
const CTA_GAP = 24;
const CTA_H = 46;
const FOOTER_H = 56;
const DESC_LINE_H = 28; // 20px de cuerpo con interlínea 1,4
const PILL_ROW_H = 46;
const DESC_CHARS_PER_LINE = 48;
const PILL_CHAR_W = 10.8; // avance medio del mono a 18px
const PILL_EXTRA = 36; // padding horizontal más el gap

/** Píldoras que entran en `maxRows` filas del ancho de la columna. */
function fitStack(stack: string[], maxRows: number) {
  const items: string[] = [];
  let rows = 1;
  let used = 0;
  for (const tech of stack) {
    const width = tech.length * PILL_CHAR_W + PILL_EXTRA;
    if (used + width > COL_W) {
      if (rows >= maxRows) break;
      rows += 1;
      used = 0;
    }
    used += width;
    items.push(tech);
  }
  // Nunca dejar el bloque vacío: una píldora sola es mejor que ninguna.
  return { items: items.length > 0 ? items : stack.slice(0, 1), rows };
}

/** Recorta en el último espacio, para no cortar una palabra por la mitad. */
function clampText(text: string, limit: number) {
  if (text.length <= limit) return text;
  return `${text.slice(0, limit).replace(/[\s.,;:]+\S*$/, "")}…`;
}

interface ProjectTemplateProps {
  title: string;
  description?: string;
  stack?: string[];
  status?: "shipped" | "in-progress" | "archived" | "concept";
  kind?: "build" | "case-study" | "design";
  coverUrl?: string;
  locale?: "es" | "en";
  theme?: OgTheme;
}

/**
 * Template OG para proyectos.
 *
 * Layout split (horizontal):
 *   - Left side (55%): logo + status + título + descripción + stack + CTA + footer
 *   - Right side (45%): cover image (si existe) o gradient sutil
 *
 * Si no hay coverUrl, el texto ocupa el ancho completo.
 */
export function ProjectTemplate({
  title,
  description,
  stack = [],
  status,
  kind = "build",
  coverUrl,
  locale = "es",
  theme = "light",
}: ProjectTemplateProps) {
  const tokens = getTokens(theme);
  // Status label según locale
  const statusLabels = {
    shipped: { es: "EN VIVO", en: "LIVE" },
    "in-progress": { es: "EN PROCESO", en: "WIP" },
    archived: { es: "ARCHIVADO", en: "ARCHIVED" },
    concept: { es: "CONCEPTO", en: "CONCEPT" },
  };

  // Tipo de pieza: es el rótulo principal y sale de los mismos mensajes que el
  // chip del sitio, no de una copia local. La copia anterior había derivado sin
  // que nada lo detectara: el sitio decía "Caso de estudio" y la tarjeta que se
  // comparte en redes, "CASO DE MEJORA". El uppercase es del estilo de la
  // tarjeta, así que se aplica acá y no se escribe en el mensaje.
  const projectLabel = KIND_LABELS[locale][kind].toUpperCase();

  // El status solo aporta en productos construidos: en casos y diseños,
  // "concepto" es redundante con el tipo de pieza (misma regla que el sitio).
  const showStatus = Boolean(status) && (kind === "build" || status !== "concept");

  // El CTA nombra lo que la persona va a hacer, y eso cambia con el tipo de
  // pieza: un producto y una propuesta se miran, un análisis se lee. Antes era
  // "Ver proyecto" para los tres, así que un análisis de PIX se anunciaba como
  // un proyecto propio en la única superficie que se consume sin contexto.
  const ctaLabel = CTA_LABELS[locale][kind];

  // A 64px entran unos 16 caracteres por línea del ancho de la columna.
  const titleLines = Math.ceil(title.length / 16);

  // Un título de cuatro líneas a 64px se come 268 de los 518px útiles, y lo que
  // queda no alcanza para descripción, stack, CTA y pie. Así que lo primero que
  // cede es el cuerpo del título, antes de podarle texto a nada.
  const titleSize = titleLines >= 4 ? 42 : titleLines === 3 ? 52 : 64;
  const titleHeight = Math.ceil(title.length / (COL_W / (titleSize * 0.52))) * titleSize * 1.05;

  // El stack se mide por ancho y no por cantidad: dos etiquetas largas
  // ("Investigación de mercado") ya desbordan la fila, y la segunda fila son
  // 46px que salen justo del pie.
  const { items: visibleStack, rows: stackRows } = fitStack(stack, titleLines >= 3 ? 1 : 2);

  // Con el resto de la columna ya reservado, lo que sobra es lo que puede ocupar
  // la descripción. Clave: esto depende del título Y de la descripción, no solo
  // del título. La tarjeta de cobranza tiene título corto y perdía el pie igual,
  // porque su descripción sola ocupaba seis líneas.
  const reserved =
    HEADER_H +
    SPACER_H +
    titleHeight +
    TITLE_GAP +
    BLOCK_GAP +
    stackRows * PILL_ROW_H +
    CTA_GAP +
    CTA_H +
    FOOTER_H;
  const descLines = Math.max(0, Math.floor((COL_H - reserved) / DESC_LINE_H));
  const visibleDescription = description
    ? clampText(description, descLines * DESC_CHARS_PER_LINE)
    : description;

  // Color del dot según status
  const statusColor =
    status === "shipped"
      ? tokens.accent
      : status === "in-progress"
        ? "#f59e0b"
        : status === "concept"
          ? "#3b82f6"
          : tokens.fgSubtle;

  return (
    <Background theme={theme}>
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
        }}
      >
        {/* LEFT SIDE: contenido (55%) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: coverUrl ? "55%" : "100%",
            padding: "56px 64px",
          }}
        >
          {/* Top zone: Logo + Project label + Status */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <Logo theme={theme} />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                fontSize: 18,
                color: tokens.fgMuted,
                fontFamily: "JetBrainsMono",
                fontWeight: 500,
                letterSpacing: "0.04em",
              }}
            >
              <span>{projectLabel}</span>
              {showStatus && status && (
                <>
                  <span style={{ color: tokens.fgSubtle }}>·</span>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        background: statusColor,
                      }}
                    />
                    <span>{statusLabels[status][locale]}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Spacer flexible */}
          <div style={{ display: "flex", flex: 1, minHeight: 32 }} />

          {/* Content zone: título + descripción */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            {/* Título */}
            <h1
              style={{
                fontSize: titleSize,
                fontWeight: 700,
                color: tokens.fg,
                lineHeight: 1.05,
                letterSpacing: "-0.04em",
                margin: 0,
                fontFamily: "Inter",
              }}
            >
              {title}
            </h1>

            {/* Descripción */}
            {visibleDescription && (
              <p
                style={{
                  fontSize: 20,
                  fontWeight: 400,
                  color: tokens.fgMuted,
                  lineHeight: 1.4,
                  margin: 0,
                  fontFamily: "Inter",
                }}
              >
                {visibleDescription}
              </p>
            )}
          </div>

          {/* Stack + CTA zone */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 24,
              marginTop: 32,
            }}
          >
            {/* Stack pills */}
            {visibleStack.length > 0 && (
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                {visibleStack.map((tech) => (
                  <Tag key={tech} label={tech} theme={theme} />
                ))}
              </div>
            )}

            {/* CTA Button */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "12px 24px",
                borderRadius: 12,
                background: tokens.fg,
                color: tokens.bg,
                fontSize: 18,
                fontWeight: 600,
                fontFamily: "Inter",
                alignSelf: "flex-start",
              }}
            >
              {ctaLabel}
            </div>
          </div>

          {/* Spacer flexible */}
          <div style={{ display: "flex", flex: 1, minHeight: 32 }} />

          {/* Bottom zone: Footer */}
          <Footer theme={theme} />
        </div>

        {/* RIGHT SIDE: cover image (45%) */}
        {coverUrl && (
          <div
            style={{
              display: "flex",
              width: "45%",
              height: "100%",
              padding: "56px 56px 56px 0",
            }}
          >
            <div
              style={{
                display: "flex",
                width: "100%",
                height: "100%",
                position: "relative",
              }}
            >
              {/* Capa verde (al fondo, desplazada abajo-derecha) */}
              <div
                style={{
                  display: "flex",
                  position: "absolute",
                  top: 16,
                  left: 16,
                  width: "100%",
                  height: "100%",
                  background: tokens.accent,
                  borderRadius: 12,
                }}
              />
              {/* Imagen (encima) */}
              <img
                src={coverUrl}
                alt=""
                width={540}
                height={566}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: 12,
                  position: "relative",
                }}
              />
            </div>
          </div>
        )}
      </div>
    </Background>
  );
}
