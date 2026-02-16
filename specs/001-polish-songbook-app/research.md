# Research & Technical Decisions: Polish SDA Hymnal Songbook

**Feature**: 001-polish-songbook-app
**Date**: 2026-02-15
**Status**: Complete

## Purpose

Document technical research, decisions, and best practices for implementing the Polish SDA Hymnal Songbook application as a Progressive Web App with offline capabilities, bilingual support, and diacritic-insensitive search.

## Research Areas

### 1. Next.js 16+ App Router with PWA Support

**Decision**: Use Next.js 16 App Router with `next-pwa` plugin for Progressive Web App functionality

**Rationale**:
- App Router provides server components by default (better performance)
- Built-in routing with file-system based approach
- Excellent TypeScript support
- PWA support via `next-pwa` plugin integrates seamlessly
- Service Worker generation automated

**Alternatives Considered**:
- **Create React App + Workbox**: More manual setup, CRA deprecated, less optimal
- **Vite + React**: Good performance but requires more PWA configuration
- **Next.js Pages Router**: Older approach, less efficient for our use case

**Best Practices**:
- Use Server Components for static content (hymn display, category lists)
- Use Client Components only for interactivity (search, language toggle)
- Static generate pages at build time for optimal performance
- Configure caching strategy: Cache-First for hymn data, Network-First for app shell

**Implementation Notes**:
```typescript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/.*\.json$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'hymn-data-cache',
        expiration: {
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
        },
      },
    },
  ],
})

module.exports = withPWA({
  // Next.js config
})
```

### 2. Diacritic-Insensitive Text Normalization

**Decision**: Custom normalization function using `String.prototype.normalize()` with NFD (Normalization Form Canonical Decomposition) + diacritic removal

**Rationale**:
- Polish diacritics (ą, ć, ę, ł, ń, ó, ś, ź, ż) must map to base characters
- Built-in `normalize('NFD')` separates base characters from combining diacritics
- Regex can then remove combining diacritic marks
- Case-insensitive via `.toLowerCase()`

**Alternatives Considered**:
- **Manual character mapping**: More code, harder to maintain
- **Third-party library (e.g., `diacritics`)**: Extra dependency, overkill for Polish-only
- **Locale-aware collation**: Doesn't provide substring matching needed

**Best Practices**:
```typescript
// packages/shared/utils/text-normalize.ts
export function normalizeText(text: string): string {
  return text
    .normalize('NFD') // Decompose combined characters
    .replace(/[\u0300-\u036f]/g, '') // Remove combining diacritical marks
    .toLowerCase()
}

// Example usage:
normalizeText('Bóg') // returns 'bog'
normalizeText('Jeżu') // returns 'jezu'
normalizeText('ąćęłńóśźż') // returns 'acelnoszz'
```

**Performance**: O(n) where n is text length; fast enough for client-side search of 700 hymns

### 3. Bilingual Support (Polish/English)

**Decision**: React Context + JSON translation files + localStorage persistence

**Rationale**:
- Simple, no heavy i18n library needed (only 2 languages)
- JSON files easy to maintain and edit
- Context provides global access without prop drilling
- localStorage persists preference across sessions

**Alternatives Considered**:
- **next-intl / react-i18next**: Overkill for 2 languages, adds complexity
- **URL-based locale (e.g., /pl/song/1)**: Complicates routing, breaks shared URLs
- **Browser language detection only**: Doesn't persist user choice

**Best Practices**:
```typescript
// translations/pl.json
{
  "nav": {
    "home": "Strona główna",
    "search": "Szukaj",
    "categories": "Kategorie"
  },
  "search": {
    "placeholder": "Wyszukaj numer, tytuł lub tekst pieśni...",
    "noResults": "Nie znaleziono wyników",
    "searching": "Wyszukiwanie..."
  },
  "song": {
    "verse": "Zwrotka",
    "chorus": "Refren",
    "author": "Autor",
    "translator": "Tłumacz",
    "category": "Kategoria",
    "viewCategory": "Zobacz wszystkie w kategorii"
  }
}

// translations/en.json
{
  "nav": {
    "home": "Home",
    "search": "Search",
    "categories": "Categories"
  },
  // ... English translations
}
```

**Implementation Pattern**:
- Language

Provider wraps app in `app/layout.tsx`
- `useLanguage()` hook exposes `{ lang, setLang, t }` function
- `t('nav.home')` returns translated string based on current language
- Hymn content always in Polish (only UI translates)

### 4. Debounced Search Implementation

