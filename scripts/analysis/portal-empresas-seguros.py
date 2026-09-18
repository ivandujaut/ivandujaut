"""Benchmark de autogestión de aseguradoras argentinas (nodo 1 del caso).

Qué mide y por qué. La pregunta del caso es si la «tasa de autogestión» que
reporta un área significa algo. Desde afuera, sin credenciales, hay una cosa
contable: **cuántos sistemas de autogestión distintos publica cada aseguradora
y para qué audiencia**. Si el cliente final, el productor, el taller y el
prestador entran cada uno por un login distinto, no hay una tasa de autogestión:
hay varias, y sumarlas produce un promedio que no describe a nadie.

Método. Se descarga el HTML servido de la home de cada aseguradora (sin ejecutar
JavaScript, sin credenciales) y se extraen los enlaces que apuntan a un sistema
de acceso o autogestión. Cada uno se clasifica por audiencia según su host y su
ruta. Se cuentan **hosts distintos**, no enlaces, para no inflar por repetición
de menú.

Límites del método, que van al artículo. Esto es un **piso observado**: lo que no
viaja en el HTML servido no se cuenta, y una aseguradora que publique sus
accesos por JavaScript va a aparecer con menos sistemas de los que tiene. Un
conteo bajo nunca se lee como «está unificada», se lee como inconcluso.

Salidas:
  data/portal-empresas-seguros/accesos.csv          (una fila por acceso hallado)
  data/portal-empresas-seguros/resumen.csv          (una fila por aseguradora)
  data/portal-empresas-seguros/html/<slug>.html     (evidencia cruda de cada home)

Correr desde la raíz del repo:
  python3 scripts/analysis/portal-empresas-seguros.py
"""

import csv
import re
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
OUT = RAIZ / "data" / "portal-empresas-seguros"
HTML = OUT / "html"

UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36"
)

HOMES = [
    ("La Caja", "lacaja", "https://seguros.lacaja.com.ar/"),
    ("Mapfre", "mapfre", "https://www.mapfre.com.ar/"),
    ("Sancor", "sancor", "https://www.sancorseguros.com.ar/"),
    ("La Segunda", "lasegunda", "https://www.lasegunda.com.ar/"),
    ("San Cristóbal", "sancristobal", "https://www.sancristobal.com.ar/"),
    ("Provincia Seguros", "provincia", "https://www.provinciaseguros.com.ar/"),
    ("Federación Patronal", "fedpat", "https://www.fedpat.com.ar/"),
    ("Mercantil Andina", "mercantil", "https://www.mercantilandina.com.ar/"),
    ("Rivadavia", "rivadavia", "https://www.segurosrivadavia.com/"),
    ("Zurich", "zurich", "https://www.zurich.com.ar/"),
]

# Un enlace cuenta como acceso si su host o su ruta lo declara. El vocabulario es
# una lista cerrada, y ese es el límite real del método: una compañía que nombre a
# su audiencia con otra palabra no aparece. La primera versión sólo tenía las
# obvias y se perdía `asegurados`, `reclamos-terceros`, `sigma` (el sistema de
# productores de Mercantil) y `solicitudes`, todos con acceso propio y activos.
ES_ACCESO = re.compile(
    r"(autogesti[oó]n|/login|/ingresar|/acceso|mi-?cuenta|/account/login|"
    r"clientes|asegurad|productores|\bpas\b|sigma|prestadores|proveedores|"
    r"talleres|suscripciones|siniestros|reclamo|tercero|solicitudes|portal)",
    re.IGNORECASE,
)

# Orden importa: la primera que matchea gana.
AUDIENCIAS = [
    # `sigma` es el sistema de productores de Mercantil: sin esta línea quedaba
    # «sin clasificar» y se descartaba, siendo un acceso real y activo.
    ("productores", r"(productor|pas-web|/pas\b|sigma|organizador)"),
    ("prestadores y talleres", r"(prestador|taller|tasacion|proveedor|inspeccion)"),
    ("siniestros y terceros", r"(siniestro|tercero|denuncia)"),
    ("suscripción", r"suscripcion"),
    # `portalalianzas` caía en «clientes» por la regla de último recurso, que
    # matchea la palabra «portal». El menú de la propia compañía lo etiqueta
    # «Alianzas»: es un canal de socios, no el portal del titular.
    ("alianzas", r"alianza"),
    ("empresas", r"(empresa|corporat|pyme|flota)"),
    ("clientes", r"(cliente|asegurad|autogesti[oó]n|mi-?cuenta|/login|/ingresar|/acceso|portal)"),
]

