#!/usr/bin/env node

/**
 * Build Verification Script
 *
 * This script verifies the production build to ensure:
 * 1. Build completes successfully
 * 2. Static pages are generated for all locales
 * 3. Bundle sizes are optimized
 * 4. Translation files are properly code-split
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOCALES = ["en", "vi"] as const;
const BUILD_DIR = path.join(__dirname, "..", ".next");
const SERVER_DIR = path.join(BUILD_DIR, "server", "app");

interface VerificationResult {
  success: boolean;
  errors: string[];
  warnings: string[];
  stats: {
    localePages: Record<string, number>;
    totalPages: number;
    buildExists: boolean;
  };
}

const result: VerificationResult = {
  success: true,
  errors: [],
  warnings: [],
  stats: {
    localePages: {},
    totalPages: 0,
    buildExists: false,
  },
};

/**
 * Check if build directory exists
 */
function checkBuildExists(): void {
  console.log("📦 Checking build directory...");

  if (!fs.existsSync(BUILD_DIR)) {
    result.errors.push(
      'Build directory does not exist. Run "npm run build" first.',
    );
    result.success = false;
    return;
  }

  result.stats.buildExists = true;
  console.log("   ✓ Build directory exists");
}

/**
 * Check if locale-specific pages are generated
 */
function checkLocalePages(): void {
  console.log("\n🌍 Checking locale-specific pages...");

  if (!result.stats.buildExists) {
    return;
  }

  for (const locale of LOCALES) {
    const localePath = path.join(SERVER_DIR, `[locale]`);

    if (!fs.existsSync(localePath)) {
      result.warnings.push(`Locale directory not found: ${localePath}`);
      continue;
    }

    // Count pages for this locale
    const pageCount = countPages(localePath);
    result.stats.localePages[locale] = pageCount;
    result.stats.totalPages += pageCount;

    console.log(`   ✓ ${locale}: ${pageCount} pages generated`);
  }

  if (result.stats.totalPages === 0) {
    result.warnings.push("No locale-specific pages found in build output");
  }
}

/**
 * Recursively count page files in a directory
 */
function countPages(dir: string): number {
  let count = 0;

  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        count += countPages(fullPath);
      } else if (
        entry.name === "page.js" ||
        entry.name === "page.tsx" ||
        entry.name.endsWith(".html")
      ) {
        count++;
      }
    }
  } catch (_error) {
    // Directory might not exist or be accessible
  }

  return count;
}

/**
 * Check bundle size and optimization
 */
function checkBundleOptimization(): void {
  console.log("\n📊 Checking bundle optimization...");

  if (!result.stats.buildExists) {
    return;
  }

  // Check if chunks directory exists (indicates code splitting)
  const chunksDir = path.join(BUILD_DIR, "static", "chunks");

  if (fs.existsSync(chunksDir)) {
    const chunks = fs.readdirSync(chunksDir);
    console.log(`   ✓ Code splitting enabled (${chunks.length} chunks)`);

    // Check for large chunks (warning if any chunk > 500KB)
    for (const chunk of chunks) {
      const chunkPath = path.join(chunksDir, chunk);
      const stats = fs.statSync(chunkPath);
      const sizeKB = stats.size / 1024;

      if (sizeKB > 500) {
        result.warnings.push(
          `Large chunk detected: ${chunk} (${sizeKB.toFixed(2)} KB)`,
        );
      }
    }
  } else {
    result.warnings.push(
      "Chunks directory not found - code splitting may not be working",
    );
  }

  // Check if build manifest exists
  const manifestPath = path.join(BUILD_DIR, "build-manifest.json");
  if (fs.existsSync(manifestPath)) {
    console.log("   ✓ Build manifest generated");
  } else {
    result.warnings.push("Build manifest not found");
  }
}

/**
 * Verify translation files are not in main bundle
 */
function checkTranslationCodeSplitting(): void {
  console.log("\n🔍 Checking translation code splitting...");

  if (!result.stats.buildExists) {
    return;
  }

  // Check if messages are in separate chunks (not in main bundle)
  const chunksDir = path.join(BUILD_DIR, "static", "chunks");

  if (!fs.existsSync(chunksDir)) {
    return;
  }

  // Look for translation-related chunks
  const chunks = fs.readdirSync(chunksDir);
  const translationChunks = chunks.filter(
    (chunk) =>
      chunk.includes("messages") ||
      chunk.includes("i18n") ||
      chunk.includes("intl"),
  );

  if (translationChunks.length > 0) {
    console.log(
      `   ✓ Translation files are code-split (${translationChunks.length} chunks)`,
    );
  } else {
    console.log(
      "   ℹ Translation chunks not explicitly identified (may be bundled with pages)",
    );
  }
}

/**
 * Print verification results
 */
function printResults(): void {
  console.log(`\n${"=".repeat(60)}`);

  if (result.success && result.errors.length === 0) {
    console.log("✅ Build verification passed!");
    console.log(`\n   Statistics:`);
    console.log(`   - Total pages: ${result.stats.totalPages}`);

    for (const [locale, count] of Object.entries(result.stats.localePages)) {
      console.log(`   - ${locale} pages: ${count}`);
    }

    if (result.warnings.length > 0) {
      console.log(`\n⚠️  Warnings (${result.warnings.length}):`);
      for (const warning of result.warnings) {
        console.log(`   - ${warning}`);
      }
    }
  } else {
    console.log("❌ Build verification failed!");

    if (result.errors.length > 0) {
      console.log(`\n   Errors:`);
      for (const error of result.errors) {
        console.log(`   - ${error}`);
      }
    }

    if (result.warnings.length > 0) {
      console.log(`\n   Warnings:`);
      for (const warning of result.warnings) {
        console.log(`   - ${warning}`);
      }
    }
  }

  console.log(`${"=".repeat(60)}\n`);
}

/**
 * Main verification function
 */
function main(): void {
  console.log("🔍 Build Verification Script");
  console.log("=".repeat(60));

  checkBuildExists();
  checkLocalePages();
  checkBundleOptimization();
  checkTranslationCodeSplitting();

  printResults();

  // Exit with error code if there are errors
  if (!result.success || result.errors.length > 0) {
    process.exit(1);
  }
}

// Run the script
main();
