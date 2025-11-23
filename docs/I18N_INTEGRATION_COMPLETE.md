# Complete i18n Integration Guide

## ✅ Completed

### Translation Files Created/Updated

1. ✅ `messages/en/validation.json` - Validation messages
2. ✅ `messages/vi/validation.json` - Validation messages (Vietnamese)
3. ✅ `messages/en/items.json` - Added form dialog descriptions and upload prompts
4. ✅ `messages/vi/items.json` - Added form dialog descriptions and upload prompts
5. ✅ `messages/en/table.json` - Added density labels
6. ✅ `messages/vi/table.json` - Added density labels

### Components Updated

1. ✅ `components/features/items/item-form-dialog.tsx` - Dialog descriptions and upload text
2. ✅ `components/shared/data-table/data-table-view-options.tsx` - Density labels

## 📋 Remaining Tasks

### High Priority

#### 1. Zod Schema Internationalization

**File**: `lib/zod/schemas.ts`

The Zod schemas currently have hard-coded English error messages. These need to be made dynamic.

**Solution**: Create a helper function that accepts locale:

```typescript
// lib/zod/i18n-schemas.ts
import { z } from "zod";

export function getItemSchema(t: (key: string) => string) {
  return z.object({
    title: z
      .string()
      .min(1, t("validation.title.required"))
      .max(100, t("validation.title.maxLength")),
    description: z
      .string()
      .max(500, t("validation.description.maxLength"))
      .optional()
      .nullable(),
    status: z.enum(["active", "inactive", "archived"]),
    image_url: z
      .string()
      .url({ message: t("validation.imageUrl.invalid") })
      .optional()
      .nullable()
      .or(z.literal("")),
  });
}
```

**Usage in components**:

```typescript
const t = useTranslations();
const schema = getItemSchema(t);
const form = useForm({
  resolver: zodResolver(schema),
  // ...
});
```

#### 2. API Error Messages

**Files**: `lib/api/errors.ts`, `app/api/*/route.ts`

API error messages are currently in English. Create error translation mapping:

```typescript
// lib/api/error-messages.ts
export function getErrorMessage(
  code: string,
  t: (key: string) => string
): string {
  const errorMap: Record<string, string> = {
    UNAUTHORIZED: t("errors.api.unauthorized"),
    FORBIDDEN: t("errors.api.forbidden"),
    NOT_FOUND: t("errors.api.notFound"),
    VALIDATION_ERROR: t("errors.api.validationError"),
    INTERNAL_ERROR: t("errors.api.internalError"),
  };

  return errorMap[code] || t("errors.api.unknown");
}
```

**Add to translation files**:

```json
// messages/en/errors.json
{
  "api": {
    "unauthorized": "Authentication required",
    "forbidden": "You don't have permission to perform this action",
    "notFound": "Resource not found",
    "validationError": "Validation failed",
    "internalError": "An error occurred. Please try again",
    "unknown": "An unexpected error occurred"
  }
}
```

#### 3. Toast Notifications

**Files**: All components using `toast.error()`, `toast.success()`

Currently using hard-coded messages. Update to use translations:

**Before**:

```typescript
toast.error("Failed to save item");
```

**After**:

```typescript
toast.error(t("items.form.saveFailed"));
```

#### 4. Metadata Generation

**Files**: All `page.tsx` files with `generateMetadata`

Ensure all metadata uses `getTranslations()`:

```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("items.title"),
    description: t("items.description"),
  };
}
```

### Medium Priority

#### 5. Column Headers Translation

**File**: `components/features/items/items-table-columns.tsx`

Column headers use `useTranslations()` but need to be called at the component level, not in the column definition:

**Current Issue**: `useTranslations()` is called inside column definitions
**Solution**: Pass translations as parameter to `getItemsTableColumns()`

```typescript
export function getItemsTableColumns({
  onEdit,
  onDelete,
  t, // Add this parameter
}: ItemsTableColumnsProps & { t: (key: string) => string }) {
  return [
    // ... columns using t()
  ];
}
```

#### 6. Empty States

**Files**: All pages with empty states

Ensure all "No items found", "No results" messages use translations.

#### 7. Loading States

**Files**: All components with loading text

Replace "Loading...", "Saving...", "Uploading..." with translations.

#### 8. Placeholder Text

**Files**: All form inputs

Ensure all placeholder text uses translations.

#### 9. Button Labels

**Files**: All components with buttons

Verify all button text is translated.

#### 10. Dialog Titles and Descriptions

**Files**: All dialog components

Ensure all dialog content is translated.

### Low Priority

#### 11. Storybook Stories

**Files**: `stories/**/*.stories.tsx`

Add i18n support to Storybook stories.

#### 12. Error Boundaries

**Files**: Error boundary components

Translate error boundary messages.

#### 13. 404/403 Pages

**Files**: `app/[locale]/not-found.tsx`, `app/[locale]/403/page.tsx`

Ensure error pages are fully translated.

## 🔧 Implementation Strategy

### Phase 1: Core Functionality (Completed ✅)

- ✅ Translation files structure
- ✅ Basic component translations
- ✅ Form dialog translations

### Phase 2: Validation & Errors (Next)

1. Create i18n-aware Zod schemas
2. Translate API error messages
3. Update toast notifications
4. Add error message translations

### Phase 3: Components (After Phase 2)

1. Update all table components
2. Translate all dialogs
3. Update all forms
4. Translate empty states

### Phase 4: Pages & Metadata (Final)

