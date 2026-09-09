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

# Fecha de corte de los datos, que es el año más nuevo que CMS publica de
# Part D. No es una elección editorial y el caso lo dice.
CORTE = "datos de Medicare Part D hasta 2024, el último año publicado"
FUENTE = ("Elaboración propia sobre CMS Open Payments (pagos) y CMS Medicare Part D "
          "Prescribers (recetas), descargados el 08/09/2026")

# Las tres clases, en el orden del argumento: de no cobrar nada a cobrar
# honorarios. Los nombres son los de la hoja de hechos.
CLASES = [
    ("sin pago", "No cobró nada\npor esa marca", GRAY),
    ("solo campo", "Cobró comidas,\nviajes, material", DARK),
    ("voz", "Cobró honorarios\no consultoría", AMBER),
]

# Las combinaciones año-marca con volumen de los dos lados. Quedan afuera las
# marcas de obesidad: Medicare casi no las cubre y ahí el cruce mide el borde
# del dataset, no conducta.
COMBOS = [(2022, "OZEMPIC"), (2024, "OZEMPIC"), (2024, "MOUNJARO")]


def cargar(nombre: str) -> dict:
    ruta = CACHE / nombre
    if not ruta.exists():
        raise SystemExit(
            f"Falta {ruta}. Correr antes: "
            "python3 scripts/analysis/glp1-quien-receta.py --solo-copiar"
        )
    return json.loads(ruta.read_text())


def etiqueta(anio: int, marca: str) -> str:
    return f"{marca.capitalize()} {anio}"


def buscar(filas: list[dict], **claves):
    for f in filas:
        if all(f.get(k) == v for k, v in claves.items()):
            return f
    return None


# ---------------------------------------------------------------- g1
def g1_la_puerta() -> Path:
    """El volumen dice una cosa y la proporción dice otra."""
    datos = cargar("part_d-08_proporcion.json")["share_por_clase"]

    fig, (ax_vol, ax_share) = plt.subplots(1, 2, figsize=(10, 6.4), dpi=200)
    x = range(len(COMBOS))
    ancho = 0.26

    for i, (clave, _, color) in enumerate(CLASES):
        vol, share = [], []
        for anio, marca in COMBOS:
            f = buscar(datos, anio=anio, marca=marca, clase=clave)
            vol.append(f["mediana_recetas_marca"])
            share.append(f["mediana_share_pct"])
        desp = [j + (i - 1) * ancho for j in x]
        ax_vol.bar(desp, vol, ancho, color=color)
        ax_share.bar(desp, share, ancho, color=color)
        for j, v in zip(desp, vol):
            ax_vol.text(j, v + 4, f"{v:.0f}".replace(".", ","), ha="center",
                        va="bottom", fontsize=10.5, color=FG)
        # Las dos primeras clases tienen valores de share casi iguales y sus
        # etiquetas se pisan si van a la misma altura: se escalonan. No es
        # cosmética, sin esto el gráfico es ilegible justo donde está el
        # hallazgo.
        alto = {0: 0.10, 1: 0.62, 2: 0.12}[i]
        for j, v in zip(desp, share):
            ax_share.text(j, v + alto, f"{v:.2f}%".replace(".", ","), ha="center",
                          va="bottom", fontsize=10, color=color if i < 2 else FG)

    for ax, titulo in (
        (ax_vol, "Recetas de la marca\n(mediana por prescriptor)"),
        (ax_share, "Esas mismas recetas como parte\nde su práctica de Medicare"),
    ):
        ax.set_title(titulo, fontsize=12.5, color=FG, loc="left", pad=14)
        ax.set_xticks(list(x))
        ax.set_xticklabels([etiqueta(a, m) for a, m in COMBOS], fontsize=11)
        ax.tick_params(colors=GRAY, labelsize=10.5)
        for lado in ("top", "right"):
            ax.spines[lado].set_visible(False)
        for lado in ("left", "bottom"):
            ax.spines[lado].set_color(GRAY)
    ax_share.yaxis.set_major_formatter(
        FuncFormatter(lambda v, _: f"{v:.0f}%".replace(".", ","))
    )
    ax_vol.set_ylim(0, 360)
    ax_share.set_ylim(0, 8)

    manijas = [plt.Rectangle((0, 0), 1, 1, color=c) for _, _, c in CLASES]
    ax_vol.legend(manijas, [n for _, n, _ in CLASES], loc="upper left",
                  fontsize=10, frameon=False, labelspacing=1.1,
                  handlelength=1.2, borderpad=0.2)

    # El título se calcula: la razón entre lo que receta el grupo de comidas y
    # el que no cobra nada, en volumen y en proporción, para el caso más grande.
    ref = [f for f in datos if f["anio"] == 2024 and f["marca"] == "OZEMPIC"]
    campo = buscar(ref, clase="solo campo")
    nada = buscar(ref, clase="sin pago")
    veces_vol = campo["mediana_recetas_marca"] / nada["mediana_recetas_marca"]
    # El título no dice "la misma proporción", que sería falso (1,03% contra
    # 0,98%): dice el mecanismo, que es el tamaño de la práctica. Las dos cifras
    # se calculan de los datos, así que el título no puede quedar viejo.
    veces_practica = campo["mediana_recetas_totales"] / nada["mediana_recetas_totales"]
    fig.text(0.055, 0.965,
             f"Quien recibe comidas receta un {(veces_vol - 1) * 100:.0f}% más de Ozempic\n"
             f"y atiende una práctica un {(veces_practica - 1) * 100:.0f}% más grande",
             fontsize=17, fontweight="bold", ha="left", va="top", linespacing=1.2)
    fig.text(0.055, 0.05,
             "Elaboración propia sobre CMS Open Payments (pagos) y CMS Medicare Part D "
             "Prescribers (recetas),\ndescargados el 08/09/2026 · datos hasta 2024, el último año "
             "publicado de Part D · cada barra es la mediana\nentre quienes figuran recetando esa "
             "marca ese año · la práctica es el total de recetas de Part D del prescriptor\n"
             "· Part D esconde los pares prescriptor-droga con 10 recetas o menos, y ese recorte "
             "alcanza más al grupo sin pago",
             fontsize=9.5, color=GRAY, ha="left", linespacing=1.5)

    fig.subplots_adjust(top=0.79, bottom=0.255, left=0.075, right=0.97, wspace=0.22)
    OUT.mkdir(parents=True, exist_ok=True)
    destino = OUT / "g1_la_puerta.png"
    fig.savefig(destino, facecolor=BG)
    plt.close(fig)
    return destino


