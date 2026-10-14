"use client";

import { useEffect, useState } from "react";
import type { PDFDocumentLoadingTask } from "pdfjs-dist";

/**
 * Vista previa del CV dibujada con pdf.js.
 *
 * No es un `<iframe>` al PDF porque en el teléfono no sirve: Chrome en Android
 * no muestra PDFs embebidos y Safari en iOS no deja recorrerlos. Cada página se
 * dibuja en un canvas y se muestra como imagen, que se ve igual en todos lados.
 * pdf.js pesa cerca de 1 MB con el worker, así que se carga con `import()` y
 * sólo en `/cv`.
 *
 * Los links del PDF (mail, sitio, LinkedIn, GitHub) se reponen como `<a>`
 * encima de la imagen, con la posición en porcentajes de la página para que
 * acompañen el ancho sin volver a dibujar nada.
 */

/** Ancho del dibujo en píxeles: alcanza para el ancho máximo de la página a 2x. */
const RENDER_WIDTH = 1700;

type PdfLink = { href: string; left: number; top: number; width: number; height: number };
type RenderedPage = { src: string; width: number; height: number; links: PdfLink[] };

// Un solo worker para toda la vida de la pestaña. `destroy()` no termina un
// worker que se pasó como `workerPort`, así que volver a `/cv` lo reusa.
let worker: Worker | null = null;

type Props = {
  src: string;
  /** Texto alternativo de la imagen; con más de una página se le suma el número. */
  alt: string;
  loadingLabel: string;
  errorLabel: string;
  openPdfLabel: string;
};

export function CvPreview({ src, alt, loadingLabel, errorLabel, openPdfLabel }: Props) {
  const [pages, setPages] = useState<RenderedPage[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let task: PDFDocumentLoadingTask | null = null;
    const urls: string[] = [];

    (async () => {
      const pdfjs = await import("pdfjs-dist");
      if (cancelled) return;
      worker ??= new Worker(new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url), {
        type: "module",
      });
      pdfjs.GlobalWorkerOptions.workerPort = worker;

      task = pdfjs.getDocument({ url: src });
      const doc = await task.promise;
      const rendered: RenderedPage[] = [];

      for (let n = 1; n <= doc.numPages; n++) {
        const page = await doc.getPage(n);
        const base = page.getViewport({ scale: 1 });
        const viewport = page.getViewport({ scale: RENDER_WIDTH / base.width });

        const canvas = document.createElement("canvas");
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        await page.render({ canvas, viewport }).promise;

        const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve));
        if (!blob) throw new Error("canvas.toBlob devolvió null");
        const url = URL.createObjectURL(blob);
        urls.push(url);

        const annotations: { subtype?: string; url?: string; rect: number[] }[] =
          await page.getAnnotations();
        const links = annotations
          .filter((a) => a.subtype === "Link" && typeof a.url === "string")
          .map((a) => {
            const [x1, y1] = base.convertToViewportPoint(a.rect[0], a.rect[1]);
            const [x2, y2] = base.convertToViewportPoint(a.rect[2], a.rect[3]);
            return {
              href: a.url as string,
              left: (Math.min(x1, x2) / base.width) * 100,
              top: (Math.min(y1, y2) / base.height) * 100,
              width: (Math.abs(x2 - x1) / base.width) * 100,
              height: (Math.abs(y2 - y1) / base.height) * 100,
            };
          });

        rendered.push({ src: url, width: canvas.width, height: canvas.height, links });
      }

      if (!cancelled) setPages(rendered);
    })().catch(() => {
      if (!cancelled) setFailed(true);
    });

    return () => {
      cancelled = true;
      void task?.destroy();
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [src]);

  if (failed) {
    return (
      <div className="flex aspect-[210/297] flex-col items-center justify-center gap-3 rounded-md border border-border p-6 text-center">
        <p className="text-sm text-muted-foreground">{errorLabel}</p>
        <a href={src} className="text-sm underline underline-offset-4 hover:text-foreground">
          {openPdfLabel}
        </a>
      </div>
    );
  }

  if (!pages) {
    // Mismo alto que la hoja A4 que viene, para que no salte el layout al cargar.
    return (
      <div
        role="status"
        className="flex aspect-[210/297] items-center justify-center rounded-md border border-border bg-muted/40"
      >
        <p className="animate-pulse font-mono text-sm text-muted-foreground">{loadingLabel}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {pages.map((page, i) => (
        <div
          key={page.src}
          className="relative overflow-hidden rounded-sm border border-border bg-white shadow-sm"
        >
          {/* Blob local recién dibujado: `next/image` no tiene nada que optimizar acá. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={page.src}
            width={page.width}
            height={page.height}
            alt={pages.length > 1 ? `${alt} (${i + 1}/${pages.length})` : alt}
            className="block h-auto w-full"
          />
          {page.links.map((link, j) => {
            const external = /^https?:/.test(link.href);
            return (
              <a
                key={j}
                href={link.href}
                title={link.href.replace(/^mailto:/, "")}
                aria-label={link.href.replace(/^(mailto:|https?:\/\/)/, "")}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="absolute rounded-sm transition-colors hover:bg-sky-500/10 focus-visible:outline-2 focus-visible:outline-sky-500"
                style={{
                  left: `${link.left}%`,
                  top: `${link.top}%`,
                  width: `${link.width}%`,
                  height: `${link.height}%`,
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
