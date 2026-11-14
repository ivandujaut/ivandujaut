/**
 * La cuenta de si conviene hacer el primer paso: lo que ahorra cerrar solo un
 * alta contra lo que cuesta equivocarse, controlarlo, operarlo y construirlo.
 * Es aritmética pura, sin datos: los nueve números los pone quien la usa.
 *
 * El resultado que importa es el umbral: cuántas emisiones equivocadas tolera
 * antes de costar más de lo que ahorra. De ahí sale cuánto hay que probarlo.
 */

export interface WorthInputs {
  /** Altas de vehículo por mes. */
  requests: number;
  /** Parte que hoy ya se cierra sola, de 0 a 100. */
  alreadyAuto: number;
  /** Costo de una gestión asistida, en pesos. */
  assistedCost: number;
  /** Parte de las manuales que pasaría a cerrarse sola, de 0 a 100. */
  autoShare: number;
  /** Emisiones equivocadas cada 1.000 altas cerradas solas. */
  errorPerThousand: number;
  /** Emisiones equivocadas hoy, cada 1.000 altas revisadas a mano. */
  errorTodayPerThousand: number;
  /** Costo de una emisión equivocada, en pesos. */
  errorCost: number;
  /** Costo de construirlo, una sola vez. */
  buildCost: number;
  /** Costo de operarlo por mes. */
  monthlyRunCost: number;
}

export interface WorthResult {
  /** Altas por mes que pasarían a cerrarse solas. */
  auto: number;
  saving: number;
  control: number;
  error: number;
  run: number;
  net: number;
  /** Meses para recuperar la construcción. null si el resultado mensual no es positivo. */
  paybackMonths: number | null;
  /**
   * Emisiones equivocadas cada 1.000 a partir de las cuales pierde plata cada
   * mes. null si ni con el mismo error que hoy alcanza a cubrir sus costos.
   */
  breakEvenPerThousand: number | null;
  /** Altas cerradas solas, sin ningún error, que hacen falta para mostrar que está bajo el umbral. */
  proofSize: number | null;
  /** Meses corriendo en paralelo para juntar esa cantidad. */
  proofMonths: number | null;
}

/**
 * @param auditEvery De las cerradas solas, una de cada cuántas se revisa después.
 *   La revisión se cuenta al costo de una gestión asistida.
 */
export function worth(input: WorthInputs, auditEvery: number): WorthResult {
  const manual = input.requests * (1 - input.alreadyAuto / 100);
  const auto = manual * (input.autoShare / 100);

  const saving = auto * input.assistedCost;
  const control = (auto / auditEvery) * input.assistedCost;
  // Cuenta la diferencia con hoy: las personas también emiten mal alguna vez.
  const extraErrorRate = (input.errorPerThousand - input.errorTodayPerThousand) / 1000;
  const error = auto * extraErrorRate * input.errorCost;
  const run = input.monthlyRunCost;
  const net = saving - control - error - run;

  // Lo que queda para absorber errores, antes de contarlos.
  const margin = saving - control - run;
  const perError = auto * input.errorCost;
  const breakEven =
    perError > 0 && margin > 0 ? input.errorTodayPerThousand + (margin / perError) * 1000 : null;

  // Regla de tres: con cero errores en n casos, el error real queda por debajo
  // de 3/n con 95% de confianza.
  const proofSize = breakEven ? Math.ceil(3 / (breakEven / 1000)) : null;

  return {
    auto,
    saving,
    control,
    error,
    run,
    net,
    paybackMonths: net > 0 ? input.buildCost / net : null,
    breakEvenPerThousand: breakEven,
    proofSize,
    proofMonths: proofSize && auto > 0 ? proofSize / auto : null,
  };
}

/** Techo del error real cuando no se vio ninguno en `cases` casos (95% de confianza). */
export const errorCeiling = (cases: number) => 3 / cases;