1. Update all page metadata
2. Translate all page content
3. Update error pages
4. Final audit

## 📝 Translation File Structure

```
messages/
├── en/
│   ├── common.json          # Shared UI text
│   ├── navigation.json      # Nav, sidebar, menu
│   ├── auth.json           # Authentication
│   ├── items.json          # Items feature
│   ├── users.json          # Users feature
│   ├── table.json          # Data table
│   ├── dashboard.json      # Dashboard
│   ├── settings.json       # Settings
│   ├── upload.json         # File upload
│   ├── metadata.json       # Page metadata
│   ├── errors.json         # Error messages
│   └── validation.json     # Form validation
└── vi/
    └── (same structure)
```

## 🎯 Best Practices

### 1. Namespace Organization

- Use dot notation: `items.form.title`
- Group related keys: `items.form.*`, `items.table.*`
- Keep namespaces focused and small

### 2. Component Patterns

**Client Components**:

```typescript
'use client';
import { useTranslations } from 'next-intl';

export function MyComponent() {
  const t = useTranslations('namespace');
  return <div>{t('key')}</div>;
}
```

**Server Components**:

```typescript
import { getTranslations } from 'next-intl/server';

export async function MyServerComponent() {
  const t = await getTranslations('namespace');
  return <div>{t('key')}</div>;
}
```

### 3. Reusable Components

For shared components, accept translation keys as props:

```typescript
interface Props {
  titleKey: string;
  descriptionKey: string;
}

export function SharedComponent({ titleKey, descriptionKey }: Props) {
  const t = useTranslations();
  return (
    <div>
      <h1>{t(titleKey)}</h1>
      <p>{t(descriptionKey)}</p>
    </div>
  );
}
```

### 4. Dynamic Values

Use ICU message format for dynamic values:

```json
{
  "greeting": "Hello, {name}!",
  "itemCount": "You have {count, plural, =0 {no items} =1 {one item} other {# items}}"
}
```

```typescript
t("greeting", { name: "John" });
t("itemCount", { count: 5 });
```

### 5. Validation Messages

Create locale-aware schema factories:

```typescript
export function createItemSchema(locale: string) {
  const t = getTranslations({ locale, namespace: "validation" });
  return z.object({
    title: z.string().min(1, t("title.required")),
    // ...
  });
}
```

## 🧪 Testing i18n

### 1. Manual Testing

- Switch between locales
- Verify all text changes
- Check for missing translations
- Test pluralization
- Verify date/number formatting

### 2. Automated Testing

```typescript
// Test translation keys exist
import en from "@/messages/en/items.json";
import vi from "@/messages/vi/items.json";

test("all English keys have Vietnamese translations", () => {
  const enKeys = Object.keys(en);
  const viKeys = Object.keys(vi);
  expect(viKeys).toEqual(enKeys);
});
```

### 3. Build-time Validation

The `validate-translations.ts` script checks for:

- Missing keys
- Unused keys
- Malformed JSON
- Inconsistent structure

Run: `npm run validate:translations`

## 🚀 Deployment Checklist

- [ ] All hard-coded strings removed
- [ ] All translation files complete
- [ ] Validation messages translated
- [ ] Error messages translated
- [ ] Metadata translated
- [ ] Toast notifications translated
- [ ] Empty states translated
- [ ] Loading states translated
- [ ] Placeholders translated
- [ ] Button labels translated
- [ ] Dialog content translated
- [ ] Table headers translated
- [ ] Form labels translated
- [ ] API errors mapped
- [ ] Build passes
- [ ] Translation validation passes
- [ ] Manual testing in both locales
- [ ] No console warnings about missing keys

## 📚 Resources

- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [ICU Message Format](https://unicode-org.github.io/icu/userguide/format_parse/messages/)
- [Project i18n README](../lib/i18n/README.md)
- [Translation Validation Script](../scripts/validate-translations.ts)

## 🔍 Finding Untranslated Strings

Use these commands to find hard-coded strings:

```bash
# Find potential English strings in components
grep -r '"[A-Z][a-z]* [a-z]*"' components/ --include="*.tsx"

# Find hard-coded error messages
grep -r 'toast\.(error|success)' components/ --include="*.tsx"

# Find hard-coded placeholders
grep -r 'placeholder="[^{]' components/ --include="*.tsx"

# Find hard-coded button text
grep -r '<Button.*>[A-Z]' components/ --include="*.tsx"
```

## 💡 Tips

1. **Use translation keys consistently**: `feature.section.element`
2. **Keep translations close to usage**: Don't over-nest
3. **Provide context in keys**: `form.submit` vs `form.submitButton`
4. **Use descriptive keys**: `items.empty.noResults` vs `items.empty1`
5. **Group related translations**: All form fields under `form.*`
6. **Document complex translations**: Add comments in JSON
7. **Test edge cases**: Long text, special characters, plurals
8. **Consider RTL languages**: Plan for future expansion
9. **Use TypeScript**: Type-safe translation keys
10. **Automate validation**: Run checks in CI/CD

## 🎉 Success Criteria

The i18n integration is complete when:

1. ✅ No hard-coded user-facing strings remain
2. ✅ All UI text changes when switching locales
3. ✅ Validation messages are translated
4. ✅ Error messages are translated
5. ✅ Metadata is translated
6. ✅ Build completes without warnings
7. ✅ Translation validation passes
8. ✅ Manual testing confirms all text is translated
9. ✅ No missing translation key warnings in console
10. ✅ Both locales provide complete user experience
