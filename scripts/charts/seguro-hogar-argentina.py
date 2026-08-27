"""Gráficos del caso seguro-hogar-argentina (g1 estancamiento, g2 penetración, g3 canal).

Regenerable = auditable: cada cifra de acá tiene que estar en el facts.md del caso.
- g1: variación interanual de pólizas vigentes por ramo (anexo SSN, 1T2025 vs 1T2026),
      cálculo propio que coincide con el dato publicado por la SSN.
- g2: estimaciones de penetración del seguro de hogar; cálculo propio sobre SSN×INDEC,
      la cifra de industria, y la encuesta de Chubb (refutada contra el techo duro).
- g3: relevamiento propio de los cotizadores de tres jugadores del ramo (agosto 2026).

Estilo compartido con nubank/cobranza: fondo claro, título bold a la izquierda,
ejes grises, footer de atribución abajo a la izquierda.

Correr desde la raíz del repo:  python3 scripts/charts/seguro-hogar-argentina.py
"""

from pathlib import Path

import matplotlib.pyplot as plt
from matplotlib.patches import Patch

FG = "#111111"
GRAY = "#8a8a8a"
BG = "#f8f9fa"
BANK = "#2f74dd"
OTHER = "#b8c4d4"
WARN = "#e8663c"  # el ramo que se queda quieto / lo que se refuta
GOOD = "#17a673"

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

OUT = str(Path(__file__).resolve().parents[2] / "public" / "projects" / "seguro-hogar-argentina")


def pct(v: float) -> str:
    return f"{v:+.2f}%".replace(".", ",")


def fmt(v: float) -> str:
    s = f"{v:.1f}"
    if s.endswith(".0"):
        s = s[:-2]
    return s.replace(".", ",") + "%"


# --------------------------------------------------- g1: estancamiento (gancho)
# Variación interanual de pólizas vigentes, 1T2025 -> 1T2026 (anexo SSN, Cuadro 1).
# Cálculo propio que coincide con la columna interanual publicada por la SSN.
ramos = [
    ("Total del mercado", 6.57, BANK),
    ("Incendio", 4.32, OTHER),
    ("Combinado Familiar\n(seguro de hogar)", -0.22, WARN),
    ("Robo y Riesgos Similares", -1.62, OTHER),
]

fig, ax = plt.subplots(figsize=(14.95, 8.87), dpi=100)
names = [r[0] for r in ramos][::-1]
vals = [r[1] for r in ramos][::-1]
colors = [r[2] for r in ramos][::-1]
bars = ax.barh(names, vals, color=colors, height=0.6)
for b, v in zip(bars, vals):
    off = 0.15 if v >= 0 else -0.15
    ax.text(v + off, b.get_y() + b.get_height() / 2, pct(v),
            va="center", ha="left" if v >= 0 else "right",
            fontsize=16, fontweight="bold", color=FG)
ax.axvline(0, color=GRAY, linewidth=1)
ax.set_xlabel("Variación interanual de pólizas vigentes, 1T2025 a 1T2026", fontsize=16)
ax.set_xlim(-3.2, 8.2)
ax.tick_params(axis="y", labelsize=16)
ax.tick_params(axis="x", labelsize=14)
for s in ("top", "right", "left", "bottom"):
    ax.spines[s].set_visible(False)
ax.set_xticks([])
fig.text(0.012, 0.945, "El hogar se quedó quieto mientras el mercado crecía",
         fontsize=23, fontweight="bold", color=FG, va="top")
fig.text(
    0.012, 0.012,
    "Pólizas vigentes al cierre del trimestre · Cálculo propio sobre el anexo estadístico SSN "
    "(coincide con la variación interanual publicada)",
    fontsize=13, color=GRAY,
)
fig.tight_layout(rect=(0, 0.045, 1, 0.9))
fig.savefig(f"{OUT}/g1_estancamiento.png", facecolor=BG)
plt.close(fig)

# --------------------------------------------------------- g2: penetración
# Estimaciones de cuánta parte de las viviendas tiene seguro de hogar.
# Techo y cálculo propio: pólizas SSN / 15.699.016 viviendas ocupadas (INDEC 2022).
fig, ax = plt.subplots(figsize=(14.95, 8.87), dpi=100)

# banda de lo plausible según datos duros: del cálculo propio (14%) al techo (25,2%)
ax.axvspan(14, 25.2, color=BANK, alpha=0.10)
ax.text(19.6, 3.62, "rango plausible\nsegún datos duros", ha="center", va="bottom",
        fontsize=13, color=BANK)

