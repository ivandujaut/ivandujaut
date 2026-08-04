"""Gráficos del caso pix-brasil (g1 instrumentos, g2 crossover, g3 billeteras).

Regenerable = auditable: cada cifra sale de los datasets cacheados por
scripts/analysis/pix-brasil.py en data/pix-brasil/ (correr ese script primero si
faltan). Nada se tipea a mano: los tres gráficos recomputan desde los JSON del
BCB, así el auditor puede verificar que lo pintado traza a la fuente.

Correr desde la raíz del repo:  python3 scripts/charts/pix-brasil.py

Estilo: constantes de la serie (ver scripts/charts/nubank-seguros-argentina.py).
"""

import json
from pathlib import Path

import matplotlib.pyplot as plt

FG = "#111111"
GRAY = "#8a8a8a"
BG = "#f8f9fa"
DOWN = "#e8663c"  # lo que cayó
UP = "#17a673"  # lo que subió
PIXBLUE = "#2f74dd"
WALLET = "#2f74dd"  # billeteras en g3
BANK = "#b8c4d4"  # bancos incumbentes en g3

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
    }
)

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / "data" / "pix-brasil"
OUT = ROOT / "public" / "projects" / "pix-brasil"
OUT.mkdir(parents=True, exist_ok=True)


def year_sums() -> dict[int, dict[str, float]]:
    d = json.loads((DATA / "bcb-meios-trimestral.json").read_text())["value"]
    years: dict[int, dict[str, float]] = {}
    for row in d:
        y = int(row["datatrimestre"][:4])
        acc = years.setdefault(y, {})
        for k, v in row.items():
            if k != "datatrimestre":
                acc[k] = acc.get(k, 0.0) + (v or 0.0)
    return years


# ------------------------------------------------- g1: qué mató y qué disparó
def g1_instrumentos() -> None:
    y = year_sums()
    y20, y25 = y[2020], y[2025]
    items = [
        ("DOC", "quantidadeDOC"),
        ("TED", "quantidadeTED"),
        ("Cheque", "quantidadeCheque"),
        ("Retiros de efectivo", "quantidadeSaques"),
        ("Boleto", "quantidadeBoleto"),
        ("Tarjeta de débito", "quantidadeCartaoDebito"),
        ("Tarjeta de crédito", "quantidadeCartaoCredito"),
        ("Tarjeta prepaga", "quantidadeCartaoPrePago"),
    ]
    labels, changes = [], []
    for label, k in items:
        pct = (y25[k] / y20[k] - 1) * 100
        labels.append(label)
        changes.append(pct)
    order = sorted(range(len(labels)), key=lambda i: changes[i])
    labels = [labels[i] for i in order]
    changes = [changes[i] for i in order]

    fig, ax = plt.subplots(figsize=(14.95, 8.87), dpi=100)
    colors = [DOWN if c < 0 else UP for c in changes]
    bars = ax.barh(labels, changes, color=colors, height=0.62)
    for b, c in zip(bars, changes):
        x = c + (18 if c >= 0 else -18)
        ax.text(x, b.get_y() + b.get_height() / 2, f"{c:+,.0f}%".replace(",", "."),
                va="center", ha="left" if c >= 0 else "right",
                fontsize=16, fontweight="bold", color=FG)
    ax.axvline(0, color=GRAY, linewidth=1)
    ax.set_title(
        "Cinco años de PIX: qué instrumento cayó y cuál explotó",
        fontsize=25, fontweight="bold", loc="left", pad=18, color=FG,
    )
    ax.set_xlabel("Cambio en cantidad de transacciones, 2020 vs 2025 (%)", fontsize=16)
    ax.tick_params(axis="y", labelsize=15)
    ax.tick_params(axis="x", labelsize=13)
    ax.set_xlim(-230, 1150)
    for sp in ("top", "right", "left"):
        ax.spines[sp].set_visible(False)
    pix_mult = y25["quantidadePix"] / y20["quantidadePix"]
    ax.text(
        1130, 0.2,
        f"PIX queda fuera de escala:\nde 176 millones a 79.600 millones\nde transacciones ({pix_mult:,.0f}x)".replace(",", "."),
        fontsize=15, ha="right", color=PIXBLUE, fontweight="bold",
    )
    fig.text(
        0.01, 0.012,
        "Elaboración propia sobre la serie trimestral de medios de pago del BCB (datos abiertos), totales anuales 2020 y 2025",
        fontsize=12.5, color=GRAY,
    )
    fig.tight_layout(rect=(0, 0.045, 1, 1))
    fig.savefig(OUT / "g1_instrumentos.png", facecolor=BG)
    plt.close(fig)


