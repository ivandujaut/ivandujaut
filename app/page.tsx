export default function Home() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24">
      <h1 className="text-4xl font-semibold tracking-tight">Iván Dujaut</h1>
      <p className="mt-3 text-muted-foreground">
        Desarrollador full-stack. Aprendiendo, construyendo y documentando.
      </p>

      <hr className="my-12" />

      <section className="space-y-2">
        <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
          Verificación de tokens
        </h2>
        <p className="text-base">Texto base con la fuente sans.</p>
        <p className="font-mono text-sm">Texto monospace para code.</p>
        <p className="text-muted-foreground">Texto muted (más sutil, para metadata).</p>
        <div className="flex gap-2 pt-4">
          <div className="rounded-md border bg-card px-3 py-2 text-sm">Card con border</div>
          <div className="rounded-md bg-accent px-3 py-2 text-sm text-accent-foreground">
            Accent
          </div>
        </div>
      </section>
    </main>
  );
}
