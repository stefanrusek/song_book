# Tasks: Polish SDA Hymnal Songbook Application

**Input**: Design documents from `/specs/001-polish-songbook-app/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/, research.md, quickstart.md

**Tests**: NOT REQUIRED - Spec explicitly states "Testing: Not required for initial MVP"

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

This is a **Next.js monorepo** with:
- **packages/web/**: Main Next.js application
- **packages/shared/**: Shared types and utilities
- **scripts/**: Build and conversion scripts
- Root configuration files for pnpm workspace

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Clean up Next.js template and establish monorepo structure

- [x] T001 Remove Next.js template files: delete existing app/ and public/ directories and all auto-generated files in root
- [x] T002 Create pnpm workspace configuration in pnpm-workspace.yaml with packages glob
- [x] T003 Create root package.json with workspace scripts and devDependencies (tsx, typescript)
- [x] T004 Create monorepo directory structure: packages/web/, packages/shared/, scripts/
- [x] T005 [P] Initialize packages/shared/package.json with TypeScript dependencies
- [x] T006 [P] Create packages/shared/tsconfig.json with strict mode enabled
- [x] T007 [P] Initialize packages/web/ as Next.js 16+ application with TypeScript and Tailwind
- [x] T008 [P] Update packages/web/package.json name to @songbook/web and add dependencies (next-pwa)
- [x] T009 [P] Configure packages/web/tsconfig.json with strict mode and path aliases (@/*, @songbook/shared/*)
- [x] T010 [P] Create packages/web/tailwind.config.ts with responsive breakpoints (768px for mobile/desktop)
- [x] T011 [P] Remove package-lock.json if present (pnpm required per constitution)
- [x] T012 Run pnpm install to install all workspace dependencies

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Shared Types & Utilities

- [x] T013 [P] Create Hymn type definition in packages/shared/types/hymn.ts with all fields (number, title, key, author, translator, verses, chorus, category, subcategory, fullText)
- [x] T014 [P] Create Category type definition in packages/shared/types/category.ts with subcategories and hymn ranges
- [x] T015 [P] Create type guards in packages/shared/types/guards.ts (isHymn, isCategory, isHymnData)
- [x] T016 [P] Create barrel export in packages/shared/types/index.ts
- [x] T017 [P] Create text normalization utility in packages/shared/utils/text-normalize.ts with NFD diacritic removal
- [x] T018 [P] Create SearchResult and TranslationDictionary types in packages/shared/types/index.ts

### Data Conversion & Validation

- [ ] T019 Create markdown-to-JSON conversion script in scripts/convert-markdown-to-json.ts to parse /Users/stefanrusek/Downloads/spiewajmy_panu_2005.md
- [ ] T020 Implement table of contents parser in conversion script (extract 9 major categories, 40 subcategories with ranges)
- [ ] T021 Implement hymn parser in conversion script (extract number, title, key, verses, chorus, author/translator)
- [ ] T022 Add category/subcategory mapping logic to conversion script (assign hymns to categories based on ranges)
- [ ] T023 Add fullText generation in conversion script (concatenate title + verses + chorus for search)
- [ ] T024 Create validation script in scripts/validate-hymn-data.ts to verify JSON against schema
- [ ] T025 Run conversion script to generate packages/web/public/data/hymns.json from markdown
- [ ] T026 Validate generated hymns.json contains all 700 hymns with complete data

### Core Providers & Hooks

- [x] T027 Create HymnProvider in packages/web/providers/hymn-provider.tsx with React Context for hymn data management
- [x] T028 Implement hymn data loading in HymnProvider (load from /data/hymns.json)
- [x] T029 Implement useHymns hook in HymnProvider (access all hymns, filter by category)
- [x] T030 Implement useHymnById hook in HymnProvider (retrieve specific hymn by number)
- [x] T031 Implement useCategories hook in HymnProvider (access category structure)
- [x] T032 [P] Create LanguageProvider in packages/web/providers/language-provider.tsx with Context for Polish/English toggle
- [x] T033 [P] Create Polish translations in packages/web/translations/pl.json (nav, search, song, category, offline, language keys)
- [x] T034 [P] Create English translations in packages/web/translations/en.json (all UI text in English)
- [x] T035 [P] Implement useLanguage hook in LanguageProvider (get/set language, t function, localStorage persistence)

### Application Shell

- [x] T036 Create root layout in packages/web/app/layout.tsx wrapping HymnProvider and LanguageProvider
- [x] T037 Verify HymnProvider and LanguageProvider hooks are accessible from all routes (create test route to validate context availability)
- [x] T038 [P] Create global styles in packages/web/styles/globals.css with Tailwind imports
- [x] T039 [P] Create common Header component in packages/web/components/layout/header.tsx with language toggle
- [x] T040 [P] Create LanguageToggle component in packages/web/components/common/language-toggle.tsx
- [x] T041 [P] Create OfflineIndicator component in packages/web/components/common/offline-indicator.tsx
- [x] T042 [P] Create useOffline hook in packages/web/hooks/use-offline.ts to detect online/offline status

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View Individual Hymn by Number (Priority: P1) 🎯 MVP

**Goal**: Users can navigate directly to /song/:number and view complete hymn details with verses, chorus, author, and category navigation

**Independent Test**: Navigate to /song/1 and verify complete hymn displays with title, verses, optional chorus/author, and category navigation links. Test /song/999 shows error message. Test /song/1 offline (after online visit) loads from cache.

### Implementation for User Story 1

- [ ] T043 [P] [US1] Create SongDetails component in packages/web/components/song/song-details.tsx to display hymn number, title, key, verses, chorus, author
- [ ] T044 [P] [US1] Create VerseDisplay component in packages/web/components/song/verse-display.tsx for formatting individual verses
- [ ] T045 [P] [US1] Create CategoryBadge component in packages/web/components/song/category-badge.tsx showing category and subcategory with navigation links
- [ ] T046 [US1] Create dynamic hymn page in packages/web/app/song/[number]/page.tsx using useHymnById hook
- [ ] T047 [US1] Add error handling for invalid hymn numbers in song/[number]/page.tsx (handle non-numeric inputs like /song/abc and out-of-range numbers like /song/999, show "Song not found" message)
- [ ] T048 [US1] Add loading spinner in song/[number]/page.tsx while hymn data loads
- [ ] T049 [US1] Implement category navigation from hymn page (links to view all hymns in category/subcategory)

**Checkpoint**: At this point, User Story 1 should be fully functional - can view any hymn by number with complete details and navigation

---

## Phase 4: User Story 2 - Browse Hymns by Category (Priority: P2)

**Goal**: Users can browse the home page with category accordion (3 columns desktop, 1 column mobile), expand categories to see subcategories, and navigate to hymn lists. Language toggle works and persists preference.

**Independent Test**: Navigate to home page, verify categories display in 3 columns (desktop) or 1 column (mobile). Click category to expand subcategories with hymn ranges. Click subcategory to see all hymns. Toggle language and verify UI changes while hymn content stays Polish. Return later and verify language persists.

### Implementation for User Story 2

- [ ] T050 [P] [US2] Create CategoryAccordion component in packages/web/components/category/category-accordion.tsx with collapsible major categories
- [ ] T051 [P] [US2] Create CategoryItem component in packages/web/components/category/category-item.tsx for subcategory display with hymn ranges
- [ ] T052 [P] [US2] Add responsive grid layout to CategoryAccordion (3 columns ≥768px, 1 column <768px) using Tailwind
- [ ] T053 [US2] Create home page in packages/web/app/page.tsx with CategoryAccordion using useCategories hook
- [ ] T054 [US2] Create category listing page in packages/web/app/category/[id]/page.tsx to display all hymns in selected category/subcategory
- [ ] T055 [US2] Add SongCard component in packages/web/components/song/song-card.tsx for hymn preview in category listing
- [ ] T056 [US2] Highlight current hymn when viewing category page from hymn detail page
- [ ] T057 [US2] Integrate Header with LanguageToggle into root layout for all pages
- [ ] T058 [US2] Test language toggle switches UI text while preserving Polish hymn content

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - can browse categories and view hymns

---

## Phase 5: User Story 3 - Search Hymns by Title or Content (Priority: P3)

**Goal**: Users can search hymns by typing in search box on home page. Search is debounced (300ms), diacritic-insensitive, case-insensitive, and searches across numbers, titles, and lyrics. Works offline with cached data.

**Independent Test**: Type "Jezu" in search box and verify results appear after 300ms pause. Type "Bog" (no diacritics) and verify matches "Bóg". Type "123" and verify hymn #123 appears. Verify debounce prevents search during continuous typing. Verify "no results" message for no matches. Click result to navigate to hymn. Test search works offline.

### Implementation for User Story 3

- [ ] T059 [P] [US3] Create search utilities in packages/web/lib/search-utils.ts (normalize query, search across hymns using text-normalize utility from T017)
- [ ] T060 [P] [US3] Create useSearch hook in packages/web/hooks/use-search.ts with debounced search (300ms) and diacritic-insensitive matching
- [ ] T061 [P] [US3] Create useDebounce hook in packages/web/hooks/use-debounce.ts for generic debouncing
- [ ] T062 [P] [US3] Create SearchBox component in packages/web/components/search/search-box.tsx with debounced input
- [ ] T063 [P] [US3] Create SearchResults component in packages/web/components/search/search-results.tsx displaying matching hymns with numbers and titles
- [ ] T064 [US3] Integrate SearchBox and SearchResults into home page (packages/web/app/page.tsx) above CategoryAccordion (extends home page from US2 T053)
- [ ] T065 [US3] Add loading indicator in SearchBox while search executes
- [ ] T066 [US3] Add "no results found" message in SearchResults when no matches
- [ ] T067 [US3] Implement search by hymn number (numeric query returns exact hymn)
- [ ] T068 [US3] Test diacritic-insensitive search (e.g., "Bog" matches "Bóg", "a" matches "ą")
- [ ] T069 [US3] Verify search works offline using cached hymn data

**Checkpoint**: All user stories should now be independently functional - view hymns, browse categories, search

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: PWA configuration, offline support, styling polish, and final integration

### PWA & Offline Support

- [ ] T070 [P] Configure next-pwa in packages/web/next.config.js with Cache-First strategy for hymn data
- [ ] T071 [P] Create PWA manifest in packages/web/public/manifest.json with app name, icons, theme colors
- [ ] T072 [P] Add PWA icons to packages/web/public/icons/ (192x192, 512x512)
- [ ] T073 [P] Configure Service Worker caching rules in next.config.js for offline hymn access
- [ ] T074 Test offline functionality: visit online, go offline, verify hymns load from cache
- [ ] T075 Verify offline indicator appears when network lost and disappears when restored

### UI Polish & Styling

- [ ] T076 [P] Add responsive styles for mobile devices across all components
- [ ] T077 [P] Ensure Polish characters (ą, ć, ę, ł, ń, ó, ś, ź, ż) display correctly in all contexts
- [ ] T078 [P] Add loading spinners to all data fetch points per FR-025
- [ ] T079 [P] Add error messages for all failure cases per FR-026
- [ ] T080 [P] Style SongDetails component for readable hymn display with proper verse formatting
- [ ] T081 [P] Style CategoryAccordion for clear category hierarchy and visual feedback

### Final Integration & Validation

- [ ] T082 Verify all 700 hymns are accessible by number
- [ ] T083 Verify all 9 major categories and 40 subcategories display correctly
- [ ] T084 Test complete user journey: Home → Browse category → View hymn → Navigate to another hymn in same category
- [ ] T085 Test complete user journey: Home → Search "Jezu" → View result → Return to search
- [ ] T086 Verify language toggle works across all pages and persists across sessions
- [ ] T087 Run performance tests: hymn load <3s (SC-001), search results <2s (SC-002), offline load <1s (SC-008)
- [ ] T088 Test on mobile devices (phones and tablets) per SC-005
- [ ] T089 Follow quickstart.md manual testing checklist to validate all acceptance scenarios

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Independent of US1 (but can reuse hymn display components)
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Independent of US1/US2 (but integrates with home page from US2)

### Within Each User Story

- Components marked [P] can run in parallel (different files)
- Page implementation depends on component completion
- Integration tasks depend on all components being ready
- Story complete and tested before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- Components within a story marked [P] can run in parallel
- Polish tasks marked [P] can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all components for User Story 1 together:
Task: "T043: Create SongDetails component in packages/web/components/song/song-details.tsx"
Task: "T044: Create VerseDisplay component in packages/web/components/song/verse-display.tsx"
Task: "T045: Create CategoryBadge component in packages/web/components/song/category-badge.tsx"
```

