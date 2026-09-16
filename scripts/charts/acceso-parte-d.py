"""Gráficos del caso acceso-parte-d (anticoagulantes orales, Eliquis contra Xarelto).

Regenerable = auditable: lee `data/acceso-parte-d/cache/numeros.json`, que produce
`scripts/analysis/acceso-parte-d.py` desde los archivos de CMS. Ningún número está escrito a
mano, y los títulos se calculan de los datos.

Cada gráfico acompaña una sección y muestra el número que esa sección dice:

- `g1_cuota_de_pacientes`: pacientes de Xarelto y Eliquis por año, con la parte de Xarelto de cada 100.
- `g2_pagos_visitas_recetas`: de cada 100 dólares declarados en pagos a médicos, de cada 100 visitas y
  de cada 100 recetas de los dos productos, cuántos son de Xarelto.
- `g3_cuadrantes`: cada condado en la matriz de dos por dos (cuánto vende contra cuánto visita),
  con el peso de cada cuadrante escrito en su esquina.
- `g4_donde_van_las_visitas`: por decil de médicos, qué parte de las recetas escribe cada grupo
  contra qué parte de las visitas de Xarelto recibe.

Historia: el gráfico de quintiles por dureza de la traba (`g2_la_barrera_que_no_era`) se sacó el
2026-09-13, porque la traba nunca estuvo sobre los comprimidos que compiten con Eliquis. La nube
de voz contra cuota (`g3_voz_contra_cuota`) se reemplazó el 2026-09-14 por los cuadrantes, que
dicen lo mismo con la lectura hecha, y por las dos barras de `g2_de_cada_100`. El gráfico 1 cambió de
nombre (antes `g1_el_sintoma`, con líneas) cuando pasó a barras, para que ninguna caché de imágenes
sirva la versión anterior bajo la misma ruta. Por lo mismo, `g2_de_cada_100` pasó a
`g2_pagos_visitas_recetas` el 2026-09-14, cuando sumó la barra de pagos.

Estilo compartido con el resto de la serie. Emite los dos idiomas: `<nombre>.png` es el
castellano y `<nombre>.en.png` el inglés, con `num()` sensible al idioma para el separador decimal.

Correr desde la raíz del repo:
    python3 scripts/charts/acceso-parte-d.py
"""

import collections
import json
import textwrap
from pathlib import Path

import matplotlib.pyplot as plt

FG = "#111111"
GRAY = "#8a8a8a"
BG = "#f8f9fa"
AZUL = "#2f74dd"
AMBAR = "#c2571a"
GRIS_AZUL = "#b8c4d4"
VERDE = "#17a673"
GRIS_OSCURO = "#5f6670"

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
OUT = RAIZ / "public" / "projects" / "acceso-parte-d"
# El caso se publicó en dos piezas: cada gráfico va a la carpeta de la suya.
OUT_VISITA = RAIZ / "public" / "projects" / "xarelto-sin-visita"
DE_LA_VISITA = ("g2_", "g3_", "g4_", "g6_", "g7_", "g9_")
D = json.loads((RAIZ / "data" / "acceso-parte-d" / "cache" / "numeros.json").read_text(encoding="utf-8"))
ANIOS = [str(a) for a in range(2020, 2025)]

# El pie nombra sólo los archivos que usa cada gráfico. Antes era uno solo para todos y acreditaba
# Open Payments también en los gráficos que no lo tocan.
FUENTES = {
    "es": {"gasto_anual": "gasto anual de Part D por medicamento",
           "trimestral": "gasto trimestral de Part D por medicamento",
           "geo": "recetas de Part D por geografía y medicamento",
           "medico": "recetas de Part D por médico y medicamento",
           "formulario": "formularios de los planes",
           "padron": "padrón por plan y condado",
           "op": "Open Payments"},
    "en": {"gasto_anual": "Part D spending by drug",
           "trimestral": "quarterly Part D spending by drug",
           "geo": "Part D prescribers by geography and drug",
           "medico": "Part D prescribers by provider and drug",
           "formulario": "plan formularies",
           "padron": "enrollment by plan and county",
           "op": "Open Payments"},
}
PIE_ES = "Elaboración propia sobre archivos públicos de CMS: {fuentes}.\n{alcance}"
PIE_EN = "Author's analysis of public CMS files: {fuentes}.\n{alcance}"
# La segunda línea dice de qué universo son los datos. Las recetas son sólo de Medicare; los pagos de
# Open Payments son de todos los pagadores. Un gráfico que mezcla los dos tiene que decir las dos cosas.
ALCANCE = {
    "es": {"medicare": "Sólo Medicare, que cubre sobre todo a mayores de 65 años: nada de esto describe al mercado comercial.",
           "pagos": "Pagos declarados por los laboratorios a médicos de todo el país, sin distinguir la cobertura de sus pacientes.",
           "mixto": "Recetas: sólo Medicare, que cubre sobre todo a mayores de 65 años. Pagos: todo lo que declaran los laboratorios."},
    "en": {"medicare": "Medicare only, which mostly covers people 65 and over: none of this describes the commercial market.",
           "pagos": "Payments reported by manufacturers to physicians nationwide, regardless of their patients' coverage.",
           "mixto": "Prescriptions: Medicare only, which mostly covers people 65 and over. Payments: everything manufacturers report."},
}

