# Implementation Plan: Polish SDA Hymnal Songbook Application

**Branch**: `001-polish-songbook-app` | **Date**: 2026-02-15 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-polish-songbook-app/spec.md`

## Summary

Digital hymnal web application for the Polish SDA church community providing access to 700 hymns with search, categorization, and offline capabilities. The application will import hymnal content from markdown, convert to JSON, and present through a Next.js Progressive Web App with bilingual interface (Polish/English), diacritic-insensitive search, and responsive category browsing.

**Technical Approach**: Next.js 16+ App Router with TypeScript, deployed as PWA with service worker caching, static hymn data in JSON format, client-side search with normalized text comparison, Tailwind CSS for responsive UI, pnpm workspace monorepo structure.

## Technical Context

**Language/Version**: TypeScript 5+ with strict mode enabled
**Framework**: Next.js 16+ with App Router (React 19+)
**Primary Dependencies**:
- Next.js 16+ (App Router, PWA support)
- React 19+
- Tailwind CSS 4+ (styling)
- next-pwa (Progressive Web App functionality)
- Service Worker (offline caching)

**Storage**: Static JSON files (hymn data at build time), browser LocalStorage (language preference), Service Worker Cache API (offline data)
**Testing**: Not required for initial MVP (per spec - no test requirements specified)
**Target Platform**: Web browsers (desktop and mobile), PWA-capable browsers (Chrome, Safari, Firefox, Edge)
**Project Type**: Web application (Next.js monorepo)
**Performance Goals**:
- Hymn page load: <3 seconds (SC-001)
- Search results: <2 seconds (SC-002)
- Offline hymn load: <1 second (SC-008)

**Constraints**:
- Offline-capable (PWA with caching) - SC-009
- Mobile-optimized (primary use case during services) - SC-005
- Polish character support (UTF-8, diacritic-insensitive search) - SC-006, FR-008
- 700 hymns with complete metadata - SC-003

**Scale/Scope**:
- 700 hymns total
- 9 major categories, 40 subcategories
- ~10KB per hymn average (text only)
- Total data: ~7MB hymn content
- Expected concurrent users: <1000 (single church community)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Type Safety First
- ✅ **Pass**: TypeScript 5+ with strict mode
- ✅ **Pass**: No `any` type usage
- ✅ **Pass**: Explicit return types for all functions
- ✅ **Pass**: Prefer `type` over `interface`

### Principle II: Visual Documentation
- ✅ **Pass**: High-level sequence diagrams in spec.md
- ✅ **Pass**: Detailed sequence diagrams in this plan (see below)

### Principle III: Phased Development
- ✅ **Pass**: Following phased commit strategy
- ✅ **Pass**: Commit after specification (completed)
- ✅ **Pass**: Commit after planning (this phase)
- ✅ **Pass**: Will commit after tasks, then implementation

### Principle IV: Component Separation
- ✅ **Pass**: Presentational components in `packages/web/components/`
- ✅ **Pass**: Business logic in pages, hooks, providers
- ✅ **Pass**: One component per file with exported prop types

### Principle V: Conventional Commits
- ✅ **Pass**: Using feature branch `001-polish-songbook-app`
- ✅ **Pass**: All commits follow conventional format

### Principle VI: Root Cause Analysis
- ✅ **Pass**: Spec includes comprehensive root cause analysis

### Technology Constraints
- ✅ **Pass**: Next.js 16+ with App Router
- ✅ **Pass**: TypeScript 5+ with strict mode
- ✅ **Pass**: React 19+
- ✅ **Pass**: Tailwind CSS 4+
- ✅ **Pass**: pnpm 10+ (will configure)
- ✅ **Pass**: Monorepo structure with pnpm workspaces (will create)

**Gate Status**: ✅ **ALL GATES PASSED** - Ready to proceed to Phase 0

## Project Structure

### Documentation (this feature)

```text
specs/001-polish-songbook-app/
├── spec.md                   # Feature specification (completed)
├── plan.md                   # This file (in progress)
├── research.md               # Phase 0 output (to be created)
├── data-model.md             # Phase 1 output (to be created)
├── quickstart.md             # Phase 1 output (to be created)
├── contracts/                # Phase 1 output (to be created)
│   └── hymn-data-schema.json # JSON schema for hymn data
├── checklists/
│   └── requirements.md       # Quality checklist (completed)
└── tasks.md                  # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

Following constitutional monorepo structure with pnpm workspaces:

