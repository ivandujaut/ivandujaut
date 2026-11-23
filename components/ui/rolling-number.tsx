"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const DIGITOS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

interface RollingNumberProps {
  /** El valor tal como se muestra: "17", "+6,98%", "1.500", "3,33×". */
  value: string;
  className?: string;
}

/**
 * Un número cuyos dígitos ruedan desde el cero hasta su valor la primera vez
 * que entra en pantalla, como los contadores de moatseek.com.
 *
 * Cada dígito es una columna del 0 al 9 dentro de una ventana de un renglón;
 * lo que no es dígito (signos, comas, unidades) queda quieto. El servidor
 * pinta las columnas ya en su valor final, así que sin JavaScript, con
 * movimiento reducido o si el número ya está a la vista al cargar, se lee el
 * número correcto y no rueda nada. Sólo cuando está debajo del pliegue se
 * llevan las columnas a cero y ruedan al aparecer: hacerlo con el número a la
 * vista mostraría el valor, después ceros y después el valor de nuevo.
 *
 * El rodaje se maneja tocando el estilo de las columnas y no con estado de
 * React: son veinte transformaciones que no cambian lo que se renderiza.
 *
 * Las columnas son decorativas (`aria-hidden`, sin selección); el valor real
 * va en un texto sólo para lectores de pantalla, que es también lo que se
 * copia si alguien selecciona la cifra.
 */
export function RollingNumber({ value, className }: RollingNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    const columnas = [...el.querySelectorAll<HTMLElement>("[data-digito]")];
    for (const c of columnas) {
      c.style.transition = "none";
      c.style.transform = "translateY(0)";
    }

    const observer = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada?.isIntersecting) return;
        observer.disconnect();
        columnas.forEach((c, i) => {
          c.style.transition = `transform 1100ms cubic-bezier(0.22, 1, 0.36, 1) ${i * 70}ms`;
          c.style.transform = `translateY(-${Number(c.dataset.digito) * 10}%)`;
        });
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref} className={cn("inline-block tabular-nums", className)}>
      <span className="sr-only">{value}</span>
      <span aria-hidden className="select-none">
        {[...value].map((caracter, i) => {
          const d = DIGITOS.indexOf(caracter);
          if (d === -1) return <span key={i}>{caracter}</span>;
          return (
            // `align-top` y no la línea de base: un inline-block con
            // `overflow: hidden` apoya su borde inferior en la base, y la
            // columna quedaría un renglón más arriba que el texto de al lado.
            <span key={i} className="inline-block h-lh overflow-hidden align-top">
              <span
                data-digito={d}
                className="flex flex-col"
                style={{ transform: `translateY(-${d * 10}%)` }}
              >
                {DIGITOS.map((n) => (
                  <span key={n} className="h-lh">
                    {n}
                  </span>
                ))}
              </span>
            </span>
          );
        })}
      </span>
    </span>
  );
}
