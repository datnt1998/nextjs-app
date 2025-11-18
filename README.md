# NextJS Starter Kit

A modern, lightweight, and highly extensible NextJS starter kit optimized for SaaS dashboards and management systems.

## Features

- ⚡️ **Next.js 16** with App Router and TypeScript
- 🎨 **Tailwind CSS v4** with CSS variables for theming
- 🔍 **Biome** for fast linting
- 💅 **Prettier** for code formatting
- 🐶 **Husky** for Git hooks
- 📝 **Commitlint** for conventional commits
- 🚀 **Production-ready** configuration

## Getting Started

### Prerequisites

- Node.js 20+ and npm

### Installation

```bash
npm install
```

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
│   └── globals.css      # Global styles
├── public/              # Static assets
├── .husky/              # Git hooks
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

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [Biome](https://biomejs.dev/)
- [Conventional Commits](https://www.conventionalcommits.org/)
