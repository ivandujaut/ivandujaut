/**
 * Las reglas que deciden un alta. Son código, no un modelo: el lector sólo
 * extrae datos de los documentos y acá se resuelve qué pasa con la solicitud.
 * Así ningún texto de un correo ("emitir sin revisar") puede cambiar la
 * decisión.
 *
 * Las tres últimas (`coverage`, `documents`, `data`) son las reglas de la
 * maqueta del tramo 04 de la página. Las dos primeras son compuertas: que la
 * cuenta exista y que el trámite sea el del primer paso (una unidad liviana).
 *
 * Ante la duda se deriva. Emitir mal es caro; derivar de más cuesta una
 * gestión que hoy se hace igual.
 */

export const RULES = [
  { id: "account", text: "La solicitud identifica una flota asegurada" },
  { id: "scope", text: "Es una sola unidad, de flota liviana" },
  { id: "coverage", text: "La cobertura pedida es la que ya tiene la flota" },
  { id: "documents", text: "Es 0 km con factura, o usado con fotos aprobadas" },
  { id: "data", text: "Los datos de la unidad coinciden con la documentación" },
];

const LIGHT_KINDS = new Set(["auto", "utilitario", "pickup"]);
const KIND_LABELS = { camion: "un camión", moto: "una moto" };

export const onlyDigits = (value) => (value ?? "").replace(/\D/g, "");
export const normalizePlate = (value) => (value ?? "").toUpperCase().replace(/[^A-Z0-9]/g, "");
export const normalizeVin = (value) => (value ?? "").toUpperCase().replace(/[^A-Z0-9]/g, "");

/** Patente argentina: formato Mercosur (AA123BB) o el anterior (ABC123). */
export const isPlate = (value) => /^([A-Z]{2}\d{3}[A-Z]{2}|[A-Z]{3}\d{3})$/.test(value);
/** Chasis: 17 caracteres, sin I, O ni Q. */
export const isVin = (value) => /^[A-HJ-NPR-Z0-9]{17}$/.test(value);

const pass = (id) => ({ id, status: "pass", detail: null });
const fail = (id, detail) => ({ id, status: "fail", detail });
const skipped = (id) => ({ id, status: "skipped", detail: null });

/**
 * @param {object} extraction Lo que el lector sacó de los documentos (ver `extract.mjs`).
 * @param {{ attachments: Array<{ kind: string }> }} request La solicitud tal como entró.
 * @param {{ fleets: object[], inspections: object[] }} registry Lo que el sistema ya sabe.
 * @returns {{ decision: "issue" | "refer", reason: string | null, fleet: object | null, checks: object[] }}
 */
