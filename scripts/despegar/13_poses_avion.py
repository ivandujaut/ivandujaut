"""Alinea las poses del avión (fondo verde) para cambiarlas con el scroll.

Uso:
    python3 scripts/despegar/13_poses_avion.py POSE.png [POSE.png ...] [--out DIR] [--preview DIR]

Las poses salen de Gemini: el mismo avión con el tren abajo, a medio subir y
guardado. Puede ser una imagen por pose o una sola con varias (se recortan por
filas, de izquierda a derecha); el orden de salida es el de entrada. A cada pose
se le saca el verde y se la registra contra la primera: se busca el giro, la
escala y el corrimiento que mejor la superponen, y se la endereza con ese giro.
Así todas quedan niveladas y en el mismo lugar del mismo lienzo. La inclinación
la pone el CSS, de forma continua (de perfil, inclinar la nariz es rotar); lo
que aporta cada pose es lo que no se puede rotar: el tren y la luz pintada.

Salida: avion-pose-1.webp, avion-pose-2.webp, ... todas del mismo tamaño, más el
giro y la escala medidos de cada una (si una pose sale muy girada o muy chica,
Gemini no respetó el pedido y conviene regenerarla).
"""

from __future__ import annotations

import argparse
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

# Por debajo de este ancho (px) el avión se ve borroso en una pantalla retina.
ANCHO_MINIMO = 700


def chroma_key(rgb: Image.Image) -> Image.Image:
    """Verde a transparente, con el mismo umbral que se usó para avion.webp."""
    a = np.asarray(rgb.convert("RGB")).astype(np.float32)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    green = g - np.maximum(r, b)
    alpha = np.clip(1 - (green - 20) / 60, 0, 1)
    # Despill: el verde de los bordes no puede superar al mayor de rojo y azul.
    g = np.where(green > 0, np.maximum(r, b), g)
    return Image.fromarray(np.dstack([r, g, b, alpha * 255]).astype(np.uint8), "RGBA")


def cortar_poses(img: Image.Image) -> list[Image.Image]:
    """Cada avión de la imagen, ordenado por fila y después por columna."""
    alpha = np.asarray(img.getchannel("A")) > 128
    # Se engorda la máscara para que el tren o una antena sueltos no queden aparte.
    gorda = ndimage.binary_dilation(alpha, iterations=8)
    etiquetas, n = ndimage.label(gorda)
    if n == 0:
        raise SystemExit("No encontré ningún avión: ¿el fondo es verde puro?")
    tamanios = ndimage.sum(np.ones_like(etiquetas), etiquetas, index=range(1, n + 1))
    # La marca de agua y el ruido quedan afuera por tamaño.
    mayores = [i + 1 for i in np.argsort(tamanios)[::-1] if tamanios[i] >= 0.4 * tamanios.max()]
    centros = ndimage.center_of_mass(gorda, etiquetas, mayores)
    alto = np.median([ndimage.find_objects((etiquetas == e).astype(int))[0][0].stop
                      - ndimage.find_objects((etiquetas == e).astype(int))[0][0].start
                      for e in mayores])
    filas: list[list[tuple]] = []
    for t in sorted(zip(mayores, centros), key=lambda t: t[1][0]):
        if filas and abs(t[1][0] - filas[-1][0][1][0]) < alto / 2:
            filas[-1].append(t)
        else:
            filas.append([t])
    filas = [sorted(f, key=lambda t: t[1][1]) for f in filas]
    arr = np.asarray(img)
    poses = []
    for etiqueta, _ in (t for fila in filas for t in fila):
        sl = ndimage.find_objects((etiquetas == etiqueta).astype(int))[0]
        recorte = arr[sl].copy()
        # Lo que entra al recorte desde una celda vecina se borra.
        recorte[..., 3] = np.where(etiquetas[sl] == etiqueta, recorte[..., 3], 0)
        poses.append(Image.fromarray(recorte, "RGBA"))
    return poses


def correlacion(a: np.ndarray, b: np.ndarray) -> tuple[float, int, int]:
    """Mejor corrimiento de b sobre a (correlación por FFT) y su puntaje normalizado."""
    h = a.shape[0] + b.shape[0]
    w = a.shape[1] + b.shape[1]
    fa = np.fft.rfft2(a, (h, w))
    fb = np.fft.rfft2(b, (h, w))
    c = np.fft.irfft2(fa * np.conj(fb), (h, w))
    y, x = np.unravel_index(np.argmax(c), c.shape)
    puntaje = c[y, x] / np.sqrt((a * a).sum() * (b * b).sum())
    if y > h // 2:
        y -= h
    if x > w // 2:
        x -= w
    return float(puntaje), int(y), int(x)


