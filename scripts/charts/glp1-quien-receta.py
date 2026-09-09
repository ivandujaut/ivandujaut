"""Gráficos del caso glp1-quien-receta: la puerta de los honorarios.

Regenerable = auditable: lee los JSON de `data/glp1-quien-receta/cache/`, que
produce `scripts/analysis/glp1-quien-receta.py` corriendo la cadena de
`~/Interview/openpayments-glp1/analysis/part_d/`. Ningún número está escrito a
mano acá, y los títulos se calculan de los datos.

Tres gráficos, uno por tramo del argumento:

- `g1_la_puerta`: el hallazgo. Dos paneles con la misma población partida en
  tres clases de pago. A la izquierda el volumen de recetas de la marca, que es
  lo que se venía midiendo; a la derecha ese mismo volumen dividido por la
  práctica total del prescriptor. El panel izquierdo muestra una escalera y el
  derecho la desarma: quien recibe comidas receta más en volumen y la misma
  proporción que quien no cobró nada por esa marca.
- `g2_donde_se_abre`: dónde vale el hallazgo. La razón entre el share de quienes
  cobran honorarios y el de quienes no cobran nada por esa marca, por
  especialidad. El escenario de censura más desfavorable no se dibuja como una
  barra aparte, porque corre sobre un universo ampliado y ponerlo al lado
  invitaría a leerlo como la misma medición corregida: va nombrado en el footer.
- `g3_adentro_no_hay_escalera`: la evidencia contraria a la lectura fácil.
  Adentro del grupo que cobra honorarios, el cuartil que más cobra no es el que
  más receta.

**Cada uno se genera en los dos idiomas**, como los otros casos de la familia
GLP-1: el archivo `.png` es el castellano y el `.en.png` el inglés. Los textos
viven en el dict `TEXTOS`, con los números como plantillas para que los títulos
se sigan calculando de los datos en los dos idiomas. El formato de número también
cambia: 6,46% en castellano y 6.46% en inglés.

Estilo compartido con los charts de portal-empresas-seguros, nubank y cobranza:
fondo claro, título bold a la izquierda, ejes grises, footer de atribución abajo
a la izquierda.

Correr desde la raíz del repo:  python3 scripts/charts/glp1-quien-receta.py
"""

import json
from pathlib import Path

import matplotlib.pyplot as plt
from matplotlib.ticker import FuncFormatter

FG = "#111111"
GRAY = "#8a8a8a"
BG = "#f8f9fa"
DARK = "#2f74dd"
AMBER = "#c2571a"
AMBER_CLARO = "#e0a884"

plt.rcParams.update({
    "font.family": "DejaVu Sans",
    "text.color": FG,
    "figure.facecolor": BG,
    "axes.facecolor": BG,
    "svg.fonttype": "none",
})

RAIZ = Path(__file__).resolve().parents[2]
CACHE = RAIZ / "data" / "glp1-quien-receta" / "cache"
OUT = RAIZ / "public" / "projects" / "glp1-quien-receta"

# Las combinaciones año-marca con volumen de los dos lados. Quedan afuera las
# marcas de obesidad: Medicare casi no las cubre y ahí el cruce mide el borde
# del dataset, no conducta.
COMBOS = [(2022, "OZEMPIC"), (2024, "OZEMPIC"), (2024, "MOUNJARO")]

# Orden del argumento en g2: de donde la puerta no se abre a donde más se abre.
ORDEN_ESP = ["endocrinologia", "emergentes", "primaria", "NP/PA"]

