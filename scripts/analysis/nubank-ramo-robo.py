"""Cálculos propios del caso nubank-seguros-argentina sobre fuentes SSN.

Reproduce cada número con estatus "cálculo propio sobre balances SSN" del caso:
prima emitida del ramo Robo y Riesgos Similares, su participación de mercado,
sus anulaciones, el top de aseguradoras del ramo y las pólizas del anexo
estadístico. El auditor del nodo 5 corre este script y compara la salida contra
la hoja de hechos (regla 2.6 del flujo).

Datos de entrada (no viajan en el repo, ver .gitignore):
  data/nubank-seguros-argentina/balances.csv
    Balances trimestrales de aseguradoras, SSN datos abiertos:
    https://datosabiertos.ssn.gob.ar/dataset/balances
    Corte usado: marzo 2026 (importes acumulados del ejercicio jul-2025 a mar-2026).
  data/nubank-seguros-argentina/ssn_polizas.xlsx
    Anexo estadístico de pólizas del 1º trimestre 2026:
    https://www.argentina.gob.ar/superintendencia-de-seguros/estadisticas/polizas-siniestros-y-primas

Correr desde la raíz del repo:  python3 scripts/analysis/nubank-ramo-robo.py
"""

import csv
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / "data" / "nubank-seguros-argentina"

# Cuentas a nivel subramo del plan contable SSN. El detalle por subramo evita el
# doble conteo con las cuentas agregadas (la falla #7 del registro del flujo).
PRIMAS = "5.01.01.01.01.01.01.00"  # Primas Seguros Directos
ANUL = "4.01.04.04.04.01.01.00"  # Anulaciones de Primas - Seguros Directos
SUBRAMO_ROBO = "1.090.99"  # Robo y Rs. Sim. - Robo y Rs. Sim.


def num(s: str) -> float:
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


def balances() -> None:
    tot = robo = robo_anul = 0.0
    cias: dict[str, float] = {}
    with open(DATA / "balances.csv", encoding="utf-8", errors="replace") as f:
        for row in csv.DictReader(f):
            if not row["subramo_id"]:
                continue
            v = num(row["importe"])
            c = row["cuenta_id"]
            if c == PRIMAS:
                tot += v
                if row["subramo_id"] == SUBRAMO_ROBO:
                    robo += v
                    cias[row["cia_denominacion"]] = cias.get(row["cia_denominacion"], 0) + v
            elif c == ANUL and row["subramo_id"] == SUBRAMO_ROBO:
                robo_anul += v

    print("== Balances SSN (jul-2025 a mar-2026, seguros directos por subramo) ==")
    print(f"Prima emitida total del mercado:  ${tot / 1e12:,.2f} billones")
    print(f"Ramo Robo y Riesgos Similares:    ${robo / 1e9:,.1f} mil M  ({robo / tot * 100:.2f}% del mercado)")
    print(f"Anulaciones del ramo:             ${abs(robo_anul) / 1e9:,.1f} mil M  ({abs(robo_anul) / robo * 100:.1f}% de su prima)")
    top = sorted(cias.items(), key=lambda x: -x[1])[:10]
    top3 = sum(v for _, v in top[:3])
    print(f"Top 3 del ramo:                   {top3 / robo * 100:.1f}% de la prima")
    print("Top 10 del ramo:")
    for cia, v in top:
        print(f"  {cia[:46]:48} ${v / 1e9:7,.1f} mil M  {v / robo * 100:5.1f}%")


def polizas() -> None:
    import openpyxl

    wb = openpyxl.load_workbook(DATA / "ssn_polizas.xlsx", read_only=True)
    ws = wb["Cuadro 1 "]
    print("\n== Anexo estadístico SSN, Cuadro 1 (1º trimestre 2026) ==")
    for row in ws.iter_rows(values_only=True):
        name = str(row[0] or "").strip()
        if name in ("T O T A L E S", "Robo y Riesgos Similares"):
            emitidas, vigentes, part = row[1], row[5], row[6]
            print(f"{name:28} emitidas netas: {emitidas:>10,}  vigentes: {vigentes:>10,}  part. vigentes: {part:.2f}%")


if __name__ == "__main__":
    balances()
    polizas()
