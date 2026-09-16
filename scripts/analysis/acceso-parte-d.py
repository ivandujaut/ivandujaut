"""Pipeline del caso acceso-parte-d, de los archivos crudos de CMS a `numeros.json`.

Regenerable = auditable. Este script produce TODO lo que después dibuja
`scripts/charts/acceso-parte-d.py` y todo número propio que cite la hoja de hechos. Sin
él los números del caso serían irreproducibles, que es lo que la auditoría del nodo 5
marcó como falla de severidad alta el 2026-09-13.

**El universo del cálculo, que es la decisión más importante y la que más fácil se
lee mal.** Las cuotas de receta y de visita se calculan sobre **dos productos**,
apixabán y rivaroxabán, no sobre todos los anticoagulantes orales. Son los dos que
compiten de frente en la misma indicación y con el mismo perfil de precio. La
warfarina queda afuera del denominador a propósito: es el medicamento viejo y
barato, cuesta dos órdenes de magnitud menos por paciente, y meterla adentro
mezclaría dos mercados distintos. El artículo tiene que decir ese denominador cada
vez que da una cuota.

**Las banderas del formulario se leen por presentación, nunca por molécula.** La
primera versión marcaba la traba si CUALQUIER identificador de la molécula la tenía, y
así contó 9,9 millones de vidas con terapia escalonada sobre Xarelto. Estaban sobre la
suspensión oral (Humana) y el comprimido de 2,5 mg; sobre los comprimidos de 10, 15 y
20 mg, los que compiten con Eliquis, había cero en 2023 y en 2026. Los quintiles de
condados por dureza de la traba se sacaron de este script porque ordenaban condados
por el peso de Humana. Toda comparación de acceso entre los dos productos se hace
entre las presentaciones de `COMPITE`.

Los archivos crudos van en `data/acceso-parte-d/cache/` (ignorado por git). URLs y
tamaños en `data/acceso-parte-d/facts.md`, sección Reproducibilidad:

    cache/form2026/   descomprimido del zip mensual de formularios, año 2026
    cache/form2023/   ídem, año de contrato 2023
    cache/enr2026.zip padrón por contrato, plan y condado, agosto 2026
    cache/enr2023.zip ídem, junio 2023
    cache/npi23.csv   Part D Prescribers by Provider, 2023 (código postal y RUCA)
    cache/npibn23.csv Part D Prescribers by Provider and Drug, 2023
    cache/npi24.csv   ídem 2024
    cache/npibn24.csv ídem 2024
    cache/ptd_spend.csv  Part D Spending by Drug
    cache/op23.csv    Open Payments 2023, ya filtrado a las dos marcas
    cache/product.txt FDA NDC Directory
    cache/zcta.txt    crosswalk ZCTA a condado del censo

Correr desde la raíz del repo:
    python3 scripts/analysis/acceso-parte-d.py
"""

import collections
import csv
import glob
import json
import math
import statistics
import sys
import zipfile
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
CACHE = RAIZ / "data" / "acceso-parte-d" / "cache"

# Las dos moléculas que forman el denominador de toda cuota del caso.
PAR = {"apixaban": "Eliquis", "rivaroxaban": "Xarelto"}
# La warfarina entra sólo en el gráfico del síntoma, nunca en un denominador de cuota.
CONTEXTO = ["warfarin"]
# Las presentaciones de marca que compiten entre sí. Toda comparación de acceso usa sólo éstas.
COMPITE = {"Xarelto": "comprimidos 10/15/20 mg", "Eliquis": "comprimidos 2,5/5 mg"}
# Filtros de condado, declarados en la hoja de hechos.
MIN_AFILIADOS, MIN_RECETAS, MIN_VISITAS = 2000, 500, 20
# Bandas de comidas por médico en el año.
BANDAS = [(1, 1, "1"), (2, 3, "2 a 3"), (4, 9, "4 a 9"), (10, 24, "10 a 24"), (25, 10 ** 9, "25 o más")]
# Prerregistro 2 de la hoja de hechos, fijado antes de correr el cambio por médico.
UMBRAL_MEDICO, TOLERANCIA_BALANCE, MIN_RETENIDOS, MAX_DIF_SALIDA = 1.0, 0.5, 80.0, 5.0
ESPECIALIDAD = {"Cardiology": "cardiología", "Internal Medicine": "medicina interna",
                "Family Practice": "medicina familiar"}
# Auditoría de domicilio (R20), umbral escrito antes de correrla.
UMBRAL_DOMICILIO = 10.0


def aviso(*a):
    print(*a, file=sys.stderr, flush=True)


# ------------------------------------------------------------------ puentes
def presentaciones():
    """Molécula, presentación y origen (marca o genérico) de cada NDC de 9 dígitos.

    Se agrupa por molécula y no por marca porque los genéricos tienen otro nombre
    comercial (por marca, Farxiga daba 5 identificadores y por molécula 83). Pero dentro
    de la molécula cada presentación se cuenta aparte: la suspensión oral o la potencia
    chica pueden tener banderas que la presentación que se receta no tiene."""
    out = {}
    with open(CACHE / "product.txt", encoding="utf-8", errors="replace") as fh:
        for row in csv.DictReader(fh, delimiter="\t"):
            gen = (row.get("NONPROPRIETARYNAME") or "").lower()
            mol = next((m for m in PAR if m in gen), None)
            p = (row.get("PRODUCTNDC") or "").split("-")
            if not mol or len(p) != 2:
                continue
            forma = ((row.get("DOSAGEFORMNAME") or "") + " " + gen).upper()
            fuerza = (row.get("ACTIVE_NUMERATOR_STRENGTH") or "").strip()
            marca = PAR[mol]
            if "SUSPENSION" in forma or "GRANULE" in forma or "CAPSULE" in forma:
                pres = "suspensión oral o cápsula"
            elif "KIT" in forma:
                pres = "kit de inicio"
            elif "TABLET" in forma and marca == "Xarelto":
                pres = {"10": COMPITE["Xarelto"], "15": COMPITE["Xarelto"], "20": COMPITE["Xarelto"],
                        "2.5": "comprimido 2,5 mg"}.get(fuerza, "otra")
            elif "TABLET" in forma:
                pres = COMPITE["Eliquis"] if fuerza in ("2.5", "5") else "otra"
            else:
                pres = "otra"
            nombre = (row.get("PROPRIETARYNAME") or "").upper()
            origen = "marca" if nombre.startswith(("XARELTO", "ELIQUIS")) else "genérico"
            out[p[0].zfill(5) + p[1].zfill(4)] = (marca, pres, origen)
    return out


def zip_a_condado():
    """ZCTA al condado con el que comparte más superficie de tierra."""
    mejor = {}
    with open(CACHE / "zcta.txt", encoding="utf-8-sig", errors="replace") as fh:
        for x in csv.DictReader(fh, delimiter="|"):
            z = (x.get("GEOID_ZCTA5_20") or "").strip()
            c = (x.get("GEOID_COUNTY_20") or "").strip()
            if not z or not c:
                continue
            try:
                a = float(x.get("AREALAND_PART") or 0)
            except ValueError:
                a = 0
            if z not in mejor or a > mejor[z][1]:
                mejor[z] = (c, a)
    return {z: v[0] for z, v in mejor.items()}


# ------------------------------------------------------------------ acceso
def leer_formulario(dir_form, pres):
    """Una pasada por el archivo básico del formulario. Para cada (molécula, presentación, origen):
    qué formularios la cubren, cuáles le exigen terapia escalonada, autorización previa o
    tope de cantidad, y el escalón de copago más barato en que la ponen."""
    g = collections.defaultdict(lambda: {"cubre": set(), "escalonada": set(), "autorizacion": set(),
                                         "tope": set(), "escalon": {}, "ndc": set()})
    basico = glob.glob(str(dir_form / "basic drugs formulary file*.txt"))[0]
    with open(basico, encoding="utf-8", errors="replace") as fh:
        cab = next(fh).rstrip("\r\n").split("|")
        iF, iN, iT = cab.index("FORMULARY_ID"), cab.index("NDC"), cab.index("TIER_LEVEL_VALUE")
        iQ, iA, iS = (cab.index("QUANTITY_LIMIT_YN"), cab.index("PRIOR_AUTHORIZATION_YN"),
                      cab.index("STEP_THERAPY_YN"))
        for line in fh:
            c = line.rstrip("\r\n").split("|")
            clave = pres.get(c[iN][:9])
            if not clave:
                continue
            d, fo = g[clave], c[iF]
            d["cubre"].add(fo)
            d["ndc"].add(c[iN][:9])
            if c[iS] == "Y":
                d["escalonada"].add(fo)
            if c[iA] == "Y":
                d["autorizacion"].add(fo)
            if c[iQ] == "Y":
                d["tope"].add(fo)
            try:
                t = int(c[iT])
            except ValueError:
                continue
            d["escalon"][fo] = min(t, d["escalon"].get(fo, t))
    return g


