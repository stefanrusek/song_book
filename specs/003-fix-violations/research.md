# Research: Fix Rule and Constitutional Violations

**Date**: 2026-02-16
**Feature**: 003-fix-violations
**Phase**: Phase 0 - Research & Clarification

## Overview

This feature involves fixing violations of existing rules and constitutional principles. There are no unknown technologies or architectural decisions - all requirements are already established and documented. This research document confirms that no [NEEDS CLARIFICATION] markers require investigation.

## Technologies & Tools (All Established)

### Language & Framework

**Decision**: TypeScript 5+ with strict mode + Next.js 16+ with App Router

**Why**: Already established in the codebase and required by Rule 110 and Constitution

**In use**:
- TypeScript 5+ with `"strict": true` in tsconfig.json ✓
- Next.js 16+ in packages/web ✓
- Both are non-negotiable per constitution

### Package Manager

**Decision**: pnpm 10+

**Why**: Required by Rule 520 and Constitution - Monorepo and Package Management section

**Status**: Already in use, pnpm-lock.yaml present, no npm/yarn lock files ✓

### Testing Framework

**Decision**: Jest with React Testing Library

**Why**: Already configured in jest.config.js files for both web and shared packages

**Current state**:
- `/packages/web/jest.config.js` exists with 80% threshold (to be fixed to 100%)
- `/packages/shared/jest.config.js` exists with 100% threshold ✓
- Both use Jest + React Testing Library for components

**No research needed**: Framework already established and configured

### Linting

**Decision**: ESLint

**Why**: Required by Rule 410 - Testing and Pre-Commit Quality Gates

**Current state**:
- Web package: `/packages/web/eslint.config.mjs` configured ✓
- Shared package: **Missing** - needs to be created by copying web config

**No research needed**: Configuration pattern already established

### Node.js Version

**Decision**: Node.js 24.x via nvm

**Why**: Required by Rule 510 - Node Version Management

**Status**: .nvmrc file exists with "24" ✓

**No research needed**: Already established and documented

## Coverage Requirements

**Decision**: 100% code coverage mandatory

**Why**:
- Principle VII (Pre-Commit Quality Gates): "100% code coverage is mandatory"
- Rule 410 (Testing and Pre-Commit Quality Gates): Lines 37-42 and 88-91

**Current state**:
- Shared package: 100% ✓
- Web package: 80% (to be fixed)

**No research needed**: Requirement is explicit and non-negotiable

## Test File Locations

**Decision**:
- Components: `__tests__/` directories or alongside component files
- Hooks: `__tests__/` directories or alongside hook files
- Utilities: `__tests__/` directory in same package
- Pages: `__tests__/` directory or alongside page files

**Why**: Established React Testing Library and Jest conventions, already used in existing test files

**Pattern seen in codebase**:
- `/packages/web/lib/__tests__/search-utils.test.ts` ✓
- `/packages/shared/utils/__tests__/text-normalize.test.ts` ✓

**No research needed**: Pattern is established, just needs to be applied to remaining components

## Type Definitions

**Decision**: Use `type` keyword instead of `interface` for all type definitions

**Why**: Rule 110 - TypeScript Standards, section "Prefer `type` over `interface`"

**Current state**:
- Codebase correctly uses `type` in most places
- One exception: `interface SearchResultValidator` in test-utils.ts line 156 (to be fixed)

**No research needed**: Requirement is explicit, violation identified

## Commit Message Format

**Decision**: Conventional Commits format

**Why**: Principle III (Phased Development) and Principle V (Conventional Commits) in Constitution

**Format**:
- `<type>(<scope>): <description>`
- Types: feat, fix, refactor, docs, test, chore, style, perf, ci, build
- Scopes: pages, components, api, lib, hooks, styles, config, db, auth, types, spec

**Pattern**:
- Config fixes: `fix(config): ...`
- Test additions: `test(components|hooks|pages): ...`
- Type fixes: `fix(types): ...`
- Final completion: `docs(spec): ...`

**No research needed**: Established convention, well documented

## Exception for Intermediate Commits

**Decision**: Pre-commit quality gate exception applies only to intermediate commits during this feature

**Why**: User explicitly stated "We will make an exception to the rules around precommit checks (such as testing and linting), for intermediate commits, but the end result will follow all the rules"

**Implementation**:
- Intermediate commits (phases 1-3) can be made without passing all quality gates
- Final commit (phase 4) MUST pass all quality gates: `pnpm test && pnpm lint && pnpm coverage`

**Rationale**: Allows incremental progress while maintaining final state compliance

## Summary: No Unknowns Found

✅ **All technologies established**: TypeScript, Next.js, Jest, ESLint, pnpm, Node.js 24
✅ **All standards documented**: Coverage 100%, type keywords, commit formats
✅ **All patterns identified**: Test file locations, project structure
✅ **All requirements clear**: No [NEEDS CLARIFICATION] markers in spec
✅ **All tools configured**: jest.config.js, tsconfig.json, eslint.config.mjs

## Conclusion

No research clarifications needed. All technical decisions are pre-established by:
1. Constitution (Principles I-VII)
2. Rule 110 (TypeScript Standards)
3. Rule 210 (Next.js & React Architecture)
4. Rule 410 (Testing and Quality Gates)
5. Rule 510 (Node Version Management)
6. Rule 520 (pnpm Package Manager)
7. Existing codebase implementations

The implementation plan is ready to proceed with execution. This is purely a compliance-fixing feature with no novel technical challenges or decisions required.

**Phase 0 Complete**: No unknowns, ready for Phase 1 (Design & Contracts)

Note: Phase 1 (data-model.md, contracts/) is **N/A** for this feature as there are no new data models or API contracts to create. This feature only fixes existing code and configuration.
