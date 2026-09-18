"""Los dos gráficos del caso cobranza-seguros.

Regenerable = auditable: lee los CSV que produce
`scripts/analysis/cobranza-seguros.py` sobre las dos fuentes públicas (la
comunicación trimestral de pólizas de la SSN y los balances que las aseguradoras
le presentan). Ninguna cifra está escrita a mano acá.

Los dos son barras horizontales ordenadas y con una línea de referencia, y es a
propósito: las dos preguntas del caso son "quién está peor que el promedio" y
"cuánto peor", y en un ranking con nombres largos las barras horizontales son lo
único que deja leer las etiquetas sin rotarlas.

La línea de referencia cambia de color según qué sea. En anulaciones es el total
del mercado y va naranja, porque es la cifra que el título usa. En meses
atrapados es la mediana del top 50 y va gris, porque ahí lo que el caso subraya
son las dos barras naranjas de abajo: las dos compañías que cobran sin
intermediario.

Estilo compartido con los charts de canal, nubank y portal: fondo claro, título
bold a la izquierda, ejes grises, atribución abajo.

Correr desde la raíz del repo (después del script de análisis):
  python3 scripts/charts/cobranza-seguros.py
"""

import csv
import sys
from decimal import ROUND_HALF_UP, Decimal
from pathlib import Path

import matplotlib.pyplot as plt

FG = "#111111"
GRAY = "#8a8a8a"
BG = "#f8f9fa"
BLUE = "#2f74dd"
ORANGE = "#e2601a"

plt.rcParams.update(
    {
        "font.family": "DejaVu Sans",
        "text.color": FG,
        "axes.edgecolor": GRAY,
        "axes.labelcolor": GRAY,
        "xtick.color": GRAY,
        "ytick.color": GRAY,
        "figure.facecolor": BG,
        "axes.facecolor": BG,
        "svg.fonttype": "none",
    }
)

RAIZ = Path(__file__).resolve().parents[2]
DATOS = RAIZ / "data" / "cobranza-seguros"
OUT = RAIZ / "public" / "projects" / "cobranza-seguros"

# Las medidas de los PNG que ya están publicados: 1780x1202 y 1780x1123, que el
# MDX declara a la mitad. Si cambian, hay que cambiar los `width`/`height` del
# `<Figure>` o la página reserva mal el espacio mientras la imagen carga.
#
# El lienzo va en pulgadas a 100 dpi y no en la mitad a 200: el tamaño de fuente
# se mide en puntos sobre las pulgadas del lienzo, así que a 200 dpi las mismas
# fuentes salen al doble y el título se va de la imagen.
DPI = 100
TAM_ANULACIONES = (17.8, 12.02)
TAM_MESES = (17.8, 11.23)

ATRIBUCION = "Elaboración propia · ivandujaut.com"

# El cuadro de la SSN abrevia un ramo en la propia celda. Se escribe entero
# porque en el eje entra y "Integ." no es una palabra.
NOMBRES_RAMO = {"Combinado Familiar e Integ.": "Combinado Familiar e Integral"}


def coma(valor: float, decimales: int = 1) -> str:
    """Coma decimal y medio para arriba.

    Lo segundo importa más de lo que parece: el formato de Python redondea sobre
    el binario, así que 3,2505 sale "3,2" y SMG Seguros aparece abajo de Río
    Uruguay cuando en realidad está arriba. Un gráfico que ordena barras no
    puede desempatar con el error de representación del float.
    """
    paso = Decimal(1).scaleb(-decimales)
    return str(Decimal(repr(valor)).quantize(paso, rounding=ROUND_HALF_UP)).replace(".", ",")


def leer(nombre: str) -> list[dict]:
    ruta = DATOS / nombre
    if not ruta.exists():
        sys.exit(
            f"Falta {ruta.relative_to(RAIZ)}.\n"
            "Corré primero:  python3 scripts/analysis/cobranza-seguros.py"
        )
    with ruta.open(encoding="utf-8") as f:
        return list(csv.DictReader(f))


