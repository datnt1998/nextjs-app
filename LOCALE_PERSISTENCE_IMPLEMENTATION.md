# Locale Persistence Implementation

This document describes the implementation of locale persistence for the Next.js i18n integration.

## Overview

The locale persistence feature allows users' language preferences to be remembered across sessions using browser cookies. When a user selects a language, their preference is stored and automatically applied on subsequent visits.

## Implementation Details

### 1. Cookie Configuration

**File**: `lib/i18n/locale-cookie.ts`

A new utility module was created to manage locale cookies with the following features:

- **Cookie Name**: `NEXT_LOCALE`
- **Max Age**: 1 year (31,536,000 seconds)
- **Path**: `/` (available site-wide)
- **SameSite**: `Lax` (CSRF protection)

**Functions**:

- `setLocaleCookie(locale)`: Sets the locale preference cookie (client-side)
- `getLocaleCookie()`: Retrieves the stored locale preference (client-side)
- `clearLocaleCookie()`: Removes the locale preference cookie (client-side)

### 2. Middleware Enhancement

**File**: `middleware.ts`

The middleware was enhanced to handle locale persistence:

#### Cookie Reading

- On each request, the middleware checks for the `NEXT_LOCALE` cookie
- If a valid locale cookie exists and the user visits the root URL (`/`), they are redirected to their preferred locale

#### Cookie Setting

- After locale detection by next-intl middleware, the detected locale is stored in a cookie
- This ensures the cookie is always up-to-date with the current locale
- The cookie is set on every request to keep it fresh (1-year expiration)

### 3. Language Switcher Update

**File**: `components/language-switcher.tsx`

The language switcher component was updated to persist locale changes:

- When a user selects a new language, `setLocaleCookie()` is called before navigation
- This ensures the preference is saved before the page reload
- The cookie is then read by the middleware on the next request

### 4. Routing Configuration

**File**: `i18n/routing.ts`

The routing configuration was updated to enable locale detection:

- Added `localeDetection: true` to the routing configuration
- Exported `LOCALE_COOKIE_NAME` constant for consistent cookie naming

## User Flow

### First Visit (No Cookie)

1. User visits the site (e.g., `https://example.com/`)
2. Middleware detects locale from `Accept-Language` header
3. User is redirected to locale-prefixed URL (e.g., `/en` or `/vi`)
4. Middleware sets the `NEXT_LOCALE` cookie with the detected locale

### Language Switch

1. User clicks language switcher and selects a different language
2. `setLocaleCookie()` is called to save the preference
3. Browser navigates to the new locale URL
4. Middleware reads the cookie and confirms the locale
5. Cookie expiration is refreshed (1 year from now)

### Subsequent Visits (Cookie Exists)

1. User visits the site (e.g., `https://example.com/`)
2. Middleware reads the `NEXT_LOCALE` cookie
3. User is immediately redirected to their preferred locale
4. No need to detect from `Accept-Language` header
5. Cookie expiration is refreshed

## Benefits

1. **Persistent Preferences**: User language choice is remembered for up to 1 year
2. **Seamless Experience**: Users don't need to select their language on every visit
3. **Performance**: Reduces reliance on `Accept-Language` header parsing
4. **User Control**: Users can change their preference at any time via the language switcher
5. **Privacy-Friendly**: Uses first-party cookies with appropriate SameSite settings

## Requirements Satisfied

This implementation satisfies all acceptance criteria for **Requirement 11.5**:

> **User Story**: As a user, I want my language preference to be remembered, so that I don't have to select it on every visit.
>
> **Acceptance Criteria**:
>
> - WHEN the user's locale preference is set THEN the i18n System SHALL persist the preference for future visits

## Testing

To test the locale persistence:

1. **Initial Visit**:
   - Clear browser cookies
   - Visit the site
   - Verify you're redirected to a locale-prefixed URL
   - Check browser DevTools → Application → Cookies for `NEXT_LOCALE`

2. **Language Switch**:
   - Use the language switcher to change languages
   - Verify the `NEXT_LOCALE` cookie is updated
   - Verify the page navigates to the new locale

3. **Persistence**:
   - Close the browser
   - Reopen and visit the site
   - Verify you're automatically redirected to your preferred locale
   - Verify the cookie still exists with the correct value

4. **Cookie Expiration**:
   - Check that the cookie has a max-age of 31,536,000 seconds (1 year)
   - Verify the cookie is refreshed on each visit

## Files Modified

1. `lib/i18n/locale-cookie.ts` - New utility module for cookie management
2. `middleware.ts` - Enhanced to read and set locale cookies
3. `components/language-switcher.tsx` - Updated to persist locale changes
4. `i18n/routing.ts` - Added locale detection configuration
5. `lib/i18n/README.md` - Documentation for locale persistence

## Technical Notes

- The implementation uses standard browser cookies (not localStorage) for better server-side access
- The middleware can read cookies on the server, enabling SSR with the correct locale
- The 1-year expiration ensures long-term persistence while allowing natural expiration
- The `SameSite=Lax` setting provides CSRF protection while allowing normal navigation
- The cookie is set on every request to keep it fresh and prevent premature expiration
