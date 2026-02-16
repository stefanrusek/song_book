# Test Contracts: Search Diacritical Matching

**Feature**: 002-fix-search
**Date**: 2026-02-16
**Purpose**: Define the expected behavior and test specifications for implementation

---

## Contract 1: Text Normalization Function

### Function Signature

```typescript
export function normalizeText(text: string): string
```

### Specification

**Purpose**: Normalize text by removing Polish diacritical marks and converting to lowercase

**Location**: `packages/shared/utils/text-normalize.ts`

**Input**:
- `text`: Any valid JavaScript string (may contain Unicode, Polish diacriticals, numbers, special characters)

**Output**:
- Returns: String with all Polish diacritical marks removed and converted to lowercase
- Type: `string`
- Length: Same or shorter than input (diacriticals removed, not replaced)

### Test Coverage Requirements

**Test File**: `packages/shared/utils/__tests__/text-normalize.test.ts`

**Minimum Test Categories**:
1. Individual Polish character tests (32 tests minimum)
   - Each lowercase Polish diacritical (ą, ć, ę, ł, ń, ó, ś, ź, ż + others)
   - Each uppercase Polish diacritical (Ą, Ć, Ę, Ł, Ń, Ó, Ś, Ź, Ż + others)
   - Verify correct normalization to base character

2. Word normalization tests (8 tests minimum)
   - Polish words with single diacritical
   - Polish words with multiple diacriticals
   - Example: "było" → "bylo", "Jeżeli" → "jezeli"

3. Phrase normalization tests (4 tests minimum)
   - Multi-word Polish phrases
   - Mixed accented and unaccented characters
   - Example: "Zaczął się znowu" → "zaczal sie znowu"

4. Edge case tests (4 tests minimum)
   - Empty string: `""` → `""`
   - Non-Polish characters: `"hello"` → `"hello"`
   - Numbers: `"hello123"` → `"hello123"`
   - Special characters: `"hello!@#"` → `"hello!@#"`
   - Mixed content: `"Test ł123 !@#"` → `"test l123 !@#"`

5. Idempotency tests (2 tests minimum)
   - Calling twice produces same result: `normalizeText(normalizeText(x)) === normalizeText(x)`
   - Case sensitivity: `normalizeText(x.toUpperCase()) === normalizeText(x)`

### Expected Behavior

| Input | Expected Output | Reasoning |
|-------|-----------------|-----------|
| `"Było"` | `"bylo"` | Polish ł removed, uppercase to lowercase |
| `"ł"` | `"l"` | Single diacritical removed |
| `"Ł"` | `"l"` | Uppercase diacritical normalized |
| `"JEŻELI"` | `"jezeli"` | All uppercase Polish letters normalized |
| `"było"` | `"bylo"` | Already lowercase, ł removed |
| `"hello"` | `"hello"` | No Polish characters, unchanged |
| `""` | `""` | Empty input returns empty |
| `"123"` | `"123"` | Numbers unchanged |
| `"a ą b"` | `"a a b"` | ą normalized to a with spacing preserved |

### Code Coverage Target

- **Target**: 100% of `normalizeText()` function
- **Lines**: All 5 lines of function body covered
- **Branches**: All code paths executed

### Performance Contract

- **Execution Time**: < 1 millisecond per call
- **Test Data**: 1000 calls with varying input lengths (1-1000 chars)
- **Acceptable Variance**: ±20% from baseline

---

## Contract 2: Search Function Integration

### Function Signature

```typescript
export function searchHymns(hymns: Hymn[], query: string): SearchResult[]
```

### Specification

**Purpose**: Search hymn collection with diacritic-insensitive matching

**Location**: `packages/web/lib/search-utils.ts`

**Input**:
- `hymns`: Array of Hymn objects (may be empty, may contain up to 10,000+ items)
- `query`: Search query string (may contain accented or unaccented characters, case-insensitive)

