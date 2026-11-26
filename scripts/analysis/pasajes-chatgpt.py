"""pasajes-chatgpt: codifica qué marcas nombra cada asistente en el banco de 36 preguntas.

Entrada: data/pasajes-chatgpt/campo/raw/<asistente>-qNN.json (texto y HTML de cada respuesta,
capturados según data/pasajes-chatgpt/campo/protocolo.md).
Salida: data/pasajes-chatgpt/campo/menciones.csv (una fila por pregunta, asistente y marca) y un
resumen por marca en la consola.

Una marca cuenta como "nombrada" si su nombre aparece en el texto de la respuesta, y como "con
link" si la respuesta trae un link o una cita a uno de sus dominios.
"""

import csv
import json
import re
import sys
from collections import defaultdict
from html import unescape
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[2]
RAW = ROOT / "data/pasajes-chatgpt/campo/raw"
OUT = ROOT / "data/pasajes-chatgpt/campo/menciones.csv"

# nombre canónico: (tipo, patrón en el texto, dominios)
BRANDS = {
    "Despegar": ("OTA", r"despegar|decolar", ["despegar.com", "decolar.com"]),
    "Turismocity": ("metabuscador", r"turismocity", ["turismocity.com"]),
    "Almundo": ("OTA", r"almundo", ["almundo.com"]),
    "Avantrip": ("OTA", r"avantrip", ["avantrip.com"]),
    "Booking": ("OTA", r"booking(\.com)?\b", ["booking.com"]),
    "Expedia": ("OTA", r"expedia", ["expedia.com", "expedia.com.ar"]),
    "Hoteles.com": ("OTA", r"hotel(e)?s\.com", ["hotels.com", "hoteles.com"]),
    "Agoda": ("OTA", r"agoda", ["agoda.com"]),
    "Trip.com": ("OTA", r"trip\.com", ["trip.com"]),
    "eDreams": ("OTA", r"edreams", ["edreams.com"]),
    "Airbnb": ("alquiler", r"airbnb", ["airbnb.com"]),
    "Vrbo": ("alquiler", r"vrbo", ["vrbo.com"]),
    "Hostelworld": ("alquiler", r"hostelworld", ["hostelworld.com"]),
    "Google Flights": ("metabuscador", r"google flights|vuelos de google|google vuelos", ["google.com/travel/flights"]),
    "Google Hotels": ("metabuscador", r"google hotels|hoteles de google|google hoteles", ["google.com/travel/hotels", "google.com/travel/search"]),
    "Skyscanner": ("metabuscador", r"skyscanner", ["skyscanner."]),
    "Kayak": ("metabuscador", r"kayak", ["kayak."]),
    "Trivago": ("metabuscador", r"trivago", ["trivago."]),
    "Momondo": ("metabuscador", r"momondo", ["momondo."]),
    "Hopper": ("metabuscador", r"hopper", ["hopper.com"]),
    "Tripadvisor": ("reseñas", r"tripadvisor", ["tripadvisor."]),
    "Viator": ("actividades", r"viator", ["viator.com"]),
    "GetYourGuide": ("actividades", r"getyourguide|get your guide", ["getyourguide."]),
    "Civitatis": ("actividades", r"civitatis", ["civitatis.com"]),
    "Aerolíneas Argentinas": ("aerolínea", r"aerol[ií]neas argentinas", ["aerolineas.com.ar"]),
    "Flybondi": ("aerolínea", r"flybondi", ["flybondi.com"]),
    "JetSMART": ("aerolínea", r"jet ?smart", ["jetsmart.com"]),
    "LATAM": ("aerolínea", r"\blatam\b", ["latamairlines.com"]),
    "GOL": ("aerolínea", r"\bgol\b", ["voegol.com"]),
    "Azul": ("aerolínea", r"\bazul\b(?! marino)", ["voeazul.com"]),
    "American Airlines": ("aerolínea", r"american airlines", ["aa.com"]),
    "Copa": ("aerolínea", r"\bcopa airlines|\bcopa\b", ["copaair.com"]),
    "Iberia": ("aerolínea", r"iberia", ["iberia.com"]),
    "Assist Card": ("seguro", r"assist ?card", ["assistcard.com"]),
    "Universal Assistance": ("seguro", r"universal assistance", ["universal-assistance.com"]),
    "Rentalcars": ("autos", r"rentalcars", ["rentalcars.com"]),
    "Mercado Libre": ("otro", r"mercado ?libre", ["mercadolibre."]),
}

