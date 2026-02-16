# Quick Start: Search Diacritical Matching Tests

**Feature**: 002-fix-search
**Phase**: Phase 1 - Ready for Implementation
**Date**: 2026-02-16

## Overview

This document provides a quick reference for developers implementing the comprehensive test suite for search diacritical matching.

---

## What You're Building

Two test files with 60+ test cases covering:
- ✅ All 32 Polish diacritical character variants
- ✅ Bidirectional matching (accented ↔ unaccented)
- ✅ Full search integration scenarios
- ✅ Regression protection for existing functionality

**Deliverables**:
- `packages/shared/utils/__tests__/text-normalize.test.ts` (50+ tests)
- `packages/web/lib/__tests__/search-utils.test.ts` (22+ tests)

---

## File Locations

| File | Purpose | Lines |
|------|---------|-------|
| `packages/shared/utils/text-normalize.ts` | Source: Normalization function (read-only) | ~15 |
| `packages/shared/utils/__tests__/text-normalize.test.ts` | NEW: Normalization tests | ~300 |
| `packages/web/lib/search-utils.ts` | Source: Search function (read-only) | ~96 |
| `packages/web/lib/__tests__/search-utils.test.ts` | NEW: Search integration tests | ~200 |
| `specs/002-fix-search/data-model.md` | Reference: Test data structures | - |
| `specs/002-fix-search/research.md` | Reference: Implementation rationale | - |

---

## Polish Characters to Test

**The 9 Unique Polish Diacritical Characters** (and their uppercase variants):
- `ą` / `Ą` - A with ogonek
- `ć` / `Ć` - C with acute
- `ę` / `Ę` - E with ogonek
- `ł` / `Ł` - L with stroke (THE MAIN ISSUE)
- `ń` / `Ń` - N with acute
- `ó` / `Ó` - O with acute
- `ś` / `Ś` - S with acute
- `ź` / `Ź` - Z with acute
- `ż` / `Ż` - Z with dot above

**Total test coverage**: 18+ individual characters × multiple contexts = 50+ tests

---

## Test Structure Examples

### Text Normalization Tests

**Pattern**: Parameterized tests for each character and scenario

```typescript
// Single character tests
describe('normalizeText - Polish characters', () => {
  test('normalizes ł to l', () => {
    expect(normalizeText('ł')).toBe('l')
  })

  test('normalizes Ł to l (case-insensitive)', () => {
    expect(normalizeText('Ł')).toBe('l')
  })

  // ... 30+ more character tests
})

// Bidirectional matching tests
describe('normalizeText - Bidirectional equivalence', () => {
  test('"było" and "Było" normalize to same value', () => {
    expect(normalizeText('było')).toBe(normalizeText('Było'))
  })

  // ... 8+ more equivalence tests
})

// Edge cases
describe('normalizeText - Edge cases', () => {
  test('empty string returns empty string', () => {
    expect(normalizeText('')).toBe('')
  })

  test('non-Polish characters pass through', () => {
    expect(normalizeText('hello')).toBe('hello')
  })
})
```

### Search Integration Tests

**Pattern**: User Story scenarios with mock hymn data

```typescript
// User Story 2: Unaccented query finds accented content
describe('searchHymns - User Story 2 (unaccented→accented)', () => {
  const hymns = [
    {
      number: 1,
      title: 'Było światłem',
      // ... other fields
    }
  ]

  test('query "bylo" finds hymn with title "Było"', () => {
    const results = searchHymns(hymns, 'bylo')
    expect(results).toHaveLength(1)
    expect(results[0].hymn.number).toBe(1)
    expect(results[0].matchType).toBe('title')
    expect(results[0].relevance).toBe(0.8)
  })

  // ... 3+ more scenarios per user story
})

// Regression tests
describe('searchHymns - Regression suite', () => {
  test('exact number match still works', () => {
    const results = searchHymns(hymns, '42')
    // Should return hymn #42, not by title
    expect(results[0].matchType).toBe('number')
    expect(results[0].relevance).toBe(1.0)
  })

  // ... 9+ more regression tests
})
```

---

## Test Execution

### Run All Tests

```bash
# From repo root
pnpm test

# Or from specific package
cd packages/shared && pnpm test
cd packages/web && pnpm test

# Watch mode (for development)
pnpm test --watch

# With coverage report
pnpm test --coverage
```

### Run Specific Test File

```bash
# Normalization tests only
pnpm test text-normalize.test.ts

# Search tests only
pnpm test search-utils.test.ts
```

### Coverage Report

```bash
# Generate coverage
pnpm test --coverage

# View in browser (typically)
open coverage/index.html
```

---

## Key Implementation Points

### 1. Import Existing Functions

```typescript
// In text-normalize.test.ts
import { normalizeText } from '../text-normalize'

// In search-utils.test.ts
import { searchHymns } from '../search-utils'
import type { Hymn, SearchResult } from '@songbook/shared/types'
```

### 2. Use TypeScript Strict Mode

```typescript
// ✅ Correct: Explicit types, no 'any'
const input: string = 'Było'
const result: string = normalizeText(input)
expect(result).toBe('bylo')

// ❌ Wrong: Never use 'any'
const result: any = normalizeText('Było')
```

