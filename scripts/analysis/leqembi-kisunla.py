"""Pipeline del caso leqembi-kisunla, de los archivos públicos de CMS a `numeros.json`.

Regenerable = auditable. Todo número propio que cite la hoja de hechos sale de acá, y el auditor
del nodo 5 lo vuelve a correr.

**Qué compara el caso.** Los dos anticuerpos contra el amiloide que Medicare paga hoy para el
Alzheimer temprano: Leqembi (lecanemab, Eisai y Biogen, código J0174, la unidad es 1 mg) y Kisunla
(donanemab, Lilly, código J0175, la unidad es **2 mg**). Aduhelm (aducanumab, J0172) entra sólo como
antecedente. Como las unidades de los dos códigos no miden lo mismo, ninguna comparación se hace en
unidades: se hace en dólares, en pacientes o en aplicaciones.

**Tres fuentes de gasto que no se suman entre sí.**

- Part B Spending by Drug, anual (2020 a 2024) y trimestral (2025 completo y primer trimestre de
  2026, preliminar). Cubre todo lo que paga Part B por el código, en consultorio y en hospital. CMS
  pide no comparar el trimestral con el anual: las series se arman dentro de cada archivo.
- Physician & Other Practitioners por geografía y por prestador (2023 y 2024). Sólo lo que se factura
  en la planilla del profesional, que para un medicamento es casi todo consultorio. Trae
  `Tot_Bene_Day_Srvcs`, los días distintos con el servicio por paciente: para una infusión, es la
  cantidad de aplicaciones. Por prestador se suprimen las filas con menos de 11 pacientes.
- Outpatient Hospitals by Provider and Service viene por grupo de pago (APC) y no trae los
  medicamentos: se probó en 2024 y no hay filas de estos códigos. La parte hospitalaria se estima
  por diferencia contra el anual de Part B y se declara como estimación.

**Precio.** El límite de pago trimestral de Part B (ASP + 6%) por unidad de cada código, de los
archivos de pago de CMS. Es lo que Medicare reconoce por unidad, no lo que cobra la empresa.

Los archivos crudos van en `data/leqembi-kisunla/cache/` (ignorado por git):

    cache/api/*.json   respuestas de la API de data.cms.gov, una por consulta
    cache/asp/*.zip    archivos trimestrales de límite de pago de Part B
    cache/op23.csv     Open Payments 2023 filtrado por línea a los tres productos (y 2024, 2025)

Correr desde la raíz del repo:
    python3 scripts/analysis/leqembi-kisunla.py
"""

import collections
import csv
import io
import json
import re
import sys
import time
import urllib.parse
import urllib.request
import zipfile
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
CACHE = RAIZ / "data" / "leqembi-kisunla" / "cache"
SALIDA = CACHE / "numeros.json"

CODIGOS = {"J0172": "Aduhelm", "J0174": "Leqembi", "J0175": "Kisunla"}
MG_POR_UNIDAD = {"J0172": 2, "J0174": 1, "J0175": 2}
GENERICOS = {"ADUCANUMAB-AVWA": "Aduhelm", "LECANEMAB-IRMB": "Leqembi", "DONANEMAB-AZBT": "Kisunla"}

API = "https://data.cms.gov/data-api/v1/dataset/{}/data"
DATASETS = {
    "partb_anual": "76a714ad-3a2c-43ac-b76d-9dadf8f7d890",
    "partb_trimestral": "bf6a5b3b-31ee-4abb-b1ad-2607a1e7510a",
    "partd_anual": "7e0b4365-fd63-4a29-8f5e-e0ac9f66a81b",
    "partd_trimestral": "4ff7c618-4e40-483a-b390-c8a58c94fa15",
    "geo_2023": "ddee9e22-7889-4bef-975a-7853e4cd0fbb",
    "geo_2024": "0c75b0b3-b40f-4007-a5ac-f9f2fed95862",
    "prestador_2023": "0e9f2f2b-7bf9-451a-912c-e02e654dd725",
    "prestador_2024": "335e5f35-eca6-482d-87b3-f99883e213e3",
}
ASP_PAGINA = "https://www.cms.gov/medicare/payment/part-b-drugs/asp-pricing-files"
MESES = {"january": 1, "april": 4, "july": 7, "october": 10}


def aviso(*a):
    print(*a, file=sys.stderr)


