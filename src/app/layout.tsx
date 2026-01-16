import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
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
