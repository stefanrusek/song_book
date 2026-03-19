# Tasks: Fix Text Readability in Night Mode

**Input**: Design documents from `/specs/005-fix-night-mode/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, quickstart.md ✅

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Exact file paths are specified in every task description

---

## Phase 1: Setup

**Purpose**: Confirm development environment is ready before making changes.

- [ ] T001 Verify Node 24 is active and dev server starts correctly: run `nvm use && pnpm install` from repo root, then `pnpm dev` from `packages/web/` and confirm app loads at http://localhost:3000

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Activate Tailwind v4 dark mode and extend CSS token system. **ALL user story work depends on this phase being complete first** — without these changes, no `dark:` utility class will apply in any component.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T002 Enable Tailwind v4 media dark mode by changing line 1 of `packages/web/app/globals.css` from `@import "tailwindcss";` to `@import "tailwindcss" dark(media);`
- [ ] T003 Add `--verse-border` CSS custom property to `packages/web/app/globals.css`: add `--verse-border: #d1d5db;` to `:root` block and `--verse-border: #4b5563;` to the `@media (prefers-color-scheme: dark)` block
- [ ] T004 Update `.verse` rule in `packages/web/app/globals.css`: change `border-left: 2px solid #ccc` to `border-left: 2px solid var(--verse-border)`
- [ ] T005 [P] Add dark mode classes to header in `packages/web/components/layout/header.tsx`: add `dark:bg-gray-900` to `<header>`, add `dark:text-gray-300` to the two nav `<Link>` elements with `text-gray-700`
- [ ] T006 [P] Add dark mode classes to inactive language toggle buttons in `packages/web/components/common/language-toggle.tsx`: add `dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600` to the inactive state className string (the non-`bg-blue-700` branch)

**Checkpoint**: Tailwind v4 `dark:` variant now active. Header and language toggle render correctly in dark mode. All user story phases can now begin.

---

## Phase 3: User Story 1 - Readable Song Content in Night Mode (Priority: P1) 🎯 MVP

**Goal**: All text and surfaces on the song detail page (title, metadata, verses, chorus, category badge, loading/error states) are readable with proper contrast when the device is in dark mode.

**Independent Test**: Navigate to any song (e.g., `/song/42`) on a device with dark mode enabled. Title, author, key, verse text, chorus block, and category badge must all be legible against dark backgrounds.

### Implementation for User Story 1

- [ ] T007 [P] [US1] Add dark mode classes to `packages/web/components/song/song-details.tsx`:
  - `<article>`: add `dark:bg-gray-800`
  - Number div (`text-gray-500`): add `dark:text-gray-400`
  - `<h1>` (`text-gray-900`): add `dark:text-gray-100`
  - Metadata div (`text-gray-600`): add `dark:text-gray-300`
  - Verse label `<h3>` elements (`text-gray-700`): add `dark:text-gray-300`
  - Chorus wrapper div (`bg-blue-50`): add `dark:bg-blue-950`
  - Chorus label `<h3>` (`text-gray-700`): add `dark:text-gray-300`

- [ ] T008 [P] [US1] Add dark mode class to verse text in `packages/web/components/song/verse-display.tsx`: add `dark:text-gray-200` to the `<p>` element's className (currently `text-gray-800`)

- [ ] T009 [P] [US1] Add dark mode classes to category badge in `packages/web/components/song/category-badge.tsx`: add `dark:bg-indigo-900 dark:text-indigo-200 dark:hover:bg-indigo-800` to the `<Link>` element's className (currently `bg-indigo-100 text-indigo-800 hover:bg-indigo-200`)

- [ ] T010 [US1] Add dark mode classes to all states in `packages/web/app/song/[number]/content.tsx`:
  - Loading `<p>` (`text-gray-600`): add `dark:text-gray-300`
  - Error `<p>` (`text-gray-600`): add `dark:text-gray-300`
  - Not-found `<h1>` (`text-gray-900`): add `dark:text-gray-100`
  - Not-found `<p>` (`text-gray-600`): add `dark:text-gray-300`
  - Back `<a>` button (`bg-gray-200 text-gray-800 hover:bg-gray-300`): add `dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600`

**Checkpoint**: Song detail page fully readable in dark mode. T007–T009 are parallelizable (different files).

---

## Phase 4: User Story 2 - Browsable Song List in Night Mode (Priority: P2)

**Goal**: Category accordion, song cards, subcategory list, and page headings all render with dark-appropriate colors so users can browse and discover songs comfortably in dark mode.

**Independent Test**: Open the home page in dark mode: expand a category, verify accordion cards and subcategory items are legible. Navigate to a subcategory page (`/category/subcategory/1`); verify breadcrumb, heading, and song card grid are all readable.

### Implementation for User Story 2

