"""Arma la muestra a clasificar (Despegar, AR) y la exporta en lotes legibles.

Corpus A: App Store AR, las 500 reseñas que entrega el RSS (2023-10 a 2026-11), todas.
Corpus P: Google Play en español (todos los países; Play no filtra por país), reseñas
desde 2025-05-17 (18 meses) con texto de 30+ caracteres, muestreo aleatorio
estratificado por estrellas con semilla 20261117: 1★=100, 2★=60, 3★=50, 4★=40, 5★=50.
Los resultados "sobre todas" del corpus P se re-ponderan por la distribución real de
estrellas de esa población (ver 05_resultados.py).
Uso: <venv>/bin/python scripts/despegar/04_preparar_muestra.py <dir_lotes>
"""
import re, sys
from pathlib import Path
import pandas as pd

ROOT = Path(__file__).resolve().parents[2]
RAW = ROOT / "data/despegar/research/raw"
SEED, CORTE = 20261117, "2025-05-17"
CUOTA = {1: 100, 2: 60, 3: 50, 4: 40, 5: 50}
# Marcas de español rioplatense/argentino (heurística, sólo descriptiva)
AR_RE = re.compile(r"\b(ten[eé]s|pod[eé]s|quer[eé]s|sab[eé]s|sos|vos|ezeiza|aeroparque|flybondi|aerol[ií]neas argentinas|"
                   r"pesos argentinos|afip|arca|mercado ?pago|naranja|cabal|che|laburo|guita|cuotas sin inter[eé]s)\b", re.I)


def load(f):
    x = pd.read_csv(RAW / f)
    x["fecha"] = pd.to_datetime(x["fecha"], utc=True, format="mixed")
    x["texto"] = x["texto"].fillna("").astype(str)
    if "titulo" in x:
        x["titulo"] = x["titulo"].fillna("").astype(str)
    return x


def build():
    a = load("03_reviews_appstore_ar.csv").sort_values("fecha").reset_index(drop=True)
    a["key"] = [f"A{i:03d}" for i in range(len(a))]
    a["corpus"] = "appstore_ar"
    p = load("03_reviews_play_es-global.csv")
    pop = p[(p.fecha >= CORTE) & (p.texto.str.len() >= 30)]
    s = pd.concat([pop[pop.rating == k].sample(n, random_state=SEED) for k, n in CUOTA.items()])
    s = s.sort_values("fecha").reset_index(drop=True)
    s["key"] = [f"P{i:03d}" for i in range(len(s))]
    s["corpus"] = "play_es"
    m = pd.concat([a, s], ignore_index=True)
    m["marca_ar"] = m.texto.str.contains(AR_RE)
    return m, pop


if __name__ == "__main__":
    m, pop = build()
    out = Path(sys.argv[1]); out.mkdir(parents=True, exist_ok=True)
    m.to_csv(out / "muestra.csv", index=False)
    print("poblacion play (18m, >=30c):", len(pop), pop.rating.value_counts().sort_index().to_dict())
    for i in range(0, len(m), 100):
        with open(out / f"lote_{i//100:02d}.txt", "w") as f:
            for r in m.iloc[i:i+100].itertuples():
                t = (r.titulo + " | " if isinstance(r.titulo, str) and r.titulo else "") + r.texto
                f.write(f"{r.key} {r.rating}★ {r.fecha.date()} :: {t[:700]}\n")
    print(len(m))
