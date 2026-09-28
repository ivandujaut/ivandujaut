"""Gráfico del caso visa-volumen-o-precio, para el feed de LinkedIn.

Un solo gráfico, cuadrado, pensado para leerse en miniatura mientras alguien
baja el dedo: cuánto se queda Visa de cada $100 transaccionados, año fiscal por
año fiscal, con las dos puntas anotadas.

Los números no salen de un cache calculado como en los casos de datos abiertos:
los publica Visa en sus formularios 10-K y el cociente es la única cuenta
propia. Van acá abajo con su origen, y están replicados en la hoja de hechos del
caso (`data/visa-volumen-o-precio/facts.md`, bloques 1, 3 y 5), que es donde el
auditor los verifica contra el documento.

Correr desde la raíz del repo:
    python3 scripts/charts/visa-volumen-o-precio.py
"""

from pathlib import Path

import matplotlib.pyplot as plt

FG = "#111111"
GRAY = "#8a8a8a"
BG = "#f8f9fa"
# El violeta del casebook (`--casebook` en app/globals.css), para que la imagen
# del feed y la sección del sitio se reconozcan como lo mismo.
VIOLETA = "#4a389c"

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
    }
)

# Ingresos netos sobre volumen de pagos, en puntos básicos. Cálculo propio sobre
# cifras publicadas: net revenue del Item 7 del 10-K de cada año, volumen de
# pagos de la tabla de volumen del mismo Item.
TAKE_RATE = {
    "FY2021": 24.17,
    "FY2022": 25.56,
    "FY2023": 27.01,
    "FY2024": 27.66,
    "FY2025": 28.79,
}

RAIZ = Path(__file__).resolve().parents[2]
# El feed no se versiona: los materiales sociales viven fuera del repo
# (`content-workflow.md`, nodo 12).
OUT = RAIZ / "social" / "visa-volumen-o-precio"


def num(valor: float) -> str:
    return f"{valor:.2f}".replace(".", ",")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    anios = list(TAKE_RATE)
    valores = [TAKE_RATE[a] for a in anios]

    fig, ax = plt.subplots(figsize=(10, 10), dpi=120)
    fig.subplots_adjust(top=0.70, bottom=0.26, left=0.11, right=0.95)

    ax.plot(anios, valores, color=VIOLETA, linewidth=3.5, marker="o", markersize=11, zorder=3)
    ax.fill_between(anios, min(valores) - 1.2, valores, color=VIOLETA, alpha=0.07, zorder=1)

    # Sólo las dos puntas llevan número: es lo que se lee en miniatura.
    for indice in (0, len(valores) - 1):
        ax.annotate(
            f"{num(valores[indice])} pb",
            (indice, valores[indice]),
            textcoords="offset points",
            xytext=(0, 20 if indice else -34),
            ha="center",
            fontsize=21,
            fontweight="bold",
            color=VIOLETA,
        )

    ax.set_ylim(min(valores) - 1.2, max(valores) + 1.6)
    ax.set_yticks([])
    ax.tick_params(axis="x", labelsize=17, length=0, pad=12)
    for lado in ("top", "right", "left"):
        ax.spines[lado].set_visible(False)
    ax.spines["bottom"].set_color(GRAY)
    ax.grid(False)

    fig.text(
        0.11,
        0.935,
        "Lo que Visa se queda de cada $100",
        fontsize=28,
        fontweight="bold",
        color=FG,
        ha="left",
    )
    fig.text(
        0.11,
        0.845,
        "Ingresos netos sobre volumen de pagos, en puntos básicos.\nUn punto básico es 0,01%.",
        fontsize=18,
        color=GRAY,
        ha="left",
        linespacing=1.5,
    )
    fig.text(
        0.11,
        0.055,
        "Fuente: formularios 10-K de Visa Inc. (SEC), años fiscales 2021 a 2025.\n"
        "Cálculo propio: ingresos netos / volumen de pagos. Análisis independiente,\n"
        "no afiliado a las empresas mencionadas.",
        fontsize=14,
        color=GRAY,
        ha="left",
        linespacing=1.55,
    )

    destino = OUT / "feed-take-rate.png"
    fig.savefig(destino, facecolor=BG)
    plt.close(fig)
    print(f"{destino}  {int(fig.get_size_inches()[0] * 120)}px cuadrado")


if __name__ == "__main__":
    main()
