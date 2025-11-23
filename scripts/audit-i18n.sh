#!/bin/bash

# i18n Audit Script
# Finds potential hard-coded strings that need translation

echo "🔍 Auditing i18n implementation..."
echo ""

echo "📝 Checking for hard-coded strings in components..."
echo "=================================================="
grep -rn '"[A-Z][a-z]* [a-z]*"' components/ --include="*.tsx" --include="*.ts" | head -20
echo ""

echo "🚨 Checking for hard-coded toast messages..."
echo "============================================="
grep -rn 'toast\.\(error\|success\|info\|warning\)' components/ app/ --include="*.tsx" --include="*.ts" | grep -v 't(' | head -20
echo ""

echo "📋 Checking for hard-coded placeholders..."
echo "==========================================="
grep -rn 'placeholder="[^{]' components/ app/ --include="*.tsx" | head -20
echo ""

echo "🔘 Checking for hard-coded button text..."
echo "=========================================="
grep -rn '<Button[^>]*>[A-Z]' components/ app/ --include="*.tsx" | head -20
echo ""

echo "📊 Translation file statistics..."
echo "=================================="
echo "English keys:"
find messages/en -name "*.json" -exec sh -c 'echo -n "{}: "; jq ".. | objects | keys[]" {} 2>/dev/null | wc -l' \;
echo ""
echo "Vietnamese keys:"
find messages/vi -name "*.json" -exec sh -c 'echo -n "{}: "; jq ".. | objects | keys[]" {} 2>/dev/null | wc -l' \;
echo ""

echo "✅ Audit complete!"
echo ""
echo "💡 Tips:"
echo "  - Review the output above for potential untranslated strings"
echo "  - Run 'npm run validate:translations' to check translation consistency"
echo "  - See docs/I18N_INTEGRATION_COMPLETE.md for full integration guide"
