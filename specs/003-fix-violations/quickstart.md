# Quick Start: Implementing Violation Fixes

**Feature**: 003-fix-violations
**Branch**: `003-fix-violations`
**Time Estimate**: Follow the phases sequentially; intermediate commits allowed

## Prerequisites

Before starting, ensure you have:

```bash
# Check Node.js version
nvm use
node --version  # Should show v24.x.x

# Check pnpm
pnpm --version  # Should show 10.x.x or higher

# Install dependencies (if not already done)
pnpm install
```

## Phase 1: Configuration Fixes (10-15 minutes)

### 1.1 Update jest.config.js (Web Package)

**File**: `/packages/web/jest.config.js`

**Lines 18-24**: Change coverage thresholds from 80 to 100

```javascript
// BEFORE
coverageThreshold: {
  global: {
    statements: 80,
    branches: 80,
    functions: 80,
    lines: 80
  }
}

// AFTER
coverageThreshold: {
  global: {
    statements: 100,
    branches: 100,
    functions: 100,
    lines: 100
  }
}
```

**Commit**:
```bash
git add packages/web/jest.config.js
git commit -m "fix(config): update web jest coverage threshold to 100%"
```

### 1.2 Create ESLint Config (Shared Package)

**File**: `/packages/shared/eslint.config.mjs`

**Action**: Copy `/packages/web/eslint.config.mjs` to `/packages/shared/eslint.config.mjs`

```bash
cp packages/web/eslint.config.mjs packages/shared/eslint.config.mjs
```

**Verify**:
```bash
pnpm lint  # Should pass with zero errors
```

**Commit**:
```bash
git add packages/shared/eslint.config.mjs
git commit -m "fix(config): add ESLint configuration to shared package"
```

## Phase 2: Test File Creation (Most of the Work)

### 2.1 Component Tests (14 files)

Create test files for each component. Pattern: `component-name.test.tsx`

**Example**: `/packages/web/components/category/category-accordion.test.tsx`

```typescript
import { render, screen } from '@testing-library/react'
import { CategoryAccordion } from './category-accordion'

describe('CategoryAccordion', () => {
  it('should render the accordion', () => {
    const props = {
      // Add required props based on component interface
    }
    render(<CategoryAccordion {...props} />)
    // Assertions to reach 100% coverage
  })

  // Add more test cases to achieve 100% line, branch, function, and statement coverage
})
```

**Components needing tests**:
1. `components/category/category-accordion.tsx`
2. `components/category/category-item.tsx`
3. `components/common/language-toggle.tsx`
4. `components/common/offline-indicator.tsx`
5. `components/layout/header.tsx`
6. `components/search/search-box.tsx`
7. `components/search/search-results.tsx`
8. `components/song/category-badge.tsx`
9. `components/song/song-card.tsx`
10. `components/song/song-details.tsx`
11. `components/song/verse-display.tsx`

**After each component test is created**:
```bash
pnpm test  # Verify tests pass
pnpm coverage  # Verify coverage for that file
git commit -m "test(components): add tests for [component-name]"
```

### 2.2 Hook Tests (3 files)

Pattern: `use-hook-name.test.ts`

**Hooks needing tests**:
1. `hooks/use-debounce.ts`
2. `hooks/use-offline.ts`
3. `hooks/use-search.ts`

**Example**: `/packages/web/hooks/use-debounce.test.ts`

```typescript
import { renderHook, act } from '@testing-library/react'
import { useDebounce } from './use-debounce'

describe('useDebounce', () => {
  it('should debounce value changes', () => {
    // Test hook behavior with renderHook
    // Achieve 100% coverage for all code paths
  })
})
```

**After each hook test**:
```bash
pnpm test
pnpm coverage
git commit -m "test(hooks): add tests for [hook-name]"
```

### 2.3 Page Content Tests (3 files)

Pattern: `content.test.tsx` alongside `content.tsx`

**Files needing tests**:
1. `/packages/web/app/song/[number]/content.tsx`
2. `/packages/web/app/category/subcategory/[number]/content.tsx`
3. `/packages/web/app/page.tsx`

**Example**: `/packages/web/app/page.test.tsx`

