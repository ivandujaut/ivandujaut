"""Gráficos del caso pasajes-chatgpt.

Regenerable = auditable. Ningún número está escrito a mano: cada gráfico lee su archivo.

- g1_escalera: hasta qué paso llegó cada superficie en el intento de compra
  (`data/pasajes-chatgpt/campo/compra.csv`, escala fija del protocolo 5.1).
- g2_sofia: participación de SOFIA en las reservas B2C según Prosus
  (`data/pasajes-chatgpt/sofia_serie.csv`, transcripta de la p. 15 del "Despegar deep dive"
  del 23-sep-2026 y del comunicado del semestre del 25-nov-2026).
- g3_precio: "el precio sube al pagar" en las reseñas de 1 y 2 estrellas, Despegar contra
  Aerolíneas Argentinas, con intervalo de Wilson al 95%
  (`data/despegar/research/raw/03_reviews_clasificadas_*.csv`, codificación propia).
- g4_menciones: a quién nombra cada asistente en las preguntas de vuelos
  (`data/pasajes-chatgpt/campo/menciones.csv`, salida de `scripts/analysis/pasajes-chatgpt.py`).

Estilo de la serie: fondo claro, título bold a la izquierda, ejes grises, footer de
atribución abajo a la izquierda.

Correr desde la raíz del repo:  python3 scripts/charts/pasajes-chatgpt.py
"""

import csv
import math
import textwrap
from collections import defaultdict
from pathlib import Path

import matplotlib.pyplot as plt

FG = "#111111"
GRAY = "#8a8a8a"
LIGHT = "#d5d8dc"
BG = "#f8f9fa"
DARK = "#2f74dd"
AMBER = "#c2571a"

plt.rcParams.update({
    "font.family": "DejaVu Sans",
    "text.color": FG,
    "axes.labelcolor": FG,
    "xtick.color": FG,
    "ytick.color": FG,
    "figure.facecolor": BG,
    "axes.facecolor": BG,
    "svg.fonttype": "none",
})

RAIZ = Path(__file__).resolve().parents[2]
CASO = RAIZ / "data" / "pasajes-chatgpt"
RESENAS = RAIZ / "data" / "despegar" / "research" / "raw"
OUT = RAIZ / "public" / "projects" / "pasajes-chatgpt"
OUT.mkdir(parents=True, exist_ok=True)

FIGSIZE = (14.95, 8.87)
DPI = 100


def pct(x: float, dec: int = 1) -> str:
    return f"{x:.{dec}f}".replace(".", ",") + "%"


def limpiar(ax) -> None:
    for lado in ("top", "right"):
        ax.spines[lado].set_visible(False)
    for lado in ("left", "bottom"):
        ax.spines[lado].set_color(GRAY)


def footer(fig, texto: str) -> None:
    fig.text(0.02, 0.025, "\n".join(textwrap.wrap(texto, 150)), fontsize=13, color=GRAY,
             ha="left", va="bottom")


def titulo(fig, texto: str, size: float = 24) -> None:
    fig.text(0.02, 0.965, texto, fontsize=size, fontweight="bold", color=FG, ha="left", va="top")


# ---------------------------------------------------------------------------------------------
# g1 · Escalera del intento de compra
# ---------------------------------------------------------------------------------------------

