# i18n Utilities

This directory contains utility functions for internationalization (i18n) in the Next.js application.

## Locale Cookie Management

The `locale-cookie.ts` module provides utilities for persisting user locale preferences using cookies.

### Features

- **Cookie-based persistence**: User locale preferences are stored in a cookie that lasts for 1 year
- **Automatic locale detection**: The middleware reads the locale cookie and redirects users to their preferred locale
- **Client-side utilities**: Helper functions for setting, getting, and clearing locale preferences

### Usage

#### Setting a Locale Preference

```typescript
import { setLocaleCookie } from "@/lib/i18n/locale-cookie";

// Set the user's locale preference
setLocaleCookie("vi"); // or "en"
```

#### Getting the Current Locale Preference

```typescript
import { getLocaleCookie } from "@/lib/i18n/locale-cookie";

// Get the stored locale preference
const locale = getLocaleCookie(); // Returns "en", "vi", or null
```

#### Clearing the Locale Preference

```typescript
import { clearLocaleCookie } from "@/lib/i18n/locale-cookie";

// Clear the stored locale preference
clearLocaleCookie();
```

### How It Works

1. **Language Switcher**: When a user selects a language using the `LanguageSwitcher` component, the locale preference is saved to a cookie using `setLocaleCookie()`.

2. **Middleware Detection**: On subsequent visits, the middleware checks for the locale cookie:
   - If a valid locale cookie exists and the user visits the root URL (`/`), they are redirected to their preferred locale (e.g., `/vi` or `/en`)
   - The middleware also sets/updates the locale cookie on every request to ensure it stays fresh

3. **Persistence**: The cookie has a max age of 1 year, so the user's preference is remembered across sessions.

### Cookie Configuration

The locale cookie is configured with the following settings:

- **Name**: `NEXT_LOCALE`
- **Max Age**: 1 year (31,536,000 seconds)
- **Path**: `/` (available across the entire site)
- **SameSite**: `Lax` (provides CSRF protection while allowing normal navigation)

### Integration with next-intl

The locale persistence system integrates seamlessly with next-intl's built-in locale detection:

1. next-intl's middleware handles the core locale routing
2. Our custom middleware layer adds cookie persistence on top
3. The locale cookie is read and respected during the locale detection phase

### Requirements Satisfied

This implementation satisfies **Requirement 11.5** from the i18n integration specification:

> WHEN the user's locale preference is set THEN the i18n System SHALL persist the preference for future visits

## Metadata Utilities

The `metadata.ts` module provides utilities for generating locale-aware metadata for SEO purposes.

See the main i18n documentation for more details on metadata generation.
