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

  return new Redis({ url, token });
}

export const redis = createRedisClient();
