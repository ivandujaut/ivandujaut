"""Gráficos del caso nubank-seguros-argentina (g3 smoke test, g4 escenarios, g5 ramo Robo).

Regenerable = auditable: cada cifra de acá tiene que estar en el facts.md del caso.
Los datos de g5 salen del análisis de balances SSN (cuenta 5.01.01.01.01.01.01.00,
subramo 1.090.99, jul-2025 a mar-2026); los de g3 y g4 son proyecciones del modelo
y así lo dicen sus títulos y footers.

Modelo de g4, completo y multiplicable: pólizas(t) = clientes × attach_objetivo ×
smoothstep(t/24), con smoothstep(x) = 3x² - 2x³. La curva S satura en el mes 24,
así que el endpoint es exactamente clientes × attach: 15.000 / 60.000 / 120.000.
El attach objetivo de cada escenario se ancla en el 2,2% observado de Nubank+Chubb
en Brasil (2M pólizas / 92M clientes, jun-2024, hoja de hechos línea Brasil).

Correr desde la raíz del repo:  python3 scripts/charts/nubank-seguros-argentina.py

Estilo compartido con los charts de cobranza: fondo claro, título bold a la
izquierda, ejes grises, footer de atribución abajo a la izquierda.
"""

from pathlib import Path

import matplotlib.pyplot as plt
from matplotlib.ticker import FuncFormatter

FG = "#111111"
GRAY = "#8a8a8a"
BG = "#f8f9fa"
BLUES = ["#8ab4f8", "#5b93ec", "#2f74dd", "#1f57b0"]  # gradiente de g3 original
BANK = "#2f74dd"  # bancaseguros
OTHER = "#b8c4d4"  # resto

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

OUT = str(Path(__file__).resolve().parents[2] / "public" / "projects" / "nubank-seguros-argentina")

# ---------------------------------------------------------------- g5: ramo Robo
# Datos calculados de balances SSN (jul-2025 a mar-2026), cuenta
# 5.01.01.01.01.01.01.00 (primas seguros directos) subramo 1.090.99.
ramo = [
    ("Provincia Seguros", 62.4, True),
    ("Galicia Seguros", 22.5, True),
    ("Qualia (Gpo. Petersen)", 19.1, True),
    ("Sancor Seguros", 16.7, False),
    ("Life Seguros", 15.9, False),
    ("Supervielle Seguros", 11.3, True),
    ("Nación Seguros", 10.1, True),
    ("BIND Seguros", 8.5, True),
    ("SMG Seguros", 7.2, False),
    ("Triunfo Seguros", 6.9, False),
]

fig, ax = plt.subplots(figsize=(14.95, 8.87), dpi=100)
names = [r[0] for r in ramo][::-1]
vals = [r[1] for r in ramo][::-1]
colors = [BANK if r[2] else OTHER for r in ramo][::-1]
bars = ax.barh(names, vals, color=colors, height=0.62)
for b, v in zip(bars, vals):
    ax.text(v + 0.7, b.get_y() + b.get_height() / 2, f"${v:,.1f}".replace(".", ","),
            va="center", fontsize=15, fontweight="bold", color=FG)
ax.set_title(
    "Quién vende el ramo donde vive el seguro de celular",
    fontsize=25, fontweight="bold", loc="left", pad=18, color=FG,
)
ax.set_xlabel("Prima emitida, jul-2025 a mar-2026 (miles de millones de $)", fontsize=16)
ax.tick_params(axis="y", labelsize=15)
ax.tick_params(axis="x", labelsize=14)
ax.set_xlim(0, 71)
for s in ("top", "right", "left"):
    ax.spines[s].set_visible(False)
from matplotlib.patches import Patch

ax.legend(
    handles=[
        Patch(color=BANK, label="Canal bancario / bancaseguros"),
        Patch(color=OTHER, label="Resto"),
    ],
    loc="lower right", frameon=False, fontsize=15,
)
fig.text(
    0.01, 0.012,
    "Ramo Robo y Riesgos Similares: $228,3 mil M de prima emitida en 9 meses · "
    "Elaboración propia sobre balances SSN (datos abiertos, marzo 2026)",
    fontsize=13, color=GRAY,
)
fig.tight_layout(rect=(0, 0.045, 1, 1))
fig.savefig(f"{OUT}/g5_ramo_robo.png", facecolor=BG)
plt.close(fig)

