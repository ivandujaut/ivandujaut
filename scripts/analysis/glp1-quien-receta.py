"""Envoltorio del análisis del caso glp1-quien-receta.

La convención del portfolio es que cada caso tenga su script de análisis acá.
Este caso es la excepción declarada, igual que su antecesor `glp1-open-payments`:
el análisis pesado vive en el repo público `~/Interview/openpayments-glp1`, que
tiene los datasets (varios GB), el entorno con DuckDB y su propia cadena de
verificación. Duplicar eso en el repo del sitio no lo haría más auditable: lo
haría más frágil.

Lo que hace este archivo, entonces, es lo único que corresponde de este lado:
correr la cadena en orden, y copiar los agregados chicos (los JSON de
`findings/cache/`) al lado de la hoja de hechos, para que el auditor del nodo 5
pueda leerlos sin salir de `data/glp1-quien-receta/`.

No calcula nada propio. Si un número de la hoja no sale de uno de estos JSON, no
sale de acá.

Uso:
    python3 scripts/analysis/glp1-quien-receta.py            # cadena entera
    python3 scripts/analysis/glp1-quien-receta.py --solo-copiar
"""

import argparse
import shutil
import subprocess
import sys
from pathlib import Path

REPO_ANALISIS = Path.home() / "Interview" / "openpayments-glp1"
DESTINO = Path(__file__).resolve().parents[2] / "data" / "glp1-quien-receta" / "cache"

# En orden: cada paso depende de los anteriores.
PASOS = [
    ("analysis/part_d/02_npi_cobertura.py", "¿existe la llave del cruce?"),
    ("analysis/part_d/03_extraer_glp1.py", "recorte GLP-1 de Part D, por año"),
    ("analysis/part_d/04_solapamiento_mercado.py", "¿mismo mercado los dos lados?"),
    ("analysis/part_d/05_cruce_pago_receta.py", "el cruce por NPI"),
    ("analysis/part_d/06_check_censura.py", "cuánto esconde la supresión"),
    ("analysis/part_d/07_verificar_api_vs_csv.py", "el recorte contra el CSV completo"),
    ("analysis/part_d/08_ultimo_decil.py", "adentro del último decil, y voz vs campo"),
    ("analysis/part_d/09_proporcion_practica.py", "el GLP-1 como parte de la práctica"),
    ("analysis/part_d/10_especialidad_concordancia.py", "¿hace falta NPPES?"),
    ("analysis/part_d/11_share_por_especialidad.py", "¿la puerta es el pago o la especialidad?"),
    ("analysis/part_d/12_censura_imputada.py", "la condición de muerte: censura imputada"),
    ("analysis/part_d/13_trulicity_reasignados.py", "¿los de Trulicity cobran por otra marca?"),
    ("analysis/part_d/14_naturalezas.py", "de qué está hecho cada tipo de pago"),
]

CACHES = [
    "part_d-01_npi_cobertura.json",
    "part_d-02_extraccion.json",
    "part_d-03_solapamiento.json",
    "part_d-04_cruce.json",
    "part_d-05_censura.json",
    "part_d-06_verificacion.json",
    "part_d-07_ultimo_decil.json",
    "part_d-08_proporcion.json",
    "part_d-09_especialidad.json",
    "part_d-10_share_especialidad.json",
    "part_d-11_censura_imputada.json",
    "part_d-12_trulicity.json",
    "part_d-13_naturalezas.json",
]


def correr() -> int:
    for script, para_que in PASOS:
        print(f"\n=== {script} · {para_que} ===", flush=True)
        r = subprocess.run(
            ["uv", "run", script], cwd=REPO_ANALISIS, text=True
        )
        if r.returncode != 0:
            print(f"FALLÓ {script} (código {r.returncode}). Se corta.", file=sys.stderr)
            return r.returncode
    return 0


def copiar() -> int:
    origen = REPO_ANALISIS / "findings" / "cache"
    DESTINO.mkdir(parents=True, exist_ok=True)
    faltan = []
    for nombre in CACHES:
        src = origen / nombre
        if not src.exists():
            faltan.append(nombre)
            continue
        shutil.copy2(src, DESTINO / nombre)
        print(f"copiado {nombre}")
    if faltan:
        print(
            "\nNo estaban (el paso que los produce todavía no corrió): "
            + ", ".join(faltan),
            file=sys.stderr,
        )
    return 0


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument(
        "--solo-copiar",
        action="store_true",
        help="no re-corre nada; sólo trae los cache ya calculados",
    )
    args = ap.parse_args()
    if not REPO_ANALISIS.exists():
        print(f"No existe {REPO_ANALISIS}. El análisis vive ahí.", file=sys.stderr)
        return 1
    if not args.solo_copiar and (codigo := correr()):
        return codigo
    return copiar()


if __name__ == "__main__":
    raise SystemExit(main())
