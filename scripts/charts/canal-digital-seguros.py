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
    "Elaboración propia · regresión logística entrenada con 398 mil períodos póliza-mes simulados y evaluada\n"
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
