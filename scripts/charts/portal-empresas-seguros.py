"""Gráfico del caso portal-empresas-seguros: la constelación de autogestión.

Regenerable = auditable: lee `data/portal-empresas-seguros/accesos.csv`, que
produce `scripts/analysis/portal-empresas-seguros.py` sobre el HTML servido de
cada aseguradora. Ningún número está escrito a mano acá.

Por qué una matriz y no barras: la tesis no es «cuántos sistemas tiene cada una»
sino «cada audiencia entra por una puerta distinta». Una matriz de audiencias por
aseguradora muestra las dos cosas de un vistazo, y deja ver que la fragmentación
no es un accidente de una empresa sino la forma del sector.

Estilo compartido con los charts de cobranza, nubank y canal: fondo claro, título
bold a la izquierda, ejes grises, footer de atribución abajo a la izquierda.

Correr desde la raíz del repo:  python3 scripts/charts/portal-empresas-seguros.py
"""

import csv
from collections import defaultdict
from pathlib import Path

import matplotlib.pyplot as plt

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
DATOS = RAIZ / "data" / "portal-empresas-seguros" / "accesos.csv"
OUT = RAIZ / "public" / "projects" / "portal-empresas-seguros"

# Orden de lectura: de la puerta del cliente hacia adentro de la operación.
AUDIENCIAS = [
    ("clientes", "Clientes"),
    ("empresas", "Empresas"),
    ("productores", "Productores"),
    ("prestadores y talleres", "Prestadores\ny talleres"),
    ("siniestros y terceros", "Siniestros\ny terceros"),
    ("alianzas", "Alianzas"),
    ("suscripción", "Suscripción"),
]

# Verificada a mano con host único: tiene autogestión sobre el dominio principal
# y ningún subdominio dedicado. La Segunda estuvo acá por error hasta la segunda
# auditoría (su `/autogestion` redirige a la home y sí tiene un acceso dedicado
# de reclamos), así que la lista se cruza contra los datos: una unificada que
# aparezca en `accesos.csv` es una contradicción y frena el script.
UNIFICADAS = ["Sancor"]

# Fecha de la corrida que produjo `accesos.csv` (segunda auditoría del nodo 5).
FECHA_RELEVAMIENTO = "14/08/2026"

conteo: dict[str, dict[str, int]] = defaultdict(lambda: defaultdict(int))
subdominios: dict[str, set[str]] = defaultdict(set)
with DATOS.open(encoding="utf-8") as f:
    for fila in csv.DictReader(f):
        conteo[fila["aseguradora"]][fila["audiencia"]] += 1
        subdominios[fila["aseguradora"]].add(fila["sistema"].split("/")[0])

repetidas = sorted(set(UNIFICADAS) & set(conteo))
assert not repetidas, f"unificadas con accesos dedicados en el CSV: {repetidas}"

# Sólo se dibujan las audiencias con al menos un sistema en el relevamiento.
usadas = [(k, t) for k, t in AUDIENCIAS if any(c.get(k) for c in conteo.values())]
orden = sorted(conteo, key=lambda a: (-sum(conteo[a].values()), a))
filas = orden + UNIFICADAS

fig, ax = plt.subplots(figsize=(10, 6.4), dpi=200)
ax.set_xlim(-0.6, len(usadas) - 0.4)
ax.set_ylim(len(filas) - 0.4, -1.4)
ax.axis("off")

for j, (_, titulo) in enumerate(usadas):
    ax.text(j, -1.25, titulo, ha="center", va="top", fontsize=10.5,
            color=GRAY, linespacing=1.25)

for i, aseguradora in enumerate(filas):
    unificada = aseguradora in UNIFICADAS
    total = sum(conteo[aseguradora].values()) if not unificada else 0
    etiqueta = aseguradora if not unificada else f"{aseguradora}  ·  un solo dominio"
    ax.text(-0.75, i, etiqueta, ha="right", va="center", fontsize=12.5,
            color=FG if not unificada else GRAY,
            fontweight="bold" if total >= 4 else "normal")

    if unificada:
        ax.plot([-0.35, len(usadas) - 0.65], [i, i], color=GRAY,
                linewidth=1.4, alpha=0.55, zorder=2)
        ax.scatter([0], [i], s=150, color=GRAY, alpha=0.75, zorder=3)
        continue

    for j, (clave, _) in enumerate(usadas):
        n = conteo[aseguradora].get(clave, 0)
        if not n:
            ax.scatter([j], [i], s=26, color=GRAY, alpha=0.20, zorder=2)
            continue
        color = AMBER if total >= 4 else DARK
        ax.scatter([j], [i], s=330, color=color, zorder=3)
        if n > 1:
            ax.text(j, i, str(n), ha="center", va="center", fontsize=11.5,
                    color="white", fontweight="bold", zorder=4)

    # Dos números, porque la inferencia no es la misma. Un subdominio propio
    # trae identidad y sesión propias por construcción; cuatro apps sobre un
    # mismo host pueden compartirlas. Federación Patronal es el caso: 4 y 1.
    n_sub = len(subdominios[aseguradora])
    ax.text(len(usadas) - 0.25, i, f"{total}", ha="left", va="center",
            fontsize=13, fontweight="bold", color=AMBER if total >= 4 else DARK)
    ax.text(len(usadas) + 0.62, i, f"{n_sub}", ha="left", va="center",
            fontsize=13, color=GRAY,
            fontweight="bold" if n_sub != total else "normal")

ax.text(len(usadas) - 0.28, -1.25, "Accesos", ha="left", va="top",
        fontsize=10.5, color=GRAY)
ax.text(len(usadas) + 0.58, -1.25, "Subdominios", ha="left", va="top",
        fontsize=10.5, color=GRAY)

# El título se arma con los datos, no a mano: el primer intento decía «en nueve
# aseguradoras» y los 23 sistemas están en seis (las otras tres unifican o
# quedaron inconclusas). Calculado acá, ese error no se puede repetir.
total_sistemas = sum(sum(c.values()) for c in conteo.values())
total_sub = len({s for subs in subdominios.values() for s in subs})
fig.text(0.055, 0.965,
         f"Cada audiencia entra por su propia puerta: {total_sistemas} accesos de\nautogestión en {len(conteo)} aseguradoras",
         fontsize=17, fontweight="bold", ha="left", va="top", linespacing=1.2)

fig.text(0.055, 0.05,
         f"Relevamiento propio sobre el HTML servido de cada home, {FECHA_RELEVAMIENTO} · un punto es un acceso dedicado a esa\n"
         f"audiencia; el número adentro, cuántos · los {total_sistemas} accesos viven en {total_sub} subdominios: Federación Patronal sirve\n"
         f"sus cuatro desde un mismo host, donde la identidad puede ser compartida · piso observado: lo que no viaja\n"
         f"sin JavaScript no se cuenta · Zurich y Rivadavia, inconclusos",
         fontsize=9.5, color=GRAY, ha="left", linespacing=1.5)

fig.subplots_adjust(top=0.83, bottom=0.22, left=0.30, right=0.77)
OUT.mkdir(parents=True, exist_ok=True)
destino = OUT / "constelacion-autogestion.png"
fig.savefig(destino, facecolor=BG)
print(f"→ {destino}")