**Output**:
- Returns: Array of SearchResult objects sorted by relevance (highest first)
- Each result includes: hymn, matchType, matchContext, relevance
- Empty array if no matches or if query is empty/whitespace-only

### Search Behavior

**Relevance Scoring** (in descending order):
- Exact hymn number match: `1.0`
- Title contains query: `0.8`
- Author contains query: `0.6`
- Any verse contains query: `0.4`
- Chorus contains query: `0.3`

**Match Rules**:
- Only one result per hymn (if multiple fields match, use highest relevance)
- Query normalization: Both query and hymn text normalized before comparison
- Bidirectional matching: `"bylo"` matches `"Było"` and vice versa
- Substring matching: `"jest"` matches `"Jest zawsze"`

### Test Coverage Requirements

**Test File**: `packages/web/lib/__tests__/search-utils.test.ts`

**User Story 1 Tests** (4 tests minimum - Accented query finds accented):
- Accented query "Było" finds hymn with "Było" title
- Correct relevance score: 0.8
- Match type identified correctly

**User Story 2 Tests** (4 tests minimum - Unaccented query finds accented):
- Unaccented query "bylo" finds hymn with "Było" title
- Unaccented query "zal" finds hymn with "żal"
- Unaccented query "jezeli" finds hymn with "Jeżeli"
- Correct relevance and match type

**User Story 3 Tests** (2 tests minimum - Accented query finds unaccented):
- Accented query "Było" finds hymn with "bylo"
- Accented query "żal" finds hymn with "zal"

**Regression Tests** (10+ tests):
- Number matching: Query "42" matches hymn #42 with relevance 1.0
- Title matching: Query "title-substring" finds hymn by title
- Author matching: Query matches hymn author with relevance 0.6
- Verse matching: Query matches verse content with relevance 0.4
- Chorus matching: Query matches chorus with relevance 0.3
- Multiple matches: Correct ranking by relevance
- Empty query: Returns empty array
- Whitespace query: Returns empty array
- Special characters: Handles gracefully
- Large dataset: Performs within time limits

### Expected Behavior

| Query | Hymn Title | Should Match | Relevance | Notes |
|-------|-----------|--------------|-----------|-------|
| `"bylo"` | `"Było światłem"` | ✓ Yes | 0.8 | User Story 2 - unaccented finds accented |
| `"Było"` | `"było"` | ✓ Yes | 0.8 | User Story 3 - accented finds unaccented |
| `"Było"` | `"Było"` | ✓ Yes | 0.8 | User Story 1 - accented finds accented |
| `"42"` | N/A | ✓ Yes | 1.0 | Exact number match |
| `"zal"` | `"Żal mój"` | ✓ Yes | 0.8 | Contains ż → zal |
| `"hello"` | `"Hymn Title"` | ✗ No | N/A | No match |
| `""` | Any | ✗ No | N/A | Empty query |
| `"   "` | Any | ✗ No | N/A | Whitespace only |

### Code Coverage Target

- **Target**: 100% of `searchHymns()` function code paths
- **Lines**: All lines executed across search paths
- **Branches**: All if/else branches covered
- **Edge cases**: Empty input, single result, multiple results, no results

### Performance Contract

- **Execution Time**: < 100 milliseconds for 1000 hymns
- **Test Data**: Search across 1000 hymn fixtures
- **Acceptable Variance**: ±30% from baseline

---

## Contract 3: Integration Test Suite

### Combined Scenarios

**Test Categories**:
1. Bidirectional matching validation (8 tests)
   - Unaccented → accented (User Story 2)
   - Accented → unaccented (User Story 3)
   - Accented → accented (User Story 1)
   - Each direction tested multiple times with different characters

2. Regression protection (10 tests)
   - All existing search functionality still works
   - Relevance scoring unchanged
   - Match type identification correct
   - Performance maintained