**Decision**: Custom `useDebounce` hook with 300ms delay

**Rationale**:
- Prevents excessive processing on every keystroke
- 300ms is sweet spot: feels responsive, reduces computation
- Custom hook is reusable and simple to implement

**Alternatives Considered**:
- **Lodash debounce**: Extra dependency, not worth it for one function
- **No debounce**: Would cause performance issues on slower devices
- **Server-side search**: Overkill, adds latency, all data is client-side

**Best Practices**:
```typescript
// hooks/use-debounce.ts
import { useEffect, useState } from 'react'

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Usage in search hook:
const debouncedQuery = useDebounce(query, 300)
useEffect(() => {
  if (debouncedQuery) {
    performSearch(debouncedQuery)
  }
}, [debouncedQuery])
```

### 5. Responsive Category Layout (3-Column Desktop, 1-Column Mobile)

**Decision**: Tailwind CSS grid with responsive breakpoints + CSS Grid

**Rationale**:
- Tailwind provides clean, maintainable responsive utilities
- CSS Grid native support for column layouts
- Mobile-first approach (1 column default, 3 columns on md+ breakpoint)
- No JavaScript required for layout

**Alternatives Considered**:
- **Flexbox**: Less suited for equal-width columns
- **JavaScript-based layout**: Unnecessary complexity, slower
- **Bootstrap grid**: Extra dependency, Tailwind already included

**Best Practices**:
```typescript
// Tailwind classes for category accordion
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  {categories.map(category => (
    <CategoryAccordion key={category.id} category={category} />
  ))}
</div>

// tailwind.config.ts
export default {
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',  // 3-column threshold
      'lg': '1024px',
      'xl': '1280px',
    },
  },
}
```

### 6. Markdown to JSON Conversion Strategy

**Decision**: Build-time conversion script using Node.js fs + regex parsing