def api(nombre, dataset, filtros):
    """Consulta paginada a data.cms.gov, guardada en cache/api/<nombre>.json."""
    ruta = CACHE / "api" / f"{nombre}.json"
    if ruta.exists():
        return json.loads(ruta.read_text())
    filas, offset = [], 0
    while True:
        params = {**filtros, "size": 5000, "offset": offset}
        url = API.format(DATASETS[dataset]) + "?" + urllib.parse.urlencode(params)
        with urllib.request.urlopen(url, timeout=120) as r:
            pagina = json.load(r)
        filas += pagina
        if len(pagina) < 5000:
            break
        offset += 5000
        time.sleep(0.5)
    ruta.parent.mkdir(parents=True, exist_ok=True)
    ruta.write_text(json.dumps(filas, ensure_ascii=False, indent=1))
    return filas


def num(x):
    try:
        return float(x)
    except (TypeError, ValueError):
        return None


# ---------------------------------------------------------------- gasto de Part B


def gasto_part_b():
    """Gasto, reclamos, pacientes y unidades por código: anual 2020-2024 y trimestral."""
    anual = {}
    for codigo, marca in CODIGOS.items():
        for f in api(f"partb_anual_{codigo}", "partb_anual", {"filter[HCPCS_Cd]": codigo}):
            por_anio = {}
            for anio in range(2020, 2025):
                gasto = num(f.get(f"Tot_Spndng_{anio}"))
                if not gasto:
                    continue
                por_anio[str(anio)] = {
                    "gasto": gasto,
                    "unidades": num(f.get(f"Tot_Dsg_Unts_{anio}")),
                    "reclamos": num(f.get(f"Tot_Clms_{anio}")),
                    "pacientes": num(f.get(f"Tot_Benes_{anio}")),
                    "gasto_por_paciente": num(f.get(f"Avg_Spndng_Per_Bene_{anio}")),
                    "gasto_por_reclamo": num(f.get(f"Avg_Spndng_Per_Clm_{anio}")),
                    "gasto_por_unidad": num(f.get(f"Avg_Spndng_Per_Dsg_Unt_{anio}")),
                }
            anual[marca] = por_anio

    trimestral = {}
    for codigo, marca in CODIGOS.items():
        for f in api(f"partb_trim_{codigo}", "partb_trimestral", {"filter[HCPCS_Cd]": codigo}):
            pac, rec, gasto = num(f["Tot_Benes"]), num(f["Tot_Clms"]), num(f["Tot_Spndng"])
            trimestral.setdefault(marca, {})[f["Year"]] = {
                "gasto": gasto, "reclamos": rec, "pacientes": pac,
                "gasto_por_paciente": num(f["Avg_Spnd_Per_Bene"]),
                "gasto_por_reclamo": num(f["Avg_Spnd_Per_Clm"]),
                "reclamos_por_paciente": rec / pac if pac else None,
            }

    cruce = {}
    q1 = "2026 (Q1)"
    if all(q1 in trimestral.get(m, {}) for m in ("Leqembi", "Kisunla")):
        l, k = trimestral["Leqembi"][q1], trimestral["Kisunla"][q1]
        cruce = {
            "periodo": q1,
            "kisunla_sobre_leqembi_gasto": k["gasto"] / l["gasto"],
            "kisunla_sobre_leqembi_pacientes": k["pacientes"] / l["pacientes"],
            "kisunla_sobre_leqembi_gasto_por_paciente": k["gasto_por_paciente"] / l["gasto_por_paciente"],
            "cuota_kisunla_gasto_de_los_dos": k["gasto"] / (k["gasto"] + l["gasto"]),
            "cuota_kisunla_pacientes_de_los_dos": k["pacientes"] / (k["pacientes"] + l["pacientes"]),
        }
    anio25 = "2025 (Q1-Q4)"
    if all(anio25 in trimestral.get(m, {}) for m in ("Leqembi", "Kisunla")):
        l, k = trimestral["Leqembi"][anio25], trimestral["Kisunla"][anio25]
        cruce["cuota_kisunla_gasto_2025"] = k["gasto"] / (k["gasto"] + l["gasto"])
        cruce["cuota_kisunla_pacientes_2025"] = k["pacientes"] / (k["pacientes"] + l["pacientes"])
    return {"anual": anual, "trimestral": trimestral, "cruce": cruce}


