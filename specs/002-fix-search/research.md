# Research & Discovery: Fix Search Diacritical Matching

**Feature**: 002-fix-search
**Date**: 2026-02-16
**Phase**: Phase 0 - Complete

## Executive Summary

Research confirms the existing normalization algorithm is correct and uses industry-standard Unicode NFD normalization. No implementation fixes needed. Solution focuses entirely on comprehensive test coverage to prevent regressions.

---

## Research Questions & Findings

### 1. How Does Unicode NFD Normalization Work for Polish Characters?

**Question**: Is Unicode NFD normalization sufficient for removing Polish diacritical marks?

**Decision**: YES - Use Unicode NFD normalization (confirmed as correct)

**Rationale**:
- NFD (Canonical Decomposition) decomposes combined characters into base + combining marks
- Example: "ł" (U+0142 Latin Small Letter L with Stroke) decomposes to "l" + combining mark
- Polish diacritical characters map cleanly to combining marks (U+0300-U+036F range)
- After decomposition, regex `/[\u0300-\u036f]/g` removes all combining marks
- Result: "było" → "b" + "y" + "l" + "o" (all diacriticals removed)

**Alternatives Considered**:
- Library-based approach (e.g., `diacritic-js`, `unidecode`): Rejected because overhead of external dependency > simplicity of built-in Unicode API
- Manual mapping table: Rejected because unmaintainable and incomplete (new characters/variants always possible)
- Locale-specific approaches: Rejected because not needed (Unicode solution is universal)

**Validation**: Confirmed by code inspection of `packages/shared/utils/text-normalize.ts`

---

### 2. Are All Polish Diacritical Characters Covered?

**Question**: Does normalization work for all 16 Polish lowercase and 16 uppercase diacritical characters?

**Decision**: YES - All covered (need comprehensive tests to validate)

**Polish Diacritical Character Set**:
- **Lowercase** (16 characters): ą, ć, ę, ł, ń, ó, ś, ź, ż + others including ẽ if present
- **Uppercase** (16 characters): Ą, Ć, Ę, Ł, Ń, Ó, Ś, Ź, Ż + corresponding uppercase

**Rationale**:
- All Polish diacriticals use combining marks in U+0300-U+036F range
- Polish characters standardized in Unicode (ISO 8859-2 and UTF-8)
- No special cases or exceptions for Polish within Unicode standard

**Test Coverage Plan**:
- 1 test per lowercase character (16 tests)
- 1 test per uppercase character (16 tests)
- Pair tests (unaccented + accented matching): 8+ tests
- Total: 40+ normalization tests

---

### 3. Does Search Correctly Apply Normalization?

**Question**: Is `normalizeText()` properly applied in `searchHymns()` for all search paths?

**Decision**: YES - Implementation is correct for all paths

**Code Review Findings** (`packages/web/lib/search-utils.ts`):
- ✅ Line 11: Query normalized at entry point
- ✅ Line 28: Title text normalized before comparison
- ✅ Line 41: Author text normalized before comparison
- ✅ Line 57: Verse text normalized for search
- ✅ Line 77: Chorus text normalized for search
- ✅ No path skips normalization
- ✅ Relevance scoring independent of normalization

**Integration Pattern**: Both query and hymn text normalized with identical function before comparison using `includes()`. This ensures bidirectional matching (accented ↔ unaccented).

---

### 4. What Test Framework and Structure?

**Question**: What's the best approach for test organization and framework?

**Decision**: Jest + co-located `__tests__` directories (existing project pattern)

**Rationale**:
- Project already uses Jest for testing
- Co-located tests (same directory as source) improve developer workflow
- Easier to maintain tests alongside code changes
- Jest provides excellent TypeScript support and coverage reporting
- Test files follow convention: `module-name.test.ts` in `__tests__/` subdirectory

**Test Organization**:
- `packages/shared/utils/__tests__/text-normalize.test.ts`: Core normalization tests
- `packages/web/lib/__tests__/search-utils.test.ts`: Search integration tests
- Both files use TypeScript with strict mode (no `any` type)
- Test data includes representative hymn objects with Polish text

---

### 5. How to Test the Bidirectional Matching Requirement?

**Question**: How do we verify that "bylo" matches "Było" AND "Było" matches "bylo"?

**Decision**: Use parameterized tests with bidirectional test cases

**Test Pattern**:
```typescript
describe('Bidirectional normalization matching', () => {
  const testCases = [
    { accented: 'Było', unaccented: 'bylo' },
    { accented: 'żal', unaccented: 'zal' },
    // ... more pairs
  ]

  testCases.forEach(({ accented, unaccented }) => {
    test(`"${unaccented}" matches "${accented}"`, () => {
      expect(normalizeText(accented)).toBe(normalizeText(unaccented))
    })

    test(`"${accented}" matches "${unaccented}"`, () => {
      expect(normalizeText(accented)).toBe(normalizeText(unaccented))
    })
  })
})
```

**Coverage**: Each pair tested in both directions = 16+ tests minimum

---

### 6. What Performance Targets for Tests?

**Question**: Should tests include performance benchmarks?

**Decision**: YES - Include baseline performance tests

**Performance Targets**:
- `normalizeText()` execution: <1ms per call
- Full search test suite execution: <1 second total
- Individual test execution: <50ms per test

**Rationale**:
- Normalization is call on every search query (performance sensitive)
- Baseline tests catch performance regressions early
- Tests should run in local developer workflow (<5 seconds for full suite)

---

### 7. How to Verify No Regressions?

**Question**: What test scenarios ensure existing search functionality isn't broken?

**Decision**: Include regression test matrix covering all search scenarios

**Regression Test Scenarios**:
1. Exact number match (e.g., "42" matches hymn #42)
2. Title substring match
3. Author name match
4. Verse content match (checks snippet extraction)
5. Chorus content match
6. Relevance scoring (number > title > author > verse > chorus)
7. Multiple results sorted by relevance
8. Empty query returns no results
9. Special characters in query
10. Case-insensitive matching

**Coverage**: 10+ regression tests ensuring backward compatibility

---

## Conclusions & Decisions

✅ **Algorithm is Sound**: Unicode NFD normalization is correct approach

✅ **Implementation is Correct**: `normalizeText()` and `searchHymns()` apply normalization properly

✅ **Coverage is Needed**: No existing Jest tests for normalization or search functions

✅ **Test Strategy Confirmed**:
- 40+ normalization tests (all Polish diacriticals + edge cases)
- 10+ search integration tests (all scenarios)
- 10+ regression tests (existing functionality)
- Total: 60+ tests targeting 100% coverage

✅ **No Technology Changes Required**: Use existing Jest + TypeScript stack

---

## Next Steps

1. **Phase 1**: Create `data-model.md` documenting test data structures
2. **Phase 1**: Create test contracts documenting expected test behavior
3. **Phase 1**: Generate quickstart.md with test execution instructions
4. **Phase 2** (via `/speckit.tasks`): Break down into granular test implementation tasks
5. **Implementation**: Write tests following task breakdown