DESCARTAR = re.compile(
    r"(facebook|instagram|twitter|linkedin|youtube|whatsapp|google|apple|"
    r"\.css|\.js|\.png|\.jpg|\.svg|mailto:|tel:)",
    re.IGNORECASE,
)

# Falsos positivos que casi publico, encontrados al revisar el primer conteo a mano:
#
# 1. `autogestion.produccion.gob.ar/consumidores` le sumaba un sistema a La Caja y
#    es el portal de Defensa del Consumidor del Estado. Todo dominio que no lleve
#    la marca de la aseguradora queda afuera.
# 2. San Cristóbal daba 12 sistemas, pero `sitio-autogestion`, `app-autogestion`,
#    `landing-seguros-clientes` y `nuestros-productores` son páginas de marketing
#    QUE HABLAN de la autogestión, no accesos. Y `autogestion.sancristobal.com.ar`
#    contra `autogestion.sancristobal.com.ar/ingresar` es el mismo sistema dos
#    veces. Con esas exclusiones queda el conteo por dirección dedicada.
MARKETING = re.compile(
    r"(landing|/sitio-|/app-|/nuestros-|/conoce|/beneficios|/preguntas)",
    re.IGNORECASE,
)
# Rutas que son la puerta del mismo sistema, no un sistema aparte.
PUERTA = re.compile(r"^(login|ingresar|acceso|account|authentication|auth|signin)$", re.IGNORECASE)

# Exclusiones verificadas a mano.
#
# La detección automática genera CANDIDATOS; la lista final se revisa uno por uno
# y lo que no resiste queda acá, con su motivo. Un regex no puede decidir si una
# URL es un sistema de autogestión, y cada vez que se amplía el vocabulario para
# no perder uno real entra basura. Esto es trabajo de campo: la máquina propone,
# la revisión manual dispone, y el motivo queda escrito para que se pueda discutir.
EXCLUIDOS = {
    "mercantilandina.com.ar/legales": (
        "redirige a la página de error (mercantilandina.com.ar/404) cambiando de "
        "host, así que el chequeo de redirección a la home no lo agarra"
    ),
    "servicios.mercantilandina.com.ar/asegurados": (
        "redirige a asegurados.mercantilandina.com.ar, que ya está contado: es el "
        "mismo sistema enlazado de dos formas desde la home"
    ),
}

# Un sistema de autogestión pide credenciales. Se busca la evidencia en el HTML
# servido: un campo de contraseña, o el vocabulario de acceso de una app que
# renderiza por JavaScript (varias sirven el shell con el título del login).
PIDE_CREDENCIALES = re.compile(
    r'(type=[\'"]password[\'"]|name=[\'"]?(pass|password|clave|contrase)|'
    r'(iniciar sesi[oó]n|ingres[aá] (?:con )?tu|olvid[eé] mi contrase|'
    r'recuperar contrase|usuario y contrase))',
    re.IGNORECASE,
)


def marca(aseguradora: str) -> str:
    """Token de marca para descartar dominios ajenos."""
    return {
        "La Caja": "lacaja", "Mapfre": "mapfre", "Sancor": "sancor",
        "La Segunda": "lasegunda", "San Cristóbal": "sancristobal",
        "Provincia Seguros": "provinciaseguros", "Federación Patronal": "fedpat",
        "Mercantil Andina": "mercantilandina", "Rivadavia": "rivadavia",
        "Zurich": "zurich",
    }[aseguradora]


def bajar(url: str) -> tuple[int, str, str]:
    """Devuelve (status, html, url_final). La url_final importa: un 200 después
    de seguir redirects puede ser la home, no la página pedida."""
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=25) as r:
            return r.status, r.read().decode("utf-8", errors="replace"), r.geturl()
    except urllib.error.HTTPError as e:
        return e.code, "", url
    except Exception:
        return 0, "", url


