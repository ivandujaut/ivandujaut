"""Corte por estado y tipo de plan: ¿la caída fue mejora o cambio de mezcla?

La pregunta del gate 2b (candidata C): entre los años de plan 2023 y 2024 la tasa
del anfitrión cayó 14,1 puntos. ¿Bajó porque las carteras que ya tenía mejoraron,
o porque entraron carteras nuevas que denegaban menos y arrastraron el promedio?

Se responde con una descomposición de cambio (shift-share) a nivel entidad, que
en este archivo es por estado:

    Δ total = efecto intra + efecto composición + efecto entradas y salidas

  - intra:        las entidades que están en los dos años, ¿mejoraron?
  - composición:  las mismas entidades, ¿cambiaron de peso entre sí?
  - entradas:     lo que aportan las que no estaban antes (o ya no están).

Correr desde la raíz del repo:
    python3 scripts/analysis/denegaciones-corte-composicion.py

Límite declarado: el corte por TIPO DE PLAN no se puede hacer. Las columnas de
denegación a nivel plan están pobladas sólo en el 24% de las filas del anfitrión
en PY2023 y el 42% en PY2024, así que cualquier apertura por metal o por tipo
sería una muestra sesgada hacia los planes grandes. Se mide y se reporta.
"""

import re

import openpyxl

CACHE = "data/denegaciones-unitedhealth/cache"
MARCAS = {"*", "**", "***", "N/A", "n/a", ""}
ANFITRION = r"unitedhealth|uhc\b|golden rule|all savers|oxford"
ARCHIVOS = {
    2023: (f"{CACHE}/x2025/transparency-in-coverage-puf.xlsx", "Transparency 2025 - Ind QHP"),
    2024: (f"{CACHE}/x2026/Transparency_in_Coverage_PUF.xlsx", "Transparency 2026 - Ind QHP"),
}


def numero(v):
    if v is None:
        return None
    s = str(v).strip()
    if s in MARCAS:
        return None
    try:
        return int(float(s.replace(",", "")))
    except ValueError:
        return None


def entidades(anio):
    """Una fila por entidad del anfitrión: estado, reclamos y denegaciones."""
    path, hoja = ARCHIVOS[anio]
    wb = openpyxl.load_workbook(path, read_only=True, data_only=True)
    it = wb[hoja].iter_rows(values_only=True)
    for f in it:
        if f and any(c == "Issuer_ID" for c in f if c):
            cab = [str(c).strip() if c else "" for c in f]
            break
    out = {}
    for f in it:
        d = dict(zip(cab, f))
        nombre = str(d.get("Issuer_Name") or "")
        if not re.search(ANFITRION, nombre, re.I):
            continue
        iid = str(d.get("Issuer_ID") or "").strip()
        if iid in out:
            continue  # las columnas Issuer_* repiten por plan
        rec = numero(d.get("Issuer_Claims_Received_In_Network"))
        den = numero(d.get("Issuer_Claims_Denied_In_Network"))
        if rec and den is not None and rec > 0:
            out[iid] = {"estado": d.get("State"), "nombre": nombre.strip(),
                        "rec": rec, "den": den, "tasa": den / rec}
    wb.close()
    return out


def main():
    a, b = entidades(2023), entidades(2024)
    comunes = sorted(set(a) & set(b), key=lambda i: -b[i]["rec"])
    solo_b = sorted(set(b) - set(a), key=lambda i: -b[i]["rec"])
    solo_a = sorted(set(a) - set(b), key=lambda i: -a[i]["rec"])

    R_a, D_a = sum(x["rec"] for x in a.values()), sum(x["den"] for x in a.values())
    R_b, D_b = sum(x["rec"] for x in b.values()), sum(x["den"] for x in b.values())
    t_a, t_b = D_a / R_a, D_b / R_b

    print("=" * 76)
    print(f"PY2023: {len(a)} entidades, {R_a:,} reclamos, tasa {100*t_a:.1f}%")
    print(f"PY2024: {len(b)} entidades, {R_b:,} reclamos, tasa {100*t_b:.1f}%")
    print(f"cambio total: {100*(t_b-t_a):+.1f} pp")

    print(f"\n--- LAS {len(comunes)} ENTIDADES QUE ESTÁN EN LOS DOS AÑOS ---")
    print(f"{'est':>4} {'rec 23':>10} {'rec 24':>11} {'tasa 23':>8} {'tasa 24':>8} {'cambio':>8}")
    mejoran = empeoran = 0
    for i in comunes:
        c = 100 * (b[i]["tasa"] - a[i]["tasa"])
        mejoran += c < 0
        empeoran += c >= 0
        print(f"{str(a[i]['estado']):>4} {a[i]['rec']:>10,} {b[i]['rec']:>11,} "
              f"{100*a[i]['tasa']:>7.1f}% {100*b[i]['tasa']:>7.1f}% {c:>+7.1f}")
    print(f"  mejoran: {mejoran}  |  empeoran o iguales: {empeoran}")

    # cohorte a peso constante: mismas entidades, ¿qué pasó?
    Rc_a = sum(a[i]["rec"] for i in comunes)
    Dc_a = sum(a[i]["den"] for i in comunes)
    Rc_b = sum(b[i]["rec"] for i in comunes)
    Dc_b = sum(b[i]["den"] for i in comunes)
    print(f"\n  cohorte sola: {100*Dc_a/Rc_a:.1f}% → {100*Dc_b/Rc_b:.1f}% "
          f"({100*(Dc_b/Rc_b - Dc_a/Rc_a):+.1f} pp)")

    if solo_b:
        Rn = sum(b[i]["rec"] for i in solo_b)
        Dn = sum(b[i]["den"] for i in solo_b)
        print(f"\n--- {len(solo_b)} ENTIDADES NUEVAS EN PY2024 ---")
        for i in solo_b:
            print(f"    {b[i]['estado']}  rec={b[i]['rec']:>9,}  tasa={100*b[i]['tasa']:.1f}%")
        print(f"    juntas: {Rn:,} reclamos ({100*Rn/R_b:.1f}% del total 2024), "
              f"tasa {100*Dn/Rn:.1f}%")
    if solo_a:
        print(f"\n--- {len(solo_a)} ENTIDADES QUE SALIERON ---")
        for i in solo_a:
            print(f"    {a[i]['estado']}  rec={a[i]['rec']:>9,}  tasa={100*a[i]['tasa']:.1f}%")

    # descomposición sobre la cohorte, con pesos de 2023
    print("\n--- DESCOMPOSICIÓN DEL CAMBIO TOTAL ---")
    intra = sum((a[i]["rec"] / Rc_a) * (b[i]["tasa"] - a[i]["tasa"]) for i in comunes)
    comp = sum(((b[i]["rec"] / Rc_b) - (a[i]["rec"] / Rc_a)) * a[i]["tasa"] for i in comunes)
    print(f"  efecto intra (las mismas carteras cambian de tasa): {100*intra:+.1f} pp")
    print(f"  efecto composición (cambia el peso entre ellas):    {100*comp:+.1f} pp")
    resto = (t_b - t_a) - intra - comp
    print(f"  efecto entradas y salidas:                          {100*resto:+.1f} pp")
    print(f"  suma: {100*(intra+comp+resto):+.1f} pp  (total observado {100*(t_b-t_a):+.1f} pp)")
    print("=" * 76)


if __name__ == "__main__":
    main()