TEXTOS = {
    "es": {
        "sufijo": "", "pie": PIE_ES,
        "g1_titulo": ("De cada 100 pacientes de Xarelto o Eliquis en Medicare,\n"
                      "Xarelto tenía {c20} en 2020 y {c24} en 2024."),
        "g1_eje": "pacientes de los dos productos, en millones",
        "g1_x": "Xarelto", "g1_e": "Eliquis",
        "g1_etq": "{n}\nde cada 100",
        "g1_nota": "Pacientes con al menos una receta de cada producto en Part D, por año. La warfarina y los demás anticoagulantes no entran.\n",
        "g2_titulo": ("Xarelto pone {usd} de cada 100 dólares declarados en pagos a médicos\n"
                      "y {vis} de cada 100 visitas, pero consigue {rec} de cada 100 recetas."),
        "g2_fila_usd": "pagos a médicos\n(dólares declarados)",
        "g2_fila_vis": "visitas\n(comidas declaradas)",
        "g2_fila_rec": "recetas\nen Medicare",
        "g2_eje": "de cada 100",
        "g2_nota": ("Pagos: todo lo declarado en Open Payments 2023 que nombra a cada producto, en todo el país. El {comp}% de las comidas de Eliquis\n"
                    "nombra también otros productos de Pfizer y cuenta entera para Eliquis. Visitas y recetas: {cond} condados y {vis} visitas, 2023.\n"),
        "g3_titulo": ("El {vis}% de las visitas de los dos productos va a condados donde\n"
                      "Xarelto vende poco frente a Eliquis y visita más de lo que vende."),
        "g3_eje_x": "cuota de Xarelto frente a Eliquis en el condado (%)",
        "g3_eje_y": "su parte de las visitas menos su parte de las recetas (puntos)",
        "g3_cuad": {"debil_sobre": "Vende poco, visita más", "fuerte_sobre": "Vende mucho, visita más",
                    "debil_sub": "Vende poco, visita menos", "fuerte_sub": "Vende mucho, visita menos"},
        "g3_detalle": "{cond} condados\n{vis}% de las visitas\n{rec}% de las recetas",
        "g3_linea_v": "cuota nacional\n{c}%",
        "g3_linea_h": "visita lo mismo que vende",
        "g3_nota": "Cada punto es un condado, y su tamaño, las visitas registradas en 2023. Porcentajes sobre el total de los {cond} condados.\n",
        "g4_titulo": ("El 10% de los médicos que más recetan escribe el {rec}% de las recetas\n"
                      "y recibe el {vis}% de las visitas de Xarelto."),
        "g4_eje_x": "médicos agrupados por cuántas recetas de los dos productos escriben (1 = el 10% que más receta)",
        "g4_eje_y": "% del total",
        "g4_rec": "recetas de Xarelto y Eliquis",
        "g4_vis": "visitas de Xarelto",
        "g4_fuera": "menos de\n11 recetas",
        "g4_nota": ("Recetas de apixabán y rivaroxabán en Part D, 2023, por médico. Visitas contadas por las comidas declaradas en Open Payments 2023.\n"
                    "Última barra: profesionales con menos de 11 recetas de cada producto en Part D, que CMS no publica.\n"),
    },
    "en": {
        "sufijo": ".en", "pie": PIE_EN,
        "g1_titulo": ("Of every 100 Xarelto or Eliquis patients in Medicare,\n"
                      "Xarelto had {c20} in 2020 and {c24} in 2024."),
        "g1_eje": "patients on the two drugs, in millions",
        "g1_x": "Xarelto", "g1_e": "Eliquis",
        "g1_etq": "{n}\nof every 100",
        "g1_nota": "Patients with at least one Part D prescription of each drug, by year. Warfarin and other anticoagulants are excluded.\n",
        "g2_titulo": ("Xarelto has {usd} of every 100 dollars reported in payments to doctors\n"
                      "and {vis} of every 100 visits, but gets {rec} of every 100 prescriptions."),
        "g2_fila_usd": "payments to doctors\n(reported dollars)",
        "g2_fila_vis": "visits\n(reported meals)",
        "g2_fila_rec": "prescriptions\nin Medicare",
        "g2_eje": "of every 100",
        "g2_nota": ("Payments: everything reported in Open Payments 2023 that names each drug, nationwide. {comp}% of Eliquis meals also name\n"
                    "other Pfizer products and count in full for Eliquis. Visits and prescriptions: {cond} counties and {vis} visits, 2023.\n"),
        "g3_titulo": ("{vis}% of the visits for the two drugs go to counties where Xarelto\n"
                      "sells little against Eliquis and visits more than it sells."),
        "g3_eje_x": "Xarelto share against Eliquis in the county (%)",
        "g3_eje_y": "its share of visits minus its share of prescriptions (points)",
        "g3_cuad": {"debil_sobre": "Sells little, visits more", "fuerte_sobre": "Sells a lot, visits more",
                    "debil_sub": "Sells little, visits less", "fuerte_sub": "Sells a lot, visits less"},
        "g3_detalle": "{cond} counties\n{vis}% of visits\n{rec}% of prescriptions",
        "g3_linea_v": "national share\n{c}%",
        "g3_linea_h": "visits as much as it sells",
        "g3_nota": "Each dot is a county, sized by recorded visits in 2023. Percentages over all {cond} counties.\n",
        "g4_titulo": ("The top 10% of prescribers write {rec}% of the prescriptions\n"
                      "and receive {vis}% of Xarelto's visits."),
        "g4_eje_x": "prescribers grouped by how many prescriptions of the two drugs they write (1 = top 10%)",
        "g4_eje_y": "% of the total",
        "g4_rec": "Xarelto and Eliquis prescriptions",
        "g4_vis": "Xarelto visits",
        "g4_fuera": "under 11\nprescriptions",
        "g4_nota": ("Apixaban and rivaroxaban prescriptions in Part D, 2023, by prescriber. Visits counted by meals reported in Open Payments 2023.\n"
                    "Last bar: professionals with fewer than 11 prescriptions of each drug in Part D, which CMS does not publish.\n"),
    },
}


