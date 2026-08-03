---
name: content-check
description: Verificación completa antes de publicar contenido del portfolio (MDX en content/). Corre lint, Velite, prettier, typecheck, build, chequea links externos rotos, y valida el render en ambos idiomas y en mobile. Usar antes de commitear o abrir un PR que toque content/, o cuando el usuario pida "verificá el artículo", "está listo para publicar" o similar.
---

# Verificación de contenido antes de publicar

Secuencia completa para un artículo o post. Correr **en orden** y no saltear pasos:
cada uno atrapa una clase de error distinta y los últimos dependen de los primeros.

Si algún paso falla, arreglar y volver a correr **desde ese paso**, no desde el principio.

## 0. Auditoría de trazabilidad

Si el diff toca `content/` y la pieza tiene hoja de hechos (`facts.md` junto al MDX,
o el puntero `{/* facts: ... */}` en un post): invocar el subagente `content-auditor`
con la ruta del artículo, aplicar los hallazgos confirmados, y repetir hasta cero
hallazgos de severidad alta. Si NO hay hoja de hechos, decirlo explícitamente en el
reporte final: la verificación técnica de abajo no cubre trazabilidad.

## 1. Lint de contenido

```bash
node .claude/scripts/lint-content.mjs --all
```

Sale con código 2 si hay errores (schema, imágenes faltantes, proporciones de
`<Figure>`, links internos rotos). Las advertencias de estilo no frenan, pero hay que
leerlas: la de `"No es X. Es Y."` es la que más se escapa al escribir.

## 2. Content layer

```bash
npx velite build
```

Valida el frontmatter contra el schema de Zod y regenera `.velite/`. Si el paso 1 pasó,
acá no debería haber sorpresas.

## 3. Formato y tipos

```bash
npx prettier --write "content/**/*.mdx" && npm run typecheck && npm run lint
```

## 4. Links externos

```bash
node .claude/scripts/check-links.mjs content/<colección>/es/<slug>/index.mdx content/<colección>/en/<slug>/index.mdx
```

Con paths, el chequeo se acota a la pieza que se publica: un link viejo de otro caso
no bloquea este gate (de eso se ocupa el cron semanal). Un 404 o una redirección a la
home significa link muerto: hay que buscar una fuente alternativa que diga exactamente
lo mismo, **no** borrar la afirmación.

## 5. Build de producción

```bash
rm -rf .next && npm run build
```

## 6. Render real

Levantar el dev server con la herramienta de preview (nunca con Bash) y verificar:

- La página nueva responde 200 en **ambos** idiomas (`/projects/<slug>` y `/en/projects/<slug>`).
- Cero errores en la consola del server.
- Las imágenes se sirven optimizadas: pegarle a `/_next/image?url=...&w=1200&q=75`
  y confirmar `content_type: image/webp`.
- En viewport mobile (375px), `document.documentElement.scrollWidth` no supera al
  `clientWidth`. Las tablas anchas tienen que scrollear dentro de su contenedor,
  no empujar la página.
- En la versión EN, screenshot de las cards de métricas a 375px: ningún label ni
  valor supera las 3 líneas ni deja palabras huérfanas (presupuesto orientativo:
  ~35 caracteres por label; describir el filtro y cortar).

Si la caché de Turbopack tira errores fantasma (`Cannot read properties of undefined`),
matar el server, `rm -rf .next node_modules/.cache` y volver a levantar.

## 7. Reporte

Cerrar diciendo, con evidencia y sin adornos: qué pasó, qué falló, y qué quedó sin
verificar. Si un paso se salteó, decirlo explícitamente.
