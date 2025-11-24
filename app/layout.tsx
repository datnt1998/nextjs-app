// This file is kept for Next.js structure but the actual layout is in [locale]/layout.tsx
// The middleware will handle redirecting to the appropriate locale
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // This root layout is minimal - the actual layout with fonts, styles, etc. is in [locale]/layout.tsx
  // We need html and body tags here for Next.js to work properly with 404 pages
  return <>{children}</>;
}
