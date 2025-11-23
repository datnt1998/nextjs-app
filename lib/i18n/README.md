# i18n Utilities

Utility functions for internationalization in the Next.js application.

## Locale Cookie Management

**File:** `locale-cookie.ts`

Utilities for persisting user locale preferences using cookies.

### Features

- Cookie-based persistence (1 year)
- Automatic locale detection
- Client-side utilities

### Usage

**Set Locale:**

```typescript
import { setLocaleCookie } from "@/lib/i18n/locale-cookie";

setLocaleCookie("vi"); // or "en"
```

**Get Locale:**

```typescript
import { getLocaleCookie } from "@/lib/i18n/locale-cookie";

const locale = getLocaleCookie(); // Returns "en", "vi", or null
```

**Clear Locale:**

```typescript
import { clearLocaleCookie } from "@/lib/i18n/locale-cookie";

clearLocaleCookie();
```

### How It Works

1. **Language Switcher** - Saves preference using `setLocaleCookie()`
2. **Middleware Detection** - Reads cookie and redirects to preferred locale
3. **Persistence** - Cookie lasts 1 year, refreshed on each visit

### Cookie Configuration

- **Name:** `NEXT_LOCALE`
- **Max Age:** 1 year (31,536,000 seconds)
- **Path:** `/` (site-wide)
- **SameSite:** `Lax` (CSRF protection)

### Integration

Integrates with next-intl's locale detection:

1. next-intl handles core routing
2. Custom middleware adds cookie persistence
3. Cookie read during locale detection

### Requirements

✅ **11.5** - Persist locale preference for future visits

## Metadata Utilities

**File:** `metadata.ts`

Utilities for generating locale-aware metadata for SEO.

See main i18n documentation for details.

## Resources

- [Full i18n Guide](../../docs/I18N_GUIDE.md)
- [Quick Reference](../../docs/I18N_QUICK_REFERENCE.md)
- [Examples](../../docs/I18N_EXAMPLES.md)
