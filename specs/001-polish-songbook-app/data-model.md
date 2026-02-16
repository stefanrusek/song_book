# Data Model: Polish SDA Hymnal Songbook

**Feature**: 001-polish-songbook-app
**Date**: 2026-02-15
**Status**: Complete

## Overview

This document defines all data structures, types, and relationships for the hymnal application. All types use strict TypeScript with no `any` types (per Constitutional Principle I).

## Core Entities

### 1. Hymn

Primary entity representing an individual song from the hymnal.

**TypeScript Definition**:
```typescript
// packages/shared/types/hymn.ts

/**
 * Musical key signature for a hymn
 * Common keys in the hymnal: F, Es (E♭), G, D, C, B, A
 */
export type HymnKey = 'F' | 'Es' | 'G' | 'D' | 'C' | 'B' | 'A' | 'As' | 'H' | string

/**
 * Subcategory reference within a major category
 */
export type Subcategory = {
  /** Subcategory number (1-40) */
  number: number
  /** Polish name of the subcategory */
  name: string
}

/**
 * Complete hymn data structure
 */
export type Hymn = {
  /** Hymn number (1-700) - unique identifier */
  number: number

  /** Polish title of the hymn */
  title: string

  /** Musical key signature, null if not specified */
  key: HymnKey | null

  /** Original author name, null if anonymous or unknown */
  author: string | null

  /** Translator name (Polish translation), null if not applicable */
  translator: string | null

  /** Array of verse texts, minimum 1 verse */
  verses: string[]

  /** Chorus/Refren text, null if hymn has no chorus */
  chorus: string | null

  /** Major category (e.g., "I. NABOZENSTWO") */
  category: string

  /** Subcategory details */
  subcategory: Subcategory

  /**
   * Full text content (title + verses + chorus)
   * Pre-computed for efficient search
   */
  fullText: string
}
```

**Validation Rules**:
- `number`: Must be 1-700, unique across all hymns
- `title`: Non-empty string
- `verses`: Non-empty array, each verse is non-empty string
- `category`: Must match one of 9 major categories
- `subcategory.number`: Must be 1-40
- `fullText`: Derived field, concatenation of title + verses + chorus

**Example Instance**:
```json
{
  "number": 1,
  "title": "Wielbij Mocarza i Krola wszechswiata",
  "key": "F",
  "author": "J. Neander (1650-1680)",
  "translator": null,
  "verses": [
    "Wielbij, ma duszo, Mocarza i Krola wszechswiata! Niech sie twa prosba z goraca podzieka przeplata...",
    "Wielbij, ma duszo, Mocarza, co ziemi obroty Sprawil, i w niebo orlimi podnosi cie loty...",
    "Wielbij Mocarza, gdyz cudownie cie uksztaltowal; Zdrowiem obdarzyl i droge ci zawsze torowal...",
    "Wielbij, ma duszo, Mocarza, co ci blogoslawil, Ktory w strumieniach milosci sie tobie objawil..."
  ],
  "chorus": null,
  "category": "I. NABOZENSTWO",
  "subcategory": {
    "number": 1,
    "name": "Uwielbienie Boga i dziekczynienie"
  },
  "fullText": "Wielbij Mocarza i Krola wszechswiata Wielbij, ma duszo, Mocarza i Krola wszechswiata..."
}
```

### 2. Category

Hierarchical grouping structure from the table of contents.

**TypeScript Definition**:
```typescript
// packages/shared/types/category.ts

/**
 * Subcategory with hymn range
 */
export type SubcategoryInfo = {
  /** Subcategory number (1-40) */
  number: number

  /** Polish name */
  name: string

  /** Hymn number range for this subcategory */
  hymnRange: {
    /** First hymn number in range (inclusive) */
    start: number
    /** Last hymn number in range (inclusive) */
    end: number
  }
}

/**
 * Major category from table of contents
 */
export type Category = {
  /** Roman numeral (I-IX) */
  number: string

  /** Major category name (e.g., "NABOZENSTWO") */
  name: string

  /** Full display name (e.g., "I. NABOZENSTWO") */
  displayName: string

  /** All subcategories within this major category */
  subcategories: SubcategoryInfo[]
}
```