ETIQUETAS = {
    "SOFIA (Despegar), web": "SOFIA, web de Despegar (25-nov)",
    "ChatGPT con app de Despegar conectada": "ChatGPT con la app de Despegar (25-nov)",
    "Google AI Mode (corrida 2)": "Google AI Mode, con sesión (25-nov)",
    "Google AI Mode": "Google AI Mode, sin cuenta (24-nov)",
    "Gemini": "Gemini, sin cuenta (24-nov)",
    "ChatGPT sin app conectada": "ChatGPT sin la app, sin cuenta (24-nov)",
    "ChatGPT sin app conectada (corrida 2)": "ChatGPT sin la app, sin cuenta (25-nov)",
}
# Dónde terminó cada corrida, en palabras (resumen de la columna paso_desc de compra.csv).
DESTINO = {
    "SOFIA (Despegar), web": "checkout de Despegar con el vuelo cargado",
    "ChatGPT con app de Despegar conectada": "checkout de Despegar con el vuelo cargado",
    "Google AI Mode (corrida 2)": "checkout de Despegar, elegido en la tabla de Google",
    "Google AI Mode": "vuelos con fechas, cierra en Google Flights",
    "Gemini": "precios estimados y páginas de ruta sin fechas",
    "ChatGPT sin app conectada": "precio de otras fechas y página de ruta sin fechas",
    "ChatGPT sin app conectada (corrida 2)": "precio de otras fechas, KAYAK con fechas",
}
PASOS = {
    0: "0\nno busca",
    1: "1\ninformación\ngeneral",
    2: "2\nvuelos con\nprecio",
    3: "3\ndeja elegir\nun vuelo",
    4: "4\ncheckout con el\nvuelo cargado",
    5: "5\ncobra dentro\ndel chat",
}

with (CASO / "campo" / "compra.csv").open(encoding="utf-8") as f:
    compra = list(csv.DictReader(f))

faltan = [r["superficie"] for r in compra if r["superficie"] not in ETIQUETAS]
assert not faltan, f"superficies sin etiqueta: {faltan}"

compra.sort(key=lambda r: (int(r["paso_max"]), -int(r["mensajes"])))
llegaron = [r for r in compra if int(r["paso_max"]) >= 4]
max_paso = max(int(r["paso_max"]) for r in compra)
assert max_paso < 5, "alguna superficie cobró dentro del chat: revisar el título"

fig, ax = plt.subplots(figsize=FIGSIZE, dpi=DPI)
for i, r in enumerate(compra):
    paso = int(r["paso_max"])
    color = DARK if paso >= 4 else LIGHT
    ax.barh(i, paso, color=color, height=0.62)
    msj = int(r["mensajes"])
    texto = f"{DESTINO[r['superficie']]} · {msj} mensaje{'s' if msj != 1 else ''}"
    if paso >= 4:
        ax.text(0.08, i, texto, va="center", fontsize=13.5, color="white", fontweight="bold")
    elif paso >= 3:
        ax.text(0.08, i, texto, va="center", fontsize=13.5, color=FG)
    else:
        ax.text(paso + 0.06, i, texto, va="center", fontsize=13.5, color=GRAY)
ax.set_yticks(range(len(compra)))
ax.set_yticklabels([ETIQUETAS[r["superficie"]] for r in compra], fontsize=14.5)
ax.set_xticks(list(PASOS))
ax.set_xticklabels(list(PASOS.values()), fontsize=12.5, color=GRAY)
ax.set_xlim(0, 5.05)
ax.set_ylim(-0.6, len(compra) - 0.4)
ax.tick_params(axis="y", length=0)
ax.xaxis.grid(True, color=LIGHT, linewidth=1)
ax.set_axisbelow(True)
limpiar(ax)
titulo(fig,
    f"Mi prueba de noviembre: {len(llegaron)} de {len(compra)} corridas llegaron al checkout,\n"
    "y las tres pasaban por un inventario conectado con precio real",
       size=23)
footer(fig,
       "Relevamiento propio, 24 y 25 de noviembre de 2026, desde Argentina: el mismo pedido (Buenos Aires a Río, "
       "15 al 22 de enero de 2027, una persona) en cada superficie, con dos repreguntas fijas. Escala del protocolo, "
       "fijada antes de correr. Nunca se pagó: el intento termina en la pantalla anterior al pago. Es una corrida "
       "por superficie, salvo ChatGPT sin la app y AI Mode, que tienen dos.")
fig.subplots_adjust(left=0.31, right=0.95, top=0.84, bottom=0.25)
fig.savefig(OUT / "g1_escalera.png", facecolor=BG)
plt.close(fig)

# ---------------------------------------------------------------------------------------------
# g2 · SOFIA en las reservas B2C, según Prosus
# ---------------------------------------------------------------------------------------------

MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"]

with (CASO / "sofia_serie.csv").open(encoding="utf-8") as f:
    serie = list(csv.DictReader(f))

