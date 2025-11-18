# NextJS Starter Kit

A modern, lightweight, and highly extensible NextJS starter kit optimized for SaaS dashboards and management systems.

## Features

- ⚡️ **Next.js 16** with App Router and TypeScript
- 🎨 **Tailwind CSS v4** with CSS variables for theming
- � **Supab\*ase** for authentication and database
- � **\*Biome** for fast linting
- � **Pretytier** for code formatting
- � **CHusky** for Git hooks
- � **\*Commitlint** for conventional commits
- 🚀 **Production-ready** configuration

## Getting Started

### Prerequisites

- Node.js 20+ and npm

### Installation

```bash
npm install
```

### Environment Setup

1. Copy the example environment file:

```bash
cp .env.example .env.local
```

2. Update `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

To get your Supabase credentials:

1. Create a project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API
3. Copy the Project URL and anon/public key

### Database Setup

This starter kit includes database migrations for:

- User profiles with RBAC (Role-Based Access Control)
- Items table for CRUD operations
- Row Level Security (RLS) policies
- Multi-tenant support

**Quick Setup:**

1. Follow the detailed setup guide in [`supabase/SETUP.md`](./supabase/SETUP.md)
2. Run the migrations in order from the `supabase/migrations/` directory
3. Verify the setup by signing up a test user

**Migration Files:**

- `20241118000001_create_profiles_table.sql` - User profiles
- `20241118000002_create_items_table.sql` - Items for CRUD demo
- `20241118000003_add_rbac_support.sql` - RBAC and multi-tenant support

See [`supabase/migrations/README.md`](./supabase/migrations/README.md) for detailed migration documentation.

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build

Build the application for production:

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run Biome linter
- `npm run lint:fix` - Fix linting issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Code Quality

### Pre-commit Hooks

This project uses Husky and lint-staged to run checks before commits:

- Biome linting with auto-fix
- Prettier formatting

### Commit Message Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>
```

Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `build`: Build system changes
- `ci`: CI/CD changes
- `chore`: Other changes

Example:

```bash
git commit -m "feat: add user authentication"
```

## Project Structure

```
nextjs-app/
├── app/                  # Next.js App Router
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   ├── providers/       # React context providers
│   └── globals.css      # Global styles
├── lib/                 # Library code
│   └── supabase/        # Supabase client configurations
│       ├── client.ts    # Browser client
│       ├── server.ts    # Server client
│       └── middleware.ts # Auth middleware
├── types/               # TypeScript type definitions
│   └── database.types.ts # Supabase database types
├── public/              # Static assets
├── .husky/              # Git hooks
├── middleware.ts        # Next.js middleware
├── biome.json           # Biome configuration
├── commitlint.config.js # Commitlint configuration
├── next.config.ts       # Next.js configuration
├── package.json         # Dependencies and scripts
├── postcss.config.mjs   # PostCSS configuration
├── tsconfig.json        # TypeScript configuration
└── README.md            # This file
```

## Path Aliases

The project is configured with the following path alias:

- `@/*` - Maps to the root directory

Example:

```typescript
import { Component } from "@/components/ui/button";
```

## Supabase Integration

### Database Schema

The starter kit includes a complete database schema with:

**Tables:**

- `profiles` - User profiles with role, tenant, and permissions
- `items` - Demo table for CRUD operations

**Features:**

- Row Level Security (RLS) enabled on all tables
- Role-Based Access Control (owner, admin, manager, editor, viewer)
- Multi-tenant support with tenant isolation
- Automatic profile creation on user signup
- Automatic timestamp updates

### Client Usage (Browser)

```typescript
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

// Example: Fetch data
const { data, error } = await supabase.from("items").select("*");
```

### Server Usage (Server Components, API Routes)

```typescript
import { createClient } from "@/lib/supabase/server";

const supabase = await createClient();

// Example: Fetch data with RLS
const { data, error } = await supabase.from("items").select("*");
```

### Authentication Middleware

The middleware automatically:

- Refreshes user sessions
- Protects `/dashboard/*` routes
- Redirects unauthenticated users to `/sign-in`

### RBAC (Role-Based Access Control)

**Roles:**

- `owner` - Full access to all resources in tenant
- `admin` - Full access to all resources in tenant
- `manager` - Can view and manage items, view users
- `editor` - Can create and edit own items
- `viewer` - Can only view items (default role)

**Usage Example:**

```typescript
// Check user role
const { data: profile } = await supabase
  .from("profiles")
  .select("role")
  .eq("id", userId)
  .single();

// RLS automatically enforces permissions
const { data: items } = await supabase.from("items").select("*");
// Returns only items user has access to based on role and tenant
```

### Database Types

Generate TypeScript types from your Supabase schema:

```bash
npx supabase gen types typescript --project-id your-project-id > types/database.types.ts
```

Or if using local Supabase:

```bash
npx supabase gen types typescript --local > types/database.types.ts
```

### Common Queries

See [`supabase/common-queries.sql`](./supabase/common-queries.sql) for helpful SQL queries for:

- User management
- Role management
- Tenant management
- Testing RLS policies
- Audit and monitoring

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Biome](https://biomejs.dev/)
- [Conventional Commits](https://www.conventionalcommits.org/)