TEXTOS = {
    "es": {
        "sufijo": "",
        "clases": ["No cobró nada\npor esa marca", "Cobró comidas,\nviajes, material",
                   "Cobró honorarios\no consultoría"],
        "g1_panel_izq": "Recetas de la marca\n(mediana por prescriptor)",
        "g1_panel_der": "Esas mismas recetas como parte\nde su práctica de Medicare",
        "g1_titulo": ("Quien recibe comidas receta un {vol:.0f}% más de Ozempic\n"
                      "y atiende una práctica un {practica:.0f}% más grande"),
        "g1_pie": ("Elaboración propia sobre CMS Open Payments (pagos) y CMS Medicare Part D "
                   "Prescribers (recetas),\ndescargados el 08/09/2026 · datos hasta 2024, el "
                   "último año publicado de Part D · cada barra es la mediana\nentre quienes "
                   "figuran recetando esa marca ese año · la práctica es el total de recetas de "
                   "Part D del prescriptor\n· Part D esconde los pares prescriptor-droga con 10 "
                   "recetas o menos, y ese recorte alcanza más al grupo sin pago"),
        "g2_esp": {
            "endocrinologia": "Endocrinología",
            "emergentes": "Cardiología, nefrología,\ngastroenterología\ny hepatología",
            "primaria": "Atención primaria",
            "NP/PA": "Enfermería y\nasistentes médicos",
        },
        "g2_sin_dif": "sin diferencia",
        "g2_eje_x": ("Veces que un profesional con honorarios receta más, como parte de su "
                     "práctica,\nque uno que no cobra nada de esa marca"),
        "g2_titulo": ("Los honorarios van con hasta {alto} veces más receta fuera de\n"
                      "la endocrinología, y {min_endo} a {max_endo} adentro"),
        "g2_pie": ("Elaboración propia sobre CMS Open Payments y CMS Medicare Part D Prescribers, "
                   "descargados el\n08/09/2026 · datos hasta 2024, el último año publicado de "
                   "Part D · «n» es cuánta gente cobró honorarios\nen esa celda · imputando a cada "
                   "prescriptor que la supresión de CMS esconde las 10 recetas del\ntecho, y sobre "
                   "el universo ampliado que esa prueba usa, el piso de los dos grupos de abajo "
                   "sigue siendo {piso}\n· ninguna de estas cifras dice en qué dirección corre la "
                   "relación"),
        "g3_cuartiles": ["Cuartil 1\n(cobró menos)", "Cuartil 2", "Cuartil 3",
                         "Cuartil 4\n(cobró más)"],
        "g3_eje_y": "Recetas de la marca\n(mediana por prescriptor)",
        "g3_titulo": ("Cruzada la puerta, cobrar más no va con recetar más:\n"
                      "en Ozempic 2024 el cuartil mejor pago receta un {caida:.0f}% menos"),
        "g3_pie": ("Elaboración propia sobre CMS Open Payments y CMS Medicare Part D Prescribers, "
                   "descargados el\n08/09/2026 · datos hasta 2024, el último año publicado de "
                   "Part D · cuartiles de honorarios cobrados por esa\nmarca ese año, sólo entre "
                   "quienes cobraron honorarios · cada punto es la mediana de recetas de quienes\n"
                   "figuran recetando · son entre 64 y 111 profesionales por cuartil, y la escalera "
                   "tampoco es consistente entre marcas"),
    },
    "en": {
        "sufijo": ".en",
        "clases": ["No payment\nfor that brand", "Meals, travel,\nmaterials",
                   "Speaking or\nconsulting fees"],
        "g1_panel_izq": "Prescriptions of the brand\n(median per prescriber)",
        "g1_panel_der": "Those same prescriptions as a share\nof their Medicare practice",
        "g1_titulo": ("Prescribers who get meals write {vol:.0f}% more Ozempic\n"
                      "and run a practice {practica:.0f}% larger"),
        "g1_pie": ("My own analysis of CMS Open Payments (payments) and CMS Medicare Part D "
                   "Prescribers (prescriptions),\ndownloaded 2026-09-08 · data through 2024, the "
                   "last year Part D publishes · each bar is the median among\nthose who appear "
                   "prescribing that brand that year · the practice is the prescriber's total Part "
                   "D prescriptions\n· Part D hides prescriber-drug pairs with 10 or fewer "
                   "prescriptions, and that cut hits the unpaid group harder"),
        "g2_esp": {
            "endocrinologia": "Endocrinology",
            "emergentes": "Cardiology, nephrology,\ngastroenterology\nand hepatology",
            "primaria": "Primary care",
            "NP/PA": "Nurses and\nphysician assistants",
        },
        "g2_sin_dif": "no difference",
        "g2_eje_x": ("How many times more a professional with fees prescribes, as a share of "
                     "their practice,\nthan one who gets no payment for that brand"),
        "g2_titulo": ("Fees go with up to {alto} times more prescribing outside\n"
                      "endocrinology, and {min_endo} to {max_endo} inside it"),
        "g2_pie": ("My own analysis of CMS Open Payments and CMS Medicare Part D Prescribers, "
                   "downloaded\n2026-09-08 · data through 2024, the last year Part D publishes · "
                   "\"n\" is how many people got fees\nin that cell · giving every prescriber "
                   "hidden by the CMS cut the 10 prescriptions of the ceiling, and on\nthe wider "
                   "universe that test uses, the floor of the two bottom groups is still {piso}\n"
                   "· none of these figures says which way the relationship runs"),
        "g3_cuartiles": ["Quartile 1\n(paid least)", "Quartile 2", "Quartile 3",
                         "Quartile 4\n(paid most)"],
        "g3_eje_y": "Prescriptions of the brand\n(median per prescriber)",
        "g3_titulo": ("Past the door, getting paid more does not go with prescribing more:\n"
                      "in Ozempic 2024 the best paid quartile prescribes {caida:.0f}% less"),
        "g3_pie": ("My own analysis of CMS Open Payments and CMS Medicare Part D Prescribers, "
                   "downloaded\n2026-09-08 · data through 2024, the last year Part D publishes · "
                   "quartiles of fees paid for that brand\nthat year, only among those who got "
                   "fees · each point is the median prescriptions of those who appear\nprescribing "
                   "· they are 64 to 111 professionals per quartile, and the ladder is not "
                   "consistent across brands either"),
    },
}


