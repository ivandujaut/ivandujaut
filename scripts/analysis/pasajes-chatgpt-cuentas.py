"""pasajes-chatgpt: las cuentas propias sobre datos que publica la empresa.

Reproduce los cálculos C6, H1, H2, H3 y H4 de la hoja de hechos del caso, y las restas que usa el texto:

- ingreso neto por pedido y take rate, sobre las planillas KPI de Prosus (FY2026, junio de 2026, y
  H1 FY27, noviembre de 2026), hoja LatAm, bloque "Despegar";
- parte de clientes nuevos y de recurrentes, sobre el gráfico de clientes B2C de la presentación de
  Prosus del 23-sep-2026 (p. 9; los valores se leen de la imagen, no hay planilla);
- variación de SOFIA en un año, sobre `data/pasajes-chatgpt/sofia_serie.csv`;
- diferencia de precio en la tabla de reserva de Google Flights (relevamiento propio, C2c);
- H1 (compras para recuperar el costo de adquisición) y H2 (conversión de equilibrio de un clic
  pago), que son hipótesis: techo, rangos y fórmula a la vista.

Planillas: https://www.prosus.com/~/media/Files/P/prosus-corp-v2/results-reports-and-events-archive/
annual-report/2026/fy2026-kpi-datasheet.xlsx y .../latest-results/hy2027/hy2027-kpi-datasheet.xlsx,
guardadas en `data/pasajes-chatgpt/fuentes/`.

Correr desde la raíz del repo:  python3 scripts/analysis/pasajes-chatgpt-cuentas.py
"""

import csv
from pathlib import Path

import openpyxl

RAIZ = Path(__file__).resolve().parents[2]
FUENTES = RAIZ / "data" / "pasajes-chatgpt" / "fuentes"


def bloque_despegar(ruta: Path, periodo: str) -> dict[str, float]:
    """Lee las filas del bloque Despegar de la hoja LatAm para un período ('FY26', 'H1 FY27')."""
    hoja = openpyxl.load_workbook(ruta, data_only=True)["LatAm"]
    col = next(c.column for c in hoja[3] if c.value == periodo)
    inicio = next(r for r in range(1, hoja.max_row + 1)
                  if str(hoja.cell(r, 4).value or "").startswith("Despegar"))
    datos = {}
    for r in range(inicio + 1, inicio + 16):
        nombre = str(hoja.cell(r, 4).value or "").rstrip("0123456789⁰¹²³⁴⁵⁶⁷⁸⁹,").strip()
        if nombre and nombre not in datos:
            datos[nombre] = hoja.cell(r, col).value
    return datos


fy26_junio = bloque_despegar(FUENTES / "prosus-fy2026-kpi-datasheet.xlsx", "FY26")
fy26_reexp = bloque_despegar(FUENTES / "prosus-hy2027-kpi-datasheet.xlsx", "FY26")
h1fy27 = bloque_despegar(FUENTES / "prosus-hy2027-kpi-datasheet.xlsx", "H1 FY27")

print("== Planillas de Prosus, bloque Despegar (USD M; pedidos en miles)")
for nombre, d in [("FY26, planilla de junio", fy26_junio), ("FY26 reexpresado", fy26_reexp),
                  ("H1 FY27", h1fy27)]:
    print(f"  {nombre}: pedidos {d['Orders']}, gross bookings {d['Gross Bookings']}, "
          f"revenue {d['Revenue']}")

# Ajuste por hiperinflación: la nota 6 de la planilla de junio da el revenue sin ajuste (USD 777 M).
REVENUE_FY26_SIN_AJUSTE = 777

print("\n== C6. Ingreso neto por pedido (USD)")
rpp_viejo = REVENUE_FY26_SIN_AJUSTE / (fy26_junio["Orders"] / 1000)
rpp_viejo_aj = fy26_junio["Revenue"] / (fy26_junio["Orders"] / 1000)
rpp_reexp = fy26_reexp["Revenue"] / (fy26_reexp["Orders"] / 1000)
rpp_h1 = h1fy27["Revenue"] / (h1fy27["Orders"] / 1000)
print(f"  FY26 con pedidos de junio: {rpp_viejo_aj:.1f} ({rpp_viejo:.1f} sin el ajuste por hiperinflación)")
print(f"  FY26 con pedidos reexpresados: {rpp_reexp:.1f}")
print(f"  H1 FY27: {rpp_h1:.1f}")
RPP_MIN, RPP_MAX = rpp_viejo, rpp_h1
print(f"  Rango que usa el caso: USD {RPP_MIN:.1f} a {RPP_MAX:.1f}")

print("\n== C6. Take rate (revenue / gross bookings)")
print(f"  FY26, planilla de junio: {fy26_junio['Revenue'] / fy26_junio['Gross Bookings']:.1%}")
print(f"  H1 FY27: {h1fy27['Revenue'] / h1fy27['Gross Bookings']:.1%}")

