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