def leer_padron(dir_form, enr_zip):
    """Afiliados por (condado, formulario, organización) y el padrón total con Part D.

    La geografía sale del archivo de PADRÓN, no del de planes: el de planes cambia de
    esquema entre años (el de 2023 tiene una columna `ICL` extra que corre `STATE` un
    lugar) y además un plan puede abarcar varios estados."""
    planf = {}
    pinfo = glob.glob(str(dir_form / "plan information*.txt"))[0]
    with open(pinfo, encoding="utf-8", errors="replace") as fh:
        cab = next(fh).rstrip("\n").split("|")
        iF = cab.index("FORMULARY_ID")
        for line in fh:
            c = line.rstrip("\n").split("|")
            planf[(c[0], c[1])] = c[iF]

    celdas = collections.Counter()
    padron_total = 0
    with zipfile.ZipFile(enr_zip) as z:
        ci = [n for n in z.namelist() if "Contract_Info" in n][0]
        contratos = list(csv.DictReader(z.open(ci).read().decode("latin-1").splitlines()))
        # Sin este filtro el total da 106% del padrón publicado: el archivo cubre todos
        # los contratos de Medicare Advantage, ofrezcan o no medicamentos.
        ofrece = {(r["Contract ID"].strip(), r["Plan ID"].strip()) for r in contratos
                  if (r.get("Offers Part D") or "").strip() == "Yes"}
        org = {(r["Contract ID"].strip(), r["Plan ID"].strip()): (r.get("Parent Organization") or "").strip()
               for r in contratos}
        ei = [n for n in z.namelist() if "Enrollment_Info" in n][0]
        rd = csv.reader(z.open(ei).read().decode("latin-1").splitlines())
        next(rd)
        for f in rd:
            v = f[6].strip()
            if v == "*":  # celdas de menos de 11 personas, suprimidas por CMS
                continue
            try:
                n = int(v)
            except ValueError:
                continue
            k = (f[0].strip(), f[1].strip())
            if k not in ofrece:
                continue
            # `padron_total` es el universo que se triangula contra la cifra publicada por
            # CMS; las celdas son el subconjunto con formulario y condado identificados.
            padron_total += n
            fo, fips = planf.get(k), f[3].strip()
            if fo and fips:
                celdas[(fips, fo, org.get(k, ""))] += n
    return padron_total, celdas


def acceso_por_condado(celdas, form):
    """Afiliados por condado con cada producto cubierto y con terapia escalonada, contando
    SÓLO la presentación de marca que compite."""
    por = collections.defaultdict(lambda: collections.defaultdict(int))
    for (fips, fo, _), n in celdas.items():
        por[fips]["total"] += n
        for marca, p in COMPITE.items():
            d = form.get((marca, p, "marca"))
            if not d:
                continue
            if fo in d["cubre"]:
                por[fips][marca + "_cub"] += n
            if fo in d["escalonada"]:
                por[fips][marca + "_esc"] += n
    return {k: dict(v) for k, v in por.items()}


def acceso_por_presentacion(padron_total, celdas, form):
    vidas, por_org = collections.Counter(), collections.Counter()
    for (_, fo, org), n in celdas.items():
        vidas[fo] += n
        por_org[(org, fo)] += n

    def suma(formularios):
        return sum(vidas[f] for f in formularios)

    out = {"padron_total": padron_total, "con_formulario_y_condado": sum(vidas.values()),
           "presentaciones": {}}
    for (marca, p, origen), d in sorted(form.items()):
        traba_org = collections.Counter()
        for (org, fo), n in por_org.items():
            if fo in d["escalonada"]:
                traba_org[org] += n
        out["presentaciones"][f"{marca} · {p} · {origen}"] = {
            "ndc_distintos_en_formulario": len(d["ndc"]),
            "formularios_que_cubren": len(d["cubre"]),
            "formularios_con_escalonada": len(d["escalonada"]),
            "vidas_cubiertas": suma(d["cubre"]),
            "vidas_con_escalonada": suma(d["escalonada"]),
            "vidas_con_autorizacion_previa": suma(d["autorizacion"]),
            "vidas_con_tope_de_cantidad": suma(d["tope"]),
            "escalonada_por_organizacion": dict(traba_org.most_common(10)),
        }
    # El número viejo, declarado como lo que es: vidas con traba en ALGUNA presentación.
    todas = set().union(*(d["escalonada"] for (m, _, _), d in form.items() if m == "Xarelto"))
    out["vidas_con_escalonada_en_alguna_presentacion_de_xarelto"] = suma(todas)

    ex = form[("Xarelto", COMPITE["Xarelto"], "marca")]["escalon"]
    ee = form[("Eliquis", COMPITE["Eliquis"], "marca")]["escalon"]
    par = {"xarelto_peor": [0, 0], "igual": [0, 0], "xarelto_mejor": [0, 0]}
    for fo in set(ex) & set(ee):
        k = "xarelto_peor" if ex[fo] > ee[fo] else ("igual" if ex[fo] == ee[fo] else "xarelto_mejor")
        par[k][0] += 1
        par[k][1] += vidas[fo]
    vt = sum(v for _, v in par.values())
    out["escalon_de_copago_entre_los_que_compiten"] = {
        k: {"formularios": f, "vidas": v, "pct_vidas": 100 * v / vt if vt else None} for k, (f, v) in par.items()}
    return out


# ------------------------------------------------------------------ receta
def ubicacion_por_npi(anio):
    """Código postal de la práctica y RUCA (rural o urbano) de cada prescriptor de Part D."""
    ubic = {}
    with open(CACHE / f"npi{anio}.csv", encoding="utf-8-sig", errors="replace") as fh:
        rd = csv.reader(fh)
        ix = {c: i for i, c in enumerate(next(rd))}
        iN, iZ, iR = ix["Prscrbr_NPI"], ix["Prscrbr_Zip5"], ix["Prscrbr_RUCA"]
        for f in rd:
            if len(f) > max(iN, iZ, iR):
                ubic[f[iN]] = (f[iZ].strip(), f[iR].strip())
    return ubic


def receta_por_medico(anio, ubic):
    """Recetas de Part D por médico (NPI) y molécula, en una pasada por el archivo de
    prescriptor y droga. CMS suprime las filas de menos de 11 recetas: un médico sin fila
    de una molécula puede recetarla igual, de 1 a 10 veces. Si un año trae genérico de
    rivaroxabán, se suma a Xarelto porque la clave es la molécula."""
    med = {}
    with open(CACHE / f"npibn{anio}.csv", encoding="utf-8-sig", errors="replace") as fh:
        ix = {c: i for i, c in enumerate(next(csv.reader([next(fh)])))}
        iN, iT, iS = ix["Prscrbr_NPI"], ix["Prscrbr_Type"], ix["Prscrbr_State_Abrvtn"]
        iG, iC = ix["Gnrc_Name"], ix["Tot_Clms"]
        for line in fh:
            # prefiltro antes de parsear: las dos moléculas terminan en "xaban"
            if "xaban" not in line and "XABAN" not in line and "arfarin" not in line and "ARFARIN" not in line:
                continue
            f = next(csv.reader([line]))
            if len(f) <= max(iG, iC):
                continue
            g = f[iG].lower()
            k = PAR.get(g) or ("Warfarina" if "warfarin" in g else None)
            if not k:
                continue
            try:
                n = float(f[iC] or 0)
            except ValueError:
                continue
            d = med.get(f[iN])
            if d is None:
                z, ruca = ubic.get(f[iN], ("", ""))
                d = med[f[iN]] = {"Eliquis": 0.0, "Xarelto": 0.0, "Warfarina": 0.0, "tipo": f[iT],
                                  "estado": f[iS], "zip": z.zfill(5) if z else "", "ruca": ruca}
            d[k] += n
    return med


def receta_por_condado(z2c, med):
    por = collections.defaultdict(lambda: collections.defaultdict(float))
    for d in med.values():
        c = z2c.get(d["zip"], "")
        if not c:
            continue
        for m in PAR.values():
            if d[m]:
                por[c][m] += d[m]
    return {k: dict(v) for k, v in por.items()}


# ------------------------------------------------------------------ visitas
def visitas(z2c, ubic):
    """Una pasada por Open Payments 2023, ya filtrado a las dos marcas.

    Sólo las comidas cuentan como visita: son el 97,5% de los registros de Xarelto y el
    99,8% de los de Eliquis. Cada registro es un pago declarado a una persona; una comida
    grupal genera un registro por asistente. Los dólares se suman aparte y cubren todos
    los pagadores, no sólo Medicare.

    **Cada comida se ubica en el condado donde el médico receta en Part D**, y sólo si el
    médico no está en ese archivo, en el del código postal del pago. La primera versión
    usaba siempre el código postal del pago, y el 19,4% de las comidas de Xarelto quedaba
    sin condado contra el 0,5% de las de Eliquis: Janssen declara en esas filas el código
    postal de casilla de correo de la ciudad (94203 para una dirección de Sacramento, por
    ejemplo), que no existe en el cruce del censo. Eso bajaba la voz de Xarelto por
    condado, y sólo la de esa marca."""
    por_cond = collections.defaultdict(lambda: collections.defaultdict(float))
    nat = collections.defaultdict(collections.Counter)
    dolares = collections.defaultdict(lambda: collections.defaultdict(float))
    fuente = collections.defaultdict(lambda: collections.defaultdict(collections.Counter))
    por_medico = {}
    sin_npi = collections.Counter()
    with open(CACHE / "op23.csv", encoding="utf-8", errors="replace") as fh:
        cab = next(csv.reader(fh))
        idx = {c: i for i, c in enumerate(cab)}
        prods = [idx[f"Name_of_Drug_or_Biological_or_Device_or_Medical_Supply_{i}"] for i in range(1, 6)]
        iNat, iZip, iNPI = (idx["Nature_of_Payment_or_Transfer_of_Value"], idx["Recipient_Zip_Code"],
                            idx["Covered_Recipient_NPI"])
        iUSD = idx["Total_Amount_of_Payment_USDollars"]
        for f in csv.reader(fh):
            if len(f) < len(cab):
                continue
            nombres = {(f[p] or "").upper().strip() for p in prods}
            naturaleza = f[iNat]
            for m in ("ELIQUIS", "XARELTO"):
                if m not in nombres:
                    continue
                marca = m.capitalize()
                nat[marca][naturaleza] += 1
                try:
                    dolares[marca][naturaleza] += float(f[iUSD] or 0)
                except ValueError:
                    pass
                if not naturaleza.startswith("Food"):
                    continue
                npi = (f[iNPI] or "").strip()
                z_npi = ubic.get(npi, ("", ""))[0] if npi else ""
                c_npi = z2c.get(z_npi.zfill(5), "") if z_npi else ""
                c = c_npi or z2c.get((f[iZip] or "")[:5].zfill(5), "")
                origen = "práctica en Part D" if c_npi else ("código postal del pago" if c else "sin condado")
                fuente[c][marca][origen] += 1
                if c:
                    por_cond[c][marca] += 1
                if not npi:
                    sin_npi[marca] += 1
                    continue
                d = por_medico.setdefault(npi, {"Eliquis": 0, "Xarelto": 0})
                d[marca] += 1
    geo = {m: dict(sum((fuente[c][m] for c in fuente), collections.Counter())) for m in ("Eliquis", "Xarelto")}
    fuente = {c: {m: dict(v) for m, v in d.items()} for c, d in fuente.items()}
    return ({k: dict(v) for k, v in por_cond.items()}, {k: dict(v) for k, v in nat.items()},
            {k: dict(v) for k, v in dolares.items()}, por_medico, dict(sin_npi), geo, fuente)


