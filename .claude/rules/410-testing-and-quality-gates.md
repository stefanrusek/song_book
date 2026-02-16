# Testing and Pre-Commit Quality Gates

## Prerequisites

**IMPORTANT**: Before running any commands, ensure you are using Node.js 24 (see Rule 510-node-version-management).

```bash
# Verify correct Node version
nvm use
node --version  # Should output v24.x.x

# Or use Docker
docker run --rm -v "$(pwd):/app" -w /app node:24 node --version
```

## Critical Principle: Pre-Commit Quality Gates (Principle VII)

**All code MUST pass linting, testing, and achieve 100% code coverage BEFORE any commit is made.** This is enforced at the commit boundary to maintain code quality at the source.

## Pre-Commit Requirements

### Mandatory Quality Gates

Before ANY commit can be made, ALL of the following MUST pass:

1. **Linting**: `pnpm run lint`
   - Zero errors (errors block commits)
   - Zero warnings (warnings block commits)
   - ESLint configuration enforced in `.eslintrc.js` or `eslint.config.js`

2. **Testing**: `pnpm test`
   - 100% test pass rate (no failing tests)
   - All unit, integration, and component tests pass
   - No skipped or pending tests in production code

3. **Code Coverage**: `pnpm run coverage`
   - **100% code coverage is mandatory**
   - Line coverage: 100%
   - Branch coverage: 100%
   - Function coverage: 100%
   - Statement coverage: 100%
   - Coverage configuration enforced in `jest.config.js` or similar

### The Complete Pre-Commit Sequence

Execute in this order before creating ANY commit:

```bash
pnpm test && pnpm run lint && pnpm run coverage
```

**All three must succeed with exit code 0 before proceeding to commit.**

### Non-Negotiable Rules

- **No commits are permitted if any quality gate fails** - period, no exceptions
- **Code that does not meet these standards MUST be fixed before committing**
- **WIP (work-in-progress) commits MUST still meet quality gates** - use branches to save incomplete work, don't commit broken code
- **No commits can bypass quality gates** - there are no escape hatches, overrides, or exceptions
- **All developers MUST run quality gates before committing** - both locally and CI/CD enforces this

## Testing Strategy

### Test Organization

- **Unit Tests**: Test pure functions, utilities, hooks, and isolated logic
  - Location: `tests/unit/` or `__tests__/` directories
  - Format: Test filename matches source file (e.g., `src/lib/parse.ts` → `tests/unit/parse.test.ts`)
  - Framework: Jest

- **Component Tests**: Test presentational components with mock props
  - Location: `tests/component/` or component directory `__tests__/`
  - Tools: React Testing Library with Jest
  - Requirement: Test component behavior, not implementation details
  - DO: Test user interactions, prop changes, rendered output
  - DON'T: Test internal state or implementation details

- **Integration Tests**: Test page-level flows and component interactions
  - Location: `tests/integration/`
  - Scope: Multi-component flows, hook interactions, data flows
  - Framework: Jest + React Testing Library

- **Contract Tests**: Test API endpoint contracts and data schemas
  - Location: `tests/contract/`
  - Scope: Request/response shapes, error formats, status codes
  - Framework: Jest

### Coverage Requirements

**100% code coverage is not optional - it is mandatory.**

Coverage includes:
- **Line Coverage**: Every line of code must be executed by tests
- **Branch Coverage**: Every conditional branch must be tested
- **Function Coverage**: Every function must be called by tests
- **Statement Coverage**: Every statement must be executed

Exceptions and Justifications:
- Dead code (unreachable) MUST be removed, not skipped by tests
- Generated code MUST be excluded via `coverage.exclude` in config
- Third-party dependencies SHOULD NOT be included in coverage calculations
- Test utility files (`test-utils.ts`, `test-setup.ts`) MAY be excluded if they're pure test infrastructure

## Test Writing Guidelines

### Test-Driven Development (TDD) When Appropriate

When implementing features:
1. Write test first (red state)
2. Write minimal code to make test pass (green state)
3. Refactor while keeping tests passing (refactor state)

Note: TDD is recommended but not strictly mandatory for all code - use judgment for simple implementations.

### Test File Structure

```typescript
// tests/unit/example.test.ts
import { functionUnderTest } from '@/lib/example'

describe('functionUnderTest', () => {
  describe('basic functionality', () => {
    it('should do X when given Y', () => {
      const result = functionUnderTest('input')
      expect(result).toBe('expected')
    })

    it('should handle edge case Z', () => {
      const result = functionUnderTest('')
      expect(result).toBeNull()
    })
  })

  describe('error handling', () => {
    it('should throw on invalid input', () => {
      expect(() => functionUnderTest(null)).toThrow()
    })
  })
})
```

### Test Naming

- Test file names MUST end with `.test.ts` or `.test.tsx`
- Test names MUST be descriptive: "should X when Y" not "test 1"
- Describe blocks MUST group related tests: "FunctionName", "when scenario", "error cases"

