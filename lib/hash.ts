import { createHash } from "crypto";

// Fallback solo para desarrollo: sin IP_HASH_SALT, las rutas que hashean IP
// (imágenes OG, likes, vistas) devolvían 500 en cualquier clon nuevo.
// En producción sigue siendo obligatoria: el salt es lo que evita revertir
// el hash de una IP por fuerza bruta.
const DEV_FALLBACK_SALT = "ip-hash-dev-salt-not-for-production";
let warnedMissingSalt = false;

function getSalt(): string {
  const salt = process.env.IP_HASH_SALT;
  if (salt) return salt;
  if (process.env.NODE_ENV !== "production") {
    if (!warnedMissingSalt) {
      warnedMissingSalt = true;
      console.warn(
        "IP_HASH_SALT no está definido; usando un salt de desarrollo. " +
          "Copiá .env.example a .env.local y definilo.",
      );
    }
    return DEV_FALLBACK_SALT;
  }
  throw new Error("IP_HASH_SALT environment variable is required");
}

export function hashIp(ip: string): string {
  return createHash("sha256")
    .update(ip + getSalt())
    .digest("hex");
}

export function getIpFromRequest(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;

  return "unknown";
}
