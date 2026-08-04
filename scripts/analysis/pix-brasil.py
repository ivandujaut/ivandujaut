"""Cálculos propios del caso pix-brasil sobre datos abiertos del BCB.

Reproduce las anclas cuantitativas de la tesis (regla 2.6 del flujo): qué mató
PIX (DOC, TED minorista, cheque, efectivo, débito), qué explotó (prepago,
crédito, el propio PIX), el crossover P2P→P2B, y el peso de las billeteras en
las claves. El auditor corre este script y compara contra la hoja de hechos.

Datos de entrada (no viajan en el repo; este script los descarga si faltan):
  data/pix-brasil/bcb-meios-trimestral.json
    Estadísticas de medios de pago, serie trimestral, BCB Olinda:
    https://olinda.bcb.gov.br/olinda/servico/MPV_DadosAbertos/versao/v1/odata/MeiosdePagamentosTrimestralDA(trimestre=@trimestre)?@trimestre=''&$format=json
  data/pix-brasil/bcb-meios-mensal.json
    Serie mensual (para el corte jun-2026 TED vs PIX):
    misma API, recurso MeiosdePagamentosMensalDA
  data/pix-brasil/bcb-chaves-{fecha}.json
    Claves PIX por participante (DICT):
    .../Pix_DadosAbertos/versao/v1/odata/ChavesPix(Data=@Data)?@Data='YYYY-MM-DD'
  data/pix-brasil/bcb-usuarios-dict.json
    Usuarios registrados en el DICT:
    .../Pix_DadosAbertos/versao/v1/odata/PixUsuariosCadastradosDICT

Unidades de la fuente: cantidades en MILES de transacciones; valores en
MILLONES de reales. Portal: https://dadosabertos.bcb.gov.br

Correr desde la raíz del repo:  python3 scripts/analysis/pix-brasil.py
"""

import json
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / "data" / "pix-brasil"
DATA.mkdir(parents=True, exist_ok=True)

BASE_MPV = "https://olinda.bcb.gov.br/olinda/servico/MPV_DadosAbertos/versao/v1/odata"
BASE_PIX = "https://olinda.bcb.gov.br/olinda/servico/Pix_DadosAbertos/versao/v1/odata"


def fetch(url: str, dest: Path, timeout: int = 600) -> dict:
    if not dest.exists():
        print(f"  descargando {dest.name}...")
        req = urllib.request.Request(url, headers={"Accept": "application/json"})
        with urllib.request.urlopen(req, timeout=timeout) as r:
            dest.write_bytes(r.read())
    return json.loads(dest.read_text())


def anno(fecha: str) -> int:
    return int(fecha[:4])


def trimestral() -> None:
    d = fetch(
        f"{BASE_MPV}/MeiosdePagamentosTrimestralDA(trimestre=@trimestre)?@trimestre=''&$format=json",
        DATA / "bcb-meios-trimestral.json",
    )["value"]
    years: dict[int, dict[str, float]] = {}
    for row in d:
        y = anno(row["datatrimestre"])
        acc = years.setdefault(y, {})
        for k, v in row.items():
            if k != "datatrimestre":
                acc[k] = acc.get(k, 0.0) + (v or 0.0)

    print("== Serie trimestral BCB, totales anuales (cantidades en miles) ==")
    cols = [
        ("PIX", "quantidadePix", "valorPix"),
        ("TED", "quantidadeTED", "valorTED"),
        ("DOC", "quantidadeDOC", "valorDOC"),
        ("Cheque", "quantidadeCheque", "valorCheque"),
        ("Boleto", "quantidadeBoleto", "valorBoleto"),
        ("Débito", "quantidadeCartaoDebito", "valorCartaoDebito"),
        ("Crédito", "quantidadeCartaoCredito", "valorCartaoCredito"),
        ("Prepago", "quantidadeCartaoPrePago", "valorCartaoPrePago"),
        ("Saques", "quantidadeSaques", "valorSaques"),
    ]
    for y in (2020, 2022, 2024, 2025):
        if y not in years:
            continue
        print(f"\n  {y}:")
        for label, qk, vk in cols:
            print(f"    {label:8} {years[y][qk]:>16,.2f}  (R$ {years[y][vk]:>15,.2f} M)")

    y20, y24, y25 = years[2020], years[2024], years[2025]
    print("\n== Anclas de la tesis ==")
    print(f"  DOC 2020 -> 2025:      {y20['quantidadeDOC']:,.2f} -> {y25['quantidadeDOC']:,.2f} miles")
    print(f"  TED cantidad 20->25:   {y20['quantidadeTED']:,.2f} -> {y25['quantidadeTED']:,.2f}  ({(y25['quantidadeTED']/y20['quantidadeTED']-1)*100:+.0f}%)")
    print(f"  TED valor 20->25:      R$ {y20['valorTED']:,.2f} -> {y25['valorTED']:,.2f} M  ({(y25['valorTED']/y20['valorTED']-1)*100:+.0f}%)")
    print(f"  Débito 24 -> 25:       {y24['quantidadeCartaoDebito']:,.2f} -> {y25['quantidadeCartaoDebito']:,.2f}  (primera caída anual: {y25['quantidadeCartaoDebito'] < y24['quantidadeCartaoDebito']})")
    print(f"  Prepago 2020 -> 2025:  {y20['quantidadeCartaoPrePago']:,.2f} -> {y25['quantidadeCartaoPrePago']:,.2f}  ({y25['quantidadeCartaoPrePago']/y20['quantidadeCartaoPrePago']:.1f}x)")
    print(f"  Crédito 2020 -> 2025:  {y20['quantidadeCartaoCredito']:,.2f} -> {y25['quantidadeCartaoCredito']:,.2f}  ({y25['quantidadeCartaoCredito']/y20['quantidadeCartaoCredito']:.1f}x)")
    print(f"  Saques 2020 -> 2025:   {y20['quantidadeSaques']:,.2f} -> {y25['quantidadeSaques']:,.2f}  ({(y25['quantidadeSaques']/y20['quantidadeSaques']-1)*100:+.0f}%)")
    print(f"  PIX 2020 -> 2025:      {y20['quantidadePix']:,.2f} -> {y25['quantidadePix']:,.2f} miles  (R$ {y25['valorPix']:,.2f} M en 2025)")
    print(f"  Boleto 2020 -> 2025:   {y20['quantidadeBoleto']:,.2f} -> {y25['quantidadeBoleto']:,.2f}  (no murió; valor R$ {y25['valorBoleto']:,.2f} M)")


