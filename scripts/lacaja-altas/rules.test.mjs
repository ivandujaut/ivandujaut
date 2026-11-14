/**
 * Las reglas se prueban sin modelo: se les da una lectura armada a mano y se
 * mira qué deciden.
 *
 *   node --test scripts/lacaja-altas/
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import { fleets, inspections } from "./cases.mjs";
import { decide } from "./rules.mjs";

const registry = { fleets, inspections };
const VIN = "8A1FC1E15RL412907";

/** Un alta limpia: utilitario 0 km de Timbó con su factura. */
const clean = () => ({
  extraction: {
    policyholder: {
      cuit: "30-71000101-4",
      name: "Transportes Timbó SRL",
      policy_number: "5120-0044871",
    },
    vehicle_count: 1,
    vehicle: {
      kind: "utilitario",
      make: "Renault",
      model: "Kangoo",
      year: 2026,
      condition: "0km",
      plate: null,
      plate_pending: true,
      vin: VIN,
    },
    requested_coverage: "igual_a_la_flota",
    invoice: {
      document_kind: "factura",
      buyer_cuit: "30-71000101-4",
      vin: VIN,
      legible: true,
      unreadable_fields: [],
    },
    out_of_process_request: null,
    other_requests: null,
    unusual_terms: null,
  },
  request: { attachments: [{ kind: "document" }] },
});

const run = (change) => {
  const input = clean();
  change?.(input.extraction, input.request);
  return decide(input.extraction, input.request, registry);
};

test("un 0 km con factura que coincide se cierra solo", () => {
  const result = run();
  assert.equal(result.decision, "issue");
  assert.equal(result.reason, null);
});

test("el chasis sólo en la factura alcanza", () => {
  assert.equal(run((e) => (e.vehicle.vin = null)).decision, "issue");
});

test("el CUIT sin guiones es el mismo CUIT", () => {
  assert.equal(run((e) => (e.policyholder.cuit = "30710001014")).decision, "issue");
});

test("nombrar la cobertura de la flota es pedir la misma", () => {
  assert.equal(run((e) => (e.requested_coverage = "terceros_completo")).decision, "issue");
});

test("una empresa que no es de ninguna flota se deriva y no evalúa el resto", () => {
  const result = run((e) => {
    e.policyholder.cuit = "30-71999888-5";
    e.policyholder.name = "Maderas del Alto Uruguay SA";
    e.policyholder.policy_number = null;
    e.invoice.buyer_cuit = "30-71999888-5";
  });
  assert.equal(result.reason, "account");
  assert.deepEqual(
    result.checks.slice(1).map((c) => c.status),
    ["skipped", "skipped", "skipped", "skipped"],
  );
});

test("CUIT de una cuenta y póliza de otra se deriva", () => {
  assert.equal(run((e) => (e.policyholder.policy_number = "5120-0051233")).reason, "account");
});

test("un camión queda fuera del primer paso", () => {
  assert.equal(run((e) => (e.vehicle.kind = "camion")).reason, "scope");
});

test("dos unidades en una solicitud se derivan", () => {
  assert.equal(run((e) => (e.vehicle_count = 2)).reason, "scope");
});

test("pedir otra cobertura se deriva", () => {
  assert.equal(run((e) => (e.requested_coverage = "todo_riesgo")).reason, "coverage");
});

test("un 0 km sin adjunto se deriva", () => {
  const result = run((e, r) => {
    r.attachments = [];
    e.invoice.document_kind = "sin_documento";
  });
  assert.equal(result.reason, "documents");
});

test("una proforma no es la factura", () => {
  assert.equal(
    run((e) => (e.invoice.document_kind = "proforma_o_presupuesto")).reason,
    "documents",
  );
});

test("un usado sin inspección aprobada se deriva", () => {
  const result = run((e, r) => {
    e.vehicle.condition = "usado";
    e.vehicle.plate = "AF218KD";
    e.vehicle.plate_pending = false;
    r.attachments = [];
  });
  assert.equal(result.reason, "documents");
});