# ---------------------------------------------------------------- g2
def g2_donde_se_abre() -> Path:
    """La razón voz / sin pago por especialidad, con el peor caso de censura."""
    base = cargar("part_d-10_share_especialidad.json")["veredicto"]
    peor = cargar("part_d-11_censura_imputada.json")["razones"]

    nombres = {
        "endocrinologia": "Endocrinología",
        "emergentes": "Cardiología, nefrología,\ngastroenterología\ny hepatología",
        "primaria": "Atención primaria",
        "NP/PA": "Enfermería y\nasistentes médicos",
    }
    # Orden del argumento: de donde la puerta no se abre a donde más se abre.
    orden = ["endocrinologia", "emergentes", "primaria", "NP/PA"]

    # Eje Y = especialidad (cuatro etiquetas), y dentro de cada una una barra por
    # combinación año-marca. La versión con una fila por celda daba diez
    # etiquetas de tres líneas encimadas entre sí.
    fig, ax = plt.subplots(figsize=(10, 6.4), dpi=200)
    alto_barra = 0.24
    todas = []
    for j, combo in enumerate(COMBOS):
        for i, esp in enumerate(orden):
            f = buscar(base, anio=combo[0], marca=combo[1], especialidad=esp)
            if not f:
                continue
            p = buscar(peor, anio=combo[0], marca=combo[1], especialidad=esp)
            y = i + (j - 1) * alto_barra
            color = GRAY if esp == "endocrinologia" else AMBER
            ax.barh(y, f["razon_voz_sobre_sin_pago"], alto_barra, color=color,
                    alpha=[0.45, 0.72, 1.0][j])
            ax.text(f["razon_voz_sobre_sin_pago"] + 0.12, y,
                    f"{f['razon_voz_sobre_sin_pago']:.2f}".replace(".", ",")
                    + f"   {etiqueta(*combo)}, n = {f['n_voz']}",
                    va="center", fontsize=9.5, color=FG)
            todas.append({"esp": esp, "razon": f["razon_voz_sobre_sin_pago"],
                          "peor": p["razon_mediana_k10"] if p else None})

    ax.axvline(1, color=FG, linewidth=1.1)
    ax.text(1.08, -0.62, "sin diferencia", fontsize=10, color=FG)

    ax.set_yticks(range(len(orden)))
    ax.set_yticklabels([nombres[e] for e in orden], fontsize=11.5)
    ax.invert_yaxis()
    ax.set_xlim(0, 10.5)
    ax.set_xlabel("Veces que un profesional con honorarios receta más, como parte "
                  "de su práctica,\nque uno que no cobra nada de esa marca",
                  fontsize=10.5, color=GRAY, labelpad=12)
    ax.tick_params(colors=GRAY, labelsize=10.5)
    for lado in ("top", "right", "left"):
        ax.spines[lado].set_visible(False)
    ax.spines["bottom"].set_color(GRAY)

    endo = [f["razon"] for f in todas if f["esp"] == "endocrinologia"]
    resto = [f["razon"] for f in todas if f["esp"] in ("primaria", "NP/PA")]
    peor_resto = [f["peor"] for f in todas
                  if f["esp"] in ("primaria", "NP/PA") and f["peor"]]
    fig.text(0.055, 0.965,
             f"Los honorarios van con hasta {max(resto):.2f} veces más receta fuera de\n"
             f"la endocrinología, y {min(endo):.2f} a {max(endo):.2f} adentro"
             .replace(".", ","),
             fontsize=17, fontweight="bold", ha="left", va="top", linespacing=1.2)
    fig.text(0.055, 0.035,
             "Elaboración propia sobre CMS Open Payments y CMS Medicare Part D Prescribers, "
             "descargados el\n08/09/2026 · datos hasta 2024, el último año publicado de Part D · "
             "«n» es cuánta gente cobró honorarios\nen esa celda · imputando a cada prescriptor que "
             "la supresión de CMS esconde las 10 recetas del\ntecho, y sobre el universo ampliado "
             "que esa prueba usa, el piso de los dos grupos de abajo sigue siendo "
             f"{min(peor_resto):.2f}".replace(".", ",")
             + "\n· ninguna de estas cifras dice en qué dirección corre la relación",
             fontsize=9.5, color=GRAY, ha="left", linespacing=1.5)

    fig.subplots_adjust(top=0.80, bottom=0.34, left=0.215, right=0.97)
    OUT.mkdir(parents=True, exist_ok=True)
    destino = OUT / "g2_donde_se_abre.png"
    fig.savefig(destino, facecolor=BG)
    plt.close(fig)
    return destino