x = list(range(len(serie)))
y = [float(r["pct_gb_sofia_gmv_b2c"]) for r in serie]
deep = [i for i, r in enumerate(serie) if "deep dive" in r["fuente"]]
semestre = [i for i, r in enumerate(serie) if "deep dive" not in r["fuente"]]


def mes(r) -> str:
    a, m = r["mes"].split("-")
    return f"{MESES[int(m) - 1]}\n{a[2:]}"


def meses_entre(a: str, b: str) -> int:
    (ya, ma), (yb, mb) = (map(int, a.split("-")), map(int, b.split("-")))
    return (yb - ya) * 12 + (mb - ma)


fig, ax = plt.subplots(figsize=FIGSIZE, dpi=DPI)
ax.plot([x[i] for i in deep], [y[i] for i in deep], color=DARK, linewidth=3.2, marker="o",
        markersize=8, zorder=3)
if semestre:
    i0 = deep[-1]
    ax.plot([x[i0]] + [x[i] for i in semestre], [y[i0]] + [y[i] for i in semestre],
            color=DARK, linewidth=2.2, linestyle=(0, (3, 3)), zorder=2)
    ax.scatter([x[i] for i in semestre], [y[i] for i in semestre], s=95, facecolor=BG,
               edgecolor=DARK, linewidth=2.6, zorder=4)
for i in (0, *[k for k, r in enumerate(serie) if r["mes"] in ("2026-01", "2026-06")], deep[-1],
          *semestre):
    dy = 0.45 if i != deep[-1] else -0.75
    ax.text(x[i], y[i] + dy, pct(y[i]), ha="center", fontsize=15, fontweight="bold",
            color=FG)
ax.set_xticks(x)
ax.set_xticklabels([mes(r) for r in serie], fontsize=13, color=GRAY)
ax.set_ylim(0, max(y) * 1.22)
ax.set_ylabel("Reservas por SOFIA / reservas B2C (%)", fontsize=15)
ax.tick_params(axis="y", labelsize=13, colors=GRAY)
ax.yaxis.grid(True, color=LIGHT, linewidth=1)
ax.set_axisbelow(True)
limpiar(ax)
if semestre:
    ax.annotate("septiembre: dato del comunicado\ndel semestre, otro documento",
                xy=(x[semestre[0]], y[semestre[0]]), xytext=(x[semestre[0]] - 3.4, y[semestre[0]] + 0.6),
                fontsize=12.5, color=GRAY, arrowprops=dict(arrowstyle="-", color=GRAY))
n_meses = meses_entre(serie[0]["mes"], serie[-1]["mes"])
titulo(fig,
    f"Según Prosus, SOFIA pasó de {pct(y[0])} a {pct(y[-1])} de las reservas B2C\n"
    f"de Despegar en {n_meses} meses",
       size=24)
footer(fig,
       "Datos que la empresa publica sobre sí misma: Prosus, \"Despegar deep dive\" (23 de septiembre de 2026, p. 15, "
       "serie mensual de reservas brutas por SOFIA sobre el total B2C, julio de 2025 a agosto de 2026) y comunicado de "
       "resultados del semestre (25 de noviembre de 2026, septiembre). Participación no es incrementalidad: no dice si "
       "esas compras habrían pasado igual sin SOFIA.")
fig.subplots_adjust(left=0.08, right=0.98, top=0.84, bottom=0.22)
fig.savefig(OUT / "g2_sofia.png", facecolor=BG)
plt.close(fig)

# ---------------------------------------------------------------------------------------------
# g3 · "El precio sube al pagar", Despegar contra Aerolíneas Argentinas
# ---------------------------------------------------------------------------------------------

FAMILIA = {"PS", "CO", "CU", "PA"}  # precio sube, cargos, cuotas o promo, error de pago


def wilson(k: int, n: int, z: float = 1.96) -> tuple[float, float]:
    p = k / n
    c = (p + z * z / (2 * n)) / (1 + z * z / n)
    m = z * math.sqrt(p * (1 - p) / n + z * z / (4 * n * n)) / (1 + z * z / n)
    return c - m, c + m


def cargar(ruta: Path, filtro) -> list[dict]:
    with ruta.open(encoding="utf-8") as f:
        return [r for r in csv.DictReader(f) if r["rating"] in ("1", "2") and filtro(r)]