def cargar(nombre: str) -> dict:
    ruta = CACHE / nombre
    if not ruta.exists():
        raise SystemExit(
            f"Falta {ruta}. Correr antes: "
            "python3 scripts/analysis/glp1-quien-receta.py --solo-copiar"
        )
    return json.loads(ruta.read_text())


def num(valor: float, decimales: int, locale: str) -> str:
    """El separador decimal cambia con el idioma: 6,46% y 6.46%."""
    texto = f"{valor:.{decimales}f}"
    return texto.replace(".", ",") if locale == "es" else texto


def etiqueta(anio: int, marca: str) -> str:
    return f"{marca.capitalize()} {anio}"


def buscar(filas: list[dict], **claves):
    for f in filas:
        if all(f.get(k) == v for k, v in claves.items()):
            return f
    return None


def guardar(fig, nombre: str, locale: str) -> Path:
    OUT.mkdir(parents=True, exist_ok=True)
    destino = OUT / f"{nombre}{TEXTOS[locale]['sufijo']}.png"
    fig.savefig(destino, facecolor=BG)
    plt.close(fig)
    return destino


# ---------------------------------------------------------------- g1
def g1_la_puerta(locale: str) -> Path:
    """El volumen dice una cosa y la proporción dice otra."""
    t = TEXTOS[locale]
    datos = cargar("part_d-08_proporcion.json")["share_por_clase"]
    clases = list(zip(["sin pago", "solo campo", "voz"], t["clases"],
                      [GRAY, DARK, AMBER]))

    fig, (ax_vol, ax_share) = plt.subplots(1, 2, figsize=(10, 6.4), dpi=200)
    x = range(len(COMBOS))
    ancho = 0.26

    for i, (clave, _, color) in enumerate(clases):
        vol, share = [], []
        for anio, marca in COMBOS:
            f = buscar(datos, anio=anio, marca=marca, clase=clave)
            vol.append(f["mediana_recetas_marca"])
            share.append(f["mediana_share_pct"])
        desp = [j + (i - 1) * ancho for j in x]
        ax_vol.bar(desp, vol, ancho, color=color)
        ax_share.bar(desp, share, ancho, color=color)
        for j, v in zip(desp, vol):
            ax_vol.text(j, v + 4, num(v, 0, locale), ha="center",
                        va="bottom", fontsize=10.5, color=FG)
        # Las dos primeras clases tienen valores de share casi iguales y sus
        # etiquetas se pisan si van a la misma altura: se escalonan. No es
        # cosmética, sin esto el gráfico es ilegible justo donde está el
        # hallazgo.
        alto = {0: 0.10, 1: 0.62, 2: 0.12}[i]
        for j, v in zip(desp, share):
            ax_share.text(j, v + alto, num(v, 2, locale) + "%", ha="center",
                          va="bottom", fontsize=10, color=color if i < 2 else FG)

    for ax, titulo in ((ax_vol, t["g1_panel_izq"]), (ax_share, t["g1_panel_der"])):
        ax.set_title(titulo, fontsize=12.5, color=FG, loc="left", pad=14)
        ax.set_xticks(list(x))
        ax.set_xticklabels([etiqueta(a, m) for a, m in COMBOS], fontsize=11)
        ax.tick_params(colors=GRAY, labelsize=10.5)
        for lado in ("top", "right"):
            ax.spines[lado].set_visible(False)
        for lado in ("left", "bottom"):
            ax.spines[lado].set_color(GRAY)
    ax_share.yaxis.set_major_formatter(
        FuncFormatter(lambda v, _: num(v, 0, locale) + "%")
    )
    ax_vol.set_ylim(0, 360)
    ax_share.set_ylim(0, 8)

    manijas = [plt.Rectangle((0, 0), 1, 1, color=c) for _, _, c in clases]
    ax_vol.legend(manijas, [n for _, n, _ in clases], loc="upper left",
                  fontsize=10, frameon=False, labelspacing=1.1,
                  handlelength=1.2, borderpad=0.2)

    # El título se calcula: la razón de volumen y la de tamaño de práctica del
    # grupo de comidas, para el caso más grande. No dice "la misma proporción",
    # que sería falso (1,03% contra 0,98%): dice el mecanismo.
    ref = [f for f in datos if f["anio"] == 2024 and f["marca"] == "OZEMPIC"]
    campo = buscar(ref, clase="solo campo")
    nada = buscar(ref, clase="sin pago")
    veces_vol = campo["mediana_recetas_marca"] / nada["mediana_recetas_marca"]
    veces_practica = campo["mediana_recetas_totales"] / nada["mediana_recetas_totales"]
    fig.text(0.055, 0.965,
             t["g1_titulo"].format(vol=(veces_vol - 1) * 100,
                                   practica=(veces_practica - 1) * 100),
             fontsize=17, fontweight="bold", ha="left", va="top", linespacing=1.2)
    fig.text(0.055, 0.05, t["g1_pie"],
             fontsize=9.5, color=GRAY, ha="left", linespacing=1.5)

    fig.subplots_adjust(top=0.79, bottom=0.255, left=0.075, right=0.97, wspace=0.22)
    return guardar(fig, "g1_la_puerta", locale)