**Validation Rules**:
- `number`: Must be I, II, III, IV, V, VI, VII, VIII, or IX
- `subcategories`: Non-empty array
- `hymnRange.start`: Must be ≤ `hymnRange.end`
- Hymn ranges must not overlap within same category
- All hymn numbers 1-700 must be covered exactly once

**Example Instance**:
```json
{
  "number": "I",
  "name": "NABOZENSTWO",
  "displayName": "I. NABOZENSTWO",
  "subcategories": [
    {
      "number": 1,
      "name": "Uwielbienie Boga i dziekczynienie",
      "hymnRange": { "start": 1, "end": 61 }
    },
    {
      "number": 2,
      "name": "Duch Swiety",
      "hymnRange": { "start": 62, "end": 75 }
    },
    {
      "number": 3,
      "name": "Slowo Boze",
      "hymnRange": { "start": 76, "end": 87 }
    }
  ]
}
```

### 3. HymnData

Root data structure containing all hymns and categories.

**TypeScript Definition**:
```typescript
// packages/shared/types/index.ts

/**
 * Complete hymnal data structure
 * This is the shape of hymns.json
 */
export type HymnData = {
  /** Metadata about the data */
  metadata: {
    /** Version of the hymnal (e.g., "2005") */
    version: string
    /** Total number of hymns */
    totalHymns: number
    /** Date of data generation */
    generatedAt: string
    /** Source file */
    source: string
  }

  /** All major categories with subcategories */
  categories: Category[]

  /** All 700 hymns */
  hymns: Hymn[]
}
```

**Example Instance**:
```json
{
  "metadata": {
    "version": "2005",
    "totalHymns": 700,
    "generatedAt": "2026-02-15T10:00:00Z",
    "source": "spiewajmy_panu_2005.md"
  },
  "categories": [
    {
      "number": "I",
      "name": "NABOZENSTWO",
      "displayName": "I. NABOZENSTWO",
      "subcategories": [...]
    },
    ...
  ],
  "hymns": [
    {
      "number": 1,
      "title": "Wielbij Mocarza i Krola wszechswiata",
      ...
    },
    ...
  ]
}
```

## UI State Types

### 4. SearchResult

Result item from search operation.

**TypeScript Definition**:
```typescript
// packages/web/lib/search-utils.ts

/**
 * Single search result with match context
 */
export type SearchResult = {
  /** The matching hymn */
  hymn: Hymn

  /** Where the match was found */
  matchType: 'number' | 'title' | 'verse' | 'chorus'

  /** Snippet of text containing the match (for display) */
  matchContext: string

  /** Relevance score (0-1, higher is better) */
  relevance: number
}

/**
 * Search state
 */
export type SearchState = {
  /** Current search query */
  query: string

  /** Search results (empty if no search performed) */
  results: SearchResult[]

  /** Whether search is in progress */
  isSearching: boolean

  /** Error message if search failed */
  error: string | null
}
```

### 5. Language

Supported languages for UI.

**TypeScript Definition**:
```typescript
// packages/web/providers/language-provider.tsx

/**
 * Supported UI languages
 */
export type Language = 'pl' | 'en'

/**
 * Translation function type
 */
export type TranslateFn = (key: string) => string

/**
 * Language context value
 */
export type LanguageContextValue = {
  /** Current language */
  language: Language

  /** Change language */
  setLanguage: (lang: Language) => void

  /** Translation function */
  t: TranslateFn
}
```

### 6. Translation

Structure of translation JSON files.