### 3. Create Test Fixtures

```typescript
// Centralized mock data
const mockHymns: Hymn[] = [
  {
    number: 1,
    title: 'Było światłem',
    author: 'Test Author',
    book: 'Test Book',
    chapter: 1,
    verses: ['Test verse with żal'],
    chorus: 'Test chorus with ł'
  },
  // ... more hymns
]
```

### 4. Use Parameterized Tests

```typescript
// Efficient way to test multiple similar cases
const testCases = [
  { input: 'ł', expected: 'l' },
  { input: 'Ł', expected: 'l' },
  { input: 'było', expected: 'bylo' },
]

testCases.forEach(({ input, expected }) => {
  test(`normalizeText("${input}") → "${expected}"`, () => {
    expect(normalizeText(input)).toBe(expected)
  })
})
```

### 5. Test Both Directions

```typescript
// For bidirectional matching requirement
test('unaccented query matches accented content', () => {
  const results = searchHymns(hymns, 'bylo')
  expect(results.some(r => r.hymn.title === 'Było')).toBe(true)
})

test('accented query matches unaccented content', () => {
  const results = searchHymns(hymns, 'Było')
  expect(results.some(r => r.hymn.title === 'Było')).toBe(true)
})
```

---

## Test Checklist

Before committing tests, verify:

- [ ] 50+ normalization tests pass
- [ ] 22+ search integration tests pass
- [ ] 100% code coverage for `normalizeText()`
- [ ] 100% code coverage for `searchHymns()`
- [ ] All 32 Polish character variants tested
- [ ] Bidirectional matching tested (accented ↔ unaccented)
- [ ] All three User Stories covered
- [ ] Regression tests all pass
- [ ] No `any` type usage (TypeScript strict mode)
- [ ] All tests have descriptive names
- [ ] Performance within baseline (<1ms per call)
- [ ] Tests run in <1 second total

---

## Success Criteria Verification

After implementation, verify:

✅ **SC-001**: All 32 Polish diacritical variants normalize correctly
- Check: Run test for each character

✅ **SC-002**: Query "bylo" returns hymns with "Było"
- Check: Search integration test for User Story 2

✅ **SC-003**: Test coverage 100% for `normalizeText()`
- Check: `pnpm test --coverage` shows 100%

✅ **SC-004**: Tests for all 16 lowercase + 16 uppercase variants
- Check: Test file has parameterized tests covering all

✅ **SC-005**: No search regressions
- Check: Regression test suite passes

✅ **SC-006**: Users can search without removing diacriticals
- Check: All User Story tests pass

---

## Common Pitfalls to Avoid

❌ **Don't**:
- Use `any` type - violates TypeScript strict mode
- Skip edge cases (empty strings, numbers, etc.)
- Test only one direction (test both "było" → "Było" AND "Było" → "było")
- Forget to test relevance scoring
- Miss uppercase variants
- Include console.log() or other debug code

✅ **Do**:
- Use explicit types throughout
- Cover all 32 Polish characters
- Test bidirectional matching
- Verify relevance scores in search results
- Test both uppercase and lowercase
- Use descriptive test names
- Commit tests with `test(lib):` prefix

---

## Git Workflow

After tests are implemented:

```bash
# 1. Create feature branch (should already exist)
git checkout 002-fix-search

# 2. Create tests
# (implement test files following structure above)

# 3. Run tests to verify
pnpm test

# 4. Stage and commit
git add packages/shared/utils/__tests__/text-normalize.test.ts
git commit -m "test(lib): add text normalization tests for all Polish diacriticals"

git add packages/web/lib/__tests__/search-utils.test.ts
git commit -m "test(lib): add search integration tests with bidirectional matching"

# 5. Verify no regressions
pnpm test

# 6. Push and create PR
git push -u origin 002-fix-search
gh pr create --title "test(lib): add comprehensive search diacritical matching tests" \
  --body "Add 60+ tests covering all Polish diacritical variants..."
```

---

## File Size Expectations

Estimated lines of code:
- `text-normalize.test.ts`: 250-350 lines
- `search-utils.test.ts`: 180-250 lines
- Total: 430-600 lines of test code

This is normal for comprehensive test coverage. Tests are typically 1-2× source code size.

---

## References

- **Source Code**: `packages/shared/utils/text-normalize.ts`
- **Source Code**: `packages/web/lib/search-utils.ts`
- **Test Contracts**: `specs/002-fix-search/data-model.md`
- **Rationale**: `specs/002-fix-search/research.md`
- **Implementation Plan**: `specs/002-fix-search/plan.md`
- **Feature Spec**: `specs/002-fix-search/spec.md`
- **Test Framework**: Jest (configured in `packages/shared` and `packages/web`)

---

## Need Help?

- **Jest Documentation**: https://jestjs.io/docs/getting-started
- **TypeScript Testing**: Look at existing `.test.ts` files in packages/
- **Constitution**: See `.specify/memory/constitution.md` for project standards
- **Questions**: All decisions documented in `research.md` with rationale
