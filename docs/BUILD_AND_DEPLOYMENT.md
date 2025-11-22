# Build and Deployment Guide

This guide covers the build and deployment process for the Next.js i18n application.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Build Scripts](#build-scripts)
- [Translation Validation](#translation-validation)
- [Build Verification](#build-verification)
- [CI/CD Pipeline](#cicd-pipeline)
- [Production Deployment](#production-deployment)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before building the application, ensure you have:

- Node.js 20.x or higher
- npm or yarn package manager
- All environment variables configured (see `.env.example`)

## Build Scripts

### Available Scripts

```bash
# Development server
npm run dev

# Production build with translation validation
npm run build

# Production build without validation (for CI/CD)
npm run build:skip-validation

# Build and verify
npm run build:verify

# Validate translations only
npm run validate:translations

# Verify build output only
npm run verify:build

# Type checking
npm run type-check

# Linting
npm run lint

# Format checking
npm run format:check
```

### Build Process

The standard build process includes:

1. **Translation Validation** - Validates all translation files
2. **Next.js Build** - Compiles the application
3. **Static Generation** - Generates static pages for all locales

```bash
npm run build
```

This command will:

- Validate all translation files exist and are valid JSON
- Check for missing translation keys across locales
- Build the Next.js application
- Generate static pages for all supported locales (en, vi)
- Optimize bundle sizes with code splitting

## Translation Validation

The translation validation script ensures translation integrity across all locales.

### What It Checks

1. **File Existence** - All namespace files exist for all locales
2. **JSON Validity** - All JSON files are valid and parseable
3. **Key Consistency** - All keys exist in all locales
4. **Structure Consistency** - Translation structure matches across locales

### Running Validation

```bash
npm run validate:translations
```

### Validation Output

**Success:**

```
✅ All translation files are valid!
   - 2 locales validated
   - 12 namespaces per locale
   - 24 total files checked
```

**Errors:**

```
❌ Found 2 error(s):

   Missing translation file: messages/vi/common.json
   Missing translation key "submit" in vi/auth.json
```

### Supported Locales

- `en` - English (base locale)
- `vi` - Vietnamese

### Supported Namespaces

- `common` - Common UI elements
- `auth` - Authentication pages
- `dashboard` - Dashboard pages
- `items` - Items feature
- `navigation` - Navigation elements
- `errors` - Error messages
- `metadata` - SEO metadata
- `settings` - Settings pages
- `users` - User management
- `table` - Data table components
- `upload` - Upload functionality
- `components` - Component showcase

## Build Verification

The build verification script checks the production build output.

### What It Checks

1. **Build Directory** - Verifies `.next` directory exists
2. **Locale Pages** - Counts generated pages per locale
3. **Bundle Optimization** - Checks for code splitting
4. **Translation Code Splitting** - Verifies translations are split

### Running Verification

```bash
# After building
npm run verify:build

# Or build and verify in one command
npm run build:verify
```

### Verification Output

**Success:**

```
✅ Build verification passed!

   Statistics:
   - Total pages: 24
   - en pages: 12
   - vi pages: 12

⚠️  Warnings (1):
   - Large chunk detected: main-abc123.js (512.34 KB)
```

## CI/CD Pipeline

The CI/CD pipeline runs on GitHub Actions for all pushes and pull requests.

### Pipeline Steps

1. **Checkout Code** - Clones the repository
2. **Setup Node.js** - Installs Node.js 20.x
3. **Install Dependencies** - Runs `npm ci`
4. **Validate Translations** - Runs translation validation
5. **Type Check** - Runs TypeScript type checking
6. **Lint** - Runs Biome linter
7. **Format Check** - Checks code formatting
8. **Build** - Builds the application
9. **Verify Build** - Verifies build output
10. **Upload Artifacts** - Uploads build artifacts

### Configuration

The CI workflow is defined in `.github/workflows/ci.yml`.

### Required Secrets

Configure these secrets in your GitHub repository:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY`
- `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT`
- `IMAGEKIT_PRIVATE_KEY`

### Running CI Locally

You can run the same checks locally:

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

- [ ] All tests pass
- [ ] Translation validation passes
- [ ] Type checking passes
- [ ] Build completes successfully
- [ ] Build verification passes
- [ ] Environment variables configured
- [ ] Database migrations applied (if any)

### Deployment Steps

1. **Validate Translations**

   ```bash
   npm run validate:translations
   ```

2. **Type Check**

   ```bash
   npm run type-check
   ```

3. **Build Application**

   ```bash
   npm run build
   ```

4. **Verify Build**

   ```bash
   npm run verify:build
   ```

5. **Deploy to Platform**
   - Vercel: `vercel --prod`
   - Other platforms: Follow platform-specific instructions

### Environment Variables

Ensure all required environment variables are set in your deployment platform:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# ImageKit
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key

# Optional: Override default locale
NEXT_PUBLIC_DEFAULT_LOCALE=en
```

### Static Page Generation

The build process automatically generates static pages for all locales:

- `/en/*` - English pages
- `/vi/*` - Vietnamese pages

This ensures optimal performance and SEO for all supported languages.

### Bundle Size Optimization

The application uses several optimization techniques:

1. **Code Splitting** - Automatic code splitting by Next.js
2. **Translation Splitting** - Translations loaded per locale
3. **Dynamic Imports** - Components loaded on demand
4. **Tree Shaking** - Unused code removed

### Monitoring

After deployment, monitor:

1. **Build Logs** - Check for warnings or errors
2. **Bundle Sizes** - Ensure bundles are optimized
3. **Translation Errors** - Monitor for missing translations
4. **Locale Usage** - Track which locales are used
5. **Performance Metrics** - Monitor page load times

## Troubleshooting

### Translation Validation Fails

**Problem:** Missing translation keys

**Solution:**

1. Check the error message for the missing key
2. Add the key to the appropriate locale file
3. Run validation again

**Problem:** Invalid JSON

**Solution:**

1. Check the file mentioned in the error
2. Validate JSON syntax (use a JSON validator)
3. Fix syntax errors and run validation again

### Build Fails

**Problem:** Type errors

**Solution:**

1. Run `npm run type-check` to see all errors
2. Fix type errors in the code
3. Run build again

**Problem:** Missing dependencies

**Solution:**

1. Delete `node_modules` and `package-lock.json`
2. Run `npm install`
3. Run build again

### Build Verification Fails

**Problem:** No locale pages generated

**Solution:**

1. Check that `app/[locale]` directory exists
2. Verify `generateStaticParams` is implemented
3. Check Next.js configuration

**Problem:** Large bundle sizes

**Solution:**

1. Run `npm run analyze` to see bundle composition
2. Identify large dependencies
3. Consider dynamic imports for large components
4. Check for duplicate dependencies

### CI/CD Pipeline Fails

**Problem:** Secrets not configured

**Solution:**

1. Go to GitHub repository settings
2. Add required secrets under "Secrets and variables"
3. Re-run the workflow

**Problem:** Build timeout

**Solution:**

1. Check for infinite loops or hanging processes
2. Optimize build process
3. Increase timeout in workflow configuration

### Deployment Issues

**Problem:** Environment variables not set

**Solution:**

1. Check deployment platform settings
2. Add all required environment variables
3. Redeploy the application

**Problem:** 404 errors for locale routes

**Solution:**

1. Verify middleware is configured correctly
2. Check that locale routing is enabled
3. Verify `[locale]` directory structure

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

## Support

For issues or questions:

1. Check this documentation
2. Review error messages carefully
3. Check the CI/CD logs
4. Consult the Next.js and next-intl documentation
5. Open an issue in the repository
