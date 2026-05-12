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

// Cache-Control para páginas HTML servidas desde el edge de Vercel.
// next-intl en RSC fuerza dynamic rendering (llama `headers()` internamente),
// así que `export const revalidate` no llega a producir ISR estático. Como
// workaround, declaramos el caching al edge a mano: browsers siempre revalidan
// (max-age=0) pero el CDN sirve la respuesta cacheada por `s-maxage` segundos.
const SHORT_EDGE_CACHE = "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400";
const LONG_EDGE_CACHE = "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800";

const nextConfig: NextConfig = {
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
  async headers() {
    const shortCache = [{ key: "Cache-Control", value: SHORT_EDGE_CACHE }];
    const longCache = [{ key: "Cache-Control", value: LONG_EDGE_CACHE }];
    return [
      // Home y listados — pueden recibir nuevas entradas, edge cache 1 hora.
      { source: "/", headers: shortCache },
      { source: "/en", headers: shortCache },
      { source: "/blog", headers: shortCache },
      { source: "/en/blog", headers: shortCache },
      { source: "/projects", headers: shortCache },
      { source: "/en/projects", headers: shortCache },
      // Detail pages — contenido casi inmutable, edge cache 1 día.
      { source: "/about", headers: longCache },
      { source: "/en/about", headers: longCache },
      { source: "/blog/:slug+", headers: longCache },
      { source: "/en/blog/:slug+", headers: longCache },
      { source: "/projects/:slug+", headers: longCache },
      { source: "/en/projects/:slug+", headers: longCache },
    ];
  },
  webpack(config) {
    config.plugins.push(new VeliteWebpackPlugin());
    return config;
  },
};

export default withNextIntl(nextConfig);