rows = [
    ("Chubb (encuesta autorreportada)", 45.0, 45.0, WARN, True),
    ("Techo: todo el ramo ÷ viviendas", 25.2, 25.2, FG, False),
    ("Industria: 17 de cada 100 hogares", 17.0, 17.0, FG, False),
    ("Mi cálculo: hogar ÷ viviendas", 14.0, 18.0, GOOD, False),
]
ys = list(range(len(rows)))[::-1]
for y, (label, lo, hi, color, refuted) in zip(ys, rows):
    if lo == hi:
        ax.scatter([lo], [y], s=260, color=color, zorder=5)
        if refuted:
            ax.scatter([lo], [y], s=520, facecolors="none", edgecolors=WARN, linewidths=2.2, zorder=6)
            ax.text(lo - 1.6, y, fmt(lo), va="center", ha="right",
                    fontsize=17, fontweight="bold", color=color)
            ax.text(lo - 1.6, y - 0.34, "refutada", va="center", ha="right",
                    fontsize=13.5, style="italic", color=WARN)
        else:
            ax.text(lo + 0.9, y, fmt(lo), va="center",
                    fontsize=17, fontweight="bold", color=color)
    else:
        ax.plot([lo, hi], [y, y], color=color, linewidth=7, solid_capstyle="round", zorder=5)
        ax.text(hi + 0.9, y, f"{lo:.0f}–{hi:.0f}%", va="center",
                fontsize=17, fontweight="bold", color=color)
ax.set_yticks(ys)
ax.set_yticklabels([r[0] for r in rows], fontsize=16)
ax.set_xlim(0, 52)
ax.set_ylim(-0.6, 3.9)
ax.set_xlabel("Viviendas con seguro de hogar (%)", fontsize=16)
ax.tick_params(axis="x", labelsize=14)
for s in ("top", "right", "left"):
    ax.spines[s].set_visible(False)
fig.text(0.012, 0.945, "El “45% tiene seguro de hogar” no cierra contra los datos duros",
         fontsize=22, fontweight="bold", color=FG, va="top")
fig.text(
    0.012, 0.012,
    "Denominador: 15.699.016 viviendas particulares ocupadas (INDEC 2022) · "
    "Cálculo propio sobre pólizas vigentes SSN",
    fontsize=13, color=GRAY,
)
fig.tight_layout(rect=(0, 0.045, 1, 0.9))
fig.savefig(f"{OUT}/g2_penetracion.png", facecolor=BG)
plt.close(fig)

# --------------------------------------------------------- g3: canal roto
# Relevamiento propio de los cotizadores (agosto 2026). Solo lo verificado.
fig, ax = plt.subplots(figsize=(14.95, 7.6), dpi=100)
ax.axis("off")

cols = ["", "Cotiza el hogar\nonline", "Muestra el precio sin\npedir datos personales", "Cómo te vende"]
data = [
    ["La Caja", "Sí", "No", "Pide teléfono + email\n(tras un reCAPTCHA)"],
    ["Galicia", "No", "No", "Formulario de lead\no productor"],
    ["Federación Patronal", "No", "No", "Productor asesor"],
]
ncol = len(cols)
nrow = len(data)
x0, y0, w, h = 0.02, 0.12, 0.96, 0.66
cw = [0.30, 0.17, 0.24, 0.29]
cx = [x0 + sum(cw[:i]) * w for i in range(ncol)]

# header
for j, c in enumerate(cols):
    ax.text(cx[j] + cw[j] * w / 2, y0 + h + 0.03, c, ha="center", va="bottom",
            fontsize=15.5, fontweight="bold", color=FG, transform=ax.transAxes)
ax.plot([x0, x0 + w], [y0 + h, y0 + h], color=GRAY, lw=1.2, transform=ax.transAxes)

rh = h / nrow
for i, row in enumerate(data):
    yc = y0 + h - (i + 0.5) * rh
    if i % 2 == 0:
        ax.add_patch(plt.Rectangle((x0, y0 + h - (i + 1) * rh), w, rh, transform=ax.transAxes,
                                    color="#ffffff", zorder=0))
    ax.text(cx[0] + 0.01, yc, row[0], ha="left", va="center", fontsize=15.5,
            fontweight="bold", color=FG, transform=ax.transAxes)
    for j in (1, 2):
        val = row[j]
        color = GOOD if val == "Sí" else WARN
        ax.text(cx[j] + cw[j] * w / 2, yc, val, ha="center", va="center",
                fontsize=18, fontweight="bold", color=color, transform=ax.transAxes)
    ax.text(cx[3] + cw[3] * w / 2, yc, row[3], ha="center", va="center", fontsize=13.5,
            color=FG, transform=ax.transAxes)

ax.set_title(
    "Ninguno te deja ver un precio de hogar sin pedirte datos",
    fontsize=24, fontweight="bold", loc="left", pad=14, color=FG, x=0.0,
)
fig.text(
    0.01, 0.03,
    "Relevamiento propio de los cotizadores de La Caja, Galicia y Federación Patronal (agosto 2026)",
    fontsize=13, color=GRAY,
)
fig.savefig(f"{OUT}/g3_canal.png", facecolor=BG)
plt.close(fig)

print("ok")
