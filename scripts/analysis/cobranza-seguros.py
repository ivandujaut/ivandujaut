"""Análisis del caso cobranza-seguros: anulaciones por ramo y meses de prima atrapados.

Reconstruido el 18/09/2026. El caso se publicó el 29/07/2026, antes de que el flujo
exigiera versionar el código de cada cifra, así que sus dos gráficos quedaron sin
script. Esto lo repara: baja las dos fuentes públicas, recalcula desde cero y
compara contra lo que el artículo ya afirma. Las cifras de control están abajo, en
CONTROLES, y el script falla si alguna deja de dar.

Qué calcula y de dónde sale cada cosa.

1. Anulaciones por ramo (1º trimestre 2026). Fuente: comunicación trimestral
   "Pólizas, Siniestros y Primas" de la SSN, cuadro 1, que publica por ramo las
   pólizas **emitidas netas de anulaciones** y la **cantidad de anulaciones**. La
   tasa es anuladas / (netas + anuladas), o sea sobre emisión bruta, que es la
   única base que no depende de cuántas se anularon. Se listan los ramos
   patrimoniales con más de 30.000 emisiones brutas en el trimestre: abajo de eso
   (Créditos con 56, Aeronavegación con 1.004) el porcentaje describe una
   cartera diminuta y ordena el ranking por ruido.

2. Meses de prima atrapados en cuentas por cobrar (cierre marzo 2026). Fuente:
   balances trimestrales que las aseguradoras presentan a la SSN. Es
   `Premios a Cobrar` (cuenta 1.03.01) dividido por la prima de un mes promedio,
   que sale de `PRIMAS Y RECARGOS` (cuenta 5.01.01) sobre 9, porque el balance de
   marzo acumula 9 meses del ejercicio que arranca en julio. Es el DSO de
   cualquier industria, expresado en meses.

   Sobre las cuentas: `Premios a Cobrar` incluye seguros directos y reaseguros
   activos, y `PRIMAS Y RECARGOS` incluye los ajustes de emisión. Las dos
   decisiones importan: tomar sólo la parte directa mueve a Río Uruguay de 3,5 a
   3,8, y usar primas sin ajustes mueve a Nación de 2,9 a 3,3.

Lo que este script NO reproduce, y conviene saberlo antes de confiar en él: los
porcentajes de anulaciones **en pesos** que el cuerpo del artículo cita (10,6% de
mediana, 8,9% contando ART y retiro) salen de la misma fuente pero dependen de qué
diez compañías se excluyen, y esa lista no quedó registrada en ningún lado. Con la
regla obvia (excluir ART y retiro por nombre) se excluyen ocho y da 10,3%. Se deja
afuera a propósito en vez de publicar un cálculo que discute con el artículo por
tres décimas.

Salidas, en data/cobranza-seguros/ (ignorado por git, re-descargable con esto):
  anulaciones_por_ramo.csv   una fila por ramo patrimonial
  meses_atrapados.csv        una fila por compañía del top 50, más las dos destacadas
  crudo/                     los dos archivos de origen, tal cual los sirve el Estado

Correr desde la raíz del repo:
  python3 scripts/analysis/cobranza-seguros.py
"""

import csv
import statistics
import sys
import unicodedata
import urllib.request
from collections import defaultdict
from pathlib import Path

import openpyxl

RAIZ = Path(__file__).resolve().parents[2]
OUT = RAIZ / "data" / "cobranza-seguros"
CRUDO = OUT / "crudo"

# Balances del 1º trimestre 2026 (cierre marzo). El id del recurso sale del
# paquete `balances` de datosabiertos.ssn.gob.ar; se fija acá para que el script
# no dependa de que el orden del catálogo no cambie.
URL_BALANCES = (
    "https://datosabiertos.ssn.gob.ar/dataset/"
    "1ecd32c6-ea38-486f-8502-b9b55ae680eb/resource/"
    "f6f7f829-333d-455e-8eec-dbda21b3d608/download/balances-202601.csv"
)
# Comunicación trimestral de pólizas. El nombre del archivo es la fecha de cierre.
URL_POLIZAS = "https://www.argentina.gob.ar/sites/default/files/ssn_202603_polizas_siniestros.xlsx"