```typescript
import { render, screen } from '@testing-library/react'
import Page from './page'

describe('Home Page', () => {
  it('should render the page', () => {
    render(<Page />)
    // Assertions for 100% coverage
  })
})
```

**After each page test**:
```bash
pnpm test
pnpm coverage
git commit -m "test(pages): add tests for [page-name]"
```

## Phase 3: Type Definition Fixes (5 minutes)

### 3.1 Convert interface to type

**File**: `/packages/shared/utils/__tests__/test-utils.ts`
**Line**: 156

```typescript
// BEFORE
export interface SearchResultValidator {
  hymn: { number: number; title: string }
  matchType: 'number' | 'title' | 'author' | 'verse' | 'chorus'
  relevance: number
}

// AFTER
export type SearchResultValidator = {
  hymn: { number: number; title: string }
  matchType: 'number' | 'title' | 'author' | 'verse' | 'chorus'
  relevance: number
}
```

**Commit**:
```bash
git add packages/shared/utils/__tests__/test-utils.ts
git commit -m "fix(types): convert interface to type in test-utils"
```

## Phase 4: Final Verification (10 minutes)

### 4.1 Run Complete Quality Gate Sequence

```bash
# Test all tests pass
pnpm test

# Lint all code with zero errors/warnings
pnpm lint

# Check coverage is 100%
pnpm coverage
```

All three commands should succeed with exit code 0.

### 4.2 Verify All Requirements Met

```bash
# Should all pass without errors
pnpm test && pnpm lint && pnpm coverage
echo $?  # Should output 0
```

### 4.3 Create Final Commit

```bash
git commit -m "docs(spec): complete violation fixes achieving 100% compliance

Fixes all 23 identified violations:
- Coverage threshold updated to 100% (packages/web)
- 17 test files created for components, hooks, pages
- ESLint configured in shared package
- Type definition converted from interface to type

All quality gates pass:
✓ pnpm test (100% success)
✓ pnpm lint (zero errors/warnings)
✓ pnpm coverage (100% coverage)

Enables enforcement of Principle VII (Pre-Commit Quality Gates)

Fixes:
- RC-1: Enforcement of constitutional requirements ✓
- RC-2: Missing test files ✓
- RC-3: Coverage threshold 100% ✓
- RC-4: Consistent ESLint configuration ✓
- RC-5: Type definition compliance ✓

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

## Helpful Commands During Implementation

```bash
# Run tests only
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run linting
pnpm lint

# Fix linting issues automatically
pnpm lint --fix

# Check coverage
pnpm coverage

# Check coverage for specific package
cd packages/web && pnpm coverage

# Run all quality gates (final verification)
pnpm test && pnpm lint && pnpm coverage

# View git status
git status

# View what will be committed
git diff --cached

# Undo last commit (if needed)
git reset --soft HEAD~1
```

## Success Indicators

✅ Phase 1: jest.config.js updated, ESLint configured in shared
✅ Phase 2: 17 test files created, all tests passing
✅ Phase 3: interface converted to type
✅ Phase 4: All quality gates pass

```bash
# Final check - should output all pass
pnpm test && pnpm lint && pnpm coverage && echo "✓ ALL QUALITY GATES PASS"
```

## Troubleshooting

### Tests failing with coverage errors
- Check that coverage threshold is set to 100% in jest.config.js
- Ensure new test files actually test the component/hook/page
- Use `pnpm coverage` to see detailed coverage report

### ESLint errors in test files
- Run `pnpm lint --fix` to auto-fix formatting issues
- Check that eslint.config.mjs is properly configured in shared package

### Type errors after interface→type conversion
- Ensure the interface is converted to type object syntax correctly
- Run `pnpm test` to verify TypeScript compilation

## What's Next

After completing all phases and verifying Phase 4:

1. Push branch to remote: `git push -u origin 003-fix-violations`
2. Create Pull Request on GitHub
3. Wait for CI/CD to verify all quality gates pass
4. Code review and merge to main
5. Feature is complete!

## Related Documentation

- Constitution: `.specify/memory/constitution.md`
- Rules: `.claude/rules/410-testing-and-quality-gates.md`, `510-node-version-management.md`, `520-pnpm-package-manager.md`
- Commands: Use `pnpm test && pnpm lint && pnpm coverage` before committing (Principle VII)