# ------------------------------------------------------------------ estadística
def corr(xs, ys, ws=None):
    ws = ws or [1] * len(xs)
    sw = sum(ws)
    mx = sum(w * x for w, x in zip(ws, xs)) / sw
    my = sum(w * y for w, y in zip(ws, ys)) / sw
    cov = sum(w * (x - mx) * (y - my) for w, x, y in zip(ws, xs, ys)) / sw
    vx = sum(w * (x - mx) ** 2 for w, x in zip(ws, xs)) / sw
    vy = sum(w * (y - my) ** 2 for w, y in zip(ws, ys)) / sw
    return cov / (vx * vy) ** 0.5 if vx * vy else 0.0


# ------------------------------------------------------------------ mercado
def mercado():
    r = [x for x in csv.DictReader(open(CACHE / "ptd_spend.csv", encoding="utf-8-sig"))
         if x.get("Mftr_Name") == "Overall"]
    anios = [str(a) for a in range(2020, 2025)]

    def serie(pref, campo):
        f = [x for x in r if (x.get("Gnrc_Name") or "").lower().startswith(pref)]
        return {a: sum(float(x.get(f"{campo}_{a}") or 0) for x in f) for a in anios}

    out = {"por_producto": {}}
    for mol, marca in list(PAR.items()) + [("warfarin", "Warfarina")]:
        out["por_producto"][marca] = {"gasto": serie(mol, "Tot_Spndng"),
                                      "benef": serie(mol, "Tot_Benes")}
    # El TAM declarado abarca TODOS los anticoagulantes orales, que es un universo más
    # ancho que el denominador de las cuotas. El artículo tiene que distinguirlo.
    todos = list(PAR) + CONTEXTO + ["dabigatran", "edoxaban"]
    out["tam_usd"] = {a: sum(serie(p, "Tot_Spndng")[a] for p in todos) for a in anios}
    out["tam_benef"] = {a: sum(serie(p, "Tot_Benes")[a] for p in todos) for a in anios}
    return out


# ------------------------------------------------------------------ cruce por médico
def cruce_por_medico(med, vm, sin_npi):
    """Receta de Part D 2023 contra comidas declaradas en 2023, médico por médico.

    El universo son los médicos con al menos una fila de apixabán o rivaroxabán, o sea 11
    recetas o más de alguno de los dos. "Sin fila en la clase" no es "no receta": puede
    recetar menos de 11 veces, o fuera de Medicare. Nada de acá dice que la comida cause
    la receta."""
    clase = {n: d for n, d in med.items() if d["Eliquis"] + d["Xarelto"] > 0}

    def rec(n):
        return clase[n]["Eliquis"] + clase[n]["Xarelto"]

    tot = sum(rec(n) for n in clase)
    com = {m: sum(v[m] for v in vm.values()) for m in ("Eliquis", "Xarelto")}

    def cx(n):
        return vm[n]["Xarelto"] if n in vm else 0

    def ce(n):
        return vm[n]["Eliquis"] if n in vm else 0

    def cuota(g):
        r = sum(rec(n) for n in g)
        return 100 * sum(clase[n]["Xarelto"] for n in g) / r if r else None

    def pct_rec(g):
        return 100 * sum(rec(n) for n in g) / tot

    orden = sorted(clase, key=lambda n: (-rec(n), n))
    N = len(orden)
    out = {"universo": {
        "medicos": N, "recetas": tot, "cuota_xarelto_pct": cuota(orden),
        "con_fila_de_los_dos": sum(1 for n in orden if clase[n]["Eliquis"] and clase[n]["Xarelto"]),
        "solo_eliquis": sum(1 for n in orden if not clase[n]["Xarelto"]),
        "solo_xarelto": sum(1 for n in orden if not clase[n]["Eliquis"]),
        "mediana_recetas_por_medico": statistics.median(rec(n) for n in orden)}}

    out["comidas"] = {}
    for m, f in (("Xarelto", cx), ("Eliquis", ce)):
        visit = [n for n, v in vm.items() if v[m]]
        fuera = [n for n in visit if n not in clase]
        out["comidas"][m] = {
            "con_npi": com[m], "sin_npi": sin_npi.get(m, 0), "medicos_visitados": len(visit),
            "a_medicos_sin_fila_en_la_clase": {"medicos": len(fuera), "comidas": sum(vm[n][m] for n in fuera),
                                               "pct_comidas": 100 * sum(vm[n][m] for n in fuera) / com[m]},
            "mediana_por_medico_visitado": statistics.median(vm[n][m] for n in visit),
            "media_por_medico_visitado": com[m] / len(visit),
            "maximo_a_un_medico": max(vm[n][m] for n in visit),
            "bandas": []}
        for lo, hi, nombre in BANDAS:
            g = [n for n in visit if lo <= vm[n][m] <= hi]
            gc = [n for n in g if n in clase]
            out["comidas"][m]["bandas"].append({
                "banda": nombre, "medicos": len(g), "pct_medicos_visitados": 100 * len(g) / len(visit),
                "pct_comidas": 100 * sum(vm[n][m] for n in g) / com[m], "con_fila_en_la_clase": len(gc),
                "pct_recetas": pct_rec(gc), "cuota_xarelto_pct": cuota(gc)})
    sin_x = [n for n in orden if not cx(n)]
    out["comidas"]["Xarelto"]["sin_comida"] = {"medicos": len(sin_x), "pct_recetas": pct_rec(sin_x),
                                               "cuota_xarelto_pct": cuota(sin_x)}

    out["concentracion_pct_recetas"] = {f"{p}%": pct_rec(orden[:int(N * p / 100)]) for p in (1, 5, 10, 20, 50)}

    k = N // 10
    out["deciles"] = []
    for i in range(10):
        g = orden[i * k:(i + 1) * k] if i < 9 else orden[9 * k:]
        out["deciles"].append({
            "decil": i + 1, "medicos": len(g), "pct_recetas": pct_rec(g), "cuota_xarelto_pct": cuota(g),
            "pct_comidas_xarelto": 100 * sum(cx(n) for n in g) / com["Xarelto"],
            "pct_comidas_eliquis": 100 * sum(ce(n) for n in g) / com["Eliquis"],
            "pct_medicos_con_comida_xarelto": 100 * sum(1 for n in g if cx(n)) / len(g),
            "pct_medicos_con_comida_eliquis": 100 * sum(1 for n in g if ce(n)) / len(g)})

    def cabeza(p):
        g = orden[:int(N * p / 100)]
        con_x = [n for n in g if cx(n)]
        sin = [n for n in g if not cx(n)]
        e_sin_x = [n for n in sin if ce(n)]
        return {"medicos": len(g), "pct_recetas": pct_rec(g), "cuota_xarelto_pct": cuota(g),
                "con_comida_xarelto": {"medicos": len(con_x), "pct_medicos": 100 * len(con_x) / len(g),
                                       "cuota_xarelto_pct": cuota(con_x)},
                "con_comida_eliquis": {"medicos": sum(1 for n in g if ce(n)),
                                       "pct_medicos": 100 * sum(1 for n in g if ce(n)) / len(g)},
                "sin_comida_xarelto": {"medicos": len(sin), "pct_medicos": 100 * len(sin) / len(g),
                                       "pct_recetas_del_total": pct_rec(sin), "cuota_xarelto_pct": cuota(sin)},
                "con_comida_eliquis_y_sin_xarelto": {"medicos": len(e_sin_x), "pct_recetas_del_total": pct_rec(e_sin_x),
                                                     "cuota_xarelto_pct": cuota(e_sin_x)},
                "sin_comida_de_ninguna": sum(1 for n in sin if not ce(n))}

    out["decil_superior"], out["quintil_superior"] = cabeza(10), cabeza(20)

    estados = {"sin comida de ninguna": lambda n: not cx(n) and not ce(n),
               "sólo Eliquis": lambda n: ce(n) and not cx(n),
               "sólo Xarelto": lambda n: cx(n) and not ce(n),
               "las dos": lambda n: cx(n) and ce(n)}
    out["por_estado_de_visita"] = {}
    for nombre, f in estados.items():
        g = [n for n in orden if f(n)]
        out["por_estado_de_visita"][nombre] = {"medicos": len(g), "pct_recetas": pct_rec(g), "cuota_xarelto_pct": cuota(g)}

    esp = collections.defaultdict(list)
    for n in orden:
        esp[clase[n]["tipo"] or "sin dato"].append(n)
    out["especialidad"] = []
    for nombre, g in sorted(esp.items(), key=lambda kv: -sum(rec(n) for n in kv[1]))[:12]:
        r = sum(rec(n) for n in g)
        out["especialidad"].append({
            "especialidad": nombre, "medicos": len(g), "pct_recetas": pct_rec(g), "cuota_xarelto_pct": cuota(g),
            "pct_comidas_xarelto": 100 * sum(cx(n) for n in g) / com["Xarelto"],
            "pct_comidas_eliquis": 100 * sum(ce(n) for n in g) / com["Eliquis"],
            "pct_medicos_con_comida_xarelto": 100 * sum(1 for n in g if cx(n)) / len(g),
            "comidas_xarelto_por_mil_recetas": 1000 * sum(cx(n) for n in g) / r,
            "comidas_eliquis_por_mil_recetas": 1000 * sum(ce(n) for n in g) / r})
    return out