def num(v, locale="es", dec=1):
    s = f"{v:,.{dec}f}"
    if locale == "es":
        s = s.replace(",", "·").replace(".", ",").replace("·", ".")
    return s


def guardar(fig, nombre, locale):
    carpeta = OUT_VISITA if nombre.startswith(DE_LA_VISITA) else OUT
    carpeta.mkdir(parents=True, exist_ok=True)
    destino = carpeta / f"{nombre}{TEXTOS[locale]['sufijo']}.png"
    fig.savefig(destino, facecolor=BG)
    plt.close(fig)
    print(f"  {destino.relative_to(RAIZ)}")
    return destino


def pie(fig, t, nota="", fuentes=()):
    locale = "en" if t["sufijo"] else "es"
    nombres = [FUENTES[locale][f] for f in fuentes]
    y = " and " if locale == "en" else " y "
    lista = nombres[0] if len(nombres) == 1 else ", ".join(nombres[:-1]) + y + nombres[-1]
    con_pagos, con_recetas = "op" in fuentes, any(f != "op" for f in fuentes)
    alcance = ALCANCE[locale]["mixto" if con_pagos and con_recetas else "pagos" if con_pagos else "medicare"]
    primera, resto = t["pie"].format(fuentes=lista, alcance=alcance).split("\n", 1)
    texto = "\n".join(textwrap.wrap(primera, 105)) + "\n" + resto
    fig.text(0.055, 0.028, nota + texto, fontsize=8.5, color=GRAY, ha="left", va="bottom", linespacing=1.5)
    fig.text(0.955, 0.028, "ivandujaut.com", fontsize=9.5, color=GRAY, ha="right")


def titulo(fig, texto):
    fig.text(0.055, 0.965, texto, fontsize=16, fontweight="bold", ha="left", va="top", linespacing=1.25)


# ---------------------------------------------------------------- g1
def g1_cuota_de_pacientes(locale):
    """El síntoma: el mercado de los dos crece y la parte de Xarelto se achica."""
    t = TEXTOS[locale]
    pp = D["mercado"]["por_producto"]
    e = [pp["Eliquis"]["benef"][a] / 1e6 for a in ANIOS]
    x = [pp["Xarelto"]["benef"][a] / 1e6 for a in ANIOS]
    cuota = [100 * xi / (xi + ei) for xi, ei in zip(x, e)]

    fig, ax = plt.subplots(figsize=(10, 6.4), dpi=200)
    pos = list(range(len(ANIOS)))
    ax.bar(pos, x, 0.62, color=AMBAR, label=t["g1_x"], zorder=2)
    ax.bar(pos, e, 0.62, bottom=x, color=AZUL, label=t["g1_e"], zorder=2)
    for i in pos:
        ax.text(i, x[i] / 2, t["g1_etq"].format(n=round(cuota[i])), ha="center", va="center",
                color="white", fontsize=11, fontweight="bold", linespacing=1.1, zorder=3)
        ax.text(i, x[i] + e[i] + 0.1, num(x[i] + e[i], locale, 2) + " M", ha="center", va="bottom",
                color=GRAY, fontsize=10.5, zorder=3)
    ax.set_xticks(pos)
    ax.set_xticklabels(ANIOS, fontsize=11)
    ax.set_ylabel(t["g1_eje"])
    ax.set_ylim(0, max(a + b for a, b in zip(x, e)) * 1.15)
    ax.spines[["top", "right"]].set_visible(False)
    ax.legend(frameon=False, loc="upper left", fontsize=10.5)

    titulo(fig, t["g1_titulo"].format(c20=round(cuota[0]), c24=round(cuota[-1])))
    pie(fig, t, t["g1_nota"], fuentes=("gasto_anual",))
    fig.subplots_adjust(top=0.80, bottom=0.27, left=0.085, right=0.97)
    return guardar(fig, "g1_cuota_de_pacientes", locale)


# ---------------------------------------------------------------- g2
def g2_pagos_visitas_recetas(locale):
    """La cuenta que le importa a la marca: cuánto pone contra cuánto consigue, en barras de cien."""
    t = TEXTOS[locale]
    v, p = D["voz"], D["pagos"]
    filas = [(t["g2_fila_usd"], p["cuota_xarelto_de_los_usd_pct"]),
             (t["g2_fila_vis"], v["cuota_promocion_pct"]),
             (t["g2_fila_rec"], v["cuota_receta_pct"])]

    fig, ax = plt.subplots(figsize=(10, 6.4), dpi=200)
    for i, (_, px) in enumerate(filas):
        y = len(filas) - 1 - i
        ax.barh(y, px, 0.6, color=AMBAR, zorder=2)
        ax.barh(y, 100 - px, 0.6, left=px, color=GRIS_AZUL, zorder=2)
        ax.text(px / 2, y, f"Xarelto  {num(px, locale)}", ha="center", va="center", color="white",
                fontsize=12.5, fontweight="bold", zorder=3)
        ax.text(px + (100 - px) / 2, y, f"Eliquis  {num(100 - px, locale)}", ha="center", va="center",
                color=FG, fontsize=12.5, fontweight="bold", zorder=3)
    ax.set_yticks(list(range(len(filas) - 1, -1, -1)))
    ax.set_yticklabels([f[0] for f in filas], fontsize=11.5, color=FG)
    ax.set_xlim(0, 100)
    ax.set_xticks([0, 25, 50, 75, 100])
    ax.set_xlabel(t["g2_eje"])
    ax.spines[["top", "right", "left"]].set_visible(False)
    ax.tick_params(axis="y", length=0)

    titulo(fig, t["g2_titulo"].format(usd=round(p["cuota_xarelto_de_los_usd_pct"]),
                                      vis=round(v["cuota_promocion_pct"]), rec=round(v["cuota_receta_pct"])))
    pie(fig, t, t["g2_nota"].format(cond=num(v["condados"], locale, 0), vis=num(v["visitas"], locale, 0),
                                    comp=round(p["comidas"]["Eliquis"]["pct_compartidas"])), fuentes=("op", "medico", "formulario", "padron"))
    fig.subplots_adjust(top=0.80, bottom=0.31, left=0.23, right=0.97)
    return guardar(fig, "g2_pagos_visitas_recetas", locale)