- [ ] T011 [P] [US2] Add dark mode classes to `packages/web/components/category/category-accordion.tsx`:
  - Category card wrapper div (`bg-white`): add `dark:bg-gray-800`
  - Toggle `<button>` text (`text-gray-900`): add `dark:text-gray-100`
  - Toggle button gradient (`from-blue-50 to-indigo-50`): add `dark:from-blue-950 dark:to-indigo-950`
  - Toggle button hover (`hover:from-blue-100 hover:to-indigo-100`): add `dark:hover:from-blue-900 dark:hover:to-indigo-900`
  - Expanded subcategory divider (`border-gray-200`): add `dark:border-gray-700`

- [ ] T012 [P] [US2] Add dark mode classes to `packages/web/components/category/category-item.tsx`:
  - `<Link>` border (`border-gray-100`): add `dark:border-gray-700`
  - `<Link>` hover (`hover:bg-blue-50`): add `dark:hover:bg-blue-950`
  - Subcategory `<h4>` title (`text-gray-900`): add `dark:text-gray-100`
  - Count `<p>` (`text-gray-500`): add `dark:text-gray-400`
  - Arrow `<span>` (`text-gray-400`): add `dark:text-gray-500`

- [ ] T013 [P] [US2] Add dark mode classes to `packages/web/components/song/song-card.tsx`:
  - Default card className string (`bg-white border-gray-200 hover:shadow-md hover:border-blue-300`): add `dark:bg-gray-800 dark:border-gray-700`
  - Highlighted card className string (`bg-blue-50 border-blue-400 shadow-md`): add `dark:bg-blue-950 dark:border-blue-500`
  - Number div (`text-gray-500`): add `dark:text-gray-400`
  - Title `<h3>` (`text-gray-900`): add `dark:text-gray-100`
  - Author `<p>` (`text-gray-600`): add `dark:text-gray-300`
  - Key `<p>` (`text-gray-500`): add `dark:text-gray-400`

- [ ] T014 [P] [US2] Add dark mode classes to `packages/web/app/category/subcategory/[number]/content.tsx`:
  - Breadcrumb separator `<span>` (`text-gray-400`): add `dark:text-gray-500`
  - Breadcrumb middle `<span>` (`text-gray-600`): add `dark:text-gray-300`
  - Breadcrumb current `<span>` (`text-gray-900`): add `dark:text-gray-100`
  - Not-found `<h1>` (`text-gray-900`): add `dark:text-gray-100`
  - Not-found `<p>` (`text-gray-600`): add `dark:text-gray-300`
  - Page `<h1>` (`text-gray-900`): add `dark:text-gray-100`
  - Hymn count `<p>` (`text-gray-600`): add `dark:text-gray-300`
  - Back `<a>` button (`bg-gray-200 text-gray-800 hover:bg-gray-300`): add `dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600`

- [ ] T015 [US2] Add dark mode classes to headings in `packages/web/app/page.tsx`:
  - Hero `<h1>` (`text-gray-900`): add `dark:text-gray-100`
  - Hero subtitle `<p>` (`text-gray-600`): add `dark:text-gray-300`
  - Categories `<h2>` (`text-gray-900`): add `dark:text-gray-100`

**Checkpoint**: Home page and subcategory pages fully browsable in dark mode. T011–T014 are parallelizable (all different files).

---

## Phase 5: User Story 3 - Usable Search Experience in Night Mode (Priority: P3)

**Goal**: Search input field, clear/search icon, and all result cards (including no-results and loading states) render legibly in dark mode.

**Independent Test**: Open the home page in dark mode, type a search query. The input field, placeholder, icons, result cards, title text, match type, relevance badge, and match context must all be clearly visible.

### Implementation for User Story 3

- [ ] T016 [P] [US3] Add dark mode classes to search input in `packages/web/components/search/search-box.tsx`:
  - `<input>` element (`border-gray-300`): add `dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400`
  - Clear `<button>` (`text-gray-500 hover:text-gray-700`): add `dark:text-gray-400 dark:hover:text-gray-200`
  - Search icon wrapper div (`text-gray-400`): add `dark:text-gray-500`

- [ ] T017 [US3] Add dark mode classes to search results in `packages/web/components/search/search-results.tsx`:
  - Loading `<p>` (`text-gray-600`): add `dark:text-gray-300`
  - No-results title `<p>` (`text-gray-600`): add `dark:text-gray-300`
  - No-results query `<p>` (`text-gray-500`): add `dark:text-gray-400`
  - Count `<p>` (`text-gray-600`): add `dark:text-gray-300`
  - Result `<Link>` card (`bg-white border-gray-200`): add `dark:bg-gray-800 dark:border-gray-700`
  - Result title `<h3>` (`text-gray-900` — inside font-semibold): add `dark:text-gray-100`
  - Match type `<p>` (`text-gray-500`): add `dark:text-gray-400`
  - Relevance badge div (`bg-blue-100 text-blue-800`): add `dark:bg-blue-900 dark:text-blue-200`
  - Match context `<p>` (`text-gray-600`): add `dark:text-gray-300`

