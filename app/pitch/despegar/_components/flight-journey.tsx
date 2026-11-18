import type { CSSProperties } from "react";
import Image from "next/image";
import { journey, labels } from "../despegar.data";
import { Cite, ExampleBadge } from "./ui";

/**
 * El viaje de una compra, sólo con CSS (ver "El viaje de una compra" en
 * `despegar.css`). Cada parada declara su `view-timeline` (`--stop-N`) y el
 * contenedor las sube con `timeline-scope`, así el escenario fijo de la
 * izquierda puede leerlas: el cuadro N aparece mientras la parada N cruza la
 * pantalla, y la ruta de abajo se llena con el avance de todo el recorrido.
 * El avión son varias poses apiladas en el mismo lugar (el tren abajo, a medio
 * subir, guardado); el CSS mueve el conjunto y decide cuál se ve.
 *
 * Sin soporte de `animation-timeline` o con movimiento reducido, el escenario
 * no se muestra y cada parada lleva su cuadro al lado del texto: la misma
 * información, sin movimiento.
 */
export function FlightJourney() {
  const stops = journey.stops;
  const routeStyle = { "--n": stops.length } as CSSProperties;

  return (
    <div className="journey mt-20">
      <header className="reveal max-w-2xl">
        <p className="text-sm font-medium text-(--seen-ink)">{journey.eyebrow}</p>
        <h3 className="mt-2 text-2xl font-semibold md:text-3xl">{journey.heading}</h3>
        <p className="mt-3 leading-relaxed text-(--ink-dim)">{journey.intro}</p>
        {journey.placeholder ? (
          <div className="mt-4">
            <ExampleBadge>{labels.placeholderFrames}</ExampleBadge>
          </div>
        ) : null}
      </header>

      <div className="journey-grid">
        <div className="journey-stage" aria-hidden>
          <div className="journey-frames">
            {stops.map((s, i) => (
              <Image
                key={s.id}
                className="journey-frame"
                data-stop={i + 1}
                data-edge={i === 0 ? "first" : i === stops.length - 1 ? "last" : undefined}
                src={s.background}
                alt=""
                width={1600}
                height={900}
                sizes="(min-width: 768px) 55vw, 100vw"
              />
            ))}
            <div
              className="journey-plane"
              style={{ aspectRatio: `${journey.plane.width} / ${journey.plane.height}` }}
            >
              {journey.plane.poses.map((src, i) => (
                <Image
                  key={src}
                  className="journey-pose"
                  style={{ "--i": i } as CSSProperties}
                  src={src}
                  alt=""
                  width={journey.plane.width}
                  height={journey.plane.height}
                  sizes="(min-width: 768px) 40vw, 70vw"
                />
              ))}
            </div>
          </div>
          <ol className="journey-route" style={routeStyle}>
            <span className="journey-route-line">
              <span className="journey-route-fill" />
            </span>
            {stops.map((s, i) => (
              <li
                key={s.id}
                className="journey-dot"
                data-stop={i + 1}
                data-tone={"flip" in s ? "paid" : "seen"}
              >
                <span />
                {s.step}
              </li>
            ))}
          </ol>
        </div>

        <ol className="journey-stops">
          {stops.map((s, i) => (
            <li key={s.id} id={`viaje-${s.id}`} className="journey-stop" data-stop={i + 1}>
              <Image
                className="journey-stop-frame"
                src={s.frame.src}
                alt={s.frame.alt}
                width={1600}
                height={900}
                sizes="100vw"
                unoptimized={s.frame.src.endsWith(".svg")}
              />
              <div className="journey-card">
                <p className="text-sm font-medium text-(--seen-ink)">
                  <span className="tabular">{i + 1}.</span> {s.step}
                </p>
                <h4 className="mt-2 text-2xl leading-snug font-semibold md:text-3xl">{s.title}</h4>
                {"flip" in s && s.flip ? (
                  <p className="journey-flip mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-3xl font-semibold tabular md:text-4xl">
                    <span className="flip-seen">{s.flip.seen}</span>
                    <span className="flip-paid">{s.flip.paid}</span>
                    <ExampleBadge>{s.flip.label}</ExampleBadge>
                  </p>
                ) : null}
                <p className="mt-4 text-lg leading-relaxed text-(--ink-dim)">
                  {s.text}
                  <Cite id={s.source} />
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
