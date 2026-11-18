"""Reseñas de la app de Aerolíneas Argentinas (venta directa de la aerolínea), comparador para
"el precio sube al pagar" en vuelos. App Store AR por RSS (id 959589510, páginas 1-10) y
Google Play en español (net.aper.ARMobile; el endpoint filtra por idioma, no por país).
Mismas columnas que 01_bajar_resenas.py. Relevado: 2026-11-17.
Uso: <venv>/bin/python scripts/despegar/10_bajar_resenas_aerolineas.py
"""
import importlib.util
from pathlib import Path
spec = importlib.util.spec_from_file_location("b", Path(__file__).with_name("01_bajar_resenas.py"))
b = importlib.util.module_from_spec(spec); spec.loader.exec_module(b)
b.write(b.OUT / "03_reviews_appstore_ar_aerolineas.csv", b.appstore("959589510", "ar"))
b.write(b.OUT / "03_reviews_play_es-global_aerolineas.csv", b.play("net.aper.ARMobile", "ar", "es", 6000))
