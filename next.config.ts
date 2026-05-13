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

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
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
