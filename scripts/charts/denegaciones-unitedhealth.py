"""Gráficos del caso denegaciones-unitedhealth.

Regenerable = auditable: lee `data/denegaciones-unitedhealth/cache/numeros.json`,
que produce `scripts/analysis/denegaciones-unitedhealth.py` desde los archivos de
CMS. Ningún número está escrito a mano acá, y los títulos se calculan de los datos.

Tres gráficos, uno por tramo del argumento de la tesis E:

- `g1_la_brecha`: el hallazgo de entrada. La tasa del anfitrión contra la del
  mercado en los tres años de plan. Muestra que la cifra que se viralizó era real
  y era el doble del mercado, y que después la brecha se cierra. Es el gráfico que
  impide leer el caso como una defensa.
- `g2_no_fue_la_mezcla`: la prueba. Descomposición de la caída de 14,1 puntos. El
  efecto composición apunta para el otro lado, así que la mejora no se explica por
  entrada de carteras nuevas.
- `g3_trece_de_trece`: la evidencia más contundente y la más simple. Las trece
  entidades que están en los dos años, todas bajando, ninguna subiendo.

Estilo compartido con el resto de la serie: fondo claro, título bold arriba a la
izquierda, ejes grises, footer de atribución abajo a la izquierda.

Correr desde la raíz del repo:
    python3 scripts/charts/denegaciones-unitedhealth.py
"""

import json
from pathlib import Path

import matplotlib.pyplot as plt

FG = "#111111"
GRAY = "#8a8a8a"
BG = "#f8f9fa"
AZUL = "#2f74dd"
AMBAR = "#c2571a"
GRIS_AZUL = "#b8c4d4"
VERDE = "#17a673"

plt.rcParams.update({
    "font.family": "DejaVu Sans",
    "text.color": FG,
    "axes.edgecolor": GRAY,
    "axes.labelcolor": GRAY,
    "xtick.color": GRAY,
    "ytick.color": GRAY,
    "figure.facecolor": BG,
    "axes.facecolor": BG,
    "svg.fonttype": "none",
})

RAIZ = Path(__file__).resolve().parents[2]
CACHE = RAIZ / "data" / "denegaciones-unitedhealth" / "cache"
OUT = RAIZ / "public" / "projects" / "denegaciones-unitedhealth"
D = json.loads((CACHE / "numeros.json").read_text(encoding="utf-8"))
ANIOS = ["2022", "2023", "2024"]

# El archivo rotula por sigla postal. Un lector argentino no las reconoce, así que
# en castellano se traducen al nombre completo antes de pintarlas. En inglés la
# sigla sí se lee, pero el nombre entero no molesta y mantiene los dos gráficos
# idénticos en layout.
ESTADOS = {
    "es": {"TX": "Texas", "AL": "Alabama", "FL": "Florida", "AZ": "Arizona",
           "TN": "Tennessee", "NC": "Carolina del Norte", "MO": "Misuri",
           "LA": "Luisiana", "KS": "Kansas", "OH": "Ohio", "MI": "Míchigan",
           "MS": "Misisipi", "OK": "Oklahoma"},
    "en": {"TX": "Texas", "AL": "Alabama", "FL": "Florida", "AZ": "Arizona",
           "TN": "Tennessee", "NC": "North Carolina", "MO": "Missouri",
           "LA": "Louisiana", "KS": "Kansas", "OH": "Ohio", "MI": "Michigan",
           "MS": "Mississippi", "OK": "Oklahoma"},
}

