"""Baja reseñas públicas de la app de Despegar/Decolar (Google Play y App Store).

Uso: <venv>/bin/python scripts/despegar/01_bajar_resenas.py
Salida: data/despegar/research/raw/03_reviews_<tienda>_<pais>.csv
Relevado: 2026-11-17.
"""
import csv, json, sys, time, urllib.request
from pathlib import Path
from google_play_scraper import reviews, Sort, app

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "data/despegar/research/raw"
OUT.mkdir(parents=True, exist_ok=True)
COLS = ["id", "fecha", "rating", "texto", "version_app", "thumbsUp", "titulo"]

# OJO: el endpoint de reseñas de Google Play filtra por IDIOMA, no por país.
# Con lang=es, country=ar y country=mx devolvieron las mismas reseñas (600/600 ids
# iguales en la prueba del 2026-11-17). Por eso se guarda una sola base "es-global"
# (reseñas en español de cualquier país) en vez de una por país.
PLAY = [  # (package, etiqueta, country, lang, cantidad objetivo)
    ("com.gm.despegar", "es-global", "ar", "es", 20000),
    ("com.gm.decolar", "br", "br", "pt", 600),
]
APPSTORE = [("511479725", "ar"), ("511479725", "mx"), ("583990782", "br")]


def write(path, rows):
    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=COLS)
        w.writeheader()
        w.writerows(rows)
    print(path.name, len(rows))


def play(pkg, country, lang, n):
    out, token = [], None
    while len(out) < n:
        batch, token = reviews(pkg, lang=lang, country=country, sort=Sort.NEWEST,
                               count=min(200, n - len(out)), continuation_token=token)
        if not batch:
            break
        out += batch
        if token is None or token.token is None:
            break
        time.sleep(0.5)
    return [{"id": r["reviewId"], "fecha": r["at"].isoformat(), "rating": r["score"],
             "texto": (r["content"] or "").replace("\n", " ").strip(),
             "version_app": r.get("reviewCreatedVersion") or r.get("appVersion") or "",
             "thumbsUp": r.get("thumbsUpCount", ""), "titulo": ""} for r in out]


def appstore(app_id, country):
    rows = []
    for page in range(1, 11):
        url = f"https://itunes.apple.com/{country}/rss/customerreviews/page={page}/id={app_id}/sortby=mostrecent/json"
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"}), timeout=30) as r:
                data = json.load(r)
        except Exception as e:
            print("appstore", country, page, "ERR", e)
            break
        entries = data.get("feed", {}).get("entry", [])
        if isinstance(entries, dict):
            entries = [entries]
        entries = [e for e in entries if "im:rating" in e]
        if not entries:
            break
        for e in entries:
            rows.append({"id": e["id"]["label"], "fecha": e["updated"]["label"],
                         "rating": int(e["im:rating"]["label"]),
                         "texto": e["content"]["label"].replace("\n", " ").strip(),
                         "version_app": e.get("im:version", {}).get("label", ""),
                         "thumbsUp": e.get("im:voteSum", {}).get("label", ""),
                         "titulo": e["title"]["label"]})
        time.sleep(0.5)
    return rows


if __name__ == "__main__":
    for pkg, tag, c, l, n in PLAY:
        write(OUT / f"03_reviews_play_{tag}.csv", play(pkg, c, l, n))
    for aid, c in APPSTORE:
        write(OUT / f"03_reviews_appstore_{c}.csv", appstore(aid, c))
