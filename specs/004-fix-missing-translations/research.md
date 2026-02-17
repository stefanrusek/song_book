# Research: Translation System Architecture

**Feature**: Fix Missing Translations in UI
**Branch**: `004-fix-missing-translations`
**Date**: 2026-02-17

## Translation Infrastructure Analysis

### Decision: Use Existing Translation System

**Chosen Approach**: Leverage existing custom translation system (not third-party i18n library)

**Rationale**:
- Application already has a functional translation system in place
- LanguageProvider (React Context) already handles language switching
- Translation files (en.json, pl.json) exist with established structure
- Minimal changes needed - only adding missing keys and replacing hardcoded strings

**Alternatives Considered**:
1. **Third-party i18n library (next-i18n, react-i18next)**: Rejected - excessive complexity for simple key replacement; would require refactoring entire translation infrastructure; current system is working well
2. **Manual hardcoding translations in multiple language files**: Rejected - doesn't scale; creates maintenance burden; doesn't solve root cause of inconsistency
3. **Creating new translation wrapper**: Rejected - unnecessary when existing system is sufficient

### Key Findings

#### 1. Translation System Architecture

**Provider**: `packages/web/providers/language-provider.tsx`
- Uses React Context API for global language state
- Supports 2 languages: Polish (`'pl'`) and English (`'en'`)
- Language preference persists to localStorage
- Provides `useLanguage()` hook that returns `{ t: function, language: string }`

**Translation Files**:
- English: `packages/web/public/translations/en.json`
- Polish: `packages/web/public/translations/pl.json`
- Loaded dynamically via `fetch()` at runtime
- Support nested keys with dot notation (e.g., `'nav.home'`, `'song.verse'`)

**Type Definition**: `packages/shared/types/index.ts` (lines 49-89)
- `TranslationDictionary` type defines all supported translation keys
- Currently includes: `nav`, `search`, `song`, `category`, `offline`, `language` namespaces
- Needs expansion with missing keys

#### 2. Hardcoded Strings Inventory

**Location 1: Home Page** (`packages/web/app/page.tsx`)
- Line ~15: Hardcoded "Hymns" (should be `t('category.hymns')`)
- Type: Category display label
- Language: English only

**Location 2: Subcategory Page** (`packages/web/app/category/subcategory/[number]/page.tsx`)
- Lines ~24-30: Hardcoded "Subcategory not found", "Invalid subcategory number.", "Home"
- Type: Error and navigation labels
- Server component - cannot use React hooks directly

**Location 3: Subcategory Content** (`packages/web/app/category/subcategory/[number]/content.tsx`)
- Line ~40: Hardcoded "Subcategory not found."
- Type: Alternative error message (client component)

**Location 4: Search Results** (`packages/web/components/search/search-results.tsx`)
- Lines 61-64: Hardcoded match type labels
- Types: "Matched by number", "Matched in title", "Matched in verses", "Matched in chorus"
- Can use `useLanguage()` hook (client component)

#### 3. Translation Keys to Add

| Component | Current String | Proposed Key | Translation |
|-----------|---|---|---|
| Home Page | "Hymns" | `category.hymns` | EN: "Hymns", PL: "Hymny" |
| Subcategory Page | "by" | `song.by` | EN: "by", PL: "Autor" or "Przez" |
| Subcategory Page | "Key" | `song.key` | EN: "Key", PL: "Tonacja" |
| Search Results | "Matched by number" | `search.matchedByNumber` | EN: "Matched by number", PL: "Dopasowana według numeru" |
| Search Results | "Matched in title" | `search.matchedInTitle` | EN: "Matched in title", PL: "Dopasowana w tytule" |
| Search Results | "Matched in verses" | `search.matchedInVerses` | EN: "Matched in verses", PL: "Dopasowana w wersach" |
| Search Results | "Matched in chorus" | `search.matchedInChorus` | EN: "Matched in chorus", PL: "Dopasowana w refrenie" |

#### 4. Server Component Translation Challenge

**Problem**: Server components (`app/page.tsx`, `app/category/subcategory/[number]/page.tsx`) render on the server and cannot use React Context hooks.

**Current State**: These components resort to hardcoding text because they can't access `useLanguage()` hook.

**Solution Options**:

| Option | Approach | Pros | Cons |
|--------|----------|------|------|
| **Delegated Rendering** | Move translation display to client component wrapper | Clean separation; maintains React Context usage | Requires component refactoring; adds wrapper component |
| **Pre-loaded Translations** | Load translations server-side and pass as props | Works with server components; minimal changes | Requires server-side translation loading logic |
| **Client-side Hydration** | Render server component with keys, translate on client | Simple implementation | May cause hydration mismatch if not careful |
| **Dedicated Translation Loader** | Create utility to load translations outside React Context | Reusable; works everywhere | Additional complexity; diverges from Context pattern |

**Recommended**: Delegated Rendering - Move translation-dependent content to client components where `useLanguage()` hook can be used. This maintains consistency with existing pattern and avoids special cases.

#### 5. Polish Translation Sources

**Existing Polish Translations** (from `pl.json`):
- `nav.home` = "Strona główna"
- `nav.search` = "Szukaj"
- `nav.categories` = "Kategorie"
- `song.verse` = "Wers"
- `song.chorus` = "Refren"
- `song.key` = "Tonacja" ✓ (already exists!)
- `song.author` = "Autor" ✓ (can reuse for "by")
- `category.allCategories` = "Wszystkie kategorie"
- `language.polish` = "Polski"
- `language.english` = "English"

**Discovered**: "Key" (`song.key` = "Tonacja") already has Polish translation! Only needs to be referenced consistently.

**New Translations Needed**:
- `category.hymns` - "Hymny"
- `song.by` - "Autor" (or "Przez" if different context)
- `search.matchedByNumber` - "Dopasowana według numeru"
- `search.matchedInTitle` - "Dopasowana w tytule"
- `search.matchedInVerses` - "Dopasowana w wersach"
- `search.matchedInChorus` - "Dopasowana w refrenie"

### Development Impact

**Minimal Risk**: Bug fix with localized impact
- No new components
- No architectural changes
- No database changes
- No API modifications
- Only affects UI text rendering

**Files to Modify**:
1. `packages/shared/types/index.ts` - Add to TranslationDictionary type
2. `packages/web/public/translations/en.json` - Add English translations
3. `packages/web/public/translations/pl.json` - Add Polish translations
4. `packages/web/app/page.tsx` - Replace hardcoded "Hymns"
5. `packages/web/app/category/subcategory/[number]/page.tsx` - Replace hardcoded strings
6. `packages/web/app/category/subcategory/[number]/content.tsx` - Use translation key if needed
7. `packages/web/components/search/search-results.tsx` - Replace hardcoded match type labels

**Test Coverage**:
- Manual testing with Polish language selection
- Verify all pages display translated text
- Consistency verification across pages
- TypeScript type checking for new keys

### Constitution Compliance

✅ **Type Safety**: New translation keys are type-checked via TranslationDictionary
✅ **Visual Documentation**: Sequence diagrams included in plan.md
✅ **Conventional Commits**: Will use `fix(translations): ` prefix
✅ **Component Separation**: Client/server separation maintained
✅ **Quality Gates**: Changes must pass TypeScript strict mode, linting, tests, 100% coverage
