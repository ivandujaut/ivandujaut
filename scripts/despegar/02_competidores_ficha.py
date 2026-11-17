"""Rating y cantidad de calificaciones de la ficha de Despegar y competidores en AR.

Google Play: google-play-scraper app(..., country='ar'). El 'score' varía por país pero
'ratings' (cantidad) es global. App Store: iTunes Search/Lookup API, storefront AR
(averageUserRating y userRatingCount son del storefront AR).
Uso: <venv>/bin/python scripts/despegar/02_competidores_ficha.py
"""
import csv, json, urllib.request
from pathlib import Path
from google_play_scraper import app

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "data/despegar/research/raw/03_competidores_ficha_ar.csv"
APPS = [  # nombre, play package, app store id (None = no encontrada)
    ("Despegar", "com.gm.despegar", 511479725),
    ("Turismocity", "com.grupodc.turismocity", 1048245754),
    ("Booking.com", "com.booking", 367003839),
    ("Airbnb", "com.airbnb.android", 401626263),
    ("Expedia", "com.expedia.bookings", 427916203),
    ("Almundo", "com.almundo.almundo_app", 6770575130),
    ("Aerolíneas Argentinas", "net.aper.ARMobile", 959589510),
    ("Flybondi", "com.cordevs.flybondi", None),
    ("JetSMART", None, None),
    ("Mercado Libre", "com.mercadolibre", 463624852),
    ("Avantrip", None, None),
]
rows = []
for name, pkg, aid in APPS:
    r = {"app": name, "play_pkg": pkg or "", "play_score_ar": "", "play_ratings_global": "",
         "play_reviews": "", "play_installs": "", "play_updated": "", "play_dev": "",
         "appstore_id": aid or "", "appstore_score_ar": "", "appstore_ratings_ar": "", "appstore_seller": ""}
    if pkg:
        try:
            a = app(pkg, lang="es", country="ar")
            r.update(play_score_ar=round(a["score"], 2), play_ratings_global=a["ratings"],
                     play_reviews=a["reviews"], play_installs=a["realInstalls"],
                     play_updated=a["updated"], play_dev=a["developer"])
        except Exception as e:
            r["play_dev"] = f"ERR {e}"
    if aid:
        d = json.load(urllib.request.urlopen(f"https://itunes.apple.com/lookup?id={aid}&country=ar"))
        if d["results"]:
            x = d["results"][0]
            r.update(appstore_score_ar=round(x.get("averageUserRating", 0), 2),
                     appstore_ratings_ar=x.get("userRatingCount"), appstore_seller=x.get("sellerName"))
    rows.append(r)
    print(r)
with open(OUT, "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=list(rows[0]))
    w.writeheader(); w.writerows(rows)
