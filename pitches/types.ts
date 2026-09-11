/**
 * Contrato de una pieza privada por empresa (`/pitch/<slug>`).
 *
 * Regla: todo lo que se ve en pantalla sale de acá: copy, cifras y fuentes.
 * Los componentes de `app/pitch/_template` no tienen texto propio. Ningún
 * número aparece en la UI si no está en el archivo de la empresa con su
 * `source`; lo inventado para la maqueta se marca `illustrative`.
 */

export type Sourced<T> = { value: T; source: string; note?: string };

/** Ilustración de la portada; el hilo nace de ella. Ver `_template/illustrations`. */
export type IllustrationKey = "obra" | "datos";
/** Figuras que el hilo dibuja entre secciones. Ver `_template/landmarks`. */
export type LandmarkSetKey = "obra" | "datos";

export interface Milestone {
  date: string;
  label: string;
  /** Cifra tal como se muestra al final de la animación. */
  metric?: string;
  /** `prefix + count + suffix` tiene que reconstruir `metric` exactamente. */
  count?: { value: number; prefix?: string; suffix?: string };
  source: string;
}

export interface Module {
  id: string;
  label: string;
  oneLiner: string;
}

export interface ThesisSentence {
  key: string;
  text: string;
  /** Palabra de `text` que va en itálica y color de acento. */
  keyword: string;
  /** Lo que dice el piso del edificio debajo de la frase. */
  floor: string;
}

export interface CaseStep {
  id: string;
  eyebrow: string;
  text: string;
}

export interface Indicator {
  id: string;
  label: string;
  value: string;
  score: number;
  hint?: string;
}

export interface Proof {
  id: string;
  title: string;
  /** Cifra grande, en un renglón. */
  number: string;
  line: string;
  proves: string;
  href: string;
  hrefLabel: string;
  /** Frase secundaria con un link adentro, en gris. */
  note?: { before: string; linkText: string; href: string; after: string };
  source: string;
}

export interface Pitch {
  slug: string;
  company: string;
  meta: { title: string; description: string };
  illustration: IllustrationKey;
  landmarks: LandmarkSetKey;
  author: {
    name: string;
    linkedin: string;
    /** Mail ofuscado como en el resto del sitio: usuario y dominio al revés. */
    emailUserReversed: string;
    emailDomainReversed: string;
  };
  hero: {
    /** Primera frase, en blanco. */
    title: string;
    /** Segunda frase, en itálica y acento. */
    titleAccent: string;
    readingCue: string;
  };
  timeline: { eyebrow: string; heading: string; milestones: Milestone[] };
  productMap: {
    eyebrow: string;
    heading: string;
    modules: Module[];
    source: string;
    /** Capa que envuelve todos los módulos (un asistente, una IA). */
    layer?: { name: string; formerName?: string; oneLiner: string; source: string };
    /** Qué pasa cuando el último módulo cierra el círculo. */
    closingNote: string;
  };
  thesis: {
    eyebrow: string;
    sentences: ThesisSentence[];
    comparables: string;
    source?: string;
  };
  why: {
    eyebrow: string;
    heading: string;
    /** Tres pasos del relato; el activo se lee, los otros esperan. */
    steps: string[];
    left: { title: string; items: string[]; source: string };
    right: { title: string; items: string[]; source: string };
    /** Etiqueta a la derecha de cada fila del lado derecho. */
    rightTag: string;
  };
  case: {
    eyebrow: string;
    heading: string;
    steps: CaseStep[];
    card: {
      illustrative: true;
      kicker: string;
      projectName: string;
      badge: string;
      totalScore: number;
      totalLabel: string;
      totalNote: string;
      indicators: Indicator[];
      cta: { open: string; close: string };
      advance: {
        /**
         * Cómo se muestran los dos montos: pesos (el adelanto de Lebane) o
         * un conteo a secas (registros, pacientes). Default: pesos.
         */
        format?: "ars" | "count";
        scheduledLabel: string;
        scheduledAmount: number;
        availableLabel: string;
        maxAdvancePct: number;
        maxAdvance: number;
        eligibility: string;
        repayment: string;
      };
    };
    measure: { title: string; items: string[] };
    notToBuild: { title: string; items: string[] };
  };
  proofs: { eyebrow: string; heading: string; items: Proof[] };
  close: {
    heading: string;
    body: string;
    emailLabel: string;
    siteLabel: string;
    siteHref: string;
    sourcesLine: string;
    /** `{n}` se reemplaza por la cantidad de fuentes. */
    sourcesToggle: string;
    footnote: string;
  };
  /**
   * Datos de la empresa que no se renderizan pero respaldan el copy (ronda,
   * equipo, estrategia). Cada uno con su `source`; entran al pie de fuentes.
   */
  facts?: Record<string, unknown>;
}

/** Recorre el pitch y junta toda `source` externa, sin repetir. */
export function collectSources(pitch: Pitch): string[] {
  const urls = new Set<string>();
  const walk = (value: unknown) => {
    if (!value || typeof value !== "object") return;
    if (Array.isArray(value)) {
      value.forEach(walk);
      return;
    }
    for (const [key, v] of Object.entries(value as Record<string, unknown>)) {
      if (key === "source" && typeof v === "string" && v.startsWith("http")) urls.add(v);
      else walk(v);
    }
  };
  walk(pitch);
  return [...urls];
}
