import { ImageResponse } from "next/og";

export const runtime = "edge";

/**
 * GET /api/og?title=...&date=...
 *
 * Genera una imagen OG dinámica para un post o página.
 *
 * Query params:
 *   - title (required): título del post o página
 *   - date (optional): fecha en formato ISO o legible
 *   - subtitle (optional): texto secundario (ej: "Blog post")
 *
 * Ejemplo: /api/og?title=Hola+mundo&date=May+9,+2026&subtitle=Blog+post
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const title = searchParams.get("title") ?? "ivandujaut";
  const date = searchParams.get("date");
  const subtitle = searchParams.get("subtitle");

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "80px",
        background: "#0a0a0a",
        fontFamily: "Inter",
      }}
    >
      {/* Header: nombre/branding */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          color: "#a3a3a3",
          fontSize: "28px",
          fontFamily: "monospace",
        }}
      >
        <span>ivandujaut</span>
      </div>

      {/* Centro: título + subtítulo */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {subtitle && (
          <div
            style={{
              fontSize: "24px",
              color: "#a3a3a3",
              fontFamily: "monospace",
              textTransform: "uppercase",
              letterSpacing: "2px",
            }}
          >
            {subtitle}
          </div>
        )}
        <div
          style={{
            fontSize: "72px",
            fontWeight: 600,
            color: "#fafafa",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            maxWidth: "1000px",
          }}
        >
          {title}
        </div>
      </div>

      {/* Footer: fecha + sitio */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "#737373",
          fontSize: "24px",
          fontFamily: "monospace",
        }}
      >
        {date && <span>{date}</span>}
        <span style={{ marginLeft: "auto" }}>ivandujaut.com</span>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  );
}
