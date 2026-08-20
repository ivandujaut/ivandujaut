#!/usr/bin/env python3
"""Aplica los filtros de agentes que no son lectores al proyecto de PostHog.

Complementa el filtro de origen del PR #203 (`lib/analytics.ts`), que corta los
eventos antes de emitirlos pero solo hacia adelante. Esto limpia los insights del
dashboard, que siguen mirando los eventos ya registrados.

Necesita que `POSTHOG_PERSONAL_API_KEY` tenga scope `project:read` y
`project:write`. Con el scope de solo `query` devuelve 403 y no hace nada.

    python3 scripts/analysis/posthog-test-account-filters.py          # muestra el diff
    python3 scripts/analysis/posthog-test-account-filters.py --apply  # lo aplica
"""

import json
import os
import sys
import urllib.error
import urllib.request

PROYECTO = "351723"
BASE = f"https://us.posthog.com/api/projects/{PROYECTO}/"

# `Claude/` es el navegador embebido de la app de escritorio; `Shap-User` un
# crawler. El 18/08/2026 generaron 22 de los 51 eventos del día, y la única
# sesión que llegó con el `utm_content` de la serie de LinkedIn era la app de
# Claude, o sea tráfico propio entrando como si fuera un clic de la campaña.
FILTROS = [
    {
        "key": "$raw_user_agent",
        "type": "event",
        "value": "Claude/",
        "operator": "not_icontains",
    },
    {
        "key": "$raw_user_agent",
        "type": "event",
        "value": "Shap-User",
        "operator": "not_icontains",
    },
]


def pedir(metodo, cuerpo=None):
    clave = os.environ.get("POSTHOG_PERSONAL_API_KEY")
    if not clave:
        sys.exit("Falta POSTHOG_PERSONAL_API_KEY. Corré: set -a && . ./.env.local && set +a")
    req = urllib.request.Request(
        BASE,
        method=metodo,
        data=json.dumps(cuerpo).encode() if cuerpo else None,
        headers={
            "Authorization": f"Bearer {clave}",
            "Content-Type": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(req) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        detalle = e.read().decode()
        if e.code == 403 and "scope" in detalle:
            sys.exit(
                f"HTTP 403: a la key le falta scope.\n{detalle}\n\n"
                "Agregale 'project:read' y 'project:write' en PostHog > Settings > "
                "Personal API keys, y volvé a correr esto."
            )
        sys.exit(f"HTTP {e.code}: {detalle}")


def main():
    aplicar = "--apply" in sys.argv
    actual = pedir("GET")
    previos = actual.get("test_account_filters") or []

    print("test_account_filters actuales:")
    print(json.dumps(previos, indent=2, ensure_ascii=False) if previos else "  (ninguno)")

    # No pisa lo que ya haya: agrega solo los que falten, comparando por clave y valor.
    existentes = {(f.get("key"), f.get("value")) for f in previos}
    nuevos = [f for f in FILTROS if (f["key"], f["value"]) not in existentes]

    if not nuevos:
        print("\nLos dos filtros ya están puestos. Nada que hacer.")
        return

    print("\nA agregar:")
    print(json.dumps(nuevos, indent=2, ensure_ascii=False))

    if not aplicar:
        print("\nEsto fue un ensayo. Corré con --apply para aplicarlo.")
        return

    # Guarda el estado previo antes de escribir, para poder revertir.
    respaldo = "scripts/analysis/.posthog-filters-backup.json"
    with open(respaldo, "w") as f:
        json.dump(previos, f, indent=2, ensure_ascii=False)
    print(f"\nEstado previo guardado en {respaldo}")

    pedir(
        "PATCH",
        {
            "test_account_filters": previos + nuevos,
            # Deja el toggle "filter out internal and test users" prendido por
            # defecto en los insights nuevos. Sin esto los filtros existen pero
            # hay que acordarse de activarlos en cada insight.
            "test_account_filters_default_checked": True,
        },
    )
    print("Aplicado.")


if __name__ == "__main__":
    main()
