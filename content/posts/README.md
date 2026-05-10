# Cómo agregar posts

## Estructura de archivos

content/posts/
├── es/
│ ├── mi-post.mdx
│ └── mi-post-images/
│ └── cover.jpg
└── en/
├── my-post.mdx
└── my-post-images/
└── cover.jpg

## Frontmatter

```yaml
---
title: "Título del post"
description: "Descripción corta para el listado y SEO"
date: "2026-05-10"
tags: ["tag1", "tag2"]
translationKey: "mi-post-key" # mismo en es y en
draft: false # opcional, default false
cover: "./mi-post-images/cover.jpg" # opcional, si no se genera auto
---
```

## Hero image

Si NO definís `cover`, se genera automáticamente con el título del post
usando el endpoint `/api/og`. Esto está bien para la mayoría de posts.

Si querés una imagen custom:

1. Crear carpeta `mi-post-images/` al lado del .mdx
2. Subir la imagen ahí
3. Referenciarla en el frontmatter como `./mi-post-images/cover.jpg`

Velite optimiza la imagen automáticamente y la copia a `/public/static/`.
