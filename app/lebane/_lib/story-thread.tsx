"use client";

import { gsap, ScrollTrigger } from "./gsap";
import { useGsapSection } from "./use-gsap-section";

type Pt = { x: number; y: number };

/**
 * Hitos de obra, de trazo continuo, en una caja de 100x100. Cada uno arranca
 * en `start` (por donde llega la línea) y termina en `end` (por donde se va),
 * para que el hilo entre, lo dibuje y siga de largo, como los edificios del
 * diseño de Carmen Ansio. Todos son cosas de una construcción: la misma
 * familia que el skyline de la portada.
 */
const LANDMARKS: Record<string, { paths: string[]; start: Pt; end: Pt }> = {
  // Cuatro saltos: una escalera de obra con cuatro peldaños.
  timeline: {
    paths: ["M22 94 V10", "M22 30 H70 M22 50 H70 M22 70 H70 M22 90 H70", "M70 94 V6"],
    start: { x: 22, y: 94 },
    end: { x: 70, y: 6 },
  },
  // El producto, módulo sobre módulo: una pared de ladrillos.
  "product-map": {
    paths: [
      "M8 92 H92 V72 H8 Z",
      "M8 72 V52 H92 V72 M50 52 V72",
      "M18 52 V32 H82 V52 M30 72 V92 M70 72 V92",
      "M30 32 V52 M70 32 V52 M50 12 H50 M40 32 V14 H60 V32",
    ],
    start: { x: 8, y: 92 },
    end: { x: 60, y: 32 },
  },
  // La tesis: un edificio en obra, con andamio y la puerta en planta baja.
  thesis: {
    paths: [
      "M14 92 V24 H86 V92",
      "M14 46 H86 M14 68 H86",
      "M26 24 V12 H74 V24",
      "M42 92 V76 H58 V92 H92",
    ],
    start: { x: 14, y: 92 },
    end: { x: 92, y: 92 },
  },
  // Por qué Lebane puede: el plano de la obra, desenrollado.
  "why-lebane-can": {
    paths: [
      "M12 22 H80 V84 H12 Z",
      "M80 22 a8 8 0 0 1 8 8 V78 a8 8 0 0 1 -8 8",
      "M24 40 H68 M24 54 H68 M24 68 H50 M46 40 V68",
    ],
    start: { x: 12, y: 22 },
    end: { x: 46, y: 68 },
  },
  // El caso: un nivel de burbuja; medir antes de prestar.
  case: {
    paths: [
      "M6 62 H94 V78 H6 Z",
      "M38 62 V42 H62 V62",
      "M44 52 a6 5 0 1 0 12 0 a6 5 0 1 0 -12 0",
      "M6 70 H94",
    ],
    start: { x: 6, y: 62 },
    end: { x: 94, y: 70 },
  },
  // Por qué yo: el casco.
  "why-me": {
    paths: [
      "M12 66 H88",
      "M18 66 C18 30 40 20 50 20 C60 20 82 30 82 66",
      "M50 20 V40 M40 26 V44 M60 26 V44",
      "M8 66 a6 6 0 0 0 6 6 H86 a6 6 0 0 0 6 -6",
    ],
    start: { x: 12, y: 66 },
    end: { x: 92, y: 66 },
  },
  // El cierre: la puerta, abierta.
  close: {
    paths: [
      "M16 92 V12 H84 V92",
      "M28 92 V22 L68 12 V82 Z",
      "M58 48 a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0",
    ],
    start: { x: 16, y: 92 },
    end: { x: 64, y: 48 },
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

      // Arranque: la línea recorre la grúa del skyline de la portada (mástil,
      // torreta, tirante, pluma, carro y cable hasta el gancho) y se descuelga
      // del gancho hacia el margen. El skyline es un viewBox de 360x170 que
      // ocupa todo el ancho de su caja.
      const sk = skyline.getBoundingClientRect();
      const kk = sk.width / 360;
      const skTop = sk.top + window.scrollY - mainTop + (sk.height - 170 * kk) / 2;
      const sp = (x: number, y: number): Pt => ({ x: sk.left + x * kk, y: skTop + y * kk });
      const route = [
        sp(295, 150), // base del mástil
        sp(295, 36), // cabina
        sp(295, 18), // torreta
        sp(350, 44), // punta de la pluma, por el tirante
        sp(335, 49), // carro
        sp(335, 116), // cable hasta el gancho
      ];
      const hook = sp(327, 116);
      const heroBottom = toDoc(sections[0]!).bottom;
      add(
        stroke(
          `M${route[0].x} ${route[0].y} ` +
            route
              .slice(1)
              .map((p) => `L${p.x} ${p.y}`)
              .join(" ") +
            ` a${4 * kk} ${4 * kk} 0 0 1 ${-8 * kk} 0`,
        ),
        0,
        heroBottom * 0.35,
      );
      // Del gancho cae a plomo, como un cable: recto hasta el espacio entre
      // la portada y la primera sección. La curva empieza recién ahí.
      let cursor: Pt = { x: hook.x, y: hook.y + 40 };
      add(stroke(`M${hook.x} ${hook.y} V${cursor.y}`), heroBottom * 0.35, heroBottom * 0.5);

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
        const side = entry.x < cursor.x ? 1 : -1;
        const r = isMobile ? 9 : 16;
        const [s0, s1] = take(0.42);
        add(
          stroke(
            `M${cursor.x} ${gapTop} C${cursor.x} ${gapTop + zone * 0.5} ${knot.x + side * size * 1.6} ${knot.y - size * 0.6} ${knot.x} ${knot.y} ` +
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
          // El hueco del patrón es más largo que el trazo: así, antes de
          // dibujarse, ningún tramo asoma ni en el arranque (remate redondo
          // de un dash de largo cero) ni en el final (vuelta del patrón).
          gsap.set(el, { strokeDasharray: `${len} ${len + 8}`, strokeDashoffset: len });
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
