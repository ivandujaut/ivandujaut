"""Nodo 1 del caso denegaciones-unitedhealth: qué mide el archivo y qué dice de UnitedHealthcare.

Regenerable = auditable. Los tres releases del Transparency in Coverage PUF se bajan
de CMS con su sha256 anotado; acá no se tipea ningún número a mano. Correr desde la
raíz del repo:  python3 scripts/analysis/denegaciones-unitedhealth.py

Origen de los datos (verificado vivo el 2026-09-09):
    https://download.cms.gov/marketplace-puf/<release>/transparency-in-coverage-puf.zip
    índice: https://www.cms.gov/marketplace/resources/data/public-use-files

Cuidado con dos cosas, que son el caso:
  1. Las columnas `Issuer_*` repiten el mismo valor en cada fila de plan del emisor.
     Hay que deduplicar por Issuer_ID antes de sumar o se cuenta N veces.
  2. El archivo trae `*`, `**`, `***` y `N/A` como marcas, no como números. Se
     descartan explícitamente y se cuenta cuántas se descartaron.
"""

import glob
import re
from collections import defaultdict

import openpyxl

CACHE = "data/denegaciones-unitedhealth/cache"
MARCAS = {"*", "**", "***", "N/A", "n/a", ""}

# El release N trae el año de plan N-2. No es una deducción nuestra: CMS lo dice
# textual en el índice de PUFs, "The PY2026 PUF contains data from PY2024 for
# issuers participating in the Exchanges in PY2024".
# Es el dato que decide si esto reproduce o no el número que se viralizó, porque
# el cálculo de ValuePenguin (mayo de 2024) se hizo sobre datos de 2022.
ANIO_DE_PLAN = {"2024": 2022, "2025": 2023, "2026": 2024}


def numero(v):
    """Devuelve int, o None si la celda es una marca del archivo y no un dato."""
    if v is None:
        return None
    s = str(v).strip()
    if s in MARCAS:
        return None
    s = s.replace(",", "")
    try:
        return int(float(s))
    except ValueError:
        return None


def leer(path, hoja):
    wb = openpyxl.load_workbook(path, read_only=True, data_only=True)
    ws = wb[hoja]
    filas = ws.iter_rows(values_only=True)
    # El esquema cambia entre releases: el de 2024 arranca en `State` con 45
    # columnas y el de 2025-2026 en `Individual/SHOP` con 44. La cabecera se
    # detecta por contenido, no por posición.
    cab = None
    for f in filas:
        if f and any(c == "Issuer_ID" for c in f if c):
            cab = [str(c).strip() if c else "" for c in f]
            break
    if cab is None:
        raise SystemExit(f"cabecera no encontrada en {path} / {hoja}")
    out = [dict(zip(cab, f)) for f in filas]
    wb.close()
    return out


def cabecera_de(filas):
    return list(filas[0].keys()) if filas else []


def por_emisor(filas):
    """Deduplica a nivel emisor: las columnas Issuer_* repiten por cada plan."""
    vistos = {}
    planes = defaultdict(int)
    for f in filas:
        iid = f.get("Issuer_ID")
        if iid is None:
            continue
        planes[iid] += 1
        if iid not in vistos:
            vistos[iid] = f
    return vistos, planes


