---
name: new-case
description: Crea el esqueleto de una entrada nueva del portfolio (caso de estudio en content/projects o post en content/posts) en español e inglés, con el frontmatter válido según el schema de Velite. Usar cuando el usuario quiera empezar un caso, un análisis o un post nuevo.
---

# Entrada nueva del portfolio

## Antes de tocar archivos

Preguntar solo lo que no se pueda deducir del pedido:

1. **Colección.** `projects` para un caso de estudio o un producto construido;
   `posts` para el blog (piezas personales, making-of, reflexiones de proceso).
2. **Slug.** En kebab-case, sin acentos, igual en ambos idiomas.
3. Para `projects`, el **`kind`**: `case-study` (análisis sobre un producto o mercado
   ajeno), `build` (algo que construyó) o `design`.

Lo demás se completa con placeholders y se ajusta al escribir.

## Estructura

Cada entrada son **dos archivos** unidos por `translationKey`:

```
content/<colección>/es/<slug>/index.mdx
content/<colección>/en/<slug>/index.mdx
```

Las imágenes van en `public/projects/<slug>/` y se referencian con ruta absoluta
(`/projects/<slug>/grafico.png`). La **excepción es la portada**: va al lado del MDX
como `./cover.jpg`, porque Velite la procesa con `s.image()` para generar el
placeholder borroso.

## Frontmatter de `projects`

```yaml
---
title: "" # máx 120
tagline: "" # máx 140
description: "" # máx 300
year: 2026
date: "YYYY-MM-DD" # ordena el listado
role: "Product" # Product | Full-stack | Frontend | Backend | Design | Other
status: "concept" # shipped | in-progress | archived | concept
kind: "case-study" # build | case-study | design
featured: false # true EXIGE cover, si no falla el refine
stack: [""] # mínimo 1; los que matcheen lib/tech-icons.ts muestran logo
metrics: # opcional, 4 entran bien en el encabezado
  - label: ""
    value: ""
translationKey: "<slug>"
draft: false
---
```

Campos opcionales que valen la pena: `cover` (obligatoria si `featured`), `preview`
(**exactamente 3** imágenes, proporción entre 1.1 y 1.7, alimenta el badge de la home),
`repo`, `demo`, `figma`.

## Frontmatter de `posts`

```yaml
---
title: "" # máx 120
description: "" # máx 220, más corto que en projects
date: "YYYY-MM-DD"
tags: [""]
translationKey: "<slug>"
---
```

## Componentes disponibles en el MDX

`<Abstract label="En resumen">`, `<Thesis>`, `<Figure src alt width height caption>`,
`<TableCaption>`, `<Callout type="warning" title="">`, `<MetricGrid>` con `<Metric>`,
`<Steps>`, `<Comparison>`, `<References>` con `<Reference>` y `<Cite>`.

`<TableCaption>` va **suelto justo después** de la tabla markdown, no la envuelve.

## Al terminar

1. Crear también `data/<slug>/facts.md` (fuera del repo, junto a los futuros
   datasets): la hoja de hechos del caso, con las secciones "Datos publicados",
   "Cálculos propios", "Versión periodística" e "Hipótesis del modelo" vacías.
   Ningún número entra al artículo sin pasar por ahí (ver
   `.claude/docs/content-workflow.md`, nodo 2).
2. Si el caso lleva gráficos, su script va en `scripts/charts/<slug>.py`.
3. `npx velite build` para confirmar que el schema pasa.
4. `node .claude/scripts/lint-content.mjs --all`.
5. Recordarle al usuario que la versión en inglés se escribe **después** de cerrar la
   española con sus ediciones, para no traducir dos veces.

No inventar contenido: dejar los cuerpos con un marcador claro de qué va en cada
sección y esperar el material.
