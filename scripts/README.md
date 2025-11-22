# Build and Validation Scripts

This directory contains scripts for validating and verifying the Next.js i18n application.

## Scripts

### validate-translations.ts

Validates all translation files to ensure translation integrity across all locales.

**Usage:**

```bash
npm run validate:translations
```

**What it checks:**

- All namespace files exist for all locales
- All JSON files are valid and parseable
- All translation keys exist in all locales
- Structure consistency across locales

**Exit codes:**

- `0` - All validations passed
- `1` - Validation errors found

**Example output:**

```
✅ All translation files are valid!
   - 2 locales validated
   - 12 namespaces per locale
   - 24 total files checked
```

### verify-build.ts

Verifies the production build output to ensure proper generation and optimization.

**Usage:**

```bash
npm run verify:build
```

**Prerequisites:**

- Must run after `npm run build`
- Requires `.next` directory to exist

**What it checks:**

- Build directory exists
- Locale-specific pages are generated
- Bundle optimization (code splitting)
- Translation code splitting

**Exit codes:**

- `0` - Build verification passed
- `1` - Verification errors found

**Example output:**

```
✅ Build verification passed!

   Statistics:
   - Total pages: 30
   - en pages: 15
   - vi pages: 15
```

## Configuration

### Supported Locales

Defined in both scripts:

```typescript
const LOCALES = ["en", "vi"] as const;
```

### Supported Namespaces

Defined in `validate-translations.ts`:

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

## Adding New Locales

To add a new locale:

1. Update `LOCALES` in both scripts
2. Create translation files in `messages/[locale]/`
3. Update `i18n/config.ts` with the new locale
4. Run validation to ensure all files exist

## Adding New Namespaces

To add a new namespace:

1. Update `NAMESPACES` in `validate-translations.ts`
2. Create the namespace file for all locales
3. Run validation to ensure consistency

## Troubleshooting

### Translation Validation Fails

**Missing files:**

```
❌ Found 1 error(s):
   Missing translation file: messages/vi/common.json
```

**Solution:** Create the missing file with the required translations.

**Invalid JSON:**

```
❌ Found 1 error(s):
   Invalid JSON in file: messages/en/auth.json
```

**Solution:** Fix the JSON syntax in the specified file.

**Missing keys:**

```
❌ Found 1 error(s):
   Missing translation key "submit" in vi/auth.json
```

**Solution:** Add the missing key to the specified locale file.

### Build Verification Fails

**Build directory not found:**

```
❌ Build verification failed!
   Errors:
   - Build directory does not exist. Run "npm run build" first.
```

**Solution:** Run `npm run build` before verification.

**No pages generated:**

```
⚠️  Warnings (1):
   - No locale-specific pages found in build output
```

**Solution:** Check that `app/[locale]` directory structure is correct.

## Integration with CI/CD

These scripts are integrated into the CI/CD pipeline:

```yaml
- name: Validate translations
  run: npm run validate:translations

- name: Build
  run: npm run build:skip-validation

- name: Verify build
  run: npm run verify:build
```

The build script (`npm run build`) automatically runs translation validation before building.

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

## Maintenance

### Updating Scripts

When updating these scripts:

1. Test locally with various scenarios
2. Update this README with any changes
3. Update the main documentation in `docs/BUILD_AND_DEPLOYMENT.md`
4. Ensure CI/CD pipeline still works

### Performance Considerations

- **validate-translations.ts**: Fast, runs in < 1 second
- **verify-build.ts**: Fast, runs in < 1 second (requires existing build)

Both scripts are designed to be fast and can be run frequently during development.