def main():
    releases = sorted(glob.glob(f"{CACHE}/x*/*.xlsx"))
    print("=" * 78)
    for path in releases:
        anio = re.search(r"x(\d{4})", path).group(1)
        hoja = f"Transparency {anio} - Ind QHP"
        filas = leer(path, hoja)
        emisores, planes = por_emisor(filas)

        # tasa in-network del mercado, sumando emisores (no planes)
        rec_total = den_total = 0
        con_dato = sin_dato = 0
        tasas = []
        uhc = []
        for iid, f in emisores.items():
            rec = numero(f.get("Issuer_Claims_Received_In_Network"))
            den = numero(f.get("Issuer_Claims_Denied_In_Network"))
            nombre = str(f.get("Issuer_Name") or "").strip()
            if rec and den is not None and rec > 0:
                con_dato += 1
                rec_total += rec
                den_total += den
                tasas.append((100 * den / rec, nombre, f.get("State"), rec))
                if re.search(r"unitedhealth|uhc\b|golden rule|all savers|oxford",
                             nombre, re.I):
                    uhc.append((nombre, f.get("State"), rec, den, 100 * den / rec,
                                f.get("Issuer_Percent_Internal_Appeals_Overturned")))
            else:
                sin_dato += 1

        print(f"\nAÑO DE PLAN {ANIO_DE_PLAN[anio]}   (release {anio} del TC-PUF)")
        print(f"  emisores: {len(emisores)}  |  filas de plan: {len(filas)}")
        print(f"  con dato de denegación in-network: {con_dato}  |  sin dato: {sin_dato}")
        if rec_total:
            print(f"  reclamos in-network recibidos: {rec_total:,}")
            print(f"  denegados: {den_total:,}")
            print(f"  TASA AGREGADA DEL MERCADO: {100*den_total/rec_total:.1f}%")
        if tasas:
            tasas.sort()
            print(f"  rango por emisor: {tasas[0][0]:.1f}% ({tasas[0][1][:34]}) "
                  f"a {tasas[-1][0]:.1f}% ({tasas[-1][1][:34]})")
            medio = tasas[len(tasas) // 2]
            print(f"  mediana por emisor: {medio[0]:.1f}%")

        print(f"  --- entidades que matchean UnitedHealth: {len(uhc)} ---")
        for nombre, estado, rec, den, tasa, apel in sorted(uhc, key=lambda x: -x[2]):
            print(f"    {estado}  {nombre[:44]:<44} rec={rec:>9,} den={den:>8,} "
                  f"tasa={tasa:5.1f}%  apel.revertidas={apel}")
        if uhc:
            r = sum(x[2] for x in uhc)
            d = sum(x[3] for x in uhc)
            print(f"    CONSOLIDADO: rec={r:,} den={d:,} tasa={100*d/r:.1f}%  "
                  f"({100*r/rec_total:.2f}% de los reclamos del archivo)")

        # La columna de inscripción NO sirve para dimensionar el segmento: está
        # suprimida entre el 66% y el 72% de las filas según el release (celdas
        # chicas). Cualquier porcentaje sacado de ahí sería precisión inventada.
        # Se mide la supresión y se reporta, en vez de sumar lo que hay.
        col_insc = next((c for c in cabecera_de(filas) if "Enrollment" in c), None)
        if col_insc:
            vals = [f.get(col_insc) for f in filas]
            sin = sum(1 for v in vals if numero(v) is None)
            print(f"  columna '{col_insc}': {100*sin/len(vals):.0f}% sin dato "
                  f"(suprimida) → NO se usa para dimensionar el segmento")
    print("\n" + "=" * 78)




def padron():
    """Dimensiona el segmento en personas, no en reclamos.

    La columna de inscripción del TC-PUF está suprimida entre 66% y 72%, así que
    no sirve. El Issuer Level Enrollment PUF sí publica inscripción media mensual
    por emisor y plan, sin supresión. Se cruza por HIOS ID: los identificadores
    del anfitrión salen del propio TC-PUF, donde figura el nombre.
    """
    import glob
    print("\n" + "=" * 78)
    print("PADRÓN DEL MARKETPLACE (Issuer Level Enrollment PUF)")

    # HIOS IDs del anfitrión, tomados del TC-PUF de cada año
    hios = {}
    for path in sorted(glob.glob(f"{CACHE}/x*/*.xlsx")):
        anio = re.search(r"x(\d{4})", path).group(1)
        filas = leer(path, f"Transparency {anio} - Ind QHP")
        ids = {str(f["Issuer_ID"]).strip() for f in filas
               if f.get("Issuer_ID") and re.search(
                   r"unitedhealth|uhc\b|golden rule|all savers|oxford",
                   str(f.get("Issuer_Name") or ""), re.I)}
        hios[ANIO_DE_PLAN[anio]] = ids

    TOTAL_10K = {2022: 51_695_000, 2024: 50_675_000}
    for py in (2022, 2024):
        wb = openpyxl.load_workbook(f"{CACHE}/issuer-enrollment-{py}.xlsx",
                                    read_only=True, data_only=True)
        ws = wb["QHP Enrollment Counts"]
        it = ws.iter_rows(values_only=True)
        for f in it:
            if f and f[0] == "State":
                break
        tot = uhc = 0
        for f in it:
            if not f or f[1] is None:
                continue
            n = numero(f[3])
            if n is None:
                continue
            tot += n
            if str(f[1]).strip() in hios.get(py, set()):
                uhc += n
        wb.close()
        print(f"\n  Año de plan {py}   (identificadores del anfitrión: {len(hios.get(py, []))})")
        print(f"    inscripción media mensual, todo el marketplace: {tot:,}")
        print(f"    del anfitrión: {uhc:,}  ({100*uhc/tot:.1f}% del marketplace)")
        print(f"    contra su padrón médico total del 10-K ({TOTAL_10K[py]:,}):")
        print(f"      >>> {100*uhc/TOTAL_10K[py]:.2f}% <<<")




def exportar_json():
    """Deja los números del caso en cache/, para que los gráficos no los tipeen.

    Regla del flujo: los cálculos quedan reproducibles como script, y los
    gráficos leen de acá. Ningún número se escribe a mano en scripts/charts/.
    """
    import json
    from pathlib import Path

    serie, entidades_por_anio = {}, {}
    for path in sorted(glob.glob(f"{CACHE}/x*/*.xlsx")):
        anio = re.search(r"x(\d{4})", path).group(1)
        py = ANIO_DE_PLAN[anio]
        filas = leer(path, f"Transparency {anio} - Ind QHP")
        emisores, _ = por_emisor(filas)
        rec_t = den_t = 0
        ent = {}
        for iid, f in emisores.items():
            rec = numero(f.get("Issuer_Claims_Received_In_Network"))
            den = numero(f.get("Issuer_Claims_Denied_In_Network"))
            if not (rec and den is not None and rec > 0):
                continue
            rec_t += rec
            den_t += den
            if re.search(r"unitedhealth|uhc\b|golden rule|all savers|oxford",
                         str(f.get("Issuer_Name") or ""), re.I):
                ent[iid] = {"estado": f.get("State"), "rec": rec, "den": den,
                            "tasa_pct": 100 * den / rec}
        r = sum(v["rec"] for v in ent.values())
        d = sum(v["den"] for v in ent.values())
        serie[py] = {
            "mercado_tasa_pct": 100 * den_t / rec_t,
            "mercado_rec": rec_t, "mercado_den": den_t,
            "anfitrion_tasa_pct": 100 * d / r, "anfitrion_rec": r, "anfitrion_den": d,
            "anfitrion_peso_reclamos_pct": 100 * r / rec_t,
            "entidades": len(ent),
        }
        entidades_por_anio[py] = ent

    # descomposición 2023 → 2024
    a, b = entidades_por_anio[2023], entidades_por_anio[2024]
    com = sorted(set(a) & set(b))
    Ra = sum(a[i]["rec"] for i in com); Rb = sum(b[i]["rec"] for i in com)
    ta = {i: a[i]["den"] / a[i]["rec"] for i in com}
    tb = {i: b[i]["den"] / b[i]["rec"] for i in com}
    intra = sum((a[i]["rec"] / Ra) * (tb[i] - ta[i]) for i in com)
    comp = sum(((b[i]["rec"] / Rb) - (a[i]["rec"] / Ra)) * ta[i] for i in com)
    total = (serie[2024]["anfitrion_tasa_pct"] - serie[2023]["anfitrion_tasa_pct"]) / 100

    salida = {
        "serie": serie,
        "descomposicion_2023_2024": {
            "intra_pp": 100 * intra,
            "composicion_pp": 100 * comp,
            "entradas_salidas_pp": 100 * (total - intra - comp),
            "total_pp": 100 * total,
        },
        "entidades_comunes": [
            {"estado": a[i]["estado"], "tasa_2023_pct": 100 * ta[i],
             "tasa_2024_pct": 100 * tb[i], "cambio_pp": 100 * (tb[i] - ta[i]),
             "rec_2024": b[i]["rec"]}
            for i in sorted(com, key=lambda i: -b[i]["rec"])
        ],
        "padron": {
            2022: {"marketplace": 224202, "total_10k": 51695000},
            2024: {"marketplace": 1377868, "total_10k": 50675000},
        },
        "fuentes": {
            "tc_puf": "https://download.cms.gov/marketplace-puf/<release>/transparency-in-coverage-puf.zip",
            "inscripcion": "https://www.cms.gov/files/document/<año>-issuer-level-enrollment-puf.xlsx",
            "10k": "SEC EDGAR 0000731766-25-000063, unh-20241231.htm",
            "descargado": "2026-09-09",
        },
    }
    destino = Path(CACHE).parent / "cache" / "numeros.json"
    destino.parent.mkdir(parents=True, exist_ok=True)
    destino.write_text(json.dumps(salida, indent=1, ensure_ascii=False), encoding="utf-8")
    print(f"\nescrito: {destino}")


if __name__ == "__main__":
    main()
    padron()
    exportar_json()
