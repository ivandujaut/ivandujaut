# Estilo de covers del portfolio

Receta para el prompt de la imagen de portada de cada caso (nodo 6b del flujo).
La genera la IA de imágenes de Google con la cuenta de Iván; acá se define qué
tiene que decir el prompt para que las covers compartan identidad visual.

El canon es la cover de "La prima que no llega" (cobranza-seguros). Su prompt
completo está al final; la anatomía sale de ahí.

## Anatomía del prompt (7 bloques, siempre en este orden)

1. **Estilo.** Fijo entre casos, casi textual:
   "Cinematic editorial illustration with fine film grain and soft painterly
   shading, atmospheric and moody, like a high-end magazine spread. Heavy 35mm
   film grain, visible noise and painterly texture on every surface, not flat
   vector, not clean digital illustration."
   Los "not X" del final importan tanto como los "with X" del principio: sin
   ellos el modelo cae en ilustración vectorial plana.

2. **Paleta.** Fija entre casos, es la identidad de la serie: base fría
   (midnight navy, sombras teal, bordes que se funden a negro) y **un solo
   acento cálido (amber-gold) que es la única fuente de luz de la escena**. El
   objeto que brilla en ámbar es siempre el protagonista conceptual del caso.

3. **Composición.** Asimétrica, fuera de centro, ángulo bajo en tres cuartos,
   con un elemento cercano recortado por un borde y otro que recede en
   diagonal. Declarar los anti-patrones explícitos: "Absolutely not a
   symmetrical frontal view, no one-point perspective, no theatrical stage
   framing." Sin esa línea el modelo entrega simetría frontal.

4. **La metáfora, en dos estructuras.** Acá vive el trabajo editorial del
   prompt: la tesis del caso traducida a objetos físicos, nunca literal (sin
   pantallas, sin apps, sin edificios corporativos). En cobranza: el muro de
   comprobantes que brillan (la plata que entró) contra el archivo de ranuras
   vacías (la conciliación que falta). Cada estructura se describe con material,
   escala y estado de luz. Incluir los anticlichés del motivo elegido, con la
   forma "these are not X, not Y" (en cobranza: "not sticky notes, not a cork
   board, not a bulletin board"), porque el modelo arrastra sus propios lugares
   comunes por motivo.

5. **La figura humana.** Una sola, estilizada, sin cara, en silueta suave del
   color frío con rim light cálido, a escala chica contra las estructuras, de
   espaldas o en tres cuartos, haciendo UNA acción que resume el conflicto
   ("carrying one single glowing amber receipt... one figure, one receipt at a
   time, against a wall of thousands"). La figura es el lector del caso: humana,
   chiquita, frente a un problema estructural.

6. **Luz y mood.** Cómo la luz cálida viaja y dónde muere, y una frase de clima
   que condensa la tesis ("Quiet, patient, overwhelming mood: an endless manual
   task."). Esa frase se escribe a medida por caso: es el tagline del caso
   traducido a atmósfera.

7. **Prohibiciones y formato.** Fijas, textuales:
   "No frame, no border, no vignette, no watermark, no text, no numbers, no
   letters, no logos, no charts, no UI. Aspect ratio 16:9, wide horizontal
   format."
   El "no text/numbers/letters" va también dentro del bloque 4 si el motivo
   incluye papeles o superficies escribibles ("only faint abstract ruled
   marks").

## Reglas de proceso

- El prompt nace del **escrito cerrado**, no del título: la metáfora tiene que
  ser reconocible para alguien que ya leyó el caso, y sorprendente para quien no.
- Se escribe en inglés (los modelos de imagen responden mejor) aunque el caso
  sea en español.
- Iteración dirigida: si el resultado trae texto, simetría o un cliché, se
  ajusta el bloque responsable (4 para clichés del motivo, 3 para simetría, 7
  para texto), no se regenera a ciegas con el mismo prompt.
- La imagen de Gemini trae marca de agua en la esquina inferior derecha: se
  limpia con un parche del entorno (la esquina es negra en el estilo de la
  serie) o se recorta re-encuadrando a 16:9, antes de cualquier otro paso.
- La imagen final se guarda como `cover.jpg` junto al MDX del caso (Velite la
  procesa para el placeholder), con un `alt` que describa la escena completa,
  como el de cobranza. `featured: true` sin cover no compila (lint + Velite).
- Los clichés que el modelo ya mostró y quedan vetados de serie: templetes
  griegos con frontón y columnas, pantallas con interfaz de app, figuras
  mirando el teléfono en vez de portarlo. Cada rechazo nuevo suma su cliché a
  esta lista.

## Prompt canónico (cobranza-seguros, verbatim)

Cinematic editorial illustration with fine film grain and soft painterly
shading, atmospheric and moody, like a high-end magazine spread. Heavy 35mm
film grain, visible noise and painterly texture on every surface, not flat
vector, not clean digital illustration.
Deep midnight navy-blue scene with cool teal shadows, fading into total
blackness at the edges.
Asymmetric off-center composition seen from a low three-quarter angle: the left
structure is close to the camera and cropped by the left edge of the frame,
while the right structure recedes diagonally into the depth of the image.
Absolutely not a symmetrical frontal view, no one-point perspective, no
theatrical stage framing.
On the left, towering close to the camera, a vast wall covered in hundreds of
long narrow paper payment receipts, the shape of till receipts and payment
slips, curling and overlapping each other in total disorder, some hanging
loose, some crumpled, a few flat round coins wedged among them. Every receipt
glows with warm amber-gold light and they are the only light source in the
entire scene. The receipts carry only faint abstract ruled marks: no readable
text, no letters, no numbers, no handwriting. These are not sticky notes, not
post-it notes, not a cork board, not a bulletin board, not a pin board.
On the right, receding into the distance, an immense dark archive wall built of
identical narrow horizontal slots carved in cold slate-blue stone, each slot
exactly the size of one receipt, stacked in a rigid grid climbing up into
blackness, like a ledger turned into architecture. Only three or four slots
near the bottom hold a glowing amber receipt; every other slot is empty, unlit
and cold.
In the lower third of the frame and close to the camera, one stylized human
figure walks across a narrow dark walkway suspended over a black bottomless
void, seen from behind at a three-quarter angle, large enough that the posture
reads clearly: a simple soft faceless silhouette in muted slate blue with warm
rim light along one side, mid-stride, carrying one single glowing amber receipt
held carefully with both hands, heading toward the empty archive. One figure,
one receipt at a time, against a wall of thousands.
The amber light from the receipts spills across the near end of the walkway and
dies in the darkness before reaching the archive. Warm amber highlights meet
cool teal shadows. Deep negative space in the black void under the walkway.
Quiet, patient, overwhelming mood: an endless manual task.
Heavy fine grain and noise everywhere. No frame, no border, no vignette, no
watermark, no text, no numbers, no letters, no logos, no charts, no UI. Aspect
ratio 16:9, wide horizontal format.