def registrar(ref: Image.Image, pose: Image.Image, lado: int = 320) -> tuple[float, float]:
    """Giro (grados, antihorario) y escala que superponen la pose a la referencia."""
    f = lado / max(ref.size)
    def chica(im: Image.Image, escala: float = 1.0) -> Image.Image:
        return im.getchannel("A").resize(
            (max(1, round(im.width * f * escala)), max(1, round(im.height * f * escala))),
            Image.BILINEAR,
        )
    a = np.asarray(chica(ref)).astype(np.float32) / 255
    mejor = (-1.0, 0.0, 1.0)
    for escala in np.arange(0.88, 1.121, 0.02):
        base = chica(pose, escala)
        for giro in np.arange(-20, 20.01, 0.5):
            b = np.asarray(base.rotate(giro, Image.BILINEAR, expand=True)).astype(np.float32) / 255
            p, _, _ = correlacion(a, b)
            if p > mejor[0]:
                mejor = (p, float(giro), float(escala))
    # Ajuste fino del giro alrededor del mejor.
    _, g0, e0 = mejor
    base = chica(pose, e0)
    for giro in np.arange(g0 - 0.5, g0 + 0.51, 0.1):
        b = np.asarray(base.rotate(giro, Image.BILINEAR, expand=True)).astype(np.float32) / 255
        p, _, _ = correlacion(a, b)
        if p > mejor[0]:
            mejor = (p, float(giro), e0)
    return mejor[1], mejor[2]


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("imagenes", type=Path, nargs="+")
    ap.add_argument("--out", type=Path, default=Path("public/despegar/vuelo"))
    ap.add_argument("--preview", type=Path)
    args = ap.parse_args()

    poses = [p for ruta in args.imagenes for p in cortar_poses(chroma_key(Image.open(ruta)))]
    print(f"{len(poses)} poses")
    if poses[0].width < ANCHO_MINIMO:
        print(f"Aviso: el avión mide {poses[0].width} px de ancho; con menos de "
              f"{ANCHO_MINIMO} se va a ver borroso. Mejor una imagen por pose.")
    ref = poses[0]
    ra = np.asarray(ref.getchannel("A")).astype(np.float32) / 255

    # Cada pose, enderezada y escalada, con su corrimiento respecto de la referencia.
    colocadas = []
    print("pose  giro  escala")
    for i, pose in enumerate(poses):
        giro, escala = (0.0, 1.0) if i == 0 else registrar(ref, pose)
        p = pose.resize((round(pose.width * escala), round(pose.height * escala)), Image.LANCZOS)
        p = p.rotate(giro, Image.BICUBIC, expand=True)
        pa = np.asarray(p.getchannel("A")).astype(np.float32) / 255
        _, dy, dx = correlacion(ra, pa)
        colocadas.append((p, dx, dy))
        # El giro que endereza es el contrario de la inclinación pintada.
        print(f"{i + 1:>4}  {-giro:>4.1f}  {escala:>6.2f}")

    # Lienzo común: la unión de todas, con un margen chico.
    x0 = min(dx for _, dx, _ in colocadas) - 4
    y0 = min(dy for _, _, dy in colocadas) - 4
    x1 = max(dx + p.width for p, dx, _ in colocadas) + 4
    y1 = max(dy + p.height for p, _, dy in colocadas) + 4
    args.out.mkdir(parents=True, exist_ok=True)
    salidas = []
    for i, (p, dx, dy) in enumerate(colocadas):
        lienzo = Image.new("RGBA", (x1 - x0, y1 - y0), (0, 0, 0, 0))
        lienzo.alpha_composite(p, (dx - x0, dy - y0))
        destino = args.out / f"avion-pose-{i + 1}.webp"
        lienzo.save(destino, "WEBP", quality=90, method=6)
        salidas.append(lienzo)
    print(f"lienzo {x1 - x0}x{y1 - y0} -> {args.out}/avion-pose-1..{len(poses)}.webp")

    if args.preview:
        args.preview.mkdir(parents=True, exist_ok=True)
        w, h = salidas[0].size
        cols = min(3, len(salidas))
        hoja = Image.new("RGBA", (w * cols, h * -(-len(salidas) // cols)), (26, 13, 74, 255))
        for i, s in enumerate(salidas):
            hoja.alpha_composite(s, ((i % cols) * w, (i // cols) * h))
        hoja.convert("RGB").save(args.preview / "poses-hoja.png")
        # Calco: todas superpuestas a media opacidad, para ver si quedaron alineadas.
        calco = Image.new("RGBA", (w, h), (26, 13, 74, 255))
        for s in salidas:
            t = np.asarray(s).copy()
            t[..., 3] = (t[..., 3] * 0.3).astype(np.uint8)
            calco.alpha_composite(Image.fromarray(t, "RGBA"))
        calco.convert("RGB").save(args.preview / "poses-calco.png")
        print(f"vista previa en {args.preview}")


if __name__ == "__main__":
    main()