print("\n== C6. Clientes B2C de julio (miles), leídos de la p. 9 de la presentación del 23-sep-2026")
CLIENTES = {"jul-24": (474, 174), "jul-25": (539, 192), "jul-26": (741, 271)}  # (total, nuevos)
for mes, (total, nuevos) in CLIENTES.items():
    print(f"  {mes}: nuevos {nuevos}/{total} = {nuevos / total:.1%}; "
          f"repiten {total - nuevos}/{total} = {(total - nuevos) / total:.1%}")

print("\n== P11 + P20. SOFIA en las reservas B2C, variación en un año")
with (RAIZ / "data" / "pasajes-chatgpt" / "sofia_serie.csv").open(encoding="utf-8") as f:
    serie = {r["mes"]: float(r["pct_gb_sofia_gmv_b2c"]) for r in csv.DictReader(f)}
print(f"  sep-25 {serie['2025-09']}% a sep-26 {serie['2026-09']}%: "
      f"{serie['2026-09'] - serie['2025-09']:+.1f} puntos porcentuales")

print("\n== C2c. Tabla de reserva de Google Flights (ARS, relevamiento propio del 25-nov-2026)")
LATAM_SEPARADOS, DESPEGAR = 753_488, 755_998
dif = DESPEGAR - LATAM_SEPARADOS
print(f"  Despegar {DESPEGAR} contra LATAM en boletos separados {LATAM_SEPARADOS}: "
      f"{dif} pesos más ({dif / LATAM_SEPARADOS:.2%})")

print("\n== H1 (hipótesis). Compras para recuperar el costo de adquisición, en ingreso")
# Despegar, 20-F 2024: gasto en ventas y marketing USD 250,7 M; 4,8 M de clientes, 48,6% sin compra
# previa. Es un techo: ese gasto también paga marca y retención.
SM_2024, CLIENTES_2024_M, SIN_COMPRA_PREVIA = 250.7, 4.8, 0.486
nuevos_2024 = CLIENTES_2024_M * SIN_COMPRA_PREVIA
cac = SM_2024 / nuevos_2024
print(f"  techo del costo por cliente nuevo 2024 = {SM_2024} / ({CLIENTES_2024_M} × {SIN_COMPRA_PREVIA}) "
      f"= {SM_2024} / {nuevos_2024:.2f} = USD {cac:.1f}")
print(f"  compras = costo / ingreso por pedido: {cac:.1f} / {RPP_MAX:.1f} = {cac / RPP_MAX:.2f} "
      f"a {cac:.1f} / {RPP_MIN:.1f} = {cac / RPP_MIN:.2f}")

print("\n== H2 (hipótesis). Conversión de equilibrio de un clic pago en ChatGPT, en ingreso")
CPC_MIN, CPC_MAX = 3, 5  # puja máxima inicial sugerida por OpenAI (Forbes Argentina, 22-oct-2026)
print(f"  conversión = costo por clic / ingreso por pedido: {CPC_MIN} / {RPP_MAX:.1f} = "
      f"{CPC_MIN / RPP_MAX:.1%} a {CPC_MAX} / {RPP_MIN:.1f} = {CPC_MAX / RPP_MIN:.1%}")

print("\n== H3 (hipótesis). Cuánto vale un punto de recompra a 12 meses, en ingreso")
# Base: clientes nuevos de un año (2024, 20-F: 4,8 M × 48,6%). Cuenta una sola compra extra por cada
# cliente que vuelve, al ingreso neto por pedido de las planillas de Prosus. Mezcla años y deja afuera
# las compras siguientes: es un orden de magnitud, no un pronóstico.
compras_extra = nuevos_2024 * 1e6 * 0.01
print(f"  1 punto de recompra = {nuevos_2024:.2f} M × 1% = {compras_extra:,.0f} compras más")
print(f"  ingreso = {compras_extra:,.0f} × USD {RPP_MIN:.1f} a {RPP_MAX:.1f} = "
      f"USD {compras_extra * RPP_MIN / 1e6:.2f} a {compras_extra * RPP_MAX / 1e6:.2f} M por año")

print("\n== H4 (retirada de los textos). Cuánto vale 1% más de pedidos, en ingreso")
# Con ingreso por pedido promedio, 1% más de pedidos es el 1% del revenue. No se multiplica 12.116 mil
# pedidos (con Koin, P19) por el revenue por pedido sin Koin (C6): esa mezcla daba una cota alta que no cierra.
PEDIDOS_FY26, REV_FY26_MIN, REV_FY26_MAX = 12_116_000, 777, 804  # USD M, sin y con ajuste por hiperinflación
print(f"  1% más de pedidos = {PEDIDOS_FY26 * 0.01:,.0f} pedidos = 1% del revenue: "
      f"USD {REV_FY26_MIN * 0.01:.2f} a {REV_FY26_MAX * 0.01:.2f} M por año")
