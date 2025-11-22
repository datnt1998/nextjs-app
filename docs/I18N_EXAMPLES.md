# i18n Code Examples

Practical code examples for common i18n scenarios in this Next.js application.

## Table of Contents

1. [Basic Examples](#basic-examples)
2. [Page Examples](#page-examples)
3. [Component Examples](#component-examples)
4. [Form Examples](#form-examples)
5. [Navigation Examples](#navigation-examples)
6. [Advanced Examples](#advanced-examples)

## Basic Examples

### Simple Server Component

```typescript
// app/[locale]/example/page.tsx
import { getTranslations } from 'next-intl/server';

export default async function ExamplePage() {
  const t = await getTranslations('common');

  return (
    <div>
      <h1>{t('welcome')}</h1>
      <button>{t('submit')}</button>
      <button>{t('cancel')}</button>
    </div>
  );
}
```

### Simple Client Component

```typescript
// components/example-button.tsx
'use client';

import { useTranslations } from 'next-intl';

export function ExampleButton() {
  const t = useTranslations('common');

  const handleClick = () => {
    alert(t('clickedMessage'));
  };

  return (
    <button onClick={handleClick}>
      {t('clickMe')}
    </button>
  );
}
```

### Translation with Variables

```typescript
// Translation file: messages/en/dashboard.json
{
  "welcome": "Welcome back, {name}!",
  "itemCount": "You have {count} {count, plural, one {item} other {items}}",
  "lastLogin": "Last login: {date}"
}

// Component
'use client';

import { useTranslations, useFormatter } from 'next-intl';

export function UserGreeting({ user }: { user: User }) {
  const t = useTranslations('dashboard');
  const format = useFormatter();

  return (
    <div>
      <h1>{t('welcome', { name: user.name })}</h1>
      <p>{t('itemCount', { count: user.itemCount })}</p>
      <p>{t('lastLogin', {
        date: format.dateTime(user.lastLogin, { dateStyle: 'medium' })
      })}</p>
    </div>
  );
}
```

## Page Examples

### Basic Page with Metadata

```typescript
// app/[locale]/about/page.tsx
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    title: t('about.title'),
    description: t('about.description'),
    alternates: {
      languages: {
        en: '/en/about',
        vi: '/vi/about',
      },
    },
  };
}

export default async function AboutPage() {
  const t = await getTranslations('about');

  return (
    <div>
      <h1>{t('heading')}</h1>
      <p>{t('introduction')}</p>
      <section>
        <h2>{t('mission.title')}</h2>
        <p>{t('mission.description')}</p>
      </section>
    </div>
  );
}
```

### Dynamic Route Page

```typescript
// app/[locale]/blog/[slug]/page.tsx
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

type Props = {
  params: { locale: string; slug: string };
};

export async function generateMetadata({ params: { locale, slug } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'metadata' });
  const post = await getPost(slug);

  return {
    title: t('blog.postTitle', { title: post.title }),
    description: post.excerpt,
    alternates: {
      languages: {
        en: `/en/blog/${slug}`,
        vi: `/vi/blog/${slug}`,
      },
    },
  };
}

export default async function BlogPostPage({ params: { locale, slug } }: Props) {
  const t = await getTranslations({ locale, namespace: 'blog' });
  const post = await getPost(slug);

  return (
    <article>
      <h1>{post.title}</h1>
      <time>{t('publishedOn', { date: post.publishedAt })}</time>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
      <footer>
        <p>{t('author', { name: post.author })}</p>
      </footer>
    </article>
  );
}
```

### Page with Multiple Namespaces

```typescript
// app/[locale]/dashboard/overview/page.tsx
import { getTranslations } from 'next-intl/server';

export default async function DashboardOverview() {
  const tDashboard = await getTranslations('dashboard');
  const tCommon = await getTranslations('common');
  const tErrors = await getTranslations('errors');

  const stats = await getStats().catch(() => null);

  return (
    <div>
      <h1>{tDashboard('overview.title')}</h1>

      {stats ? (
        <div>
          <div>{tDashboard('stats.totalUsers', { count: stats.users })}</div>
          <div>{tDashboard('stats.totalItems', { count: stats.items })}</div>
        </div>
      ) : (
        <p>{tErrors('failedToLoad')}</p>
      )}

      <button>{tCommon('refresh')}</button>
    </div>
  );
}
```

## Component Examples

### Language Switcher

```typescript
// components/language-switcher.tsx
'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { locales, localeNames } from '@/i18n/config';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('common');

  const switchLocale = (newLocale: string) => {
    // Remove current locale from pathname
    const pathWithoutLocale = pathname.replace(`/${locale}`, '');
    // Navigate to same path with new locale
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  return (
    <div>
      <label htmlFor="locale-select">{t('selectLanguage')}</label>
      <select
        id="locale-select"
        value={locale}
        onChange={(e) => switchLocale(e.target.value)}
        className="border rounded px-2 py-1"
      >
        {locales.map((loc) => (
          <option key={loc} value={loc}>
            {localeNames[loc]}
          </option>
        ))}
      </select>
    </div>
  );
}
```

### Data Table with Translations

```typescript
// components/data-table.tsx
'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

type Item = {
  id: string;
  name: string;
  status: 'active' | 'inactive';
};

export function DataTable({ items }: { items: Item[] }) {
  const t = useTranslations('table');
  const [sortBy, setSortBy] = useState<'name' | 'status'>('name');

  return (
    <div>
      <h2>{t('title')}</h2>
      <table>
        <thead>
          <tr>
            <th onClick={() => setSortBy('name')}>
              {t('columns.name')}
            </th>
            <th onClick={() => setSortBy('status')}>
              {t('columns.status')}
            </th>
            <th>{t('columns.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={3}>{t('noData')}</td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{t(`status.${item.status}`)}</td>
                <td>
                  <button>{t('actions.edit')}</button>
                  <button>{t('actions.delete')}</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
```

### Modal with Translations

```typescript
// components/confirmation-modal.tsx
'use client';

import { useTranslations } from 'next-intl';
import { Dialog } from '@/components/ui/dialog';

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
};

export function ConfirmationModal({ open, onClose, onConfirm, title, message }: Props) {
  const t = useTranslations('common');

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <div>
        <h2>{title}</h2>
        <p>{message}</p>
        <div>
          <button onClick={onClose}>
            {t('cancel')}
          </button>
          <button onClick={onConfirm}>
            {t('confirm')}
          </button>
        </div>
      </div>
    </Dialog>
  );
}

// Usage
function ParentComponent() {
  const t = useTranslations('items');
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowModal(true)}>
        {t('deleteItem')}
      </button>

      <ConfirmationModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDelete}
        title={t('deleteConfirmation.title')}
        message={t('deleteConfirmation.message')}
      />
    </>
  );
}
```

## Form Examples

### Login Form

```typescript
// components/login-form.tsx
'use client';

import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { useState } from 'react';

type LoginFormData = {
  email: string;
  password: string;
};

export function LoginForm() {
  const t = useTranslations('auth');
  const tErrors = useTranslations('errors');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data);
    } catch (error) {
      alert(tErrors('loginFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1>{t('signIn.title')}</h1>

      <div>
        <label htmlFor="email">{t('signIn.email')}</label>
        <input
          id="email"
          type="email"
          {...register('email', {
            required: t('validation.emailRequired'),
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: t('validation.emailInvalid'),
            },
          })}
        />
        {errors.email && <span>{errors.email.message}</span>}
      </div>

      <div>
        <label htmlFor="password">{t('signIn.password')}</label>
        <input
          id="password"
          type="password"
          {...register('password', {
            required: t('validation.passwordRequired'),
            minLength: {
              value: 8,
              message: t('validation.passwordMinLength', { min: 8 }),
            },
          })}
        />
        {errors.password && <span>{errors.password.message}</span>}
      </div>

      <button type="submit" disabled={isLoading}>
        {isLoading ? t('signIn.loading') : t('signIn.submit')}
      </button>
    </form>
  );
}
```

### Search Form

```typescript
// components/search-form.tsx
'use client';

import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useState } from 'react';

export function SearchForm() {
  const t = useTranslations('common');
  const router = useRouter();
  const locale = useLocale();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set('q', query);
    } else {
      params.delete('q');
    }
    router.push(`/${locale}/search?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t('searchPlaceholder')}
        aria-label={t('searchLabel')}
      />
      <button type="submit">
        {t('search')}
      </button>
    </form>
  );
}
```

## Navigation Examples

### Navigation Menu

```typescript
// components/nav-menu.tsx
'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function NavMenu() {
  const t = useTranslations('navigation');
  const locale = useLocale();
  const pathname = usePathname();

  const links = [
    { href: `/${locale}/dashboard`, label: t('dashboard') },
    { href: `/${locale}/items`, label: t('items') },
    { href: `/${locale}/users`, label: t('users') },
    { href: `/${locale}/settings`, label: t('settings') },
  ];

  return (
    <nav>
      <ul>
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={isActive ? 'active' : ''}
                aria-current={isActive ? 'page' : undefined}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
```

### Breadcrumbs

```typescript
// components/breadcrumbs.tsx
'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Breadcrumbs() {
  const t = useTranslations('navigation');
  const locale = useLocale();
  const pathname = usePathname();

  // Remove locale from pathname and split
  const pathWithoutLocale = pathname.replace(`/${locale}`, '');
  const segments = pathWithoutLocale.split('/').filter(Boolean);

  return (
    <nav aria-label={t('breadcrumbs')}>
      <ol>
        <li>
          <Link href={`/${locale}`}>{t('home')}</Link>
        </li>
        {segments.map((segment, index) => {
          const href = `/${locale}/${segments.slice(0, index + 1).join('/')}`;
          const isLast = index === segments.length - 1;
          const label = t(`breadcrumb.${segment}`, { default: segment });

          return (
            <li key={href}>
              {isLast ? (
                <span aria-current="page">{label}</span>
              ) : (
                <Link href={href}>{label}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
```

## Advanced Examples

### Date and Time Formatting

```typescript
// components/date-display.tsx
'use client';

import { useFormatter, useTranslations } from 'next-intl';

type Props = {
  date: Date;
  showTime?: boolean;
  relative?: boolean;
};

export function DateDisplay({ date, showTime = false, relative = false }: Props) {
  const format = useFormatter();
  const t = useTranslations('common');

  if (relative) {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return <span>{t('time.justNow')}</span>;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return <span>{t('time.minutesAgo', { count: minutes })}</span>;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return <span>{t('time.hoursAgo', { count: hours })}</span>;
    }
  }

  return (
    <time dateTime={date.toISOString()}>
      {format.dateTime(date, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        ...(showTime && {
          hour: 'numeric',
          minute: 'numeric',
        }),
      })}
    </time>
  );
}
```

### Number and Currency Formatting

```typescript
// components/price-display.tsx
'use client';

import { useFormatter, useLocale } from 'next-intl';

type Props = {
  amount: number;
  currency?: string;
  showDecimals?: boolean;
};

export function PriceDisplay({ amount, currency = 'USD', showDecimals = true }: Props) {
  const format = useFormatter();
  const locale = useLocale();

  return (
    <span>
      {format.number(amount, {
        style: 'currency',
        currency,
        minimumFractionDigits: showDecimals ? 2 : 0,
        maximumFractionDigits: showDecimals ? 2 : 0,
      })}
    </span>
  );
}

// Usage
<PriceDisplay amount={1234.56} currency="USD" />
// Output (en): $1,234.56
// Output (vi): US$1.234,56
```

### Rich Text with Links

```typescript
// Translation file
{
  "terms": "By signing up, you agree to our <terms>Terms of Service</terms> and <privacy>Privacy Policy</privacy>",
  "help": "Need help? <link>Contact support</link> or visit our <docs>documentation</docs>"
}

// Component
'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

export function TermsText() {
  const t = useTranslations('auth');

  return (
    <p>
      {t.rich('terms', {
        terms: (chunks) => (
          <Link href="/terms" className="underline">
            {chunks}
          </Link>
        ),
        privacy: (chunks) => (
          <Link href="/privacy" className="underline">
            {chunks}
          </Link>
        ),
      })}
    </p>
  );
}

export function HelpText() {
  const t = useTranslations('common');

  return (
    <p>
      {t.rich('help', {
        link: (chunks) => (
          <a href="mailto:support@example.com" className="text-blue-600">
            {chunks}
          </a>
        ),
        docs: (chunks) => (
          <Link href="/docs" className="text-blue-600">
            {chunks}
          </Link>
        ),
      })}
    </p>
  );
}
```

### Error Boundary with Translations

```typescript
// components/error-boundary.tsx
'use client';

import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

export function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('errors');

  useEffect(() => {
    console.error('Error:', error);
  }, [error]);

  return (
    <div className="error-container">
      <h2>{t('somethingWentWrong')}</h2>
      <p>{t('errorMessage')}</p>
      {error.digest && (
        <p className="text-sm text-gray-500">
          {t('errorCode', { code: error.digest })}
        </p>
      )}
      <button onClick={reset}>
        {t('tryAgain')}
      </button>
    </div>
  );
}
```

### Loading State with Translations

```typescript
// components/loading-state.tsx
'use client';

import { useTranslations } from 'next-intl';

type Props = {
  message?: string;
  fullScreen?: boolean;
};

export function LoadingState({ message, fullScreen = false }: Props) {
  const t = useTranslations('common');

  return (
    <div className={fullScreen ? 'loading-fullscreen' : 'loading-inline'}>
      <div className="spinner" />
      <p>{message || t('loading')}</p>
    </div>
  );
}

// Usage in async component
export default async function DataPage() {
  const t = await getTranslations('common');
  const data = await fetchData();

  return (
    <Suspense fallback={<LoadingState message={t('loadingData')} />}>
      <DataDisplay data={data} />
    </Suspense>
  );
}
```

### Pagination with Translations

```typescript
// components/pagination.tsx
'use client';

import { useTranslations } from 'next-intl';

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function Pagination({ currentPage, totalPages, onPageChange }: Props) {
  const t = useTranslations('common');

  return (
    <nav aria-label={t('pagination.label')}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label={t('pagination.previous')}
      >
        {t('pagination.previous')}
      </button>

      <span>
        {t('pagination.pageInfo', {
          current: currentPage,
          total: totalPages,
        })}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label={t('pagination.next')}
      >
        {t('pagination.next')}
      </button>
    </nav>
  );
}
```

## Testing Examples

### Component Test

```typescript
// __tests__/components/language-switcher.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { LanguageSwitcher } from '@/components/language-switcher';

const messages = {
  common: {
    selectLanguage: 'Select Language',
  },
};

describe('LanguageSwitcher', () => {
  it('should render all available locales', () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <LanguageSwitcher />
      </NextIntlClientProvider>
    );

    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('Tiếng Việt')).toBeInTheDocument();
  });

  it('should call router.push when locale changes', () => {
    const mockPush = jest.fn();
    jest.mock('next/navigation', () => ({
      useRouter: () => ({ push: mockPush }),
      usePathname: () => '/en/dashboard',
    }));

    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <LanguageSwitcher />
      </NextIntlClientProvider>
    );

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'vi' } });

    expect(mockPush).toHaveBeenCalledWith('/vi/dashboard');
  });
});
```

### Integration Test

```typescript
// e2e/i18n.spec.ts
import { test, expect } from "@playwright/test";

test.describe("i18n Integration", () => {
  test("should display content in English by default", async ({ page }) => {
    await page.goto("/en/dashboard");

    await expect(page.locator("h1")).toContainText("Dashboard");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });

  test("should switch to Vietnamese and update content", async ({ page }) => {
    await page.goto("/en/dashboard");

    await page.selectOption('select[name="locale"]', "vi");
    await page.waitForURL("/vi/dashboard");

    await expect(page.locator("h1")).toContainText("Bảng điều khiển");
    await expect(page.locator("html")).toHaveAttribute("lang", "vi");
  });

  test("should preserve query parameters when switching locales", async ({
    page,
  }) => {
    await page.goto("/en/items?search=test&page=2");

    await page.selectOption('select[name="locale"]', "vi");
    await page.waitForURL("/vi/items?search=test&page=2");

    expect(page.url()).toContain("search=test");
    expect(page.url()).toContain("page=2");
  });
});
```

## More Examples

For more examples, see:

- Existing components in `components/` directory
- Page implementations in `app/[locale]/` directory
- Translation files in `messages/` directory
- [Full i18n Guide](./I18N_GUIDE.md)