# Cuentas del plan de la SSN. Ver el docstring por qué estas y no sus hijas.
PREMIOS_A_COBRAR = "1.03.01.00.00.00.00.00"
PRIMAS_Y_RECARGOS = "5.01.01.00.00.00.00.00"

MESES_DEL_EJERCICIO = 9
EMISIONES_MINIMAS = 30_000
TOP = 50

# Las dos de cobranza directa que el gráfico resalta: una cobra por débito
# automático y la otra por nómina. No están en el top 10 de meses atrapados;
# están para mostrar el piso del gradiente por canal.
DESTACADAS = {
    "CAJA DE SEGUROS S.A.": "La Caja",
    "PROVINCIA ASEGURADORA DE RIESGOS DEL TRABAJO S.A.": "Provincia ART",
}

# Nombres cortos para el gráfico. El balance usa la razón social completa, que en
# un eje no entra ni se lee.
NOMBRES_CORTOS = {
    "ASSURANT ARGENTINA COMPAÑÍA DE SEGUROS SOCIEDAD ANONIMA": "Assurant",
    "LA SEGUNDA COOPERATIVA LIMITADA DE SEGUROS GENERALES": "La Segunda (coop.)",
    "COOPERACION MUTUAL PATRONAL SOCIEDAD MUTUAL DE SEGUROS GENERALES": "Cooperación Mutual (coop.)",
    "ALLIANZ ARGENTINA COMPAÑIA DE SEGUROS S.A.": "Allianz",
    "RÍO URUGUAY COOPERATIVA DE SEGUROS LIMITADA": "Río Uruguay (coop.)",
    "SMG COMPAÑÍA ARGENTINA DE SEGUROS SAU": "SMG Seguros",
    "SEGUROS GALICIA S.A.": "Seguros Galicia",
    "PROVINCIA SEGUROS SOCIEDAD ANONIMA": "Provincia Seguros",
    "MAPFRE ARGENTINA SEGUROS S.A.": "Mapfre",
    "NACIÓN SEGUROS S.A.": "Nación Seguros",
}


def normalizar(nombre: str) -> str:
    """Razón social comparable.

    La SSN no es consistente escribiéndolas: la misma compañía aparece con tilde
    y sin tilde ("SOCIEDAD ANÓNIMA" y "SOCIEDAD ANONIMA") y alguna en minúsculas
    ("Experta Aseguradora de Riesgos del Trabajo SA"). Buscar por el texto tal
    cual falla en silencio, que es la peor forma de fallar: la compañía no
    aparece en el gráfico y nada avisa.
    """
    descompuesto = unicodedata.normalize("NFKD", nombre)
    sin_tildes = "".join(c for c in descompuesto if not unicodedata.combining(c))
    return " ".join(sin_tildes.upper().split())


DESTACADAS_NORM = {normalizar(k): v for k, v in DESTACADAS.items()}
NOMBRES_CORTOS_NORM = {normalizar(k): v for k, v in NOMBRES_CORTOS.items()}

# Cifras que el artículo ya publicó. Si el Estado corrige una declaración jurada
# o cambia una cuenta, esto avisa en vez de dejar que el gráfico se mueva solo.
CONTROLES = {
    "tasa total de anulaciones (%)": 18.9,
    "mediana de meses del top 50": 2.0,
    "Caución (%)": 43.3,
    "Motovehículos (%)": 25.6,
    "Assurant (meses)": 4.6,
    "La Caja (meses)": 0.9,
    "Provincia ART (meses)": 0.3,
}