# ---------------------------------------------------------------- g3
def g3_cuadrantes(locale):
    """La matriz de dos por dos dibujada: cada condado en su cuadrante, con el peso de cada uno."""
    t = TEXTOS[locale]
    v = D["voz"]
    p = v["puntos"]
    corte = v["corte_cuota_nacional_pct"]
    q = v["cuadrantes"]

    def cuadrante(pt):
        return ("fuerte" if pt["receta"] >= corte else "debil") + "_" + ("sobre" if pt["promo"] > pt["receta"] else "sub")

    conteo = collections.Counter(cuadrante(pt) for pt in p)
    # la clasificación del gráfico tiene que coincidir con la del pipeline, condado por condado
    assert all(conteo[k] == q[k]["condados"] for k in q), (conteo, {k: q[k]["condados"] for k in q})

    colores = {"debil_sobre": AMBAR, "fuerte_sobre": AZUL, "fuerte_sub": VERDE, "debil_sub": GRIS_OSCURO}
    fig, ax = plt.subplots(figsize=(10, 6.4), dpi=200)
    for k in ("fuerte_sub", "debil_sub", "fuerte_sobre", "debil_sobre"):
        pts = [pt for pt in p if cuadrante(pt) == k]
        ax.scatter([pt["receta"] for pt in pts], [pt["promo"] - pt["receta"] for pt in pts],
                   s=[max(5, pt["comidas"] / 25) for pt in pts], color=colores[k],
                   alpha=0.5 if k == "debil_sobre" else 0.3, edgecolors="none", zorder=2)
    dy = [pt["promo"] - pt["receta"] for pt in p]
    xmax = min(100, max(pt["receta"] for pt in p) + 3)
    ax.set_xlim(0, xmax)
    # aire arriba y abajo de los datos para que las etiquetas de las esquinas no tapen condados
    rango = max(dy) - min(dy)
    ax.set_ylim(min(dy) - 0.45 * rango, max(dy) + 0.48 * rango)
    ax.axvline(corte, color=FG, lw=1.1, ls="--", zorder=3)
    ax.axhline(0, color=FG, lw=1.1, ls="--", zorder=3)
    ax.text(corte + 0.8, max(dy) + 0.44 * rango, t["g3_linea_v"].format(c=num(corte, locale)), fontsize=9.5,
            color=FG, ha="left", va="top", linespacing=1.25, zorder=6)
    ax.text(xmax - 0.5, 1.2, t["g3_linea_h"], fontsize=9.5, color=FG, ha="right", va="bottom", zorder=4)

    esquinas = {"debil_sobre": (0.015, 0.975, "left", "top"), "fuerte_sobre": (0.985, 0.975, "right", "top"),
                "debil_sub": (0.015, 0.025, "left", "bottom"), "fuerte_sub": (0.985, 0.025, "right", "bottom")}
    for k, (xa, ya, ha, va) in esquinas.items():
        ax.text(xa, ya, t["g3_cuad"][k] + "\n" + t["g3_detalle"].format(
                    cond=num(q[k]["condados"], locale, 0), vis=num(q[k]["pct_visitas"], locale),
                    rec=num(q[k]["pct_recetas"], locale)),
                transform=ax.transAxes, ha=ha, va=va, fontsize=9.5, color=colores[k], fontweight="bold",
                linespacing=1.3, zorder=5)
    ax.set_xlabel(t["g3_eje_x"])
    ax.set_ylabel(t["g3_eje_y"])
    ax.spines[["top", "right"]].set_visible(False)

    titulo(fig, t["g3_titulo"].format(vis=num(q["debil_sobre"]["pct_visitas"], locale)))
    pie(fig, t, t["g3_nota"].format(cond=num(v["condados"], locale, 0)), fuentes=("op", "medico", "formulario", "padron"))
    fig.subplots_adjust(top=0.80, bottom=0.30, left=0.085, right=0.97)
    return guardar(fig, "g3_cuadrantes", locale)