3. Polish character coverage (32 tests)
   - Each Polish character verified in context
   - Integration with search function
   - Both uppercase and lowercase variants

### Test Invariants

**Invariant 1: Bidirectional Equivalence**
```
For any Polish character pair (accented, unaccented):
  searchHymns(hymns, accented).length === searchHymns(hymns, unaccented).length
```

**Invariant 2: Relevance Consistency**
```
For matching results:
  relevance(accented_query) === relevance(unaccented_query)
```

**Invariant 3: Idempotency**
```
searchResults === searchResults (same query twice returns same results)
```

**Invariant 4: Sorting**
```
For all i < j in results:
  results[i].relevance >= results[j].relevance
```

### Acceptance Criteria

All tests must pass:
- [ ] 50+ normalization tests pass
- [ ] 22+ search integration tests pass
- [ ] 100% code coverage for both functions
- [ ] All Polish character variants tested
- [ ] All User Stories covered with passing tests
- [ ] Bidirectional matching verified
- [ ] Regression tests all pass
- [ ] Performance within baselines
- [ ] No type safety violations (`any` forbidden)

---

## Mock Data Contract

### Hymn Fixture Structure

```typescript
type Hymn = {
  number: number              // Positive integer, unique
  title: string              // May contain Polish characters
  author: string             // May contain Polish characters
  book: string               // Book/collection name
  chapter: number            // Chapter within book
  verses: string[]           // Array of verse strings
  chorus: string             // Optional chorus text
}
```

### Representative Test Data

Minimum 3 hymn fixtures with comprehensive Polish character coverage:

**Hymn 1**: "Było światłem" (contains ł, ó)
```typescript
{
  number: 1,
  title: 'Było światłem twoje słowo',
  author: 'Ks. Stanisław',
  verses: ['Kiedy noc nas otaczała...'],
  chorus: 'Święty, święty Bóg nasz'
}
```

**Hymn 2**: Polish text with ż, ę, ń, ś
```typescript
{
  number: 42,
  title: 'Jeżeli zapytasz mnie o żal',
  author: 'Maria',
  verses: ['Pieśń moja sędziowie niech słyszą...']
}
```

**Hymn 3**: Additional character coverage
```typescript
{
  number: 7,
  title: 'Na początku było słowo',
  author: 'Anonymous',
  verses: ['Powie serce moje śmiało...']
}
```

---

## Quality Gates

### Pre-Implementation

- [ ] All contracts reviewed and understood
- [ ] Test data fixtures defined
- [ ] Polish character set verified (32 characters)
- [ ] Performance baselines established

### During Implementation

- [ ] Each test category has minimum test count
- [ ] All test categories included
- [ ] Tests follow naming conventions
- [ ] No `any` type usage
- [ ] All imports resolved correctly
- [ ] Tests run without errors

### Post-Implementation

- [ ] All tests pass locally
- [ ] Coverage report shows 100%
- [ ] Performance within baselines
- [ ] No console errors or warnings
- [ ] Commit message follows convention
- [ ] PR review ready

---

## Glossary

| Term | Definition |
|------|-----------|
| **Diacritical Mark** | Accent or symbol added to a letter (ł, ó, ż) |
| **Normalization** | Process of removing diacriticals and lowercasing |
| **Relevance Score** | Number 0.0-1.0 indicating match importance (1.0 = most relevant) |
| **Substring Match** | Query found anywhere within text (not just exact match) |
| **Bidirectional** | Works both directions (accented→unaccented AND unaccented→accented) |
| **User Story** | Feature requirement from perspective of end user |
| **Regression** | Unintended breaking of previously working functionality |

---

## References

- **Implementation Plan**: `specs/002-fix-search/plan.md`
- **Data Model**: `specs/002-fix-search/data-model.md`
- **Quick Start**: `specs/002-fix-search/quickstart.md`
- **Feature Spec**: `specs/002-fix-search/spec.md`