# Mismo criterio que en glp1-quien-receta: el `.png` es el castellano y el
# `.en.png` el inglés. Los títulos son plantillas para que ningún número quede
# escrito a mano en ninguno de los dos idiomas.
TEXTOS = {
    "es": {
        "sufijo": "",
        "pie": ("Elaboración propia sobre el archivo público Transparency in Coverage de CMS,\n"
                "releases 2024 a 2026.\n"
                "Pedidos de pago dentro de la red, consolidando las entidades del grupo antes de dividir.\n"
                "Sólo planes del mercado individual que administra el Estado federal: quedan afuera los\n"
                "de empleador, Medicare y Medicaid. El dato es autodeclarado por cada aseguradora."),
        "eje_tasa": "% de pedidos de pago denegados dentro de la red",
        "anio": "año de plan {a}",
        "mercado": "Mercado (agregado)",
        "pp": "pp",
        "g1_titulo": ("La cifra era real: {p0}% en 2022, el doble del mercado.\n"
                      "Dos años después la distancia era de {b2} puntos."),
        "g2_partes": ["Las mismas carteras\nbajan su tasa",
                      "Entran y salen\ncarteras del grupo",
                      "Cambia el peso\nentre las carteras"],
        "g2_eje": "aporte a la caída total de la tasa, en puntos porcentuales",
        "g2_titulo": ("La mezcla frenó la mejora en vez de producirla.\n"
                      "De los {tot} puntos que bajó, {intra} salen de las carteras que ya tenía."),
        "g2_pie_extra": "Descomposición del cambio entre los años de plan 2023 y 2024, a nivel entidad.\n",
        "g3_titulo": ("Las trece que estaban en los dos años bajaron. Ninguna subió.\n"
                      "La que más, {peor}, {delta} puntos en un solo año."),
    },
    "en": {
        "sufijo": ".en",
        "pie": ("Author's analysis of the public CMS Transparency in Coverage file,\n"
                "2024 to 2026 releases.\n"
                "In-network payment requests, consolidating the group's entities before dividing.\n"
                "Individual market plans sold on the federal exchange only: employer plans,\n"
                "Medicare and Medicaid are out. Each insurer self-reports these figures."),
        "eje_tasa": "% of in-network payment requests denied",
        "anio": "plan year {a}",
        "mercado": "Market (aggregate)",
        "pp": "pp",
        "g1_titulo": ("The figure was real: {p0}% in 2022, twice the market.\n"
                      "Two years later the gap was {b2} points."),
        "g2_partes": ["The same entities\nlower their rate",
                      "Entities enter and\nleave the group",
                      "The weight between\nentities shifts"],
        "g2_eje": "contribution to the total drop in the rate, in percentage points",
        "g2_titulo": ("The mix slowed the improvement instead of causing it.\n"
                      "Of the {tot} points it fell, {intra} come from the entities it already had."),
        "g2_pie_extra": "Decomposition of the change between plan years 2023 and 2024, at entity level.\n",
        "g3_titulo": ("The thirteen present in both years fell. None rose.\n"
                      "The largest drop, {peor}, {delta} points in a single year."),
    },
}


def num(v, locale="es", dec=1):
    """Castellano con coma decimal; inglés con el formato por defecto."""
    s = f"{v:,.{dec}f}"
    if locale == "es":
        s = s.replace(",", "·").replace(".", ",").replace("·", ".")
    return s


def guardar(fig, nombre, locale):
    OUT.mkdir(parents=True, exist_ok=True)
    destino = OUT / f"{nombre}{TEXTOS[locale]['sufijo']}.png"
    fig.savefig(destino, facecolor=BG)
    plt.close(fig)
    print(f"  {destino.relative_to(RAIZ)}")
    return destino


# ---------------------------------------------------------------- g1
def g1_la_brecha(locale):
    """La cifra era real y era el doble del mercado. Después se cierra."""
    t = TEXTOS[locale]
    anf = [D["serie"][a]["anfitrion_tasa_pct"] for a in ANIOS]
    mkt = [D["serie"][a]["mercado_tasa_pct"] for a in ANIOS]

    fig, ax = plt.subplots(figsize=(10, 6.4), dpi=200)
    x = range(len(ANIOS))
    ancho = 0.36
    ax.bar([i - ancho / 2 for i in x], anf, ancho, color=AMBAR, label="UnitedHealthcare")
    ax.bar([i + ancho / 2 for i in x], mkt, ancho, color=GRIS_AZUL, label=t["mercado"])

    for i, (a, m) in enumerate(zip(anf, mkt)):
        ax.text(i - ancho / 2, a + 0.7, num(a, locale) + "%", ha="center", fontsize=11,
                fontweight="bold", color=AMBAR)
        ax.text(i + ancho / 2, m + 0.7, num(m, locale) + "%", ha="center", fontsize=11,
                color=GRAY)
        if a - m > 2:  # sólo cuando hay lugar; en 2024 la brecha es de medio punto
            ax.annotate("", xy=(i, m), xytext=(i, a),
                        arrowprops=dict(arrowstyle="-", color=GRAY, lw=0.8, ls=":"))
            ax.text(i + 0.03, (a + m) / 2, f"{num(a - m, locale)} {t['pp']}", fontsize=10,
                    color=GRAY, ha="left", va="center")

    ax.set_xticks(list(x))
    ax.set_xticklabels([t["anio"].format(a=a) for a in ANIOS], fontsize=11)
    ax.set_ylabel(t["eje_tasa"])
    ax.set_ylim(0, max(anf) * 1.22)
    ax.spines[["top", "right"]].set_visible(False)
    ax.legend(frameon=False, loc="upper right", fontsize=10)

    fig.text(0.055, 0.965,
             t["g1_titulo"].format(p0=num(anf[0], locale), b2=num(anf[2] - mkt[2], locale)),
             fontsize=16, fontweight="bold", ha="left", va="top", linespacing=1.25)
    fig.text(0.055, 0.028, t["pie"], fontsize=9, color=GRAY, ha="left", va="bottom",
             linespacing=1.55)
    fig.text(0.955, 0.028, "ivandujaut.com", fontsize=9.5, color=GRAY, ha="right")
    fig.subplots_adjust(top=0.80, bottom=0.265, left=0.085, right=0.97)
    return guardar(fig, "g1_la_brecha", locale)


