import { createHmac, timingSafeEqual } from "crypto";

const SIGNATURE_LENGTH = 24;

// Fallback solo para desarrollo: evita que la falta de OG_SECRET tire abajo
// las páginas de detalle (generateMetadata firma la URL de la imagen OG).
// En producción sigue siendo obligatoria.
const DEV_FALLBACK_SECRET = "og-dev-secret-not-for-production";
let warnedMissingSecret = false;

function getSecret(): string {
  const secret = process.env.OG_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV !== "production") {
    if (!warnedMissingSecret) {
      warnedMissingSecret = true;
      console.warn(
        "OG_SECRET no está definido; usando un secreto de desarrollo. " +
          "Copiá .env.example a .env.local y definilo (ver README de variables).",
      );
    }
    return DEV_FALLBACK_SECRET;
  }
  throw new Error("OG_SECRET environment variable is required");
}

export function signOgQuery(query: string): string {
  return createHmac("sha256", getSecret()).update(query).digest("hex").slice(0, SIGNATURE_LENGTH);
}

export function verifyOgQuery(query: string, signature: string | null): boolean {
  if (!signature || signature.length !== SIGNATURE_LENGTH) return false;
  const expected = signOgQuery(query);
  try {
    return timingSafeEqual(Buffer.from(signature, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}

export function appendSignature(searchParams: URLSearchParams): URLSearchParams {
  const query = searchParams.toString();
  searchParams.set("sig", signOgQuery(query));
  return searchParams;
}