### Avoid in Tests

- **Don't test implementation details** - test behavior and output
- **Don't sleep or use fake timers unnecessarily** - use `waitFor` instead
- **Don't create brittle tests** - avoid hardcoded DOM selectors that break with small changes
- **Don't skip tests** - fix them or delete them, never leave `.skip` in committed code
- **Don't use `any` type in tests** - type your mocks and test data properly

## Linting Standards

### ESLint Configuration

All TypeScript/JavaScript must pass ESLint with:
- Zero errors (always fail builds)
- Zero warnings (always fail builds)
- Configuration enforced via committed `.eslintrc.js` or `eslint.config.js`

### Linting Commands

```bash
# Check linting status
pnpm run lint

# Fix auto-fixable issues
pnpm run lint:fix
```

### Common Linting Rules

- `no-console` in production code (console for dev only)
- `no-debugger` (remove debug statements)
- `no-unused-vars` (remove unused imports)
- `no-implicit-any` (strict TypeScript)
- `prefer-const` (use const over let when possible)
- `no-var` (use let/const, never var)

## CI/CD Pipeline

### Pre-Merge Verification

The CI/CD pipeline MUST verify before code can merge:

```yaml
# Conceptual CI stages
stages:
  - lint       # pnpm run lint → must pass
  - test       # pnpm test → must pass
  - coverage   # pnpm run coverage → must reach 100%
  - build      # pnpm run build → must succeed
```

All stages MUST pass. PRs cannot be merged with failing checks.

### GitHub Actions Example

```yaml
name: Quality Gates
on: [pull_request, push]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: pnpm ci
      - run: pnpm run lint
      - run: pnpm test
      - run: pnpm run coverage
```

## Local Development Workflow

### Before Every Commit

```bash
# 1. Run quality gates
pnpm test && pnpm run lint && pnpm run coverage

# 2. If all pass, commit
git add <files>
git commit -m "type(scope): description"

# 3. If any fail, fix and try again
pnpm run lint:fix  # Auto-fix linting issues
pnpm test          # Re-run tests
# ... fix failing tests manually
pnpm test && pnpm run lint && pnpm run coverage  # Verify again
```

### Optional: Pre-Commit Hooks

To automate quality gates, set up a pre-commit hook:

```bash
# .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

pnpm test && pnpm run lint && pnpm run coverage
```

Install husky:
```bash
pnpm add -D husky
npx husky install
npx husky add .husky/pre-commit "pnpm test && pnpm run lint && pnpm run coverage"
```

## Rationale

- **Pre-commit quality gates** enforce discipline at the source, preventing defects from entering the codebase
- **100% code coverage** ensures confidence in code behavior and enables safe refactoring
- **Linting** catches style issues and static analysis problems early
- **Mandatory before commits** means quality is built in from the start, not added as an afterthought
- **No exceptions** means the boundary is clear and discipline is consistent
- **CI/CD enforcement** ensures team members can't bypass local checks by committing directly

## Common Scenarios

### "I'm in a hurry and just need to commit something"

**You still must pass quality gates.** The gates take 30-60 seconds typically. Skip them and:
- You introduce bugs that others must fix
- You make the codebase harder to maintain
- You violate the constitution (Principle VII)
- The PR will fail CI anyway

Better approach:
- Save WIP to a branch: `git stash` or `git commit --no-verify` is forbidden
- Fix tests/linting
- Then commit

### "This code is too simple to test"

**All code must be tested.** Even simple functions:
- Document expected behavior
- Prevent regressions
- Catch edge cases
- Enable safe refactoring

```typescript
// Even simple utility needs tests
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// Test it
it('should capitalize first letter', () => {
  expect(capitalize('hello')).toBe('Hello')
  expect(capitalize('')).toBe('')
  expect(capitalize('H')).toBe('H')
})
```

### "Coverage requires testing things that don't matter"

**100% coverage means every line is executed, not that every line is meaningful.** But:

- If a line isn't meaningful, delete it
- If it's dead code, remove it
- If it's truly necessary but hard to test, that's a design smell - refactor

```typescript
// BAD: Adding tests just to hit coverage
it('should handle the impossible case', () => {
  // This can never happen, but we test it anyway to hit 100%
  expect(() => mayReturnNull()).not.toThrow()
})

// GOOD: Remove the code and the test
// If it can never happen, don't include it
```

## Related Rules

- **Rule 110-typescript**: TypeScript strict mode and type safety
- **Rule 210-nextjs-react-architecture**: Component testing patterns
- **Rule 410-testing-and-quality-gates**: This file - pre-commit quality gates
- **Rule 510-node-version-management**: Node.js 24 requirement (use nvm or Docker)
- **Rule 520-pnpm-package-manager**: pnpm 10+ exclusive requirement (npm and yarn forbidden)
- **Rule 610-git-workflow**: Commit requirements and workflow