desp = cargar(RESENAS / "03_reviews_clasificadas_ar.csv", lambda r: r["corpus"] == "appstore_ar")
aero = cargar(RESENAS / "03_reviews_clasificadas_aerolineas.csv", lambda r: r["fecha"] >= "2024")


def codigos(r) -> set[str]:
    return {r["pain"], r["pain2"]}


grupos = {
    "Despegar\n(App Store AR)": desp,
    "Aerolíneas Argentinas\n(App Store AR y Google Play)": aero,
}
medidas = [
    ("El precio sube o cambia\ndurante la compra", lambda r: "PS" in codigos(r)),
    ("Promesa rota al pagar (precio, cargos,\ncuotas o promo, error de pago)",
     lambda r: bool(FAMILIA & codigos(r))),
]
res = {}
for g, filas in grupos.items():
    for nombre, fn in medidas:
        k = sum(1 for r in filas if fn(r))
        res[(g, nombre)] = (k, len(filas), k / len(filas), *wilson(k, len(filas)))

ps_d = res[(list(grupos)[0], medidas[0][0])]
ps_a = res[(list(grupos)[1], medidas[0][0])]
assert ps_d[3] > ps_a[4], "los intervalos se tocan: revisar el título"

fig, ax = plt.subplots(figsize=FIGSIZE, dpi=DPI)
colores = {list(grupos)[0]: AMBER, list(grupos)[1]: GRAY}
ypos = []
for j, (nombre, _) in enumerate(medidas):
    for i, g in enumerate(grupos):
        yy = j * 3 + i
        ypos.append((yy, nombre if i == 0 else ""))
        k, n, p, lo, hi = res[(g, nombre)]
        ax.plot([lo * 100, hi * 100], [yy, yy], color=colores[g], linewidth=4, alpha=0.45,
                solid_capstyle="round")
        ax.scatter([p * 100], [yy], s=170, color=colores[g], zorder=3)
        ax.text(hi * 100 + 0.8, yy, f"{pct(p * 100)}  ({k} de {n})", va="center", fontsize=15,
                fontweight="bold", color=colores[g])
ax.set_yticks([j * 3 + 0.5 for j in range(len(medidas))])
ax.set_yticklabels([m[0] for m in medidas], fontsize=15)
ax.set_ylim(len(medidas) * 3 - 1.5, -0.8)
ax.set_xlim(0, 45)
ax.set_xlabel("% de las reseñas de 1 y 2 estrellas (punto) e intervalo de confianza al 95% (barra)",
              fontsize=14)
ax.tick_params(axis="x", labelsize=13, colors=GRAY)
ax.tick_params(axis="y", length=0)
ax.xaxis.grid(True, color=LIGHT, linewidth=1)
ax.set_axisbelow(True)
limpiar(ax)
for g, c in colores.items():
    ax.scatter([], [], s=120, color=c, label=g.replace("\n", " "))
ax.legend(loc="center right", frameon=False, fontsize=14)
titulo(fig,
    f"\"El precio sube al pagar\": {pct(ps_d[2] * 100)} de las reseñas negativas de Despegar,\n"
    f"{pct(ps_a[2] * 100)} de las de la app de Aerolíneas Argentinas",
       size=24)
d0, d1 = min(r["fecha"] for r in desp)[:7], max(r["fecha"] for r in desp)[:7]
a0, a1 = min(r["fecha"] for r in aero)[:7], max(r["fecha"] for r in aero)[:7]
footer(fig,
       f"Codificación propia de reseñas públicas de 1 y 2 estrellas, con un libro de códigos cerrado antes de clasificar: "
       f"app de Despegar en el App Store de Argentina ({d0} a {d1}) y app de Aerolíneas Argentinas en el App Store y "
       f"Google Play ({a0} a {a1}). Cada reseña cuenta una vez, sea el motivo principal o un agravante. Intervalos de "
       f"Wilson. Son reseñas, no usuarios: dicen dónde duele, no cuántos se van por eso.")
fig.subplots_adjust(left=0.30, right=0.97, top=0.84, bottom=0.22)
fig.savefig(OUT / "g3_precio.png", facecolor=BG)
plt.close(fig)

