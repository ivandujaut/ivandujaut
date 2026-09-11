#!/usr/bin/env python3
"""Lectura de growth del portfolio desde PostHog: adquisición, lectura y conversión.

Corre consultas HogQL contra el proyecto y las imprime en Markdown, pensadas
para contestar dos preguntas: de dónde llega la gente y qué la retiene dentro
del sitio. Es solo lectura.

Necesita `POSTHOG_PERSONAL_API_KEY` (phx_...) con scope `query:read`. Se lee
del entorno o de `.env.local`.

    python3 scripts/analysis/posthog-growth-readout.py              # últimos 30 días
    python3 scripts/analysis/posthog-growth-readout.py --days 90
    python3 scripts/analysis/posthog-growth-readout.py --guardar    # además escribe data/metricas/
    python3 scripts/analysis/posthog-growth-readout.py --hogql "select count() from events"

Convenciones que comparte con el resto del repo:

- Filtra `$host = ivandujaut.com`: el proyecto también recibe eventos de otro
  sitio (ver `.claude/posthog-dashboard.md`).
- Excluye los agentes que no son lectores (`Claude/`, `Shap-User`), igual que
  `lib/analytics.ts` y `posthog-test-account-filters.py`. El filtro de origen
  corta hacia adelante; éste limpia lo que ya quedó registrado.
- "Lectura" es la definición del `ReadTracker`: 75% recorrido más piso de tiempo
  con la pestaña visible. No es un pageview.

Limitación que hay que tener presente al hablar de retención: la persistencia de
PostHog es `sessionStorage` (sin cookies), así que cada visita es una persona
nueva. La retención entre visitas no se puede medir con estos datos; lo que sí
se mide es la retención DENTRO de la visita (páginas por sesión, segunda pieza
terminada, profundidad).
"""

import argparse
import datetime as dt
import json
import os
import pathlib
import sys
import urllib.error
import urllib.request

PROYECTO = "351723"
URL_QUERY = f"https://us.posthog.com/api/projects/{PROYECTO}/query/"
RAIZ = pathlib.Path(__file__).resolve().parents[2]

# Filtro común a todas las consultas. Se interpola como texto porque HogQL no
# acepta parámetros en esta ruta y ninguno de estos valores viene del usuario.
FILTRO = (
    "properties.$host = 'ivandujaut.com' "
    "AND NOT (properties.$raw_user_agent ILIKE '%Claude/%' "
    "OR properties.$raw_user_agent ILIKE '%Shap-User%')"
)


def cargar_env_local():
    """Toma la clave de `.env.local` si no está en el entorno. No pisa nada."""
    archivo = RAIZ / ".env.local"
    if not archivo.exists():
        return
    for linea in archivo.read_text().splitlines():
        linea = linea.strip()
        if not linea or linea.startswith("#") or "=" not in linea:
            continue
        k, v = linea.split("=", 1)
        os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))