**Checkpoint**: Search flow fully readable in dark mode. T016 is parallelizable with T017 (different files).

---

## Phase 6: Polish & Quality Gates

**Purpose**: Validate all changes pass quality gates and dark mode appearance is correct end-to-end.

- [ ] T018 Run pre-commit quality gates from repo root: `nvm use && pnpm test && pnpm lint && pnpm coverage` — fix any failures before proceeding
- [ ] T019 Verify dark mode appearance end-to-end via browser DevTools dark mode emulation (Chrome: DevTools → Rendering → prefers-color-scheme: dark): confirm all three user story pages (song detail, home/categories, search results) render with correct dark-mode colors per spec.md success criteria

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 — **BLOCKS all user story phases**
- **User Stories (Phases 3–5)**: All depend on Phase 2 completion
  - Once Phase 2 is done, US1/US2/US3 phases can proceed in parallel (all touch different files)
- **Polish (Phase 6)**: Depends on all user story phases being complete

### User Story Dependencies

- **User Story 1 (P1)**: Depends on Phase 2 — no dependency on US2 or US3
- **User Story 2 (P2)**: Depends on Phase 2 — no dependency on US1 or US3
- **User Story 3 (P3)**: Depends on Phase 2 — no dependency on US1 or US2

All three user stories touch **entirely different files** and can be implemented in true parallel after Phase 2.

### Within Each User Story

- All `[P]`-marked tasks within a story touch different files and run in parallel
- T010 (US1), T015 (US2), T017 (US3) have no explicit parallelism marker because they follow immediately after their story's other tasks complete
- Quality gates (T018) verify the entire change set

### File Ownership Summary (no conflicts across stories)

| File | Phase | Story |
|------|-------|-------|
| `packages/web/app/globals.css` | Foundational | — |
| `packages/web/components/layout/header.tsx` | Foundational | — |
| `packages/web/components/common/language-toggle.tsx` | Foundational | — |
| `packages/web/components/song/song-details.tsx` | Phase 3 | US1 |
| `packages/web/components/song/verse-display.tsx` | Phase 3 | US1 |
| `packages/web/components/song/category-badge.tsx` | Phase 3 | US1 |
| `packages/web/app/song/[number]/content.tsx` | Phase 3 | US1 |
| `packages/web/components/category/category-accordion.tsx` | Phase 4 | US2 |
| `packages/web/components/category/category-item.tsx` | Phase 4 | US2 |
| `packages/web/components/song/song-card.tsx` | Phase 4 | US2 |
| `packages/web/app/category/subcategory/[number]/content.tsx` | Phase 4 | US2 |
| `packages/web/app/page.tsx` | Phase 4 | US2 |
| `packages/web/components/search/search-box.tsx` | Phase 5 | US3 |
| `packages/web/components/search/search-results.tsx` | Phase 5 | US3 |

---

## Parallel Execution Examples

### Phase 2 Parallel Group (after T002–T004 complete)

```
T005: header.tsx dark classes
T006: language-toggle.tsx dark classes
```

### Phase 3 (US1) Parallel Group

```
T007: song-details.tsx dark classes
T008: verse-display.tsx dark classes
T009: category-badge.tsx dark classes
→ then T010: content.tsx states + back button
```

### Phase 4 (US2) Parallel Group

```
T011: category-accordion.tsx dark classes
T012: category-item.tsx dark classes
T013: song-card.tsx dark classes
T014: subcategory content.tsx dark classes
→ then T015: app/page.tsx headings
```

### Phase 5 (US3) Parallel Group

```
T016: search-box.tsx dark classes
→ T017: search-results.tsx dark classes
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001)
2. Complete Phase 2: Foundational (T002–T006) — **critical blocker**
3. Complete Phase 3: User Story 1 (T007–T010)
4. Run quality gates (T018)
5. **STOP and VALIDATE**: Song detail page readable in dark mode

### Incremental Delivery

1. Phase 1 + Phase 2 → Dark mode infrastructure ready
2. Phase 3 → Song content readable (P1 MVP)
3. Phase 4 → Category browsing readable (P2 complete)
4. Phase 5 → Search usable (P3 complete)
5. Phase 6 → Quality gates pass, visual verification done

### Parallel Team Strategy

After Phase 2 completes:
- Developer A: Phase 3 (US1 — song detail)
- Developer B: Phase 4 (US2 — categories/browsing)
- Developer C: Phase 5 (US3 — search)

All work on entirely different files — zero merge conflicts.

---

## Notes

- Every task is a className string change only — no logic, prop, or type changes
- `[P]` tasks touch different files: safe to execute simultaneously in separate tool calls
- Each user story phase is independently testable and deliverable
- Run `pnpm test && pnpm lint && pnpm coverage` after completing each phase (Principle VII)
- Commit after each phase with conventional commit format: `fix(styles): ...` or `fix(components): ...`
- No new dependencies, no new files, no API changes required
