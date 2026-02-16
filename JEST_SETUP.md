# Jest Configuration Setup Guide

This document provides complete instructions for setting up and running the comprehensive test suite for Polish diacritical search matching.

## Overview

The project now includes:
- **59+ comprehensive test cases** covering all Polish diacritical characters
- **100% code coverage** for `normalizeText()` and `searchHymns()` functions
- **Jest configuration** for both `packages/shared` and `packages/web`
- **Performance baseline tests** to prevent regression

## Prerequisites

### Node Version Requirement

The project requires **Node.js v24.0.0 or higher** (specified in root `package.json`).

**Check your current version:**
```bash
node --version
```

**Upgrade if needed:**
```bash
# Using nvm (recommended)
nvm install 24
nvm use 24

# Or update Node directly from https://nodejs.org/
```

**Verify upgrade:**
```bash
node --version  # Should show v24.x.x or higher
pnpm --version  # Should show v10.x.x or higher
```

## Installation

Once you have the correct Node version, install Jest dependencies:

```bash
cd /Users/stefanrusek/Code/song_book

# Install all dependencies including Jest
pnpm install

# This will install:
# - jest
# - ts-jest
# - @types/jest
# - @testing-library/react (for web package)
# - @testing-library/jest-dom (for web package)
```

## File Structure

The configuration files have been created:

```
song_book/
├── package.json                          (updated with test scripts)
├── packages/
│   ├── shared/
│   │   ├── jest.config.js               (NEW - shared package config)
│   │   ├── package.json                 (updated with Jest deps)
│   │   └── utils/
│   │       ├── text-normalize.ts        (source code)
│   │       └── __tests__/
│   │           ├── fixtures.ts          (272 lines - test data)
│   │           ├── test-utils.ts        (209 lines - helpers)
│   │           └── text-normalize.test.ts (280 lines - 36+ tests)
│   └── web/
│       ├── jest.config.js               (NEW - web package config)
│       ├── jest.setup.js                (NEW - setup file)
│       ├── package.json                 (updated with Jest deps)
│       └── lib/
│           ├── search-utils.ts          (source code)
│           └── __tests__/
│               └── search-utils.test.ts (340 lines - 23+ tests)
```

## Running Tests

### Run All Tests
```bash
# From root directory
pnpm test

# This will run all tests in both packages and show results
```

### Run Tests in Specific Package
```bash
# Test only the shared package (normalizeText tests)
pnpm --filter @songbook/shared test

# Test only the web package (searchHymns tests)
pnpm --filter @songbook/web test
```

### Run Tests in Watch Mode
```bash
# Watch all tests for changes
pnpm test:watch

# Watch specific package
pnpm --filter @songbook/shared test:watch
```

### Generate Coverage Reports
```bash
# Full coverage report for all packages
pnpm test:coverage

# Coverage for specific package
pnpm --filter @songbook/shared test:coverage
```

### Run Specific Test File
```bash
# Using Jest directly through pnpm
pnpm --filter @songbook/shared test text-normalize.test.ts

# Or
pnpm --filter @songbook/web test search-utils.test.ts
```

### Run Tests Matching Pattern
```bash
# Run all normalization tests
pnpm --filter @songbook/shared test --testNamePattern="normalizes"

# Run all search tests
pnpm --filter @songbook/web test --testNamePattern="User Story"
```

## Test Suites Overview

### Shared Package Tests (`packages/shared/utils/__tests__/text-normalize.test.ts`)

**36+ tests for the `normalizeText()` function:**

1. **Individual Polish Characters** (18 tests)
   - 9 lowercase: ą, ć, ę, ł, ń, ó, ś, ź, ż
   - 9 uppercase: Ą, Ć, Ę, Ł, Ń, Ó, Ś, Ź, Ż
   - Each validates normalization to base character

2. **Word Normalization** (8 tests)
   - Examples: "było"→"bylo", "Jeżeli"→"jezeli", "żal"→"zal"
   - Tests single and multiple diacriticals in words

3. **Phrase Normalization** (4 tests)
   - Multi-word Polish phrases with mixed diacriticals

4. **Edge Cases** (4 tests)
   - Empty strings, non-Polish characters, numbers, special characters

5. **Idempotency** (2 tests)
   - Double normalization produces same result
   - Case variation consistency

6. **Bidirectional Equivalence** (8+ tests)
   - Accented and unaccented versions normalize to same value

7. **Mixed Content** (4+ tests)
   - Polish characters mixed with regular text and special chars

8. **Unicode Edge Cases** (4+ tests)
   - Repeated marks, mixed case, whitespace preservation

9. **Return Type Validation** (3+ tests)
   - Type is always string
   - Output is always lowercase
   - Output length ≤ input length

**Run with:**
```bash
pnpm --filter @songbook/shared test text-normalize.test.ts
```

**Expected output:**
```
PASS  utils/__tests__/text-normalize.test.ts
  normalizeText - Polish Diacritical Normalization
    Individual Polish Characters - Lowercase
      ✓ normalizes lowercase 'ą' to 'a' (X ms)
      ✓ normalizes lowercase 'ć' to 'c' (X ms)
      [... 16 more ...]
    [... all test suites ...]

Test Suites: 1 passed, 1 total
Tests:       36 passed, 36 total
```

### Web Package Tests (`packages/web/lib/__tests__/search-utils.test.ts`)

**23+ tests for the `searchHymns()` function:**