FOOTERS = {
    "chatgpt": ["ChatGPT es IA", "ChatGPT puede cometer errores"],
    "gemini": ["Inicia sesión para hacer cosas", "Gemini es una IA"],
}
# fin de la respuesta como patrón, cuando no hay un texto fijo ("10 fuentes" en Perplexity,
# antes de las preguntas sugeridas, que también nombran marcas)
FOOTER_RE = {"perplexity": r"\n\d+ fuentes?\n"}
# marca de inicio de la respuesta, cuando la interfaz repite la pregunta (Perplexity la repite
# también en la lista de sesiones de la barra lateral)
STARTS = {"gemini": "Gemini ha dicho", "perplexity": "Finalizado"}


def answer_text(d):
    t = d["text"]
    q = d.get("question") or ""
    mark = STARTS.get(d["assistant"])
    if d["assistant"] == "perplexity" and mark in t:
        start = t.find(mark) + len(mark)
    else:
        start = t.find(q) + len(q) if q and q in t else 0
        if mark and mark in t[start:]:
            start = t.find(mark, start) + len(mark)
    end = len(t)
    for f in FOOTERS.get(d["assistant"], []):
        i = t.find(f, start)
        if i > 0:
            end = min(end, i)
    pat = FOOTER_RE.get(d["assistant"])
    if pat:
        m = re.compile(pat).search(t, start)
        if m:
            end = min(end, m.start())
    return t[start:end]


def linked_domains(d):
    h = d.get("html") or ""
    urls = [unescape(u) for u in re.findall(r'href="(https?://[^"]+)"', h)]
    urls += [unescape(u) for u in re.findall(r"favicons\?domain=(https?://[^&\"]+)", h)]
    out = []
    for u in urls:
        host = urlparse(u).netloc.lower()
        if not host or any(x in host for x in ("chatgpt.com", "openai.com", "oaistatic", "gstatic", "gemini.google", "accounts.google", "policies.google", "support.google", "perplexity.ai")):
            continue
        out.append(host + urlparse(u).path)
    return out


def main():
    rows = []
    files = sorted(f for f in RAW.glob("*-q*.json") if not f.name.startswith("compra_"))
    for f in files:
        d = json.load(open(f))
        text = answer_text(d)
        low = text.lower()
        links = linked_domains(d)
        found = []
        for name, (kind, pat, doms) in BRANDS.items():
            m = re.search(pat, low)
            linked = any(any(dm in l for dm in doms) for l in links)
            if m or linked:
                found.append((m.start() if m else 10**6, name, kind, bool(m), linked))
        found.sort()
        for order, (_, name, kind, named, linked) in enumerate(found, 1):
            rows.append({
                "asistente": d["assistant"], "pregunta": d["q"],
                "categoria": "V" if d["q"] <= 12 else "A" if d["q"] <= 24 else "P",
                "marca": name, "tipo": kind, "nombrada": int(named), "con_link": int(linked),
                "orden": order, "capturado": d.get("captured_at", ""),
            })
        if not found:
            rows.append({"asistente": d["assistant"], "pregunta": d["q"],
                         "categoria": "V" if d["q"] <= 12 else "A" if d["q"] <= 24 else "P",
                         "marca": "(ninguna)", "tipo": "", "nombrada": 0, "con_link": 0,
                         "orden": 0, "capturado": d.get("captured_at", "")})
    with open(OUT, "w", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=list(rows[0].keys()))
        w.writeheader()
        w.writerows(rows)

    # resumen: share de respuestas que nombran a cada marca, por asistente
    answers = defaultdict(set)
    named = defaultdict(lambda: defaultdict(set))
    linked = defaultdict(lambda: defaultdict(set))
    first = defaultdict(lambda: defaultdict(int))
    for r in rows:
        a = r["asistente"]
        answers[a].add(r["pregunta"])
        if r["nombrada"] or r["con_link"]:
            named[a][r["marca"]].add(r["pregunta"])
        if r["con_link"]:
            linked[a][r["marca"]].add(r["pregunta"])
        if r["orden"] == 1:
            first[a][r["marca"]] += 1
    for a in sorted(answers):
        n = len(answers[a])
        print(f"\n== {a}: {n} respuestas ==")
        # "nombrada o link": cuenta la respuesta si la marca está en el texto o sólo enlazada. Para la hoja
        # se usa la columna `nombrada` de menciones.csv (texto), que puede dar menos.
        print(f"{'marca':24} {'nombrada o link':>15} {'con link':>9} {'primera':>8}")
        for m, qs in sorted(named[a].items(), key=lambda kv: -len(kv[1]))[:20]:
            print(f"{m:24} {len(qs):>10} ({len(qs)/n:4.0%}) {len(linked[a][m]):>4} {first[a][m]:>8}")


if __name__ == "__main__":
    sys.exit(main())
