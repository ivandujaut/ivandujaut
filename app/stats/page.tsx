import { notFound } from "next/navigation";
import { getPosts, getProjects } from "@/lib/content";
import { getCachedViews } from "@/lib/views";
import { getCachedContinued, getCachedReads } from "@/lib/reads";
import type { ViewKind } from "@/lib/views";

/**
 * Tablero privado de lectura. No está en el nav, no está en el sitemap y sale
 * con `noindex`.
 *
 * El portón es un secreto compartido en la query (`?key=`), comparado contra
 * `STATS_KEY`. Es proporcionado a lo que protege: números agregados de un sitio
 * personal, de solo lectura. No es autenticación y no pretende serlo; si algún
 * día hay algo sensible acá, esto no alcanza.
 */
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Stats",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ key?: string }> };

interface Row {
  kind: ViewKind;
  slug: string;
  title: string;
  minutes?: number;
  views: number;
  reads: number;
  continued: number;
}

export default async function StatsPage({ searchParams }: Props) {
  const expected = process.env.STATS_KEY;
  const { key } = await searchParams;
  // Sin `STATS_KEY` configurada la página no existe: preferible a quedar
  // abierta por un despliegue al que se le olvidó la variable.
  if (!expected || key !== expected) notFound();

  const pieces = [
    ...getProjects("es").map((p) => ({ kind: "projects" as const, item: p })),
    ...getPosts("es").map((p) => ({ kind: "blog" as const, item: p })),
  ];

  const rows: Row[] = await Promise.all(
    pieces.map(async ({ kind, item }) => ({
      kind,
      slug: item.slug,
      title: item.title,
      minutes: item.metadata?.readingTime,
      views: await getCachedViews(kind, item.slug),
      reads: await getCachedReads(kind, item.slug),
      continued: await getCachedContinued(kind, item.slug),
    })),
  );

  rows.sort((a, b) => b.views - a.views);

  const totalViews = rows.reduce((acc, r) => acc + r.views, 0);
  const totalReads = rows.reduce((acc, r) => acc + r.reads, 0);
  const totalContinued = rows.reduce((acc, r) => acc + r.continued, 0);

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Lectura</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Una vista cuenta a quien abrió. Una lectura cuenta a quien recorrió el 75% y se quedó al
        menos un cuarto del tiempo declarado, con la pestaña a la vista. El read-through es lo único
        que dice si el texto funcionó.
      </p>

      <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          ["Vistas", totalViews.toLocaleString("es-AR")],
          ["Lecturas", totalReads.toLocaleString("es-AR")],
          ["Read-through", totalViews ? `${Math.round((totalReads / totalViews) * 100)}%` : "—"],
          ["Siguieron", String(totalContinued)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border border-border p-4">
            <dt className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              {label}
            </dt>
            <dd className="mt-1 text-2xl font-semibold">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-10 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left font-mono text-xs uppercase tracking-wider text-muted-foreground">
              <th className="py-2 pr-4 font-normal">Pieza</th>
              <th className="py-2 pr-4 text-right font-normal">Min</th>
              <th className="py-2 pr-4 text-right font-normal">Vistas</th>
              <th className="py-2 pr-4 text-right font-normal">Lecturas</th>
              <th className="py-2 pr-4 text-right font-normal">Read-through</th>
              <th className="py-2 text-right font-normal">Siguieron</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={`${r.kind}:${r.slug}`} className="border-b border-border/50">
                <td className="py-2 pr-4">
                  <span className="font-mono text-xs text-muted-foreground">
                    {r.kind === "projects" ? "caso" : "post"}
                  </span>{" "}
                  {r.title}
                </td>
                <td className="py-2 pr-4 text-right font-mono text-xs text-muted-foreground">
                  {r.minutes ?? "—"}
                </td>
                <td className="py-2 pr-4 text-right font-mono">
                  {r.views.toLocaleString("es-AR")}
                </td>
                <td className="py-2 pr-4 text-right font-mono">
                  {r.reads.toLocaleString("es-AR")}
                </td>
                <td className="py-2 pr-4 text-right font-mono">
                  {r.views ? `${Math.round((r.reads / r.views) * 100)}%` : "—"}
                </td>
                <td className="py-2 text-right font-mono">{r.continued || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-8 text-xs text-muted-foreground">
        &quot;Siguieron&quot; cuenta lectores que después de terminar esta pieza abrieron otra del
        sitio, y se le acredita a la que enganchó, no a la que se leyó después. Reemplaza al botón
        de me gusta: es conducta y no cortesía. Los contadores viven en Redis y se cachean 60
        segundos. Vercel Analytics, aparte, tiene el origen del tráfico: sirve para cruzar de dónde
        viene la gente que sí llega al final.
      </p>
    </main>
  );
}