def encabezado(fig, titulo: str, bajada: str) -> None:
    # Los tamaños están calibrados contra los PNG que ya estaban publicados: el
    # título ocupa dos tercios del ancho y la bajada entra entera en una línea.
    fig.suptitle(titulo, x=0.014, y=0.972, ha="left", fontsize=25, fontweight="bold")
    fig.text(0.014, 0.925, bajada, ha="left", fontsize=15, color=GRAY)


def barras(ax, etiquetas: list[str], valores: list[float], colores: list[str], textos: list[str]):
    posiciones = range(len(etiquetas))
    ax.barh(list(posiciones), valores, color=colores, height=0.62)
    ax.set_yticks(list(posiciones), etiquetas, fontsize=19)
    ax.invert_yaxis()
    ax.set_xticks([])
    ax.spines[["top", "right", "bottom"]].set_visible(False)
    tope = max(valores)
    for y, (valor, texto) in enumerate(zip(valores, textos)):
        ax.text(valor + tope * 0.012, y, texto, va="center", fontsize=20, color=FG)
    ax.set_xlim(0, tope * 1.14)


def grafico_anulaciones() -> None:
    filas = leer("anulaciones_por_ramo.csv")
    total = next(f for f in filas if f["ramo"] == "TOTAL MERCADO")
    ramos = [f for f in filas if f["ramo"] != "TOTAL MERCADO"]
    tasa_total = float(total["tasa_anulacion_pct"])

    fig, ax = plt.subplots(figsize=TAM_ANULACIONES)
    barras(
        ax,
        [NOMBRES_RAMO.get(f["ramo"], f["ramo"]) for f in ramos],
        [float(f["tasa_anulacion_pct"]) for f in ramos],
        [BLUE] * len(ramos),
        [f"{coma(float(f['tasa_anulacion_pct']))}%" for f in ramos],
    )

    ax.axvline(tasa_total, color=ORANGE, linestyle="--", linewidth=2, dashes=(5, 3))
    ax.text(
        tasa_total,
        len(ramos) - 0.25,
        f"  Total mercado: {coma(tasa_total)}%",
        ha="left",
        va="top",
        fontsize=20,
        color=ORANGE,
        fontweight="bold",
    )

    encabezado(
        fig,
        f"Por cada 100 pólizas emitidas en el trimestre, se anulan {round(tasa_total)}",
        "Anulaciones como % de pólizas emitidas brutas · ramos patrimoniales con >30 mil "
        "emisiones · 1º trim. 2026 · Fuente: SSN",
    )
    guardar(fig, "chart_anulaciones_ramo.png", rect=(0.0, 0.0, 1, 0.9))


def grafico_meses() -> None:
    filas = leer("meses_atrapados.csv")
    mediana = float(filas[0]["mediana_top_50"])
    valores = [float(f["meses_atrapados"]) for f in filas]
    colores = [ORANGE if f["cobranza_directa"] == "1" else BLUE for f in filas]

    fig, ax = plt.subplots(figsize=TAM_MESES)
    barras(ax, [f["etiqueta"] for f in filas], valores, colores, [coma(v) for v in valores])

    ax.axvline(mediana, color=GRAY, linestyle="--", linewidth=2, dashes=(5, 3))
    ax.text(
        mediana,
        len(filas) - 0.3,
        f"  Mediana top 50: {coma(mediana)} meses",
        ha="left",
        va="top",
        fontsize=19,
        color=GRAY,
    )

    encabezado(
        fig,
        "Meses de prima atrapados en cuentas por cobrar",
        "Premios a cobrar / prima mensual promedio · 9 meses del ejercicio 2025/26 "
        "(cierre mar-2026) · top 10 + destacadas (naranja) · Fuente: SSN, balances",
    )
    guardar(fig, "chart_meses_atrapados.png", rect=(0.0, 0.0, 1, 0.9))


def guardar(fig, nombre: str, rect) -> None:
    fig.text(0.014, 0.022, ATRIBUCION, fontsize=15, color=GRAY)
    fig.tight_layout(rect=rect)
    OUT.mkdir(parents=True, exist_ok=True)
    destino = OUT / nombre
    fig.savefig(destino, dpi=DPI, facecolor=BG)
    plt.close(fig)
    print(f"  {destino.relative_to(RAIZ)}")


if __name__ == "__main__":
    grafico_anulaciones()
    grafico_meses()
