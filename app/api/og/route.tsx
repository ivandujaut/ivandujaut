import { ImageResponse } from "next/og";
import { loadFonts } from "./_components/fonts";
import { PostTemplate } from "./_components/post-template";
import { ProjectTemplate } from "./_components/project-template";
import { DefaultTemplate } from "./_components/default-template";
import { verifyOgQuery } from "@/lib/og-sign";
import { check, ogRatelimit } from "@/lib/ratelimit";
import { hashIp, getIpFromRequest } from "@/lib/hash";

export const runtime = "nodejs";

/**
 * GET /api/og?template=...&[params]
 *
 * Genera una imagen OG dinámica (1200x630) según el template solicitado.
 *
 * Templates disponibles:
 *   - post:    para blog posts (title, description, date, readingTime, tags, coverUrl)
 *   - project: para projects (title, description, stack, status, coverUrl)
 *   - default: genérico (title, description, label, coverUrl)
 *
 * Si no se pasa template o es desconocido, usa "default".
 *
 * Ejemplos:
 *   /api/og?template=post&title=Hola&date=Mayo+11&readingTime=5+min
 *   /api/og?template=project&title=FIJI&status=live&stack=Next.js,TypeScript
 *   /api/og?title=Iván+Dujaut&description=Product+Engineer
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const providedSig = searchParams.get("sig");
    searchParams.delete("sig");
    const queryWithoutSig = searchParams.toString();
    if (!verifyOgQuery(queryWithoutSig, providedSig)) {
      return new Response("Forbidden", { status: 403 });
    }

    const ipHash = hashIp(getIpFromRequest(request));
    const rl = await check(ogRatelimit, ipHash);
    if (!rl.allowed) {
      return new Response("Too Many Requests", {
        status: 429,
        headers: { "Retry-After": String(Math.max(1, Math.ceil((rl.reset - Date.now()) / 1000))) },
      });
    }

    const template = searchParams.get("template") ?? "default";

    // Cargar fuentes (FigTree + Geist Mono)
    const fonts = await loadFonts(new URL(request.url).origin);

    // Renderizar el template correspondiente
    const element = renderTemplate(template, searchParams);

    return new ImageResponse(element, {
      width: 1200,
      height: 630,
      fonts,
    });
  } catch (error) {
    console.error("OG image generation failed:", error);
    return new Response("Failed to generate image", { status: 500 });
  }
}

/**
 * Selecciona y renderiza el template correcto según el param `template`.
 *
 * Cada template recibe sus propios parámetros desde searchParams.
 * Si template es desconocido, cae al default.
 */
function renderTemplate(template: string, params: URLSearchParams) {
  switch (template) {
    case "post":
      return (
        <PostTemplate
          title={params.get("title") ?? "Untitled"}
          description={params.get("description") ?? undefined}
          date={params.get("date") ?? undefined}
          readingTime={params.get("readingTime") ?? undefined}
          tags={parseList(params.get("tags"))}
          coverUrl={params.get("coverUrl") ?? undefined}
          locale={parseLocale(params.get("locale"))}
          theme={parseTheme(params.get("theme"))}
        />
      );

    case "project":
      return (
        <ProjectTemplate
          title={params.get("title") ?? "Untitled"}
          description={params.get("description") ?? undefined}
          stack={parseList(params.get("stack"))}
          status={parseStatus(params.get("status"))}
          kind={parseKind(params.get("kind"))}
          coverUrl={params.get("coverUrl") ?? undefined}
          locale={parseLocale(params.get("locale"))}
          theme={parseTheme(params.get("theme"))}
        />
      );

    case "default":
    default:
      return (
        <DefaultTemplate
          title={params.get("title") ?? "Iván Dujaut"}
          description={params.get("description") ?? undefined}
          locale={parseLocale(params.get("locale"))}
          theme={parseTheme(params.get("theme"))}
        />
      );
  }
}

/**
 * Parsea un valor coma-separado en array.
 *
 * "react,nextjs,typescript" → ["react", "nextjs", "typescript"]
 * null → []
 */
function parseList(value: string | null): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Valida y parsea el status del project.
 *
 * Solo acepta los valores definidos en ProjectTemplate.
 * Cualquier otro valor retorna undefined.
 */
function parseStatus(
  value: string | null,
): "shipped" | "in-progress" | "archived" | "concept" | undefined {
  if (
    value === "shipped" ||
    value === "in-progress" ||
    value === "archived" ||
    value === "concept"
  ) {
    return value;
  }
  return undefined;
}

function parseKind(value: string | null): "build" | "case-study" | "design" | undefined {
  if (value === "build" || value === "case-study" || value === "design") {
    return value;
  }
  return undefined;
}

/**
 * Valida y parsea el locale.
 *
 * Solo acepta "es" o "en". Default es "es".
 */
function parseLocale(value: string | null): "es" | "en" {
  return value === "en" ? "en" : "es";
}

/**
 * Valida y parsea el theme.
 *
 * Solo acepta "light" o "dark". Default es "light".
 */
function parseTheme(value: string | null): "light" | "dark" {
  return value === "dark" ? "dark" : "light";
}