def gasto_part_d():
    """La subcutánea y cualquier fila de Part D de las tres moléculas."""
    out = {}
    for generico, marca in GENERICOS.items():
        for base in ("partd_trimestral", "partd_anual"):
            filas = api(f"{base}_{marca}", base, {"filter[Gnrc_Name]": generico.title()})
            filas += [f for f in api(f"{base}_{marca}_mayus", base, {"filter[Gnrc_Name]": generico})
                      if f not in filas]
            for f in filas:
                if f.get("Mftr_Name") not in (None, "Overall"):
                    continue
                if base == "partd_trimestral":
                    out.setdefault(base, {}).setdefault(f["Brnd_Name"], {})[f["Year"]] = {
                        "pacientes": num(f["Tot_Benes"]), "reclamos": num(f["Tot_Clms"]),
                        "gasto": num(f["Tot_Spndng"])}
                else:
                    out.setdefault(base, {})[f["Brnd_Name"]] = {
                        str(a): {"pacientes": num(f.get(f"Tot_Benes_{a}")), "gasto": num(f.get(f"Tot_Spndng_{a}"))}
                        for a in range(2020, 2025) if num(f.get(f"Tot_Spndng_{a}"))}
    return out


# ---------------------------------------------------------------- quién aplica y dónde


def por_geografia():
    """Nacional y por estado, consultorio, 2023 y 2024: aplicaciones por paciente y mg por aplicación."""
    out = {}
    for anio in ("2023", "2024"):
        for codigo, marca in CODIGOS.items():
            filas = api(f"geo_{anio}_{codigo}", f"geo_{anio}", {"filter[HCPCS_Cd]": codigo})
            for f in filas:
                nivel = f["Rndrng_Prvdr_Geo_Lvl"]
                pac, uni, dias = num(f["Tot_Benes"]), num(f["Tot_Srvcs"]), num(f["Tot_Bene_Day_Srvcs"])
                reg = {
                    "lugar": f["Place_Of_Srvc"], "prestadores": num(f["Tot_Rndrng_Prvdrs"]),
                    "pacientes": pac, "unidades": uni, "aplicaciones": dias,
                    "permitido_por_unidad": num(f["Avg_Mdcr_Alowd_Amt"]),
                    "pagado_por_unidad": num(f["Avg_Mdcr_Pymt_Amt"]),
                }
                if pac and dias:
                    reg["aplicaciones_por_paciente"] = dias / pac
                    reg["mg_por_aplicacion"] = uni * MG_POR_UNIDAD[codigo] / dias
                    reg["permitido_por_aplicacion"] = reg["permitido_por_unidad"] * uni / dias
                    reg["pagado_por_aplicacion"] = reg["pagado_por_unidad"] * uni / dias
                    reg["permitido_por_paciente"] = reg["permitido_por_unidad"] * uni / pac
                if nivel == "National":
                    out.setdefault(anio, {}).setdefault(marca, {})["nacional_" + f["Place_Of_Srvc"]] = reg
                elif nivel == "State":
                    out.setdefault(anio, {}).setdefault(marca, {}).setdefault("estados", {})[
                        f["Rndrng_Prvdr_Geo_Desc"]] = reg
    return out


def por_prestador():
    """Filas por prestador (11 pacientes o más): especialidad, persona u organización, ruralidad."""
    out, npis = {}, {}
    for anio in ("2023", "2024"):
        for codigo, marca in CODIGOS.items():
            filas = api(f"prestador_{anio}_{codigo}", f"prestador_{anio}", {"filter[HCPCS_Cd]": codigo})
            if not filas:
                continue
            esp, ent, ruca = collections.Counter(), collections.Counter(), collections.Counter()
            estados = collections.Counter()
            pac_total = 0
            for f in filas:
                pac = int(num(f["Tot_Benes"]) or 0)
                pac_total += pac
                esp[f["Rndrng_Prvdr_Type"]] += pac
                ent["organización" if f["Rndrng_Prvdr_Ent_Cd"] == "O" else "persona"] += pac
                ruca["urbano" if (num(f["Rndrng_Prvdr_RUCA"]) or 99) <= 3 else "no urbano"] += pac
                estados[f["Rndrng_Prvdr_State_Abrvtn"]] += pac
                npis.setdefault(marca, set()).add(f["Rndrng_NPI"])
            out.setdefault(anio, {})[marca] = {
                "filas": len(filas), "pacientes_en_filas": pac_total,
                "pacientes_por_especialidad": dict(esp.most_common()),
                "pacientes_por_tipo": dict(ent), "pacientes_por_ruralidad": dict(ruca),
                "estados_top": dict(estados.most_common(10)),
                "prestadores_top_pacientes": sorted(
                    ({"npi": f["Rndrng_NPI"], "nombre": f["Rndrng_Prvdr_Last_Org_Name"],
                      "tipo": f["Rndrng_Prvdr_Type"], "estado": f["Rndrng_Prvdr_State_Abrvtn"],
                      "pacientes": int(num(f["Tot_Benes"]) or 0)} for f in filas),
                    key=lambda x: -x["pacientes"])[:10],
            }
    return out, npis


