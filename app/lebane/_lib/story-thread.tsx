"use client";

import { gsap, ScrollTrigger } from "./gsap";
import { useGsapSection } from "./use-gsap-section";

const SECTION_IDS = [
  "timeline",
  "product-map",
  "thesis",
  "why-lebane-can",
  "case",
  "why-me",
  "close",
];

type Anchor = { x: number; y: number };

/**
 * El hilo conductor, tomado del scrollytelling de Carmen Ansio (Garaje de
 * ideas): una sola línea que atraviesa toda la historia, se dibuja con el
 * scroll segmento a segmento, un punto viaja por ella y cada hito se enciende
 * cuando la línea llega. Acá nace en la regla de la portada, baja por el
 * margen izquierdo y toca el título de cada sección.
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

    const docTop = (el: Element) => {
      // Una sección pinneada se mide por su `pin-spacer`, que es quien ocupa
      // el lugar en el documento.
      const box = el.parentElement?.classList.contains("pin-spacer") ? el.parentElement : el;
      return box.getBoundingClientRect().top + window.scrollY;
    };

    const measure = (): Anchor[] => {
      const mainTop = main.getBoundingClientRect().top + window.scrollY;
      const contentLeft = Math.max((window.innerWidth - 1024) / 2, 0) + 24;
      const gutter = isMobile ? 10 : Math.max(12, contentLeft - 44);
      const wobble = isMobile ? 6 : 18;
      const anchors: Anchor[] = [];
      const rule = document.querySelector(".rule");
      if (rule) anchors.push({ x: gutter, y: docTop(rule) - mainTop + 1 });
      SECTION_IDS.forEach((id, i) => {
        const section = document.getElementById(id);
        if (!section) return;
        const pinned = section.parentElement?.classList.contains("pin-spacer");
        const offset = pinned ? window.innerHeight * 0.12 : isMobile ? 96 : 128;
        anchors.push({ x: gutter + (i % 2 ? wobble : 0), y: docTop(section) - mainTop + offset });
      });
      return anchors;
    };

    const build = () => {
      local?.revert();
      svg.innerHTML = "";
      const anchors = measure();
      if (anchors.length < 2) return;
      const width = main.offsetWidth;
      const height = main.offsetHeight;
      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      svg.style.height = `${height}px`;

      const ns = "http://www.w3.org/2000/svg";
      const mk = <K extends keyof SVGElementTagNameMap>(
        tag: K,
        attrs: Record<string, string | number>,
      ) => {
        const el = document.createElementNS(ns, tag);
        Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, String(v)));
        svg.appendChild(el);
        return el;
      };

      // Base tenue del recorrido completo, para anticipar por dónde sigue.
      const full = anchors
        .map((a, i) => {
          if (i === 0) return `M${a.x} ${a.y}`;
          const p = anchors[i - 1];
          const my = (p.y + a.y) / 2;
          return `C${p.x} ${my} ${a.x} ${my} ${a.x} ${a.y}`;
        })
        .join(" ");
      mk("path", { d: full, fill: "none", stroke: "var(--lebane-line)", "stroke-width": 1 });

      const segments = anchors.slice(1).map((a, i) => {
        const p = anchors[i];
        const my = (p.y + a.y) / 2;
        return mk("path", {
          d: `M${p.x} ${p.y} C${p.x} ${my} ${a.x} ${my} ${a.x} ${a.y}`,
          fill: "none",
          stroke: "var(--lebane-accent)",
          "stroke-width": 1.5,
          "stroke-linecap": "round",
        });
      });
      const marks = anchors.map((a) =>
        mk("circle", {
          cx: a.x,
          cy: a.y,
          r: isMobile ? 3.5 : 5,
          fill: "var(--background)",
          stroke: "var(--lebane-accent)",
          "stroke-width": 1.5,
        }),
      );
      const glow = mk("circle", {
        cx: anchors[0].x,
        cy: anchors[0].y,
        r: isMobile ? 9 : 14,
        fill: "var(--lebane-accent)",
        opacity: 0.18,
      });
      const dot = mk("circle", {
        cx: anchors[0].x,
        cy: anchors[0].y,
        r: isMobile ? 3 : 4,
        fill: "var(--lebane-accent)",
      });
      const half = window.innerHeight * 0.5;

      local = gsap.context(() => {
        gsap.set(marks[0], { attr: { fill: "var(--lebane-accent)" } });
        segments.forEach((path, i) => {
          const len = path.getTotalLength();
          gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
          const place = (progress: number) => {
            const pt = path.getPointAtLength(len * progress);
            gsap.set([dot, glow], { attr: { cx: pt.x, cy: pt.y } });
          };
          ScrollTrigger.create({
            start: anchors[i].y - half,
            end: anchors[i + 1].y - half,
            scrub: 0.4,
            animation: gsap.to(path, { strokeDashoffset: 0, ease: "none" }),
            onUpdate: (self) => place(self.progress),
            onLeave: () =>
              gsap.to(marks[i + 1], { attr: { fill: "var(--lebane-accent)" }, duration: 0.3 }),
            onEnterBack: () =>
              gsap.to(marks[i + 1], { attr: { fill: "var(--background)" }, duration: 0.3 }),
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
