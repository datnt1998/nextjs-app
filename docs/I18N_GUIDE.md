# Internationalization (i18n) Guide

This guide provides comprehensive documentation for using internationalization features in this Next.js 16 application with next-intl v3.

## Table of Contents

1. [Overview](#overview)
2. [Adding New Translations](#adding-new-translations)
3. [Creating Locale-Aware Pages](#creating-locale-aware-pages)
4. [Using Translations in Components](#using-translations-in-components)
5. [Adding New Locales](#adding-new-locales)
6. [Testing i18n Features](#testing-i18n-features)
7. [Common Patterns](#common-patterns)
8. [Troubleshooting](#troubleshooting)

## Overview

This application uses **next-intl v3** for internationalization with the Next.js 16 App Router. The i18n system provides:

- **Locale-based routing**: URLs include locale prefix (e.g., `/en/dashboard`, `/vi/dashboard`)
- **Server and Client Components**: Support for translations in both rendering contexts
- **Type-safe translations**: Full TypeScript support with autocomplete
- **Automatic locale detection**: Based on browser Accept-Language headers
- **SEO optimization**: Proper hreflang tags and locale-specific metadata

### Supported Locales

Currently supported locales:

- **English (en)**: Default locale
- **Vietnamese (vi)**

### Project Structure

```
nextjs-app/
├── i18n/
│   ├── config.ts          # Locale configuration
│   ├── routing.ts         # Routing configuration
│   └── request.ts         # Server-side i18n setup
├── messages/
│   ├── en/                # English translations
│   │   ├── common.json
│   │   ├── auth.json
│   │   ├── dashboard.json
│   │   ├── items.json
│   │   ├── navigation.json
│   │   ├── errors.json
│   │   └── metadata.json
│   └── vi/                # Vietnamese translations
│       └── ... (same structure)
├── app/
│   └── [locale]/          # All routes under locale segment
│       ├── layout.tsx     # Locale-aware root layout
│       └── ...
└── components/
    └── language-switcher.tsx
```

## Adding New Translations

### Step 1: Identify the Namespace

Translations are organized into namespaces for better maintainability:

- **common**: Shared UI elements (buttons, labels, common actions)
- **auth**: Authentication pages (sign in, sign up)
- **dashboard**: Dashboard-specific content
- **items**: Items feature translations
- **navigation**: Navigation menus and links
- **errors**: Error messages
- **metadata**: SEO metadata (titles, descriptions)

### Step 2: Add to English Translation File

Add your translation key to the appropriate namespace file in `messages/en/`:

```json
// messages/en/common.json
{
  "submit": "Submit",
  "cancel": "Cancel",
  "newKey": "Your new translation"
}
```

For nested translations:

```json
// messages/en/dashboard.json
{
  "stats": {
    "totalItems": "Total Items",
    "activeUsers": "Active Users"
  },
  "actions": {
    "create": "Create New",
    "export": "Export Data"
  }
}
```

### Step 3: Add to All Other Locales

Add the corresponding translation to the same namespace file in all other locale directories:

```json
// messages/vi/common.json
{
  "submit": "Gửi",
  "cancel": "Hủy",
  "newKey": "Bản dịch mới của bạn"
}
```

### Step 4: Use in Your Code

```typescript
// Server Component
import { getTranslations } from 'next-intl/server';

export default async function Page() {
  const t = await getTranslations('common');
  return <button>{t('newKey')}</button>;
}

// Client Component
'use client';
import { useTranslations } from 'next-intl';

export function Component() {
  const t = useTranslations('common');
  return <button>{t('newKey')}</button>;
}
```

### Translation with Variables

For translations with dynamic values:

```json
// messages/en/dashboard.json
{
  "welcome": "Welcome back, {name}!",
  "itemCount": "You have {count} items"
}
```

Usage:

```typescript
const t = useTranslations('dashboard');
<h1>{t('welcome', { name: user.name })}</h1>
<p>{t('itemCount', { count: items.length })}</p>
```

## Creating Locale-Aware Pages

All pages must be created under the `app/[locale]/` directory to support internationalization.

### Basic Page Structure

```typescript
// app/[locale]/my-page/page.tsx
import { getTranslations } from 'next-intl/server';

export default async function MyPage() {
  const t = await getTranslations('namespace');

  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  );
}
```

### Page with Metadata

```typescript
// app/[locale]/my-page/page.tsx
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    title: t('myPage.title'),
    description: t('myPage.description'),
    alternates: {
      languages: {
        en: '/en/my-page',
        vi: '/vi/my-page',
      },
    },
  };
}

export default async function MyPage() {
  const t = await getTranslations('myPage');

  return (
    <div>
      <h1>{t('heading')}</h1>
    </div>
  );
}
```

### Dynamic Routes

For dynamic routes, ensure the locale parameter is properly typed:

```typescript
// app/[locale]/items/[id]/page.tsx
type Props = {
  params: { locale: string; id: string };
};

export default async function ItemPage({ params: { locale, id } }: Props) {
  const t = await getTranslations({ locale, namespace: 'items' });

  return (
    <div>
      <h1>{t('itemDetails')}</h1>
      <p>Item ID: {id}</p>
    </div>
  );
}
```

### Layouts

Layouts can also use translations:

```typescript
// app/[locale]/my-section/layout.tsx
import { getTranslations } from 'next-intl/server';

export default async function SectionLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'navigation' });

  return (
    <div>
      <nav>
        <h2>{t('sectionTitle')}</h2>
      </nav>
      {children}
    </div>
  );
}
```

## Using Translations in Components

### Server Components

Server Components use the `getTranslations` function:

```typescript
import { getTranslations } from 'next-intl/server';

export default async function ServerComponent() {
  const t = await getTranslations('common');

  return (
    <div>
      <button>{t('submit')}</button>
      <button>{t('cancel')}</button>
    </div>
  );
}
```

**Benefits:**

- Translations included in initial HTML
- No client-side JavaScript needed for translations
- Better performance and SEO

**When to use:**

- Static content
- Initial page render
- SEO-critical content

### Client Components

Client Components use the `useTranslations` hook:

```typescript
'use client';

import { useTranslations } from 'next-intl';

export function ClientComponent() {
  const t = useTranslations('common');

  return (
    <div>
      <button onClick={() => console.log('clicked')}>
        {t('submit')}
      </button>
    </div>
  );
}
```

**Benefits:**

- Reactive updates when locale changes
- Works with client-side interactivity
- Access to React hooks

**When to use:**

- Interactive components
- Components with state
- Event handlers
- Client-side navigation

### Multiple Namespaces

You can use multiple namespaces in a single component:

```typescript
'use client';

import { useTranslations } from 'next-intl';

export function MultiNamespaceComponent() {
  const tCommon = useTranslations('common');
  const tErrors = useTranslations('errors');

  return (
    <div>
      <button>{tCommon('submit')}</button>
      <p className="error">{tErrors('validationFailed')}</p>
    </div>
  );
}
```

### Accessing Current Locale

```typescript
'use client';

import { useLocale } from 'next-intl';

export function LocaleDisplay() {
  const locale = useLocale();

  return <p>Current locale: {locale}</p>;
}
```

### Rich Text and HTML

For translations containing HTML or rich formatting:

```json
{
  "terms": "I agree to the <link>terms and conditions</link>"
}
```

```typescript
const t = useTranslations('auth');

<p>
  {t.rich('terms', {
    link: (chunks) => <a href="/terms">{chunks}</a>
  })}
</p>
```

## Adding New Locales

### Step 1: Update i18n Configuration

Add the new locale to `i18n/config.ts`:

```typescript
// i18n/config.ts
export const locales = ["en", "vi", "fr"] as const; // Add 'fr' for French
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  vi: "Tiếng Việt",
  fr: "Français", // Add French
};
```

### Step 2: Create Translation Directory

Create a new directory for the locale:

```bash
mkdir -p messages/fr
```

### Step 3: Copy Translation Files

Copy all translation files from English and translate them:

```bash
cp messages/en/*.json messages/fr/
```

Then translate each file:

```json
// messages/fr/common.json
{
  "submit": "Soumettre",
  "cancel": "Annuler",
  "save": "Enregistrer"
}
```

### Step 4: Update Metadata Alternates

Update pages that generate metadata to include the new locale:

```typescript
export async function generateMetadata({
  params: { locale },
}: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("home.title"),
    description: t("home.description"),
    alternates: {
      languages: {
        en: "/en",
        vi: "/vi",
        fr: "/fr", // Add new locale
      },
    },
  };
}
```

### Step 5: Test the New Locale

1. Navigate to `/fr` in your browser
2. Verify all translations display correctly
3. Test the language switcher
4. Verify metadata and hreflang tags

## Testing i18n Features

### Unit Testing Translations

```typescript
// __tests__/i18n.test.ts
import { describe, it, expect } from "@jest/globals";
import enCommon from "@/messages/en/common.json";
import viCommon from "@/messages/vi/common.json";

describe("Translation files", () => {
  it("should have matching keys between locales", () => {
    const enKeys = Object.keys(enCommon);
    const viKeys = Object.keys(viCommon);

    expect(enKeys.sort()).toEqual(viKeys.sort());
  });

  it("should not have empty translations", () => {
    Object.values(enCommon).forEach((value) => {
      expect(value).toBeTruthy();
    });
  });
});
```

### Testing Components with Translations

```typescript
// __tests__/components/MyComponent.test.tsx
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import MyComponent from '@/components/MyComponent';

const messages = {
  common: {
    submit: 'Submit',
    cancel: 'Cancel',
  },
};

describe('MyComponent', () => {
  it('should render translated text', () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <MyComponent />
      </NextIntlClientProvider>
    );

    expect(screen.getByText('Submit')).toBeInTheDocument();
  });
});
```

### Integration Testing with Playwright

```typescript
// e2e/i18n.spec.ts
import { test, expect } from "@playwright/test";

test.describe("i18n", () => {
  test("should switch languages", async ({ page }) => {
    await page.goto("/en/dashboard");

    // Verify English content
    await expect(page.locator("h1")).toContainText("Dashboard");

    // Switch to Vietnamese
    await page.selectOption('select[name="locale"]', "vi");
    await page.waitForURL("/vi/dashboard");

    // Verify Vietnamese content
    await expect(page.locator("h1")).toContainText("Bảng điều khiển");
  });

  test("should preserve query parameters", async ({ page }) => {
    await page.goto("/en/items?search=test&page=2");

    await page.selectOption('select[name="locale"]', "vi");
    await page.waitForURL("/vi/items?search=test&page=2");

    expect(page.url()).toContain("search=test");
    expect(page.url()).toContain("page=2");
  });
});
```

### Validation Script

Run the translation validation script to check for missing keys:

```bash
npm run validate:translations
```

This script checks:

- All namespace files exist for all locales
- All JSON files are valid
- No missing keys between locales

## Common Patterns

### Pattern 1: Conditional Translations

```typescript
const t = useTranslations('items');

<p>
  {items.length === 0
    ? t('noItems')
    : t('itemCount', { count: items.length })}
</p>
```

### Pattern 2: Pluralization

```json
{
  "items": {
    "zero": "No items",
    "one": "One item",
    "other": "{count} items"
  }
}
```

```typescript
const t = useTranslations('items');

// next-intl handles pluralization automatically
<p>{t('items', { count: items.length })}</p>
```

### Pattern 3: Date and Time Formatting

```typescript
import { useFormatter } from 'next-intl';

export function DateDisplay({ date }: { date: Date }) {
  const format = useFormatter();

  return (
    <time>
      {format.dateTime(date, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}
    </time>
  );
}
```

### Pattern 4: Number Formatting

```typescript
import { useFormatter } from 'next-intl';

export function PriceDisplay({ amount }: { amount: number }) {
  const format = useFormatter();

  return (
    <span>
      {format.number(amount, {
        style: 'currency',
        currency: 'USD'
      })}
    </span>
  );
}
```

### Pattern 5: Link with Locale

```typescript
import { Link } from '@/i18n/routing';

export function Navigation() {
  return (
    <nav>
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/items">Items</Link>
    </nav>
  );
}
```

### Pattern 6: Programmatic Navigation

```typescript
'use client';

import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

export function NavigateButton() {
  const router = useRouter();
  const locale = useLocale();

  const handleClick = () => {
    router.push(`/${locale}/dashboard`);
  };

  return <button onClick={handleClick}>Go to Dashboard</button>;
}
```

### Pattern 7: Form Validation Messages

```typescript
'use client';

import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

export function LoginForm() {
  const t = useTranslations('auth');
  const { register, formState: { errors } } = useForm();

  return (
    <form>
      <input
        {...register('email', {
          required: t('validation.emailRequired'),
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: t('validation.emailInvalid')
          }
        })}
      />
      {errors.email && <span>{errors.email.message}</span>}
    </form>
  );
}
```

### Pattern 8: Loading States

```typescript
'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

export function AsyncButton() {
  const t = useTranslations('common');
  const [loading, setLoading] = useState(false);

  return (
    <button disabled={loading}>
      {loading ? t('loading') : t('submit')}
    </button>
  );
}
```

### Pattern 9: Error Boundaries

```typescript
'use client';

import { useTranslations } from 'next-intl';

export function ErrorFallback({ error }: { error: Error }) {
  const t = useTranslations('errors');

  return (
    <div>
      <h2>{t('somethingWentWrong')}</h2>
      <p>{t('errorMessage', { message: error.message })}</p>
    </div>
  );
}
```

### Pattern 10: SEO with Structured Data

```typescript
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params: { locale } }: Props) {
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("home.title"),
    description: t("home.description"),
    openGraph: {
      title: t("home.ogTitle"),
      description: t("home.ogDescription"),
      locale: locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("home.twitterTitle"),
      description: t("home.twitterDescription"),
    },
  };
}
```

## Troubleshooting

### Issue: Translation key not found

**Symptom:** Seeing the translation key instead of translated text

**Solution:**

1. Check that the key exists in the translation file
2. Verify you're using the correct namespace
3. Ensure the translation file is valid JSON
4. Run `npm run validate:translations`

### Issue: Locale not switching

**Symptom:** Language switcher doesn't change the locale

**Solution:**

1. Check that the locale is in the `locales` array in `i18n/config.ts`
2. Verify middleware is properly configured
3. Check browser console for errors
4. Ensure you're using the correct navigation method

### Issue: TypeScript errors with translation keys

**Symptom:** TypeScript complaining about translation keys

**Solution:**

1. Ensure `types/i18n.ts` is properly configured
2. Restart TypeScript server in your IDE
3. Check that translation files are imported correctly in type definitions

### Issue: Translations not updating in development

**Symptom:** Changes to translation files not reflected

**Solution:**

1. Restart the development server
2. Clear Next.js cache: `rm -rf .next`
3. Check for syntax errors in JSON files

### Issue: Missing translations in production

**Symptom:** Translations work in development but not in production

**Solution:**

1. Ensure translation files are included in the build
2. Check that `messages/` directory is not in `.gitignore`
3. Verify build process completes without errors
4. Run `npm run build` locally to test

### Issue: Middleware conflicts

**Symptom:** i18n middleware interfering with auth or other middleware

**Solution:**

1. Check middleware order in `middleware.ts`
2. Ensure i18n middleware runs first
3. Verify matcher patterns don't conflict
4. Check that API routes are excluded from i18n middleware

### Issue: Hydration errors

**Symptom:** React hydration mismatch errors

**Solution:**

1. Ensure Server and Client Components use translations consistently
2. Don't mix server and client translation methods
3. Check that locale is properly passed to components
4. Verify `suppressHydrationWarning` is set on `<html>` tag

### Issue: 404 page errors

**Symptom:** "Missing <html> and <body> tags" error when accessing non-existent pages

**Solution:**

1. Ensure root `app/layout.tsx` has `<html>` and `<body>` tags
2. Create `app/not-found.tsx` for root-level 404 handling
3. Create `app/[locale]/not-found.tsx` for locale-specific 404 pages
4. Add `notFound` translations to `messages/*/errors.json` files

## Best Practices

1. **Namespace Organization**: Keep related translations in the same namespace
2. **Consistent Keys**: Use consistent naming conventions (camelCase recommended)
3. **Avoid Hardcoded Text**: Always use translation keys, never hardcode user-facing text
4. **Translation Variables**: Use variables for dynamic content instead of string concatenation
5. **Server Components First**: Prefer Server Components for better performance
6. **Type Safety**: Leverage TypeScript for translation key validation
7. **Validation**: Run translation validation before deploying
8. **Documentation**: Document translation keys that need context for translators
9. **Fallbacks**: Always provide fallback translations for missing keys
10. **Testing**: Test all locales, not just the default

## Additional Resources

- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [Next.js Internationalization](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
- [Project i18n Configuration](../i18n/config.ts)
- [Translation Validation Script](../scripts/validate-translations.ts)

## Support

For questions or issues with i18n implementation:

1. Check this documentation
2. Review the design document: `.kiro/specs/nextjs-i18n-integration/design.md`
3. Check existing translation files for examples
4. Run validation script to identify issues