# ---------------------------------------------------------------- g4
def g4_donde_van_las_visitas(locale):
    """Dónde está el volumen contra dónde va el esfuerzo, médico por médico."""
    t = TEXTOS[locale]
    m = D["medicos_2023"]
    dec = m["deciles"]
    fuera = m["comidas"]["Xarelto"]["a_medicos_sin_fila_en_la_clase"]["pct_comidas"]
    rec = [d["pct_recetas"] for d in dec]
    vis = [d["pct_comidas_xarelto"] for d in dec] + [fuera]
    n = len(dec)

    fig, ax = plt.subplots(figsize=(10, 6.4), dpi=200)
    w = 0.4
    ax.bar([i - w / 2 for i in range(n)], rec, w, color=GRIS_AZUL, label=t["g4_rec"], zorder=2)
    ax.bar([i + w / 2 for i in range(n)] + [n], vis, w, color=AMBAR, label=t["g4_vis"], zorder=2)
    for x, val, color in ((0 - w / 2, rec[0], GRAY), (0 + w / 2, vis[0], AMBAR), (n, fuera, AMBAR)):
        ax.text(x, val + 1.0, num(val, locale) + "%", ha="center", fontsize=11, fontweight="bold", color=color)
    ax.axvline(n - 0.55, color=GRAY, lw=1, ls="--", zorder=1)

    ax.set_xticks(list(range(n + 1)))
    ax.set_xticklabels([str(d["decil"]) for d in dec] + [t["g4_fuera"]], fontsize=10)
    ax.set_xlabel(t["g4_eje_x"])
    ax.set_ylabel(t["g4_eje_y"])
    ax.set_ylim(0, max(rec + vis) * 1.15)
    ax.spines[["top", "right"]].set_visible(False)
    ax.legend(frameon=False, loc="upper right", fontsize=10)

    titulo(fig, t["g4_titulo"].format(rec=num(rec[0], locale), vis=num(vis[0], locale)))
    pie(fig, t, t["g4_nota"], fuentes=("op", "medico"))
    fig.subplots_adjust(top=0.80, bottom=0.34, left=0.075, right=0.97)
    return guardar(fig, "g4_donde_van_las_visitas", locale)


# ---------------------------------------------------------------- g5
TEXTOS_G5 = {
    "es": {
        "titulo": ("En 2013 Xarelto tenía {c13} de cada 100 recetas de los dos en Medicare.\n"
                   "Eliquis lo pasó en {cruce}, y en 2024 a Xarelto le quedaban {c24}."),
        "eje_y": "recetas de Xarelto de cada 100 de los dos",
        "empate": "empate",
        "trimestral": "archivo trimestral",
        "nota": ("Recetas de cada marca en Part D, fila nacional de cada año (2013 a 2024). 2025 y el primer trimestre de 2026\n"
                 "salen del archivo trimestral de gasto, que cuenta distinto, y se marcan aparte.\n"),
    },
    "en": {
        "titulo": ("In 2013 Xarelto had {c13} of every 100 prescriptions of the two in Medicare.\n"
                   "Eliquis passed it in {cruce}, and by 2024 Xarelto was down to {c24}."),
        "eje_y": "Xarelto prescriptions per 100 of the two",
        "empate": "even",
        "trimestral": "quarterly file",
        "nota": ("Prescriptions of each brand in Part D, national row for each year (2013 to 2024). 2025 and the first quarter of 2026\n"
                 "come from the quarterly spending file, which counts differently, and are marked apart.\n"),
    },
}
# Hechos fechados que se dibujan sobre la serie. Cada uno está en facts.md con su fuente.
EVENTOS_G5 = [
    (2014.95, {"es": "dic 2014: demandas", "en": "Dec 2014: lawsuits"}),
    (2016.78, {"es": "oct 2016: FDA, INRatio", "en": "Oct 2016: FDA, INRatio"}),
    (2019.08, {"es": "ene 2019: Beers, precaución", "en": "Jan 2019: Beers, caution"}),
    (2021.97, {"es": "dic 2021: estudio JAMA", "en": "Dec 2021: JAMA study"}),
    (2023.34, {"es": "may 2023: Beers, evitar", "en": "May 2023: Beers, avoid"}),
    (2024.85, {"es": "nov 2024: sin visita (Bayer)", "en": "Nov 2024: no reps (Bayer)"}),
]


