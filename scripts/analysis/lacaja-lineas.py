"""Qué deja cada línea de La Caja, según su propio balance en la SSN.

Qué mide y por qué. La pieza de La Caja (`app/pitch/lacaja`) propone cruzar,
por producto, lo que deja cada cuenta contra lo que cuesta atenderla, y
preguntarse por las líneas con mucho trabajo y poca prima. Desde afuera no hay
costo por trámite, pero sí hay algo que nadie más que La Caja escribió: el
balance trimestral que presenta a la SSN abre por subramo las primas, los
siniestros, los gastos de producción y los gastos de explotación (sueldos,
sistemas, alquileres). Con eso sale el resultado técnico de cada línea tal como
la compañía lo informa.

Método. Para cada subramo se suman las cuentas técnicas del plan de la SSN:
ingresos (5.01) menos egresos (4.01) da el resultado técnico; las primas son
las de seguros directos netas de anulaciones; los gastos de explotación son el
rubro 4.01.07 y los de producción el 4.01.06. Todo se expresa sobre primas
emitidas netas de anulaciones, el mismo denominador que usa la SSN en sus
indicadores de gastos. Se calcula lo mismo para el mercado entero y para La
Caja un año antes.

La suma de las líneas tiene que dar el total de la compañía; el script lo
verifica y se niega a escribir si no cierra.

Límites, que van a la página.
- El resultado técnico no incluye lo que rinden las inversiones.
- Cómo reparte La Caja sus gastos de estructura entre líneas es un criterio de
  la compañía que el balance no explica. Un gasto asignado no desaparece por
  cerrar la línea.
- Son nueve meses acumulados, en la moneda del balance.
- Una línea chica se mueve mucho con un solo siniestro.
- La Caja imputa todo automotores a un solo subramo, así que automotores y
  motovehículos se comparan a nivel de ramo.

Fuentes (SSN, datos abiertos, dataset "balances"):
  data/seguro-hogar-argentina/balances.csv
      corte 31/03/2026, acumulado julio 2025 a marzo 2026
  data/lacaja/research/raw/03-ssn/balances-20250101.csv
      corte 31/03/2025, acumulado julio 2024 a marzo 2025

Salidas:
  data/lacaja/lineas/lineas.csv              (una fila por línea)
  app/pitch/lacaja/lineas/lines.json         (lo que muestra la página)

Correr desde la raíz del repo:
  python3 scripts/analysis/lacaja-lineas.py
"""

import csv
import json
from collections import defaultdict
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
BAL_ACTUAL = RAIZ / "data" / "seguro-hogar-argentina" / "balances.csv"
BAL_ANTERIOR = RAIZ / "data" / "lacaja" / "research" / "raw" / "03-ssn" / "balances-20250101.csv"
OUT_CSV = RAIZ / "data" / "lacaja" / "lineas" / "lineas.csv"
OUT_JSON = RAIZ / "app" / "pitch" / "lacaja" / "lineas" / "lines.json"

LA_CAJA = "501"
# Líneas con menos prima que esto en los nueve meses quedan fuera de la tabla.
PISO_PRIMAS = 1e9

# Cada línea de la tabla: los subramos que la componen, su nombre y si es de las
# que pasan por el Portal Empresas. Automotores y motos van por ramo entero.
LINEAS = [
    ("automotores", "Automotores", ["1.030."], True),
    ("vida-colectivo", "Vida colectivo", ["2.030.02"], True),
    ("otros-patrimoniales", "Otros riesgos patrimoniales", ["1.170."], False),
    ("hogar", "Combinado familiar (hogar)", ["1.020.01"], False),
    ("motos", "Motovehículos", ["1.180."], False),
    ("saldo-deudor", "Vida saldo deudor", ["2.030.05"], False),
    ("incendio", "Incendio", ["1.010."], False),
    ("tecnico", "Técnico", ["1.160."], False),
    ("ap-individual", "Accidentes personales individual", ["2.010.01"], False),
    ("rc", "Responsabilidad civil", ["1.080."], False),
    ("ap-colectivo", "Accidentes personales colectivo", ["2.010.02"], True),
    ("sepelio-colectivo", "Sepelio colectivo", ["2.050.02"], True),
    ("cascos", "Embarcaciones", ["1.140."], False),
    ("mercaderias", "Transporte de mercaderías", ["1.150."], False),
    ("integral-comercio", "Integral de comercio", ["1.020.02"], True),
    ("salud", "Salud", ["2.020."], False),
    ("robo", "Robo", ["1.090."], False),
    ("aeronavegacion", "Aeronavegación", ["1.130."], False),
    ("vida-obligatorios", "Vida obligatorios", ["2.030.04"], False),
    ("caucion", "Caución", ["1.100."], False),
    ("vida-individual", "Vida individual", ["2.030.01"], False),
    ("sepelio-individual", "Sepelio individual", ["2.050.01"], False),
]


