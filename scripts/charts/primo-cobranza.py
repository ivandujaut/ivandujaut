"""Gráfico del caso primo-cobranza (g1: morosidad mensual por ART vs sistema).

Regenerable = auditable: cada cifra sale de `data/primo-cobranza/serie-morosidad-art.csv`,
que a su vez genera `scripts/analysis/primo-cobranza.py` desde los boletines
mensuales de la SRT (cuota pactada vs recaudada, fila Total de unidades
productivas). Nada tipeado a mano.

Dos eventos con línea punteada son hechos públicos con fecha (rebrand
Omint→Serena, capitalización de Provincia ART). El caso de éxito de Primo no
tiene fecha pública, así que va como banda (la ventana marzo-mayo 2026 en que
apareció en el sitio), nunca como línea. Nada afirma causalidad, y el título
tampoco: el gráfico muestra lo que el dato del regulador dice, no qué lo
explica.

Correr desde la raíz del repo:  python3 scripts/charts/primo-cobranza.py

Estilo compartido con los charts de cobranza y nubank: fondo claro, título bold
a la izquierda, ejes grises, footer de atribución abajo a la izquierda.
"""

import csv
from pathlib import Path

import matplotlib.pyplot as plt

FG = "#111111"
GRAY = "#8a8a8a"
BG = "#f8f9fa"
PROVINCIA = "#c0392b"  # la vitrina que empeora
SERENA = "#2f74dd"  # la que mejora tras el rebrand
SISTEMA = "#9aa5b1"  # referencia

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

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / "data" / "primo-cobranza" / "serie-morosidad-art.csv"
OUT = ROOT / "public" / "projects" / "primo-cobranza"


def cargar() -> dict[str, list[tuple[str, float]]]:
    series: dict[str, list[tuple[str, float]]] = {}
    with open(DATA, encoding="utf-8") as f:
        for r in csv.DictReader(f):
            series.setdefault(r["entidad"], []).append(
                (r["periodo"], float(r["morosidad_pct"]))
            )
    for v in series.values():
        v.sort()
    return series


def g1(series: dict[str, list[tuple[str, float]]]) -> None:
    fig, ax = plt.subplots(figsize=(9.6, 5.8), dpi=150)

    todos = sorted({p for v in series.values() for p, _ in v})
    x = {p: i for i, p in enumerate(todos)}

    estilo = {
        "TOTAL SISTEMA": (SISTEMA, 1.8, "Total sistema"),
        "OMINT/SERENA ART": (SERENA, 2.6, "Omint → Serena ART"),
        "PROVINCIA ART": (PROVINCIA, 2.6, "Provincia ART"),
    }
    for entidad, (color, lw, label) in estilo.items():
        valores = dict(series[entidad])
        # los huecos de boletín se muestran como huecos: None corta la línea
        # en vez de puentear meses que el regulador no publicó
        ys = [valores.get(p) for p in todos]
        ax.plot(
            [x[p] for p in todos], ys,
            color=color, linewidth=lw, marker="o", markersize=3.5, label=label,
        )

    # Eventos públicos FECHADOS van como línea punteada. El caso de éxito de
    # Primo no tiene fecha (la hoja de hechos solo acota su aparición entre los
    # snapshots del 06/03 y el 06/05/2026), así que va como BANDA, no como
    # línea: una línea en marzo clavaría el evento justo en el mes del cruce y
    # sugeriría la causalidad que el caso niega.
    eventos = [
        ("2025-09", "rebrand\nOmint → Serena", 0.985, "center"),
        ("2025-12", "capitalización\nProvincia ART", 0.885, "center"),
    ]
    for periodo, texto, yf, ha in eventos:
        if periodo in x:
            ax.axvline(x[periodo], color=GRAY, linewidth=0.8, linestyle=":", alpha=0.7)
            ax.text(
                x[periodo], ax.get_ylim()[1] * yf, texto,
                fontsize=7.5, color=GRAY, ha=ha, va="top", linespacing=1.2,
            )
    if "2026-03" in x:
        fin = max(x.values()) + 0.4
        ax.axvspan(x["2026-03"], fin, color=GRAY, alpha=0.10, zorder=0)
        # etiqueta en tres líneas cortas y cuerpo menor: más angosta que la
        # banda, para no invitar a leer la ventana más ancha de lo que es
        ax.text(
            (x["2026-03"] + fin) / 2, ax.get_ylim()[0] + 0.25,
            "ventana:\nlista de clientes\ny caso de éxito",
            fontsize=7, color=GRAY, ha="center", va="bottom", linespacing=1.25,
        )

    ax.set_title(
        "La morosidad que el regulador publica, mes a mes",
        fontsize=17, fontweight="bold", loc="left", pad=14, color=FG,
    )
    ax.set_ylabel("Morosidad (cuota pactada vs recaudada, %)", fontsize=9)
    ticks = [p for p in todos if p.endswith(("-01", "-04", "-07", "-10"))]
    ax.set_xticks([x[p] for p in ticks])
    ax.set_xticklabels([p.replace("-", "\n") for p in ticks], fontsize=8)
    ax.legend(loc="upper left", frameon=False, fontsize=9)
    ax.grid(axis="y", color=GRAY, alpha=0.15)
    for sp in ("top", "right"):
        ax.spines[sp].set_visible(False)

    fig.text(
        0.01, 0.012,
        "Elaboración propia sobre los boletines mensuales de cobertura y financiación de la SRT "
        "(fila Total de unidades productivas). Huecos: meses sin boletín y cuatro boletines escaneados sin capa de texto.",
        fontsize=6.8, color=GRAY,
    )
    fig.tight_layout(rect=(0, 0.045, 1, 1))
    OUT.mkdir(parents=True, exist_ok=True)
    destino = OUT / "g1_morosidad.png"
    fig.savefig(destino, facecolor=BG)
    print("ok", destino)


if __name__ == "__main__":
    g1(cargar())
