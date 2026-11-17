"""Compara la mezcla de pains de reseñas 1-2★ de Despegar vs Booking y Turismocity, con el mismo
libro de códigos. Guarda raw/03_reviews_clasificadas_competidores.csv.
Uso: <venv>/bin/python scripts/despegar/09_comparar_competidores.py <dir_lotes>"""
import sys
from pathlib import Path
import pandas as pd
sys.argv += []
D = Path(sys.argv[1]); RAW = Path(__file__).resolve().parents[2] / "data/despegar/research/raw"
FAM = {"PS": "Precio/condiciones cambian al comprar", "ND": "Precio/condiciones cambian al comprar",
       "CO": "Precio/condiciones cambian al comprar", "CU": "Precio/condiciones cambian al comprar",
       "PA": "Pago falla", "LE": "App: performance/bugs/UX/login", "BU": "App: performance/bugs/UX/login",
       "UX": "App: performance/bugs/UX/login", "LO": "App: performance/bugs/UX/login",
       "AE": "Intermediación post-compra (cambios, caídas, reembolsos, atención)",
       "RC": "Intermediación post-compra (cambios, caídas, reembolsos, atención)",
       "RE": "Intermediación post-compra (cambios, caídas, reembolsos, atención)",
       "GE": "Intermediación post-compra (cambios, caídas, reembolsos, atención)",
       "AT": "Intermediación post-compra (cambios, caídas, reembolsos, atención)",
       "BO": "Bot/IA", "PR": "Proveedor en destino (hotel, anfitrión, traslado)", "CA": "Caro / poco competitivo",
       "FI": "Puntos/cupones propios", "PU": "Publicidad", "ES": "Genérico/otro", "OT": "Genérico/otro", "NO": "Sin pain"}
lab = pd.read_csv(D / "et_competidores.txt", sep=" ", names=["key", "pain", "pain2"])
m = pd.read_csv(D / "muestra_competidores.csv").merge(lab, on="key")
m["app"] = m.src.map({"B": "Booking (App Store AR)", "T": "Turismocity (Play es + App Store AR)"})
m[["app", "key", "id", "fecha", "rating", "pain", "pain2", "titulo", "texto"]].to_csv(RAW / "03_reviews_clasificadas_competidores.csv", index=False)
d = pd.read_csv(RAW / "03_reviews_clasificadas_ar.csv")
d = d[d.rating <= 2].copy(); d["app"] = "Despegar (App Store AR + Play es, 1-2★)"
x = pd.concat([d[["app", "pain", "pain2"]], m[["app", "pain", "pain2"]]])
x["familia"] = x.pain.map(FAM)
t = pd.crosstab(x.familia, x.app, normalize="columns").mul(100).round(1)
t.loc["n reseñas"] = x.app.value_counts()
print("## Familias de pain, % de reseñas 1-2★\n" + t.to_markdown())
t2 = pd.crosstab(x.pain, x.app, normalize="columns").mul(100).round(1)
print("\n## Pain principal, % de reseñas 1-2★\n" + t2.sort_values(t2.columns[0], ascending=False).to_markdown())
at = x.assign(at=(x.pain == "AT") | (x.pain2 == "AT")).groupby("app").at.mean().mul(100).round(1)
print("\n% con 'atención no responde' como principal o secundario:\n" + at.to_string())
