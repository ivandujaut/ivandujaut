"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { JourneySequence } from "../despegar.data";

/**
 * La secuencia de cuadros del viaje: un solo `<canvas>` encima de las cuatro
 * imágenes fijas que muestra el cuadro que corresponde según el scroll, como
 * un video que avanza y retrocede con la rueda.
 *
 * La posición sale de las paradas, no del alto total: entre el centro de la
 * parada k y el de la k+1 se recorre el tramo k de la secuencia. Así el cuadro
 * que se ve en cada parada coincide con su imagen fija en escritorio y en el
 * celular, aunque el escenario y las paradas midan distinto.
 *
 * No hace nada (y quedan las imágenes fijas con su fundido en CSS) si no hay
 * secuencia, si el usuario pidió menos movimiento o si el escenario no se
 * muestra (navegadores sin scroll-driven animations). Los cuadros se bajan
 * recién cuando la sección está cerca, y el canvas aparece cuando están todos.
 */
export function FlightSequence({ sequence }: { sequence: JourneySequence | null }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = ref.current;
    if (!sequence || !canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const stage = canvas.closest<HTMLElement>(".journey-stage");
    const root = canvas.closest<HTMLElement>(".journey");
    if (!stage || !root || getComputedStyle(stage).display === "none") return;

    const stops = Array.from(root.querySelectorAll<HTMLElement>(".journey-stop"));
    const ctx = canvas.getContext("2d");
    if (stops.length < 2 || !ctx) return;

    const frames: HTMLImageElement[] = [];
    let loaded = 0;
    let current = -1;
    let raf = 0;
    let disposed = false;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const box = canvas.getBoundingClientRect();
      canvas.width = Math.round(box.width * dpr);
      canvas.height = Math.round(box.height * dpr);
      current = -1;
    };

    const draw = (i: number) => {
      const img = frames[i];
      if (!img || !img.naturalWidth) return;
      const { width: cw, height: ch } = canvas;
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
      current = i;
    };

    /** Posición continua entre paradas: 0 en la primera, n-1 en la última. */
    const position = () => {
      const mid = window.innerHeight / 2;
      const offsets = stops.map((s) => {
        const r = s.getBoundingClientRect();
        return r.top + r.height / 2 - mid;
      });
      if (offsets[0] >= 0) return 0;
      for (let k = 0; k < offsets.length - 1; k++) {
        if (offsets[k] <= 0 && offsets[k + 1] >= 0) {
          return k + -offsets[k] / (offsets[k + 1] - offsets[k]);
        }
      }
      return offsets.length - 1;
    };

    const update = () => {
      raf = 0;
      const i = Math.round((position() / (stops.length - 1)) * (sequence.count - 1));
      if (i !== current) draw(i);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    const onResize = () => {
      resize();
      update();
    };

    const load = () => {
      for (let n = 1; n <= sequence.count; n++) {
        const img = new Image();
        img.decoding = "async";
        img.onload = () => {
          loaded += 1;
          if (loaded === sequence.count && !disposed) {
            resize();
            update();
            setReady(true);
          }
        };
        img.src = sequence.pattern.replace("{n}", String(n).padStart(3, "0"));
        frames.push(img);
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          load();
        }
      },
      { rootMargin: "1200px 0px" },
    );
    io.observe(root);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      disposed = true;
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, [sequence]);

  if (!sequence) return null;
  return <canvas ref={ref} aria-hidden className={cn("journey-sequence", ready && "is-ready")} />;
}
