# Data Model & Test Contracts

**Feature**: 002-fix-search
**Phase**: Phase 1 - Design
**Date**: 2026-02-16

## Overview

This document defines the data structures, test fixtures, and API contracts for implementing comprehensive test coverage of the search diacritical matching functionality.

---

## Entity Models

### Polish Character Set

**Purpose**: Define the complete set of Polish diacritical characters to test

```typescript
type PolishCharacter = {
  lowercase: string
  uppercase: string
  description: string
  unicodeCodepoint: string
  normalizesTo: string
}

// Complete Polish diacritical character set
const POLISH_DIACRITICALS: PolishCharacter[] = [
  {
    lowercase: 'ą',
    uppercase: 'Ą',
    description: 'Latin Small Letter A with Ogonek',
    unicodeCodepoint: 'U+0105',
    normalizesTo: 'a'
  },
  {
    lowercase: 'ć',
    uppercase: 'Ć',
    description: 'Latin Small Letter C with Acute',
    unicodeCodepoint: 'U+0107',
    normalizesTo: 'c'
  },
  {
    lowercase: 'ę',
    uppercase: 'Ę',
    description: 'Latin Small Letter E with Ogonek',
    unicodeCodepoint: 'U+0119',
    normalizesTo: 'e'
  },
  {
    lowercase: 'ł',
    uppercase: 'Ł',
    description: 'Latin Small Letter L with Stroke',
    unicodeCodepoint: 'U+0142',
    normalizesTo: 'l'
  },
  {
    lowercase: 'ń',
    uppercase: 'Ń',
    description: 'Latin Small Letter N with Acute',
    unicodeCodepoint: 'U+0144',
    normalizesTo: 'n'
  },
  {
    lowercase: 'ó',
    uppercase: 'Ó',
    description: 'Latin Small Letter O with Acute',
    unicodeCodepoint: 'U+00F3',
    normalizesTo: 'o'
  },
  {
    lowercase: 'ś',
    uppercase: 'Ś',
    description: 'Latin Small Letter S with Acute',
    unicodeCodepoint: 'U+015B',
    normalizesTo: 's'
  },
  {
    lowercase: 'ź',
    uppercase: 'Ź',
    description: 'Latin Small Letter Z with Acute',
    unicodeCodepoint: 'U+0139',
    normalizesTo: 'z'
  },
  {
    lowercase: 'ż',
    uppercase: 'Ż',
    description: 'Latin Small Letter Z with Dot Above',
    unicodeCodepoint: 'U+017C',
    normalizesTo: 'z'
  },
  // Additional Polish characters (8 more for complete set of 16 lowercase + 16 uppercase)
]
```

### Test Hymn Fixture

**Purpose**: Mock hymn data for search integration tests

```typescript
type Hymn = {
  number: number
  title: string
  author: string
  book: string
  chapter: number
  verses: string[]
  chorus: string
}

// Representative test hymns with Polish text
const TEST_HYMNS: Hymn[] = [
  {
    number: 1,
    title: 'Było światłem twoje słowo', // Contains: ł, ó
    author: 'Ks. Stanisław',
    book: 'Piesni Ducha',
    chapter: 1,
    verses: [
      'Kiedy noc nas otaczała,\nBył wiedzący już znowu wzywał.',
      'Jeżeli serce twoje boli,\nZnaj że czeka na cię ponad doli.'
    ],
    chorus: 'Święty, święty będzie Bóg nasz'
  },
  {
    number: 42,
    title: 'Jeżeli zapytasz mnie o żal', // Contains: ż, ł
    author: 'Maria Konopnicka',
    book: 'Pieśni Narodu',
    chapter: 3,
    verses: [
      'O drzewo stare, co się przeciąża,\nW serce moje wpada pierwsze strąża.',
      'Pieśń moja sędziowie niech słyszą,\nA ślepcy niechaj się podźwignęła.'
    ],
    chorus: 'Życzę tobie, życzę tobie,\nPokoju w sercu i w żywocie'
  },
  {
    number: 7,
    title: 'Na początku było słowo', // Contains: ł, ó
    author: 'Kraków, 1552',
    book: 'Pieśni Starowolskich',
    chapter: 1,
    verses: [
      'Która niego dla mnie czuli\nA w niej dobroć swojej duszy.',
      'Powie serce moje śmiało,\nNie mnie dłuży już nie żałuję'
    ],
    chorus: 'Aleluia, Aleluia, Aleluia'
  },
  // Additional hymns with comprehensive Polish character coverage
]
```

### Test Case Structure

**Purpose**: Define test case data for parameterized tests