def num(s: str) -> float:
    """Importe del CSV de la SSN: miles con punto, decimales con coma."""
    s = (s or "").strip()
    if s in ("", "-"):
        return 0.0
    neg = s.startswith("(") or s.startswith("-")
    s = s.strip("()-").replace(".", "").replace(",", ".")
    try:
        v = float(s)
    except ValueError:
        return 0.0
    return -v if neg else v


def leer(path: Path):
    """Devuelve ({quién: {subramo: medidas}}, totales de La Caja sin abrir por subramo).

    `quién` es "mercado" (todas las compañías, La Caja incluida) o un `cia_id`.
    """
    por = defaultdict(lambda: defaultdict(lambda: defaultdict(float)))
    totales = {}
    with path.open(newline="") as f:
        for row in csv.DictReader(f):
            cuenta = row["cuenta_id"]
            if cuenta[:4] not in ("4.01", "5.01"):
                continue
            valor = num(row["importe"])
            if not row["subramo_id"]:
                if row["cia_id"] == LA_CAJA:
                    totales[cuenta] = valor
                continue
            for quien in ("mercado", row["cia_id"]):
                d = por[quien][row["subramo_id"]]
                if cuenta.startswith("5.01.01.01.01.01"):
                    d["primas"] += valor
                if cuenta.startswith("4.01.04.04.04.01"):
                    d["primas"] -= valor
                if cuenta.startswith("4.01.07"):
                    d["explotacion"] += valor
                if cuenta.startswith("4.01.06"):
                    d["produccion"] += valor
                d["tecnico"] += valor if cuenta.startswith("5.01") else -valor
    return por, totales


def linea(por_subramo, prefijos):
    """Suma las medidas de los subramos que empiezan con alguno de los prefijos."""
    out = defaultdict(float)
    for subramo, d in por_subramo.items():
        if any(subramo.startswith(p) for p in prefijos):
            for k, v in d.items():
                out[k] += v
    return out


def pct(parte, total):
    return round(parte / total * 100, 1) if total else None