def consultar(hogql):
    clave = os.environ.get("POSTHOG_PERSONAL_API_KEY")
    if not clave:
        sys.exit(
            "Falta POSTHOG_PERSONAL_API_KEY.\n"
            "Creala en https://us.posthog.com/settings/user-api-keys con scope "
            "`query:read` y agregala a .env.local como\n"
            "  POSTHOG_PERSONAL_API_KEY=phx_..."
        )
    cuerpo = json.dumps({"query": {"kind": "HogQLQuery", "query": hogql}}).encode()
    req = urllib.request.Request(
        URL_QUERY,
        method="POST",
        data=cuerpo,
        headers={"Authorization": f"Bearer {clave}", "Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            datos = json.load(r)
    except urllib.error.HTTPError as e:
        detalle = e.read().decode()
        if e.code == 403:
            sys.exit(f"HTTP 403: a la key le falta el scope `query:read`.\n{detalle}")
        sys.exit(f"HTTP {e.code} en la consulta:\n{hogql}\n\n{detalle}")
    return datos.get("columns", []), datos.get("results", [])


def tabla(columnas, filas, fmt=None):
    """Markdown. `fmt` mapea columna -> función de formato."""
    fmt = fmt or {}
    if not filas:
        return "_(sin datos en el período)_\n"

    def celda(c, v):
        if v is None:
            return "—"
        if c in fmt:
            return fmt[c](v)
        if isinstance(v, float):
            return f"{v:.1f}"
        return str(v)

    out = ["| " + " | ".join(columnas) + " |", "|" + "---|" * len(columnas)]
    for f in filas:
        out.append("| " + " | ".join(celda(c, v) for c, v in zip(columnas, f)) + " |")
    return "\n".join(out) + "\n"


def pct(v):
    return f"{v * 100:.0f}%" if v is not None else "—"


# --------------------------------------------------------------------------
# Consultas. Cada una devuelve (título, explicación, columnas, filas, fmt).
# --------------------------------------------------------------------------


def q_resumen(dias):
    hoy, prev = f"now() - INTERVAL {dias} DAY", f"now() - INTERVAL {dias * 2} DAY"

    def bloque(desde, hasta):
        return f"""
        SELECT
          countIf(event = '$pageview') AS pageviews,
          uniqIf(properties.$session_id, event = '$pageview') AS sesiones,
          uniqIf(properties.$session_id, event = 'content_viewed') AS ses_con_pieza,
          uniqIf(properties.$session_id, event = 'content_read') AS ses_con_lectura,
          countIf(event = 'content_read') AS lecturas,
          countIf(event = 'content_continued') AS segundas_piezas,
          countIf(event = 'proof_click') AS pruebas,
          countIf(event = 'contact_click') AS contactos
        FROM events
        WHERE {FILTRO} AND timestamp >= {desde} AND timestamp < {hasta}
        """

    cols, act = consultar(bloque(hoy, "now()"))
    _, ant = consultar(bloque(prev, hoy))
    filas = []
    for i, c in enumerate(cols):
        a, b = act[0][i], ant[0][i]
        delta = None if not b else (a - b) / b
        filas.append([c, a, b, delta])
    return (
        f"Resumen: últimos {dias} días vs los {dias} anteriores",
        "Sesiones = visitas con al menos un pageview. Con persistencia en "
        "`sessionStorage`, personas y sesiones son casi lo mismo: no hay "
        "retención entre visitas medible acá.",
        ["métrica", "actual", "anterior", "Δ"],
        filas,
        {"Δ": lambda v: ("+" if v >= 0 else "") + f"{v * 100:.0f}%"},
    )


def q_semanas(dias):
    cols, filas = consultar(f"""
      SELECT
        toStartOfWeek(timestamp) AS semana,
        uniqIf(properties.$session_id, event = '$pageview') AS sesiones,
        countIf(event = '$pageview') AS pageviews,
        countIf(event = 'content_viewed') AS piezas_abiertas,
        countIf(event = 'content_read') AS lecturas,
        countIf(event = 'proof_click') AS pruebas,
        countIf(event = 'contact_click') AS contactos
      FROM events
      WHERE {FILTRO} AND timestamp >= now() - INTERVAL {dias} DAY
      GROUP BY semana ORDER BY semana
    """)
    return (
        "Tendencia semanal",
        "La semana arranca el lunes. Sirve para ver si un post o una campaña movió algo.",
        cols,
        filas,
        {"semana": lambda v: str(v)[:10]},
    )


def _sesiones_cte(dias):
    """Una fila por sesión con su entrada: fuente, página de aterrizaje, y qué hizo."""
    return f"""
      WITH ses AS (
        SELECT
          properties.$session_id AS sid,
          argMinIf(properties.$referring_domain, timestamp, event = '$pageview') AS ref,
          argMinIf(properties.utm_source, timestamp, event = '$pageview') AS utm_source,
          argMinIf(properties.utm_medium, timestamp, event = '$pageview') AS utm_medium,
          argMinIf(properties.utm_content, timestamp, event = '$pageview') AS utm_content,
          argMinIf(properties.$pathname, timestamp, event = '$pageview') AS landing,
          argMinIf(properties.$device_type, timestamp, event = '$pageview') AS device,
          argMinIf(properties.$geoip_country_code, timestamp, event = '$pageview') AS pais,
          countIf(event = '$pageview') AS pv,
          countIf(event = 'content_viewed') AS piezas,
          countIf(event = 'content_read') > 0 AS leyo,
          countIf(event = 'proof_click') > 0 AS prueba,
          countIf(event = 'contact_click') > 0 AS contacto,
          dateDiff('second', min(timestamp), max(timestamp)) AS segundos
        FROM events
        WHERE {FILTRO} AND timestamp >= now() - INTERVAL {dias} DAY
          AND properties.$session_id IS NOT NULL
        GROUP BY sid
        HAVING pv > 0
      )
    """


def q_canales(dias):
    cols, filas = consultar(_sesiones_cte(dias) + """
      SELECT
        coalesce(nullIf(utm_source, ''), nullIf(ref, '$direct'), nullIf(ref, ''), 'directo') AS canal,
        coalesce(nullIf(utm_medium, ''), '—') AS medio,
        count() AS sesiones,
        round(avg(pv), 1) AS pv_por_sesion,
        round(countIf(pv >= 2) / count(), 2) AS tasa_2_paginas,
        round(countIf(leyo) / count(), 2) AS tasa_lectura,
        countIf(prueba) AS pruebas,
        countIf(contacto) AS contactos,
        round(median(segundos)) AS mediana_seg
      FROM ses
      GROUP BY canal, medio
      ORDER BY sesiones DESC
      LIMIT 25
    """)
    return (
        "Adquisición: de dónde llegan las sesiones y qué calidad tienen",
        "Canal = `utm_source` si hay, si no el dominio de referencia, si no directo. "
        "La columna que decide dónde invertir no es `sesiones` sino `tasa_lectura`: "
        "un canal que trae cien visitas que no leen vale menos que uno de diez que sí.",
        cols,
        filas,
        {"tasa_2_paginas": pct, "tasa_lectura": pct},
    )


def q_utm_content(dias):
    cols, filas = consultar(_sesiones_cte(dias) + """
      SELECT
        utm_source AS fuente,
        utm_content AS contenido,
        count() AS sesiones,
        round(countIf(leyo) / count(), 2) AS tasa_lectura,
        countIf(contacto) AS contactos
      FROM ses
      WHERE utm_content IS NOT NULL AND utm_content != ''
      GROUP BY fuente, contenido
      ORDER BY sesiones DESC
      LIMIT 25
    """)
    return (
        "Campañas: `utm_content` por pieza publicada",
        "Qué post o video concreto trajo gente. Vacío si no hubo tráfico con UTM.",
        cols,
        filas,
        {"tasa_lectura": pct},
    )


def q_landing(dias):
    cols, filas = consultar(_sesiones_cte(dias) + """
      SELECT
        landing,
        count() AS sesiones,
        round(countIf(pv = 1) / count(), 2) AS rebote,
        round(countIf(leyo) / count(), 2) AS tasa_lectura,
        countIf(contacto) AS contactos
      FROM ses
      GROUP BY landing
      ORDER BY sesiones DESC
      LIMIT 25
    """)
    return (
        "Páginas de aterrizaje",
        "`rebote` = sesiones de una sola página. Una landing con mucho tráfico y rebote "
        "alto es el primer lugar donde tocar copy o enlaces.",
        cols,
        filas,
        {"rebote": pct, "tasa_lectura": pct},
    )


def q_piezas(dias):
    cols, filas = consultar(f"""
      SELECT
        properties.kind AS tipo,
        properties.locale AS idioma,
        properties.slug AS slug,
        uniqIf(properties.$session_id, event = 'content_viewed') AS abiertas,
        uniqIf(properties.$session_id, event = 'content_abstract_passed') AS pasan_abstract,
        uniqIf(properties.$session_id, event = 'content_progress' AND toFloat(properties.depth) >= 50) AS llegan_50,
        uniqIf(properties.$session_id, event = 'content_read') AS lecturas,
        round(uniqIf(properties.$session_id, event = 'content_read')
              / uniqIf(properties.$session_id, event = 'content_viewed'), 2) AS tasa_lectura,
        round(medianIf(toFloat(properties.depth_max), event = 'content_exit')) AS salida_mediana_pct,
        round(medianIf(toFloat(properties.seconds_visible), event = 'content_exit')) AS salida_mediana_seg,
        uniqIf(properties.$session_id, event = 'proof_click') AS pruebas
      FROM events
      WHERE {FILTRO} AND timestamp >= now() - INTERVAL {dias} DAY
        AND event IN ('content_viewed','content_abstract_passed','content_progress',
                      'content_read','content_exit','proof_click')
        AND properties.slug IS NOT NULL
      GROUP BY tipo, idioma, slug
      ORDER BY abiertas DESC
      LIMIT 40
    """)
    return (
        "Contenido: qué pieza engancha y dónde se cae la gente",
        "Leer por columnas: si `pasan_abstract` cae mucho respecto de `abiertas`, el "
        "gancho falla. Si `llegan_50` está bien pero `lecturas` no, el problema está en "
        "la segunda mitad. `salida_mediana_pct` es hasta dónde llegó el que se fue sin "
        "terminar.",
        cols,
        filas,
        {"tasa_lectura": pct},
    )


def q_profundidad(dias):
    cols, filas = consultar(_sesiones_cte(dias) + """
      SELECT
        multiIf(pv = 1, '1 página', pv = 2, '2 páginas', pv <= 4, '3-4 páginas', '5+ páginas') AS profundidad,
        count() AS sesiones,
        round(count() / (SELECT count() FROM ses), 2) AS proporcion,
        round(countIf(leyo) / count(), 2) AS tasa_lectura,
        countIf(contacto) AS contactos
      FROM ses
      GROUP BY profundidad
      ORDER BY min(pv)
    """)
    return (
        "Retención dentro de la visita: páginas por sesión",
        "Sin cookies no hay retención entre visitas; esto es lo que la reemplaza. La "
        "pregunta es si el que lee una pieza encuentra la segunda.",
        cols,
        filas,
        {"proporcion": pct, "tasa_lectura": pct},
    )


def q_caminos(dias):
    cols, filas = consultar(f"""
      SELECT
        concat(properties.locale, '/', properties.slug) AS primera,
        concat(properties.next_locale, '/', properties.next_slug) AS segunda,
        count() AS veces
      FROM events
      WHERE {FILTRO} AND timestamp >= now() - INTERVAL {dias} DAY
        AND event = 'content_continued'
      GROUP BY primera, segunda
      ORDER BY veces DESC
      LIMIT 25
    """)
    return (
        "Caminos: qué pieza lleva a terminar otra",
        "`content_continued` se acredita a la primera pieza terminada en la sesión. La "
        "pieza que más aparece en `primera` es la que engancha; conviene que sea la "
        "que más se distribuye.",
        cols,
        filas,
        None,
    )


def q_conversion(dias):
    cols, filas = consultar(f"""
      SELECT
        event,
        coalesce(nullIf(properties.kind, ''), '—') AS tipo,
        coalesce(nullIf(properties.surface, ''), '—') AS superficie,
        coalesce(nullIf(properties.slug, ''), '—') AS slug,
        count() AS clics,
        uniq(properties.$session_id) AS sesiones
      FROM events
      WHERE {FILTRO} AND timestamp >= now() - INTERVAL {dias} DAY
        AND event IN ('proof_click', 'contact_click', 'share_click')
      GROUP BY event, tipo, superficie, slug
      ORDER BY event, clics DESC
    """)
    return (
        "Conversión: pruebas, contacto y compartir",
        "`proof_click` (demo, repo, Figma) es interés evaluativo; `contact_click` por "
        "superficie dice cuál de los cinco lugares del mail convierte.",
        cols,
        filas,
        None,
    )


def q_dispositivo(dias):
    cols, filas = consultar(_sesiones_cte(dias) + """
      SELECT
        coalesce(device, '—') AS dispositivo,
        coalesce(pais, '—') AS pais,
        count() AS sesiones,
        round(countIf(leyo) / count(), 2) AS tasa_lectura,
        round(median(segundos)) AS mediana_seg
      FROM ses
      GROUP BY dispositivo, pais
      ORDER BY sesiones DESC
      LIMIT 15
    """)
    return (
        "Dispositivo y país",
        "Si el móvil lee mucho menos que el escritorio, el problema es de lectura en "
        "pantalla chica, no de contenido.",
        cols,
        filas,
        {"tasa_lectura": pct},
    )


CONSULTAS = [
    q_resumen,
    q_semanas,
    q_canales,
    q_utm_content,
    q_landing,
    q_piezas,
    q_profundidad,
    q_caminos,
    q_conversion,
    q_dispositivo,
]


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--days", type=int, default=30, help="ventana en días (default 30)")
    ap.add_argument("--guardar", action="store_true", help="escribe el informe en data/metricas/")
    ap.add_argument("--hogql", help="corre una consulta HogQL suelta y la imprime")
    args = ap.parse_args()

    cargar_env_local()

    if args.hogql:
        cols, filas = consultar(args.hogql)
        print(tabla(cols, filas))
        return

    hoy = dt.date.today().isoformat()
    partes = [
        f"# Growth del portfolio · {hoy} · ventana {args.days} días\n",
        "Fuente: PostHog, proyecto 351723, host ivandujaut.com, sin agentes no lectores.\n",
    ]
    for q in CONSULTAS:
        titulo, nota, cols, filas, fmt = q(args.days)
        partes.append(f"\n## {titulo}\n\n{nota}\n\n{tabla(cols, filas, fmt)}")
        print(f"· {titulo}", file=sys.stderr)

    informe = "\n".join(partes)
    print(informe)

    if args.guardar:
        destino = RAIZ / "data" / "metricas" / f"{hoy}-growth-{args.days}d.md"
        destino.parent.mkdir(parents=True, exist_ok=True)
        destino.write_text(informe)
        print(f"\nGuardado en {destino.relative_to(RAIZ)}", file=sys.stderr)


if __name__ == "__main__":
    main()
