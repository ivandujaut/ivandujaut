"use client";

import { gsap, ScrollTrigger } from "../_lib/gsap";
import { useGsapSection } from "../_lib/use-gsap-section";
import { SectionHeading } from "../_lib/section";
import { timeline, type Milestone } from "../lebane.data";

function formatCount(m: Milestone, n: number): string {
  if (!m.count) return m.metric ?? "";
  return `${m.count.prefix ?? ""}${Math.round(n)}${m.count.suffix ?? ""}`;
}

/**
 * Desktop: la sección se pinnea y la línea de tiempo avanza en horizontal con
 * el scroll; cada hito enciende su número al pasar por el centro. Mobile: lista
 * vertical sin pin, con reveal por hito. El HTML es el mismo; cambia el eje.
 */
export function Timeline() {
  const ref = useGsapSection<HTMLElement>(({ root, q, isDesktop }) => {
    const track = root.querySelector<HTMLElement>(".track");
    const viewport = root.querySelector<HTMLElement>(".track-viewport");
    const items = q(".milestone") as HTMLElement[];
    if (!track || !viewport) return;

    const cleanups: Array<() => void> = [];
    const light = (item: HTMLElement) => {
      const num = item.querySelector<HTMLElement>(".count");
      const dot = item.querySelector<HTMLElement>(".dot");
      const m = timeline[Number(item.dataset.index)];
      if (dot) gsap.to(dot, { scale: 1.6, backgroundColor: "var(--lebane-accent)", duration: 0.4 });
      if (num && m?.count) {
        const original = num.textContent;
        const proxy = { n: 0 };
        num.textContent = formatCount(m, 0);
        gsap.to(proxy, {
          n: m.count.value,
          duration: 1.1,
          ease: "power2.out",
          onUpdate: () => {
            num.textContent = formatCount(m, proxy.n);
          },
        });
        cleanups.push(() => {
          num.textContent = original;
        });
      }
    };

    if (isDesktop) {
      const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
      const move = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: root,
          pin: true,
          scrub: 0.8,
          start: "top top",
          end: () => `+=${distance() + window.innerHeight * 0.6}`,
          invalidateOnRefresh: true,
        },
      });
      gsap.from(q(".rail-fill"), {
        scaleX: 0,
        transformOrigin: "left center",
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: move.scrollTrigger?.end,
          scrub: 0.8,
        },
      });
      items.forEach((item) => {
        ScrollTrigger.create({
          trigger: item,
          containerAnimation: move,
          start: "center 70%",
          once: true,
          onEnter: () => light(item),
        });
      });
    } else {
      items.forEach((item) => {
        gsap.from(item, {
          opacity: 0,
          x: -16,
          duration: 0.6,
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
            once: true,
            onEnter: () => light(item),
          },
        });
      });
    }

    return () => cleanups.forEach((fn) => fn());
  });

  return (
    <section
      id="timeline"
      ref={ref}
      data-pin
      className="flex w-full flex-col justify-center overflow-hidden py-24 md:py-0"
    >
      <div className="mx-auto w-full max-w-5xl px-6">
        <SectionHeading eyebrow="01 · Trayectoria">Tres años, cuatro saltos</SectionHeading>
      </div>

      <div className="track-viewport mt-14 w-full md:mt-20 md:pl-[max(1.5rem,calc((100vw-64rem)/2+1.5rem))]">
        <ol className="track relative flex flex-col gap-10 px-6 md:w-max md:flex-row md:gap-0 md:px-0 md:pr-[40vw]">
          <div
            className="pointer-events-none absolute top-1.5 right-0 left-0 hidden h-px bg-(--lebane-line) md:block"
            aria-hidden
          >
            <div className="rail-fill h-full w-full bg-(--lebane-accent)" />
          </div>
          {timeline.map((m, i) => (
            <li
              key={m.date}
              data-index={i}
              className="milestone relative flex gap-5 md:w-[19rem] md:flex-col md:gap-0 md:pr-10"
            >
              <span
                className="dot mt-1 block size-3 shrink-0 rounded-full bg-(--lebane-line) md:absolute md:top-0 md:left-0 md:mt-0"
                aria-hidden
              />
              <div className="md:mt-8">
                <p className="font-mono text-xs tracking-widest text-(--lebane-ink-dim) uppercase">
                  {m.date}
                </p>
                <p className="count mt-2 font-serif text-4xl font-semibold tabular-nums md:text-6xl">
                  {m.metric ?? "—"}
                </p>
                <p className="mt-3 max-w-xs text-base text-(--lebane-ink-dim)">{m.label}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
