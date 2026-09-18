"""Gráficos del caso leqembi-kisunla (anticuerpos contra el amiloide en Medicare tradicional).

Regenerable = auditable: lee `data/leqembi-kisunla/cache/numeros.json`, que produce
`scripts/analysis/leqembi-kisunla.py`. Ningún número está escrito a mano y los títulos se calculan de
los datos.

El caso sale en dos capas. Los gráficos del pitch van a `public/projects/leqembi-kisunla/` y los del
análisis completo a `public/projects/leqembi-kisunla-analisis/`:

- `g1_el_cruce` (pitch): de cada 100 pacientes y de cada 100 dólares de los dos, cuántos son de Kisunla,
  en 2025 y en el primer trimestre de 2026.
- `g2_el_sillon` (pitch): infusiones al año que pide la etiqueta y lo que le deja al centro cada una,
  según mi cuenta.
- `g3_gasto_y_pacientes`: gasto y pacientes de cada uno, 2023 a primer trimestre de 2026.
- `g4_precio_por_mg`: límite de pago de Medicare por mg, trimestre a trimestre.
- `g5_donde_se_aplica`: pacientes de 2024 en consultorio contra hospital.
- `g6_pagos_a_profesionales`: pagos declarados en Open Payments que nombran a cada producto.
- `g7_inyeccion_en_casa`: pacientes de la subcutánea en Part D por cada 100 de Leqembi en Part B, con el
  corte fijado antes.

Mismo estilo que el resto de la serie. Leqembi, el producto del anfitrión, va en ámbar; Kisunla, en azul.
Emite los dos idiomas: `<nombre>.png` es el castellano y `<nombre>.en.png` el inglés.

Correr desde la raíz del repo:
    python3 scripts/charts/leqembi-kisunla.py
"""

import json
import textwrap
from pathlib import Path

import matplotlib.pyplot as plt

FG = "#111111"
GRAY = "#8a8a8a"
BG = "#f8f9fa"
AZUL = "#2f74dd"
AMBAR = "#c2571a"
GRIS_CLARO = "#d5d9df"

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
OUT_PITCH = RAIZ / "public" / "projects" / "leqembi-kisunla"
OUT_ANALISIS = RAIZ / "public" / "projects" / "leqembi-kisunla-analisis"
DEL_PITCH = ("g1_", "g2_")
D = json.loads((RAIZ / "data" / "leqembi-kisunla" / "cache" / "numeros.json").read_text(encoding="utf-8"))
COLOR = {"Leqembi": AMBAR, "Kisunla": AZUL}

FUENTES = {
    "es": {"trimestral_b": "gasto trimestral de la parte B por medicamento",
           "anual_b": "gasto anual de la parte B por medicamento",
           "trimestral_d": "gasto trimestral de la parte D por medicamento",
           "asp": "límites de pago de la parte B",
           "geo": "planilla del profesional por geografía y servicio",
           "op": "Open Payments"},
    "en": {"trimestral_b": "quarterly Part B spending by drug",
           "anual_b": "annual Part B spending by drug",
           "trimestral_d": "quarterly Part D spending by drug",
           "asp": "Part B payment limit files",
           "geo": "physician and other practitioners by geography and service",
           "op": "Open Payments"},
}
PIE = {"es": "Elaboración propia sobre archivos públicos de CMS: {fuentes}.\n{alcance}",
       "en": "Author's analysis of public CMS files: {fuentes}.\n{alcance}"}
ALCANCE = {
    "es": {"tradicional": "Sólo Medicare tradicional: los planes de Medicare Advantage, más de la mitad de los afiliados, no están en estos archivos.",
           "precio": "Lo que Medicare reconoce por unidad (precio promedio de venta más 6%), no el precio al que vende cada empresa.",
           "hipotesis": "Hipótesis del modelo: no es la ganancia del centro, que compra el remedio a un precio que no es público.",
           "pagos": "Pagos declarados por las empresas a profesionales de todo el país, sin distinguir la cobertura de sus pacientes.",
           "mixto_d": "Parte B: sólo Medicare tradicional. Parte D: todos los planes, Medicare Advantage incluido."},
    "en": {"tradicional": "Traditional Medicare only: Medicare Advantage plans, over half of enrollees, are not in these files.",
           "precio": "What Medicare recognizes per unit (average sales price plus 6%), not the price each company sells at.",
           "hipotesis": "Model hypothesis: not the site's profit, since the site buys the drug at a price that is not public.",
           "pagos": "Payments reported by manufacturers to clinicians nationwide, regardless of their patients' coverage.",
           "mixto_d": "Part B: traditional Medicare only. Part D: all plans, Medicare Advantage included."},
}