# ------------------------------------------------- g3: smoke test (regenerado)
# Mismos datos que el original; título y footer reescritos para que quede claro
# que es un diseño con proyección, no un resultado.
funnel = [
    ("Ven banner", 120_000, None),
    ("Abren landing", 38_400, "32%"),
    ("Piden cotización", 14_200, "37%"),
    ("Dejan email\n(waitlist)", 9_650, "68%"),
]
fig, ax = plt.subplots(figsize=(14.95, 8.87), dpi=100)
xs = range(len(funnel))
vals = [f[1] for f in funnel]
bars = ax.bar(xs, vals, color=BLUES, width=0.62)
for i, (b, (label, v, pct)) in enumerate(zip(bars, funnel)):
    txt = f"{v:,.0f}".replace(",", ".")
    if pct:
        txt += f"\n({pct})"
    ax.text(b.get_x() + b.get_width() / 2, v + 2600, txt,
            ha="center", fontsize=17, fontweight="bold", color=FG)
ax.set_title(
    "Diseño del smoke test: mi modelo proyecta 8% de impresión a waitlist",
    fontsize=24, fontweight="bold", loc="left", pad=18, color=FG,
)
ax.set_ylabel("Usuarios", fontsize=16)
ax.set_xticks(list(xs))
ax.set_xticklabels([f[0] for f in funnel], fontsize=16)
ax.set_ylim(0, 140_000)
ax.yaxis.set_major_formatter(FuncFormatter(lambda v, _: f"{v/1000:.0f}k"))
ax.tick_params(axis="y", labelsize=14)
for s in ("top", "right"):
    ax.spines[s].set_visible(False)
fig.text(
    0.01, 0.012,
    "Experimento no corrido: funnel proyectado por mi modelo, 14 días de tráfico in-app · "
    "Criterio de go fijado a priori: 5%",
    fontsize=13, color=GRAY,
)
fig.tight_layout(rect=(0, 0.045, 1, 1))
fig.savefig(f"{OUT}/g3_funnel_smoketest.png", facecolor=BG)
plt.close(fig)

# ------------------------------------------------- g4: escenarios a 24 meses
# pólizas(t) = clientes * attach * smoothstep(t/24); endpoint = clientes * attach.
ESCENARIOS = [
    ("Optimista (4M clientes, attach 3%)", 4_000_000, 0.03, "#17a673"),
    ("Base (3M clientes, attach 2%)", 3_000_000, 0.02, "#2f74dd"),
    ("Conservador (1,5M clientes, attach 1%)", 1_500_000, 0.01, "#e8663c"),
]

fig, ax = plt.subplots(figsize=(16.33, 9.7), dpi=100)
meses = [m / 4 for m in range(0, 97)]  # paso de un cuarto de mes para curva suave
for label, clientes, attach, color in ESCENARIOS:
    ys = []
    for t in meses:
        x = min(t / 24, 1.0)
        ys.append(clientes * attach * (3 * x**2 - 2 * x**3) / 1000)
    ax.plot(meses, ys, color=color, linewidth=4, label=label)
    ax.text(24.4, ys[-1], f"{ys[-1]:.0f}k", fontsize=22, fontweight="bold", color=color, va="center")
ax.set_title(
    "Pólizas activas que proyecta mi modelo a 24 meses del lanzamiento",
    fontsize=25, fontweight="bold", loc="left", pad=18, color=FG,
)
ax.set_xlabel("Meses desde el lanzamiento", fontsize=17)
ax.set_ylabel("Pólizas activas (miles)", fontsize=17)
ax.set_xlim(0, 27)
ax.set_ylim(0, 130)
ax.tick_params(labelsize=15)
for sp in ("top", "right"):
    ax.spines[sp].set_visible(False)
ax.legend(loc="upper left", frameon=False, fontsize=16)
fig.text(
    0.01, 0.030,
    "Modelo: pólizas = clientes × attach objetivo × curva S que satura al mes 24, así el valor final es clientes × attach",
    fontsize=12.5, color=GRAY,
)
fig.text(
    0.01, 0.008,
    "Attach de referencia: 2,2% de Nubank+Chubb en Brasil (2M pólizas / 92M clientes, jun-2024) · Proyección propia",
    fontsize=12.5, color=GRAY,
)
fig.tight_layout(rect=(0, 0.06, 1, 1))
fig.savefig(f"{OUT}/g4_proyeccion_escenarios.png", facecolor=BG)
plt.close(fig)

print("ok")