# ---------------------------------------------------------------- g3
def g3_adentro_no_hay_escalera() -> Path:
    """Adentro del grupo de honorarios, más dinero no va con más recetas."""
    datos = cargar("part_d-07_ultimo_decil.json")["cuartiles_dentro_de_voz"]
    # Orden y color explícitos: Ozempic 2024 es el caso del que habla el título,
    # así que va en ámbar. Ordenar por texto dejaba al protagonista en gris.
    series = [
        ((2024, "OZEMPIC"), "o", AMBER),
        ((2022, "OZEMPIC"), "^", "#e0a884"),
        ((2024, "MOUNJARO"), "s", DARK),
    ]

    fig, ax = plt.subplots(figsize=(10, 6.4), dpi=200)
    # Registro de etiquetas ya puestas en cada cuartil: dos series con valores
    # parecidas se pisan, y ahí la segunda va debajo del punto.
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
            texto = f"{yi:g}".replace(".", ",")
            ax.annotate(texto, (xi, yi),
                        textcoords="offset points",
                        xytext=(0, -20) if choca else (0, 11),
                        ha="center", fontsize=10.5, color=c)
            ocupado.setdefault(xi, []).append(yi)

    ax.set_xticks([1, 2, 3, 4])
    ax.set_xticklabels(["Cuartil 1\n(cobró menos)", "Cuartil 2", "Cuartil 3",
                        "Cuartil 4\n(cobró más)"], fontsize=11)
    ax.set_ylabel("Recetas de la marca\n(mediana por prescriptor)",
                  fontsize=10.5, color=GRAY, labelpad=10)
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
    fig.text(0.055, 0.965,
             "Cruzada la puerta, cobrar más no va con recetar más:\n"
             f"en Ozempic 2024 el cuartil mejor pago receta un {caida:.0f}% menos",
             fontsize=17, fontweight="bold", ha="left", va="top", linespacing=1.2)
    fig.text(0.055, 0.045,
             "Elaboración propia sobre CMS Open Payments y CMS Medicare Part D Prescribers, "
             "descargados el\n08/09/2026 · datos hasta 2024, el último año publicado de Part D · "
             "cuartiles de honorarios cobrados por esa\nmarca ese año, sólo entre quienes cobraron "
             "honorarios · cada punto es la mediana de recetas de quienes\nfiguran recetando · son "
             "entre 64 y 111 profesionales por cuartil, y la escalera tampoco es consistente entre "
             "marcas",
             fontsize=9.5, color=GRAY, ha="left", linespacing=1.5)

    fig.subplots_adjust(top=0.80, bottom=0.30, left=0.10, right=0.97)
    OUT.mkdir(parents=True, exist_ok=True)
    destino = OUT / "g3_adentro_no_hay_escalera.png"
    fig.savefig(destino, facecolor=BG)
    plt.close(fig)
    return destino


if __name__ == "__main__":
    for hacer in (g1_la_puerta, g2_donde_se_abre, g3_adentro_no_hay_escalera):
        print(f"→ {hacer()}")