```text
packages/
├── web/                           # Main Next.js web application
│   ├── app/                       # Next.js App Router
│   │   ├── page.tsx              # Home page (search + category list)
│   │   ├── layout.tsx            # Root layout (language provider)
│   │   ├── song/
│   │   │   └── [number]/
│   │   │       └── page.tsx      # Individual hymn page
│   │   └── category/
│   │       └── [id]/
│   │           └── page.tsx      # Category listing page
│   │
│   ├── components/                # Presentational UI components
│   │   ├── layout/
│   │   │   ├── header.tsx        # App header with language toggle
│   │   │   └── footer.tsx        # App footer
│   │   ├── song/
│   │   │   ├── song-card.tsx     # Hymn preview card
│   │   │   ├── song-details.tsx  # Full hymn display
│   │   │   ├── verse-display.tsx # Verse formatting component
│   │   │   └── category-badge.tsx # Category/subcategory badge
│   │   ├── search/
│   │   │   ├── search-box.tsx    # Search input with debounce
│   │   │   └── search-results.tsx # Search results list
│   │   ├── category/
│   │   │   ├── category-accordion.tsx # Expandable category list
│   │   │   └── category-item.tsx      # Single category/subcategory
│   │   └── common/
│   │       ├── language-toggle.tsx    # Polish/English switcher
│   │       └── offline-indicator.tsx  # Online/offline status
│   │
│   ├── hooks/                     # Custom React hooks
│   │   ├── use-hymns.ts          # Hymn data access
│   │   ├── use-search.ts         # Debounced search with normalization
│   │   ├── use-language.ts       # Language preference management
│   │   └── use-offline.ts        # Offline status detection
│   │
│   ├── lib/                       # Utility functions
│   │   ├── hymn-data.ts          # Load and parse JSON hymn data
│   │   ├── search-utils.ts       # Text normalization, diacritic removal
│   │   ├── category-utils.ts     # Category grouping logic
│   │   └── pwa-utils.ts          # Service worker registration
│   │
│   ├── providers/
│   │   └── language-provider.tsx # I18n context provider
│   │
│   ├── public/
│   │   ├── data/
│   │   │   └── hymns.json        # All 700 hymns (generated from MD)
│   │   ├── manifest.json         # PWA manifest
│   │   ├── sw.js                 # Service worker (generated)
│   │   └── icons/                # PWA icons
│   │
│   ├── styles/
│   │   └── globals.css           # Tailwind imports
│   │
│   ├── translations/
│   │   ├── pl.json               # Polish UI text
│   │   └── en.json               # English UI text
│   │
│   ├── package.json              # Web package dependencies
│   ├── tsconfig.json             # TypeScript config (strict mode)
│   ├── tailwind.config.ts        # Tailwind configuration
│   └── next.config.js            # Next.js config (PWA setup)
│
├── shared/                        # Shared code across packages
│   ├── types/
│   │   ├── hymn.ts               # Hymn type definition
│   │   ├── category.ts           # Category type definition
│   │   └── index.ts              # Barrel exports
│   │
│   ├── utils/
│   │   └── text-normalize.ts    # Diacritic removal utility
│   │
│   └── package.json              # Shared package definition
│
└── scripts/                       # Build/maintenance scripts
    ├── convert-markdown-to-json.ts # Parse MD → JSON
    └── validate-hymn-data.ts       # Data integrity checks

pnpm-workspace.yaml                # pnpm workspace configuration
package.json                        # Root package.json
tsconfig.json                       # Root TypeScript config
.gitignore
README.md
```

**Structure Decision**: Monorepo with pnpm workspaces as required by constitution. Main application in `packages/web/` using Next.js App Router. Shared types in `packages/shared/` for future extensibility (e.g., mobile app, API service). Hymn data as static JSON in `public/data/` for build-time optimization and offline caching.

## Detailed Sequence Diagrams *(mandatory)*

