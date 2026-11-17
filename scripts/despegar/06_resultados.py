"""Une la clasificación (etiquetas del LLM, archivos et_*.txt) con la muestra, guarda
raw/03_reviews_clasificadas_ar.csv, mide la concordancia con la re-clasificación a ciegas y
imprime las tablas del informe en markdown.
Uso: <venv>/bin/python scripts/despegar/06_resultados.py <dir_lotes>
"""
import sys
from pathlib import Path
import pandas as pd

ROOT = Path(__file__).resolve().parents[2]
RAW = ROOT / "data/despegar/research/raw"
D = Path(sys.argv[1])
ETAPA = {"ADQ": "Adquisición", "BUS": "Activ.: búsqueda/precio", "REG": "Activ.: registro/login",
         "PAG": "Activ.: checkout/pago", "USO": "Uso de la app", "POS": "Post-compra",
         "REC": "Recompra/fidelidad", "SIN": "Otro/sin info"}
PAIN = {"PS": "Precio sube al pagar", "ND": "No disponible al comprar", "RC": "Reserva caída post-pago",
        "CA": "Caro / poco competitivo", "CO": "Cargos o condiciones no informados",
        "CU": "Cuotas/promo bancaria no aplica", "FI": "Puntos/cupones/promos propias no aplican",
        "PA": "Error de pago / medio de pago", "LO": "Login/cuenta", "LE": "App lenta/crash",
        "BU": "Bug funcional", "UX": "UX / feature faltante", "BO": "Bot/IA Sofía",
        "AE": "Cambio/cancelación de aerolínea", "RE": "Reembolso", "GE": "Gestión de cambios del cliente",
        "AT": "Atención no responde/no resuelve", "PR": "Proveedor en destino", "PU": "Publicidad/notificaciones",
        "ES": "Queja genérica sin detalle", "OT": "Otro", "NO": "Sin pain"}


def read_labels(files):
    rows = []
    for f in files:
        for line in open(f):
            if line.strip():
                k, e, p, p2, s = line.split()
                rows.append({"key": k, "etapa": e, "pain": p, "pain2": None if p2 == "-" else p2, "sentimiento": s})
    return pd.DataFrame(rows)


def cita(t, n=25):
    w = str(t).split()
    return " ".join(w[:n]) + (" …" if len(w) > n else "")


def kappa(a, b):
    cats = sorted(set(a) | set(b)); n = len(a)
    po = (a == b).mean()
    pe = sum((a == c).mean() * (b == c).mean() for c in cats)
    return (po - pe) / (1 - pe)


def md(df):
    return df.to_markdown()


m = pd.read_csv(D / "muestra.csv")
lab = read_labels(sorted(D.glob("et_0*.txt")))
assert lab.key.is_unique and len(lab) == len(m), (len(lab), len(m))
c = m.merge(lab, on="key")
c["cita"] = c.texto.map(cita)
c["anio"] = c.fecha.str[:4]
c["periodo"] = c.fecha.str[:4].map(lambda y: "2026" if y == "2026" else "2023-2025")
cols = ["corpus", "key", "id", "fecha", "rating", "version_app", "marca_ar", "etapa", "pain", "pain2", "sentimiento", "cita", "titulo", "texto"]
c[cols].to_csv(RAW / "03_reviews_clasificadas_ar.csv", index=False)
print("clasificadas:", len(c), c.corpus.value_counts().to_dict())

# --- concordancia
v = read_labels([D / "validacion_ciega_etiquetas.txt"]).add_suffix("_b").rename(columns={"key_b": "key"})
j = c.merge(v, on="key")
j[["key", "rating", "etapa", "etapa_b", "pain", "pain_b", "pain2", "pain2_b", "sentimiento", "sentimiento_b", "cita"]].to_csv(RAW / "03_validacion_ciega.csv", index=False)
print("\n## Concordancia (n=%d)" % len(j))
lax = j.apply(lambda r: r.pain in (r.pain_b, r.pain2_b) or r.pain_b in (r.pain, r.pain2), axis=1)
for ax in ["etapa", "pain", "sentimiento"]:
    print(f"- {ax}: {(j[ax] == j[ax + '_b']).mean():.1%} acuerdo exacto, kappa={kappa(j[ax], j[ax + '_b']):.2f}")
print(f"- pain (laxo: el principal de uno aparece como principal o secundario del otro): {lax.mean():.1%}")
neg = j[j.pain != "NO"]
print(f"- pain sólo en reseñas con pain según A (n={len(neg)}): {(neg.pain == neg.pain_b).mean():.1%}")
print("\nDesacuerdos de pain:")
for r in j[j.pain != j.pain_b].itertuples():
    print(f"  {r.key} {r.rating}★ A={r.etapa}/{r.pain}/{r.pain2} B={r.etapa_b}/{r.pain_b}/{r.pain2_b} :: {r.cita[:90]}")