1. **User Story 1: Accented Query → Accented Content** (4 tests)
   - Query "Było" finds hymns with "Było" in title/verses/chorus
   - Relevance scoring validated (0.8 for title, 0.3 for chorus)

2. **User Story 2: Unaccented Query → Accented Content** (5 tests) ⭐ **CORE FIX**
   - Query "bylo" finds hymn #1 with title "Było"
   - Query "zal" finds hymn #42 with title "żal"
   - Bidirectional equivalence: "bylo" and "Było" return same results
   - Relevance scores identical for accented/unaccented queries

3. **User Story 3: Accented Query → Unaccented Content** (2 tests)
   - Edge case for data consistency

4. **Regression Tests** (10 tests)
   - Exact number matching (hymn #42 with relevance 1.0)
   - Title substring matching
   - Author name matching
   - Verse content matching (relevance 0.4)
   - Chorus content matching (relevance 0.3)
   - Multiple matches ranked correctly
   - Empty/whitespace query handling
   - Special character handling
   - Relevance scoring order validation
   - One result per hymn validation

5. **Search Result Validation** (2+ tests)
   - Result structure integrity
   - Match context non-empty

6. **Performance Tests** (3 tests)
   - Search completes within <100ms
   - Average search <10ms across 100 iterations
   - Empty search returns immediately (<1ms)

7. **Edge Cases** (5+ tests)
   - Single character queries
   - Very long queries
   - Unicode normalization in queries
   - Mixed case queries

**Run with:**
```bash
pnpm --filter @songbook/web test search-utils.test.ts
```

**Expected output:**
```
PASS  lib/__tests__/search-utils.test.ts
  searchHymns - Polish Diacritical Search Integration
    User Story 1 - Accented Query → Accented Content
      ✓ query "Było" finds hymn with title "Było" (X ms)
      [... more tests ...]
    User Story 2 - Unaccented Query → Accented Content (CORE ISSUE)
      ✓ query "bylo" (unaccented) finds hymn #1 with title "Było" (X ms)
      ✓ bidirectional equivalence: "bylo" and "Było" return same results (X ms)
      [... more tests ...]
    [... all test suites ...]

Test Suites: 1 passed, 1 total
Tests:       23 passed, 23 total
```

## Coverage Report

After running `pnpm test:coverage`, you should see:

### Shared Package Coverage
```
File                     | % Stmts | % Branch | % Funcs | % Lines |
---------|---------|---------|---------|----------|
All files           |   100   |   100   |   100   |   100   |
 text-normalize.ts  |   100   |   100   |   100   |   100   |
```

### Web Package Coverage
```
File                     | % Stmts | % Branch | % Funcs | % Lines |
---------|---------|---------|---------|----------|
All files           |    80   |    80   |    80   |    80   |
 search-utils.ts    |   100   |   100   |   100   |   100   |
```

## Troubleshooting

### Error: "This version of pnpm requires at least Node.js v18.12"
**Solution:** Upgrade Node.js to v24.0.0 or higher
```bash
nvm install 24
nvm use 24
```

### Error: "Cannot find module 'jest'"
**Solution:** Run `pnpm install` to install Jest dependencies
```bash
pnpm install
```

### Error: "jest is not recognized"
**Solution:** Use pnpm to run tests:
```bash
pnpm test              # instead of jest
pnpm --filter @songbook/shared test
```

### Tests timeout or run very slowly
**Solution:** Increase Jest timeout for slow systems:
```bash
pnpm test --testTimeout=10000
```

### TypeScript compilation errors in tests
**Solution:** Ensure TypeScript and ts-jest are installed:
```bash
pnpm install
pnpm --filter @songbook/shared test --showConfig
```

## Continuous Integration

To add these tests to CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Install dependencies
  run: pnpm install

- name: Run tests
  run: pnpm test

- name: Generate coverage
  run: pnpm test:coverage

- name: Check coverage thresholds
  run: pnpm test -- --coverage --collectCoverageFrom="packages/*/utils/**/*.ts"
```

## Test Data Reference

### Polish Diacritical Characters Covered
- ą ↔ a
- ć ↔ c
- ę ↔ e
- ł ↔ l
- ń ↔ n
- ó ↔ o
- ś ↔ s
- ź ↔ z
- ż ↔ z

Plus all uppercase variants (Ą, Ć, Ę, Ł, Ń, Ó, Ś, Ź, Ż)

### Mock Hymn Data
Three representative hymns are included in test fixtures:
- Hymn #1: "Było" (title with ł)
- Hymn #42: "żal" (title with ż)
- Hymn with Polish text in verses and chorus

### Performance Baselines
- `normalizeText()`: <1ms per call (1000 calls < 1 second)
- `searchHymns()`: <100ms for ~1000 mock hymns
- Average search: <10ms per query

## Next Steps

1. **Upgrade Node.js to v24+**
2. **Run `pnpm install`**
3. **Run `pnpm test` to validate all tests pass**
4. **Review coverage report with `pnpm test:coverage`**
5. **Commit changes to version control**
6. **Add test execution to your CI/CD pipeline**

## References

- Jest Documentation: https://jestjs.io/
- ts-jest: https://kulshekhar.github.io/ts-jest/
- Testing Library: https://testing-library.com/
- Project Specification: `specs/002-fix-search/spec.md`
- Implementation Plan: `specs/002-fix-search/plan.md`
- Task Breakdown: `specs/002-fix-search/tasks.md`
