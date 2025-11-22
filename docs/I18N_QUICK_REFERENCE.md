# i18n Quick Reference

Quick reference guide for common i18n tasks in this Next.js application.

## Quick Links

- [Full Guide](./I18N_GUIDE.md)
- [Design Document](../../.kiro/specs/nextjs-i18n-integration/design.md)
- [Requirements](../../.kiro/specs/nextjs-i18n-integration/requirements.md)

## Cheat Sheet

### Import Statements

```typescript
// Server Components
import { getTranslations } from "next-intl/server";

// Client Components
import { useTranslations, useLocale } from "next-intl";

// Formatting
import { useFormatter } from "next-intl";
```

### Basic Usage

```typescript
// Server Component
const t = await getTranslations('namespace');
<p>{t('key')}</p>

// Client Component
const t = useTranslations('namespace');
<p>{t('key')}</p>

// With variables
<p>{t('welcome', { name: 'John' })}</p>

// Nested keys
<p>{t('section.subsection.key')}</p>
```

### File Locations

```
messages/
├── en/
│   ├── common.json      # Shared UI elements
│   ├── auth.json        # Authentication
│   ├── dashboard.json   # Dashboard
│   ├── items.json       # Items feature
│   ├── navigation.json  # Navigation
│   ├── errors.json      # Error messages
│   └── metadata.json    # SEO metadata
└── vi/
    └── ... (same structure)
```

### Adding a Translation

1. Add to `messages/en/namespace.json`:

   ```json
   {
     "myKey": "My translation"
   }
   ```

2. Add to `messages/vi/namespace.json`:

   ```json
   {
     "myKey": "Bản dịch của tôi"
   }
   ```

3. Use in code:
   ```typescript
   const t = useTranslations('namespace');
   <p>{t('myKey')}</p>
   ```

### Creating a New Page

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
  };
}

export default async function MyPage() {
  const t = await getTranslations('myPage');
  return <h1>{t('heading')}</h1>;
}
```

### Common Patterns

```typescript
// Multiple namespaces
const tCommon = useTranslations('common');
const tErrors = useTranslations('errors');

// Current locale
const locale = useLocale();

// Date formatting
const format = useFormatter();
format.dateTime(new Date(), { dateStyle: 'long' });

// Number formatting
format.number(1234.56, { style: 'currency', currency: 'USD' });

// Conditional translation
{isError ? t('errors.failed') : t('common.success')}

// Rich text
t.rich('terms', {
  link: (chunks) => <a href="/terms">{chunks}</a>
})
```

### Validation

```bash
# Validate all translations
npm run validate:translations

# Build (includes validation)
npm run build
```

### Testing

```typescript
// Component test
import { NextIntlClientProvider } from 'next-intl';

const messages = { common: { submit: 'Submit' } };

render(
  <NextIntlClientProvider locale="en" messages={messages}>
    <MyComponent />
  </NextIntlClientProvider>
);
```

### Troubleshooting

| Issue                | Solution                                    |
| -------------------- | ------------------------------------------- |
| Key not found        | Check namespace and key exist in JSON file  |
| Locale not switching | Verify locale in `i18n/config.ts`           |
| TypeScript errors    | Restart TS server, check `types/i18n.ts`    |
| Not updating         | Restart dev server, clear `.next` cache     |
| Hydration errors     | Don't mix server/client translation methods |

### Commands

```bash
# Development
npm run dev

# Validate translations
npm run validate:translations

# Build
npm run build

# Type check
npm run type-check
```

### Supported Locales

- `en` - English (default)
- `vi` - Vietnamese (Tiếng Việt)

### URL Structure

```
/en/dashboard        # English dashboard
/vi/dashboard        # Vietnamese dashboard
/en/items/123        # English item detail
/vi/items/123        # Vietnamese item detail
```

### Metadata Template

```typescript
export async function generateMetadata({
  params: { locale },
}: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("page.title"),
    description: t("page.description"),
    alternates: {
      languages: {
        en: "/en/page",
        vi: "/vi/page",
      },
    },
    openGraph: {
      locale: locale,
      alternateLocale: locale === "en" ? "vi" : "en",
    },
  };
}
```

### Component Templates

**Server Component:**

```typescript
import { getTranslations } from 'next-intl/server';

export default async function ServerComp() {
  const t = await getTranslations('namespace');
  return <div>{t('key')}</div>;
}
```

**Client Component:**

```typescript
'use client';
import { useTranslations } from 'next-intl';

export function ClientComp() {
  const t = useTranslations('namespace');
  return <div>{t('key')}</div>;
}
```

## Need More Help?

See the [full i18n guide](./I18N_GUIDE.md) for detailed documentation.
