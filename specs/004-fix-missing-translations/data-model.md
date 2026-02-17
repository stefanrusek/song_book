# Data Model: Translation Dictionary

**Feature**: Fix Missing Translations in UI
**Branch**: `004-fix-missing-translations`
**Date**: 2026-02-17

## Entity: TranslationDictionary

**Purpose**: Type-safe mapping of translation keys to translated strings across all supported languages

**Type Definition Location**: `packages/shared/types/index.ts` (lines 49-89)

### Structure

```typescript
type TranslationDictionary = {
  nav: {
    home: string
    search: string
    categories: string
  }
  search: {
    placeholder: string
    noResults: string
    searching: string
    resultsCount: string
    matchedByNumber: string       // NEW
    matchedInTitle: string        // NEW
    matchedInVerses: string       // NEW
    matchedInChorus: string       // NEW
  }
  song: {
    verse: string
    chorus: string
    key: string
    author: string
    translator: string
    category: string
    subcategory: string
    viewCategory: string
    viewSubcategory: string
    notFound: string
    ofInCategory: string
    by: string                     // NEW
  }
  category: {
    allCategories: string
    hymnsInCategory: string
    expand: string
    collapse: string
    hymns: string                  // NEW
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

### New Keys to Add

| Key | Type | Purpose | English | Polish | Notes |
|-----|------|---------|---------|--------|-------|
| `category.hymns` | string | Display name for hymn collection | "Hymns" | "Hymny" | Used on home page |
| `song.by` | string | Label for song author/composer | "by" | "Autor" | Used on subcategory page alongside author name |
| `search.matchedByNumber` | string | Search result type label | "Matched by number" | "Dopasowana według numeru" | Indicates song found by ID match |
| `search.matchedInTitle` | string | Search result type label | "Matched in title" | "Dopasowana w tytule" | Indicates match in song title |
| `search.matchedInVerses` | string | Search result type label | "Matched in verses" | "Dopasowana w wersach" | Indicates match in song verses |
| `search.matchedInChorus` | string | Search result type label | "Matched in chorus" | "Dopasowana w refrenie" | Indicates match in chorus |

**Note**: `song.key` already exists in TranslationDictionary and has Polish translation "Tonacja" - no new entry needed, only consistent usage.

## Entity: Translation Files

**Purpose**: Persist translated strings for each supported language

**Format**: JSON with nested object structure matching TranslationDictionary keys

**Location**:
- English: `packages/web/public/translations/en.json`
- Polish: `packages/web/public/translations/pl.json`

### File Structure Example

```json
{
  "nav": {
    "home": "Home",
    "search": "Search",
    "categories": "Categories"
  },
  "search": {
    "placeholder": "Search hymns...",
    "noResults": "No results found",
    "searching": "Searching...",
    "resultsCount": "{count} results",
    "matchedByNumber": "Matched by number",
    "matchedInTitle": "Matched in title",
    "matchedInVerses": "Matched in verses",
    "matchedInChorus": "Matched in chorus"
  },
  "song": {
    "verse": "Verse",
    "chorus": "Chorus",
    "key": "Key",
    "author": "Author",
    "translator": "Translator",
    "category": "Category",
    "subcategory": "Subcategory",
    "viewCategory": "View Category",
    "viewSubcategory": "View Subcategory",
    "notFound": "Song not found",
    "ofInCategory": "of",
    "by": "by"
  },
  "category": {
    "allCategories": "All Categories",
    "hymnsInCategory": "hymns",
    "expand": "Expand",
    "collapse": "Collapse",
    "hymns": "Hymns"
  },
  "offline": {
    "indicator": "Offline",
    "message": "You are offline. Some features may not work."
  },
  "language": {
    "polish": "Polish",
    "english": "English"
  }
}
```

### Polish Translation Mapping

| Key | English | Polish | Status |
|-----|---------|--------|--------|
| `category.hymns` | "Hymns" | "Hymny" | To add |
| `song.by` | "by" | "Autor" | To add (reuse existing author translation) |
| `search.matchedByNumber` | "Matched by number" | "Dopasowana według numeru" | To add |
| `search.matchedInTitle` | "Matched in title" | "Dopasowana w tytule" | To add |
| `search.matchedInVerses` | "Matched in verses" | "Dopasowana w wersach" | To add |
| `search.matchedInChorus` | "Matched in chorus" | "Dopasowana w refrenie" | To add |

## Entity: Translation Key Usage

**Purpose**: Track where each translation key is used in the application

| Translation Key | Component | File Path | Current State |
|-----------------|-----------|-----------|---|
| `category.hymns` | Home Page | `app/page.tsx` | Hardcoded "Hymns" → migrate |
| `song.by` | Subcategory Page | `app/category/subcategory/[number]/content.tsx` | Hardcoded "by" → migrate |
| `song.key` | Subcategory Page, Song Page | `components/song/song-details.tsx` | Already uses translation ✓ |
| `search.matchedByNumber` | Search Results | `components/search/search-results.tsx` | Hardcoded "Matched by number" → migrate |
| `search.matchedInTitle` | Search Results | `components/search/search-results.tsx` | Hardcoded "Matched in title" → migrate |
| `search.matchedInVerses` | Search Results | `components/search/search-results.tsx` | Hardcoded "Matched in verses" → migrate |
| `search.matchedInChorus` | Search Results | `components/search/search-results.tsx` | Hardcoded "Matched in chorus" → migrate |

## Validation Rules

### Type Definition Updates
- All new keys must be added to TranslationDictionary type
- TypeScript strict mode must pass (no implicit `any` types)
- All keys must use `string` type (no optional keys for fallback)

### Translation File Consistency
- Every key in TranslationDictionary must exist in both `en.json` and `pl.json`
- No translation can be empty string or null
- Keys must use consistent formatting (camelCase)
- Polish translations must be accurate and follow existing terminology

### Usage in Components
- All hardcoded strings must be replaced with `t('key')` calls
- Components using translations must import `useLanguage` hook
- TypeScript type checking must pass with new keys

## Relationships

**TranslationDictionary** ← Type Definition
**Translation Files** (en.json, pl.json) ← Persist TranslationDictionary instances
**Components** ← Consume Translation Files via TranslationDictionary type

**Data Flow**:
1. TypeScript enforces valid keys via TranslationDictionary type
2. Components use `useLanguage().t('key')` to look up translations
3. Language provider loads appropriate JSON file based on language selection
4. Components render translated strings to users

## State Transitions

**Translation Key Lifecycle**:
1. **Definition**: Add key to TranslationDictionary type
2. **Translation**: Add translations to both en.json and pl.json
3. **Usage**: Replace hardcoded strings with `t('key')` in components
4. **Validation**: TypeScript compile-time check validates key exists in type
5. **Runtime**: Language provider resolves translation at runtime
