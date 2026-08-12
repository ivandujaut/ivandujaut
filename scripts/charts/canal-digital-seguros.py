"""Gráfico del caso canal-digital-seguros: precisión y captura por tamaño de lista.

Regenerable = auditable: cada cifra sale de data/canal-digital-seguros/modelo_cobro.json
(copiado del proyecto metric-dashboard) y está en el facts.md del caso. Son datos
SIMULADOS: el título y el footer lo dicen, cumpliendo la regla 1 del nodo 3.

Por qué esta vista y no una curva ROC: la decisión operativa es cuántos cobros
gestionar con una capacidad finita. La curva ROC resume el modelo entero para un
público técnico; la precisión y la captura por tamaño de lista muestran exactamente
lo que el equipo de cobranzas obtiene según cuánta lista trabaje.

Correr desde la raíz del repo:  python3 scripts/charts/canal-digital-seguros.py

Estilo compartido con los charts de cobranza y nubank: fondo claro, título bold a
la izquierda, ejes grises, footer de atribución abajo a la izquierda.
"""

import json
from pathlib import Path

import matplotlib.pyplot as plt

FG = "#111111"
GRAY = "#8a8a8a"
BG = "#f8f9fa"
DARK = "#2f74dd"  # precisión en la lista
LIGHT = "#8ab4f8"  # fallos capturados

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
OUT = RAIZ / "public" / "projects" / "canal-digital-seguros"
DATOS = RAIZ / "data" / "canal-digital-seguros" / "modelo_cobro.json"

modelo = json.loads(DATOS.read_text(encoding="utf-8"))
logistica = next(r for r in modelo["resultados"] if r["modelo"] == "Regresión logística")
cortes = logistica["precision_en_k"]
tasa_base = modelo["particion"]["tasa_base_test"] * 100

etiquetas = [f"Top {k['k']:.0%}" for k in cortes]
precision = [k["precision_en_k"] * 100 for k in cortes]
captura = [k["capturados"] * 100 for k in cortes]

fig, ax = plt.subplots(figsize=(10, 6), dpi=200)
x = range(len(cortes))
ancho = 0.38

b1 = ax.bar([i - ancho / 2 for i in x], precision, ancho, color=DARK, zorder=3)
b2 = ax.bar([i + ancho / 2 for i in x], captura, ancho, color=LIGHT, zorder=3)

for barras in (b1, b2):
    for b in barras:
        ax.text(
            b.get_x() + b.get_width() / 2,
            b.get_height() + 1.2,
            f"{b.get_height():.0f}".replace(".", ","),
            ha="center",
            fontsize=13,
            color=FG,
        )

linea_azar = ax.axhline(
    tasa_base, color=GRAY, linestyle=(0, (4, 3)), linewidth=1.2, zorder=2
)

ax.set_xticks(list(x))
ax.set_xticklabels(etiquetas, fontsize=13, color=FG)
ax.set_xlabel(
    "Tamaño de la lista gestionada, como porcentaje de la cartera del mes",
    fontsize=11.5,
    labelpad=10,
)
ax.set_ylim(0, 62)
ax.set_yticks([0, 20, 40, 60])
ax.spines[["top", "right", "left"]].set_visible(False)
ax.tick_params(left=False)
ax.grid(axis="y", color=GRAY, alpha=0.25, zorder=0)

ax.legend(
    [b1, b2, linea_azar],
    [
        "De cada 100 gestionados, fallos reales",
        "De todos los fallos del mes, capturados",
        f"Eligiendo al azar: {tasa_base:.0f} de cada 100",
    ],
    loc="upper left",
    frameon=False,
    fontsize=12,
)

fig.text(
    0.06,
    0.955,
    "Mi modelo, sobre datos simulados: gestionar el 5% más\nriesgoso captura el 37% de los fallos de cobro",
    fontsize=17,
    fontweight="bold",
    ha="left",
    va="top",
)
fig.text(
    0.06,
    0.028,
    "Elaboración propia · priorización construida sobre 398 mil períodos póliza-mes simulados y evaluada\n"
    "sobre 278 mil posteriores a marzo de 2026 (6,1% de fallos reales) · calibración anclada en cuadros de la SSN",
    fontsize=10.5,
    color=GRAY,
    ha="left",
)