def num(v, locale="es", dec=1):
    s = f"{v:,.{dec}f}"
    if locale == "es":
        s = s.replace(",", "·").replace(".", ",").replace("·", ".")
    return s


def guardar(fig, nombre, locale):
    carpeta = OUT_PITCH if nombre.startswith(DEL_PITCH) else OUT_ANALISIS
    carpeta.mkdir(parents=True, exist_ok=True)
    fig.savefig(carpeta / f"{nombre}{'' if locale == 'es' else '.en'}.png", facecolor=BG)
    plt.close(fig)


def pie(fig, locale, nota="", fuentes=(), alcance="tradicional"):
    nombres = [FUENTES[locale][f] for f in fuentes]
    y = " and " if locale == "en" else " y "
    lista = nombres[0] if len(nombres) == 1 else ", ".join(nombres[:-1]) + y + nombres[-1]
    primera, resto = PIE[locale].format(fuentes=lista, alcance=ALCANCE[locale][alcance]).split("\n", 1)
    texto = "\n".join(textwrap.wrap(primera, 105)) + "\n" + resto
    fig.text(0.055, 0.028, nota + texto, fontsize=8.5, color=GRAY, ha="left", va="bottom", linespacing=1.5)
    fig.text(0.955, 0.028, "ivandujaut.com", fontsize=9.5, color=GRAY, ha="right")


def titulo(fig, texto):
    fig.text(0.055, 0.965, texto, fontsize=16, fontweight="bold", ha="left", va="top", linespacing=1.25)


TRIM = D["part_b"]["trimestral"]
ANIO25, T126 = "2025 (Q1-Q4)", "2026 (Q1)"


# ---------------------------------------------------------------- g1
TEXTOS_G1 = {
    "es": {"titulo": "Kisunla tenía el {p25}% de los pacientes y el {g25}% del gasto en 2025.\nEn el primer trimestre de 2026, el {p26}% y el {g26}%.",
           "filas": ["2025\npacientes", "2025\ngasto", "1er trimestre 2026\npacientes", "1er trimestre 2026\ngasto"],
           "mitad": "mitad",
           "nota": "Pacientes con al menos un reclamo de cada producto en el período, y gasto de Medicare más la parte del paciente. El archivo\ntrimestral es preliminar; 2025 cuenta pacientes de todo el año y 2026 sólo los de enero a marzo.\n"},
    "en": {"titulo": "Kisunla had {p25}% of patients and {g25}% of spending in 2025.\nIn the first quarter of 2026, {p26}% and {g26}%.",
           "filas": ["2025\npatients", "2025\nspending", "Q1 2026\npatients", "Q1 2026\nspending"],
           "mitad": "half",
           "nota": "Patients with at least one claim for each drug in the period, and Medicare spending plus the patient's share. The quarterly\nfile is preliminary; 2025 counts patients across the year and 2026 only January to March.\n"},
}


def cuota_kisunla(periodo, campo):
    k, l = TRIM["Kisunla"][periodo][campo], TRIM["Leqembi"][periodo][campo]
    return 100 * k / (k + l)


