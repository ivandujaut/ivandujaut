"""Despegar contra la venta directa de Aerolíneas Argentinas: frecuencia de "promesa rota al pagar"
(PS, CO, CU, PA como pain o pain2) en reseñas 1-2★, con IC 95% de Wilson y test exacto de Fisher.
Guarda raw/03_reviews_clasificadas_aerolineas.csv.
Uso: <venv>/bin/python scripts/despegar/12_comparar_aerolineas.py <dir_lotes>"""
import sys
from math import comb, sqrt
from pathlib import Path
import pandas as pd
D = Path(sys.argv[1]); RAW = Path(__file__).resolve().parents[2] / "data/despegar/research/raw"
FAM = ["PS", "CO", "CU", "PA"]
# Bordes declarados (sensibilidad): LP001 "dice un precio y con tarjeta me cobraron 24% más" se codificó CO,
# podría ser PS. Fallas técnicas justo al pagar (la app se cierra o se detiene en el paso de pago) se
# codificaron PA; LP104 es PA por "falta de medio (USD)" del libro, pero su motivo es el impuesto.
PA_TECNICO = ["LP041", "LP042", "LP044", "LP049", "LP090", "LP093"]


def wilson(k, n, z=1.959964):
    p = k / n; d = 1 + z**2 / n; c = (p + z**2 / (2 * n)) / d
    h = z * sqrt(p * (1 - p) / n + z**2 / (4 * n**2)) / d
    return max(0, c - h), min(1, c + h)


def fisher(a, n1, b, n2):  # dos colas, suma de tablas con prob <= la observada
    K, N = a + b, n1 + n2
    p = lambda x: comb(n1, x) * comb(n2, K - x) / comb(N, K)
    po = p(a); lo, hi = max(0, K - n2), min(K, n1)
    return sum(p(x) for x in range(lo, hi + 1) if p(x) <= po * (1 + 1e-9))


lab = pd.read_csv(D / "et_aerolineas.txt", sep=" ", names=["key", "etapa", "pain", "pain2", "sentimiento"])
m = pd.read_csv(D / "muestra_aerolineas.csv").merge(lab, on="key")
m["corpus"] = m.src.map({"LA": "appstore_ar", "LP": "play_es"})
m[["corpus", "key", "id", "fecha", "rating", "version_app", "etapa", "pain", "pain2", "sentimiento", "titulo", "texto"]] \
    .to_csv(RAW / "03_reviews_clasificadas_aerolineas.csv", index=False)

d = pd.read_csv(RAW / "03_reviews_clasificadas_ar.csv"); d = d[d.rating <= 2].copy()
d["fecha"] = pd.to_datetime(d.fecha, utc=True, format="mixed")
grupos = {
    "Aerolíneas, App Store AR + Play es (2024-01→)": m,
    "Aerolíneas, sólo App Store AR (2024-01→)": m[m.corpus == "appstore_ar"],
    "Despegar, App Store AR (2023-10→)": d[d.corpus == "appstore_ar"],
    "Despegar, App Store AR (2024-01→)": d[(d.corpus == "appstore_ar") & (d.fecha >= "2024-01-01")],
    "Despegar, App Store AR + Play es": d,
}


def cuenta(x):
    a = lambda c: ((x.pain == c) | (x.pain2 == c))
    r = {"n": len(x), "PS (principal)": (x.pain == "PS").sum()}
    r |= {c: a(c).sum() for c in FAM}
    r["Familia"] = (x.pain.isin(FAM) | x.pain2.isin(FAM)).sum()
    r["Checkout (etapa PAG)"] = (x.etapa == "PAG").sum()
    return r


filas = {g: cuenta(x) for g, x in grupos.items()}
t = pd.DataFrame(filas).T
fmt = lambda k, n: f"{k} ({100*k/n:.1f}%; IC {100*wilson(k,n)[0]:.1f}-{100*wilson(k,n)[1]:.1f})"
out = pd.DataFrame({g: {c: fmt(r[c], r["n"]) for c in ["PS (principal)"] + FAM + ["Familia"]} | {"n": r["n"]}
                    for g, r in filas.items()}).T
print(out.to_markdown())
A = filas["Aerolíneas, App Store AR + Play es (2024-01→)"]; a2 = filas["Aerolíneas, sólo App Store AR (2024-01→)"]
print("\n## Fisher exacto (dos colas)")
for g in ["Despegar, App Store AR (2023-10→)", "Despegar, App Store AR + Play es", "Despegar, App Store AR (2024-01→)"]:
    B = filas[g]
    for c in ["PS (principal)", "PS", "Familia"]:
        print(f"Aerolíneas comb. vs {g} · {c}: {A[c]}/{A['n']} vs {B[c]}/{B['n']} p={fisher(A[c],A['n'],B[c],B['n']):.2g}"
              f" | Aerolíneas AppStore {a2[c]}/{a2['n']} p={fisher(a2[c],a2['n'],B[c],B['n']):.2g}")
# Sensibilidad
fam = m.pain.isin(FAM) | m.pain2.isin(FAM)
print("\n## Sensibilidad Aerolíneas (n=%d)" % len(m))
print("Familia sin fallas técnicas al pagar ni LP104:", (fam & ~m.key.isin(PA_TECNICO + ["LP104"])).sum())
print("PS si LP001 fuera PS:", ((m.pain == "PS") | (m.pain2 == "PS")).sum() + 1)
# PS condicionado a quejarse del checkout (etapa PAG o con PS/CO/CU/PA)
for g, x in [("Aerolíneas", m), ("Despegar AppStore AR", d[d.corpus == "appstore_ar"]), ("Despegar comb.", d)]:
    f = x.pain.isin(FAM) | x.pain2.isin(FAM); ps = ((x.pain == "PS") | (x.pain2 == "PS")) & f
    print(f"{g}: PS dentro de la familia {ps.sum()}/{f.sum()}")
print("\n## Pain principal Aerolíneas (% de 1-2★)\n" + m.pain.value_counts().to_frame("n").assign(
    pct=lambda y: (100 * y.n / len(m)).round(1)).to_markdown())
print("\n## Etapa Aerolíneas\n" + m.etapa.value_counts().to_string())
print("\n## Familia, claves:", sorted(m[fam].key))