```typescript
type NormalizationTestCase = {
  input: string
  expected: string
  description: string
  category: 'single-character' | 'word' | 'phrase' | 'edge-case'
}

type SearchTestCase = {
  query: string
  expectedMatches: number[]  // Hymn numbers that should match
  expectedRelevances: { [hymnNumber: number]: number }
  description: string
  priority: 'P1' | 'P2'
}

type RegressionTestCase = {
  query: string
  category: 'number-match' | 'title-match' | 'author-match' | 'verse-match' | 'chorus-match'
  expectedBehavior: string
  description: string
}

// Example normalization test cases
const NORMALIZATION_TESTS: NormalizationTestCase[] = [
  {
    input: 'ą',
    expected: 'a',
    description: 'Single lowercase ą normalizes to a',
    category: 'single-character'
  },
  {
    input: 'Ą',
    expected: 'a',
    description: 'Uppercase Ą normalizes to lowercase a',
    category: 'single-character'
  },
  {
    input: 'było',
    expected: 'bylo',
    description: 'Word "było" with ł normalizes to "bylo"',
    category: 'word'
  },
  {
    input: 'Było',
    expected: 'bylo',
    description: 'Word "Było" with ł and uppercase normalizes to "bylo"',
    category: 'word'
  },
  {
    input: 'Jeżeli zapytasz mnie o żal',
    expected: 'jezeli zapytasz mnie o zal',
    description: 'Phrase with multiple Polish diacriticals normalizes correctly',
    category: 'phrase'
  },
  {
    input: '',
    expected: '',
    description: 'Empty string returns empty string',
    category: 'edge-case'
  },
  {
    input: 'hello123!@#',
    expected: 'hello123!@#',
    description: 'Non-Polish characters pass through unchanged',
    category: 'edge-case'
  },
  // 35+ more test cases covering all Polish characters
]

// Example search test cases (User Story 2: unaccented finding accented)
const SEARCH_TESTS_USER_STORY_2: SearchTestCase[] = [
  {
    query: 'bylo',
    expectedMatches: [1, 7],  // Hymns with "Było" or "było"
    expectedRelevances: { 1: 0.8, 7: 0.8 },
    description: 'Query "bylo" finds hymns with title "Było"',
    priority: 'P1'
  },
  {
    query: 'zal',
    expectedMatches: [42],  // Hymn #42 has "żal"
    expectedRelevances: { 42: 0.8 },
    description: 'Query "zal" finds hymn with "żal" in title',
    priority: 'P1'
  },
  {
    query: 'jezeli',
    expectedMatches: [42],  // Hymn #42 has "Jeżeli"
    expectedRelevances: { 42: 0.4 },  // Verse match = lower relevance
    description: 'Query "jezeli" finds hymn with "Jeżeli" in verse',
    priority: 'P1'
  },
  // 10+ more search test cases
]
```

---

## API Contracts

### Core Function: `normalizeText()`

**Location**: `packages/shared/utils/text-normalize.ts`

**Contract**:
```typescript
/**
 * Normalize text for diacritic-insensitive search
 * Removes Polish diacritical marks and converts to lowercase
 *
 * @param text - Input text potentially containing diacritical marks
 * @returns Normalized text with marks removed and lowercased
 *
 * @example
 * normalizeText("Było") // "bylo"
 * normalizeText("JEŻELI") // "jezeli"
 * normalizeText("hello") // "hello"
 */
export function normalizeText(text: string): string
```

**Input Validation**:
- Input: `string` - any valid Unicode string
- No validation exceptions thrown
- Empty strings handled gracefully

**Output Specification**:
- Output: `string` - same length or shorter (diacriticals removed)
- All uppercase letters converted to lowercase
- All diacritical marks removed
- Non-Polish characters unchanged
- Special characters, numbers, punctuation unchanged

**Invariants**:
- `normalizeText(x) === normalizeText(normalizeText(x))` (idempotent)
- `normalizeText(x.toUpperCase()) === normalizeText(x)` (case-insensitive)
- For any Polish character pair `(accented, unaccented)`: `normalizeText(accented) === normalizeText(unaccented)`

---

### Search Function: `searchHymns()`

**Location**: `packages/web/lib/search-utils.ts`

**Contract**:
```typescript
/**
 * Search hymns by query across number, title, author, and lyrics
 * Performs diacritic-insensitive search using normalizeText()
 *
 * @param hymns - Array of hymn objects to search
 * @param query - Search query string (may contain accented or unaccented characters)
 * @returns Array of SearchResult objects sorted by relevance (descending)
 *
 * @example
 * searchHymns(hymns, "bylo") // Returns hymns with "Było" in title
 * searchHymns(hymns, "42") // Returns hymn #42 if it exists
 */
export function searchHymns(hymns: Hymn[], query: string): SearchResult[]
```

**Input Specification**:
- `hymns`: Array of Hymn objects (may be empty)
- `query`: string (may be accented or unaccented, case-insensitive)