def _panel_medicos(med23, vm):
    """Panel, cuota inicial, estrato y grupo de cada médico, como los fija el prerregistro 2."""
    panel = {n: d for n, d in med23.items() if d["Eliquis"] > 0 and d["Xarelto"] > 0}
    c23 = {n: 100 * d["Xarelto"] / (d["Eliquis"] + d["Xarelto"]) for n, d in panel.items()}

    def comidas(n, m):
        return vm[n][m] if n in vm else 0

    def grupo(n):
        k = comidas(n, "Xarelto")
        return "0" if k == 0 else ("1 a 3" if k <= 3 else ("4 a 9" if k <= 9 else "10 o más"))

    N = len(panel)
    por_vol = sorted(panel, key=lambda n: (-(panel[n]["Eliquis"] + panel[n]["Xarelto"]), n))
    vol = {n: i * 5 // N for i, n in enumerate(por_vol)}
    dec = {n: i * 10 // N for i, n in enumerate(sorted(panel, key=lambda n: (c23[n], n)))}
    estrato = {n: (vol[n], ESPECIALIDAD.get(panel[n]["tipo"], "resto"), dec[n], comidas(n, "Eliquis") > 0)
               for n in panel}
    grupos = collections.defaultdict(list)
    for n in sorted(panel):
        grupos[grupo(n)].append(n)
    return panel, c23, estrato, grupos


def _comparar(grupos, estrato, c23, cambio, salida, tratado, control, si, no):
    """Diferencia de cambio de cuota entre tratados y control dentro de cada estrato, ponderada
    por tratados, con las tres reglas de validez del prerregistro 2."""
    por = collections.defaultdict(lambda: ([], []))
    for lado, g in ((0, tratado), (1, control)):
        for n in grupos[g]:
            if n in cambio:
                por[estrato[n]][lado].append(n)
    vivos_t = sum(1 for n in grupos[tratado] if n in cambio)
    glob_t = statistics.variance([cambio[n] for n in grupos[tratado] if n in cambio])
    glob_c = statistics.variance([cambio[n] for n in grupos[control] if n in cambio])
    W = dif = var = base_t = base_c = 0.0
    for t, c in por.values():
        if not t or not c:
            continue
        w = len(t)
        ct, cc = [cambio[n] for n in t], [cambio[n] for n in c]
        dif += w * (statistics.mean(ct) - statistics.mean(cc))
        vt = statistics.variance(ct) if len(ct) > 1 else glob_t
        vc = statistics.variance(cc) if len(cc) > 1 else glob_c
        var += w * w * (vt / len(ct) + vc / len(cc))
        base_t += w * statistics.mean(c23[n] for n in t)
        base_c += w * statistics.mean(c23[n] for n in c)
        W += w
    d, se = dif / W, var ** 0.5 / W
    balance = base_t / W - base_c / W
    retenidos = 100 * W / vivos_t
    dif_salida = salida[tratado] - salida[control]
    validez = {"balance_cuota_inicial_puntos": balance, "pct_tratados_retenidos": retenidos,
               "diferencia_salida_del_panel_puntos": dif_salida}
    if abs(balance) > TOLERANCIA_BALANCE or retenidos < MIN_RETENIDOS or abs(dif_salida) > MAX_DIF_SALIDA:
        v = "no interpretable"
    elif d >= UMBRAL_MEDICO and d - 1.96 * se > 0:
        v = si
    elif d <= 0:
        v = no
    else:
        v = "no concluye"
    return {"tratado": tratado, "control": control, "diferencia_puntos": d,
            "ic95": [d - 1.96 * se, d + 1.96 * se], "tratados_comparados": int(W), "validez": validez,
            "veredicto": v}


COMPARACIONES_MEDICO = (("comparacion_1_principal", "4 a 9", "0", "responde", "no responde"),
                        ("comparacion_2_la_cola", "10 o más", "4 a 9", "la frecuencia alta defiende", "no defiende"),
                        ("comparacion_3_secundaria", "1 a 3", "0", "responde", "no responde"))


def respuesta_por_medico(med23, med24, vm):
    """Prerregistro 2 de la hoja de hechos. Umbrales y reglas en las constantes de arriba,
    fijados antes de correr este bloque por primera vez."""
    panel, c23, estrato, grupos = _panel_medicos(med23, vm)
    cambio = {}
    for n in panel:
        e = med24.get(n)
        if e and e["Eliquis"] > 0 and e["Xarelto"] > 0:
            cambio[n] = 100 * e["Xarelto"] / (e["Eliquis"] + e["Xarelto"]) - c23[n]
    salida = {g: 100 * (1 - sum(1 for n in ns if n in cambio) / len(ns)) for g, ns in grupos.items()}

    def motivo(n):
        e = med24.get(n)
        if not e or (e["Eliquis"] == 0 and e["Xarelto"] == 0):
            return "no aparece con ninguna de las dos en 2024"
        if e["Eliquis"] > 0 and e["Xarelto"] > 0:
            return "sigue con las dos filas"
        return "perdió la fila de Xarelto" if e["Xarelto"] == 0 else "perdió la fila de Eliquis"

    out = {
        "umbral_puntos": UMBRAL_MEDICO,
        "panel_medicos": len(panel), "medicos_con_las_dos_filas_en_2024": len(cambio),
        "grupos": {g: {"medicos": len(ns), "siguen_en_2024": sum(1 for n in ns if n in cambio),
                       "pct_salida": salida[g],
                       "por_motivo": dict(collections.Counter(motivo(n) for n in ns)),
                       "cuota_inicial_media": statistics.mean(c23[n] for n in ns),
                       "cambio_medio_crudo": statistics.mean(cambio[n] for n in ns if n in cambio)}
                   for g, ns in sorted(grupos.items())},
    }
    for clave, tratado, control, si, no in COMPARACIONES_MEDICO:
        out[clave] = _comparar(grupos, estrato, c23, cambio, salida, tratado, control, si, no)
    return out


def sensibilidad_salida(med23, med24, vm):
    """Sensibilidad POSTERIOR al prerregistro 2, declarada en la hoja de hechos antes de correrla.

    CMS publica una fila sólo con 11 recetas o más, así que quien perdió una fila en 2024 recetó
    entre 0 y 10 de ese producto, y su cuota queda acotada. Se completa a esos médicos en tres
    escenarios; quienes no aparecen con ninguna de las dos no se acotan y quedan afuera. No
    reemplaza el veredicto del prerregistro 2."""
    panel, c23, estrato, grupos = _panel_medicos(med23, vm)

    def cuota24(n, lado):
        e = med24.get(n)
        if not e or (e["Eliquis"] == 0 and e["Xarelto"] == 0):
            return None
        E, X = e["Eliquis"], e["Xarelto"]
        if E > 0 and X > 0:
            return 100 * X / (E + X)
        if X == 0:  # la cuota más baja sale de 0 recetas de Xarelto, la más alta de 10
            x = {"bajo": 0.0, "alto": 10.0, "medio": 5.0}[lado]
            return 100 * x / (E + x)
        eq = {"bajo": 10.0, "alto": 0.0, "medio": 5.0}[lado]  # sin fila de Eliquis: al revés
        return 100 * X / (X + eq)

    salida = {g: 100 * sum(1 for n in ns if cuota24(n, "medio") is None) / len(ns) for g, ns in grupos.items()}
    escenarios = {"peor caso para la visita": ("bajo", "alto"), "punto medio": ("medio", "medio"),
                  "mejor caso para la visita": ("alto", "bajo")}
    out = {"posterior_al_prerregistro": True, "pct_sin_acotar_por_grupo": salida, "comparaciones": {}}
    for clave, tratado, control, si, no in COMPARACIONES_MEDICO:
        res = {}
        for nombre, (lado_t, lado_c) in escenarios.items():
            cambio = {}
            for g, lado in ((tratado, lado_t), (control, lado_c)):
                for n in grupos[g]:
                    s = cuota24(n, lado)
                    if s is not None:
                        cambio[n] = s - c23[n]
            res[nombre] = _comparar(grupos, estrato, c23, cambio, salida, tratado, control, si, no)
        peor, mejor = res["peor caso para la visita"], res["mejor caso para la visita"]
        if "no interpretable" in (peor["veredicto"], mejor["veredicto"]):
            lectura = "no interpretable"
        elif peor["veredicto"] == si:
            lectura = "aguanta el peor caso"
        elif mejor["veredicto"] == no:
            lectura = "no responde ni en el mejor caso"
        else:
            lectura = "depende de cómo se complete a los que salen"
        out["comparaciones"][clave] = {"escenarios": res, "lectura": lectura}
    return out


def testigo_eliquis(voz, oport):
    """R27. Si Eliquis también visita poco los condados de oportunidad, el patrón es del
    condado y no de Xarelto. Umbrales declarados en la hoja como NO prerregistrados."""
    marcas = {}
    for x in voz:
        marcas[x["cond"]] = {"Xarelto": (x["vis_xar"], x["rx_xar"]),
                             "Eliquis": (x["visitas"] - x["vis_xar"], x["recetas"] - x["rx_xar"])}

    def tasa(c, m):
        v, r = marcas[c][m]
        return 1000 * v / r if r else 0.0

    out, medianas = {"por_marca": {}}, {}
    for m in ("Xarelto", "Eliquis"):
        tasas = [tasa(c, m) for c in marcas]
        pares = [(math.log(r), math.log(v)) for v, r in (marcas[c][m] for c in marcas) if v > 0 and r > 0]
        mx = statistics.mean(a for a, _ in pares)
        my = statistics.mean(b for _, b in pares)
        pend = sum((a - mx) * (b - my) for a, b in pares) / sum((a - mx) ** 2 for a, _ in pares)
        q = statistics.quantiles(tasas, n=4)
        medianas[m] = statistics.median(tasas)
        out["por_marca"][m] = {"comidas_por_mil_recetas_propias": {"p25": q[0], "mediana": medianas[m], "p75": q[2]},
                               "pendiente_log_comidas_sobre_log_recetas": pend,
                               "condados_en_la_pendiente": len(pares),
                               "condados_sin_comidas_propias": len(marcas) - len(pares)}
    op = [x["cond"] for x in oport]
    bajo = {m: {c for c in op if tasa(c, m) < medianas[m]} for m in medianas}
    med_tot = statistics.median(x["visitas"] for x in voz)
    bajo_tot = [x for x in oport if x["visitas"] < med_tot]
    dif = (out["por_marca"]["Eliquis"]["pendiente_log_comidas_sobre_log_recetas"]
           - out["por_marca"]["Xarelto"]["pendiente_log_comidas_sobre_log_recetas"])
    out["oportunidad"] = {
        "condados": len(op), "bajo_mediana_xarelto": len(bajo["Xarelto"]), "bajo_mediana_eliquis": len(bajo["Eliquis"]),
        "bajo_mediana_de_las_dos": len(bajo["Xarelto"] & bajo["Eliquis"]),
        "mediana_comidas_totales_por_condado": med_tot, "bajo_mediana_comidas_totales": len(bajo_tot)}
    out["lectura"] = {
        "umbrales_prerregistrados": False,
        "a_se_reescribe_como_experimento_chico": (len(bajo["Xarelto"] & bajo["Eliquis"]) > len(op) / 2
                                                  or len(bajo_tot) > 2 * len(op) / 3),
        "diferencia_de_pendientes_eliquis_menos_xarelto": dif,
        "no_citar_al_lider_como_modelo": dif > 0.30}
    return out


def auditoria_domicilio(fuente, auditados, base):
    """R20. En los condados de oportunidad con menos de la mitad de la densidad mediana de
    visitas, por marca, qué parte de las comidas quedó ubicada por el código postal del pago
    y no por la práctica del médico. Sólo una diferencia entre marcas puede fabricar una voz
    baja, porque la voz es una proporción. La primera corrida, con la geografía vieja, fue la
    que encontró los códigos postales de casilla de Janssen (hoja de hechos)."""
    out = {"umbral_puntos": UMBRAL_DOMICILIO, "fips_auditados": sorted(auditados)}
    for nombre, conjunto in (("condados_auditados", set(auditados)), ("condados_base", set(base))):
        r = {}
        for m in ("Xarelto", "Eliquis"):
            cont = collections.Counter()
            for c in conjunto:
                cont.update(fuente.get(c, {}).get(m, {}))
            tot = sum(cont.values())
            r[m] = {"comidas": tot, "por_origen": dict(cont),
                    "pct_por_codigo_postal_del_pago": 100 * cont["código postal del pago"] / tot if tot else None}
        if r["Xarelto"]["comidas"] and r["Eliquis"]["comidas"]:
            r["diferencia_puntos_xarelto_menos_eliquis"] = (r["Xarelto"]["pct_por_codigo_postal_del_pago"]
                                                             - r["Eliquis"]["pct_por_codigo_postal_del_pago"])
        out[nombre] = r
    dif = out["condados_auditados"].get("diferencia_puntos_xarelto_menos_eliquis")
    out["veredicto"] = None if dif is None else (
        "salen de la recomendación (a)" if abs(dif) > UMBRAL_DOMICILIO else "se quedan en la recomendación (a)")
    return out


# ------------------------------------------------------------------ main
def pagos_por_anio():
    """Comidas y charlas de Xarelto y Eliquis en Open Payments, 2022 a 2025, por año y por mes.

    Sirve para contrastar con un dato independiente lo que alega Bayer en su demanda contra Janssen
    (S.D.N.Y., 2025): que J&J recortó la visita presencial de Xarelto a fines de 2022 y la eliminó en
    noviembre de 2024. Una comida declarada no equivale a una visita de un representante (también hay
    charlas y eventos), pero si la fuerza presencial desaparece, las comidas tienen que caer. Mismo
    criterio de filas que `visitas()`: la comida compartida con otro producto cuenta entera para cada
    marca. Los archivos de 2024 y 2025 se bajan completos y se filtran por línea a las dos marcas."""
    marcas = ("Eliquis", "Xarelto")
    out = {}
    for anio in ("2022", "2023", "2024", "2025"):
        ruta = CACHE / f"op{anio[2:]}.csv"
        if not ruta.exists():
            out[anio] = None
            continue
        res = {m: {"comidas": 0, "comidas_compartidas": 0, "usd_comidas": 0.0, "usd_total": 0.0,
                   "medicos_con_comida": set(), "charlas_pagos": 0, "charlas_usd": 0.0, "disertantes": set(),
                   "comidas_por_mes": collections.Counter(), "charlas_por_mes": collections.Counter(),
                   "pagadores": collections.Counter()} for m in marcas}
        with open(ruta, encoding="utf-8", errors="replace") as fh:
            lector = csv.reader(fh)
            cab = next(lector)
            idx = {c: i for i, c in enumerate(cab)}
            prods = [idx[f"Name_of_Drug_or_Biological_or_Device_or_Medical_Supply_{i}"] for i in range(1, 6)]
            iNat, iNPI, iUSD = (idx["Nature_of_Payment_or_Transfer_of_Value"], idx["Covered_Recipient_NPI"],
                                idx["Total_Amount_of_Payment_USDollars"])
            iFecha = idx["Date_of_Payment"]
            iPag = idx["Applicable_Manufacturer_or_Applicable_GPO_Making_Payment_Name"]
            for f in lector:
                if len(f) < len(cab):
                    continue
                nombres = {(f[p] or "").upper().strip() for p in prods} - {""}
                try:
                    monto = float(f[iUSD] or 0)
                except ValueError:
                    monto = 0.0
                npi = (f[iNPI] or "").strip()
                for m in marcas:
                    if m.upper() not in nombres:
                        continue
                    r = res[m]
                    r["usd_total"] += monto
                    r["pagadores"][f[iPag]] += 1
                    if f[iNat].startswith("Food"):
                        r["comidas"] += 1
                        r["usd_comidas"] += monto
                        r["comidas_compartidas"] += len(nombres) > 1
                        if npi:
                            r["medicos_con_comida"].add(npi)
                        fecha = f[iFecha]
                        if len(fecha) >= 10:
                            r["comidas_por_mes"][fecha[6:10] + "-" + fecha[0:2]] += 1
                    elif f[iNat].startswith("Compensation for services other than consulting"):
                        r["charlas_pagos"] += 1
                        r["charlas_usd"] += monto
                        if npi:
                            r["disertantes"].add(npi)
                        fecha = f[iFecha]
                        if len(fecha) >= 10:
                            r["charlas_por_mes"][fecha[6:10] + "-" + fecha[0:2]] += 1
        out[anio] = {m: {**{k: v for k, v in r.items()
                            if k not in ("medicos_con_comida", "disertantes", "comidas_por_mes", "charlas_por_mes", "pagadores")},
                         "medicos_con_comida": len(r["medicos_con_comida"]), "disertantes": len(r["disertantes"]),
                         "comidas_por_mes": dict(sorted(r["comidas_por_mes"].items())),
                         "charlas_por_mes": dict(sorted(r["charlas_por_mes"].items())),
                         "pagadores": dict(r["pagadores"].most_common(5))} for m, r in res.items()}
    return out


def serie_historica():
    """Recetas y pacientes de Medicare por producto, de 2013 a 2024, y lo último publicado (2025 y 2026).

    Dos archivos de CMS, descargados en `cache/historia/`:

    - **Medicare Part D Prescribers by Geography and Drug**, la fila nacional de cada año (una versión
      del conjunto por año, 2013 a 2024). Suprime a los médicos con menos de 11 recetas de un
      medicamento, así que sus totales quedan apenas por debajo del gasto por medicamento (en 2024,
      1.320.644 pacientes de Xarelto contra 1.321.019).
    - **Medicare Quarterly Part D Spending by Drug**, con 2025 completo y el primer trimestre de 2026.
      Es otro archivo y otra forma de contar, así que no se empalma con la serie anual: se lee aparte.

    Las cuotas son entre Xarelto y Eliquis. La warfarina, el dabigatrán y el edoxabán van como
    contexto; sus pacientes suman filas de marcas distintas y pueden contar dos veces a quien cambió
    de marca en el año. "Lo que suman" es la diferencia neta de pacientes contra el año anterior, no
    pacientes nuevos: un paciente que deja uno y empieza el otro resta en uno y suma en el otro."""
    grupos = {"Xarelto": {"Xarelto"}, "Eliquis": {"Eliquis"},
              "Warfarina": {"Warfarin Sodium", "Coumadin", "Jantoven"},
              "Dabigatrán": {"Pradaxa", "Dabigatran Etexilate"}, "Edoxabán": {"Savaysa"}}
    anual = {}
    for f in sorted((CACHE / "historia").glob("geo_drug_*.json")):
        d = json.loads(f.read_text(encoding="utf-8"))
        fila = {g: {"recetas": 0.0, "pacientes": 0.0} for g in grupos}
        for r in d["anticoagulantes"]:
            for g, nombres in grupos.items():
                if r["Brnd_Name"] in nombres:
                    fila[g]["recetas"] += float(r["Tot_Clms"] or 0)
                    fila[g]["pacientes"] += float(r["Tot_Benes"] or 0)
        anual[d["anio"]] = fila

    serie, previo = [], None
    for a in sorted(anual):
        x, e = anual[a]["Xarelto"], anual[a]["Eliquis"]
        directos = sum(anual[a][g]["pacientes"] for g in ("Xarelto", "Eliquis", "Dabigatrán", "Edoxabán"))
        todos = directos + anual[a]["Warfarina"]["pacientes"]
        item = {"anio": a,
                **{f"{g}_{k}": anual[a][g][k] for g in grupos for k in ("recetas", "pacientes")},
                "cuota_xarelto_recetas_pct": 100 * x["recetas"] / (x["recetas"] + e["recetas"]),
                "cuota_xarelto_pacientes_pct": 100 * x["pacientes"] / (x["pacientes"] + e["pacientes"]),
                "directos_sobre_anticoagulantes_pacientes_pct": 100 * directos / todos}
        if previo:
            dx = x["pacientes"] - anual[previo]["Xarelto"]["pacientes"]
            de = e["pacientes"] - anual[previo]["Eliquis"]["pacientes"]
            item.update({"suma_pacientes_xarelto": dx, "suma_pacientes_eliquis": de,
                         "parte_eliquis_de_lo_que_suman_pct": 100 * de / (dx + de) if dx + de > 0 else None})
        serie.append(item)
        previo = a

    def primer_anio(clave):
        return next((i["anio"] for i in serie if i[f"Eliquis_{clave}"] > i[f"Xarelto_{clave}"]), None)

    trim = json.loads((CACHE / "historia" / "trimestral_part_d.json").read_text(encoding="utf-8"))
    recientes = {}
    for r in trim["filas"]:
        if r["Mftr_Name"] != "Overall":
            continue
        recientes.setdefault(r["Year"], {})[r["Brnd_Name"]] = {
            "generico": r["Gnrc_Name"], "pacientes": float(r["Tot_Benes"] or 0), "recetas": float(r["Tot_Clms"] or 0),
            "gasto_usd": float(r["Tot_Spndng"] or 0), "gasto_por_receta_usd": float(r["Avg_Spnd_Per_Clm"] or 0)}
    for periodo, d in recientes.items():
        riva = sum(v["recetas"] for v in d.values() if v["generico"].lower().startswith("rivaroxaban"))
        apix = sum(v["recetas"] for v in d.values() if v["generico"].lower().startswith("apixaban"))
        xar, eli = d.get("Xarelto", {}).get("recetas", 0), d.get("Eliquis", {}).get("recetas", 0)
        d["cuotas"] = {"rivaroxaban_sobre_los_dos_pct": 100 * riva / (riva + apix) if riva + apix else None,
                       "xarelto_marca_sobre_xarelto_y_eliquis_pct": 100 * xar / (xar + eli) if xar + eli else None}

    return {"fuente_anual": "Medicare Part D Prescribers by Geography and Drug, fila nacional, 2013 a 2024",
            "fuente_reciente": trim["dataset"] + " (" + trim["url"] + ")",
            "serie": serie,
            "primer_anio_eliquis_supera_a_xarelto": {"recetas": primer_anio("recetas"), "pacientes": primer_anio("pacientes")},
            "recientes": recientes}


def pagos_y_disertantes(med):
    """Lo que Open Payments dice del gasto, más allá de contar comidas. Otra pasada por el archivo.

    Tres cosas que el conteo de visitas no muestra:

    - **Cuánto declara cada marca**, en total y por receta de Medicare. Los pagos cubren a
      todos los pagadores y las recetas sólo a Medicare, así que el cociente es una escala
      para comparar las dos marcas, no un costo por receta.
    - **Las comidas compartidas.** Una comida de Pfizer que nombra Eliquis, Paxlovid y Nurtec
      cuenta entera como visita de Eliquis en `visitas()` y sus dólares van enteros a Eliquis.
      Eso agranda a Eliquis en visitas y en dólares, o sea que juega en contra de la tesis.
    - **Las charlas pagadas** (compensación como disertante): a cuántos médicos, dónde caen en
      los deciles de receta (los mismos de `cruce_por_medico`) y con qué cuota.

    Además, las visitas que liberaría un tope de nueve por médico al año. Nada de esto dice que
    el pago cause la receta: el laboratorio elige a quién le paga."""
    marcas = ("Eliquis", "Xarelto")
    clase = {n: d for n, d in med.items() if d["Eliquis"] + d["Xarelto"] > 0}
    rec = {n: d["Eliquis"] + d["Xarelto"] for n, d in clase.items()}
    orden = sorted(clase, key=lambda n: (-rec[n], n))
    k = len(orden) // 10
    decil = {n: min(i // k, 9) + 1 for i, n in enumerate(orden)}
    tot = sum(rec.values())
    recetas = {m: sum(d[m] for d in clase.values()) for m in marcas}

    usd = collections.Counter()
    comidas = {m: collections.Counter() for m in marcas}
    usd_comidas = {m: collections.Counter() for m in marcas}
    acompanantes = {m: collections.Counter() for m in marcas}
    por_npi = {m: collections.Counter() for m in marcas}
    charla = {m: collections.defaultdict(float) for m in marcas}
    charla_pagos = collections.Counter()
    with open(CACHE / "op23.csv", encoding="utf-8", errors="replace") as fh:
        cab = next(csv.reader(fh))
        idx = {c: i for i, c in enumerate(cab)}
        prods = [idx[f"Name_of_Drug_or_Biological_or_Device_or_Medical_Supply_{i}"] for i in range(1, 6)]
        iNat, iNPI, iUSD = (idx["Nature_of_Payment_or_Transfer_of_Value"], idx["Covered_Recipient_NPI"],
                            idx["Total_Amount_of_Payment_USDollars"])
        for f in csv.reader(fh):
            if len(f) < len(cab):
                continue
            nombres = {(f[p] or "").upper().strip() for p in prods} - {""}
            try:
                monto = float(f[iUSD] or 0)
            except ValueError:
                monto = 0.0
            npi = (f[iNPI] or "").strip()
            for m in marcas:
                if m.upper() not in nombres:
                    continue
                usd[m] += monto
                if f[iNat].startswith("Food"):
                    tipo = "compartida" if len(nombres) > 1 else "sola"
                    comidas[m][tipo] += 1
                    usd_comidas[m][tipo] += monto
                    for otro in nombres - {m.upper()}:
                        acompanantes[m][otro] += 1
                    if npi:
                        por_npi[m][npi] += 1
                elif f[iNat].startswith("Compensation for services other than consulting"):
                    charla[m][npi] += monto
                    charla_pagos[m] += 1

    out = {"recetas_medicare_2023": recetas,
           "usd_declarados": dict(usd),
           "cuota_xarelto_de_los_usd_pct": 100 * usd["Xarelto"] / (usd["Xarelto"] + usd["Eliquis"]),
           "usd_por_receta_de_medicare": {m: usd[m] / recetas[m] for m in marcas},
           "comidas": {}, "charlas": {}}
    for m in marcas:
        total = sum(comidas[m].values())
        out["comidas"][m] = {
            "total": total, "compartidas": comidas[m]["compartida"],
            "pct_compartidas": 100 * comidas[m]["compartida"] / total,
            "usd_solas": usd_comidas[m]["sola"], "usd_compartidas": usd_comidas[m]["compartida"],
            "productos_que_acompanan": dict(acompanantes[m].most_common(6))}
        pagados = charla[m]
        con_fila = [n for n in pagados if n in clase]
        r = sum(rec[n] for n in con_fila)
        out["charlas"][m] = {
            "pagos": charla_pagos[m], "medicos": len(pagados), "usd": sum(pagados.values()),
            "mediana_usd_por_medico": statistics.median(pagados.values()) if pagados else 0,
            "con_fila_en_part_d": len(con_fila),
            "por_decil": dict(sorted(collections.Counter(decil[n] for n in con_fila).items())),
            "pct_recetas": 100 * r / tot,
            "cuota_xarelto_pct": 100 * sum(clase[n]["Xarelto"] for n in con_fila) / r if r else None}
    x = por_npi["Xarelto"]
    cola = [n for n in x if x[n] >= 10]
    out["tope_de_nueve"] = {"medicos_con_diez_o_mas": len(cola), "visitas_de_esos_medicos": sum(x[n] for n in cola),
                            "visitas_liberadas": sum(x[n] - 9 for n in cola)}
    return out


def plan_bajo_supuestos(out):
    """La cuenta del segundo paso, con los supuestos escritos al lado de cada número.

    Destino: los médicos del 20% que más receta que en 2023 recibían a Eliquis y no a Xarelto.
    Frecuencia supuesta: la mediana de visitas de Eliquis por médico visitado, para no inventar
    una. Origen: el tope de nueve, y lo que falte, de las visitas de Xarelto en los condados
    donde vende poco y visita más de lo que vende."""
    m23 = out["medicos_2023"]
    destino = m23["quintil_superior"]["con_comida_eliquis_y_sin_xarelto"]["medicos"]
    frecuencia = m23["comidas"]["Eliquis"]["mediana_por_medico_visitado"]
    debil = set(out["voz"]["cuadrantes"]["debil_sobre"]["fips"])
    origen = sum(p["comidas_xarelto"] for p in out["voz"]["puntos"] if p["fips"] in debil)
    necesarias = destino * frecuencia
    liberadas = out["pagos"]["tope_de_nueve"]["visitas_liberadas"]
    faltan = max(0, necesarias - liberadas)
    return {"supuestos": ["una comida declarada es una visita",
                          "la frecuencia por médico es la mediana de Eliquis con los médicos que visita"],
            "medicos_destino": destino, "frecuencia_por_anio": frecuencia, "visitas_necesarias": necesarias,
            "liberadas_por_el_tope": liberadas, "faltan": faltan,
            "visitas_xarelto_donde_vende_poco_y_visita_mas": origen,
            "pct_de_esas_a_mover": 100 * faltan / origen}


# Precio negociado por 30 días para 2026 (CMS, primera ronda del programa de negociación) y venta
# declarada en Estados Unidos en 2025 por cada empresa (10-K de J&J y de Bristol Myers Squibb).
PRECIO_NEGOCIADO_2026 = {"Xarelto": 197.0, "Eliquis": 231.0}
VENTA_EEUU_2025_MUSD = {"Xarelto": 2633.0, "Eliquis": 10239.0}


def persistencia():
    """Días de tratamiento por paciente y por año, de 2016 a 2024, para las dos marcas.

    Sale del mismo archivo que la serie histórica (**Prescribers by Geography and Drug**, fila
    nacional), pero usando `Tot_30day_Fills`, que CMS estandariza a envases de 30 días, en lugar de
    `Tot_Clms`. Es la diferencia entre medir recetas y medir tratamiento: Xarelto despacha 1,79
    envases de 30 días por receta y Eliquis 1,61, o sea que Xarelto usa más envases de 90 días. Por
    eso en recetas por paciente Xarelto parece quedarse atrás (5,04 contra 5,44 en 2024) y en días de
    tratamiento por paciente queda adelante (270 contra 263).

    **Lo que esta medida no puede decir:** el denominador son los pacientes con al menos una receta en
    el año, así que el que empieza a mitad de año baja el promedio. Eliquis suma pacientes todos los
    años y Xarelto no, con lo cual el sesgo juega en contra de Eliquis. La lectura segura es que
    Xarelto **no retiene peor**, no que retenga mejor; y, dentro de Xarelto, que el tratamiento por
    paciente creció mientras la cuota se caía."""
    out = {"por_anio": [], "fuente": "Medicare Part D Prescribers by Geography and Drug, fila nacional"}
    for f in sorted((CACHE / "historia").glob("geo_drug_*.json")):
        d = json.loads(f.read_text(encoding="utf-8"))
        fila = {r["Brnd_Name"]: r for r in d["anticoagulantes"] if r["Brnd_Name"] in ("Xarelto", "Eliquis")}
        if len(fila) < 2:
            continue
        item = {"anio": d["anio"]}
        for m, r in fila.items():
            env, ben, rec = float(r["Tot_30day_Fills"] or 0), float(r["Tot_Benes"] or 0), float(r["Tot_Clms"] or 0)
            item[m] = {"envases_30_dias": env, "pacientes": ben, "recetas": rec,
                       "envases_por_paciente": env / ben, "dias_por_paciente": 30 * env / ben,
                       "envases_por_receta": env / rec, "recetas_por_paciente": rec / ben}
        item["ventaja_xarelto_dias"] = item["Xarelto"]["dias_por_paciente"] - item["Eliquis"]["dias_por_paciente"]
        out["por_anio"].append(item)
    ult = out["por_anio"][-1]
    out["ultimo_anio"] = {"anio": ult["anio"],
                          "dias_por_paciente": {m: ult[m]["dias_por_paciente"] for m in ("Xarelto", "Eliquis")},
                          "recetas_por_paciente": {m: ult[m]["recetas_por_paciente"] for m in ("Xarelto", "Eliquis")},
                          "envases_por_receta": {m: ult[m]["envases_por_receta"] for m in ("Xarelto", "Eliquis")}}
    out["xarelto_gana_todos_los_anios"] = all(i["ventaja_xarelto_dias"] > 0 for i in out["por_anio"])
    return out


def tamanio_en_dolares(serie, persist, medicos):
    """Cuánto vale en dólares el libro de Medicare, al precio que Medicare negoció.

    El volumen es el de 2025 (archivo trimestral) y el precio, el negociado para 2026, que rige por
    envase de 30 días; las recetas se pasan a envases con la proporción medida en 2024. No es la venta
    declarada ni el neto real, que nadie publica: es cuánto factura ese volumen al precio de la lista
    negociada, o sea un techo.

    **Por qué el techo sirve igual:** la misma cuenta para Eliquis da un número muy cerca de lo que
    Bristol Myers Squibb declara de venta en todo Estados Unidos, y Eliquis vende también fuera de
    Medicare. Eso dice que el precio negociado quedó por encima del neto promedio que venían
    cobrando, y que la parte de Medicare en el negocio es grande aunque el número esté inflado."""
    k25 = next(k for k in serie["recientes"] if k.startswith("2025"))
    env_rec = {m: persist["ultimo_anio"]["envases_por_receta"][m] for m in ("Xarelto", "Eliquis")}
    out = {"volumen": "2025", "precio": "negociado 2026, por 30 días", "por_marca": {}}
    for m in ("Xarelto", "Eliquis"):
        rec = serie["recientes"][k25][m]["recetas"]
        env = rec * env_rec[m]
        musd = env * PRECIO_NEGOCIADO_2026[m] / 1e6
        out["por_marca"][m] = {
            "recetas_2025": rec, "envases_30_dias": env, "precio_negociado_2026": PRECIO_NEGOCIADO_2026[m],
            "valor_musd": musd, "venta_declarada_eeuu_2025_musd": VENTA_EEUU_2025_MUSD[m],
            "pct_de_la_venta_declarada": 100 * musd / VENTA_EEUU_2025_MUSD[m],
            "gasto_bruto_medicare_musd": serie["recientes"][k25][m]["gasto_usd"] / 1e6}
    par = sum(serie["recientes"][k25][m]["recetas"] for m in ("Xarelto", "Eliquis"))
    punto_par = par / 100
    out["un_punto_del_par"] = {
        "recetas": punto_par,
        "musd_al_precio_de_xarelto": punto_par * env_rec["Xarelto"] * PRECIO_NEGOCIADO_2026["Xarelto"] / 1e6,
        "cuota_xarelto_2025_pct": 100 * serie["recientes"][k25]["Xarelto"]["recetas"] / par}
    grandes = medicos["decil_superior"]["con_comida_eliquis_y_sin_xarelto"]
    rec_grandes = medicos["universo"]["recetas"] * grandes["pct_recetas_del_total"] / 100
    punto_grandes = rec_grandes / 100
    out["un_punto_con_los_grandes"] = {
        "medicos": grandes["medicos"], "recetas_del_grupo": rec_grandes, "recetas": punto_grandes,
        "musd": punto_grandes * env_rec["Xarelto"] * PRECIO_NEGOCIADO_2026["Xarelto"] / 1e6}
    # Costo de reconstruir la visita para ese grupo. Los dos números son supuestos declarados: una
    # lista de 150 a 175 médicos por representante y un costo cargado de 250.000 a 300.000 dólares al
    # año, que son rangos de la industria, no un dato de J&J.
    escenarios = []
    for medicos_por_rep, costo in ((175, 250_000), (150, 300_000)):
        reps = math.ceil(grandes["medicos"] / medicos_por_rep)
        gasto = reps * costo / 1e6
        escenarios.append({"medicos_por_representante": medicos_por_rep, "costo_cargado_usd": costo,
                           "representantes": reps, "costo_musd": gasto,
                           "puntos_para_empatar": gasto / out["un_punto_con_los_grandes"]["musd"]})
    out["reconstruir_la_visita"] = {"supuestos": ["150 a 175 médicos por representante",
                                                  "250.000 a 300.000 dólares al año por representante, cargado"],
                                    "escenarios": escenarios}
    return out


def main():
    pres = presentaciones()
    aviso("NDC por presentación:", dict(collections.Counter(pres.values())))
    z2c = zip_a_condado()

    acceso, acc23 = {}, None
    for anio in ("2023", "2026"):
        dir_form = CACHE / f"form{anio}"
        form = leer_formulario(dir_form, pres)
        padron_total, celdas = leer_padron(dir_form, CACHE / f"enr{anio}.zip")
        acceso[anio] = acceso_por_presentacion(padron_total, celdas, form)
        if anio == "2023":
            acc23 = acceso_por_condado(celdas, form)
        pp = acceso[anio]["presentaciones"]
        aviso(f"{anio}: escalonada sobre {COMPITE['Xarelto']}: "
              f"{pp['Xarelto · ' + COMPITE['Xarelto'] + ' · marca']['vidas_con_escalonada']:,} vidas; en alguna presentación: "
              f"{acceso[anio]['vidas_con_escalonada_en_alguna_presentacion_de_xarelto']:,}")

    ubic23 = ubicacion_por_npi("23")
    med23 = receta_por_medico("23", ubic23)
    aviso(f"receta 2023: {len(med23):,} médicos con alguna de las tres moléculas")
    med24 = receta_por_medico("24", ubicacion_por_npi("24"))
    aviso(f"receta 2024: {len(med24):,} médicos")
    rx, rx24 = receta_por_condado(z2c, med23), receta_por_condado(z2c, med24)
    vis, nat, dolares, vm, sin_npi, geo, fuente = visitas(z2c, ubic23)
    del ubic23
    aviso(f"origen del condado de cada comida: {geo}")

    filas = []
    for c, a in acc23.items():
        r = rx.get(c, {})
        cub = a.get("Xarelto_cub", 0)
        tot = r.get("Eliquis", 0) + r.get("Xarelto", 0)
        if cub < MIN_AFILIADOS or tot < MIN_RECETAS:
            continue
        filas.append({"cond": c, "cuota": 100 * r.get("Xarelto", 0) / tot, "recetas": tot,
                      "afiliados": cub, "rx_xar": r.get("Xarelto", 0)})
    filas.sort(key=lambda x: x["cond"])
    aviso(f"condados base (afiliados y recetas mínimos): {len(filas):,}")

    voz = []
    for x in filas:
        v = vis.get(x["cond"], {})
        tv = v.get("Eliquis", 0) + v.get("Xarelto", 0)
        if tv < MIN_VISITAS:
            continue
        voz.append({**x, "visitas": tv, "promo": 100 * v.get("Xarelto", 0) / tv, "vis_xar": v.get("Xarelto", 0)})
    sobre = [x for x in voz if x["promo"] > x["cuota"]]

    # Segmentación en cuatro cuadrantes, la base de las métricas de la decisión.
    # Eje 1: si Xarelto vende más o menos que su cuota nacional frente a Eliquis.
    # Eje 2: si visita más o menos de lo que vende (la diagonal voz = cuota).
    som_nac = 100 * sum(x["rx_xar"] for x in voz) / sum(x["recetas"] for x in voz)

    def cuadrante(x):
        return ("fuerte" if x["cuota"] >= som_nac else "debil") + "_" + \
               ("sobre" if x["promo"] > x["cuota"] else "sub")

    cuadrantes = {}
    for nombre in ("fuerte_sub", "fuerte_sobre", "debil_sobre", "debil_sub"):
        g = [x for x in voz if cuadrante(x) == nombre]
        r = sum(x["recetas"] for x in g)
        v = sum(x["visitas"] for x in g)
        cuadrantes[nombre] = {
            "condados": len(g),
            "pct_recetas": 100 * r / sum(x["recetas"] for x in voz),
            "pct_visitas": 100 * v / sum(x["visitas"] for x in voz),
            "cuota_pct": 100 * sum(x["rx_xar"] for x in g) / r,
            "voz_pct": 100 * sum(x["vis_xar"] for x in g) / v,
            "fips": sorted(x["cond"] for x in g),
        }
    oport = [x for x in voz if x["cuota"] > 25 and x["promo"] < x["cuota"]]
    dens = {x["cond"]: 1000 * x["visitas"] / x["recetas"] for x in voz}
    med_dens = statistics.median(dens.values())
    auditados = [x["cond"] for x in oport if dens[x["cond"]] < med_dens / 2]
    aviso(f"condados en el cruce de voz: {len(voz):,}; de oportunidad: {len(oport)}; auditados: {len(auditados)}")

    out = {
        "capturado": "2026-09-13",
        "denominador": "apixabán + rivaroxabán (Eliquis y Xarelto). La warfarina NO entra en las cuotas.",
        "presentaciones_que_compiten": COMPITE,
        "mercado": mercado(),
        "acceso_por_presentacion": acceso,
        "condados_base": len(filas),
        "recetas_base": sum(x["recetas"] for x in filas),
        "voz": {
            "condados": len(voz),
            "visitas": sum(x["visitas"] for x in voz),
            "cuota_promocion_pct": 100 * sum(x["vis_xar"] for x in voz) / sum(x["visitas"] for x in voz),
            "cuota_receta_pct": 100 * sum(x["rx_xar"] for x in voz) / sum(x["recetas"] for x in voz),
            "visitas_xarelto": sum(x["vis_xar"] for x in voz),
            "corr_voz_receta_ponderada": corr([x["cuota"] for x in voz], [x["promo"] for x in voz],
                                              [x["visitas"] for x in voz]),
            "sobreinvertidos": len(sobre),
            "brecha_mediana_todos": statistics.median([x["promo"] - x["cuota"] for x in voz]),
            "brecha_mediana_sobreinvertidos": statistics.median([x["promo"] - x["cuota"] for x in sobre]),
            "cuadrantes": cuadrantes,
            "corte_cuota_nacional_pct": som_nac,
            "oportunidad": len(oport),
            "oportunidad_fips": sorted(x["cond"] for x in oport),
            "oportunidad_mayor": max(oport, key=lambda x: x["recetas"]) if oport else None,
            "densidad_mediana_comidas_por_mil_recetas": med_dens,
            "puntos": [{"fips": x["cond"], "receta": x["cuota"], "promo": x["promo"], "comidas": x["visitas"],
                        "recetas": x["recetas"], "comidas_xarelto": x["vis_xar"], "recetas_xarelto": x["rx_xar"]}
                       for x in voz],
        },
        "naturaleza_pagos": nat,
        "dolares_declarados": dolares,
        "geografia_de_las_comidas": geo,
    }
    out["voz"]["ratio"] = out["voz"]["cuota_promocion_pct"] / out["voz"]["cuota_receta_pct"]

    # ---- Prerregistro 1: ¿la visita de 2023 se nota en la cuota de 2024, por condado? ----
    # Los cuadrantes se fijan con 2023 y se miran los MISMOS condados en 2024. Cada zona se
    # compara contra su par con cuota inicial parecida, porque la cuota nacional cayó en
    # todos lados y juzgar por "sube o baja" mediría el mercado, no la visita.
    UMBRAL = 1.0  # puntos; fijado en facts.md antes de abrir los archivos de 2024

    def cuota_agregada(fips, receta):
        xar = sum(receta.get(f, {}).get("Xarelto", 0) for f in fips)
        tot = sum(receta.get(f, {}).get("Xarelto", 0) + receta.get(f, {}).get("Eliquis", 0) for f in fips)
        return (100 * xar / tot if tot else None), tot

    crec = {}
    for nombre, c in cuadrantes.items():
        vivos = [f for f in c["fips"] if rx24.get(f)]
        c23, r23 = cuota_agregada(vivos, rx)
        c24, r24 = cuota_agregada(vivos, rx24)
        crec[nombre] = {"condados": len(vivos), "perdidos": len(c["fips"]) - len(vivos),
                        "cuota_2023": c23, "cuota_2024": c24, "cambio": c24 - c23,
                        "recetas_2023": r23, "recetas_2024": r24}

    def veredicto(d):
        if d >= UMBRAL:
            return "rinde"
        if d > 0:
            return "no concluye"
        return "no rinde"

    d1 = crec["debil_sobre"]["cambio"] - crec["debil_sub"]["cambio"]
    d2 = crec["fuerte_sobre"]["cambio"] - crec["fuerte_sub"]["cambio"]
    out["crecimiento"] = {
        "umbral_puntos": UMBRAL,
        "por_cuadrante": crec,
        "comparacion_1_vende_poco": {"diferencia": d1, "veredicto": veredicto(d1),
            "pregunta": "¿visitar mucho donde vende poco compra crecimiento?"},
        "comparacion_2_vende_mucho": {"diferencia": d2, "veredicto": veredicto(d2),
            "pregunta": "¿visitar mucho donde vende mucho defiende la cuota?"},
        "cuota_nacional": {"2023": cuota_agregada([x["cond"] for x in voz], rx)[0],
                           "2024": cuota_agregada([x["cond"] for x in voz], rx24)[0]},
    }
    aviso(f"prerregistro 1, comparación 1 (vende poco): {d1:+.2f} puntos -> {veredicto(d1)}")
    aviso(f"prerregistro 1, comparación 2 (vende mucho): {d2:+.2f} puntos -> {veredicto(d2)}")

    out["medicos_2023"] = cruce_por_medico(med23, vm, sin_npi)
    out["pagos"] = pagos_y_disertantes(med23)
    out["plan_bajo_supuestos"] = plan_bajo_supuestos(out)
    out["serie_historica"] = serie_historica()
    out["persistencia"] = persistencia()
    out["tamanio_en_dolares"] = tamanio_en_dolares(out["serie_historica"], out["persistencia"], out["medicos_2023"])
    out["pagos_por_anio"] = pagos_por_anio()
    out["respuesta_por_medico"] = respuesta_por_medico(med23, med24, vm)
    out["sensibilidad_salida_del_panel"] = sensibilidad_salida(med23, med24, vm)
    out["testigo_eliquis"] = testigo_eliquis(voz, oport)
    out["auditoria_domicilio"] = auditoria_domicilio(fuente, auditados, [x["cond"] for x in voz])

    rp = out["respuesta_por_medico"]
    for k in ("comparacion_1_principal", "comparacion_2_la_cola", "comparacion_3_secundaria"):
        c = rp[k]
        aviso(f"prerregistro 2, {k}: {c['diferencia_puntos']:+.2f} puntos "
              f"[{c['ic95'][0]:+.2f}, {c['ic95'][1]:+.2f}] -> {c['veredicto']}")
    for k, c in out["sensibilidad_salida_del_panel"]["comparaciones"].items():
        e = c["escenarios"]
        aviso(f"sensibilidad {k}: peor {e['peor caso para la visita']['diferencia_puntos']:+.2f}, "
              f"medio {e['punto medio']['diferencia_puntos']:+.2f}, "
              f"mejor {e['mejor caso para la visita']['diferencia_puntos']:+.2f} -> {c['lectura']}")
    aviso(f"auditoría de domicilio: {out['auditoria_domicilio']['veredicto']}")

    destino = CACHE / "numeros.json"
    destino.write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
    aviso(f"escrito {destino.relative_to(RAIZ)}")
    aviso(f"  cuota voz {out['voz']['cuota_promocion_pct']:.1f}% / receta "
          f"{out['voz']['cuota_receta_pct']:.1f}% = {out['voz']['ratio']:.2f}x")


if __name__ == "__main__":
    main()