# ---------------------------------------------------------------- g2
def g2_donde_se_abre(locale: str) -> Path:
    """La razón voz / sin pago por especialidad, con el peor caso de censura."""
    t = TEXTOS[locale]
    base = cargar("part_d-10_share_especialidad.json")["veredicto"]
    peor = cargar("part_d-11_censura_imputada.json")["razones"]

    # Eje Y = especialidad (cuatro etiquetas), y dentro de cada una una barra por
    # combinación año-marca. La versión con una fila por celda daba diez
    # etiquetas de tres líneas encimadas entre sí.
    fig, ax = plt.subplots(figsize=(10, 6.4), dpi=200)
    alto_barra = 0.24
    todas = []
    for j, combo in enumerate(COMBOS):
        for i, esp in enumerate(ORDEN_ESP):
            f = buscar(base, anio=combo[0], marca=combo[1], especialidad=esp)
            if not f:
                continue
            p = buscar(peor, anio=combo[0], marca=combo[1], especialidad=esp)
            y = i + (j - 1) * alto_barra
            color = GRAY if esp == "endocrinologia" else AMBER
            razon = f["razon_voz_sobre_sin_pago"]
            ax.barh(y, razon, alto_barra, color=color, alpha=[0.45, 0.72, 1.0][j])
            ax.text(razon + 0.12, y,
                    f"{num(razon, 2, locale)}   {etiqueta(*combo)}, n = {f['n_voz']}",
                    va="center", fontsize=9.5, color=FG)
            todas.append({"esp": esp, "razon": razon,
                          "peor": p["razon_mediana_k10"] if p else None})

    ax.axvline(1, color=FG, linewidth=1.1)
    ax.text(1.08, -0.62, t["g2_sin_dif"], fontsize=10, color=FG)

    ax.set_yticks(range(len(ORDEN_ESP)))
    ax.set_yticklabels([t["g2_esp"][e] for e in ORDEN_ESP], fontsize=11.5)
    ax.invert_yaxis()
    ax.set_xlim(0, 10.5)
    ax.set_xlabel(t["g2_eje_x"], fontsize=10.5, color=GRAY, labelpad=12)
    ax.tick_params(colors=GRAY, labelsize=10.5)
    for lado in ("top", "right", "left"):
        ax.spines[lado].set_visible(False)
    ax.spines["bottom"].set_color(GRAY)

    endo = [f["razon"] for f in todas if f["esp"] == "endocrinologia"]
    resto = [f["razon"] for f in todas if f["esp"] in ("primaria", "NP/PA")]
    peor_resto = [f["peor"] for f in todas
                  if f["esp"] in ("primaria", "NP/PA") and f["peor"]]
    fig.text(0.055, 0.965,
             t["g2_titulo"].format(alto=num(max(resto), 2, locale),
                                   min_endo=num(min(endo), 2, locale),
                                   max_endo=num(max(endo), 2, locale)),
             fontsize=17, fontweight="bold", ha="left", va="top", linespacing=1.2)
    fig.text(0.055, 0.035,
             t["g2_pie"].format(piso=num(min(peor_resto), 2, locale)),
             fontsize=9.5, color=GRAY, ha="left", linespacing=1.5)

    fig.subplots_adjust(top=0.80, bottom=0.34, left=0.215, right=0.97)
    return guardar(fig, "g2_donde_se_abre", locale)


