"use client";

import { cn } from "@/lib/utils";
import { gsap, ScrollTrigger } from "../../_template/lib/gsap";
import { useGsapSection } from "../../_template/lib/use-gsap-section";
import { hero } from "../despegar.data";
import { ReadingLabel } from "./ui";

/** Un precio escrito en paletas. `flip` apila las dos caras de cada carácter. */
function FlapRow({ seen, paid, flip }: { seen: string; paid: string; flip: boolean }) {
  const seenChars = [...seen];
  const paidChars = [...paid];
  return (
    <span className="flex gap-[0.12em]" aria-hidden>
      {paidChars.map((char, i) => {
        const before = seenChars[i] ?? " ";
        const isSpace = char === " " && before === " ";
        const changes = flip && before !== char;
        return (
          <span key={i} className={cn("flap", isSpace && "is-space")} data-changes={changes}>
            {changes ? <span className="flap-face is-seen">{before}</span> : null}
            <span className={cn("flap-face", changes && "is-paid")}>{flip ? char : before}</span>
          </span>
        );
      })}
    </span>
  );
}

/**
 * El tablero de partidas de la portada: el mismo vuelo en el listado y en el
 * último paso. Al bajar, las paletas del precio del último paso giran del
 * número del listado al que se cobra. Sin animación se ve el estado final.
 */
export function DepartureBoard() {
  const { board } = hero;

  const ref = useGsapSection<HTMLDivElement>(({ root, q }) => {
    const seenFaces = q("[data-changes='true'] .flap-face.is-seen");
    const paidFaces = q("[data-changes='true'] .flap-face.is-paid");
    const after = q(".board-after");

    gsap.set(seenFaces, { opacity: 1, rotateX: 0 });
    gsap.set(paidFaces, { opacity: 0, rotateX: -90 });
    gsap.set(after, { opacity: 0, y: 8 });

    const tl = gsap.timeline({ paused: true });
    seenFaces.forEach((face, i) => {
      const at = i * 0.12;
      tl.to(face, { rotateX: 90, opacity: 0, duration: 0.16, ease: "power1.in" }, at);
      tl.to(
        paidFaces[i],
        { rotateX: 0, opacity: 1, duration: 0.22, ease: "power2.out" },
        at + 0.16,
      );
    });
    tl.to(after, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.12 }, ">-0.05");

    const trigger = ScrollTrigger.create({
      trigger: root,
      start: "center 45%",
      onEnter: () => tl.delay(1).play(),
      onLeaveBack: () => tl.delay(0).reverse(),
    });

    return () => trigger.kill();
  });

  const summary = `${board.label}: ${board.route}, ${board.seen.step} ${board.seen.price}; ${board.paid.step} ${board.paid.price}. ${board.reason}.`;

  return (
    <div ref={ref} className="reveal w-full">
      <figure
        role="img"
        aria-label={summary}
        className="rounded-xl bg-(--board) p-4 text-white shadow-[0_30px_80px_-30px_rgb(39_5_112/60%)] md:p-6"
      >
        <div className="flex items-center justify-between gap-3">
          <p className="mono text-xs tracking-widest text-white/60 uppercase">
            {board.route} <span aria-hidden>·</span> {board.date}
          </p>
          <span className="rounded-sm border border-dashed border-white/40 px-2 py-0.5 font-mono text-[0.65rem] tracking-wide text-white/70 uppercase">
            {board.label}
          </span>
        </div>

        <div className="mt-5 grid gap-4">
          <div className="flex flex-col items-start gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <ReadingLabel which="seen" className="text-[#b9a1ff]" />
              <p className="mt-1 text-sm text-white/70">{board.seen.step}</p>
            </div>
            <span className="text-2xl md:text-3xl">
              <FlapRow seen={board.seen.price} paid={board.seen.price} flip={false} />
            </span>
          </div>

          <div className="flex flex-col items-start gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <ReadingLabel which="paid" className="text-[#ff8a7a]" />
              <p className="mt-1 text-sm text-white/70">{board.paid.step}</p>
            </div>
            <span className="text-2xl md:text-3xl">
              <FlapRow seen={board.seen.price} paid={board.paid.price} flip />
            </span>
          </div>
        </div>

        <div className="mt-5 grid gap-2 border-t border-white/10 pt-4 text-sm">
          <p className="board-after flex items-center gap-2 text-[#ff8a7a]">
            <span aria-hidden className="inline-block size-1.5 rounded-full bg-(--paid)" />
            {board.reason}
          </p>
          <p className="board-after mono text-xs text-white/60">{board.note}</p>
        </div>
      </figure>
    </div>
  );
}