def g5_la_serie(locale):
    """La historia larga: la cuota de Xarelto frente a Eliquis desde 2013, con lo último publicado."""
    t, base = TEXTOS_G5[locale], TEXTOS[locale]
    h = D["serie_historica"]
    anios = [int(i["anio"]) for i in h["serie"]]
    cuota = [i["cuota_xarelto_recetas_pct"] for i in h["serie"]]
    cruce = h["primer_anio_eliquis_supera_a_xarelto"]["recetas"]
    rec = [(2025, h["recientes"]["2025 (Q1-Q4)"]["cuotas"]["xarelto_marca_sobre_xarelto_y_eliquis_pct"]),
           (2026, h["recientes"]["2026 (Q1)"]["cuotas"]["xarelto_marca_sobre_xarelto_y_eliquis_pct"])]

    fig, ax = plt.subplots(figsize=(10, 6.4), dpi=200)
    ax.axhline(50, color=GRAY, lw=1, ls="--", zorder=1)
    ax.text(2012.6, 51.5, t["empate"], color=GRAY, fontsize=9.5, va="bottom")
    ax.plot(anios, cuota, color=AMBAR, lw=2.6, marker="o", ms=5.5, zorder=3)
    for a, c in zip(anios, cuota):
        if a in (2013, int(cruce), 2024):
            ax.text(a, c + 3, num(c, locale), ha="center", va="bottom", fontsize=10.5, color=FG, fontweight="bold")
    ax.plot([2024] + [a for a, _ in rec], [cuota[-1]] + [c for _, c in rec], color=AMBAR, lw=1.2, ls=":", zorder=2)
    ax.scatter([a for a, _ in rec], [c for _, c in rec], s=42, facecolor=BG, edgecolor=AMBAR, lw=1.6, zorder=4)
    for (a, c), etq in zip(rec, ("2025", "2026 T1" if locale == "es" else "2026 Q1")):
        ax.text(a, c - 4, f"{num(c, locale)}\n{etq}", ha="center", va="top", fontsize=9, color=GRAY)
    ax.text(2025.5, rec[0][1] + 7, t["trimestral"], ha="center", fontsize=9, color=GRAY)
    for anio, texto in EVENTOS_G5:
        ax.axvline(anio, color=GRIS_AZUL, lw=1, zorder=1)
        abajo = anio < 2016
        ax.text(anio - 0.06, 1 if abajo else 99, texto[locale], rotation=90, ha="right",
                va="bottom" if abajo else "top", fontsize=8, color=GRIS_OSCURO)
    ax.set_xlim(2012.4, 2026.6)
    ax.set_ylim(0, 100)
    ax.set_xticks(list(range(2013, 2027)))
    ax.set_xticklabels([str(a) for a in range(2013, 2027)], fontsize=9.5)
    ax.set_ylabel(t["eje_y"])
    ax.spines[["top", "right"]].set_visible(False)

    titulo(fig, t["titulo"].format(c13=round(cuota[0]), cruce=cruce, c24=round(cuota[-1])))
    pie(fig, base, t["nota"], fuentes=("geo", "trimestral"))
    fig.subplots_adjust(top=0.80, bottom=0.28, left=0.09, right=0.97)
    return guardar(fig, "g5_la_serie", locale)


# ---------------------------------------------------------------- g6
TEXTOS_G6 = {
    "es": {
        "titulo": ("Hasta {ultimo_x} Xarelto sumaba más pacientes por año que Eliquis.\n"
                   "Desde {primero_e} suma más Eliquis, y en {resta} Xarelto restó."),
        "eje_y": "pacientes sumados contra el año anterior, en miles",
        "nota": ("Diferencia neta de pacientes de cada marca contra el año anterior, fila nacional de Part D. No son pacientes nuevos:\n"
                 "quien deja una marca y empieza la otra resta en una y suma en la otra.\n"),
    },
    "en": {
        "titulo": ("Until {ultimo_x} Xarelto added more patients per year than Eliquis.\n"
                   "From {primero_e} on Eliquis adds more, and in {resta} Xarelto lost patients."),
        "eje_y": "patients added over the previous year, in thousands",
        "nota": ("Net change in patients for each brand over the previous year, national Part D row. These are not new patients:\n"
                 "someone who leaves one brand for the other subtracts from one and adds to the other.\n"),
    },
}


def g6_quien_suma(locale):
    """Quién se queda con los pacientes que suma el mercado, año por año."""
    t, base = TEXTOS_G6[locale], TEXTOS[locale]
    serie = [i for i in D["serie_historica"]["serie"] if "suma_pacientes_xarelto" in i]
    anios = [int(i["anio"]) for i in serie]
    x = [i["suma_pacientes_xarelto"] / 1000 for i in serie]
    e = [i["suma_pacientes_eliquis"] / 1000 for i in serie]
    ultimo_x = max(a for a, xi, ei in zip(anios, x, e) if xi > ei)
    primero_e = min(a for a, xi, ei in zip(anios, x, e) if ei > xi and a > ultimo_x)
    resta = next(a for a, xi in zip(anios, x) if xi < 0)

    fig, ax = plt.subplots(figsize=(10, 6.4), dpi=200)
    ancho = 0.38
    ax.bar([a - ancho / 2 for a in anios], x, ancho, color=AMBAR, label="Xarelto", zorder=2)
    ax.bar([a + ancho / 2 for a in anios], e, ancho, color=AZUL, label="Eliquis", zorder=2)
    ax.axhline(0, color=GRAY, lw=1, zorder=1)
    for a, xi in zip(anios, x):
        if a == resta:
            ax.text(a - ancho / 2, xi - 12, num(xi, locale, 1), ha="center", va="top", fontsize=9, color=AMBAR)
    ax.set_xticks(anios)
    ax.set_xticklabels([str(a) for a in anios], fontsize=10)
    ax.set_ylabel(t["eje_y"])
    ax.spines[["top", "right"]].set_visible(False)
    ax.legend(frameon=False, loc="upper left", fontsize=10.5)

    titulo(fig, t["titulo"].format(ultimo_x=ultimo_x, primero_e=primero_e, resta=resta))
    pie(fig, base, t["nota"], fuentes=("geo",))
    fig.subplots_adjust(top=0.80, bottom=0.28, left=0.09, right=0.97)
    return guardar(fig, "g6_quien_suma", locale)


# ---------------------------------------------------------------- g7
TEXTOS_G7 = {
    "es": {
        "titulo": ("Xarelto pasó de {x_ini} comidas con médicos por mes en {a_ini}\n"
                   "a {x_fin} en {a_fin}. Eliquis, de {e_ini} a {e_fin}."),
        "eje_y": "comidas declaradas por mes",
        "evento": "nov 2024: fin de la visita\npresencial, según Bayer",
        "evento_2022": "fines de 2022: recorte de más del 70%, según Bayer",
        "nota": ("Comidas declaradas en Open Payments que nombran a cada producto, por mes de pago. Una comida compartida con otros\n"
                 "productos cuenta entera para cada uno. {a_fin} es el último año publicado.\n"),
    },
    "en": {
        "titulo": ("Xarelto went from {x_ini} meals with doctors per month in {a_ini}\n"
                   "to {x_fin} in {a_fin}. Eliquis, from {e_ini} to {e_fin}."),
        "eje_y": "reported meals per month",
        "evento": "Nov 2024: in-person sales\nforce ended, per Bayer",
        "evento_2022": "late 2022: cut of over 70%, per Bayer",
        "nota": ("Meals reported in Open Payments that name each drug, by payment month. A meal shared with other products\n"
                 "counts in full for each. {a_fin} is the latest published year.\n"),
    },
}


