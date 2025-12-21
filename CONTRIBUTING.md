# Contributing to bun-turbo-starter

Thank you for your interest in contributing! We welcome all contributions, from fixing typos to adding new features.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Local Development](#local-development)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Code Style](#code-style)
- [Commit Guidelines](#commit-guidelines)

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you agree to uphold this code.

## Getting Started

### For First-Time Contributors

Look for issues labeled:
- `good first issue` — simple tasks perfect for your first contribution
- `help wanted` — tasks where community help is needed
- `documentation` — documentation improvements

### Reporting Issues

Before creating an issue:
1. Check if a similar issue already exists
2. Use the issue template (if available)
3. Provide detailed information:
   - Bun and Node.js versions
   - Operating system
   - Steps to reproduce
   - Expected vs actual behavior

### Suggesting Features

For new features:
1. Create an issue describing your proposal
2. Wait for discussion before starting work
3. Ensure the feature aligns with project goals

## Local Development

### Prerequisites

- [Bun](https://bun.sh) v1.3.3 or higher
- [Node.js](https://nodejs.org) v22.21.0 or higher (for compatibility)
- Git

### Setup

1. Fork the repository
2. Clone your fork:

```bash
git clone https://github.com/your-username/bun-turbo-starter.git
cd bun-turbo-starter
```

3. Install dependencies:

```bash
bun install
```

4. Set up environment variables:

```bash
cp .env.example .env
```

Edit `.env` and add required values:
- `POSTGRES_URL` — Neon database URL
- `BETTER_AUTH_SECRET` — authentication secret
- `RESEND_API_KEY` — API key for email sending

5. Push database schema:

```bash
bun db:push
```

6. Generate Better Auth schema:

```bash
bun auth:generate
```

### Running the Project

```bash
# Start all apps in development mode
bun dev

# Start only the Next.js app
bun dev:next

# Open Drizzle Studio for database management
bun db:studio
```

The app will be available at [http://localhost:3000](http://localhost:3000)

## Project Structure

```
bun-turbo-starter/
├── apps/
│   └── app/              # Next.js application
├── packages/
│   ├── api/              # tRPC routers
│   ├── auth/             # Better Auth configuration
│   ├── config/           # Environment variables
│   ├── db/               # Drizzle ORM schemas
│   ├── emails/           # React Email templates
│   ├── ui/               # shadcn-ui components
│   └── validators/       # Zod validation schemas
└── tooling/
    ├── tailwind/         # Tailwind configuration
    └── typescript/       # TypeScript configuration
```

### Key Packages

- **apps/app** — main Next.js application
- **packages/api** — tRPC API endpoints
- **packages/db** — database schemas and migrations
- **packages/ui** — reusable UI components

## Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/feature-name
# or
git checkout -b fix/bug-description
```

Use prefixes:
- `feature/` — new functionality
- `fix/` — bug fixes
- `docs/` — documentation changes
- `refactor/` — code refactoring
- `chore/` — dependency updates, configuration

### 2. Make Changes

- Follow existing code style
- Add comments for complex logic
- Update documentation when needed

### 3. Verify Your Code

```bash
# Check formatting and linting
bun check

# Auto-fix issues
bun check:fix

# Type checking
bun typecheck

# Build the project
bun build
```

### 4. Commit Changes

```bash
git add .
git commit -m "feat: add new feature"
```

### 5. Push Changes

```bash
git push origin feature/feature-name
```

## Pull Request Process

### Before Creating a PR

- [ ] Code passes all checks (`bun check`)
- [ ] Types are correct (`bun typecheck`)
- [ ] Project builds successfully (`bun build`)
- [ ] Changes tested locally
- [ ] Documentation updated (if needed)
- [ ] Commits follow convention

### Creating a PR

1. Go to GitHub and create a Pull Request
2. Fill out the description:
   - What changed and why
   - Link to related issue (if any)
   - Screenshots for UI changes
   - Testing instructions

3. Ensure CI passes successfully

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation

## Related Issues
Closes #123

## How to Test
1. Step 1
2. Step 2

## Screenshots (if applicable)
```

## Code Style

This project uses [Biome](https://biomejs.dev) for formatting and linting.

### Key Rules

- Use TypeScript for all code
- Prefer functional components
- Use Server Components by default in Next.js
- Add `'use client'` only when necessary
- Follow principles from `.kiro/steering/AGENTS.md`

### Auto-formatting

```bash
# Check formatting
bun format

# Fix formatting
bun format:fix

# Check and fix everything
bun check:fix
```

### Naming Conventions

- **Files**: kebab-case (`user-profile.tsx`)
- **Components**: PascalCase (`UserProfile`)
- **Functions**: camelCase (`getUserData`)
- **Constants**: UPPER_SNAKE_CASE (`API_URL`)

## Commit Guidelines

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Commit Types

- `feat:` — new feature
- `fix:` — bug fix
- `docs:` — documentation changes
- `style:` — formatting, missing semicolons, etc.
- `refactor:` — code refactoring
- `perf:` — performance improvements
- `test:` — adding tests
- `chore:` — dependency updates, configuration

### Examples

```bash
feat(auth): add Google OAuth provider
fix(api): correct email validation error
docs: update installation instructions
refactor(db): optimize database queries
chore: update dependencies to latest versions
```

## Adding New Packages

### Creating a New Package

```bash
bun turbo gen init
```

Follow the generator prompts.

### Adding UI Components

```bash
bun ui-add
```

Select components from the shadcn/ui list.

## Working with the Database

### Modifying Schema

1. Edit files in `packages/db/src/schema/`
2. Apply changes:

```bash
bun db:push
```

### Viewing Data

```bash
bun db:studio
```

This opens Drizzle Studio in your browser.

## Questions?

- Create an issue with the `question` label
- Check the [FAQ in README](./README.md#faq)
- Review existing code and PRs

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](./LICENSE).

---

Thank you for contributing! 🎉
