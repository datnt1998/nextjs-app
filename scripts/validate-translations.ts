#!/usr/bin/env node

/**
 * Translation Validation Script
 *
 * This script validates all translation files to ensure:
 * 1. All namespace files exist for all locales
 * 2. All JSON files are valid and parseable
 * 3. All keys exist in all locales (no missing translations)
 * 4. Structure consistency across locales
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const LOCALES = ["en", "vi"] as const;
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

const MESSAGES_DIR = path.join(__dirname, "..", "messages");

interface ValidationError {
  type: "missing_file" | "invalid_json" | "missing_key" | "extra_key";
  locale: string;
  namespace: string;
  key?: string;
  message: string;
}

const errors: ValidationError[] = [];
const warnings: ValidationError[] = [];

/**
 * Check if a file exists
 */
function fileExists(filePath: string): boolean {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

/**
 * Read and parse a JSON file
 */
function readJsonFile(filePath: string): Record<string, any> | null {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(content);
  } catch (_error) {
    return null;
  }
}

/**
 * Get all keys from a nested object (flattened with dot notation)
 */
function getAllKeys(obj: Record<string, any>, prefix = ""): string[] {
  const keys: string[] = [];

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (value && typeof value === "object" && !Array.isArray(value)) {
      keys.push(...getAllKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }

  return keys;
}

/**
 * Validate that all namespace files exist for all locales
 */
function validateFileExistence(): void {
  console.log("📁 Validating file existence...");

  for (const locale of LOCALES) {
    for (const namespace of NAMESPACES) {
      const filePath = path.join(MESSAGES_DIR, locale, `${namespace}.json`);

      if (!fileExists(filePath)) {
        errors.push({
          type: "missing_file",
          locale,
          namespace,
          message: `Missing translation file: ${filePath}`,
        });
      }
    }
  }
}

/**
 * Validate that all JSON files are valid
 */
function validateJsonSyntax(): void {
  console.log("🔍 Validating JSON syntax...");

  for (const locale of LOCALES) {
    for (const namespace of NAMESPACES) {
      const filePath = path.join(MESSAGES_DIR, locale, `${namespace}.json`);

      if (!fileExists(filePath)) {
        continue; // Already reported in file existence check
      }

      const content = readJsonFile(filePath);
      if (content === null) {
        errors.push({
          type: "invalid_json",
          locale,
          namespace,
          message: `Invalid JSON in file: ${filePath}`,
        });
      }
    }
  }
}

/**
 * Validate that all keys exist in all locales
 */
function validateKeyConsistency(): void {
  console.log("🔑 Validating key consistency...");

  const baseLocale = "en"; // Use English as the reference

  for (const namespace of NAMESPACES) {
    const baseFilePath = path.join(
      MESSAGES_DIR,
      baseLocale,
      `${namespace}.json`
    );

    if (!fileExists(baseFilePath)) {
      continue; // Already reported
    }

    const baseContent = readJsonFile(baseFilePath);
    if (!baseContent) {
      continue; // Already reported
    }

    const baseKeys = getAllKeys(baseContent);

    // Check other locales against base locale
    for (const locale of LOCALES) {
      if (locale === baseLocale) continue;

      const filePath = path.join(MESSAGES_DIR, locale, `${namespace}.json`);

      if (!fileExists(filePath)) {
        continue; // Already reported
      }

      const content = readJsonFile(filePath);
      if (!content) {
        continue; // Already reported
      }

      const keys = getAllKeys(content);

      // Check for missing keys
      for (const key of baseKeys) {
        if (!keys.includes(key)) {
          errors.push({
            type: "missing_key",
            locale,
            namespace,
            key,
            message: `Missing translation key "${key}" in ${locale}/${namespace}.json`,
          });
        }
      }

      // Check for extra keys (warnings only)
      for (const key of keys) {
        if (!baseKeys.includes(key)) {
          warnings.push({
            type: "extra_key",
            locale,
            namespace,
            key,
            message: `Extra translation key "${key}" in ${locale}/${namespace}.json (not in base locale)`,
          });
        }
      }
    }
  }
}

/**
 * Print validation results
 */
function printResults(): void {
  console.log(`\n${"=".repeat(60)}`);

  if (errors.length === 0 && warnings.length === 0) {
    console.log("✅ All translation files are valid!");
    console.log(`   - ${LOCALES.length} locales validated`);
    console.log(`   - ${NAMESPACES.length} namespaces per locale`);
    console.log(
      `   - ${LOCALES.length * NAMESPACES.length} total files checked`
    );
  } else {
    if (errors.length > 0) {
      console.log(`❌ Found ${errors.length} error(s):\n`);

      for (const error of errors) {
        console.log(`   ${error.message}`);
      }
    }

    if (warnings.length > 0) {
      console.log(`\n⚠️  Found ${warnings.length} warning(s):\n`);

      for (const warning of warnings) {
        console.log(`   ${warning.message}`);
      }
    }
  }

  console.log(`${"=".repeat(60)}\n`);
}

/**
 * Main validation function
 */
function main(): void {
  console.log("🌍 Translation Validation Script");
  console.log("=".repeat(60));
  console.log(`Locales: ${LOCALES.join(", ")}`);
  console.log(`Namespaces: ${NAMESPACES.join(", ")}`);
  console.log(`${"=".repeat(60)}\n`);

  validateFileExistence();
  validateJsonSyntax();
  validateKeyConsistency();

  printResults();

  // Exit with error code if there are errors
  if (errors.length > 0) {
    process.exit(1);
  }
}

// Run the script
main();