# ---------------------------------------------------------------- precio


def asp():
    """Límite de pago por unidad de cada código, trimestre a trimestre, 2023 a 2026."""
    carpeta = CACHE / "asp"
    carpeta.mkdir(parents=True, exist_ok=True)
    pagina = carpeta / "pagina.html"
    if not pagina.exists():
        req = urllib.request.Request(ASP_PAGINA, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=60) as r:
            pagina.write_bytes(r.read())
    html = pagina.read_text(encoding="utf-8", errors="replace")
    links = sorted(set(re.findall(
        r'href="(/files/zip/(january|april|july|october)-(20\d\d)-(?:asp-pricing[^"]*|medicare-part-b-payment-limit-files[^"]*)\.zip)"',
        html)))
    out = {}
    for link, mes, anio, *_ in links:
        if int(anio) < 2023:
            continue
        clave = f"{anio}-{MESES[mes]:02d}"
        destino = carpeta / f"{clave}.zip"
        if "preliminary" in link:
            clave += " (preliminar)"
            destino = carpeta / f"{anio}-{MESES[mes]:02d}-preliminar.zip"
        if not destino.exists():
            req = urllib.request.Request("https://www.cms.gov" + link, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=120) as r:
                destino.write_bytes(r.read())
            time.sleep(1)
        with zipfile.ZipFile(destino) as z:
            csvs = [n for n in z.namelist() if n.lower().endswith(".csv") and "not payable" not in n.lower()
                    and ("pricing" in n.lower() or "payment limit" in n.lower() or "asp" in n.lower())]
            if not csvs:
                aviso("sin CSV de precios en", destino.name, z.namelist())
                continue
            texto = z.read(csvs[0]).decode("latin-1")
        vigencia = next((l.strip().strip('",') for l in texto.splitlines() if l.lower().startswith('"effective')
                         or l.lower().startswith("effective")), None)
        filas = {}
        for fila in csv.reader(io.StringIO(texto)):
            if fila and fila[0].strip() in CODIGOS:
                filas[CODIGOS[fila[0].strip()]] = {
                    "descripcion": fila[1], "unidad": fila[2], "limite_por_unidad": num(fila[3]),
                    "nota": fila[10] if len(fila) > 10 else "",
                    "limite_por_100mg": (num(fila[3]) or 0) * 100 / MG_POR_UNIDAD[fila[0].strip()],
                }
        out[clave] = {"archivo": link, "vigencia": vigencia, "codigos": filas}
    return out


# ---------------------------------------------------------------- Open Payments


