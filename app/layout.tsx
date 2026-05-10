import "./globals.css";
import { Geist_Mono, Figtree } from "next/font/google";
import { ThemeProvider } from "next-themes";
import type { Metadata } from "next";

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

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Iván Dujaut",
    template: "%s · Iván Dujaut",
  },
  description: "Full-stack developer. Learning, building and documenting.",
  openGraph: {
    title: "Iván Dujaut",
    description: "Full-stack developer. Learning, building and documenting.",
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
    description: "Full-stack developer.",
    images: [`${baseUrl}/api/og?title=Iván+Dujaut&subtitle=Portfolio`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${figTree.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