def bajar(url: str, destino: Path) -> Path:
    """Descarga una vez y reusa. Los dos archivos pesan 41 MB y 395 KB."""
    if destino.exists():
        print(f"    ya estaba: {destino.name}")
        return destino
    destino.parent.mkdir(parents=True, exist_ok=True)
    print(f"    bajando:   {destino.name}")
    req = urllib.request.Request(url, headers={"User-Agent": "ivandujaut.com/analisis"})
    with urllib.request.urlopen(req, timeout=180) as r, destino.open("wb") as f:
        f.write(r.read())
    return destino


def importe(valor: str) -> float:
    """El balance viene con punto de miles y coma decimal."""
    valor = (valor or "").strip()
    if not valor:
        return 0.0
    try:
        return float(valor.replace(".", "").replace(",", "."))
    except ValueError:
        return 0.0


def anulaciones_por_ramo(xlsx: Path) -> list[dict]:
    libro = openpyxl.load_workbook(xlsx, read_only=True, data_only=True)
    hoja = libro["Cuadro 1 "]

    ramos, total = [], None
    for fila in hoja.iter_rows(min_row=10, values_only=True):
        ramo, netas, anuladas = fila[0], fila[1], fila[8]
        if not isinstance(ramo, str):
            continue
        if not isinstance(netas, (int, float)) or not isinstance(anuladas, (int, float)):
            continue
        brutas = netas + anuladas
        registro = {
            "ramo": ramo.strip(),
            "emitidas_netas": int(netas),
            "anuladas": int(anuladas),
            "emitidas_brutas": int(brutas),
            # Sin redondear: redondear acá y de nuevo al comparar contra el
            # artículo convierte 0,8515 en 0,8 y hace fallar un control que
            # está bien. Se redondea sólo al escribir y al dibujar.
            "tasa_anulacion_pct": anuladas / brutas * 100,
        }
        # La fila de totales del cuadro se llama "T O T A L E S", con espacios.
        if registro["ramo"].replace(" ", "").upper() == "TOTALES":
            total = registro
        else:
            ramos.append(registro)

    if total is None:
        sys.exit("No apareció la fila de totales del cuadro 1: cambió el formato del archivo.")

    grandes = [r for r in ramos if r["emitidas_brutas"] > EMISIONES_MINIMAS]
    grandes.sort(key=lambda r: -r["tasa_anulacion_pct"])
    return grandes, total


def meses_atrapados(balances: Path) -> tuple[list[dict], float]:
    acumulado: dict[str, dict[str, float]] = defaultdict(lambda: defaultdict(float))
    nombres: dict[str, str] = {}

    with balances.open(encoding="utf-8") as f:
        for fila in csv.DictReader(f):
            cuenta = fila["cuenta_id"]
            if cuenta not in (PREMIOS_A_COBRAR, PRIMAS_Y_RECARGOS):
                continue
            cia = fila["cia_id"]
            nombres[cia] = fila["cia_denominacion"].strip()
            acumulado[cia][cuenta] += importe(fila["importe"])

    companias = []
    for cia, cuentas in acumulado.items():
        primas = cuentas[PRIMAS_Y_RECARGOS]
        # Sin primas en el período no hay denominador: son compañías en
        # liquidación o sin actividad, no casos de cobranza perfecta.
        if primas <= 0:
            continue
        companias.append(
            {
                "compania": nombres[cia],
                "primas_y_recargos": primas,
                "premios_a_cobrar": cuentas[PREMIOS_A_COBRAR],
                "meses_atrapados": cuentas[PREMIOS_A_COBRAR] / (primas / MESES_DEL_EJERCICIO),
            }
        )

    companias.sort(key=lambda c: -c["primas_y_recargos"])
    top = companias[:TOP]
    mediana = statistics.median(c["meses_atrapados"] for c in top)

    for c in top:
        c["en_top_50"] = True
    seleccion = sorted(top, key=lambda c: -c["meses_atrapados"])[:10]
    for c in companias:
        if normalizar(c["compania"]) in DESTACADAS_NORM and c not in seleccion:
            c["en_top_50"] = c.get("en_top_50", False)
            seleccion.append(c)

    for c in seleccion:
        clave = normalizar(c["compania"])
        c["etiqueta"] = DESTACADAS_NORM.get(clave) or NOMBRES_CORTOS_NORM.get(
            clave, c["compania"].title()
        )
        c["cobranza_directa"] = clave in DESTACADAS_NORM

    return seleccion, mediana


