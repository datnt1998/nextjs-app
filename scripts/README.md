# Build and Validation Scripts

Scripts for validating and verifying the Next.js i18n application.

## validate-translations.ts

Validates translation files for integrity across locales.

**Usage:**

```bash
npm run validate:translations
```

**Checks:**

- File existence for all locales/namespaces
- JSON validity
- Key consistency across locales
- Structure consistency

**Exit Codes:**

- `0` - All validations passed
- `1` - Validation errors found

**Success Output:**

```
✅ All translation files valid
   - 2 locales validated
   - 12 namespaces per locale
   - 24 total files checked
```

## verify-build.ts

Verifies production build output.

**Usage:**

```bash
npm run verify:build  # After building
```

**Prerequisites:**

- Must run after `npm run build`
- Requires `.next` directory

**Checks:**

- Build directory exists
- Locale pages generated
- Bundle optimization
- Translation code splitting

**Exit Codes:**

- `0` - Verification passed
- `1` - Verification errors found

**Success Output:**

```
✅ Build verification passed
   - Total pages: 30
   - en pages: 15
   - vi pages: 15
```

## Configuration

**Supported Locales:**

```typescript
const LOCALES = ["en", "vi"] as const;
```

**Supported Namespaces:**

```typescript
const NAMESPACES = [
  "common",
  "auth",
  "dashboard",
  "items",
  "navigation",
  "errors",
  "metadata",
  "settings",
  "users",
  "table",
  "upload",
  "components",
] as const;
```

## Adding Locales

1. Update `LOCALES` in both scripts
2. Create translation files in `messages/[locale]/`
3. Update `i18n/config.ts`
4. Run validation

## Adding Namespaces

1. Update `NAMESPACES` in `validate-translations.ts`
2. Create namespace files for all locales
3. Run validation

## Troubleshooting

**Missing files:**

```
❌ Missing translation file: messages/vi/common.json
```

Solution: Create the missing file

**Invalid JSON:**

```
❌ Invalid JSON in file: messages/en/auth.json
```

Solution: Fix JSON syntax

**Missing keys:**

```
❌ Missing translation key "submit" in vi/auth.json
```

Solution: Add missing key

**Build directory not found:**

```
❌ Build directory does not exist. Run "npm run build" first.
```

Solution: Run `npm run build`

## CI/CD Integration

Scripts integrated in pipeline:

```yaml
- name: Validate translations
  run: npm run validate:translations

- name: Build
  run: npm run build:skip-validation

- name: Verify build
  run: npm run verify:build
```

## Development Workflow

**Before committing:**

```bash
npm run validate:translations
npm run type-check
npm run lint
```

**Before deploying:**

```bash
npm run validate:translations
npm run type-check
npm run build
npm run verify:build
```

## Performance

- **validate-translations.ts:** < 1 second
- **verify-build.ts:** < 1 second (requires existing build)

Both scripts are fast and can run frequently during development.