### User Story 1: View Hymn by Number Implementation Flow

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant Page as app/song/[number]/page.tsx
    participant HymnData as lib/hymn-data.ts
    participant SongDetails as components/song/song-details.tsx
    participant CategoryBadge as components/song/category-badge.tsx
    participant Cache as Service Worker Cache

    User->>Browser: Navigate to /song/123
    Browser->>Page: Request page (Server Component)

    alt Online - First Visit
        Page->>HymnData: getHymnByNumber(123)
        HymnData->>HymnData: Load hymns.json
        HymnData->>HymnData: Parse JSON, find hymn 123
        HymnData-->>Page: Hymn data {number, title, key, verses, chorus, author, category}
        Page->>SongDetails: Render with hymn data
        SongDetails->>CategoryBadge: Render category badge
        Page-->>Browser: HTML with hymn content
        Browser->>Cache: Cache page + hymns.json
    else Offline - Cached
        Browser->>Cache: Check cache for /song/123
        Cache-->>Browser: Return cached HTML
        Browser-->>User: Display hymn from cache
    else Online/Offline - Hymn Not Found
        Page->>HymnData: getHymnByNumber(999)
        HymnData-->>Page: null
        Page-->>Browser: 404 page "Song not found"
    end

    Browser-->>User: Display hymn page

    Note over Page,Cache: Service Worker caches all requests<br/>for offline availability
```

### User Story 2: Browse Categories Implementation Flow

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant HomePage as app/page.tsx
    participant CategoryAccordion as components/category/category-accordion.tsx
    participant CategoryItem as components/category/category-item.tsx
    participant CategoryData as lib/category-utils.ts
    participant HymnData as lib/hymn-data.ts

    User->>Browser: Visit home page
    Browser->>HomePage: Request page (Server Component)
    HomePage->>CategoryData: getAllCategories()
    CategoryData->>HymnData: Load hymns.json
    HymnData-->>CategoryData: All hymn data
    CategoryData->>CategoryData: Group by major category and subcategory
    CategoryData-->>HomePage: Category tree structure

    HomePage->>CategoryAccordion: Render with categories (Client Component)
    CategoryAccordion->>CategoryAccordion: Initialize collapsed state
    CategoryAccordion-->>Browser: Render 3-column layout (desktop) or 1-column (mobile)
    Browser-->>User: Display collapsed categories

    User->>Browser: Click major category "III. POWTORNE PRZYJSCIE JEZUSA"
    Browser->>CategoryAccordion: onClick event
    CategoryAccordion->>CategoryAccordion: Expand category, update state
    CategoryAccordion->>CategoryItem: Render subcategories
    CategoryItem-->>User: Display "12. Przygotowanie i oczekiwanie (180-207)"

    User->>Browser: Click subcategory link
    Browser->>HomePage: Navigate to /category/12
    HomePage->>CategoryData: getCategory(12)
    CategoryData-->>HomePage: Subcategory with hymns 180-207
    HomePage-->>User: Display hymn list for subcategory

    Note over CategoryAccordion: Responsive: 3 cols desktop,<br/>1 col mobile
```

### User Story 3: Search Hymns Implementation Flow

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant SearchBox as components/search/search-box.tsx
    participant useSearch as hooks/use-search.ts
    participant SearchUtils as lib/search-utils.ts
    participant HymnData as lib/hymn-data.ts
    participant SearchResults as components/search/search-results.tsx

    User->>Browser: Type "Bog" in search box
    Browser->>SearchBox: onChange event (Client Component)
    SearchBox->>useSearch: updateQuery("Bog")

    Note over useSearch: Debounce 300ms - wait for user to pause typing

    useSearch->>useSearch: Wait 300ms (debounce timer)

    alt User continues typing within 300ms
        User->>SearchBox: Type "a"
        SearchBox->>useSearch: updateQuery("Boga")
        useSearch->>useSearch: Reset timer, wait another 300ms
    else User pauses for 300ms
        useSearch->>useSearch: Trigger search
        useSearch->>SearchUtils: normalizeText("Boga")
        SearchUtils->>SearchUtils: Remove diacritics, lowercase
        SearchUtils-->>useSearch: "boga"

        useSearch->>HymnData: getAllHymns()
        HymnData-->>useSearch: All 700 hymns

        useSearch->>useSearch: For each hymn:
        loop Each Hymn
            useSearch->>SearchUtils: normalizeText(hymn.title)
            SearchUtils-->>useSearch: Normalized title
            useSearch->>SearchUtils: normalizeText(hymn.verses)
            SearchUtils-->>useSearch: Normalized verses
            useSearch->>useSearch: Check if "boga" is substring
            alt Match found
                useSearch->>useSearch: Add to results (matches "Bóg", "Bog", "bóg")
            end
        end

        useSearch-->>SearchBox: results[] (matching hymns)
        SearchBox->>SearchResults: Render with results
        SearchResults-->>User: Display matching hymns
    end

    User->>Browser: Click result
    Browser-->>User: Navigate to /song/[number]

    Note over SearchUtils: normalizeText removes ą→a, ć→c,<br/>ę→e, ł→l, ń→n, ó→o, ś→s,<br/>ź→z, ż→z, converts to lowercase