def cayo_en_la_home(url_pedida: str, url_final: str) -> bool:
    """Un enlace que termina en la raíz o en /home del mismo sitio no es un
    acceso: es un 404 disfrazado de 200.

    Esta comprobación existe por un error propio. `lasegunda.com.ar/autogestion`
    devuelve 200 siguiendo redirects, así que quedó publicado como «autogestión
    sobre un solo dominio, verificado». En realidad responde 301 a `/home`: la
    página no existe. Es la misma falla que ya estaba registrada en el caso del
    canal (un link muerto que redirige a la home con 200) y la repetí por mirar
    el código de estado en vez de la URL de destino.
    """
    if url_pedida.rstrip("/") == url_final.rstrip("/"):
        return False
    p, f = urllib.parse.urlparse(url_pedida), urllib.parse.urlparse(url_final)
    destino = f.path.strip("/").lower()
    # `/404` incluido: Mercantil redirige `/legales` a su página de error con
    # estado 200, así que sin esto entraba al conteo como acceso.
    return p.netloc == f.netloc and destino in ("", "home", "index", "404")


def audiencia(url: str) -> str:
    for nombre, patron in AUDIENCIAS:
        if re.search(patron, url, re.IGNORECASE):
            return nombre
    return "sin clasificar"


def main() -> None:
    HTML.mkdir(parents=True, exist_ok=True)
    accesos, resumen, muertos = [], [], []

    for aseguradora, slug, home in HOMES:
        code, html, _ = bajar(home)
        if html:
            (HTML / f"{slug}.html").write_text(html, encoding="utf-8")

        hrefs = re.findall(r'href="([^"]+)"', html)
        vistos: dict[str, dict] = {}

        token = marca(aseguradora)
        for href in (h.strip() for h in hrefs):  # hay hrefs con espacios: duplicaban sistemas
            if DESCARTAR.search(href) or MARKETING.search(href):
                continue
            if not ES_ACCESO.search(href):
                continue
            absoluta = urllib.parse.urljoin(home, href)
            partes = urllib.parse.urlparse(absoluta)
            if partes.scheme not in ("http", "https"):
                continue
            # Dominio ajeno (ver falso positivo 1): no es un sistema de la empresa.
            if token not in partes.netloc.lower().replace("-", ""):
                continue
            # La unidad es el host + el primer tramo de ruta: así
            # `/autogestion` y `/talleres` del mismo host cuentan como dos
            # sistemas, que es lo que el usuario efectivamente vive. Pero la
            # puerta de un sistema (`/login`, `/ingresar`) no es otro sistema.
            tramo = (partes.path.strip("/").split("/") or [""])[0].lower()
            # La puerta de un sistema no es otro sistema.
            if PUERTA.match(tramo):
                tramo = ""
            # Y `clientes.mapfre.com.ar/clientes` tampoco es otro sistema que
            # `clientes.mapfre.com.ar`: cuando el tramo repite el nombre del
            # subdominio, es el mismo acceso enlazado de dos formas desde la home.
            if tramo and tramo == partes.netloc.split(".")[0].lower():
                tramo = ""
            clave = f"{partes.netloc}/{tramo}" if tramo else partes.netloc
            if clave in vistos:
                continue
            vistos[clave] = {
                "aseguradora": aseguradora,
                "sistema": clave,
                "audiencia": audiencia(absoluta),
                "url": absoluta,
            }

        # Qué cuenta como sistema, y por qué este criterio y no otro.
        #
        # Primero probé exigir que la URL sirviera un campo de contraseña. No
        # sirve: casi todos los logins se renderizan por JavaScript, así que el
        # HTML servido no lo trae y el conteo se desplomaba a 0-1 para todos,
        # que es tan falso como el conteo inflado del principio.
        #
        # El criterio que queda es el defendible sin ejecutar JavaScript: un
        # **subdominio dedicado a una audiencia** (`productores.`, `prestadores.`,
        # `siniestros.`, `autogestion.`) es por construcción un sistema aparte,
        # lo diga o no su HTML. Las rutas del sitio principal quedan afuera: ahí
        # no se puede distinguir una app de una página que habla de la app.
        principal = urllib.parse.urlparse(home).netloc.lower()
        dedicados = {}
        for clave, dato in vistos.items():
            host = urllib.parse.urlparse(dato["url"]).netloc.lower()
            if host == principal:
                continue
            c, h, final = bajar(dato["url"])
            dato["http_acceso"] = c
            dato["url_final"] = final
            dato["pide_credenciales_en_html"] = (
                "sí" if h and PIDE_CREDENCIALES.search(h) else "no (o render JS)"
            )
            # Un acceso que no responde, o que termina en la home, no es un
            # sistema en uso: es un enlace que la página todavía publica y no
            # lleva a ningún lado. Queda registrado aparte (es un hallazgo
            # propio) pero no suma al conteo.
            # Sólo cuenta lo que responde. La primera versión sólo descartaba
            # `c == 0` y dejaba pasar los 4xx: así entró
            # `solicitudes.provinciaseguros.com.ar/pyme`, que devuelve 404.
            if c == 0 or c >= 400:
                dato["nota"] = (
                    "el host no responde" if c == 0 else f"responde {c}"
                ) + ": enlazado desde la home y sin destino válido"
                muertos.append(dato)
                time.sleep(0.6)
                continue
            if cayo_en_la_home(dato["url"], final):
                dato["nota"] = f"redirige a la home ({final}): la página no existe"
                muertos.append(dato)
                time.sleep(0.6)
                continue
            # «Sin clasificar» es la señal de que no es un acceso por audiencia.
            # Al ampliar el vocabulario entraron `solicitudes.../trabaja-en-ps`
            # (postulación laboral), `/bolso` y `/caucion` (formularios de
            # cotización): viven en un host de formularios, no son autogestión.
            if dato["audiencia"] == "sin clasificar":
                time.sleep(0.6)
                continue
            if clave in EXCLUIDOS:
                dato["nota"] = EXCLUIDOS[clave]
                muertos.append(dato)
                time.sleep(0.6)
                continue
            # Dedup por destino real: `servicios.mercantilandina.com.ar/asegurados`
            # redirige a `asegurados.mercantilandina.com.ar`, y son el mismo
            # sistema enlazado de dos formas.
            destino = final.rstrip("/")
            if any(d.get("url_final", "").rstrip("/") == destino for d in dedicados.values()):
                time.sleep(0.6)
                continue
            dedicados[clave] = dato
            time.sleep(0.6)
        vistos = dedicados

        # Sin HTML útil no se afirma nada: inconcluso, nunca cero.
        concluyente = code == 200 and len(html) > 3000
        accesos.extend(vistos.values())
        audiencias = sorted({v["audiencia"] for v in vistos.values()})
        # Dos conteos, porque miden cosas distintas: los subdominios distintos
        # son el número conservador (identidad y sesión propias por
        # construcción); los sistemas incluyen las apps con acceso propio que
        # comparten host, donde esa inferencia no se sostiene sola.
        subdominios = {urllib.parse.urlparse(v["url"]).netloc for v in vistos.values()}
        resumen.append({
            "aseguradora": aseguradora,
            "home": home,
            "http": code,
            "concluyente": "sí" if concluyente else "NO (inconcluso)",
            "sistemas_distintos": len(vistos) if concluyente else "",
            "subdominios_distintos": len(subdominios) if concluyente else "",
            "audiencias_distintas": len(audiencias) if concluyente else "",
            "audiencias": " · ".join(audiencias) if concluyente else "",
        })
        estado = f"{len(vistos)} sistemas / {len(audiencias)} audiencias" if concluyente else "INCONCLUSO"
        print(f"{aseguradora:22} {code:>3}  {estado}")
        time.sleep(1.2)

    if muertos:
        with (OUT / "accesos-caidos.csv").open("w", newline="", encoding="utf-8") as f:
            w = csv.DictWriter(f, fieldnames=list(muertos[0].keys()))
            w.writeheader()
            w.writerows(muertos)
        print(f"\n{len(muertos)} acceso(s) enlazado(s) desde la home pero caído(s): "
              f"{OUT / 'accesos-caidos.csv'}")

    for nombre, filas in (("accesos.csv", accesos), ("resumen.csv", resumen)):
        destino = OUT / nombre
        with destino.open("w", newline="", encoding="utf-8") as f:
            w = csv.DictWriter(f, fieldnames=list(filas[0].keys()))
            w.writeheader()
            w.writerows(filas)
        print(f"→ {destino}")

    conc = [r for r in resumen if r["concluyente"] == "sí"]
    print(f"\n{len(conc)} de {len(resumen)} aseguradoras concluyentes; del resto no se afirma nada.")


if __name__ == "__main__":
    main()
