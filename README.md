# Next.js Starter Kit

Modern, production-ready starter kit for SaaS dashboards and management systems.

## Features

- **Next.js 16** - App Router with TypeScript
- **Tailwind CSS v4** - CSS variables for theming
- **Internationalization** - next-intl v3 ([Guide](./docs/I18N_GUIDE.md))
- **Supabase** - Authentication and database
- **Biome** - Fast linting and formatting
- **Prettier** - Code formatting
- **Husky** - Git hooks with Commitlint

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

```bash
npm install
cp .env.example .env.local
```

### Environment Configuration

Configure the following services in `.env.local`:

**Supabase (Required)**

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Get credentials from **Settings > API**

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**ImageKit (Required)**

1. Create account at [imagekit.io](https://imagekit.io)
2. Get credentials from **Developer Options > API Keys**

```env
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=public_xxxxx
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your-id
IMAGEKIT_PRIVATE_KEY=private_xxxxx
```

**Site URL (Optional)**

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Verify Setup

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Database Setup

Run migrations from `supabase/migrations/` in order:

1. `20241118000001_create_profiles_table.sql`
2. `20241118000002_create_items_table.sql`
3. `20241118000003_add_rbac_support.sql`

See [`supabase/SETUP.md`](./supabase/SETUP.md) for details.

### Development

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm start            # Start production server
```

## Scripts

```bash
npm run dev              # Development server
npm run build            # Production build
npm start                # Production server
npm run lint             # Run linter
npm run lint:fix         # Fix linting issues
npm run format           # Format code
npm run format:check     # Check formatting
npm run validate:translations  # Validate i18n files
```

## Code Quality

**Pre-commit Hooks** - Husky runs Biome linting and Prettier formatting

**Commit Convention** - [Conventional Commits](https://www.conventionalcommits.org/)

```
<type>: <subject>

Types: feat, fix, docs, style, refactor, perf, test, build, ci, chore
```

## Project Structure

```
nextjs-app/
├── app/                    # Next.js App Router
├── components/
│   ├── ui/                 # Atomic UI primitives
│   ├── shared/             # Reusable composites
│   ├── dashboard/          # Dashboard shell
│   └── features/           # Feature-specific
├── lib/                    # Utilities and clients
├── hooks/                  # React hooks
├── stores/                 # Zustand stores
├── types/                  # TypeScript types
├── supabase/               # Database migrations
└── middleware.ts           # Next.js middleware
```

## Component Architecture

Four-layer architecture for maintainability and scalability:

| Layer          | Purpose               | Can Use                          |
| -------------- | --------------------- | -------------------------------- |
| **ui/**        | Primitive UI elements | Radix UI, theme tokens           |
| **shared/**    | Reusable composites   | ui/, external libs               |
| **dashboard/** | App shell/layout      | ui/, shared/, auth               |
| **features/**  | Feature-specific      | All layers, APIs, business logic |

**Key Rules:**

- Use ShadCN/Radix UI primitives in `ui/`
- Support `className`, `forwardRef`, `asChild`
- Business logic only in `features/`
- Use absolute imports: `@/components/ui/button`

See [Component Architecture](./docs/COMPONENT_ARCHITECTURE.md) for details.

## Supabase Integration

**Database Schema:**

- User profiles with RBAC
- Items table for CRUD
- Row Level Security (RLS)
- Multi-tenant support

**Roles:** owner, admin, manager, editor, viewer

**Usage:**

```typescript
// Client-side
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();

// Server-side
import { createClient } from "@/lib/supabase/server";
const supabase = await createClient();
```

**Generate Types:**

```bash
npx supabase gen types typescript --project-id ID > types/database.types.ts
```

## Internationalization

**Supported Locales:** English (en), Vietnamese (vi)

**Usage:**

```typescript
// Server Component
import { getTranslations } from "next-intl/server";
const t = await getTranslations("namespace");

// Client Component
import { useTranslations } from "next-intl";
const t = useTranslations("namespace");
```

**Documentation:**

- [i18n Guide](./docs/I18N_GUIDE.md)
- [Quick Reference](./docs/I18N_QUICK_REFERENCE.md)
- [Examples](./docs/I18N_EXAMPLES.md)

**Validation:**

```bash
npm run validate:translations
```

## Resources

- [Next.js](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Supabase](https://supabase.com/docs)
- [next-intl](https://next-intl-docs.vercel.app/)
- [Biome](https://biomejs.dev/)