**TypeScript Definition**:
```typescript
// packages/web/translations/types.ts

/**
 * Translation dictionary structure
 */
export type TranslationDictionary = {
  nav: {
    home: string
    search: string
    categories: string
  }
  search: {
    placeholder: string
    noResults: string
    searching: string
    resultsCount: string // "{count} results found"
  }
  song: {
    verse: string
    chorus: string
    author: string
    translator: string
    category: string
    subcategory: string
    viewCategory: string
    viewSubcategory: string
    notFound: string
    ofInCategory: string // "Hymn {current} of {total} in this category"
  }
  category: {
    allCategories: string
    hymnsInCategory: string // "{count} hymns"
    expand: string
    collapse: string
  }
  offline: {
    indicator: string
    message: string
  }
  language: {
    polish: string
    english: string
  }
}
```

## Type Guards

Type guards for runtime validation (per Constitutional Principle I - no `any` types).

**TypeScript Definition**:
```typescript
// packages/shared/types/guards.ts

/**
 * Type guard for Hymn
 */
export function isHymn(value: unknown): value is Hymn {
  if (typeof value !== 'object' || value === null) return false
  const obj = value as Record<string, unknown>

  return (
    typeof obj.number === 'number' &&
    obj.number >= 1 &&
    obj.number <= 700 &&
    typeof obj.title === 'string' &&
    obj.title.length > 0 &&
    (obj.key === null || typeof obj.key === 'string') &&
    (obj.author === null || typeof obj.author === 'string') &&
    (obj.translator === null || typeof obj.translator === 'string') &&
    Array.isArray(obj.verses) &&
    obj.verses.length > 0 &&
    obj.verses.every(v => typeof v === 'string' && v.length > 0) &&
    (obj.chorus === null || typeof obj.chorus === 'string') &&
    typeof obj.category === 'string' &&
    typeof obj.subcategory === 'object' &&
    obj.subcategory !== null &&
    typeof obj.fullText === 'string'
  )
}

/**
 * Type guard for Category
 */
export function isCategory(value: unknown): value is Category {
  if (typeof value !== 'object' || value === null) return false
  const obj = value as Record<string, unknown>

  return (
    typeof obj.number === 'string' &&
    /^(I|II|III|IV|V|VI|VII|VIII|IX)$/.test(obj.number) &&
    typeof obj.name === 'string' &&
    typeof obj.displayName === 'string' &&
    Array.isArray(obj.subcategories) &&
    obj.subcategories.length > 0
  )
}

/**
 * Type guard for HymnData
 */
export function isHymnData(value: unknown): value is HymnData {
  if (typeof value !== 'object' || value === null) return false
  const obj = value as Record<string, unknown>

  return (
    typeof obj.metadata === 'object' &&
    obj.metadata !== null &&
    Array.isArray(obj.categories) &&
    obj.categories.length === 9 &&
    obj.categories.every(isCategory) &&
    Array.isArray(obj.hymns) &&
    obj.hymns.length === 700 &&
    obj.hymns.every(isHymn)
  )
}
```

## Data Relationships

### Entity Relationship Diagram

```
┌─────────────────────────────────────────────┐
│              HymnData (Root)                │
├─────────────────────────────────────────────┤
│ + metadata: Metadata                        │
│ + categories: Category[]                    │
│ + hymns: Hymn[]                             │
└──────────────┬──────────────────────────────┘
               │
        ┌──────┴──────┐
        │             │
        ▼             ▼
┌──────────────┐  ┌──────────────────────────┐
│   Category   │  │         Hymn             │
├──────────────┤  ├──────────────────────────┤
│ + number     │  │ + number (PK)            │
│ + name       │  │ + title                  │
│ + subcats    │  │ + key                    │
└──────────────┘  │ + author                 │
                  │ + verses[]               │
                  │ + chorus                 │
                  │ + category (FK) ────────┐│
                  │ + subcategory           ││
                  │ + fullText              ││
                  └────────────┬────────────┘│
                               │             │
                               └─────────────┘
                          (references Category)
```