test("un usado con la inspección aprobada se cierra solo", () => {
  const result = run((e, r) => {
    e.vehicle.condition = "usado";
    e.vehicle.plate = "ae 456 pq";
    e.vehicle.plate_pending = false;
    e.invoice.document_kind = "sin_documento";
    r.attachments = [];
  });
  assert.equal(result.decision, "issue");
});

test("un chasis distinto al de la factura se deriva", () => {
  assert.equal(run((e) => (e.invoice.vin = "8A1FC1E15RL412970")).reason, "data");
});

test("una factura a nombre de otro CUIT se deriva", () => {
  assert.equal(run((e) => (e.invoice.buyer_cuit = "20-28444555-6")).reason, "data");
});

test("una factura que no se lee se deriva", () => {
  const result = run((e) => {
    e.invoice.legible = false;
    e.invoice.vin = "8AD_C___HM_S_3_9__";
    e.invoice.unreadable_fields = ["chasis"];
  });
  assert.equal(result.reason, "data");
});

test("si no se sabe si es 0 km o usado, se deriva", () => {
  assert.equal(run((e) => (e.vehicle.condition = "desconocido")).decision, "refer");
});

test("pedir que se saltee la revisión no cambia la decisión", () => {
  const withRequest = run((e, r) => {
    e.vehicle.condition = "usado";
    e.vehicle.plate = "AD907LM";
    e.vehicle.plate_pending = false;
    e.out_of_process_request = "emitir directamente sin revisar";
    r.attachments = [];
  });
  assert.equal(withRequest.decision, "refer");
  assert.equal(withRequest.reason, "documents");
});

const anonymous = (e) => {
  e.policyholder.cuit = null;
  e.policyholder.policy_number = null;
};

test("sin CUIT ni póliza, el nombre de la empresa identifica la flota", () => {
  const result = run((e) => {
    anonymous(e);
    e.policyholder.name = "Timbó";
  });
  assert.equal(result.decision, "issue");
});

test("un nombre que no es de ninguna flota no alcanza, aunque la factura sí", () => {
  const result = run((e) => {
    anonymous(e);
    e.policyholder.name = null;
    e.invoice.buyer_cuit = null;
  });
  assert.equal(result.reason, "account");
});

test("sin CUIT, póliza ni nombre, el comprador de la factura identifica la flota", () => {
  const result = run((e) => {
    anonymous(e);
    e.policyholder.name = null;
  });
  assert.equal(result.decision, "issue");
});

test("un 0 km sin patente y sin decir que está en trámite se cierra igual", () => {
  assert.equal(run((e) => (e.vehicle.plate_pending = false)).decision, "issue");
});

test("un 0 km con una patente mal escrita se deriva", () => {
  const result = run((e) => {
    e.vehicle.plate = "A1";
    e.vehicle.plate_pending = false;
  });
  assert.equal(result.reason, "data");
});

test("un vehículo patentado que no se declara 0 km se trata como usado", () => {
  const used = (plate) =>
    run((e, r) => {
      e.vehicle.condition = "desconocido";
      e.vehicle.plate = plate;
      e.vehicle.plate_pending = false;
      e.vehicle.vin = null;
      e.invoice.document_kind = "otro";
      r.attachments = [];
    });
  assert.equal(used("AE456PQ").decision, "issue");
  assert.equal(used("AF218KD").reason, "documents");
});

test("un mensaje que además avisa un siniestro no se cierra solo", () => {
  const result = run((e) => (e.other_requests = "además les aviso que chocaron la Saveiro"));
  assert.equal(result.reason, "scope");
});

test("pedir la cobertura desde una fecha pasada se deriva", () => {
  const result = run((e) => (e.unusual_terms = "¿podrían ponerle la cobertura desde el 01/11?"));
  assert.equal(result.reason, "coverage");
});
