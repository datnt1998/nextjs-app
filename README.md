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

### Database Types

Generate TypeScript types from your Supabase schema:

```bash
npx supabase gen types typescript --project-id your-project-id > types/database.types.ts
```

Or if using local Supabase:

```bash
npx supabase gen types typescript --local > types/database.types.ts
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Biome](https://biomejs.dev/)
- [Conventional Commits](https://www.conventionalcommits.org/)