def g1_el_cruce(locale):
    """El síntoma: el gasto se cruzó y los pacientes no."""
    t = TEXTOS_G1[locale]
    k = [cuota_kisunla(ANIO25, "pacientes"), cuota_kisunla(ANIO25, "gasto"),
         cuota_kisunla(T126, "pacientes"), cuota_kisunla(T126, "gasto")]
    fig, ax = plt.subplots(figsize=(10, 6.4), dpi=200)
    pos = [3.3, 2.5, 1.0, 0.2]
    for y, kv in zip(pos, k):
        ax.barh(y, 100 - kv, 0.62, color=AMBAR, zorder=2)
        ax.barh(y, kv, 0.62, left=100 - kv + 0.4, color=AZUL, zorder=2)
        ax.text((100 - kv) / 2, y, f"Leqembi {num(100 - kv, locale)}%", ha="center", va="center",
                color="white", fontsize=11.5, fontweight="bold", zorder=3)
        ax.text(100 - kv + 0.4 + kv / 2, y, f"Kisunla {num(kv, locale)}%", ha="center", va="center",
                color="white", fontsize=11.5, fontweight="bold", zorder=3)
    ax.axvline(50, color=FG, lw=1.2, ls=(0, (4, 3)), zorder=4)
    ax.text(50, 3.85, t["mitad"], ha="center", va="bottom", fontsize=10, color=FG)
    ax.set_yticks(pos)
    ax.set_yticklabels(t["filas"], fontsize=11)
    ax.set_xlim(0, 100.4)
    ax.set_ylim(-0.4, 4.0)
    ax.set_xticks([])
    ax.spines[["top", "right", "bottom", "left"]].set_visible(False)
    ax.tick_params(axis="y", length=0)
    titulo(fig, t["titulo"].format(p25=num(k[0], locale), g25=num(k[1], locale),
                                   p26=num(k[2], locale), g26=num(k[3], locale)))
    pie(fig, locale, t["nota"], fuentes=("trimestral_b",))
    fig.subplots_adjust(top=0.82, bottom=0.25, left=0.2, right=0.97)
    guardar(fig, "g1_el_cruce", locale)


# ---------------------------------------------------------------- g2
TEXTOS_G2 = {
    "es": {"titulo": "Kisunla pide la mitad de las infusiones y, en mi cuenta, a dosis completa\nal centro le deja entre {bajo} y {alto} veces más por cada una.",
           "izq": "infusiones al año al empezar,\nsegún la etiqueta",
           "der": "lo que le deja al centro cada infusión\na dosis completa, en dólares (mi cuenta)",
           "rango": "USD {a} a {b}",
           "nota": ("Por infusión: el 6% del límite de pago de julio de 2026 (Leqembi a {mg} mg, la media de 2024 en consultorio; Kisunla a 1.400 mg)\n"
                    "más el monto permitido por aplicarla en consultorio en 2024, USD {c1} (código 96365) o USD {c2} (96413): cuál se usa no es público.\n")},
    "en": {"titulo": "Kisunla needs half the infusions and, by my math, at full dose leaves\nthe site {bajo} to {alto} times more for each one.",
           "izq": "infusions per year at the start,\nper the label",
           "der": "what each full-dose infusion leaves\nthe site, in dollars (my math)",
           "rango": "USD {a} to {b}",
           "nota": ("Per infusion: 6% of the July 2026 payment limit (Leqembi at {mg} mg, the 2024 office average; Kisunla at 1,400 mg)\n"
                    "plus the 2024 office allowed amount for administering it, USD {c1} (code 96365) or USD {c2} (96413): which is used is not public.\n")},
}


def g2_el_sillon(locale):
    """El mecanismo: la mitad de los turnos y más por turno para el centro."""
    t = TEXTOS_G2[locale]
    e = D["economia_del_centro"]
    marcas = ["Leqembi", "Kisunla"]
    fig, (a1, a2) = plt.subplots(1, 2, figsize=(10, 6.4), dpi=200, gridspec_kw={"width_ratios": [1, 1.35]})
    infus = {"Leqembi": 26, "Kisunla": 13}
    for i, m in enumerate(marcas):
        a1.bar(i, infus[m], 0.6, color=COLOR[m], zorder=2)
        a1.text(i, infus[m] + 0.6, str(infus[m]), ha="center", va="bottom", fontsize=13, fontweight="bold", color=FG)
    a1.set_xticks([0, 1])
    a1.set_xticklabels(marcas, fontsize=11)
    a1.set_ylim(0, 31)
    a1.set_yticks([])
    a1.set_title(t["izq"], fontsize=10.5, color=GRAY, loc="left")
    a1.spines[["top", "right", "left"]].set_visible(False)

    for i, m in enumerate(marcas):
        bajo, alto = e["por_producto"][m]["al_centro_por_infusion"]
        a2.bar(i, alto - bajo, 0.6, bottom=bajo, color=COLOR[m], zorder=2)
        a2.text(i, alto + 8, t["rango"].format(a=num(bajo, locale, 0), b=num(alto, locale, 0)), ha="center",
                va="bottom", fontsize=12, fontweight="bold", color=FG)
    a2.set_xticks([0, 1])
    a2.set_xticklabels(marcas, fontsize=11)
    a2.set_ylim(0, 340)
    a2.set_ylabel("USD", fontsize=10)
    a2.set_title(t["der"], fontsize=10.5, color=GRAY, loc="left")
    a2.spines[["top", "right"]].set_visible(False)

    r = e["kisunla_sobre_leqembi_por_infusion"]
    cargos = e["cargo_por_aplicar"]
    titulo(fig, t["titulo"].format(bajo=num(r[0], locale), alto=num(r[1], locale)))
    pie(fig, locale, t["nota"].format(mg=num(e["mg_por_infusion_leqembi"], locale, 0),
                                      c1=num(cargos["96365"], locale, 2), c2=num(cargos["96413"], locale, 2)),
        fuentes=("asp", "geo"), alcance="hipotesis")
    fig.subplots_adjust(top=0.78, bottom=0.27, left=0.06, right=0.97, wspace=0.25)
    guardar(fig, "g2_el_sillon", locale)


