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
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
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