fig.subplots_adjust(top=0.80, bottom=0.17, left=0.06, right=0.97)
OUT.mkdir(parents=True, exist_ok=True)
destino = OUT / "modelo-listas.png"
fig.savefig(destino, facecolor=BG)
print(f"→ {destino}")


# ---------------------------------------------------------------------------
# Slope chart: puesto por costo por alta vs puesto por prima persistente
# por peso invertido. Reemplaza a la captura del tablero (ilegible a ancho
# de columna). Valores de data/canal-digital-seguros/facts.md, tabla de
# canales: SIMULACIÓN (43 de 53 parámetros elegidos). En los cinco canales
# rank_cpa == rank_cpap, por eso la columna izquierda vale por las dos.
# ---------------------------------------------------------------------------

AMBER = "#c2571a"  # el canal que cae
CANALES = [
    # (nombre, puesto por CPA (== CPAP), puesto por PAP/$)
    ("Base propia (cross-sell)", 1, 1),
    ("Embedded", 2, 5),
    ("Comparadores", 3, 2),
    ("E-commerce propio", 4, 4),
    ("Conversacional", 5, 3),
]

fig2, ax2 = plt.subplots(figsize=(10, 6), dpi=200)
ax2.set_xlim(-0.72, 1.85)
ax2.set_ylim(5.55, 0.45)  # puesto 1 arriba
ax2.axis("off")

for nombre, izq, der in CANALES:
    salta = abs(der - izq) >= 2
    if not salta:
        color, lw = GRAY, 1.6
    elif der > izq:
        color, lw = AMBER, 3.0
    else:
        color, lw = DARK, 3.0
    ax2.plot([0, 1], [izq, der], color=color, linewidth=lw, zorder=3,
             solid_capstyle="round", alpha=1 if salta else 0.55)
    for x_, p in ((0, izq), (1, der)):
        ax2.scatter([x_], [p], s=46, color=color, zorder=4,
                    alpha=1 if salta else 0.55)
    peso = "bold" if salta else "normal"
    ax2.text(-0.05, izq, f"{izq}º  {nombre}", ha="right", va="center",
             fontsize=13, color=FG if salta else GRAY, fontweight=peso)
    ax2.text(1.05, der, f"{der}º", ha="left", va="center",
             fontsize=13, color=FG if salta else GRAY, fontweight=peso)

ax2.text(0, 0.62, "Por costo por alta\n(corregido o no: mismo orden)",
         ha="center", va="bottom", fontsize=12, color=GRAY)
ax2.text(1, 0.62, "Por prima persistente\npor peso invertido",
         ha="center", va="bottom", fontsize=12, color=GRAY)

ax2.text(1.16, 5.0, "el 2º más barato\ntermina último", fontsize=11.5,
         color=AMBER, va="center")
ax2.text(1.16, 3.0, "el más caro por alta\nsube al 3º", fontsize=11.5,
         color=DARK, va="center")

fig2.text(
    0.06,
    0.955,
    "Mi simulación: corregir el costo por alta no reordena los\ncanales; mirar la prima que dejan, sí",
    fontsize=17,
    fontweight="bold",
    ha="left",
    va="top",
)
fig2.text(
    0.06,
    0.028,
    "Elaboración propia · cinco canales simulados (43 de 53 parámetros elegidos por mí): el gráfico demuestra el\n"
    "comportamiento de las métricas, no mide a ninguna compañía · el puesto por CPA y por CPAP coincide en los cinco",
    fontsize=10.5,
    color=GRAY,
    ha="left",
)
fig2.subplots_adjust(top=0.80, bottom=0.11, left=0.04, right=0.96)
destino2 = OUT / "ranking-canales.png"
fig2.savefig(destino2, facecolor=BG)
print(f"→ {destino2}")


# ---------------------------------------------------------------------------
# Recorte de la portada para el preview de la home (proporción 1,5, dentro
# del rango 1,1-1,7 que exige el schema). Toma el punto focal derecho de la
# cover: la figura con el comprobante ámbar, la pileta y la rotura del canal.
# ---------------------------------------------------------------------------

from PIL import Image

COVER = RAIZ / "content" / "projects" / "es" / "canal-digital-seguros" / "cover.jpg"
cover = Image.open(COVER)
recorte = cover.crop((700, 0, 1376, 451))  # 676x451 ≈ 1,5
destino3 = OUT / "preview-portada.jpg"
recorte.save(destino3, quality=92)
print(f"→ {destino3}")
