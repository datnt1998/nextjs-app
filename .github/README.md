# GitHub Actions Configuration

This directory contains GitHub Actions workflows for CI/CD automation.

## Workflows

### CI Workflow (`ci.yml`)

Runs on every push and pull request to `main` and `develop` branches.

**Steps:**

- Install dependencies
- Type check with TypeScript
- Lint with Biome
- Format check with Prettier
- Build the Next.js application
- Upload build artifacts

### Storybook Deployment (`storybook.yml`)

Deploys Storybook to GitHub Pages on every push to `main` branch.

**Steps:**

- Install dependencies
- Build Storybook
- Deploy to GitHub Pages

## Required Secrets

To use these workflows, configure the following secrets in your GitHub repository settings:

### Environment Variables for Build

Navigate to: `Settings > Secrets and variables > Actions > New repository secret`

Add the following secrets:

1. **NEXT_PUBLIC_SUPABASE_URL**
   - Your Supabase project URL
   - Example: `https://xxxxx.supabase.co`

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Your Supabase anonymous/public key
   - Found in: Supabase Dashboard > Project Settings > API

3. **NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY**
   - Your ImageKit public key
   - Found in: ImageKit Dashboard > Developer Options

4. **NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT**
   - Your ImageKit URL endpoint
   - Example: `https://ik.imagekit.io/your_imagekit_id`

5. **IMAGEKIT_PRIVATE_KEY**
   - Your ImageKit private key
   - Found in: ImageKit Dashboard > Developer Options

## GitHub Pages Setup (for Storybook)

To enable Storybook deployment to GitHub Pages:

1. Go to `Settings > Pages`
2. Under "Build and deployment":
   - Source: Select "GitHub Actions"
3. The Storybook workflow will automatically deploy on push to `main`

Your Storybook will be available at: `https://<username>.github.io/<repository>/`

## Manual Workflow Trigger

The Storybook deployment workflow can also be triggered manually:

1. Go to `Actions` tab
2. Select "Deploy Storybook" workflow
3. Click "Run workflow"

## Artifacts

Build artifacts from the CI workflow are retained for 7 days and can be downloaded from the workflow run page.
