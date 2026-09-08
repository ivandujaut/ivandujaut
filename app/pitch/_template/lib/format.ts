/** "148000000" → "148.000.000". A mano para que servidor y cliente coincidan. */
export function formatArs(n: number): string {
  const digits = Math.round(n).toString();
  return `$ ${digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
}

export function formatPct(fraction: number): string {
  return `${Math.round(fraction * 100)}%`;
}