def main():
    actual, totales = leer(BAL_ACTUAL)
    anterior, _ = leer(BAL_ANTERIOR)
    caja, mercado, caja_antes = actual[LA_CAJA], actual["mercado"], anterior[LA_CAJA]

    # Autocontrol: las líneas tienen que sumar lo que informa la compañía.
    tecnico_cia = totales["5.01.00.00.00.00.00.00"] - totales["4.01.00.00.00.00.00.00"]
    explot_cia = totales["4.01.07.00.00.00.00.00"]
    tecnico_suma = sum(d["tecnico"] for d in caja.values())
    explot_suma = sum(d["explotacion"] for d in caja.values())
    primas_cia = sum(d["primas"] for d in caja.values())
    print(f"técnico compañía {tecnico_cia / 1e9:,.2f} mil M | suma de subramos {tecnico_suma / 1e9:,.2f}")
    print(f"explotación compañía {explot_cia / 1e9:,.2f} mil M | suma de subramos {explot_suma / 1e9:,.2f}")
    assert abs(tecnico_cia - tecnico_suma) < 0.001 * abs(tecnico_cia), "el técnico por línea no cierra"
    assert abs(explot_cia - explot_suma) < 0.001 * explot_cia, "la explotación por línea no cierra"

    usados = set()
    filas, omitidas = [], []
    for slug, nombre, prefijos, portal in LINEAS:
        c, m, a = linea(caja, prefijos), linea(mercado, prefijos), linea(caja_antes, prefijos)
        usados |= {s for s in caja if any(s.startswith(p) for p in prefijos)}
        fila = {
            "id": slug,
            "label": nombre,
            "portal": portal,
            "premiums": round(c["primas"] / 1e9, 2),
            "share": pct(c["primas"], primas_cia),
            "operating": pct(c["explotacion"], c["primas"]),
            "acquisition": pct(c["produccion"], c["primas"]),
            "technical": pct(c["tecnico"], c["primas"]),
            "technicalAmount": round(c["tecnico"] / 1e9, 2),
            "market": {
                "operating": pct(m["explotacion"], m["primas"]),
                "technical": pct(m["tecnico"], m["primas"]),
            },
            "previous": {
                "operating": pct(a["explotacion"], a["primas"]),
                "technical": pct(a["tecnico"], a["primas"]),
            },
        }
        (filas if c["primas"] >= PISO_PRIMAS else omitidas).append(fila)

    sin_clasificar = {s: d["primas"] for s, d in caja.items() if s not in usados and abs(d["primas"]) > 1e7}
    assert not sin_clasificar, f"subramos de La Caja sin línea: {sin_clasificar}"

    filas.sort(key=lambda f: -f["premiums"])
    mostrado = sum(f["premiums"] for f in filas)
    print(f"primas netas de La Caja {primas_cia / 1e9:,.2f} mil M | en la tabla {mostrado:,.2f}")
    print(f"\n{'línea':34} {'primas':>8} {'%':>6} {'expl':>6} {'téc':>7} {'$téc':>8} | {'merc expl':>9} {'téc':>6} | {'antes téc':>9}")
    for f in filas:
        print(
            f"{f['label'][:34]:34} {f['premiums']:8.2f} {f['share']:6.1f} {f['operating']:6.1f} {f['technical']:7.1f} "
            f"{f['technicalAmount']:8.2f} | {f['market']['operating']:9.1f} {f['market']['technical']:6.1f} | {f['previous']['technical']:9.1f}"
        )
    print("\nfuera de la tabla:", ", ".join(f"{f['label']} ({f['premiums']} mil M)" for f in omitidas))

    OUT_CSV.parent.mkdir(parents=True, exist_ok=True)
    with OUT_CSV.open("w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["linea", "portal", "primas_mil_M", "pct_produccion", "explotacion_pct", "produccion_pct",
                    "tecnico_pct", "tecnico_mil_M", "mercado_explotacion_pct", "mercado_tecnico_pct",
                    "anterior_explotacion_pct", "anterior_tecnico_pct"])
        for fila in filas + omitidas:
            w.writerow([fila["label"], fila["portal"], fila["premiums"], fila["share"], fila["operating"],
                        fila["acquisition"], fila["technical"], fila["technicalAmount"], fila["market"]["operating"],
                        fila["market"]["technical"], fila["previous"]["operating"], fila["previous"]["technical"]])

    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    salida = {
        "meta": {
            "cutoff": "2026-03-31",
            "period": "julio de 2025 a marzo de 2026",
            "previousPeriod": "julio de 2024 a marzo de 2025",
            "premiums": round(primas_cia / 1e9, 1),
            "technicalAmount": round(tecnico_cia / 1e9, 1),
            "operating": pct(explot_cia, primas_cia),
            "floor": PISO_PRIMAS / 1e9,
        },
        "lines": filas,
        "omitted": [f["label"] for f in omitidas],
    }
    OUT_JSON.write_text(json.dumps(salida, ensure_ascii=False, indent=2) + "\n")
    print(f"\nEscrito: {OUT_CSV.relative_to(RAIZ)} y {OUT_JSON.relative_to(RAIZ)}")


if __name__ == "__main__":
    main()