**Rationale**:
- One-time conversion (hymnal content doesn't change frequently)
- Regex sufficient for structured markdown format
- Output JSON committed to repo (no runtime parsing needed)
- Original markdown preserved for reference and future re-import

**Alternatives Considered**:
- **Runtime markdown parsing**: Slower, unnecessary overhead
- **Database storage**: Overkill for static data, adds complexity
- **Third-party markdown parser**: Too generic, need custom hymn structure

**Parsing Strategy**:
1. Parse table of contents section (lines containing "**I. CATEGORY**" through "**IX. CATEGORY**")
2. Extract category ranges (e.g., "1-61", "62-75")
3. Parse individual hymns starting at "**Nr X.**"
4. Extract title (line with "***Title***")
5. Extract author/translator (line with "*Name*")
6. Extract verses (numbered lines "1. Text...")
7. Extract chorus (section starting with "***Refren:***")
8. Map hymn numbers to categories based on ranges

**Output Format**:
```json
{
  "categories": [
    {
      "major": "I. NABOZENSTWO",
      "subcategories": [
        {
          "number": 1,
          "name": "Uwielbienie Boga i dziekczynienie",
          "hymnRange": { "start": 1, "end": 61 }
        }
      ]
    }
  ],
  "hymns": [
    {
      "number": 1,
      "title": "Wielbij Mocarza i Krola wszechswiata",
      "key": "F",
      "author": "J. Neander (1650-1680)",
      "verses": [
        "Wielbij, ma duszo, Mocarza...",
        "Wielbij, ma duszo, Mocarza, co ziemi obroty..."
      ],
      "chorus": null,
      "category": "I. NABOZENSTWO",
      "subcategory": {
        "number": 1,
        "name": "Uwielbienie Boga i dziekczynienie"
      }
    }
  ]
}
```

### 7. Type Safety for Hymn Data

**Decision**: Strict TypeScript types with runtime validation in conversion script

**Rationale**:
- Constitution requires strict type safety (no `any`)
- Type guards ensure data integrity during conversion
- Shared types across packages prevent inconsistencies

**Type Definitions**:
```typescript
// packages/shared/types/hymn.ts
export type HymnKey = 'F' | 'Es' | 'G' | 'D' | 'C' | 'B' | 'A' | string

export type Subcategory = {
  number: number
  name: string
}

export type Hymn = {
  number: number
  title: string
  key: HymnKey | null
  author: string | null
  translator: string | null
  verses: string[]
  chorus: string | null
  category: string
  subcategory: Subcategory
  fullText: string // For search indexing
}

export type Category = {
  major: string
  number: string // Roman numeral
  subcategories: {
    number: number
    name: string
    hymnRange: { start: number; end: number }
  }[]
}

export type HymnData = {
  categories: Category[]
  hymns: Hymn[]
}

// Type guard
export function isValidHymn(obj: unknown): obj is Hymn {
  if (typeof obj !== 'object' || obj === null) return false
  const h = obj as Record<string, unknown>
  return (
    typeof h.number === 'number' &&
    typeof h.title === 'string' &&
    Array.isArray(h.verses) &&
    h.verses.every(v => typeof v === 'string') &&
    typeof h.category === 'string' &&
    typeof h.subcategory === 'object' &&
    h.subcategory !== null
  )
}
```

### 8. Service Worker Caching Strategy

**Decision**: Workbox strategies via next-pwa configuration

- **App Shell**: NetworkFirst (always try network, fallback to cache)
- **Hymn Data (`hymns.json`)**: CacheFirst (instant load, update in background)
- **Static Assets**: CacheFirst with 1-year expiration
- **Pages**: NetworkFirst for dynamic content

**Rationale**:
- Hymn data rarely changes - prioritize offline speed
- App shell updates important for bug fixes - prioritize fresh content
- Balance between offline capability and freshness

**Cache Invalidation**:
- Service worker version change triggers cache update
- Manual cache clear via developer tools if needed
- New deployment automatically updates cache

## Technology Stack Summary

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| Framework | Next.js | 16+ | App Router, SSR, SSG |
| Language | TypeScript | 5+ | Type safety, strict mode |
| UI Library | React | 19+ | Component model |
| Styling | Tailwind CSS | 4+ | Responsive utility-first CSS |
| PWA | next-pwa | Latest | Service worker, offline support |
| Package Manager | pnpm | 10+ | Monorepo workspaces |
| Build Tool | Next.js (Turbopack) | Built-in | Fast builds, HMR |

## Performance Targets

| Metric | Target | Strategy |
|--------|--------|----------|
| Hymn page load (online) | <3s | Static generation, minimal JS |
| Hymn page load (offline) | <1s | Service worker cache |
| Search results | <2s | Client-side search, normalized text |
| First Contentful Paint | <1.5s | Server components, CSS inlining |
| Time to Interactive | <3s | Minimal client JS, code splitting |

## Security Considerations

- No authentication required (public content)
- No user data collection (language preference only in localStorage)
- HTTPS required for Service Worker (standard web requirement)
- Content Security Policy headers recommended
- No sensitive data in hymnal content

## Accessibility

- Semantic HTML throughout
- ARIA labels for interactive elements
- Keyboard navigation support
- Screen reader friendly (proper heading hierarchy)
- High contrast text (WCAG AA compliance)
- Responsive text sizing
- Focus indicators visible

## Browser Support

**Primary Targets**:
- Chrome/Edge 90+
- Safari 14+
- Firefox 88+

**PWA Support**:
- Chrome/Edge: Full support
- Safari iOS: Partial (add to homescreen works)
- Firefox: Full support

**Graceful Degradation**:
- Non-PWA browsers: App works, no offline capability
- Older browsers: Show message to upgrade

## Deployment Considerations

**Hosting Options** (to be decided in tasks phase):
- Vercel (recommended for Next.js)
- Netlify
- Self-hosted with Docker

**Build Process**:
1. Convert markdown to JSON (one-time or as needed)
2. `pnpm install` (workspace dependencies)
3. `pnpm build` (Next.js static generation)
4. Service worker generated automatically
5. Deploy build output

**Environment Variables**:
- `NEXT_PUBLIC_APP_VERSION`: For cache busting
- `NODE_ENV`: production/development

## Open Questions Resolved

1. **Q**: How to handle Polish character search?
   **A**: NFD normalization + diacritic removal (see Section 2)

2. **Q**: Online vs offline architecture?
   **A**: PWA with Service Worker, Cache-First for data (see Section 1, 8)

3. **Q**: Single language or bilingual?
   **A**: Bilingual (PL/EN) with Context + localStorage (see Section 3)

4. **Q**: Client-side or server-side search?
   **A**: Client-side with debounce (all data available, no server needed) (see Section 4)

5. **Q**: How to structure hymn data?
   **A**: Static JSON with strict types, build-time conversion (see Section 6, 7)

## Next Steps

Phase 1 deliverables:
1. ✅ data-model.md - Detailed data structures
2. ✅ contracts/hymn-data-schema.json - JSON schema
3. ✅ quickstart.md - Developer setup guide
