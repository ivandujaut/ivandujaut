"""Cálculos propios del caso primo-cobranza sobre datos abiertos de SRT y SSN.

Produce las dos series que sostienen el caso:

1. Morosidad mensual por ART (cuota pactada vs recaudada, boletines SRT):
   Provincia ART, Omint/Serena ART y el total del sistema, 2024-01 en adelante.
2. Créditos sobre activos (%) trimestral por entidad (indicador C de la SSN),
   con la limpieza que el CSV crudo necesita.

Quirks de las fuentes, aprendidos a mano (no borrar):
- Los boletines de la SRT NO tienen URL estable: se resuelven por POST a un
  buscador (`buscadores/buscador_cyf_boletin_art.php` con art/anio/mes, y
  `buscadores/buscador_ts_mensual_total_sistema.php` para el sistema), que
  devuelve un href relativo. El patrón del href cambió con los años
  ("ART/BOLETIN PROVINCIA - Abril de 2024.pdf" con espacios vs
  "ART/2026/BOLETIN_Serena_Abril_2026.pdf"): por eso siempre se resuelve vía
  buscador y nunca se adivina la URL.
- Serena ART es la ex Omint ART (mismo código de entidad SSN, 862). El boletín
  se pide como OMINT hasta agosto 2025 y como SERENA desde septiembre 2025.
- Cuatro boletines (2024-03 y 2025-03, Provincia y Omint) están publicados pero
  son escaneos sin capa de texto: pypdf extrae vacío y quedan fuera de la serie
  (69 filas de 73 PDFs). Sumarlos exigiría OCR; se prefiere el hueco honesto.
- El CSV de indicadores de la SSN mezcla formatos: punto decimal hasta 2025-Q3,
  coma decimal en 2026-Q1, y una fila corrupta en 2025-Q4 (pesos absolutos en
  la columna de porcentaje). Se limpia y se descarta lo incoherente (>100%).

Correr desde la raíz del repo (deps: pypdf, además de la stdlib):
  python3 scripts/analysis/primo-cobranza.py
"""

import csv
import re
import time
import urllib.parse
import urllib.request
from pathlib import Path

from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[2]
RAW = ROOT / "data" / "primo-cobranza" / "raw"
OUT = ROOT / "data" / "primo-cobranza"
SRT = "https://www.srt.gob.ar/estadisticas/"

MESES = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
]

# Ventana: desde un año antes del piloto fundacional de Primo (mediados 2024)
# hasta el último boletín publicado (abril 2026 al momento de escribir; los
# meses futuros simplemente devuelven "sin resultado" y se saltean).
PERIODOS = [(a, m) for a in (2024, 2025, 2026) for m in range(1, 13)][:28]


def post(url: str, data: dict) -> str:
    req = urllib.request.Request(
        url,
        data=urllib.parse.urlencode(data).encode(),
        headers={"User-Agent": "Mozilla/5.0 (caso de estudio; datos abiertos)"},
    )
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read().decode("utf-8", errors="replace")


def href_boletin(art: str | None, anio: int, mes: str) -> str | None:
    if art is None:
        html = post(SRT + "buscadores/buscador_ts_mensual_total_sistema.php",
                    {"anio": anio, "mes": mes})
    else:
        html = post(SRT + "buscadores/buscador_cyf_boletin_art.php",
                    {"art": art, "anio": anio, "mes": mes})
    m = re.search(r'href="([^"]+\.pdf)"', html)
    if not m or "fonts" in m.group(1):
        return None
    return urllib.parse.urljoin(SRT, urllib.parse.quote(m.group(1), safe="/:%"))


def descargar(url: str, destino: Path) -> Path | None:
    if destino.exists():
        return destino
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=120) as r:
            destino.write_bytes(r.read())
        time.sleep(0.3)  # cortesía con el server público
        return destino
    except Exception as e:  # noqa: BLE001 - se reporta y se sigue
        print(f"    descarga falló ({e}): {url}")
        return None


NUM = r"\$ ?([\d.]+)"