# --- describir set clasificado
for corp, g in c.groupby("corpus"):
    print(f"\n# Corpus {corp}: n={len(g)}, con pain={int((g.pain != 'NO').sum())}, 1-2★={int((g.rating <= 2).sum())}, marca_ar={int(g.marca_ar.sum())}")
    print("\n## Etapa x sentimiento"); print(md(pd.crosstab(g.etapa.map(ETAPA), g.sentimiento, margins=True)))
    for nombre, sub in [("1-2★", g[g.rating <= 2]), ("todas", g)]:
        s = sub[sub.pain != "NO"]
        t = pd.crosstab(s.pain.map(PAIN), s.etapa.map(ETAPA), margins=True, margins_name="Total")
        t = t.sort_values("Total", ascending=False)
        print(f"\n## Pain x etapa, {corp}, {nombre} (n reseñas={len(sub)}, con pain={len(s)})")
        print(md(t))
        e = sub.etapa.map(ETAPA).value_counts()
        print("\nEtapa % sobre", nombre, ":", (e / len(sub) * 100).round(1).to_dict())

# --- top pains: principal y menciones (principal o secundario), negativos 1-2★ y todas
def top(g, label):
    s = g[g.pain != "NO"]
    prin = s.pain.value_counts()
    menc = pd.concat([s.pain, s.pain2.dropna()]).value_counts()
    out = pd.DataFrame({"principal_n": prin, "principal_%_con_pain": (prin / len(s) * 100).round(1),
                        "menciones_n": menc, "menciones_%_con_pain": (menc / len(s) * 100).round(1)}).fillna(0)
    out.index = out.index.map(PAIN)
    print(f"\n## Top pains {label} (reseñas con pain={len(s)})"); print(md(out.sort_values("principal_n", ascending=False).head(14)))

top(c[c.corpus == "appstore_ar"], "App Store AR")
top(c[c.corpus == "play_es"], "Play es (muestra estratificada, sin ponderar)")
top(c, "total 800")

# Play re-ponderado por la distribución real de estrellas de la población (18m, >=30c)
pop = {1: 641, 2: 129, 3: 158, 4: 190, 5: 939}
p = c[c.corpus == "play_es"].copy()
n_k = p.rating.value_counts()
p["w"] = p.rating.map(lambda k: pop[k] / n_k[k])
w = p[p.pain != "NO"].groupby("pain").w.sum() / p.w.sum() * 100
print("\n## Play es re-ponderado: % de reseñas (con texto >=30c) cuyo pain principal es X")
print((w.rename(index=PAIN).sort_values(ascending=False).round(1)).to_string())
print("sin pain (ponderado): %.1f%%" % (p[p.pain == "NO"].w.sum() / p.w.sum() * 100))

# --- cambio en el tiempo (App Store AR, corpus completo por país)
a = c[c.corpus == "appstore_ar"]
print("\n## App Store AR por período")
for per, g in a.groupby("periodo"):
    s = g[g.pain != "NO"]
    print(per, "n=", len(g), "avg★=%.2f" % g.rating.mean(), "1-2★=%.1f%%" % ((g.rating <= 2).mean() * 100), "con pain", len(s))
t = pd.crosstab(a[a.pain != "NO"].pain.map(PAIN), a[a.pain != "NO"].periodo)
t_pct = (t / t.sum() * 100).round(1)
print(md(pd.concat([t, t_pct.add_suffix(" %")], axis=1).sort_values("2026", ascending=False)))
te = pd.crosstab(a[a.pain != "NO"].etapa.map(ETAPA), a[a.pain != "NO"].periodo)
print(md(pd.concat([te, (te / te.sum() * 100).round(1).add_suffix(" %")], axis=1)))
pp = c[(c.corpus == "play_es") & (c.pain != "NO")]
pp_t = pd.crosstab(pp.pain.map(PAIN), pp.periodo)
print("\n## Play es (sin ponderar) por período: 2025-05..12 vs 2026"); print(md(pd.concat([pp_t, (pp_t / pp_t.sum() * 100).round(1).add_suffix(" %")], axis=1).sort_values("2026", ascending=False)))

# --- tabla larga etapa (funnel de 6) x pain, para el informe
F6 = {"ADQ": "1 Adquisición", "BUS": "2 Activación", "REG": "2 Activación", "PAG": "2 Activación",
      "USO": "3 Uso de la app", "POS": "4 Post-compra", "REC": "5 Recompra/fidelidad", "SIN": "6 Otro/sin info"}
for corp, g in c.groupby("corpus"):
    neg = g[g.rating <= 2]; s_all = g[g.pain != "NO"]
    rows = []
    for (f, sub, p_), n in s_all.groupby([s_all.etapa.map(F6), s_all.etapa, s_all.pain]).size().items():
        nn = int(((neg.etapa == sub) & (neg.pain == p_)).sum())
        rows.append({"etapa": f, "subetapa": ETAPA[sub], "pain": PAIN[p_], "n 1-2★": nn,
                     "% de 1-2★": round(nn / len(neg) * 100, 1), "n todas": n, "% de todas": round(n / len(g) * 100, 1)})
    t = pd.DataFrame(rows).sort_values(["etapa", "n todas"], ascending=[True, False])
    tot = g.etapa.map(F6).value_counts(); totn = neg.etapa.map(F6).value_counts()
    print(f"\n## Tabla larga {corp} (n todas={len(g)}, n 1-2★={len(neg)})")
    print(t.to_markdown(index=False))
    print("Totales por etapa (todas, incl. sin pain):", tot.to_dict(), "| 1-2★:", totn.to_dict())
