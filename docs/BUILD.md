# Build and Deployment

Complete guide for building and deploying the application.

## Prerequisites

- Node.js 20+
- npm or yarn
- Environment variables configured

## Scripts

```bash
# Development
npm run dev                      # Start dev server

# Production
npm run build                    # Build with validation
npm run build:skip-validation    # Build without validation (CI/CD)
npm run build:verify             # Build and verify

# Validation
npm run validate:translations    # Validate translations
npm run verify:build             # Verify build output

# Quality
npm run type-check               # TypeScript check
npm run lint                     # Biome linting
npm run format:check             # Format check
```

## Build Process

Standard build includes:

1. Translation validation
2. Next.js compilation
3. Static page generation (all locales)

```bash
npm run build
```

## Translation Validation

**Script:** `scripts/validate-translations.ts`

**Checks:**

- File existence (all locales/namespaces)
- JSON validity
- Key consistency
- Structure consistency

**Usage:**

```bash
npm run validate:translations
```

**Output:**

```
✅ All translation files valid
   - 2 locales (en, vi)
   - 12 namespaces
   - 24 total files
```

**Supported:**

- **Locales:** en, vi
- **Namespaces:** common, auth, dashboard, items, navigation, errors, metadata, settings, users, table, upload, components

## Build Verification

**Script:** `scripts/verify-build.ts`

**Checks:**

- Build directory exists
- Locale pages generated
- Bundle optimization
- Code splitting

**Usage:**

```bash
npm run verify:build        # After build
npm run build:verify        # Build + verify
```

**Output:**

```
✅ Build verification passed
   - Total pages: 30
   - en pages: 15
   - vi pages: 15
```

## CI/CD Pipeline

**File:** `.github/workflows/ci.yml`

**Steps:**

1. Checkout
2. Setup Node.js 20.x
3. Install dependencies
4. Validate translations
5. Type check
6. Lint
7. Format check
8. Build
9. Verify build
10. Upload artifacts

**Required Secrets:**

```env
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT
IMAGEKIT_PRIVATE_KEY
```

**Run Locally:**

```bash
npm run validate:translations
npm run type-check
npm run lint
npm run format:check
npm run build
npm run verify:build
```

## Production Deployment

### Pre-Deployment Checklist

- [ ] Tests pass
- [ ] Translation validation passes
- [ ] Type checking passes
- [ ] Build completes
- [ ] Build verification passes
- [ ] Environment variables configured
- [ ] Database migrations applied

### Deployment Steps

```bash
npm run validate:translations
npm run type-check
npm run build
npm run verify:build
# Deploy to platform
```

### Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_key

# ImageKit
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_key
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=your_endpoint
IMAGEKIT_PRIVATE_KEY=your_key

# Optional
NEXT_PUBLIC_DEFAULT_LOCALE=en
```

### Static Generation

Build generates:

- `/en/*` - English pages (15)
- `/vi/*` - Vietnamese pages (15)
- Total: 30 static pages

### Bundle Optimization

- Code splitting (Next.js automatic)
- Translation splitting (per locale)
- Dynamic imports
- Tree shaking
- 42 chunks generated

## Implementation Details

### Translation Validation Script

**Features:**

- Validates all locale/namespace combinations
- Checks JSON syntax
- Detects missing/extra keys
- Provides detailed error messages

**Performance:** < 1 second

### Build Verification Script

**Features:**

- Verifies build directory
- Counts pages per locale
- Checks bundle optimization
- Warns about large chunks (>500KB)

**Performance:** < 1 second

### Package Scripts

**New:**

- `validate:translations`
- `verify:build`
- `build:verify`
- `build:skip-validation`

**Updated:**

- `build` - Now includes validation

## Troubleshooting

### Translation Validation Fails

**Missing keys:**

1. Check error message
2. Add key to locale file
3. Run validation

**Invalid JSON:**

1. Check file in error
2. Validate JSON syntax
3. Fix and run validation

### Build Fails

**Type errors:**

```bash
npm run type-check  # See errors
# Fix errors
npm run build
```

**Missing dependencies:**

```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Build Verification Fails

**No locale pages:**

1. Check `app/[locale]` exists
2. Verify `generateStaticParams`
3. Check Next.js config

**Large bundles:**

1. Run `npm run analyze`
2. Identify large dependencies
3. Use dynamic imports

### CI/CD Fails

**Secrets not configured:**

1. Go to GitHub settings
2. Add secrets
3. Re-run workflow

**Build timeout:**

1. Check for infinite loops
2. Optimize build
3. Increase timeout

### Deployment Issues

**Environment variables:**

1. Check platform settings
2. Add variables
3. Redeploy

**404 for locale routes:**

1. Verify middleware config
2. Check locale routing
3. Verify `[locale]` structure

## Maintenance

### Adding Locales

1. Update `LOCALES` in validation scripts
2. Create `messages/[locale]/` files
3. Update `i18n/config.ts`
4. Run validation

### Adding Namespaces

1. Update `NAMESPACES` in `validate-translations.ts`
2. Create namespace files for all locales
3. Run validation

## Performance

- Translation validation: < 1s
- Build verification: < 1s
- Full build: Optimized for production

## Requirements

✅ **12.1** - Build without errors/warnings
✅ **12.2** - Bundle size optimization
✅ **12.4** - Translation caching

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [next-intl Docs](https://next-intl-docs.vercel.app/)
- [Vercel Deployment](https://vercel.com/docs)
- [GitHub Actions](https://docs.github.com/en/actions)