def morosidad_total(pdf: Path) -> tuple[float, float, float] | None:
    """Fila Total del cuadro de cuota pactada/recaudada: (pactada, recaudada, morosidad%)."""
    reader = PdfReader(pdf)
    for pg in reader.pages:
        t = pg.extract_text() or ""
        # Sin filtro previo por encabezados: en el boletín del sistema las
        # palabras "morosidad" y "pactada" viven en imágenes y no llegan al
        # texto extraído. El patrón de la fila Total ya es inequívoco.
        # En los boletines por ART la fila es "Total"; en el del sistema es
        # "Total unidades productivas", y el 100% aparece con y sin decimal.
        m = re.search(
            rf"Total (?:unidades\s*productivas )?{NUM} ?100(?:,0)?% ?{NUM} ?100(?:,0)?% ?(-?\d+,\d)%",
            t.replace("\n", " "),
        )
        if m:
            pact = float(m.group(1).replace(".", ""))
            rec = float(m.group(2).replace(".", ""))
            moro = float(m.group(3).replace(",", "."))
            return pact, rec, moro
    return None


def serie_srt() -> None:
    filas = []
    for anio, mes_n in PERIODOS:
        mes = MESES[mes_n - 1]
        periodo = f"{anio}-{mes_n:02d}"
        # entidad → nombre en el buscador según la época (rebrand Omint→Serena)
        objetivos = {
            "PROVINCIA ART": "PROVINCIA",
            "OMINT/SERENA ART": "SERENA" if (anio, mes_n) >= (2025, 9) else "OMINT",
            "TOTAL SISTEMA": None,
        }
        for entidad, art in objetivos.items():
            url = href_boletin(art, anio, mes)
            if not url:
                print(f"  {periodo} {entidad}: sin boletín (todavía)")
                continue
            nombre = f"srt_{periodo}_{(art or 'SISTEMA').replace(' ', '_')}.pdf"
            pdf = descargar(url, RAW / "srt" / nombre)
            if not pdf:
                continue
            fila = morosidad_total(pdf)
            if not fila:
                print(f"  {periodo} {entidad}: cuadro no parseable")
                continue
            pact, rec, moro = fila
            filas.append({
                "periodo": periodo,
                "entidad": entidad,
                "cuota_pactada": int(pact),
                "cuota_recaudada": int(rec),
                "morosidad_pct": moro,
            })
            print(f"  {periodo} {entidad}: {moro}%")
    salida = OUT / "serie-morosidad-art.csv"
    with open(salida, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(filas[0].keys()))
        w.writeheader()
        w.writerows(filas)
    print(f"→ {salida} ({len(filas)} filas)")


def serie_ssn() -> None:
    """Indicador C (créditos sobre activos, %) limpio para las dos ART y el
    promedio simple de las ART del sistema."""
    crudo = RAW / "indicadores-mercado.csv"
    filas_out = []
    with open(crudo, encoding="utf-8-sig") as f:
        for r in csv.DictReader(f):
            if r["indicador_id"] != "C" or not r["indicador_valor"]:
                continue
            nombre = (r["cia_denominacion_corta"] or "").strip()
            es_art = nombre.upper().endswith("ART")
            if not es_art:
                continue
            v = r["indicador_valor"].strip().replace(",", ".")
            try:
                val = float(v)
            except ValueError:
                continue
            if not 0 <= val <= 100:  # fila corrupta de 2025-Q4 (pesos en la columna %)
                continue
            filas_out.append({
                "trimestre": r["indice_tiempo"],
                "cia_id": r["cia_id"],
                "entidad": nombre,
                "creditos_sobre_activos_pct": val,
            })
    salida = OUT / "serie-creditos-activos.csv"
    with open(salida, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(filas_out[0].keys()))
        w.writeheader()
        w.writerows(filas_out)
    print(f"→ {salida} ({len(filas_out)} filas)")


if __name__ == "__main__":
    (RAW / "srt").mkdir(parents=True, exist_ok=True)
    print("── Serie SRT: morosidad mensual por ART ──")
    serie_srt()
    print("── Serie SSN: créditos sobre activos ──")
    serie_ssn()
