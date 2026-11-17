"""Reseñas recientes de Turismocity y Booking en AR (App Store AR por RSS; Play en español).
Mismas columnas que 01_bajar_resenas.py. Uso: <venv>/bin/python scripts/despegar/03_bajar_resenas_competidores.py
"""
import importlib.util
from pathlib import Path
spec = importlib.util.spec_from_file_location("b", Path(__file__).with_name("01_bajar_resenas.py"))
b = importlib.util.module_from_spec(spec); spec.loader.exec_module(b)
for name, pkg, aid in [("turismocity", "com.grupodc.turismocity", "1048245754"), ("booking", "com.booking", "367003839")]:
    b.write(b.OUT / f"03_reviews_appstore_ar_{name}.csv", b.appstore(aid, "ar"))
    b.write(b.OUT / f"03_reviews_play_es-global_{name}.csv", b.play(pkg, "ar", "es", 400))