### Cardinality

- **Category** 1:N **Subcategory** (1 category has N subcategories)
- **Subcategory** 1:N **Hymn** (1 subcategory contains N hymns)
- **Hymn** N:1 **Category** (N hymns belong to 1 major category)
- **Hymn** N:1 **Subcategory** (N hymns belong to 1 subcategory)

### Indexes (for search optimization)

- **Primary**: `hymns[number]` - O(1) lookup by hymn number
- **Secondary**: `categories[subcategory.number]` - O(1) lookup by subcategory
- **Full-text**: Pre-computed `fullText` field for search

## Data Constraints

### Integrity Constraints

1. **Uniqueness**:
   - Each hymn number must be unique (1-700)
   - Each subcategory number must be unique (1-40)

2. **Completeness**:
   - All hymn numbers 1-700 must exist
   - Every hymn must belong to exactly one category and subcategory
   - Every hymn must have at least one verse

3. **Referential Integrity**:
   - `Hymn.category` must reference a valid `Category.displayName`
   - `Hymn.subcategory.number` must reference a valid `SubcategoryInfo.number`
   - Hymn number must fall within its subcategory's `hymnRange`

4. **Format Constraints**:
   - Category numbers: Roman numerals I-IX only
   - Hymn numbers: Integers 1-700
   - Subcategory numbers: Integers 1-40

### Validation During Import

The markdown-to-JSON conversion script MUST validate:

```typescript
// scripts/validate-hymn-data.ts

function validateHymnData(data: unknown): data is HymnData {
  if (!isHymnData(data)) {
    throw new Error('Invalid HymnData structure')
  }

  // Check all hymn numbers 1-700 exist
  const numbers = new Set(data.hymns.map(h => h.number))
  for (let i = 1; i <= 700; i++) {
    if (!numbers.has(i)) {
      throw new Error(`Missing hymn number: ${i}`)
    }
  }

  // Check no duplicate numbers
  if (numbers.size !== 700) {
    throw new Error('Duplicate hymn numbers found')
  }

  // Check all categories have valid Roman numerals
  const validRoman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX']
  data.categories.forEach(cat => {
    if (!validRoman.includes(cat.number)) {
      throw new Error(`Invalid category number: ${cat.number}`)
    }
  })

  // Check hymn number falls within subcategory range
  data.hymns.forEach(hymn => {
    const category = data.categories.find(c => c.displayName === hymn.category)
    if (!category) {
      throw new Error(`Invalid category for hymn ${hymn.number}: ${hymn.category}`)
    }

    const subcat = category.subcategories.find(s => s.number === hymn.subcategory.number)
    if (!subcat) {
      throw new Error(`Invalid subcategory for hymn ${hymn.number}`)
    }

    if (hymn.number < subcat.hymnRange.start || hymn.number > subcat.hymnRange.end) {
      throw new Error(`Hymn ${hymn.number} outside subcategory range`)
    }
  })

  return true
}
```

## Data Size Estimates

| Entity | Count | Avg Size | Total Size |
|--------|-------|----------|------------|
| Hymn | 700 | ~10 KB | ~7 MB |
| Category | 9 | ~2 KB | ~18 KB |
| Subcategory | 40 | ~500 B | ~20 KB |
| **Total JSON** | - | - | **~7.04 MB** |

**Optimization Notes**:
- JSON is human-readable (not minified) for maintainability
- Gzip compression reduces size by ~70% (to ~2 MB)
- Service Worker caches compressed version
- All 700 hymns load at once (acceptable for PWA use case)

## Versioning

Data version tracked in `metadata.version` field. If hymnal content is updated:

1. Increment version (e.g., "2005" → "2005.1")
2. Re-run conversion script
3. Commit new `hymns.json`
4. Service Worker cache invalidates on deployment

## Next Steps

- ✅ Phase 1: Create JSON schema contract
- ✅ Phase 1: Create developer quickstart guide
