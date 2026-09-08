"use client";

import { gsap, ScrollTrigger } from "./gsap";
import { useGsapSection } from "./use-gsap-section";

import type { ThreadStart } from "../illustrations/types";
import type { LandmarkSet, Pt } from "../landmarks/types";

interface StoryThreadProps {
  /** Ids de las secciones en orden, empezando por la portada. */
  sectionIds: string[];
  /** De dónde nace el cable dentro de la ilustración de la portada. */
  thread: ThreadStart;
  /** Una figura por sección (sin la portada), por id. */
  landmarks: LandmarkSet;
}

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
export function StoryThread({ sectionIds, thread, landmarks }: StoryThreadProps) {
  const ref = useGsapSection<HTMLDivElement>(({ root, isMobile }) => {
    const main = root.parentElement;
    const svg = root.querySelector<SVGSVGElement>("svg");
    if (!main || !svg) return;

    let local: gsap.Context | null = null;
    const CABLE_AT = thread.cableAt;
    const CABLE_DURATION = thread.cableDuration;
    const firstBuildAt = performance.now();
    let cableTween: gsap.core.Tween | null = null;
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
      const sections = sectionIds.map((id) => document.getElementById(id));
      const skyline = document.querySelector<SVGElement>("[data-illustration]");
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
            stroke: "var(--pitch-accent)",
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

      // Arranque: el hilo ES el cable que cuelga de la ilustración. Nace en
      // el punto que declara la ilustración, baja recto y esa misma recta
      // sigue por toda la página. La ilustración ocupa todo el ancho de su caja.
      const [vbW, vbH] = thread.viewBox;
      const sk = skyline.getBoundingClientRect();
      const kk = sk.width / vbW;
      const skTop = sk.top + window.scrollY - mainTop + (sk.height - vbH * kk) / 2;
      const sp = (x: number, y: number): Pt => ({ x: sk.left + x * kk, y: skTop + y * kk });
      const trolley = sp(thread.x, thread.from);
      const cableEnd = sp(thread.x, thread.to);
      const heroBottom = toDoc(sections[0]!).bottom;

      // La regla de la portada termina antes del cable, para no cruzarlo.
      const rule = document.querySelector<HTMLElement>(".rule");
      if (rule) {
        const r = rule.getBoundingClientRect();
        rule.style.width = `${Math.max(0, cableEnd.x - r.left - 18)}px`;
      }

      // El cable se dibuja al cargar, después de la ilustración, no con el
      // scroll: la figura tiene que estar completa antes de bajar.
      const cable = stroke(`M${trolley.x} ${trolley.y} V${cableEnd.y}`);
      const cableLen = cable.getTotalLength();
      gsap.set(cable, {
        strokeDasharray: `${cableLen} ${cableLen + 8}`,
        strokeDashoffset: cableLen + 4,
      });
      // Se reconstruye en cada refresh (fuentes, resize), así que el dibujo va
      // atado al reloj de carga y no al momento de la construcción: arranca
      // cuando el skyline llega al carro y dura lo mismo que un trazo suyo.
      const elapsed = (performance.now() - firstBuildAt) / 1000;
      cableTween?.kill();
      if (elapsed >= CABLE_AT + CABLE_DURATION) {
        gsap.set(cable, { strokeDashoffset: 0 });
      } else {
        cableTween = gsap.to(cable, {
          strokeDashoffset: 0,
          duration: CABLE_DURATION,
          delay: Math.max(0, CABLE_AT - elapsed),
          ease: "power1.inOut",
        });
        if (elapsed > CABLE_AT) cableTween.progress((elapsed - CABLE_AT) / CABLE_DURATION);
      }

      // Desde el extremo del cable, la recta sigue a plomo hasta el espacio
      // entre la portada y la primera sección. La curva empieza recién ahí.
      // Los disparadores restan media pantalla a la posición, así que este
      // tramo se ancla explícitamente al scroll cero: si no, quedaría "pasado"
      // al cargar y aparecería antes que el cable.
      const halfView = window.innerHeight * 0.5;
      let cursor: Pt = { x: cableEnd.x, y: cableEnd.y + 40 };
      add(
        stroke(`M${cableEnd.x} ${cableEnd.y} V${cursor.y}`),
        halfView,
        halfView + heroBottom * 0.4,
      );

      sections.slice(1).forEach((section, idx) => {
        const i = idx + 1;
        const id = sectionIds[i];
        const mark = landmarks[id];
        if (!mark) return;
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
          fill: "var(--pitch-accent)",
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
          // El desplazamiento arranca 4 unidades adentro del hueco: justo en el
          // borde, el navegador a veces pinta un punto de largo cero.
          gsap.set(el, { strokeDasharray: `${len} ${len + 8}`, strokeDashoffset: len + 4 });
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
