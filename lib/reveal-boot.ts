/**
 * El script que va en el `<head>`, antes de que se pinte el cuerpo.
 *
 * Vive acá y no junto a `RevealObserver` porque ese archivo es "use client":
 * desde el layout, que es de servidor, cualquier export suyo llega como
 * referencia de cliente y no como el texto del script.
 *
 * Pone la clase `rv` en `<html>`, que es la que esconde las tarjetas `.reveal`
 * hasta que el observador las ve entrar. Va inline y no en el componente
 * porque tiene que correr antes del primer pintado: si la clase llegara con
 * React, las tarjetas se verían, se esconderían y volverían a aparecer.
 *
 * Si el observador no avisa que arrancó en cuatro segundos (hidratación muy
 * lenta, un error de JavaScript), saca la clase y todo queda a la vista. Con
 * movimiento reducido ni la pone.
 */
export const REVEAL_BOOT = `(function(){try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;var d=document.documentElement;d.classList.add('rv');setTimeout(function(){if(!window.__revealReady)d.classList.remove('rv')},4000)}catch(e){}})();`;
