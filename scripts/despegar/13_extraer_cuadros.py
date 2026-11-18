"""Saca la secuencia de cuadros del viaje de una compra a partir de los clips.

Cada clip va de una parada a la siguiente (puerta -> despegue -> crucero ->
aproximación). De cada uno se sacan `--por-clip` cuadros repartidos en toda su
duración, se recorta la franja de la marca de agua (abajo a la derecha) dejando
16:9, se achican a `--ancho` y se guardan como WebP numerados en orden. El
primer cuadro de cada clip después del primero se descarta porque repite el
último del anterior, así que el total es `por_clip * clips - (clips - 1)`.

Uso, desde la raíz del repo:
    python3 scripts/despegar/13_extraer_cuadros.py clip1.mp4 clip2.mp4 clip3.mp4

Al final imprime el bloque `sequence` para pegar en `despegar.data.ts`.
"""

import argparse
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image


def cuadros_de(clip: Path, n: int, destino: Path) -> list[Path]:
    """Exporta todos los cuadros del clip y devuelve `n` repartidos parejo, del primero al último."""
    destino.mkdir(parents=True, exist_ok=True)
    subprocess.run(
        ["ffmpeg", "-v", "error", "-y", "-i", str(clip), "-fps_mode", "passthrough", str(destino / "%05d.png")],
        check=True,
    )
    todos = sorted(destino.glob("*.png"))
    if len(todos) < n:
        raise SystemExit(f"{clip} tiene {len(todos)} cuadros y se pidieron {n}")
    return [todos[round(i * (len(todos) - 1) / (n - 1))] for i in range(n)]


def recortar(img: Image.Image, margen_x: float, ancho_util: float) -> Image.Image:
    """Deja un 16:9 desde arriba, corrido `margen_x` y sin el borde derecho."""
    w, h = img.size
    x0 = round(w * margen_x)
    cw = round(w * ancho_util)
    ch = round(cw * 9 / 16)
    if ch > h:  # clip más angosto que 16:9: se ajusta por alto
        ch = h
        cw = round(ch * 16 / 9)
    return img.crop((x0, 0, x0 + cw, ch))


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("clips", nargs="+", type=Path)
    ap.add_argument("--por-clip", type=int, default=25)
    ap.add_argument("--ancho", type=int, default=960)
    ap.add_argument("--calidad", type=int, default=78)
    ap.add_argument("--margen-x", type=float, default=0.0175, help="fracción del ancho a cortar a la izquierda")
    ap.add_argument("--ancho-util", type=float, default=0.907, help="fracción del ancho que queda")
    ap.add_argument("--salida", type=Path, default=Path("public/despegar/vuelo/seq"))
    args = ap.parse_args()

    for clip in args.clips:
        if not clip.exists():
            print(f"No existe {clip}", file=sys.stderr)
            return 1

    if args.salida.exists():
        shutil.rmtree(args.salida)
    args.salida.mkdir(parents=True)

    numero = 0
    alto = None
    with tempfile.TemporaryDirectory() as tmp:
        for c, clip in enumerate(args.clips):
            rutas = cuadros_de(clip, args.por_clip, Path(tmp) / f"clip{c}")
            if c > 0:
                rutas = rutas[1:]  # repite el último del clip anterior
            for ruta in rutas:
                img = recortar(Image.open(ruta).convert("RGB"), args.margen_x, args.ancho_util)
                alto = round(args.ancho * img.height / img.width)
                img = img.resize((args.ancho, alto), Image.LANCZOS)
                numero += 1
                img.save(args.salida / f"f-{numero:03d}.webp", "WEBP", quality=args.calidad, method=6)

    peso = sum(p.stat().st_size for p in args.salida.glob("*.webp"))
    print(f"{numero} cuadros en {args.salida} ({peso / 1024:.0f} KB)")
    print("Pegar en journey.sequence de despegar.data.ts:")
    print(
        "  sequence: {\n"
        f"    count: {numero},\n"
        f'    pattern: "/{args.salida.relative_to("public").as_posix()}/f-{{n}}.webp",\n'
        f"    width: {args.ancho},\n"
        f"    height: {alto},\n"
        "  },"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