def g7_comidas_por_mes(locale):
    """El esfuerzo presencial en el tiempo: comidas declaradas por mes, para contrastar la demanda de Bayer."""
    datos = D.get("pagos_por_anio") or {}
    anios = [a for a in ("2022", "2023", "2024", "2025") if datos.get(a)]
    if len(anios) < 2:
        print("  g7 sin datos suficientes de pagos_por_anio, no se dibuja")
        return None
    t, base = TEXTOS_G7[locale], TEXTOS[locale]
    serie = {m: {} for m in ("Xarelto", "Eliquis")}
    for a in anios:
        for m in serie:
            serie[m].update(datos[a][m]["comidas_por_mes"])
    meses = sorted(k for k in set(serie["Xarelto"]) | set(serie["Eliquis"]) if k[:4] in anios)
    pos = list(range(len(meses)))

    fig, ax = plt.subplots(figsize=(10, 6.4), dpi=200)
    ax.plot(pos, [serie["Eliquis"].get(k, 0) for k in meses], color=AZUL, lw=2.2, label="Eliquis", zorder=3)
    ax.plot(pos, [serie["Xarelto"].get(k, 0) for k in meses], color=AMBAR, lw=2.6, label="Xarelto", zorder=3)
    if "2022-12" in meses:
        i = meses.index("2022-12")
        ax.axvline(i, color=GRIS_AZUL, lw=1, zorder=1)
        ax.text(i + 0.3, ax.get_ylim()[1] * 0.97, t["evento_2022"], fontsize=9, color=GRIS_OSCURO, va="top")
    if "2024-11" in meses:
        i = meses.index("2024-11")
        ax.axvline(i, color=GRIS_AZUL, lw=1, zorder=1)
        ax.text(i + 0.3, ax.get_ylim()[1] * 0.2, t["evento"], fontsize=9, color=GRIS_OSCURO, va="center", ha="left",
                linespacing=1.3)
    ax.set_xticks([i for i, k in enumerate(meses) if k.endswith("-01") or k.endswith("-07")])
    ax.set_xticklabels([k for k in meses if k.endswith("-01") or k.endswith("-07")], fontsize=9.5)
    ax.set_ylabel(t["eje_y"])
    ax.set_ylim(0, None)
    ax.yaxis.set_major_formatter(plt.FuncFormatter(lambda v, _: num(v, locale, 0)))
    ax.spines[["top", "right"]].set_visible(False)
    ax.legend(frameon=False, loc="lower left", fontsize=10.5)

    def promedio(m, a):
        # Promedio sobre los doce meses del año: un mes sin comidas declaradas cuenta como cero.
        return num(sum(c for k, c in serie[m].items() if k.startswith(a)) / 12, locale, 0)

    a_ini, a_fin = anios[0], anios[-1]
    titulo(fig, t["titulo"].format(x_ini=promedio("Xarelto", a_ini), x_fin=promedio("Xarelto", a_fin),
                                   e_ini=promedio("Eliquis", a_ini), e_fin=promedio("Eliquis", a_fin),
                                   a_ini=a_ini, a_fin=a_fin))
    pie(fig, base, t["nota"].format(a_fin=a_fin), fuentes=("op",))
    fig.subplots_adjust(top=0.80, bottom=0.28, left=0.09, right=0.97)
    return guardar(fig, "g7_comidas_por_mes", locale)


# ---------------------------------------------------------------- g8
TEXTOS_G8 = {
    "es": {
        "titulo": ("En 2026 los comprimidos que compiten están cubiertos\n"
                   "para {cub} millones de afiliados, sin trabas para ninguno."),
        "eje_x": "millones de afiliados de Medicare",
        "filas": ["cubiertos", "con terapia\nescalonada", "con autorización\nprevia", "con tope\nde cantidad"],
        "nota": ("Formulario de agosto de 2026, comprimidos de Xarelto de 10, 15 y 20 mg contra comprimidos de Eliquis de 2,5 y 5 mg.\n"
                 "Afiliados de planes con cobertura de medicamentos y condado identificado.\n"),
    },
    "en": {
        "titulo": ("In 2026 the competing tablets are covered for {cub} million\n"
                   "enrollees, with no restrictions on either drug."),
        "eje_x": "millions of Medicare enrollees",
        "filas": ["covered", "with step\ntherapy", "with prior\nauthorization", "with quantity\nlimits"],
        "nota": ("August 2026 formulary file, Xarelto 10, 15 and 20 mg tablets against Eliquis 2.5 and 5 mg tablets.\n"
                 "Enrollees in plans with drug coverage and an identified county.\n"),
    },
}