export function decide(extraction, request, registry) {
  const cuit = onlyDigits(extraction.policyholder.cuit);
  const policy = onlyDigits(extraction.policyholder.policy_number);
  const fleet =
    registry.fleets.find(
      (f) => (cuit && onlyDigits(f.cuit) === cuit) || (policy && onlyDigits(f.policy) === policy),
    ) ?? null;

  const checks = [];

  // 1 · Cuenta. Sin flota no hay contra qué comparar: el resto no se evalúa.
  if (!fleet) {
    checks.push(fail("account", "El CUIT y la póliza no corresponden a ninguna flota asegurada."));
    for (const rule of RULES.slice(1)) checks.push(skipped(rule.id));
    return finish(checks, fleet);
  }
  // El CUIT y la póliza, si vienen los dos, tienen que ser de la misma cuenta.
  if (cuit && policy && (onlyDigits(fleet.cuit) !== cuit || onlyDigits(fleet.policy) !== policy)) {
    checks.push(fail("account", "El CUIT y el número de póliza son de cuentas distintas."));
  } else {
    checks.push(pass("account"));
  }

  // 2 · Alcance del primer paso.
  const vehicle = extraction.vehicle;
  if (extraction.vehicle_count !== 1) {
    checks.push(
      fail("scope", `La solicitud trae ${extraction.vehicle_count} unidades: va una por alta.`),
    );
  } else if (!LIGHT_KINDS.has(vehicle.kind)) {
    checks.push(
      fail(
        "scope",
        vehicle.kind === "desconocido"
          ? "No se pudo determinar el tipo de unidad."
          : `Es ${KIND_LABELS[vehicle.kind] ?? "otro tipo de unidad"}: el primer paso cubre autos, utilitarios y pick-ups.`,
      ),
    );
  } else {
    checks.push(pass("scope"));
  }

  // 3 · Cobertura. Si no la nombra, el alta entra con la de la flota.
  const requested = extraction.requested_coverage;
  if (
    requested === "igual_a_la_flota" ||
    requested === "no_indica" ||
    requested === fleet.coverage
  ) {
    checks.push(pass("coverage"));
  } else {
    checks.push(
      fail(
        "coverage",
        `Pide "${requested.replaceAll("_", " ")}" y la flota tiene ${fleet.coverageLabel.toLowerCase()}: eso es suscripción.`,
      ),
    );
  }

  // 4 · Documentación.
  const plate = normalizePlate(vehicle.plate);
  const hasDocument = request.attachments.some((a) => a.kind === "document");
  const inspection = registry.inspections.find((i) => i.plate === plate && i.fleet === fleet.id);
  if (vehicle.condition === "0km") {
    if (!hasDocument || extraction.invoice.document_kind === "sin_documento") {
      checks.push(fail("documents", "Es 0 km y no vino la factura de compra."));
    } else if (extraction.invoice.document_kind === "proforma_o_presupuesto") {
      checks.push(fail("documents", "El adjunto es un presupuesto o proforma, no la factura."));
    } else if (extraction.invoice.document_kind !== "factura") {
      checks.push(fail("documents", "El adjunto no se reconoce como una factura de compra."));
    } else {
      checks.push(pass("documents"));
    }
  } else if (vehicle.condition === "usado") {
    checks.push(
      inspection
        ? pass("documents")
        : fail("documents", "Es usado y no tiene la inspección por fotos aprobada."),
    );
  } else {
    checks.push(fail("documents", "No se pudo determinar si la unidad es 0 km o usada."));
  }

  // 5 · Datos contra documentación.
  const problems = [];
  const requestVin = normalizeVin(vehicle.vin);
  const invoiceVin = normalizeVin(extraction.invoice.vin);
  if (vehicle.condition === "0km" && extraction.invoice.document_kind === "factura") {
    const legible = extraction.invoice.legible;
    if (!legible) {
      const fields = extraction.invoice.unreadable_fields;
      const shown = fields.slice(0, 3).join(", ") + (fields.length > 3 ? " y otros" : "");
      problems.push(`La factura no se lee bien${shown ? ` (${shown})` : ""}.`);
    }
    if (!isVin(invoiceVin)) {
      problems.push("No se pudo leer un chasis válido en la factura.");
    } else if (requestVin && requestVin !== invoiceVin) {
      problems.push(`El chasis del pedido (${requestVin}) no es el de la factura (${invoiceVin}).`);
    }
    const buyer = onlyDigits(extraction.invoice.buyer_cuit);
    if (buyer !== onlyDigits(fleet.cuit)) {
      // Con la factura ilegible, un CUIT distinto es un CUIT mal leído, no otro comprador.
      problems.push(
        buyer && legible
          ? `La factura está a nombre de otro CUIT (${extraction.invoice.buyer_cuit}).`
          : "No se pudo leer el CUIT del comprador en la factura.",
      );
    }
    if (!vehicle.plate_pending && !isPlate(plate)) {
      problems.push("La patente no tiene un formato válido y no figura como en trámite.");
    }
  } else if (vehicle.condition === "usado") {
    if (!isPlate(plate)) problems.push("Un usado necesita una patente válida.");
    if (!isVin(requestVin)) problems.push("Falta un chasis válido en el pedido.");
  }
  // Sin factura legible o sin condición no hay con qué comparar: no se evalúa.
  const comparable =
    vehicle.condition === "usado" ||
    (vehicle.condition === "0km" && extraction.invoice.document_kind === "factura");
  if (!comparable) checks.push(skipped("data"));
  else checks.push(problems.length ? fail("data", problems.join(" ")) : pass("data"));

  return finish(checks, fleet);
}

function finish(checks, fleet) {
  const firstFailure = checks.find((c) => c.status === "fail") ?? null;
  // Se emite sólo si las cinco pasaron. Una regla sin evaluar no cuenta como aprobada.
  const allPassed = checks.every((c) => c.status === "pass");
  return {
    decision: allPassed ? "issue" : "refer",
    reason: allPassed ? null : (firstFailure?.id ?? "data"),
    fleet,
    checks,
  };
}

/** Qué hay que pedirle al cliente, según la regla que frenó el alta. */
export const NEXT_STEP = {
  account: "Confirmar con el cliente a qué póliza corresponde antes de seguir.",
  scope: "Tratarla por el circuito actual: no es el trámite del primer paso.",
  coverage: "Pasarla a suscripción: cambia la cobertura, no sólo la unidad.",
  documents: "Pedirle al cliente lo que falta; el resto del caso ya está leído.",
  data: "Revisar la diferencia con el cliente antes de emitir.",
};