# ---------------------------------------------------------------- g3
TEXTOS_G3 = {
    "es": {"titulo": "Leqembi sigue teniendo más pacientes en Medicare tradicional, pero en\nel primer trimestre de 2026 Kisunla ya se lleva más gasto.",
           "periodos": ["2023", "2024", "2025", "1er trim.\n2026"],
           "gasto": "gasto, millones de USD", "pacientes": "pacientes, miles",
           "costura": "anual  |  trimestral, preliminar",
           "nota": "2023 y 2024 salen del archivo anual; 2025 y el primer trimestre de 2026, del trimestral, que CMS pide comparar con cautela.\nUn período de tres meses cuenta menos pacientes que uno de doce: las barras se comparan entre productos, no entre períodos.\n"},
    "en": {"titulo": "Leqembi still has more patients in traditional Medicare, but in the\nfirst quarter of 2026 Kisunla already takes more spending.",
           "periodos": ["2023", "2024", "2025", "Q1\n2026"],
           "gasto": "spending, USD millions", "pacientes": "patients, thousands",
           "costura": "annual  |  quarterly, preliminary",
           "nota": "2023 and 2024 come from the annual file; 2025 and Q1 2026 from the quarterly file, which CMS says to compare with caution.\nA three-month period counts fewer patients than a twelve-month one: compare the bars across drugs, not across periods.\n"},
}


def g3_gasto_y_pacientes(locale):
    t = TEXTOS_G3[locale]
    anual = D["part_b"]["anual"]

    def serie(m, campo):
        out = []
        for a in ("2023", "2024"):
            v = anual.get(m, {}).get(a)
            out.append(v[campo] if v else 0)
        for p in (ANIO25, T126):
            out.append(TRIM[m][p][campo])
        return out

    fig, (a1, a2) = plt.subplots(2, 1, figsize=(10, 6.4), dpi=200, sharex=True)
    ancho = 0.36
    pos = [0, 1, 2.3, 3.3]
    for ax, campo, escala, dec in ((a1, "gasto", 1e6, 1), (a2, "pacientes", 1e3, 1)):
        for j, m in enumerate(["Leqembi", "Kisunla"]):
            vals = [v / escala for v in serie(m, campo)]
            xs = [p + (j - 0.5) * ancho for p in pos]
            ax.bar(xs, vals, ancho, color=COLOR[m], label=m, zorder=2)
            for x, v in zip(xs, vals):
                if v:
                    ax.text(x, v, " " + num(v, locale, dec), ha="center", va="bottom", fontsize=8.5, color=FG, rotation=0)
        ax.axvline(1.65, color=GRAY, lw=1, ls=":")
        ax.spines[["top", "right"]].set_visible(False)
        ax.set_ylabel(t[campo], fontsize=9.5)
        ax.margins(y=0.25)
    a1.text(1.65, a1.get_ylim()[1] * 1.02, t["costura"], fontsize=8.5, color=GRAY, va="bottom", ha="center")
    a1.legend(frameon=False, loc="upper left", fontsize=10)
    a2.set_xticks(pos)
    a2.set_xticklabels(t["periodos"], fontsize=10.5)
    titulo(fig, t["titulo"])
    pie(fig, locale, t["nota"], fuentes=("anual_b", "trimestral_b"))
    fig.subplots_adjust(top=0.82, bottom=0.25, left=0.09, right=0.97, hspace=0.12)
    guardar(fig, "g3_gasto_y_pacientes", locale)


