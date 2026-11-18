import { journey } from "../despegar.data";

/**
 * El pasaje del viaje, dibujado en SVG. Tres caras con el mismo lienzo
 * (600 × 280): el frente con el precio del listado, el dorso con el que se
 * paga (el talón queda del otro lado, como al dar vuelta un papel) y el pasaje
 * de vuelta, sin fecha ni precio. El texto sale de `journey.ticket`.
 */

const W = 600;
const H = 280;
const t = journey.ticket;

/** Contorno con las dos muescas del troquel en `x` y las esquinas redondeadas. */
function outline(x: number) {
  const r = 16;
  const n = 14;
  return [
    `M${r},0 H${x - n} A${n},${n} 0 0 0 ${x + n},0 H${W - r} A${r},${r} 0 0 1 ${W},${r}`,
    `V${H - r} A${r},${r} 0 0 1 ${W - r},${H} H${x + n} A${n},${n} 0 0 0 ${x - n},${H}`,
    `H${r} A${r},${r} 0 0 1 0,${H - r} V${r} A${r},${r} 0 0 1 ${r},0 Z`,
  ].join(" ");
}

/** Código de barras decorativo: anchos fijos, para que no cambie entre renders. */
const BARS = [3, 1, 2, 1, 4, 1, 1, 3, 2, 1, 1, 2, 3, 1, 2, 4, 1, 2, 1, 3, 1, 1, 2, 3, 1, 2];
/** Dónde arranca cada barra, en unidades: cada una deja un hueco de su mismo ancho. */
const BAR_STARTS = BARS.map((_, i) => BARS.slice(0, i).reduce((a, b) => a + b * 2, 0));
const BAR_UNITS = BARS.reduce((a, b) => a + b * 2, 0);

function Barcode({ x, y, width, height }: { x: number; y: number; width: number; height: number }) {
  const unit = width / BAR_UNITS;
  return (
    <g className="t-ink">
      {BARS.map((b, i) => (
        <rect key={i} x={x + BAR_STARTS[i] * unit} y={y} width={b * unit} height={height} />
      ))}
    </g>
  );
}

/** Lo que comparten las caras: papel, troquel, rótulo, fecha y ruta. */
function Paper({
  notch,
  bodyX,
  bodyEnd,
  label,
  date,
  from,
  to,
  dashed,
  children,
}: {
  notch: number;
  bodyX: number;
  bodyEnd: number;
  label: string;
  date: string;
  from: string;
  to: string;
  dashed?: boolean;
  children: React.ReactNode;
}) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="ticket-svg" aria-hidden>
      <path d={outline(notch)} className={dashed ? "t-paper t-paper-dashed" : "t-paper"} />
      <line x1={notch} y1={24} x2={notch} y2={H - 24} className="t-perforation" />
      <text x={bodyX} y={46} className="t-mono t-dim" fontSize={15}>
        {label}
      </text>
      <text x={bodyEnd} y={46} className="t-mono t-dim" fontSize={15} textAnchor="end">
        {date}
      </text>
      <text x={bodyX} y={132} className="t-sans t-ink" fontSize={68}>
        {from}
      </text>
      <text x={bodyEnd} y={132} className="t-sans t-ink" fontSize={68} textAnchor="end">
        {to}
      </text>
      {/* Los códigos de tres letras miden distinto (BUE es más ancho que RIO): la
          línea deja el mismo aire a cada lado. */}
      <line x1={bodyX + 158} y1={108} x2={bodyEnd - 134} y2={108} className="t-route" />
      <circle cx={bodyX + 158} cy={108} r={5} className="t-ink" />
      <circle cx={bodyEnd - 134} cy={108} r={5} className="t-ink" />
      {children}
    </svg>
  );
}

/** Frente: el precio aparece en "Resultados"; antes, la búsqueda. */
export function TicketFront() {
  return (
    <Paper
      notch={440}
      bodyX={32}
      bodyEnd={408}
      label={`${t.label} · ${t.outbound}`}
      date={t.date}
      from={t.from}
      to={t.to}
    >
      <g className="ticket-pending">
        <text x={32} y={190} className="t-mono t-dim" fontSize={15}>
          {t.searchStep}
        </text>
        <text x={32} y={242} className="t-sans t-seen" fontSize={46}>
          {t.searching}
        </text>
      </g>
      <g className="ticket-price">
        <text x={32} y={190} className="t-mono t-dim" fontSize={15}>
          {t.seen.step}
        </text>
        <text x={32} y={242} className="t-sans t-seen" fontSize={46}>
          {t.seen.price}
        </text>
      </g>
      <Barcode x={470} y={40} width={100} height={200} />
    </Paper>
  );
}

/** Dorso: el mismo pasaje en el último paso, con el precio que se paga. */
export function TicketBack() {
  return (
    <Paper
      notch={160}
      bodyX={192}
      bodyEnd={568}
      label={`${t.label} · ${t.outbound}`}
      date={t.date}
      from={t.from}
      to={t.to}
    >
      <text x={192} y={176} className="t-mono t-dim" fontSize={15}>
        {t.paid.step}
      </text>
      <text x={192} y={226} className="t-sans t-paid" fontSize={46}>
        {t.paid.price}
      </text>
      <text x={568} y={226} className="t-sans t-dim t-strike" fontSize={26} textAnchor="end">
        {t.seen.price}
      </text>
      <text x={192} y={258} className="t-mono t-dim" fontSize={14}>
        {t.reason}
      </text>
      <Barcode x={30} y={40} width={100} height={200} />
    </Paper>
  );
}

/** El pasaje de vuelta: la segunda compra, que todavía no tiene fecha ni precio. */
export function TicketReturn() {
  return (
    <Paper
      notch={440}
      bodyX={32}
      bodyEnd={408}
      label={`${t.label} · ${t.inbound}`}
      date={t.noDate}
      from={t.to}
      to={t.from}
      dashed
    >
      <text x={32} y={242} className="t-sans t-dim" fontSize={46}>
        {t.noPrice}
      </text>
    </Paper>
  );
}
