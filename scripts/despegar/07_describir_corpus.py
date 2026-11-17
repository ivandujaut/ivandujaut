"""Describe el corpus crudo: cantidades, fechas, estrellas por trimestre/semestre, rating por
mes y por versión. Uso: <venv>/bin/python scripts/despegar/07_describir_corpus.py"""
from pathlib import Path
import pandas as pd
RAW = Path(__file__).resolve().parents[2] / "data/despegar/research/raw"

def load(f):
    x = pd.read_csv(RAW / f); x["fecha"] = pd.to_datetime(x["fecha"], utc=True, format="mixed")
    x["texto"] = x["texto"].fillna("").astype(str); return x

print("| archivo | n | desde | hasta | ★ prom | % 1-2★ | % 5★ | largo mediano |")
print("|---|---|---|---|---|---|---|---|")
for f in sorted(RAW.glob("03_reviews_*.csv")):
    if "clasificadas" in f.name: continue
    x = load(f.name)
    print(f"| {f.name} | {len(x)} | {x.fecha.min().date()} | {x.fecha.max().date()} | {x.rating.mean():.2f} | {(x.rating<=2).mean()*100:.1f} | {(x.rating==5).mean()*100:.1f} | {x.texto.str.len().median():.0f} |")

p = load("03_reviews_play_es-global.csv")
p["q"] = p.fecha.dt.tz_localize(None).dt.to_period("Q").astype(str)
g = p[p.fecha >= "2023-01-01"].groupby("q")
t = pd.DataFrame({"n": g.size(), "★ prom": g.rating.mean().round(2),
                  "% 1★": g.rating.apply(lambda s: (s == 1).mean() * 100).round(1),
                  "% 2★": g.rating.apply(lambda s: (s == 2).mean() * 100).round(1),
                  "% 3★": g.rating.apply(lambda s: (s == 3).mean() * 100).round(1),
                  "% 4★": g.rating.apply(lambda s: (s == 4).mean() * 100).round(1),
                  "% 5★": g.rating.apply(lambda s: (s == 5).mean() * 100).round(1),
                  "largo mediano": g.texto.apply(lambda s: s.str.len().median()),
                  "% texto <20c": g.texto.apply(lambda s: (s.str.len() < 20).mean() * 100).round(1)})
print("\n## Play es-global por trimestre (2023→2026)\n" + t.to_markdown())
pre = p[(p.fecha >= "2018-01-01")]
pre_y = pre.groupby(pre.fecha.dt.year).agg(n=("rating", "size"), prom=("rating", "mean"), pct12=("rating", lambda s: (s <= 2).mean() * 100))
print("\n## Play es-global por año\n" + pre_y.round(2).to_markdown())

a = load("03_reviews_appstore_ar.csv")
a["sem"] = a.fecha.dt.year.astype(str) + "-S" + ((a.fecha.dt.month > 6) + 1).astype(str)
g = a.groupby("sem")
print("\n## App Store AR por semestre\n" + pd.DataFrame({"n": g.size(), "★ prom": g.rating.mean().round(2),
      "% 1-2★": g.rating.apply(lambda s: (s <= 2).mean() * 100).round(1), "% 5★": g.rating.apply(lambda s: (s == 5).mean() * 100).round(1)}).to_markdown())

r = p[p.fecha >= "2025-05-01"].copy(); r["mes"] = r.fecha.dt.strftime("%Y-%m")
g = r.groupby("mes")
print("\n## Play es-global por mes (desde 2025-05)\n" + pd.DataFrame({"n": g.size(), "★ prom": g.rating.mean().round(2),
      "% 1-2★": g.rating.apply(lambda s: (s <= 2).mean() * 100).round(1)}).to_markdown())
r["ver"] = r.version_app.astype(str).str.extract(r"^(\d+\.\d+)")[0]
g = r.dropna(subset=["ver"]).groupby("ver")
v = pd.DataFrame({"n": g.size(), "★ prom": g.rating.mean().round(2), "% 1-2★": g.rating.apply(lambda s: (s <= 2).mean() * 100).round(1),
                  "desde": g.fecha.min().dt.date, "hasta": g.fecha.max().dt.date})
print("\n## Play es-global por versión (n>=40, desde 2025-05)\n" + v[v.n >= 40].to_markdown())
print("\nsin versión:", r.version_app.isna().sum(), "de", len(r))
