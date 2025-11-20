import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { Providers } from "./providers";

// Open Sans - Variable font with all weights (100-900) and width variations
const openSans = localFont({
  src: [
    {
      path: "../public/fonts/open-sans/OpenSans-VariableFont_wdth,wght.ttf",
      style: "normal",
    },
    {
      path: "../public/fonts/open-sans/OpenSans-Italic-VariableFont_wdth,wght.ttf",
      style: "italic",
    },
  ],
  variable: "--font-open-sans",
  weight: "100 900", // Variable font supports all weights from 100 to 900
});

// Geist Mono - Variable font with all weights (100-900)
const geistMono = localFont({
  src: "../public/fonts/geist-mono/GeistMono-VariableFont_wght.ttf",
  variable: "--font-geist-mono",
  weight: "100 900", // Variable font supports all weights from 100 to 900
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: siteConfig.authors,
  creator: siteConfig.creator.name,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@yourusername",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${openSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
