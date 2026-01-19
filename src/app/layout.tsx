import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Game Audit",
  description: "For podcast hosts who want their content to compound—not drift",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${ibmPlexSans.variable} antialiased`}
        style={{ fontFamily: "var(--sans)" }}
      >
        {/* Fathom - beautiful, simple website analytics */}
        <Script
          src="https://cdn.usefathom.com/script.js"
          data-site="XJZACWXX"
          strategy="afterInteractive"
        />
        {children}
      </body>
    </html>
  );
}
