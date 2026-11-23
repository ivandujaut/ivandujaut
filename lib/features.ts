/**
 * Interruptores de secciones del sitio.
 *
 * `RESEARCH_ENABLED` vivía duplicado en `app/sitemap.ts` y en
 * `app/[locale]/research/page.tsx`. Con dos definiciones, prender una y olvidar
 * la otra deja el sitio incoherente en la peor dirección posible: el sitemap
 * anunciando URLs que responden 404, o una sección viva que ningún buscador
 * encuentra. Acá hay una sola fuente de verdad.
 *
 * Al prenderlo hay que acordarse de los dos navs (`components/layout/navbar.tsx`
 * y `mobile-nav.tsx`), donde el link está comentado a propósito.
 */
export const RESEARCH_ENABLED = false;

/**
 * Blog y Casebook siguen publicados pero fuera de la vista desde el 22/11/2026.
 *
 * Con tres posts de mayo y un solo caso, cada sección se leía como un estante
 * vacío, y la vitrina se juzga por el promedio. En los 60 días anteriores el
 * blog tuvo 6 sesiones y el casebook 2. Apagados, salen de los dos navs, del
 * sitemap, de `llms.txt` y de las páginas 404; las rutas siguen respondiendo,
 * así que ningún link ya compartido se rompe. Se prenden de nuevo cuando cada
 * sección tenga cuatro o cinco piezas.
 */
export const BLOG_LISTED = false;
export const CASEBOOK_LISTED = false;
