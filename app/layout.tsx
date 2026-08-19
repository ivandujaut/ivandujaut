import "./globals.css";
import { Geist_Mono, Figtree, Source_Serif_4 } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { getLocale } from "next-intl/server";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ClickTracker } from "@/components/analytics/click-tracker";
import { PostHogProvider } from "@/components/analytics/posthog-provider";
import type { Metadata, Viewport } from "next";

const figTree = Figtree({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Iván Dujaut",
    template: "%s · Iván Dujaut",
  },
  description:
    "Product Engineer and Bioengineer from ITBA. Building product with Next.js, TypeScript and a metrics-first lens. Writing about engineering, product and learning.",
  authors: [{ name: "Iván Dujaut", url: baseUrl }],
  creator: "Iván Dujaut",
  verification: {
    google: "OqVJAu5kIVPQcZ_QItCaZzQcsQwSqqCx-ZKjILFV3xk",
  },
  openGraph: {
    title: "Iván Dujaut",
    description:
      "Product Engineer and Bioengineer from ITBA. Building product with Next.js, TypeScript and a metrics-first lens.",
    url: baseUrl,
    siteName: "Iván Dujaut",
    images: [
      {
        url: `${baseUrl}/api/og?title=Iván+Dujaut&subtitle=Portfolio`,
        width: 1200,
        height: 630,
        alt: "Iván Dujaut",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Iván Dujaut",
    description:
      "Product Engineer and Bioengineer from ITBA. Building product with Next.js, TypeScript and a metrics-first lens.",
    images: [`${baseUrl}/api/og?title=Iván+Dujaut&subtitle=Portfolio`],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${figTree.variable} ${geistMono.variable} ${sourceSerif.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
        <PostHogProvider />
        <ClickTracker />
      </body>
    </html>
  );
}
