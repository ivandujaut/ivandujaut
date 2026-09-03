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
 * vertical sin pin, pero atada al dedo: el riel se dibuja, los puntos se
 * encienden y los números cuentan a medida que se baja. El HTML es el mismo.
 */
export function Timeline() {
  const ref = useGsapSection<HTMLElement>(({ root, q, isDesktop }) => {
    const track = root.querySelector<HTMLElement>(".track");
    const viewport = root.querySelector<HTMLElement>(".track-viewport");
    const items = q(".milestone") as HTMLElement[];
    if (!track || !viewport) return;

    const originals = new Map<HTMLElement, string>();
    const counter = (item: HTMLElement) => {
      const num = item.querySelector<HTMLElement>(".count");
      const m = timeline[Number(item.dataset.index)];
      if (!num || !m?.count) return null;
      originals.set(num, num.textContent ?? "");
      const proxy = { n: 0 };
      num.textContent = formatCount(m, 0);
      return gsap.to(proxy, {
        n: m.count.value,
        duration: 1,
        ease: "power2.out",
        paused: true,
        onUpdate: () => {
          num.textContent = formatCount(m, proxy.n);
        },
      });
    };
    const lit = (item: HTMLElement) =>
      gsap.to(item.querySelector(".dot"), {
        scale: 1.6,
        backgroundColor: "var(--lebane-accent)",
        duration: 0.4,
        paused: true,
      });

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
        const count = counter(item);
        const dot = lit(item);
        ScrollTrigger.create({
          trigger: item,
          containerAnimation: move,
          start: "center 70%",
          once: true,
          onEnter: () => {
            dot.play();
            count?.play();
          },
        });
      });
    } else {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: "top 65%", end: "bottom 85%", scrub: 0.5 },
      });
      tl.from(
        q(".rail-v"),
        { scaleY: 0, transformOrigin: "top center", ease: "none", duration: items.length },
        0,
      );
      items.forEach((item, i) => {
        const count = counter(item);
        tl.from(item.querySelector(".milestone-body"), { opacity: 0, x: -20, duration: 0.6 }, i);
        tl.add(lit(item).play(), i + 0.15);
        if (count) tl.add(count.play(), i + 0.15);
      });
    }

    return () => originals.forEach((text, el) => (el.textContent = text));
  });

  return (
    <section
      id="timeline"
      ref={ref}
      data-pin
      className="flex w-full flex-col justify-center overflow-hidden py-24 md:py-0"
    >
      <div className="mx-auto w-full max-w-5xl px-6">
        <SectionHeading index="01" eyebrow="Trayectoria">
          Tres años, cuatro saltos
        </SectionHeading>
      </div>

      <div className="track-viewport mt-14 w-full md:mt-20 md:pl-[max(1.5rem,calc((100vw-64rem)/2+1.5rem))]">
        <ol className="track relative flex flex-col gap-12 px-6 md:w-max md:flex-row md:gap-0 md:px-0 md:pr-[40vw]">
          <div
            className="pointer-events-none absolute top-1.5 right-0 left-0 hidden h-px bg-(--lebane-line) md:block"
            aria-hidden
          >
            <div className="rail-fill h-full w-full bg-(--lebane-accent)" />
          </div>
          <div
            className="pointer-events-none absolute top-2 bottom-2 left-[calc(1.5rem+5px)] w-px bg-(--lebane-line) md:hidden"
            aria-hidden
          >
            <div className="rail-v h-full w-full bg-(--lebane-accent)" />
          </div>
          {timeline.map((m, i) => (
            <li
              key={m.date}
              data-index={i}
              className="milestone relative flex gap-5 md:w-[19rem] md:flex-col md:gap-0 md:pr-10"
            >
              <span
                className="dot relative mt-1 block size-3 shrink-0 rounded-full border-2 border-background bg-(--lebane-line) md:absolute md:top-0 md:left-0 md:mt-0 md:border-0"
                aria-hidden
              />
              <div className="milestone-body md:mt-8">
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