**Output Specification**:
- Returns: `SearchResult[]` sorted by relevance score (highest first)
- Each result contains: hymn, matchType, matchContext, relevance
- Empty array if no matches found
- Empty array if query is empty or whitespace-only

**Relevance Scoring**:
- Exact number match: 1.0
- Title match: 0.8
- Author match: 0.6
- Verse match: 0.4
- Chorus match: 0.3
- Only one match per hymn (priority: number > title > author > verse > chorus)

**Invariant**:
- `searchHymns(hymns, "bylo").length === searchHymns(hymns, "Było").length` (bidirectional equivalence)

---

## Test Fixture Definition

### Mock Data Constants

**File**: `packages/shared/utils/__tests__/test-fixtures.ts`

```typescript
/**
 * Complete Polish character set for parameterized testing
 * Covers all 16 lowercase + 16 uppercase diacritical characters
 */
export const POLISH_CHARACTERS_LOWER = [
  'ą', 'ć', 'ę', 'ł', 'ń', 'ó', 'ś', 'ź', 'ż',
  // Additional characters for complete Polish alphabet
]

export const POLISH_CHARACTERS_UPPER = POLISH_CHARACTERS_LOWER.map(c => c.toUpperCase())

/**
 * Representative hymn objects with Polish text for search testing
 */
export const HYMN_FIXTURES = [
  // 3+ hymns with comprehensive Polish character coverage
]

/**
 * Test case data for parameterized tests
 */
export const NORMALIZATION_TEST_CASES: NormalizationTestCase[] = [
  // 40+ test cases covering all scenarios
]

export const SEARCH_TEST_CASES: SearchTestCase[] = [
  // 20+ test cases for User Stories 1-3
]

export const REGRESSION_TEST_CASES: RegressionTestCase[] = [
  // 10+ test cases ensuring no regressions
]
```

---

## Test Execution Contract

### Test Suite: Text Normalization

**File**: `packages/shared/utils/__tests__/text-normalize.test.ts`

**Coverage Target**: 100% of `normalizeText()` function

**Test Categories**:
1. **Individual Character Tests** (32 tests):
   - 1 test per lowercase Polish diacritical
   - 1 test per uppercase Polish diacritical

2. **Word Tests** (8 tests):
   - Common Polish words with single diacritical
   - Words with multiple diacriticals

3. **Phrase Tests** (4 tests):
   - Realistic hymn text snippets
   - Mixed accented and regular characters

4. **Edge Case Tests** (4 tests):
   - Empty strings
   - Numbers and special characters
   - Unicode edge cases

5. **Idempotency Tests** (2 tests):
   - Calling normalization twice produces same result
   - Case variations produce same result

**Total**: 50+ normalization tests

---

### Test Suite: Search Integration

**File**: `packages/web/lib/__tests__/search-utils.test.ts`

**Coverage Target**: 100% code paths in `searchHymns()`

**Test Categories**:
1. **User Story 1 Tests** (4 tests):
   - Accented query finds accented content
   - Multiple matching hymns
   - Correct relevance scoring

2. **User Story 2 Tests** (4 tests):
   - Unaccented query finds accented content
   - Various Polish characters
   - Correct relevance ranking

3. **User Story 3 Tests** (2 tests):
   - Accented query finds unaccented content
   - Reverse matching validation

4. **Regression Tests** (10 tests):
   - Number matching
   - Title substring matching
   - Author matching
   - Verse and chorus matching
   - Multi-match ranking
   - Empty queries
   - Special characters in queries

5. **Performance Tests** (2 tests):
   - Baseline performance measurement
   - Large dataset performance

**Total**: 22+ search integration tests

---

## Data Validation Rules

### Hymn Data Validation
- `number`: Positive integer, unique per hymn
- `title`: Non-empty string, may contain Polish characters
- `author`: Optional string
- `verses`: Array of non-empty strings
- `chorus`: Optional string
- `book` and `chapter`: String and number respectively

### Search Result Validation
- Each result has matching hymn
- Relevance score between 0.0 and 1.0
- Results sorted by relevance (descending)
- Only one result per hymn

---

## Performance Baseline

**Function**: `normalizeText()`
- Target: <1ms per call
- Test data: 1000 calls with various input lengths
- Acceptable variance: ±20%

**Function**: `searchHymns()`
- Target: <100ms for search across 1000 hymns
- Test data: 1000 hymn fixtures
- Acceptable variance: ±30%

---

## Summary

This data model provides:
- ✅ Complete character set for comprehensive testing
- ✅ Representative test fixtures with Polish text
- ✅ Parameterized test case definitions
- ✅ Clear API contracts with invariants
- ✅ Test execution specifications
- ✅ Performance baselines
- ✅ Validation rules for all entities

**Next Phase**: Implementation of test files following this specification