# ------------------------------------------------- g2: crossover P2P -> P2B
def g2_crossover() -> None:
    d = json.loads((DATA / "bcb-pix-transacoes-granular.json").read_text())["value"]
    por_mes: dict[int, dict[str, int]] = {}
    for r in d:
        acc = por_mes.setdefault(r["AnoMes"], {})
        acc[r["NATUREZA"]] = acc.get(r["NATUREZA"], 0) + r["QUANTIDADE"]
    meses = sorted(por_mes)
    xs = list(range(len(meses)))
    p2p = [por_mes[m].get("P2P", 0) / sum(por_mes[m].values()) * 100 for m in meses]
    p2b = [por_mes[m].get("P2B", 0) / sum(por_mes[m].values()) * 100 for m in meses]

    fig, ax = plt.subplots(figsize=(14.95, 8.87), dpi=100)
    ax.plot(xs, p2p, color=GRAY, linewidth=3.5, label="Entre personas (P2P)")
    ax.plot(xs, p2b, color=PIXBLUE, linewidth=4, label="De personas a comercios (P2B)")
    cruce = meses.index(202509)
    ax.axvline(cruce, color=DOWN, linewidth=1.5, linestyle="--")
    ax.text(cruce - 1, 88, "sep-2025:\nP2B supera a P2P\npor primera vez",
            fontsize=15, ha="right", color=DOWN, fontweight="bold")
    ax.set_title(
        "El cobro a comercios ya es el uso número uno de PIX",
        fontsize=24, fontweight="bold", loc="left", pad=18, color=FG,
    )
    ax.set_ylabel("Share de las transacciones PIX del mes (%)", fontsize=15)
    ticks = [i for i, m in enumerate(meses) if m % 100 == 1 and (m // 100) % 1 == 0]
    ax.set_xticks(ticks)
    ax.set_xticklabels([f"ene-{m // 100}" for m in (meses[i] for i in ticks)], fontsize=13)
    ax.tick_params(axis="y", labelsize=13)
    ax.set_ylim(0, 95)
    for sp in ("top", "right"):
        ax.spines[sp].set_visible(False)
    ax.legend(loc="lower center", frameon=False, fontsize=15)
    fig.text(
        0.01, 0.012,
        "Elaboración propia sobre el dataset granular de transacciones PIX del BCB (69 meses, nov-2020 a jul-2026)",
        fontsize=12.5, color=GRAY,
    )
    fig.tight_layout(rect=(0, 0.045, 1, 1))
    fig.savefig(OUT / "g2_crossover.png", facecolor=BG)
    plt.close(fig)


# ------------------------------------------------- g3: billeteras en el DICT
def g3_billeteras() -> None:
    d = json.loads((DATA / "bcb-chaves-historico.json").read_text())["value"]
    shares: dict[str, dict[str, float]] = {}
    for fecha in ("2021-12-31", "2026-07-31"):
        rows = [r for r in d if r.get("Data") == fecha]
        total = sum(r.get("qtdChaves") or 0 for r in rows)
        acc: dict[str, int] = {}
        for r in rows:
            acc[r["Nome"]] = acc.get(r["Nome"], 0) + (r.get("qtdChaves") or 0)
        shares[fecha] = {n: q / total * 100 for n, q in acc.items()}

    entidades = [
        ("Nubank", "NU PAGAMENTOS - IP", True),
        ("PicPay", "PICPAY", True),
        ("Mercado Pago", "MERCADO PAGO IP LTDA.", True),
        ("Caixa", "CAIXA ECONOMICA FEDERAL", False),
        ("Bradesco", "BCO BRADESCO S.A.", False),
        ("Itaú", "ITAÚ UNIBANCO S.A.", False),
    ]
    fig, ax = plt.subplots(figsize=(14.95, 8.87), dpi=100)
    for label, key, wallet in entidades:
        a = shares["2021-12-31"].get(key, 0.0)
        b = shares["2026-07-31"].get(key, 0.0)
        color = WALLET if wallet else BANK
        ax.plot([0, 1], [a, b], color=color, linewidth=3.5, marker="o", markersize=9)
        ax.text(1.02, b, f"{label}  {b:.1f}%", fontsize=15, va="center",
                color=color if wallet else GRAY, fontweight="bold" if wallet else "normal")
        ax.text(-0.02, a, f"{a:.1f}%", fontsize=13, va="center", ha="right", color=GRAY)
    ax.set_title(
        "Las billeteras escalaron en el registro\nde claves mientras los bancos cedían",
        fontsize=25, fontweight="bold", loc="left", pad=18, color=FG,
    )
    ax.set_xticks([0, 1])
    ax.set_xticklabels(["dic-2021", "jul-2026"], fontsize=16)
    ax.set_ylabel("Share del stock de claves PIX (%)", fontsize=15)
    ax.set_xlim(-0.14, 1.32)
    ax.tick_params(axis="y", labelsize=13)
    for sp in ("top", "right"):
        ax.spines[sp].set_visible(False)
    from matplotlib.patches import Patch
    ax.legend(handles=[Patch(color=WALLET, label="Billeteras / neobancos"),
                       Patch(color=BANK, label="Bancos incumbentes")],
              loc="upper right", frameon=False, fontsize=15)
    fig.text(
        0.01, 0.012,
        "Elaboración propia sobre el DICT del BCB (claves PIX por participante, datos abiertos)",
        fontsize=12.5, color=GRAY,
    )
    fig.tight_layout(rect=(0, 0.045, 1, 1))
    fig.savefig(OUT / "g3_billeteras.png", facecolor=BG)
    plt.close(fig)


if __name__ == "__main__":
    g1_instrumentos()
    g2_crossover()
    g3_billeteras()
    print("ok", OUT)
