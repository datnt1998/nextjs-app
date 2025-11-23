# Documentation

Comprehensive documentation for the Next.js Starter Kit.

## Quick Start

- [Main README](../README.md) - Project overview and setup
- [i18n Guide](./I18N.md) - Complete i18n guide with quick reference
- [Build Guide](./BUILD.md) - Build and deployment

## Core Documentation

### [Architecture](./ARCHITECTURE.md)

Complete component architecture guide covering:

- 4-layer architecture (ui, shared, dashboard, features)
- Component routing rules
- Code standards and patterns
- Migration guide
- Verification status

### [Internationalization](./I18N.md)

Complete i18n guide covering:

- Quick reference and basic usage
- Creating pages and using translations
- Common patterns (variables, pluralization, rich text)
- SEO and metadata (hreflang implementation)
- Locale persistence (cookie-based)
- Navigation and routing
- Adding new locales
- Testing and troubleshooting

### [Build and Deployment](./BUILD.md)

Build and deployment guide covering:

- Build scripts and process
- Translation validation
- Build verification
- CI/CD pipeline
- Production deployment
- Troubleshooting
- Maintenance

### [Middleware](./MIDDLEWARE.md)

Middleware optimization guide covering:

- Performance optimizations
- Session sharing
- Pre-sorted routes
- Testing and monitoring
- Future optimization plans

### [Changelog](./CHANGELOG.md)

Project changes and updates:

- Documentation rewrite
- Items table update
- Component architecture refactoring
- Middleware optimization
- Build and deployment implementation
- i18n implementation

## Additional Resources

### Component Documentation

- [Custom Components](../components/shared/custom/README.md) - Custom component library
- [Data Table](../components/shared/data-table/README.md) - Data table components

### Library Documentation

- [i18n Utilities](../lib/i18n/README.md) - i18n utility functions

### Scripts Documentation

- [Build Scripts](../scripts/README.md) - Validation and verification scripts

## Documentation Structure

```
docs/
├── README.md           # This file
├── ARCHITECTURE.md     # Component architecture
├── I18N.md             # Internationalization
├── BUILD.md            # Build and deployment
├── MIDDLEWARE.md       # Middleware optimization
└── CHANGELOG.md        # Project changes
```

## Contributing

When adding or updating documentation:

1. **Location** - Place in appropriate file
2. **Format** - Follow existing markdown style
3. **Consistency** - Use consistent terminology
4. **Clarity** - Be concise and direct
5. **Examples** - Include code examples
6. **Links** - Update this index

## Standards

- Use clear, concise language
- Include code examples
- Maintain consistent formatting
- Keep technical accuracy
- Update cross-references
- Follow markdown best practices

## Getting Help

1. Check relevant documentation section
2. Review code examples
3. Check component/library READMEs
4. Refer to external resources (Next.js, Supabase, etc.)