```

### PWA Offline Caching Flow

```mermaid
sequenceDiagram
    participant Browser
    participant ServiceWorker as sw.js
    participant Cache as Cache API
    participant Server as Next.js Server

    Browser->>ServiceWorker: Register service worker
    ServiceWorker->>ServiceWorker: Install event
    ServiceWorker->>Cache: cache.addAll([<br/>'/', '/hymns.json',<br/>'/manifest.json', '/icons/*'<br/>])
    Cache-->>ServiceWorker: Cached

    Browser->>ServiceWorker: Fetch /song/1
    ServiceWorker->>Cache: Check cache

    alt Cache Hit
        Cache-->>ServiceWorker: Return cached response
        ServiceWorker-->>Browser: Cached content
        Browser-->>Browser: Display immediately
    else Cache Miss + Online
        ServiceWorker->>Server: Fetch from server
        Server-->>ServiceWorker: Response
        ServiceWorker->>Cache: cache.put(request, response)
        ServiceWorker-->>Browser: Fresh content
    else Cache Miss + Offline
        ServiceWorker-->>Browser: Offline fallback page
    end

    Note over ServiceWorker,Cache: Strategy: Cache First with<br/>Network Fallback for hymn data<br/>Network First for app shell
```

### Language Toggle Implementation Flow

```mermaid
sequenceDiagram
    actor User
    participant LanguageToggle as components/common/language-toggle.tsx
    participant useLanguage as hooks/use-language.ts
    participant LocalStorage as Browser LocalStorage
    participant LanguageProvider as providers/language-provider.tsx
    participant Components as All UI Components

    User->>LanguageToggle: Click language toggle
    LanguageToggle->>useLanguage: setLanguage('en')
    useLanguage->>LocalStorage: localStorage.setItem('lang', 'en')
    LocalStorage-->>useLanguage: Stored
    useLanguage->>LanguageProvider: Update context state
    LanguageProvider->>Components: Trigger re-render with new language
    Components->>Components: Load translations/en.json
    Components-->>User: Display UI in English

    Note over LocalStorage: Hymn content stays in Polish<br/>Only UI text changes

    Browser->>Browser: User returns later (new session)
    Browser->>useLanguage: Initialize
    useLanguage->>LocalStorage: localStorage.getItem('lang')
    LocalStorage-->>useLanguage: 'en'
    useLanguage->>LanguageProvider: Set initial language to 'en'
    LanguageProvider-->>Components: Render in English

    Note over useLanguage,LocalStorage: Language preference persists<br/>across sessions via LocalStorage
```

### Markdown to JSON Conversion (Build-time)

```mermaid
sequenceDiagram
    participant Script as scripts/convert-markdown-to-json.ts
    participant MarkdownFile as spiewajmy_panu_2005.md
    participant Parser as Markdown Parser
    participant Validator as scripts/validate-hymn-data.ts
    participant OutputFile as public/data/hymns.json

    Script->>MarkdownFile: Read file
    MarkdownFile-->>Script: Raw markdown content

    Script->>Parser: Parse table of contents
    Parser-->>Script: Category structure (9 major, 40 sub)

    Script->>Parser: Parse hymns section
    loop Each Hymn (1-700)
        Parser->>Parser: Extract number, title, key
        Parser->>Parser: Extract verses (numbered)
        Parser->>Parser: Extract chorus (if "Refren:")
        Parser->>Parser: Extract author (if present)
        Parser->>Parser: Match to category/subcategory
        Parser-->>Script: Hymn object
    end

    Script->>Script: Build JSON structure
    Script->>Validator: Validate data integrity

    alt Validation Pass
        Validator-->>Script: ✅ All hymns valid
        Script->>OutputFile: Write hymns.json
        OutputFile-->>Script: File written
    else Validation Fail
        Validator-->>Script: ❌ Errors found
        Script->>Script: Log errors, exit with error code
    end

    Note over Script,OutputFile: Run once during setup<br/>Output committed to repo<br/>Original MD kept for reference
```

## Complexity Tracking

*No constitutional violations - all gates passed. No complexity justification needed.*

---

**Next Steps**: Proceed to Phase 0 (Research) to resolve any remaining technical decisions and create detailed research documentation.
