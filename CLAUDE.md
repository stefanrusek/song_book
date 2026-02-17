# song_book Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-02-15

## Active Technologies
- TypeScript 5+ with strict mode + React 19+, Next.js 16+ (App Router), pnpm 10+ (004-fix-missing-translations)
- Translation JSON files (`public/translations/en.json`, `public/translations/pl.json`) (004-fix-missing-translations)

- **Node.js 24.x** (use `nvm use` or `docker run node:24`, see `.claude/rules/510-node-version-management.md`)
- **pnpm 10+** (package manager, npm and yarn are forbidden, see `.claude/rules/520-pnpm-package-manager.md`)
- TypeScript 5+ with strict mode enabled (001-polish-songbook-app)

## Project Structure

```text
src/
tests/
```

## Commands

**IMPORTANT: Always use Node 24 before running any commands** (see Rule 510):
```bash
# Using nvm (recommended)
nvm use
nvm exec pnpm test

# Or using Docker
docker run --rm -v "$(pwd):/app" -w /app node:24 pnpm test
```

**Pre-Commit Quality Gates** (REQUIRED - Principle VII):
```bash
# With nvm
nvm use
pnpm test && pnpm lint && pnpm coverage

# Or with Docker
docker run --rm -v "$(pwd):/app" -w /app node:24 \
  sh -c "pnpm test && pnpm lint && pnpm coverage"
```

All three checks MUST pass and achieve 100% code coverage before making ANY commit.
See `.claude/rules/510-node-version-management.md` for detailed instructions.

## Code Style

TypeScript 5+ with strict mode enabled: Follow standard conventions

## Recent Changes
- 004-fix-missing-translations: Added TypeScript 5+ with strict mode + React 19+, Next.js 16+ (App Router), pnpm 10+

- 002-fix-search: Added Pre-Commit Quality Gates (Principle VII in constitution v1.3.0)
- 001-polish-songbook-app: Added TypeScript 5+ with strict mode enabled

## Constitution

This project is governed by the **Song Book Constitution** (v1.3.0) documented in `.specify/memory/constitution.md`. All development MUST comply with:

- **Principle I**: Type Safety First (no `any` type, strict mode)
- **Principle II**: Visual Documentation (sequence diagrams required)
- **Principle III**: Phased Development (commits after each phase)
- **Principle IV**: Component Separation (presentational components)
- **Principle V**: Conventional Commits (feature branches, commit format)
- **Principle VI**: Root Cause Analysis (before proposing solutions)
- **Principle VII**: Pre-Commit Quality Gates (lint, test, 100% coverage BEFORE commits)

Key governance rule: All Pull Requests MUST verify compliance with these principles before merge.

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