## Parallel Example: User Story 2

```bash
# Launch all components for User Story 2 together:
Task: "T050: Create CategoryAccordion component in packages/web/components/category/category-accordion.tsx"
Task: "T051: Create CategoryItem component in packages/web/components/category/category-item.tsx"
Task: "T052: Add responsive grid layout to CategoryAccordion using Tailwind"
```

## Parallel Example: User Story 3

```bash
# Launch all components for User Story 3 together:
Task: "T059: Create search utilities in packages/web/lib/search-utils.ts"
Task: "T060: Create useSearch hook in packages/web/hooks/use-search.ts"
Task: "T061: Create useDebounce hook in packages/web/hooks/use-debounce.ts"
Task: "T062: Create SearchBox component in packages/web/components/search/search-box.tsx"
Task: "T063: Create SearchResults component in packages/web/components/search/search-results.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T012)
2. Complete Phase 2: Foundational (T013-T042, CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (T043-T049)
4. **STOP and VALIDATE**: Test User Story 1 independently
   - Navigate to /song/1, /song/250, /song/999
   - Verify complete hymn display
   - Test offline functionality
   - Test category navigation
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
   - Users can now view hymns by number
3. Add User Story 2 → Test independently → Deploy/Demo
   - Users can now browse categories + view hymns
4. Add User Story 3 → Test independently → Deploy/Demo
   - Users can now search + browse + view hymns
5. Add Polish (Phase 6) → Final testing → Production deploy
   - Full PWA with offline support + polish

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (hymn detail page)
   - Developer B: User Story 2 (categories and home page)
   - Developer C: User Story 3 (search functionality)
3. Stories complete and integrate independently
4. Team collaborates on Polish phase

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Tests NOT REQUIRED per spec
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Markdown conversion (T019-T026) is CRITICAL - all hymn data depends on this
- HymnProvider (T027-T031) is CRITICAL - all pages depend on this
- Provider validation (T037) ensures HymnProvider integration before user story work begins
- User stories are independent - can be implemented in any order after Foundational phase
- Total: 89 tasks across 6 phases
