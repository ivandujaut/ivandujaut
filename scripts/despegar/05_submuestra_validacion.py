"""Elige la submuestra de validación (60 reseñas, 12 por estrella, semilla 20261118) del set
clasificado y la escribe SIN etiquetas, para que un segundo clasificador (otra instancia de LLM
con contexto limpio y sólo prompt_clasificacion.txt) la etiquete a ciegas.
Uso: <venv>/bin/python scripts/despegar/05_submuestra_validacion.py <dir_lotes>
"""
import sys
from pathlib import Path
import pandas as pd
d = Path(sys.argv[1])
m = pd.read_csv(d / "muestra.csv")
v = pd.concat([m[m.rating == k].sample(12, random_state=20261118) for k in range(1, 6)]).sample(frac=1, random_state=1)
with open(d / "validacion_ciega.txt", "w") as f:
    for r in v.itertuples():
        t = (r.titulo + " | " if isinstance(r.titulo, str) and r.titulo else "") + r.texto
        f.write(f"{r.key} {r.rating}★ {r.fecha[:10]} :: {t[:700]}\n")
print(len(v))
