# Hreflang and SEO Metadata Implementation

## Overview

This document describes the implementation of SEO metadata with hreflang tags for the Next.js i18n integration.

## What Was Implemented

### 1. Metadata Utility Functions

Created `lib/i18n/metadata.ts` with two main functions:

#### `generateHreflangLinks(pathname: string)`

- Generates hreflang alternate links for all supported locales
- Takes a pathname (e.g., "/dashboard") and returns full URLs for each locale
- Example output: `{ en: "https://example.com/en/dashboard", vi: "https://example.com/vi/dashboard" }`

#### `generateI18nMetadata(options)`

- Generates complete metadata with i18n support
- Includes:
  - Basic title and description
  - Open Graph metadata with locale information
  - Hreflang alternate links
  - Site name and URL
- Supports merging additional metadata

### 2. Updated Pages with Metadata

The following pages now have proper SEO metadata with hreflang tags:

1. **Home Page** (`app/[locale]/page.tsx`)
   - Title and description from `metadata.home`
   - Full hreflang support

2. **Sign In Page** (`app/[locale]/(auth)/sign-in/layout.tsx`)
   - Title and description from `metadata.auth.signIn`
   - Full hreflang support

3. **Sign Up Page** (`app/[locale]/(auth)/sign-up/layout.tsx`)
   - Title and description from `metadata.auth.signUp`
   - Full hreflang support

4. **Dashboard Page** (`app/[locale]/(dashboard)/dashboard/page.tsx`)
   - Title and description from `metadata.dashboard`
   - Full hreflang support

5. **403 Error Page** (`app/[locale]/403/page.tsx`)
   - Title and description from `metadata.errors.403`
   - Full hreflang support

### 3. Translation Keys

Added metadata translation keys to:

- `messages/en/metadata.json`
- `messages/vi/metadata.json`

New keys added:

- `metadata.dashboard.title` and `metadata.dashboard.description`
- `metadata.errors.403.title` and `metadata.errors.403.description`

## Generated Metadata Structure

Each page now generates the following metadata:

```typescript
{
  title: "Page Title",
  description: "Page Description",
  openGraph: {
    title: "Page Title",
    description: "Page Description",
    locale: "en",                    // Current locale
    alternateLocale: ["vi"],         // Other locales
    url: "https://example.com/en/page",
    siteName: "NextJS Starter Kit",
    type: "website"
  },
  alternates: {
    languages: {
      en: "https://example.com/en/page",
      vi: "https://example.com/vi/page"
    }
  }
}
```

## HTML Output

The metadata generates the following HTML tags:

```html
<!-- Basic Meta Tags -->
<title>Page Title</title>
<meta name="description" content="Page Description" />

<!-- Open Graph Tags -->
<meta property="og:title" content="Page Title" />
<meta property="og:description" content="Page Description" />
<meta property="og:locale" content="en" />
<meta property="og:locale:alternate" content="vi" />
<meta property="og:url" content="https://example.com/en/page" />
<meta property="og:site_name" content="NextJS Starter Kit" />
<meta property="og:type" content="website" />

<!-- Hreflang Links -->
<link rel="alternate" hreflang="en" href="https://example.com/en/page" />
<link rel="alternate" hreflang="vi" href="https://example.com/vi/page" />
```

## SEO Benefits

1. **Search Engine Discovery**: Hreflang tags help search engines discover and index all language versions
2. **Correct Language Serving**: Search engines can serve the correct language version to users
3. **Social Media Sharing**: Open Graph locale tags improve social media sharing
4. **Duplicate Content Prevention**: Hreflang tags prevent duplicate content issues
5. **International SEO**: Proper locale signals for international search rankings

## Usage Example

To add metadata to a new page:

```typescript
import { generateI18nMetadata } from "@/lib/i18n/metadata";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.yourPage" });

  return generateI18nMetadata({
    locale: locale as Locale,
    pathname: "/your-page",
    title: t("title"),
    description: t("description"),
  });
}
```

## Requirements Validated

This implementation validates the following requirements:

- **Requirement 8.3**: generateMetadata() provides locale-aware metadata generation ✓
- **Requirement 8.4**: Hreflang tags are generated for all supported locales ✓
- **Requirement 8.5**: Open Graph metadata includes locale-specific og:locale tags ✓

## Files Modified

1. `lib/i18n/metadata.ts` - New utility file
2. `lib/i18n/README.md` - Documentation
3. `app/[locale]/page.tsx` - Updated with metadata
4. `app/[locale]/(auth)/sign-in/layout.tsx` - Updated with metadata
5. `app/[locale]/(auth)/sign-up/layout.tsx` - Updated with metadata
6. `app/[locale]/(dashboard)/dashboard/page.tsx` - Updated with metadata
7. `app/[locale]/403/page.tsx` - Updated with metadata
8. `messages/en/metadata.json` - Added new keys
9. `messages/vi/metadata.json` - Added new keys

## Testing

The implementation has been verified:

- ✓ TypeScript compilation passes
- ✓ Next.js build succeeds
- ✓ All pages generate proper metadata structure
- ✓ Hreflang links include all supported locales
- ✓ Open Graph locale tags are correct

## Next Steps

To add metadata to additional pages:

1. Add translation keys to `messages/[locale]/metadata.json`
2. Import and use `generateI18nMetadata` in the page's `generateMetadata` function
3. Provide the correct pathname for hreflang generation
