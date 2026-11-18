"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getLenis } from "../../_template/lib/lenis-provider";
import { REDUCED_MOTION_QUERY } from "../../_template/lib/gsap";
import { labels, nav } from "../despegar.data";

/** "3" → "03", como los números de las secciones. */
const pad = (i: number) => String(i + 1).padStart(2, "0");

/** Una sección cuenta como "la actual" cuando su borde de arriba pasó el tercio de la pantalla. */
function currentIndex() {
  let index = -1;
  nav.forEach((s, i) => {
    const el = document.getElementById(s.id);
    if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.35) index = i;
  });
  return Math.max(0, index);
}

/** Teclas que el atajo no tiene que pisar: escribir, mover un control o elegir una opción. */
function isEditing(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) ||
    target.closest('[role="slider"]') !== null
  );
}

/**
 * Modo presentación para mostrar la página en una videollamada: flechas
 * izquierda y derecha para ir de sección en sección, números para saltar a una
 * (el 0 es la 10) y "?" para ver la ayuda. Al saltar aparece abajo a la
 * izquierda el número y el nombre de la sección, así quien mira sabe dónde
 * está. No dibuja nada hasta que se usa.
 */
export function Presenter() {
  const [toast, setToast] = useState<number | null>(null);
  const [help, setHelp] = useState(false);
  const last = useRef<{ index: number; at: number } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const go = useCallback((index: number) => {
    const i = Math.min(Math.max(index, 0), nav.length - 1);
    const el = document.getElementById(nav[i].id);
    if (!el) return;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(el, { duration: 1.1 });
    else {
      const reduced = window.matchMedia(REDUCED_MOTION_QUERY).matches;
      el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    }
    last.current = { index: i, at: Date.now() };
    setToast(i);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 1800);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey || isEditing(e.target)) return;
      // Mientras el scroll todavía viaja, la base es el destino del salto
      // anterior: dos flechas seguidas avanzan dos secciones.
      const base =
        last.current && Date.now() - last.current.at < 1200 ? last.current.index : currentIndex();

      if (e.key === "ArrowRight") go(base + 1);
      else if (e.key === "ArrowLeft") go(base - 1);
      else if (/^[0-9]$/.test(e.key)) go(e.key === "0" ? 9 : Number(e.key) - 1);
      else if (e.key === "?") {
        setHelp((h) => !h);
        e.preventDefault();
        return;
      } else if (e.key === "Escape" && help) {
        setHelp(false);
        return;
      } else return;

      e.preventDefault();
      setHelp(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, help]);

  useEffect(() => {
    if (help) closeRef.current?.focus();
  }, [help]);

  useEffect(
    () => () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    },
    [],
  );

  const p = labels.presenter;

  return (
    <>
      <p
        aria-live="polite"
        className="presenter-toast fixed bottom-5 left-5 z-50 rounded-md bg-(--ink) px-3 py-2 text-sm font-medium text-white ring-1 ring-white/25"
        data-show={toast !== null}
      >
        {toast !== null ? (
          <>
            <span className="tabular">{pad(toast)}</span> <span aria-hidden>·</span>{" "}
            {nav[toast].label}
          </>
        ) : null}
      </p>

      {help ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-(--ink)/40 p-4"
          onClick={() => setHelp(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="presenter-title"
            className="w-full max-w-lg rounded-lg bg-(--surface) p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <h2 id="presenter-title" className="text-xl font-semibold">
                {p.title}
              </h2>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setHelp(false)}
                className="rounded-sm px-2 py-1 text-sm text-(--ink-dim) hover:text-(--ink)"
              >
                {p.close}
              </button>
            </div>
            <dl className="mt-4 grid grid-cols-[6rem_1fr] gap-x-4 gap-y-2">
              {p.keys.map((k) => (
                <div key={k.key} className="contents">
                  <dt>
                    <kbd className="mono rounded-sm border border-(--rule) px-1.5 py-0.5 text-sm">
                      {k.key}
                    </kbd>
                  </dt>
                  <dd className="text-(--ink-dim)">{k.text}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-sm font-medium">{p.sections}</p>
            <ol className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
              {nav.map((s, i) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setHelp(false);
                      go(i);
                    }}
                    className="text-left text-(--ink-dim) hover:text-(--ink)"
                  >
                    <span className="tabular">{pad(i)}</span> {s.label}
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>
      ) : null}
    </>
  );
}