def g8_acceso_2026(locale):
    """El acceso, en un solo cuadro: cubiertos, trabas y topes de los dos productos."""
    t, base = TEXTOS_G8[locale], TEXTOS[locale]
    pres = D["acceso_por_presentacion"]["2026"]["presentaciones"]
    kx = next(k for k in pres if k.startswith("Xarelto · comprimidos 10/15/20"))
    ke = next(k for k in pres if k.startswith("Eliquis · comprimidos"))
    campos = ["vidas_cubiertas", "vidas_con_escalonada", "vidas_con_autorizacion_previa", "vidas_con_tope_de_cantidad"]
    x = [pres[kx][c] / 1e6 for c in campos]
    e = [pres[ke][c] / 1e6 for c in campos]

    fig, ax = plt.subplots(figsize=(10, 6.4), dpi=200)
    y = list(range(len(campos)))[::-1]
    alto = 0.36
    ax.barh([i + alto / 2 for i in y], x, alto, color=AMBAR, label="Xarelto", zorder=2)
    ax.barh([i - alto / 2 for i in y], e, alto, color=AZUL, label="Eliquis", zorder=2)
    for i, (vx, ve) in zip(y, zip(x, e)):
        for v, off in ((vx, alto / 2), (ve, -alto / 2)):
            ax.text(v + 0.6, i + off, num(v, locale, 2) if v < 1 else num(v, locale, 1), va="center",
                    fontsize=10.5, color=FG)
    ax.set_yticks(y)
    ax.set_yticklabels(t["filas"], fontsize=11)
    ax.set_xlim(0, max(x + e) * 1.18)
    ax.set_xlabel(t["eje_x"])
    ax.spines[["top", "right", "left"]].set_visible(False)
    ax.tick_params(axis="y", length=0)
    ax.legend(frameon=False, loc="lower right", fontsize=10.5)

    titulo(fig, t["titulo"].format(cub=num(x[0], locale, 2)))
    pie(fig, base, t["nota"], fuentes=("formulario", "padron"))
    fig.subplots_adjust(top=0.80, bottom=0.30, left=0.20, right=0.97)
    return guardar(fig, "g8_acceso_2026", locale)


# ---------------------------------------------------------------- g9
TEXTOS_G9 = {
    "es": {
        "titulo": ("El paciente que Xarelto conserva sigue en tratamiento {x} días al año,\n"
                   "como el de Eliquis ({e}). Lo que perdió son los que empiezan."),
        "eje_y": "días de tratamiento por paciente y por año",
        "nota": ("Envases de 30 días que CMS estandariza, divididos por los pacientes con al menos una receta en el año\n"
                 "y multiplicados por 30.\n"
                 "El que empieza a mitad de año baja el promedio, y Eliquis suma pacientes todos los años: el sesgo juega\n"
                 "en contra de Eliquis, así que esto dice que Xarelto no retiene peor, no que retenga mejor.\n"),
    },
    "en": {
        "titulo": ("The patient Xarelto keeps stays on therapy {x} days a year,\n"
                   "like Eliquis's ({e}). What it lost are the ones starting out."),
        "eje_y": "days of therapy per patient per year",
        "nota": ("CMS-standardized 30-day fills divided by patients with at least one prescription that year,\n"
                 "times 30.\n"
                 "Patients starting mid-year lower the average, and Eliquis adds patients every year: the bias works\n"
                 "against Eliquis, so this says Xarelto does not retain worse, not that it retains better.\n"),
    },
}


def g9_persistencia(locale):
    """Días de tratamiento por paciente: la parte del negocio que Xarelto no perdió."""
    t, base = TEXTOS_G9[locale], TEXTOS[locale]
    serie = [i for i in D["persistencia"]["por_anio"] if int(i["anio"]) >= 2016]
    anios = [int(i["anio"]) for i in serie]
    x = [i["Xarelto"]["dias_por_paciente"] for i in serie]
    e = [i["Eliquis"]["dias_por_paciente"] for i in serie]

    fig, ax = plt.subplots(figsize=(10, 6.4), dpi=200)
    ax.plot(anios, x, color=AMBAR, lw=2.6, marker="o", ms=5, label="Xarelto", zorder=3)
    ax.plot(anios, e, color=AZUL, lw=2.6, marker="o", ms=5, label="Eliquis", zorder=3)
    for serie_v, color, off in ((x, AMBAR, 7), (e, AZUL, -13)):
        ax.text(anios[-1] + 0.12, serie_v[-1] + off, num(serie_v[-1], locale, 0), color=color,
                fontsize=11, fontweight="bold", va="center")
    ax.set_xticks(anios)
    ax.set_xticklabels([str(a) for a in anios], fontsize=10)
    ax.set_ylim(min(e + x) - 25, max(e + x) + 25)
    ax.set_xlim(anios[0] - 0.3, anios[-1] + 0.9)
    ax.set_ylabel(t["eje_y"])
    ax.spines[["top", "right"]].set_visible(False)
    ax.legend(frameon=False, loc="lower right", fontsize=10.5)

    titulo(fig, t["titulo"].format(x=num(x[-1], locale, 0), e=num(e[-1], locale, 0)))
    pie(fig, base, t["nota"], fuentes=("geo",))
    fig.subplots_adjust(top=0.80, bottom=0.30, left=0.10, right=0.97)
    return guardar(fig, "g9_persistencia", locale)


if __name__ == "__main__":
    for locale in TEXTOS:
        print(f"gráficos de acceso-parte-d [{locale}]:")
        for hacer in (g1_cuota_de_pacientes, g2_pagos_visitas_recetas, g3_cuadrantes, g4_donde_van_las_visitas, g5_la_serie, g6_quien_suma, g7_comidas_por_mes, g8_acceso_2026, g9_persistencia):
            hacer(locale)