# ---------------------------------------------------------------- g4
TEXTOS_G4 = {
    "es": {"titulo": "Medicare reconoce por cada mg de Kisunla un {dif}% más que por uno de\nLeqembi, y los dos casi no se movieron desde que entraron al archivo.",
           "eje": "dólares por mg", 
           "nota": "Límite de pago trimestral de la parte B dividido por los mg de la unidad de cada código (Leqembi J0174, 1 mg; Kisunla J0175, 2 mg).\nCada punto es el trimestre en que empieza a regir; el de octubre de 2026, todavía preliminar, no entra.\n"},
    "en": {"titulo": "Medicare recognizes {dif}% more per mg of Kisunla than per mg of\nLeqembi, and both have barely moved since entering the file.",
           "eje": "dollars per mg", 
           "nota": "Quarterly Part B payment limit divided by the mg in each code's unit (Leqembi J0174, 1 mg; Kisunla J0175, 2 mg).\nEach point is the quarter it takes effect; October 2026, still preliminary, is left out.\n"},
}


def g4_precio_por_mg(locale):
    t = TEXTOS_G4[locale]
    asp = D["asp"]
    mg = {"Leqembi": 1, "Kisunla": 2}
    claves = [c for c in sorted(asp) if "preliminar" not in c and c >= "2023-10"]
    fig, ax = plt.subplots(figsize=(10, 6.4), dpi=200)
    for m in ("Leqembi", "Kisunla"):
        xs, ys = [], []
        for i, c in enumerate(claves):
            if m in asp[c]["codigos"]:
                xs.append(i)
                ys.append(asp[c]["codigos"][m]["limite_por_unidad"] / mg[m])
        ax.plot(xs, ys, color=COLOR[m], lw=2.6, marker="o", ms=5, label=m, zorder=3)
        ax.text(xs[-1] + 0.25, ys[-1], f"{m} {num(ys[-1], locale, 2)}", color=COLOR[m], fontsize=11,
                fontweight="bold", va="center")
    final = claves[-1]
    dif = 100 * (asp[final]["codigos"]["Kisunla"]["limite_por_unidad"] / 2 / asp[final]["codigos"]["Leqembi"]["limite_por_unidad"] - 1)
    etiquetas = [c[:7].replace("-01", " T1").replace("-04", " T2").replace("-07", " T3").replace("-10", " T4") for c in claves]
    if locale == "en":
        etiquetas = [e.replace(" T", " Q") for e in etiquetas]
    ax.yaxis.set_major_formatter(plt.FuncFormatter(lambda v, _: num(v, locale, 1)))
    ax.set_xticks(range(len(claves)))
    ax.set_xticklabels(etiquetas, fontsize=8.5, rotation=45, ha="right")
    ax.set_xlim(-0.5, len(claves) + 1.2)
    ax.set_ylim(0, 2.6)
    ax.set_ylabel(t["eje"])
    ax.spines[["top", "right"]].set_visible(False)
    ax.legend(frameon=False, loc="lower left", fontsize=10.5)
    titulo(fig, t["titulo"].format(dif=num(dif, locale, 0)))
    pie(fig, locale, t["nota"], fuentes=("asp",), alcance="precio")
    fig.subplots_adjust(top=0.82, bottom=0.3, left=0.09, right=0.97)
    guardar(fig, "g4_precio_por_mg", locale)


# ---------------------------------------------------------------- g5
TEXTOS_G5 = {
    "es": {"titulo": "En 2024, el {k}% de los pacientes de Kisunla se trató en consultorio,\ncontra el {l}% de los de Leqembi.",
           "cons": "consultorio", "hosp": "hospital (estimado)",
           "nota": "Consultorio: pacientes en la planilla del profesional. Hospital: la diferencia con el total del archivo anual de la parte B, una\nestimación, porque un paciente puede aparecer en los dos lados. Kisunla se aprobó en julio de 2024.\n"},
    "en": {"titulo": "In 2024, {k}% of Kisunla patients were treated in an office,\nversus {l}% of Leqembi patients.",
           "cons": "office", "hosp": "hospital (estimated)",
           "nota": "Office: patients in the physician and other practitioners file. Hospital: the difference from the annual Part B total, an\nestimate, since a patient can show up on both sides. Kisunla was approved in July 2024.\n"},
}


