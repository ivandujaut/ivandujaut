"use client";

import { gsap, ScrollTrigger } from "./gsap";
import { useGsapSection } from "./use-gsap-section";

type Pt = { x: number; y: number };

/**
 * Hitos de trazo continuo, en una caja de 100x100. Cada uno arranca en
 * `start` (por donde llega la línea) y termina en `end` (por donde se va),
 * para que el hilo entre, lo dibuje y siga de largo, como los edificios del
 * diseño de Carmen Ansio.
 */
const LANDMARKS: Record<string, { paths: string[]; start: Pt; end: Pt }> = {
  // Cuatro saltos: una escalera que sube.
  timeline: {
    paths: ["M8 92 H30 V72 H50 V52 H70 V32 H92 V12"],
    start: { x: 8, y: 92 },
    end: { x: 92, y: 12 },
  },
  // El producto: un círculo que se cierra sobre sí mismo.
  "product-map": {
    paths: ["M50 10 A40 40 0 1 1 12 58", "M12 58 l-8 -12 M12 58 l13 -5"],
    start: { x: 50, y: 10 },
    end: { x: 25, y: 53 },
  },
  // La tesis: tres pisos y una puerta en planta baja.
  thesis: {
    paths: ["M12 92 V18 H88 V92", "M12 42 H88 M12 67 H88", "M42 92 V74 H58 V92 H92"],
    start: { x: 12, y: 92 },
    end: { x: 92, y: 92 },
  },
  // Por qué Lebane puede: el libro mayor abierto.
  "why-lebane-can": {
    paths: [
      "M10 26 Q50 14 90 26 V82 Q50 70 10 82 Z",
      "M50 20 V76",
      "M22 42 H42 M58 42 H78 M22 56 H42 M58 56 H78",
    ],
    start: { x: 10, y: 26 },
    end: { x: 78, y: 56 },
  },
  // El caso: el medidor del score, con la aguja.
  case: {
    paths: [
      "M16 72 A38 38 0 1 1 84 72",
      "M50 72 L70 40",
      "M44 72 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0",
    ],
    start: { x: 16, y: 72 },
    end: { x: 56, y: 72 },
  },
  // Por qué yo: tres tarjetas apiladas.
  "why-me": {
    paths: ["M14 36 H58 V88 H14 Z", "M26 24 H70 V76", "M38 12 H84 V64"],
    start: { x: 14, y: 36 },
    end: { x: 84, y: 64 },
  },
  // El cierre: un sobre.
  close: {
    paths: ["M12 30 H88 V76 H12 Z", "M12 30 L50 58 L88 30"],
    start: { x: 12, y: 30 },
    end: { x: 88, y: 30 },
  },
};

const SECTION_IDS = ["hero", ...Object.keys(LANDMARKS)];

/**
 * El hilo conductor, con el lenguaje del scrollytelling de Carmen Ansio: una
 * sola línea continua que atraviesa toda la historia y se dibuja con el
 * scroll. Nace en la grúa de la portada; en cada espacio entre secciones se
 * abre con lazos y un nudo, y dibuja de un trazo el hito de la sección que
 * viene (escalera, círculo, edificio, libro, medidor, tarjetas, sobre); dentro
 * de cada sección corre quieta por el margen derecho para no pisar el texto.
 *
 * Todo se mide en coordenadas del documento con los pines ya aplicados, por
 * eso se reconstruye en cada `refresh` de ScrollTrigger (fuentes, resize).
 * Es decoración: con `prefers-reduced-motion` no se dibuja nada.
 */
