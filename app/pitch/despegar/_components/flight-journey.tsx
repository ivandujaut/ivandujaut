import type { CSSProperties } from "react";
import { journey } from "../despegar.data";
import { TicketBack, TicketFront } from "./ticket";
import { Cite, ExampleBadge } from "./ui";

/**
 * El viaje de una compra, sólo con CSS (ver "El viaje de una compra" en
 * `despegar.css`). Cada parada declara su `view-timeline` (`--stop-N`) y el
 * contenedor las sube con `timeline-scope`, así el escenario fijo puede
 * leerlas: la escena N aparece mientras la parada N cruza la pantalla, el
 * pasaje cambia de pose entre paradas (en 3D, con perspectiva) y la ruta de
 * abajo se llena con el avance de todo el recorrido.
 *
 * Sin soporte de `animation-timeline` o con movimiento reducido, el escenario
 * no se muestra: arriba de las paradas quedan las dos caras del pasaje, el
 * precio que se ve y el que se paga.
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
      </header>

      <figure
        className="journey-static"
        aria-label={`${journey.ticket.seen.price} → ${journey.ticket.paid.price}`}
      >
        <TicketFront />
        <TicketBack />
        <figcaption>
          <ExampleBadge>{journey.ticket.example}</ExampleBadge>
        </figcaption>
      </figure>

      <div className="journey-grid">
        <div className="journey-stage" aria-hidden>
          <div className="journey-frames">
            <div className="ticket3d">
              <div className="ticket-face ticket-front">
                <TicketFront />
              </div>
              {/* El dorso va en dos partes para poder cortar el talón en la vuelta. */}
              <div className="ticket-face ticket-back ticket-back-body">
                <TicketBack />
              </div>
              <div className="ticket-face ticket-back">
                <div className="ticket-stub">
                  <TicketBack />
                </div>
              </div>
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