def g5_donde_se_aplica(locale):
    t = TEXTOS_G5[locale]
    c = D["consultorio_sobre_total"]["2024"]
    fig, ax = plt.subplots(figsize=(10, 6.4), dpi=200)
    for y, m in ((1.2, "Leqembi"), (0.2, "Kisunla")):
        cons = 100 * c[m]["cuota_consultorio_pacientes"]
        ax.barh(y, cons, 0.6, color=COLOR[m], zorder=2)
        ax.barh(y, 100 - cons, 0.6, left=cons + 0.4, color=GRIS_CLARO, zorder=2)
        ax.text(cons / 2, y, f"{t['cons']} {num(cons, locale, 0)}%", ha="center", va="center", color="white",
                fontsize=12, fontweight="bold")
        ax.text(cons + 0.4 + (100 - cons) / 2, y, f"{num(100 - cons, locale, 0)}%", ha="center", va="center",
                color=FG, fontsize=11)
    ax.text(100, 1.62, t["hosp"], ha="right", va="bottom", fontsize=10, color=GRAY)
    ax.set_yticks([1.2, 0.2])
    ax.set_yticklabels(["Leqembi", "Kisunla"], fontsize=12)
    ax.set_xlim(0, 100.4)
    ax.set_xticks([])
    ax.spines[["top", "right", "bottom", "left"]].set_visible(False)
    ax.tick_params(axis="y", length=0)
    titulo(fig, t["titulo"].format(k=num(100 * c["Kisunla"]["cuota_consultorio_pacientes"], locale, 0),
                                   l=num(100 * c["Leqembi"]["cuota_consultorio_pacientes"], locale, 0)))
    pie(fig, locale, t["nota"], fuentes=("anual_b", "geo"))
    fig.subplots_adjust(top=0.8, bottom=0.25, left=0.12, right=0.97)
    guardar(fig, "g5_donde_se_aplica", locale)


# ---------------------------------------------------------------- g6
TEXTOS_G6 = {
    "es": {"titulo": "En 2025 Lilly declaró {k} millones de dólares en pagos que nombran a\nKisunla, y Eisai y Biogen {l} millones por Leqembi.",
           "eje": "millones de USD", "amyvid": "{a} de sus {p} pagos por Kisunla\nnombran también a Amyvid, el trazador\nde Lilly para la tomografía de las placas",
           "nota": "Todos los pagos de Open Payments que nombran a cada producto: comidas, charlas, consultoría y viajes. Un pago que nombra a más\nde un producto cuenta entero para cada uno. 2025 es el último año publicado.\n"},
    "en": {"titulo": "In 2025 Lilly reported USD {k} million in payments naming Kisunla,\nand Eisai and Biogen USD {l} million naming Leqembi.",
           "eje": "USD millions", "amyvid": "{a} of its {p} Kisunla payments\nalso name Amyvid, Lilly's tracer\nfor the amyloid PET scan",
           "nota": "All Open Payments records naming each drug: meals, speaking, consulting and travel. A payment naming more than one product\ncounts in full for each. 2025 is the latest published year.\n"},
}


def g6_pagos_a_profesionales(locale):
    t = TEXTOS_G6[locale]
    op = D["open_payments"]
    anios = ["2023", "2024", "2025"]
    fig, ax = plt.subplots(figsize=(10, 6.4), dpi=200)
    ancho = 0.36
    for j, m in enumerate(["Leqembi", "Kisunla"]):
        vals = [op[a][m]["usd"] / 1e6 for a in anios]
        xs = [i + (j - 0.5) * ancho for i in range(len(anios))]
        ax.bar(xs, vals, ancho, color=COLOR[m], label=m, zorder=2)
        for x, v in zip(xs, vals):
            if v:
                ax.text(x, v + 0.05, num(v, locale, 2), ha="center", va="bottom", fontsize=10, color=FG)
    k25 = op["2025"]["Kisunla"]
    ax.annotate(t["amyvid"].format(a=num(k25["acompaniantes"].get("AMYVID", 0), locale, 0), p=num(k25["pagos"], locale, 0)),
                xy=(2 + ancho / 2, k25["usd"] / 1e6), xytext=(1.05, 4.3), fontsize=9.5, color=GRAY,
                arrowprops={"arrowstyle": "-", "color": GRAY, "lw": 0.8})
    ax.set_xticks(range(len(anios)))
    ax.set_xticklabels(anios, fontsize=11)
    ax.set_ylim(0, 5.2)
    ax.set_ylabel(t["eje"])
    ax.spines[["top", "right"]].set_visible(False)
    ax.legend(frameon=False, loc="upper left", fontsize=10.5)
    titulo(fig, t["titulo"].format(k=num(k25["usd"] / 1e6, locale, 2), l=num(op["2025"]["Leqembi"]["usd"] / 1e6, locale, 2)))
    pie(fig, locale, t["nota"], fuentes=("op",), alcance="pagos")
    fig.subplots_adjust(top=0.82, bottom=0.25, left=0.09, right=0.97)
    guardar(fig, "g6_pagos_a_profesionales", locale)