def open_payments(npis_prestadores):
    """Pagos declarados que nombran a cada producto, 2023 a 2025.

    Mismo criterio que en acceso-parte-d: un pago que nombra a más de un producto cuenta entero para
    cada uno y se cuentan aparte los compartidos. El filtro por línea del archivo crudo es amplio (marca
    o molécula en cualquier columna); acá se exige que el nombre esté en las columnas de producto."""
    marcas = ("LEQEMBI", "KISUNLA", "ADUHELM")
    out = {}
    for anio in ("2023", "2024", "2025"):
        ruta = CACHE / f"op{anio[2:]}.csv"
        if not ruta.exists():
            out[anio] = None
            continue
        res = {m: {"pagos": 0, "usd": 0.0, "compartidos": 0, "usd_exclusivo": 0.0, "por_naturaleza": collections.Counter(),
                   "usd_por_naturaleza": collections.Counter(), "receptores": set(),
                   "por_tipo_receptor": collections.Counter(), "pagadores": collections.Counter(),
                   "por_mes": collections.Counter(), "disertantes": set(),
                   "acompaniantes": collections.Counter()} for m in marcas}
        with open(ruta, encoding="utf-8", errors="replace") as fh:
            lector = csv.reader(fh)
            cab = next(lector)
            idx = {c: i for i, c in enumerate(cab)}
            prods = [idx[f"Name_of_Drug_or_Biological_or_Device_or_Medical_Supply_{i}"] for i in range(1, 6)]
            iNat, iNPI, iUSD = (idx["Nature_of_Payment_or_Transfer_of_Value"], idx["Covered_Recipient_NPI"],
                                idx["Total_Amount_of_Payment_USDollars"])
            iTipo, iFecha = idx["Covered_Recipient_Type"], idx["Date_of_Payment"]
            iPag = idx["Applicable_Manufacturer_or_Applicable_GPO_Making_Payment_Name"]
            for f in lector:
                if len(f) < len(cab):
                    continue
                nombres = {(f[p] or "").upper().strip() for p in prods} - {""}
                monto = num(f[iUSD]) or 0.0
                for m in marcas:
                    if not any(m in n for n in nombres):
                        continue
                    r = res[m]
                    r["pagos"] += 1
                    r["usd"] += monto
                    r["compartidos"] += len(nombres) > 1
                    # Con qué otro producto comparte la fila (en Kisunla, casi siempre Amyvid, el
                    # trazador de PET de amiloide de Lilly).
                    for otro in nombres:
                        if m not in otro:
                            r["acompaniantes"][otro] += 1
                    if len(nombres) == 1:
                        r["usd_exclusivo"] += monto
                    r["por_naturaleza"][f[iNat]] += 1
                    r["usd_por_naturaleza"][f[iNat]] += monto
                    r["pagadores"][f[iPag]] += 1
                    r["por_tipo_receptor"][f[iTipo]] += 1
                    npi = (f[iNPI] or "").strip()
                    if npi:
                        r["receptores"].add(npi)
                        # Las dos categorías de charla: Lilly declara la de fuera de un programa de
                        # educación continua y Eisai la de docente o disertante.
                        if f[iNat].startswith(("Compensation for services other than consulting",
                                               "Compensation for serving as faculty")):
                            r["disertantes"].add(npi)
                    if len(f[iFecha]) >= 10:
                        r["por_mes"][f[iFecha][6:10] + "-" + f[iFecha][0:2]] += 1
        out[anio] = {}
        for m, r in res.items():
            marca = m.title()
            aplicadores = npis_prestadores.get(marca, set())
            out[anio][marca] = {
                "pagos": r["pagos"], "usd": r["usd"], "compartidos": r["compartidos"],
                "usd_exclusivo": round(r["usd_exclusivo"], 2),
                "receptores_con_npi": len(r["receptores"]), "disertantes": len(r["disertantes"]),
                "por_naturaleza": dict(r["por_naturaleza"].most_common()),
                "usd_por_naturaleza": {k: round(v, 2) for k, v in r["usd_por_naturaleza"].most_common()},
                "por_tipo_receptor": dict(r["por_tipo_receptor"]),
                "pagadores": dict(r["pagadores"].most_common(5)),
                "por_mes": dict(sorted(r["por_mes"].items())),
                "acompaniantes": dict(r["acompaniantes"].most_common(8)),
                "prestadores_grandes_2023_2024": len(aplicadores),
                "prestadores_grandes_con_pago": len(aplicadores & r["receptores"]),
            }
    return out


# Venta en EE.UU. de Leqembi según Biogen (USD millones, "U.S. in-market sales", comunicados de resultados
# en sec.gov, confirmados en el navegador el 2026-09-17). Lilly no separa Kisunla por país.
VENTA_EEUU_LEQEMBI_BIOGEN = {"2024-T2": 30, "2024-T3": 39, "2024-T4": 50, "2025-T1": 52, "2025-T2": 63,
                             "2025-T3": 69, "2025-T4": 78, "2026-T1": 86, "2026-T2": 97}
# Dosis de la etiqueta vigente: Leqembi IV 10 mg/kg cada 2 semanas al empezar (26 al año); Kisunla cada
# 4 semanas (13 al año), 1.400 mg pasada la titulación.
INFUSIONES_POR_ANIO = {"Leqembi": 26, "Kisunla": 13}
MG_MANTENIMIENTO_KISUNLA = 1400
CODIGOS_APLICACION = {"96365": "infusión terapéutica, primera hora", "96413": "biológico complejo, hasta 1 hora"}


