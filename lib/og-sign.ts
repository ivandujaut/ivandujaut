import { createHmac, timingSafeEqual } from "crypto";

const SIGNATURE_LENGTH = 24;

function getSecret(): string {
  const secret = process.env.OG_SECRET;
  if (!secret) {
    throw new Error("OG_SECRET environment variable is required");
  }
  return secret;
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
