"""Muestra de reseñas negativas (1-2★) de la app de Aerolíneas Argentinas desde 2024-01-01
(App Store AR + Play en español) para clasificar con el mismo libro de códigos.
Regla: todas si son menos de 300; si no, 250 al azar estratificadas por año (semilla 20261117,
asignación proporcional). Con los datos del 2026-11-17 son 191, así que entran todas.
Claves: LA### = App Store AR, LP### = Play es.
Uso: <venv>/bin/python scripts/despegar/11_muestra_aerolineas.py <dir_lotes>"""
import sys
from pathlib import Path
import pandas as pd
RAW = Path(__file__).resolve().parents[2] / "data/despegar/research/raw"
out = Path(sys.argv[1]); SEED, N, TOPE = 20261117, 250, 300
def load(f, tag):
    x = pd.read_csv(RAW / f); x["fecha"] = pd.to_datetime(x["fecha"], utc=True, format="mixed")
    x["texto"] = x["texto"].astype(object).fillna("").astype(str); x["titulo"] = x["titulo"].astype(object).fillna("").astype(str)
    x["src"] = tag; return x[(x.rating <= 2) & (x.fecha >= "2024-01-01")]
m = pd.concat([load("03_reviews_appstore_ar_aerolineas.csv", "LA"),
               load("03_reviews_play_es-global_aerolineas.csv", "LP")])
if len(m) >= TOPE:
    m["anio"] = m.fecha.dt.year
    cuota = (m.anio.value_counts(normalize=True) * N).round().astype(int)
    m = pd.concat([g.sample(cuota[a], random_state=SEED) for a, g in m.groupby("anio")])
m = m.sort_values(["src", "fecha"]).reset_index(drop=True)
m["key"] = [f"{s}{i:03d}" for s, i in zip(m.src, m.groupby("src").cumcount())]
m.to_csv(out / "muestra_aerolineas.csv", index=False)
with open(out / "lote_aerolineas.txt", "w") as f:
    for r in m.itertuples():
        t = (r.titulo + " | " if r.titulo else "") + r.texto
        f.write(f"{r.key} {r.rating}★ {r.fecha.date()} :: {t[:700]}\n")
print(m.src.value_counts().to_dict(), m.fecha.dt.year.value_counts().sort_index().to_dict())