def economia_del_centro(numeros):
    """Lo que Medicare le reconoce al centro por cada infusión además del precio promedio del remedio.

    Hipótesis del modelo, no ganancia: el centro compra a un precio que no es público. Por infusión:
    la parte del 6% del límite de pago (límite × 6/106) más el cargo por aplicar, con los dos códigos
    posibles porque no hay fuente oficial de cuál se usa. Leqembi a la media de mg por infusión observada
    en consultorio en 2024; Kisunla a la dosis de 1.400 mg."""
    precios = numeros["asp"]["2026-07"]["codigos"]
    cargos = {}
    for codigo in CODIGOS_APLICACION:
        filas = api(f"geo_2024_{codigo}", "geo_2024", {"filter[HCPCS_Cd]": codigo,
                                                       "filter[Rndrng_Prvdr_Geo_Lvl]": "National"})
        f = next(x for x in filas if x["Place_Of_Srvc"] == "O")
        cargos[codigo] = num(f["Avg_Mdcr_Alowd_Amt"])
    mg_leqembi = numeros["geografia"]["2024"]["Leqembi"]["nacional_O"]["mg_por_aplicacion"]
    precio_infusion = {
        "Leqembi": mg_leqembi * precios["Leqembi"]["limite_por_unidad"] / MG_POR_UNIDAD["J0174"],
        "Kisunla": MG_MANTENIMIENTO_KISUNLA / MG_POR_UNIDAD["J0175"] * precios["Kisunla"]["limite_por_unidad"],
    }
    out = {"cargo_por_aplicar": cargos, "mg_por_infusion_leqembi": mg_leqembi, "por_producto": {}}
    trim_2025 = {m: numeros["part_b"]["trimestral"][m]["2025 (Q1-Q4)"] for m in ("Leqembi", "Kisunla")}
    # Primer año de Kisunla con la titulación de la etiqueta: 350, 700 y 1.050 mg y diez infusiones de 1.400.
    mg_primer_anio = {"Leqembi": mg_leqembi * INFUSIONES_POR_ANIO["Leqembi"], "Kisunla": 350 + 700 + 1050 + 10 * 1400}
    for marca, precio in precio_infusion.items():
        seis = precio * 6 / 106
        bajo, alto = seis + min(cargos.values()), seis + max(cargos.values())
        precio_mg = precio / (mg_leqembi if marca == "Leqembi" else MG_MANTENIMIENTO_KISUNLA)
        seis_anio = mg_primer_anio[marca] * precio_mg * 6 / 106
        g = trim_2025[marca]
        # Lo cobrado en 2025: el 6% sobre el gasto real (no sobre una dosis supuesta) más un cargo por reclamo.
        # Supuesto declarado: el cargo es el permitido de consultorio también para los reclamos de hospital.
        seis_2025 = g["gasto"] * 6 / 106
        out["por_producto"][marca] = {
            "reconocido_por_infusion_dosis_completa": precio, "parte_del_6": seis,
            "al_centro_por_infusion": [bajo, alto],
            "mg_primer_anio": mg_primer_anio[marca],
            "al_centro_primer_anio": [seis_anio + INFUSIONES_POR_ANIO[marca] * min(cargos.values()),
                                      seis_anio + INFUSIONES_POR_ANIO[marca] * max(cargos.values())],
            "reclamos_2025": g["reclamos"], "parte_del_6_sobre_gasto_2025": seis_2025,
            "al_centro_2025": [seis_2025 + g["reclamos"] * min(cargos.values()),
                               seis_2025 + g["reclamos"] * max(cargos.values())],
        }
    # Mg por paciente en el primer trimestre de 2026, derivados del gasto por reclamo y el precio de enero.
    ene = numeros["asp"]["2026-01"]["codigos"]
    precio_mg_ene = {"Leqembi": ene["Leqembi"]["limite_por_unidad"], "Kisunla": ene["Kisunla"]["limite_por_unidad"] / 2}
    t1 = {m: numeros["part_b"]["trimestral"][m]["2026 (Q1)"] for m in ("Leqembi", "Kisunla")}
    out["mg_por_paciente_2026_t1"] = {m: t1[m]["gasto_por_reclamo"] / precio_mg_ene[m] * t1[m]["reclamos_por_paciente"]
                                      for m in t1}
    out["mg_por_reclamo_2026_t1"] = {m: t1[m]["gasto_por_reclamo"] / precio_mg_ene[m] for m in t1}
    l, k = out["por_producto"]["Leqembi"], out["por_producto"]["Kisunla"]
    out["kisunla_sobre_leqembi_por_infusion"] = [k["al_centro_por_infusion"][1] / l["al_centro_por_infusion"][1],
                                                 k["al_centro_por_infusion"][0] / l["al_centro_por_infusion"][0]]
    return out


