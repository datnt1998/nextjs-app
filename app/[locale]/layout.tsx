import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import {
  getSiteDescription,
  getSiteKeywords,
  getSiteName,
  siteConfig,
} from "@/config/site";
import { type Locale, locales } from "@/i18n/config";
import { Providers } from "../providers";

// Open Sans - Variable font with all weights (100-900) and width variations
const openSans = localFont({
  src: [
    {
      path: "../../public/fonts/open-sans/OpenSans-VariableFont_wdth,wght.ttf",
      style: "normal",
    },
    {
      path: "../../public/fonts/open-sans/OpenSans-Italic-VariableFont_wdth,wght.ttf",
      style: "italic",
    },
  ],
  variable: "--font-open-sans",
  weight: "100 900", // Variable font supports all weights from 100 to 900
});

// Geist Mono - Variable font with all weights (100-900)
const geistMono = localFont({
  src: "../../public/fonts/geist-mono/GeistMono-VariableFont_wght.ttf",
  variable: "--font-geist-mono",
  weight: "100 900", // Variable font supports all weights from 100 to 900
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const localeTyped = locale as Locale;

  // Get locale-specific site metadata
  const siteName = getSiteName(localeTyped);
  const siteDescription = getSiteDescription(localeTyped);
  const siteKeywords = getSiteKeywords(localeTyped);

  return {
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description: siteDescription,
    keywords: siteKeywords,
    authors: siteConfig.authors,
    creator: siteConfig.creator.name,
    metadataBase: new URL(siteConfig.url),
    openGraph: {
      type: "website",
      locale: locale === "en" ? "en_US" : "vi_VN",
      url: siteConfig.url,
      title: siteName,
      description: siteDescription,
      siteName: siteName,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: siteName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description: siteDescription,
      images: [siteConfig.ogImage],
      creator: "@yourusername",
    },
    icons: {
      icon: "/favicon.ico",
    },
    alternates: {
      languages: {
        en: "/en",
        vi: "/vi",
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Load messages for this locale - explicitly pass the locale
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${openSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
