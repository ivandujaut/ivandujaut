"""Convierte una foto en una portada de semitono para el casebook.

Semitono, no filtro: la imagen se reconstruye con puntos en una grilla regular,
girada 45 grados, donde el diámetro de cada punto es la tinta que hace falta en
esa celda. Es lo que hace una imprenta de diario, y de cerca se ven los puntos.

Por qué un script y no una herramienta de imagen:

  * Es reproducible. La portada se regenera igual siempre, y el parámetro que
    la produjo queda en el commit, al lado del caso. Es la misma regla que
    siguen los gráficos del sitio (`scripts/charts/<slug>.py`).
  * No depende de un servicio externo ni de una cuenta, que fue lo que hizo
    descartar Higgsfield.
  * La foto original no se toca: entra como fuente y queda declarada con su
    licencia en la hoja de hechos del caso.

Sobre la fuente: sólo fotos que permitan obra derivada (dominio público, CC0, o
CC BY cumpliendo el crédito). Un semitono es una obra derivada.

Correr desde la raíz del repo:

    python3 scripts/covers/halftone.py <foto> <destino.jpg>
    python3 scripts/covers/halftone.py foto.jpg cover.jpg --spacing 7 --gamma 1.2
    python3 scripts/covers/halftone.py foto.jpg cover.jpg --tinta casebook
"""

from __future__ import annotations

import argparse
import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageOps

# El formato de las portadas del sitio: 16:9 y del ancho que usan las demás.
ANCHO, ALTO = 1376, 768

# Las tintas. `papel` es el fondo y `tinta` el punto.
#
# El casebook es la única sección con color del sitio (ver `--casebook` en
# app/globals.css), así que su portada puede llevar el violeta. El resto queda
# en negro sobre crema, que es el canon del portfolio.
TINTAS = {
    "negro": ((250, 247, 240), (26, 24, 22)),
    "casebook": ((250, 248, 245), (74, 56, 156)),
}

# El canvas se dibuja a 3x y se baja al final: los bordes de cada punto salen
# suaves sin tener que dibujar círculos antialiasados a mano.
SUPERMUESTREO = 3


def recortar_a_formato(imagen: Image.Image) -> Image.Image:
    """Recorta al centro para dar 16:9 sin deformar la foto."""
    objetivo = ANCHO / ALTO
    ancho, alto = imagen.size
    actual = ancho / alto
    if actual > objetivo:
        nuevo_ancho = int(alto * objetivo)
        izquierda = (ancho - nuevo_ancho) // 2
        imagen = imagen.crop((izquierda, 0, izquierda + nuevo_ancho, alto))
    elif actual < objetivo:
        nuevo_alto = int(ancho / objetivo)
        arriba = (alto - nuevo_alto) // 2
        imagen = imagen.crop((0, arriba, ancho, arriba + nuevo_alto))
    return imagen.resize((ANCHO, ALTO), Image.LANCZOS)


def preparar(imagen: Image.Image, gamma: float, contraste: float) -> Image.Image:
    """Blanco y negro, con los tonos medios corregidos.

    Sin esta corrección el semitono sale gris parejo: una foto cualquiera tiene
    casi todos sus píxeles en el medio del histograma, y ahí todos los puntos
    salen del mismo tamaño. `autocontrast` abre el rango y `gamma` decide si la
    imagen se lee clara (gamma > 1) u oscura.
    """
    gris = ImageOps.grayscale(imagen)
    gris = ImageOps.autocontrast(gris, cutoff=contraste)
    tabla = [min(255, int(255 * ((i / 255) ** (1 / gamma)))) for i in range(256)]
    return gris.point(tabla)


def promediar(gris: Image.Image, espaciado: int) -> Image.Image:
    """Suaviza a la escala de la grilla, para que cada punto represente su celda.

    Sin esto, el tamaño del punto lo decide un píxel suelto y cualquier textura
    fina de la foto (una tela, una rejilla, el grano) entra en interferencia con
    la grilla y aparece muaré: rayas que no están en la foto. Promediar a la
    escala del espaciado es lo que hace una imprenta antes de tramar.
    """
    return gris.filter(ImageFilter.GaussianBlur(radius=espaciado / 3))


def semitono(
    gris: Image.Image,
    espaciado: int,
    angulo: float,
    papel: tuple[int, int, int],
    tinta: tuple[int, int, int],
    punto_maximo: float,
) -> Image.Image:
    """Dibuja la grilla de puntos girada, del tamaño que pide cada celda."""
    lienzo = Image.new("RGB", (ANCHO * SUPERMUESTREO, ALTO * SUPERMUESTREO), papel)
    pincel = ImageDraw.Draw(lienzo)

    radianes = math.radians(angulo)
    cos_a, sen_a = math.cos(radianes), math.sin(radianes)

    # La grilla se recorre en su propio sistema girado y cada centro se lleva a
    # la imagen. El rango se estira con la diagonal para que, al girar, no
    # queden esquinas sin puntos.
    diagonal = int(math.hypot(ANCHO, ALTO) / espaciado) + 2
    pixeles = gris.load()

    for fila in range(-diagonal, diagonal):
        for columna in range(-diagonal, diagonal):
            u = columna * espaciado
            v = fila * espaciado
            x = u * cos_a - v * sen_a + ANCHO / 2
            y = u * sen_a + v * cos_a + ALTO / 2
            if not (0 <= x < ANCHO and 0 <= y < ALTO):
                continue

            # Cuanto más oscura la celda, más grande el punto.
            tono = pixeles[int(x), int(y)] / 255
            radio = (1 - tono) ** 0.5 * espaciado * punto_maximo
            if radio < 0.12:
                continue

            cx, cy = x * SUPERMUESTREO, y * SUPERMUESTREO
            r = radio * SUPERMUESTREO
            pincel.ellipse((cx - r, cy - r, cx + r, cy + r), fill=tinta)

    return lienzo.resize((ANCHO, ALTO), Image.LANCZOS)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("origen", type=Path, help="la foto fuente")
    parser.add_argument("destino", type=Path, help="el .jpg de salida")
    parser.add_argument(
        "--spacing",
        type=int,
        default=8,
        help="píxeles entre centros de puntos: más chico, más detalle y menos textura",
    )
    parser.add_argument("--angle", type=float, default=45, help="giro de la grilla, en grados")
    parser.add_argument("--gamma", type=float, default=1.0, help=">1 aclara, <1 oscurece")
    parser.add_argument(
        "--contraste", type=float, default=1.0, help="porcentaje que recorta autocontrast"
    )
    parser.add_argument("--punto", type=float, default=0.62, help="radio máximo, en celdas")
    parser.add_argument("--tinta", choices=sorted(TINTAS), default="casebook")
    parser.add_argument("--calidad", type=int, default=88, help="calidad del JPEG")
    args = parser.parse_args()

    papel, tinta = TINTAS[args.tinta]
    foto = Image.open(args.origen).convert("RGB")
    gris = preparar(recortar_a_formato(foto), args.gamma, args.contraste)
    lienzo = semitono(
        promediar(gris, args.spacing),
        args.spacing,
        args.angle,
        papel,
        tinta,
        args.punto,
    )

    args.destino.parent.mkdir(parents=True, exist_ok=True)
    lienzo.save(args.destino, "JPEG", quality=args.calidad, optimize=True, progressive=True)
    peso = args.destino.stat().st_size / 1024
    print(f"{args.destino}  {ANCHO}x{ALTO}  {peso:.0f} KB  (grilla {args.spacing}px, {args.tinta})")


if __name__ == "__main__":
    main()
