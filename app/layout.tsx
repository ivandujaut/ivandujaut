import type { Metadata } from "next";
import { Geist_Mono, Figtree } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: {
    default: "Iván Dujaut",
    template: "%s — Iván Dujaut",
  },
  description: "Desarrollador full-stack. Portfolio personal, blog y casos de estudio.",
  metadataBase: new URL("https://ivandujaut.vercel.app"),
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
        {children}
      </body>
    </html>
  );
}
