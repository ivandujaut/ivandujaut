import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // `/r/`, `/li` y `/tt` son redirecciones para humanos que llegan de un
        // posteo: existen para medir de dónde viene el clic, y su destino ya
        // está en el sitemap. Google las venía rastreando y las informaba como
        // "Página con redirección" en estado de error, que es ruido sobre un
        // sitio donde hay trece páginas sin indexar y conviene ver cuáles
        // importan de verdad.
        disallow: ["/api/", "/r/", "/li", "/tt"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