# ---------------------------------------------------------------- g7
TEXTOS_G7 = {
    "es": {"titulo": "Pacientes de la inyección en la parte D por cada 100 de Leqembi en la\nparte B: {a} en 2025 y {b} en el primer trimestre de 2026. El corte es 10.",
           "periodos": ["2025", "1er trimestre 2026", "2026 completo\n(se publica en 2027)"],
           "corte": "corte fijado antes: 10",
           "nota": "Pacientes de Leqembi Iqlik en la parte D sobre pacientes de Leqembi en la parte B. La parte D incluye a Medicare Advantage y la B no, así que\nel cociente favorece a la inyección. En los dos períodos sólo estaba aprobada para mantenimiento; para empezar, desde julio de 2026.\n"},
    "en": {"titulo": "Injection patients in Part D per 100 Leqembi patients in Part B:\n{a} in 2025 and {b} in the first quarter of 2026. The cutoff is 10.",
           "periodos": ["2025", "Q1 2026", "full 2026\n(published in 2027)"],
           "corte": "cutoff set in advance: 10",
           "nota": "Leqembi Iqlik patients in Part D over Leqembi patients in Part B. Part D includes Medicare Advantage and Part B does not, so the\nratio favors the injection. In both periods it was only approved for maintenance; for starting treatment, since July 2026.\n"},
}


def g7_inyeccion_en_casa(locale):
    t = TEXTOS_G7[locale]
    v = D["validacion_y_valor"]
    vals = [100 * v["iqlik_sobre_infusion"][ANIO25], 100 * v["iqlik_sobre_infusion"][T126]]
    fig, ax = plt.subplots(figsize=(10, 6.4), dpi=200)
    for i, val in enumerate(vals):
        ax.bar(i, val, 0.55, color=AMBAR, zorder=2)
        ax.text(i, val + 0.3, num(val, locale), ha="center", va="bottom", fontsize=13, fontweight="bold", color=FG)
    ax.bar(2, 10, 0.55, color="none", edgecolor=GRAY, ls="--", lw=1.2, zorder=2)
    ax.text(2, 5, "?", ha="center", va="center", fontsize=22, color=GRAY)
    ax.axhline(100 * v["umbral_iqlik"], color=FG, lw=1.2, ls=(0, (4, 3)), zorder=3)
    ax.text(-0.35, 100 * v["umbral_iqlik"] + 0.3, t["corte"], fontsize=10, color=FG, va="bottom")
    ax.set_xticks([0, 1, 2])
    ax.set_xticklabels(t["periodos"], fontsize=10.5)
    ax.set_ylim(0, 13)
    ax.set_yticks([])
    ax.spines[["top", "right", "left"]].set_visible(False)
    titulo(fig, t["titulo"].format(a=num(vals[0], locale), b=num(vals[1], locale)))
    pie(fig, locale, t["nota"], fuentes=("trimestral_d", "trimestral_b"), alcance="mixto_d")
    fig.subplots_adjust(top=0.82, bottom=0.25, left=0.06, right=0.97)
    guardar(fig, "g7_inyeccion_en_casa", locale)


if __name__ == "__main__":
    for locale in ("es", "en"):
        for hacer in (g1_el_cruce, g2_el_sillon, g3_gasto_y_pacientes, g4_precio_por_mg, g5_donde_se_aplica,
                      g6_pagos_a_profesionales, g7_inyeccion_en_casa):
            hacer(locale)
        print(f"gráficos de leqembi-kisunla [{locale}] listos")