export function StoryThread() {
  const ref = useGsapSection<HTMLDivElement>(({ root, isMobile }) => {
    const main = root.parentElement;
    const svg = root.querySelector<SVGSVGElement>("svg");
    if (!main || !svg) return;

    let local: gsap.Context | null = null;
    const ns = "http://www.w3.org/2000/svg";

    const box = (el: Element) =>
      el.parentElement?.classList.contains("pin-spacer") ? el.parentElement : el;

    const build = () => {
      local?.revert();
      svg.innerHTML = "";
      const mainTop = main.getBoundingClientRect().top + window.scrollY;
      const toDoc = (el: Element) => {
        const r = box(el).getBoundingClientRect();
        return {
          top: r.top + window.scrollY - mainTop,
          bottom: r.bottom + window.scrollY - mainTop,
        };
      };
      const sections = SECTION_IDS.map((id) => document.getElementById(id));
      const skyline = document.querySelector<SVGElement>(".skyline");
      if (sections.some((s) => !s) || !skyline) return;

      const vw = window.innerWidth;
      const width = main.offsetWidth;
      const height = main.offsetHeight;
      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      svg.style.height = `${height}px`;

      const contentW = Math.min(vw - 48, 1024);
      const contentLeft = (vw - contentW) / 2;
      // Margen por donde la línea baja en silencio dentro de cada sección.
      const marginX = isMobile ? vw - 12 : vw >= 1200 ? vw - 64 : vw - 10;
      const size = isMobile ? 72 : 190; // caja del hito
      const strokeWidth = isMobile ? 1.25 : 1.75;

      const mk = <K extends keyof SVGElementTagNameMap>(
        tag: K,
        attrs: Record<string, string | number>,
        parent: SVGElement = svg,
      ) => {
        const el = document.createElementNS(ns, tag);
        Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, String(v)));
        parent.appendChild(el);
        return el;
      };
      // Sin `vector-effect: non-scaling-stroke`: con él, el navegador mide el
      // dasharray en píxeles de pantalla y no en las unidades del trazo, y
      // un hito escalado se dibuja a saltos. El grosor se compensa a mano.
      const stroke = (d: string, parent: SVGElement = svg, scale = 1) =>
        mk(
          "path",
          {
            d,
            fill: "none",
            stroke: "var(--lebane-accent)",
            "stroke-width": strokeWidth / scale,
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
          },
          parent,
        );

      type Segment = { el: SVGPathElement; y0: number; y1: number; glow?: SVGElement };
      const segments: Segment[] = [];
      const add = (el: SVGPathElement, y0: number, y1: number, glow?: SVGElement) =>
        segments.push({ el, y0, y1: Math.max(y1, y0 + 40), glow });

      // Arranque: el extremo derecho del suelo de la grúa, en la portada.
      const sk = skyline.getBoundingClientRect();
      const start: Pt = {
        x: sk.right - sk.width * 0.02,
        y: sk.top + window.scrollY - mainTop + sk.height * 0.882,
      };
      let cursor: Pt = { x: marginX, y: start.y + 200 };
      add(
        stroke(
          `M${start.x} ${start.y} C${start.x + 90} ${start.y} ${marginX} ${start.y + 60} ${cursor.x} ${cursor.y}`,
        ),
        start.y,
        cursor.y,
      );

      sections.slice(1).forEach((section, idx) => {
        const i = idx + 1;
        const id = SECTION_IDS[i];
        const mark = LANDMARKS[id];
        const prev = toDoc(sections[i - 1]!);
        const cur = toDoc(section!);
        const gapTop = prev.bottom - (isMobile ? 40 : 90);
        const gapBottom = cur.top + (isMobile ? 40 : 90);
        const center: Pt = {
          x: isMobile ? vw / 2 : contentLeft + contentW * (i % 2 ? 0.3 : 0.7),
          y: (gapTop + gapBottom) / 2,
        };
        const k = size / 100;
        const at = (p: Pt): Pt => ({
          x: center.x + (p.x - 50) * k,
          y: center.y + (p.y - 50) * k,
        });

        // El scroll del espacio entre secciones se reparte en orden: primero
        // el lazo de entrada, después el hito trazo a trazo, al final la
        // salida. Si se repartiera por geometría, la salida se dibujaría a la
        // vez que el hito.
        const zoneStart = gapTop - 40;
        const zoneEnd = gapBottom + 40;
        const zone = zoneEnd - zoneStart;
        let t = zoneStart;
        const take = (share: number) => {
          const y0 = t;
          t += zone * share;
          return [y0, t] as const;
        };

        // Bajada quieta por el margen hasta el espacio entre secciones.
        add(stroke(`M${cursor.x} ${cursor.y} V${gapTop}`), cursor.y, zoneStart);

        // Lazo de entrada: cruza el ancho con una curva amplia, hace un nudo
        // y entra al hito.
        const entry = at(mark.start);
        const knot: Pt = { x: entry.x - size * 0.35, y: entry.y - size * 0.45 };
        const side = entry.x < marginX ? 1 : -1;
        const r = isMobile ? 9 : 16;
        const [s0, s1] = take(0.42);
        add(
          stroke(
            `M${marginX} ${gapTop} C${marginX} ${gapTop + zone * 0.5} ${knot.x + side * size * 1.6} ${knot.y - size * 0.6} ${knot.x} ${knot.y} ` +
              `a${r} ${r} 0 1 1 ${r * 0.2} ${r * 1.9} a${r} ${r} 0 1 1 ${-r * 0.2} ${-r * 1.9} ` +
              `Q${knot.x + (entry.x - knot.x) * 0.2} ${entry.y} ${entry.x} ${entry.y}`,
          ),
          s0,
          s1,
        );

        // El hito, trazo a trazo, en su caja.
        const glow = mk("circle", {
          cx: center.x,
          cy: center.y,
          r: size * 0.62,
          fill: "var(--lebane-accent)",
          opacity: 0,
        });
        const group = mk("g", {
          transform: `translate(${center.x - size / 2} ${center.y - size / 2}) scale(${k})`,
        });
        mark.paths.forEach((d, j) => {
          const [y0, y1] = take(0.44 / mark.paths.length);
          const last = j === mark.paths.length - 1;
          // El último trazo del hito enciende el halo de atrás.
          add(stroke(d, group, k), y0, y1, last ? glow : undefined);
        });

        // Salida: baja un poco desde el hito y recién ahí busca el margen.
        const exit = at(mark.end);
        const isLast = i === sections.length - 1;
        if (!isLast) {
          const [e0, e1] = take(0.14);
          cursor = { x: marginX, y: gapBottom + (isMobile ? 60 : 140) };
          const drop: Pt = { x: exit.x + size * 0.25, y: exit.y + size * 0.7 };
          add(
            stroke(
              `M${exit.x} ${exit.y} Q${exit.x + size * 0.35} ${exit.y + size * 0.15} ${drop.x} ${drop.y} ` +
                `C${drop.x} ${drop.y + size} ${marginX} ${cursor.y - size * 1.2} ${cursor.x} ${cursor.y}`,
            ),
            e0,
            e1,
          );
        }
      });

      const half = window.innerHeight * 0.5;
      local = gsap.context(() => {
        segments.forEach(({ el, y0, y1, glow }) => {
          const len = el.getTotalLength();
          // Un desplazamiento apenas mayor que el largo: con remates redondos,
          // un tramo de largo cero igual pinta un punto en el arranque.
          gsap.set(el, { strokeDasharray: len, strokeDashoffset: len + 2 });
          ScrollTrigger.create({
            start: y0 - half,
            end: y1 - half,
            scrub: 0.35,
            animation: gsap.to(el, { strokeDashoffset: 0, ease: "none" }),
            onLeave: glow
              ? () => gsap.to(glow, { opacity: isMobile ? 0.05 : 0.08, duration: 0.5 })
              : undefined,
            onEnterBack: glow ? () => gsap.to(glow, { opacity: 0, duration: 0.3 }) : undefined,
          });
        });
      }, root);
    };

    build();
    ScrollTrigger.addEventListener("refresh", build);
    return () => {
      ScrollTrigger.removeEventListener("refresh", build);
      local?.revert();
      svg.innerHTML = "";
    };
  });

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
      <svg className="block w-full" preserveAspectRatio="none" />
    </div>
  );
}