# ---------------------------------------------------------------- g2
def g2_no_fue_la_mezcla(locale):
    """La descomposición: el efecto composición empuja para el otro lado."""
    t = TEXTOS[locale]
    d = D["descomposicion_2023_2024"]
    valores = [d["intra_pp"], d["entradas_salidas_pp"], d["composicion_pp"]]
    colores = [AZUL, AZUL, AMBAR]

    fig, ax = plt.subplots(figsize=(10, 6.4), dpi=200)
    y = range(len(valores))
    ax.barh(list(y), valores, 0.5, color=colores)
    for i, v in enumerate(valores):
        signo = "+" if v > 0 else ""
        ax.text(v + (0.35 if v > 0 else -0.35), i, f"{signo}{num(v, locale)} {t['pp']}",
                va="center", ha="left" if v > 0 else "right",
                fontsize=12, fontweight="bold", color=AMBAR if v > 0 else AZUL)
    ax.set_yticks(list(y))
    ax.set_yticklabels(t["g2_partes"], fontsize=11)
    ax.invert_yaxis()
    ax.axvline(0, color=GRAY, lw=1)
    ax.set_xlabel(t["g2_eje"])
    ax.set_xlim(min(valores) * 1.3, max(abs(min(valores)), max(valores)) * 0.35)
    # el eje traía separador decimal inglés y chocaba con las etiquetas en coma
    ax.xaxis.set_major_formatter(plt.FuncFormatter(lambda v, _: num(v, locale)))
    ax.spines[["top", "right", "left"]].set_visible(False)

    fig.text(0.055, 0.965,
             t["g2_titulo"].format(tot=num(abs(d["total_pp"]), locale),
                                   intra=num(abs(d["intra_pp"]), locale)),
             fontsize=16, fontweight="bold", ha="left", va="top", linespacing=1.25)
    fig.text(0.055, 0.028, t["g2_pie_extra"] + t["pie"], fontsize=9, color=GRAY,
             ha="left", va="bottom", linespacing=1.55)
    fig.text(0.955, 0.028, "ivandujaut.com", fontsize=9.5, color=GRAY, ha="right")
    fig.subplots_adjust(top=0.79, bottom=0.30, left=0.21, right=0.95)
    return guardar(fig, "g2_no_fue_la_mezcla", locale)


# ---------------------------------------------------------------- g3
def g3_trece_de_trece(locale):
    """Todas bajan. Ninguna sube. Es el gráfico que cierra el argumento."""
    t = TEXTOS[locale]
    nombres = ESTADOS[locale]
    ent = sorted(D["entidades_comunes"], key=lambda e: e["cambio_pp"])

    fig, ax = plt.subplots(figsize=(10, 6.4), dpi=200)
    y = range(len(ent))
    for i, e in enumerate(ent):
        ax.plot([e["tasa_2024_pct"], e["tasa_2023_pct"]], [i, i],
                color=GRIS_AZUL, lw=2.4, zorder=1, solid_capstyle="round")
        ax.scatter(e["tasa_2023_pct"], i, s=52, color=AMBAR, zorder=3)
        ax.scatter(e["tasa_2024_pct"], i, s=52, color=VERDE, zorder=3)
        ax.text(e["tasa_2024_pct"] - 0.9, i, num(e["cambio_pp"], locale), fontsize=9.5,
                color=GRAY, va="center", ha="right")

    ax.set_yticks(list(y))
    ax.set_yticklabels([nombres.get(e["estado"], e["estado"]) for e in ent], fontsize=10.5)
    ax.set_xlabel(t["eje_tasa"])
    ax.set_xlim(10, max(e["tasa_2023_pct"] for e in ent) * 1.08)
    ax.spines[["top", "right", "left"]].set_visible(False)
    ax.scatter([], [], s=52, color=AMBAR, label=t["anio"].format(a=2023))
    ax.scatter([], [], s=52, color=VERDE, label=t["anio"].format(a=2024))
    ax.legend(frameon=False, loc="upper right", fontsize=10)

    peor = min(ent, key=lambda e: e["cambio_pp"])
    fig.text(0.055, 0.965,
             t["g3_titulo"].format(peor=nombres.get(peor["estado"], peor["estado"]),
                                   delta=num(abs(peor["cambio_pp"]), locale)),
             fontsize=16, fontweight="bold", ha="left", va="top", linespacing=1.25)
    fig.text(0.055, 0.028, t["pie"], fontsize=9, color=GRAY, ha="left", va="bottom",
             linespacing=1.55)
    fig.text(0.955, 0.028, "ivandujaut.com", fontsize=9.5, color=GRAY, ha="right")
    fig.subplots_adjust(top=0.80, bottom=0.265, left=0.165, right=0.97)
    return guardar(fig, "g3_trece_de_trece", locale)


if __name__ == "__main__":
    for locale in TEXTOS:
        print(f"gráficos de denegaciones-unitedhealth [{locale}]:")
        for hacer in (g1_la_brecha, g2_no_fue_la_mezcla, g3_trece_de_trece):
            hacer(locale)
