import { Redis } from "@upstash/redis";

/**
 * Cliente de Upstash Redis para likes y views.
 *
 * Las credenciales se leen automáticamente de las variables de entorno:
 *   - UPSTASH_REDIS_REST_URL
 *   - UPSTASH_REDIS_REST_TOKEN
 *
 * Si faltan, Redis.fromEnv() throwea, así que validamos antes.
 */
function createRedisClient(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    console.warn("Upstash Redis credentials not configured. Likes/views disabled.");
    return null;
  }

  if (!process.env.REDIS_ENV_TAG) {
    throw new Error(
      "REDIS_ENV_TAG is required when Upstash Redis is configured. Set it to 'prod' in Production and 'nonprod' in Preview/Development.",
    );
  }

  console.info(
    `Redis configured for env=${process.env.VERCEL_ENV ?? "local"} tag=${process.env.REDIS_ENV_TAG}`,
  );

  return new Redis({ url, token });
}

export const redis = createRedisClient();

export function keyFor(...parts: [string, ...string[]]): string {
  const tag = process.env.REDIS_ENV_TAG;
  if (!tag) {
    throw new Error("REDIS_ENV_TAG is unset; keyFor cannot build a prefixed key");
  }
  return [tag, ...parts].join(":");
}