# ---------------------------------------------------------------------------------------------
# g4 · A quién nombra cada asistente en las preguntas de vuelos
# ---------------------------------------------------------------------------------------------

ASISTENTES = [("chatgpt", "ChatGPT\nsin cuenta"), ("gemini", "Gemini\nsin cuenta"),
              ("perplexity", "Perplexity\ncon cuenta gratuita")]
MARCAS = ["Despegar", "Google Flights", "Skyscanner", "Kayak", "Turismocity", "Almundo"]

with (CASO / "campo" / "menciones.csv").open(encoding="utf-8") as f:
    menciones = [r for r in csv.DictReader(f) if r["categoria"] == "V"]

preguntas: dict[str, set[str]] = defaultdict(set)
nombra: dict[tuple[str, str], set[str]] = defaultdict(set)
for r in menciones:
    preguntas[r["asistente"]].add(r["pregunta"])
    if r["nombrada"] == "1":
        nombra[(r["asistente"], r["marca"])].add(r["pregunta"])

# Las preguntas sin ninguna marca no dejan filas: el total sale de las capturas.
for a, _ in ASISTENTES:
    capturas = sorted((CASO / "campo" / "raw").glob(f"{a}-q*.json"))
    preguntas[a] |= {str(int(p.stem.split("-q")[1])) for p in capturas
                     if int(p.stem.split("-q")[1]) <= 12}

fig, ax = plt.subplots(figsize=FIGSIZE, dpi=DPI)
for j, (a, _) in enumerate(ASISTENTES):
    n = len(preguntas[a])
    for i, m in enumerate(MARCAS):
        k = len(nombra[(a, m)])
        share = k / n if n else 0
        color = AMBER if m == "Despegar" else DARK
        ax.scatter(j, i, s=200 + 3400 * share, color=color, alpha=0.18 + 0.7 * share,
                   edgecolor="none")
        ax.text(j, i, f"{k} de {n}", ha="center", va="center", fontsize=15,
                fontweight="bold" if m == "Despegar" else "normal", color=FG)
ax.set_xticks(range(len(ASISTENTES)))
ax.set_xticklabels([t for _, t in ASISTENTES], fontsize=15)
ax.xaxis.tick_top()
ax.set_yticks(range(len(MARCAS)))
ax.set_yticklabels(MARCAS, fontsize=16)
ax.get_yticklabels()[0].set_fontweight("bold")
ax.set_xlim(-0.6, len(ASISTENTES) - 0.4)
ax.set_ylim(len(MARCAS) - 0.5, -0.6)
ax.tick_params(length=0)
for lado in ax.spines.values():
    lado.set_visible(False)
d = {a: len(nombra[(a, "Despegar")]) for a, _ in ASISTENTES}
total_pp = len(list((CASO / "campo" / "raw").glob("perplexity-q*.json")))
n = {a: len(preguntas[a]) for a, _ in ASISTENTES}
titulo(fig,
    f"En preguntas de vuelos, Gemini nombró a Despegar en {d['gemini']} de {n['gemini']},\n"
    f"ChatGPT en {d['chatgpt']} de {n['chatgpt']} y Perplexity en {d['perplexity']} de {n['perplexity']}",
       size=23)
footer(fig,
       "Relevamiento propio: las 12 preguntas de vuelos de un banco de 36 sin marcas, escritas como las haría alguien de "
       "Argentina, una corrida por pregunta en un chat nuevo. ChatGPT y Gemini sin cuenta (24 de noviembre de 2026); "
       f"Perplexity con cuenta gratuita (25 y 26 de noviembre): {total_pp} de las 36 respondidas. Cuenta si la "
       "marca aparece en el texto de la respuesta. Mide quién aparece, no tráfico ni ventas.")
fig.subplots_adjust(left=0.16, right=0.98, top=0.76, bottom=0.2)
fig.savefig(OUT / "g4_menciones.png", facecolor=BG)
plt.close(fig)

for p in sorted(OUT.glob("*.png")):
    print(p.relative_to(RAIZ), p.stat().st_size // 1024, "KB")
