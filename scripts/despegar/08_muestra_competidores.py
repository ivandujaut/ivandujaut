"""Muestra de reseñas negativas (1-2★) de competidores para comparar pains con el mismo libro
de códigos. Booking: App Store AR, 80 al azar (semilla 20261117) de las 1-2★ (2025-10→2026-11).
Turismocity: todas las 1-2★ de Play es (últimas 400 reseñas) + App Store AR desde 2024-01.
Uso: <venv>/bin/python scripts/despegar/08_muestra_competidores.py <dir_lotes>"""
import sys
from pathlib import Path
import pandas as pd
RAW = Path(__file__).resolve().parents[2] / "data/despegar/research/raw"
out = Path(sys.argv[1])
def load(f, tag):
    x = pd.read_csv(RAW / f); x["fecha"] = pd.to_datetime(x["fecha"], utc=True, format="mixed")
    x["texto"] = x["texto"].fillna("").astype(str); x["titulo"] = x["titulo"].fillna("").astype(str); x["src"] = tag; return x
b = load("03_reviews_appstore_ar_booking.csv", "B")
b = b[b.rating <= 2].sample(80, random_state=20261117)
t1 = load("03_reviews_play_es-global_turismocity.csv", "T"); t1 = t1[t1.rating <= 2]
t2 = load("03_reviews_appstore_ar_turismocity.csv", "T"); t2 = t2[(t2.rating <= 2) & (t2.fecha >= "2024-01-01")]
m = pd.concat([b, t1, t2]).reset_index(drop=True)
m["key"] = [f"{s}{i:03d}" for i, s in enumerate(m.src)]
m.to_csv(out / "muestra_competidores.csv", index=False)
with open(out / "lote_competidores.txt", "w") as f:
    for r in m.itertuples():
        t = (r.titulo + " | " if r.titulo else "") + r.texto
        f.write(f"{r.key} {r.rating}★ {r.fecha.date()} :: {t[:600]}\n")
print(m.src.value_counts().to_dict())
