# Quickstart: Fixing Missing Translations

**Feature**: Fix Missing Translations in UI
**Branch**: `004-fix-missing-translations`
**Date**: 2026-02-17

## Overview

This feature fixes untranslated UI text on specific pages by adding missing translation keys and replacing hardcoded English strings with translation system calls.

**Quick Summary**:
- Add 7 new translation keys to TranslationDictionary type
- Add English and Polish translations for new keys
- Replace hardcoded strings in 3 files with `t('key')` calls
- Verify all UI text translates correctly in both languages

## Implementation Checklist

### Phase 1: Type & Translation Files (30 min)

- [ ] **Step 1.1**: Update `packages/shared/types/index.ts`
  - Add new keys to `search` namespace: `matchedByNumber`, `matchedInTitle`, `matchedInVerses`, `matchedInChorus`
  - Add new keys to `song` namespace: `by`
  - Add new keys to `category` namespace: `hymns`

- [ ] **Step 1.2**: Update `packages/web/public/translations/en.json`
  - Add English translations for all 7 new keys (see data-model.md for exact values)

- [ ] **Step 1.3**: Update `packages/web/public/translations/pl.json`
  - Add Polish translations for all 7 new keys (see data-model.md for exact values)

- [ ] **Step 1.4**: Run TypeScript check
  ```bash
  nvm use
  pnpm tsc --noEmit
  ```
  Should pass with no errors

### Phase 2: Component Updates (45 min)

- [ ] **Step 2.1**: Update Home Page (`packages/web/app/page.tsx`)
  - Find hardcoded "Hymns" text
  - Replace with translation lookup (strategy: move to client component or use next/headers)
  - Verify page still renders correctly

- [ ] **Step 2.2**: Update Subcategory Page (`packages/web/app/category/subcategory/[number]/page.tsx` and `content.tsx`)
  - Find hardcoded "by" and "Key" text
  - Replace with `t('song.by')` and `t('song.key')` calls in client component
  - Keep server component markup, move translation display to client wrapper

- [ ] **Step 2.3**: Update Search Results (`packages/web/components/search/search-results.tsx`)
  - Replace hardcoded match type labels with translation keys:
    - "Matched by number" → `t('search.matchedByNumber')`
    - "Matched in title" → `t('search.matchedInTitle')`
    - "Matched in verses" → `t('search.matchedInVerses')`
    - "Matched in chorus" → `t('search.matchedInChorus')`
  - Ensure `useLanguage()` hook is imported and used

### Phase 3: Testing & Verification (30 min)

- [ ] **Step 3.1**: Run quality gates
  ```bash
  nvm use
  pnpm test
  pnpm lint
  pnpm coverage
  ```
  All three must pass with 100% coverage

- [ ] **Step 3.2**: Manual testing - English
  - Load application with English language
  - Navigate to home page → verify "Hymns" displays
  - Navigate to subcategory page → verify "by" and "Key" display
  - Perform song search → verify all match type labels display

- [ ] **Step 3.3**: Manual testing - Polish
  - Switch to Polish language
  - Verify all text from Step 3.2 displays in Polish:
    - "Hymns" → "Hymny"
    - "by" → "Autor"
    - "Key" → "Tonacja"
    - Match labels display in Polish

- [ ] **Step 3.4**: Consistency check
  - Compare "by" and "Key" on subcategory page with same terms on song page
  - Verify identical translations appear everywhere

## Common Patterns

### Using Translation Hook in Client Components

```typescript
'use client'

import { useLanguage } from '@/providers/language-provider'

export function MyComponent() {
  const { t } = useLanguage()

  return (
    <div>
      <label>{t('song.by')}</label>
      <span>{t('song.key')}</span>
    </div>
  )
}
```

### Handling Server Components

For server components that need translated text:

**Option A**: Move translation to client wrapper
```typescript
// Server component - renders structure only
export default async function Page() {
  return <TranslationWrapper />
}

// Client component - handles translations
'use client'
function TranslationWrapper() {
  const { t } = useLanguage()
  return <div>{t('category.hymns')}</div>
}
```

**Option B**: Pre-load translations in server component
```typescript
// Not recommended - creates inconsistency with pattern
// Prefer Option A for consistency
```

### Conditional Rendering with Translations

```typescript
const matchType = 'title'
const labelKey = {
  'number': 'search.matchedByNumber',
  'title': 'search.matchedInTitle',
  'verse': 'search.matchedInVerses',
  'chorus': 'search.matchedInChorus'
}[matchType]

return <span>{t(labelKey)}</span>
```

## File Locations Reference

**Type Definition**:
- File: `packages/shared/types/index.ts`
- Lines: 49-89 (TranslationDictionary type)

**Translation Files**:
- English: `packages/web/public/translations/en.json`
- Polish: `packages/web/public/translations/pl.json`

**Components to Update**:
1. `packages/web/app/page.tsx` - Home page
2. `packages/web/app/category/subcategory/[number]/page.tsx` - Subcategory page server component
3. `packages/web/app/category/subcategory/[number]/content.tsx` - Subcategory page client component
4. `packages/web/components/search/search-results.tsx` - Search results

**Language Provider**:
- File: `packages/web/providers/language-provider.tsx`
- Hook: `useLanguage()` returns `{ t: (key: string) => string, language: string }`

## Verification Checklist

Before committing, verify:

- [ ] TypeScript compiles without errors
- [ ] All 7 new translation keys exist in both en.json and pl.json
- [ ] All 3 components updated to use translation keys
- [ ] English language: all text displays in English
- [ ] Polish language: all text displays in Polish
- [ ] "by" and "Key" identical on subcategory and song pages
- [ ] No console errors when switching languages
- [ ] No breaking changes to existing functionality
- [ ] Tests pass (pnpm test)
- [ ] Linting passes (pnpm lint)
- [ ] Coverage passes (pnpm coverage - 100%)

## Troubleshooting

**Issue**: TypeScript error "Type 'string' is not assignable to type '...'"
- **Cause**: New translation key not added to TranslationDictionary type
- **Fix**: Add the key to the appropriate namespace in types/index.ts

**Issue**: "Hymns" still displays in English on home page after changes
- **Cause**: Translation loading not triggered or component not re-rendering
- **Fix**: Verify useLanguage() hook is being called; check browser cache

**Issue**: Polish translation not loading
- **Cause**: Language not switching or pl.json file missing key
- **Fix**: Verify pl.json contains all keys from en.json; check language selection works

**Issue**: Hydration mismatch warning in console
- **Cause**: Server and client rendering different content
- **Fix**: Ensure server component and client component use same initial language value

## Related Documentation

- Feature Specification: [spec.md](spec.md)
- Technical Research: [research.md](research.md)
- Data Model: [data-model.md](data-model.md)
- Implementation Plan: [plan.md](plan.md)