# ---------------------------------------------------------------- g3
def g3_adentro_no_hay_escalera(locale: str) -> Path:
    """Adentro del grupo de honorarios, más dinero no va con más recetas."""
    t = TEXTOS[locale]
    datos = cargar("part_d-07_ultimo_decil.json")["cuartiles_dentro_de_voz"]
    # Orden y color explícitos: Ozempic 2024 es el caso del que habla el título,
    # así que va en ámbar. Ordenar por texto dejaba al protagonista en gris.
    series = [
        ((2024, "OZEMPIC"), "o", AMBER),
        ((2022, "OZEMPIC"), "^", AMBER_CLARO),
        ((2024, "MOUNJARO"), "s", DARK),
    ]

    fig, ax = plt.subplots(figsize=(10, 6.4), dpi=200)
    # Registro de etiquetas ya puestas en cada cuartil: dos series con valores
    # parecidos se pisan, y ahí la segunda va debajo del punto.
    ocupado: dict[int, list[float]] = {}

    for (anio, marca), m, c in series:
        filas = sorted(
            [f for f in datos if f["anio"] == anio and f["marca"] == marca],
            key=lambda f: f["cuartil"],
        )
        if not filas:
            continue
        xs = [f["cuartil"] for f in filas]
        ys = [f["mediana_recetas_visibles"] for f in filas]
        ax.plot(xs, ys, marker=m, color=c, linewidth=2, markersize=8,
                label=f"{etiqueta(anio, marca)}  (n = {sum(f['npi'] for f in filas)})")
        for xi, yi in zip(xs, ys):
            choca = any(abs(yi - previo) < 42 for previo in ocupado.get(xi, []))
            # Las medianas de una población par caen en ,5: redondear a entero
            # crea una diferencia entre lo que dice el PNG y lo que dice la hoja
            # de hechos, y el auditor la marca con razón.
            texto = f"{yi:g}".replace(".", "," if locale == "es" else ".")
            ax.annotate(texto, (xi, yi),
                        textcoords="offset points",
                        xytext=(0, -20) if choca else (0, 11),
                        ha="center", fontsize=10.5, color=c)
            ocupado.setdefault(xi, []).append(yi)

    ax.set_xticks([1, 2, 3, 4])
    ax.set_xticklabels(t["g3_cuartiles"], fontsize=11)
    ax.set_ylabel(t["g3_eje_y"], fontsize=10.5, color=GRAY, labelpad=10)
    ax.tick_params(colors=GRAY, labelsize=10.5)
    ax.set_ylim(0, 400)
    for lado in ("top", "right"):
        ax.spines[lado].set_visible(False)
    for lado in ("left", "bottom"):
        ax.spines[lado].set_color(GRAY)
    ax.legend(fontsize=10.5, frameon=False, loc="lower right")

    # El título se calcula sobre la caída del último cuartil en Ozempic 2024.
    oz = sorted([f for f in datos if f["anio"] == 2024 and f["marca"] == "OZEMPIC"],
                key=lambda f: f["cuartil"])
    caida = (1 - oz[3]["mediana_recetas_visibles"]
             / oz[2]["mediana_recetas_visibles"]) * 100
    fig.text(0.055, 0.965, t["g3_titulo"].format(caida=caida),
             fontsize=17, fontweight="bold", ha="left", va="top", linespacing=1.2)
    fig.text(0.055, 0.045, t["g3_pie"],
             fontsize=9.5, color=GRAY, ha="left", linespacing=1.5)

    fig.subplots_adjust(top=0.80, bottom=0.30, left=0.10, right=0.97)
    return guardar(fig, "g3_adentro_no_hay_escalera", locale)


if __name__ == "__main__":
    for locale in TEXTOS:
        for hacer in (g1_la_puerta, g2_donde_se_abre, g3_adentro_no_hay_escalera):
            print(f"→ {hacer(locale)}")