def mensual_jun2026() -> None:
    d = fetch(
        f"{BASE_MPV}/MeiosdePagamentosMensalDA(AnoMes=@AnoMes)?@AnoMes='202606'&$format=json",
        DATA / "bcb-meios-mensal-202606.json",
    )["value"]
    row = next(r for r in d if r["AnoMes"] == "202606")
    print("\n== Corte jun-2026 (serie mensual) ==")
    print(f"  TED:  {row['quantidadeTED']:,.2f} miles tx, R$ {row['valorTED']:,.2f} M")
    print(f"  PIX:  {row['quantidadePix']:,.2f} miles tx, R$ {row['valorPix']:,.2f} M")
    print(f"  TED mueve más plata que PIX: {row['valorTED'] > row['valorPix']}; PIX hace {row['quantidadePix']/row['quantidadeTED']:.0f}x las transacciones")


def chaves() -> None:
    # El recurso devuelve el histórico completo (una fila por participante ×
    # naturaleza PF/PJ × tipo de clave, para cada fin de mes desde dic-2021).
    # Se baja una vez entero y se filtra localmente por fecha; el stock de un
    # participante es la SUMA de sus filas de esa fecha.
    # El parámetro @Data marca DESDE qué fecha devuelve el recurso: se pide
    # desde la fecha más vieja que interesa y el $top alto trae el resto.
    d = fetch(
        f"{BASE_PIX}/ChavesPix(Data=@Data)?@Data='2021-12-31'&$format=json&$top=500000",
        DATA / "bcb-chaves-historico.json",
    )["value"]
    print("\n== Claves PIX por participante (DICT) ==")
    for fecha in ("2021-12-31", "2026-07-31"):
        rows = [r for r in d if r.get("Data") == fecha]
        total = sum(r.get("qtdChaves") or 0 for r in rows)
        por_participante: dict[str, int] = {}
        for r in rows:
            por_participante[r["Nome"]] = por_participante.get(r["Nome"], 0) + (r.get("qtdChaves") or 0)
        top = sorted(por_participante.items(), key=lambda x: -x[1])[:6]
        print(f"  {fecha}: total {total:,.0f} claves, {len(por_participante)} participantes. Top:")
        mostrados = {n for n, _ in top}
        for nome, q in top:
            print(f"    {nome[:44]:46} {q:>13,.0f}  ({q/total*100:.1f}%)")
        for target in ("MERCADO PAGO", "PICPAY"):
            extra = [(n, q) for n, q in por_participante.items() if target in n.upper() and n not in mostrados]
            for nome, q in sorted(extra, key=lambda x: -x[1])[:1]:
                print(f"    {nome[:44]:46} {q:>13,.0f}  ({q/total*100:.1f}%)")


def usuarios_dict() -> None:
    d = fetch(
        f"{BASE_PIX}/PixUsuariosCadastradosDICT?$format=json&$top=10000",
        DATA / "bcb-usuarios-dict.json",
    )["value"]
    if not d:
        print("\n== Usuarios DICT: recurso vacío ==")
        return
    print("\n== Usuarios registrados en el DICT ==")
    print(f"  campos: {list(d[0].keys())}")
    print(f"  primera fila: {d[0]}")
    print(f"  última fila:  {d[-1]}")


def crossover_p2b() -> None:
    # Dataset granular de transacciones PIX (69 meses, dimensiones completas).
    # OJO con la API: ignora $apply y $top ausente devuelve TODO (~180MB, por
    # eso el caché importa). NATUREZA trae P2P/P2B/B2P/etc. ya clasificado.
    d = fetch(
        f"{BASE_PIX}/EstatisticasTransacoesPix(Database=@Database)?@Database=''&$format=json",
        DATA / "bcb-pix-transacoes-granular.json",
    )["value"]
    por_mes: dict[int, dict[str, int]] = {}
    for r in d:
        acc = por_mes.setdefault(r["AnoMes"], {})
        acc[r["NATUREZA"]] = acc.get(r["NATUREZA"], 0) + r["QUANTIDADE"]

    print("\n== Crossover P2P -> P2B (share de transacciones por natureza) ==")
    for mes in (202012, 202512):
        tot = sum(por_mes[mes].values())
        p2p, p2b = por_mes[mes].get("P2P", 0), por_mes[mes].get("P2B", 0)
        print(f"  {mes}: P2P {p2p/tot*100:.1f}%  P2B {p2b/tot*100:.1f}%  (P2B {p2b:,} tx)")

    cruce = next(
        (m for m in sorted(por_mes) if por_mes[m].get("P2B", 0) > por_mes[m].get("P2P", 0)),
        None,
    )
    print(f"  Primer mes con P2B > P2P: {cruce}")


if __name__ == "__main__":
    trimestral()
    mensual_jun2026()
    chaves()
    usuarios_dict()
    crossover_p2b()
