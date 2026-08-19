import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

class VeliteWebpackPlugin {
  static started = false;

  apply(compiler: {
    hooks: {
      beforeCompile: { tap: (name: string, callback: () => void) => void };
    };
  }) {
    compiler.hooks.beforeCompile.tap("VeliteWebpackPlugin", () => {
      void this.run();
    });
  }

  async run() {
    if (VeliteWebpackPlugin.started) return;
    VeliteWebpackPlugin.started = true;

    const dev = process.env.NODE_ENV === "development";
    const { build } = await import("velite");
    await build({ watch: dev, clean: !dev });
  }
}

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

// Links cortos de la serie de LinkedIn: `/r/1` … `/r/14` llevan al caso con su
// UTM puesto. En el primer comentario se pega un link corto del dominio propio y
// la medición se conserva igual, porque los parámetros viajan en el destino.
// El número es el mismo `post-NN` del calendario (social/campana-linkedin-insurtech).
const SERIE_LINKEDIN: Record<number, string> = {
  1: "/projects",
  2: "/projects/cobranza-seguros",
  3: "/projects/canal-digital-seguros",
  4: "/projects/primo-cobranza",
  5: "/projects/nubank-seguros-argentina",
  6: "/projects/cobranza-seguros",
  7: "/projects/canal-digital-seguros",
  8: "/projects/insurance-advisor-bot",
  9: "/projects/nubank-seguros-argentina",
  10: "/projects/canal-digital-seguros",
  11: "/projects/primo-cobranza",
  12: "/projects/insurance-advisor-bot",
  13: "/projects/cobranza-seguros",
  14: "/projects",
};

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
  },
  // La API de ingestión de PostHog usa barra final (`/e/`). Sin esto Next.js la
  // redirige y los eventos se pierden en silencio.
  skipTrailingSlashRedirect: true,
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  // Proxy inverso de PostHog sobre el propio dominio. Los bloqueadores filtran
  // por dominio y por patrones conocidos (`posthog`, `ingest`, `analytics`,
  // `telemetry`), y se comen entre el 10% y el 30% del tráfico técnico, que es
  // justo el perfil que interesa medir. Por eso la ruta es corta y no dice qué
  // es. Va excluida del matcher de `proxy.ts`, como `/stats`: si no, next-intl
  // la reescribe a `/es/rl/...` y no llega nada.
  async rewrites() {
    return [
      {
        source: "/rl/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/rl/array/:path*",
        destination: "https://us-assets.i.posthog.com/array/:path*",
      },
      {
        source: "/rl/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
  // Van como 307 y no como 308: un permanente queda cacheado en el browser para
  // siempre, así que un destino equivocado sería incorregible para quien ya lo
  // visitó. Corren antes que el proxy de next-intl, que si no reescribiría
  // `/r/1` a `/es/r/1`.
  async redirects() {
    return [
      ...Object.entries(SERIE_LINKEDIN).map(([n, destino]) => ({
        source: `/r/${n}`,
        destination: `${destino}?utm_source=linkedin&utm_campaign=serie&utm_content=post-${n.padStart(2, "0")}`,
        permanent: false,
      })),
      // Bio de TikTok: la plataforma permite un solo link en el perfil y se
      // muestra como texto, así que va lo más corto y legible posible. El UTM
      // separa esta señal de la serie de LinkedIn en el panel de analytics.
      {
        source: "/tt",
        destination: "/projects?utm_source=tiktok&utm_content=bio",
        permanent: false,
      },
      // Link del perfil de LinkedIn, mismo criterio que la bio de TikTok.
      //
      // Existe por un hallazgo del 18/08: el post de las 10:00 apuntaba a un
      // caso vía `/r/5`, y las dos sesiones que llegaron de LinkedIn esa mañana
      // entraron a OTROS dos casos, sin UTM. O sea que la gente llega por el
      // perfil y no por el link del primer comentario, y todo el esquema de
      // `utm_content` mide cero por diseño, no por falla.
      //
      // `utm_medium=profile` distingue esta señal permanente de la serie
      // (`utm_campaign=serie`), que es temporal: sin eso, el tráfico del perfil
      // se sumaría a los posts y les inflaría el crédito.
      {
        source: "/li",
        destination: "/projects?utm_source=linkedin&utm_medium=profile",
        permanent: false,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "ivandujaut.vercel.app",
      },
      {
        protocol: "https",
        hostname: "ivandujaut.com",
      },
    ],
  },
  webpack(config) {
    config.plugins.push(new VeliteWebpackPlugin());
    return config;
  },
};

export default withNextIntl(nextConfig);