def escribir(destino: Path, filas: list[dict]) -> None:
    destino.parent.mkdir(parents=True, exist_ok=True)
    # Cuatro decimales y no dos: el gráfico vuelve a redondear a uno, y con dos
    # decimales guardados 3,9463 sale 3,95 y termina dibujado como 4,0. Un CSV
    # es un paso intermedio, no una cifra para leer.
    redondeadas = [
        {k: (round(v, 4) if isinstance(v, float) else v) for k, v in fila.items()} for fila in filas
    ]
    with destino.open("w", newline="", encoding="utf-8") as f:
        escritor = csv.DictWriter(f, fieldnames=list(redondeadas[0].keys()))
        escritor.writeheader()
        escritor.writerows(redondeadas)
    print(f"    {destino.relative_to(RAIZ)}  ({len(filas)} filas)")


def verificar(calculado: dict[str, float]) -> None:
    print("\n  Control contra lo que el artículo ya publicó:")
    fallas = []
    for etiqueta, esperado in CONTROLES.items():
        obtenido = round(calculado[etiqueta], 1)
        ok = abs(obtenido - esperado) < 0.05
        print(f"    {'ok ' if ok else 'NO '} {etiqueta:32} {obtenido:6.1f}  esperado {esperado}")
        if not ok:
            fallas.append(etiqueta)
    if fallas:
        sys.exit(
            "\n  La fuente ya no devuelve lo que el caso afirma: " + ", ".join(fallas) + ".\n"
            "  Antes de tocar el gráfico hay que entender qué cambió: si el Estado corrigió una\n"
            "  declaración jurada, lo que se corrige es el artículo, no el control."
        )


def main() -> None:
    print("  Fuentes:")
    balances = bajar(URL_BALANCES, CRUDO / "balances-202601.csv")
    polizas = bajar(URL_POLIZAS, CRUDO / "ssn_202603_polizas_siniestros.xlsx")

    print("\n  Cálculo:")
    ramos, total = anulaciones_por_ramo(polizas)
    companias, mediana = meses_atrapados(balances)

    por_ramo = {r["ramo"]: r["tasa_anulacion_pct"] for r in ramos}
    por_compania = {c["etiqueta"]: c["meses_atrapados"] for c in companias}
    verificar(
        {
            "tasa total de anulaciones (%)": total["tasa_anulacion_pct"],
            "mediana de meses del top 50": mediana,
            "Caución (%)": por_ramo["Caución"],
            "Motovehículos (%)": por_ramo["Motovehículos"],
            "Assurant (meses)": por_compania["Assurant"],
            "La Caja (meses)": por_compania["La Caja"],
            "Provincia ART (meses)": por_compania["Provincia ART"],
        }
    )

    print("\n  Salidas:")
    escribir(OUT / "anulaciones_por_ramo.csv", ramos + [total | {"ramo": "TOTAL MERCADO"}])
    escribir(
        OUT / "meses_atrapados.csv",
        [
            {
                "etiqueta": c["etiqueta"],
                "compania": c["compania"],
                "meses_atrapados": c["meses_atrapados"],
                "cobranza_directa": int(c["cobranza_directa"]),
                "mediana_top_50": mediana,
            }
            for c in sorted(companias, key=lambda c: -c["meses_atrapados"])
        ],
    )


if __name__ == "__main__":
    main()