def validacion_y_valor(numeros):
    """Part B contra la venta de Biogen, el valor de un punto de pacientes y la inyección en casa."""
    tri = numeros["part_b"]["trimestral"]["Leqembi"]
    venta_2025 = sum(v for k, v in VENTA_EEUU_LEQEMBI_BIOGEN.items() if k.startswith("2025"))
    d = numeros["part_d"]["partd_trimestral"]
    anual = tri["2025 (Q1-Q4)"]
    prest = numeros["prestadores"]["2024"]
    urbano = {m: prest[m]["pacientes_por_ruralidad"].get("urbano", 0) / prest[m]["pacientes_en_filas"] for m in prest
              if m in ("Leqembi", "Kisunla")}
    return {
        "urbano_2024_filas_grandes": urbano,
        "cinco_puntos_pacientes_2025": 5 * anual["pacientes"] / 100,
        "cinco_puntos_gasto_2025": 5 * anual["gasto"] / 100,
        "venta_eeuu_2025": venta_2025,
        "part_b_sobre_venta_2025": anual["gasto"] / 1e6 / venta_2025,
        "part_b_sobre_venta_2026_t1": tri["2026 (Q1)"]["gasto"] / 1e6 / VENTA_EEUU_LEQEMBI_BIOGEN["2026-T1"],
        "un_punto_pacientes_2025": anual["pacientes"] / 100,
        "un_punto_gasto_2025": anual["gasto"] / 100,
        "iqlik_sobre_infusion": {
            "2025 (Q1-Q4)": d["Leqembi Iqlik"]["2025 (Q1-Q4)"]["pacientes"] / tri["2025 (Q1-Q4)"]["pacientes"],
            "2026 (Q1)": d["Leqembi Iqlik"]["2026 (Q1)"]["pacientes"] / tri["2026 (Q1)"]["pacientes"],
        },
        "umbral_iqlik": 0.10,
    }


def main():
    numeros = {"generado": time.strftime("%Y-%m-%d %H:%M"), "codigos": CODIGOS, "mg_por_unidad": MG_POR_UNIDAD}
    numeros["part_b"] = gasto_part_b()
    numeros["part_d"] = gasto_part_d()
    numeros["geografia"] = por_geografia()
    numeros["prestadores"], npis = por_prestador()
    numeros["asp"] = asp()
    numeros["open_payments"] = open_payments(npis)

    # La parte hospitalaria no viene por medicamento: es el anual de Part B menos lo facturado en la
    # planilla del profesional. Estimación, porque un mismo paciente puede estar en los dos lados.
    est = {}
    for anio in ("2023", "2024"):
        for marca in ("Leqembi", "Kisunla"):
            b = numeros["part_b"]["anual"].get(marca, {}).get(anio)
            g = numeros["geografia"].get(anio, {}).get(marca, {}).get("nacional_O")
            if b and g:
                est.setdefault(anio, {})[marca] = {
                    "pacientes_part_b": b["pacientes"], "pacientes_consultorio": g["pacientes"],
                    "cuota_consultorio_pacientes": g["pacientes"] / b["pacientes"],
                    "unidades_part_b": b["unidades"], "unidades_consultorio": g["unidades"],
                    "cuota_consultorio_unidades": g["unidades"] / b["unidades"] if b["unidades"] else None,
                }
    numeros["consultorio_sobre_total"] = est
    numeros["economia_del_centro"] = economia_del_centro(numeros)
    numeros["validacion_y_valor"] = validacion_y_valor(numeros)

    SALIDA.write_text(json.dumps(numeros, ensure_ascii=False, indent=1))
    aviso("escrito", SALIDA.relative_to(RAIZ))


if __name__ == "__main__":
    main()
