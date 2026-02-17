# Tasks: Fix Missing Translations in UI

**Input**: Design documents from `/specs/004-fix-missing-translations/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL - not explicitly requested in feature specification, so not included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Type definitions and translation file initialization

- [x] T001 Update TranslationDictionary type with new keys in `packages/shared/types/index.ts`
  - Add `search` namespace keys: `matchedByNumber`, `matchedInTitle`, `matchedInVerses`, `matchedInChorus`
  - Add `song` namespace key: `by`
  - Add `category` namespace key: `hymns`
  - Verify TypeScript strict mode compliance

- [x] T002 [P] Add English translations to `packages/web/public/translations/en.json`
  - Add all 7 new translation keys with English strings (see data-model.md)
  - Verify JSON format is valid

- [x] T003 [P] Add Polish translations to `packages/web/public/translations/pl.json`
  - Add all 7 new translation keys with Polish strings (see data-model.md)
  - Verify JSON format is valid

**Checkpoint**: Type definitions and translation files ready - component implementation can begin

---

## Phase 2: User Story 1 - View UI in Non-English Language (Priority: P1) 🎯 MVP

**Goal**: Ensure "Hymns" on home page, "by" and "Key" on subcategory page display in user's selected language

**Independent Test**:
1. Load application with Polish language selected
2. Navigate to home page → verify "Hymns" displays in Polish ("Hymny")
3. Navigate to subcategory page → verify "by" and "Key" display in Polish
4. Switch to English → verify all text reverts to English
5. No untranslated English text should remain visible

### Implementation for User Story 1

- [x] T004 [US1] Replace hardcoded "Hymns" in home page (`packages/web/app/page.tsx`)
  - Identify hardcoded "Hymns" text
  - Implement translation lookup using existing translation infrastructure
  - For server component: determine best approach (delegate to client component or pre-load translations)
  - Verify page renders correctly in both English and Polish

- [x] T005 [P] [US1] Replace hardcoded "by" in subcategory page (`packages/web/app/category/subcategory/[number]/content.tsx`)
  - Replace hardcoded "by" with `t('song.by')` call
  - Ensure `useLanguage()` hook is imported and used
  - Verify consistency with song page display of same term

- [x] T006 [P] [US1] Replace hardcoded "Key" in subcategory page (`packages/web/app/category/subcategory/[number]/content.tsx`)
  - Replace hardcoded "Key" with `t('song.key')` call
  - Verify consistency with existing song page translation usage
  - Confirm same key is used in both locations (no duplicate keys)

- [x] T007 [US1] Verify TypeScript compilation and type checking
  - Run `pnpm tsc --noEmit` to verify all new translation keys are properly typed
  - Ensure no TypeScript errors for translation key lookups

**Checkpoint**: User Story 1 complete - home page and subcategory page display all text in selected language

---

## Phase 3: User Story 2 - Ensure Consistent Translation Terminology (Priority: P1)

**Goal**: Same UI terms display identically across all pages (home page, subcategory page, song page) in all supported languages

**Independent Test**:
1. Load application in Polish
2. View "by" on subcategory page and compare with song page → should be identical translation
3. View "Key" on subcategory page and compare with song page → should be identical translation
4. Verify same translation appears in all contexts
5. Switch to English → same consistency verification

### Implementation for User Story 2

- [x] T008 [P] [US2] Replace hardcoded search result labels in `packages/web/components/search/search-results.tsx`
  - Replace "Matched by number" with `t('search.matchedByNumber')`
  - Replace "Matched in title" with `t('search.matchedInTitle')`
  - Replace "Matched in verses" with `t('search.matchedInVerses')`
  - Replace "Matched in chorus" with `t('search.matchedInChorus')`
  - Ensure conditional logic properly handles all match types

- [x] T009 [US2] Verify consistency across pages
  - Compare "by" and "Key" translations on subcategory page with song page
  - Verify they use same translation keys and display identically
  - Test in both English and Polish languages
  - Confirm no instances of same term with different translations

- [x] T010 [US2] Final TypeScript and compilation verification
  - Run `pnpm tsc --noEmit` to ensure no type errors
  - Verify all translation keys are valid and present in TranslationDictionary

**Checkpoint**: User Stories 1 and 2 complete - all UI text translates consistently

---

## Phase 4: Quality Gates & Testing

**Purpose**: Ensure code meets Song Book quality standards before commit

- [x] T011 [P] Run linting checks
  - Execute `pnpm lint` from repository root with Node 24
  - Verify zero errors and zero warnings
  - Fix any linting issues in modified files

- [x] T012 [P] Run test suite
  - Execute `pnpm test` with Node 24
  - Verify 100% test pass rate
  - No failing or skipped tests

- [x] T013 [P] Verify code coverage
  - Execute `pnpm coverage` with Node 24
  - Verify 100% code coverage on all modified files
  - New translation keys in type definition must be typed (100% coverage)

- [x] T014 Manual end-to-end testing
  - Load application in English → verify all text displays in English
  - Switch to Polish → verify all text displays in Polish
  - Navigate all modified pages: home, subcategory, search results
  - Verify no console errors or hydration mismatches
  - Test language switching without page reload

**Checkpoint**: All quality gates passing - code ready for commit

---

## Phase 5: Documentation & Deployment

**Purpose**: Documentation and final verification

- [x] T015 Run quickstart validation
  - Follow steps in `specs/004-fix-missing-translations/quickstart.md`
  - Execute all manual testing scenarios
  - Verify all success criteria met

- [x] T016 Update CLAUDE.md if needed
  - Verify agent context has been updated by planning phase
  - Check for any manual documentation updates needed
  - Ensure development guidelines remain accurate

- [x] T017 Create commit message and verify clean git status
  - Stage modified files: type definition, translation files, component files
  - Prepare conventional commit message: `fix(translations): replace hardcoded strings with translation keys`
  - Include description of changes: "Add 7 new translation keys for 'Hymns' (home page), 'by' and 'Key' (subcategory page), and search result match type labels. Replace all hardcoded English text with proper translation lookups to ensure consistent translation across UI."
  - Verify all files staged correctly before commit

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - must complete first
  - All three setup tasks can run in parallel (different files)
  - Provides foundation for user story implementation

- **User Story 1 (Phase 2)**: Depends on Setup completion
  - Tasks T005, T006 can run in parallel (different components)
  - T004 must complete before T007 (TypeScript check depends on code changes)

- **User Story 2 (Phase 3)**: Depends on Setup and User Story 1 completion
  - Task T008 can run in parallel with US1 implementation if desired
  - T009 verification must run after component updates
  - T010 must run after all component changes

- **Quality Gates (Phase 4)**: Depends on all implementation phases
  - Tasks T011, T012, T013 can run in parallel (independent checks)
  - T014 manual testing must run after quality gates pass

- **Documentation (Phase 5)**: Depends on all implementation and testing phases

### Within User Stories

- **User Story 1**:
  - T004 (home page) can run independently
  - T005, T006 (subcategory page) can run in parallel (different aspects of same component)
  - All must complete before T007 (TypeScript check)

- **User Story 2**:
  - T008 (search results) can run independently from T009 (verification)
  - T009 (consistency check) can run in parallel with US1 if US1 tasks already done
  - T010 (final verification) must run after T008 and T009

### Parallel Opportunities

**Parallel Setup (Phase 1)**:
```
Task T002: Add English translations → packages/web/public/translations/en.json
Task T003: Add Polish translations → packages/web/public/translations/pl.json
(Both can run simultaneously - different files, no dependencies)
```

**Parallel User Story 1 Components (Phase 2)**:
```
Task T005: Update subcategory "by" → packages/web/app/category/subcategory/[number]/content.tsx
Task T006: Update subcategory "Key" → packages/web/app/category/subcategory/[number]/content.tsx
(Both update same file but different properties - safe to implement together)
```

**Parallel Quality Gates (Phase 4)**:
```
Task T011: Linting check → pnpm lint
Task T012: Test suite → pnpm test
Task T013: Coverage check → pnpm coverage
(All independent - can run in parallel)
```

**Sequential Between Stories**:
```
Phase 1: Setup (TYPE DEFS + TRANSLATIONS)
  ↓
Phase 2: User Story 1 (COMPONENT UPDATES)
  ↓
Phase 3: User Story 2 (SEARCH RESULTS + CONSISTENCY)
  ↓
Phase 4: Quality Gates (LINTING, TESTS, COVERAGE)
  ↓
Phase 5: Documentation & Deployment
```

---

## Implementation Strategy

### MVP First (All User Stories - This is a Bug Fix)

This feature is a bug fix with two tightly coupled user stories that comprise the complete fix:

1. **Phase 1**: Complete Setup (type definitions and translation files)
2. **Phase 2**: Complete User Story 1 (translate hardcoded strings on pages)
3. **Phase 3**: Complete User Story 2 (ensure consistency across pages)
4. **Phase 4**: Run all quality gates (must pass before commit)
5. **Phase 5**: Deploy/merge to main

**Why both stories are MVP**: Bug fix is incomplete without both stories - home page, subcategory page, AND search results all need translation keys for consistent user experience.

### Incremental Validation

- After Setup (Phase 1): Type definitions and translation files ready
- After US1 (Phase 2): Home page and subcategory page fully translated
- After US2 (Phase 3): All UI text translated consistently across all pages
- After Quality Gates (Phase 4): Code meets Song Book standards

### Single Developer Path (Recommended)

1. Complete Phase 1: Setup (15 min)
2. Complete Phase 2: User Story 1 (30 min)
3. Complete Phase 3: User Story 2 (15 min)
4. Complete Phase 4: Quality Gates (10 min)
5. Complete Phase 5: Documentation & Deployment (5 min)

**Total Estimated Time**: ~75 minutes

---

## Task Checklist Format

Each task follows this format:
- **Checkbox**: `- [ ]` marks incomplete tasks
- **Task ID**: Sequential T001, T002, etc.
- **[P] marker**: Indicates parallelizable tasks
- **[Story] label**: Maps to user story (US1, US2)
- **Description**: Clear action with exact file paths
- **Implementation details**: Specific code changes needed

---

## Notes

- All tasks use exact absolute file paths for clarity
- TypeScript strict mode must pass on all modifications
- Quality gates (pnpm test && pnpm lint && pnpm coverage) are mandatory per Song Book Constitution Principle VII
- Each user story should be independently verifiable (can test without other stories)
- Both user stories are required for complete fix
- Use Node 24 via `nvm use` before running any pnpm commands
- Commit after Phase 5 completion with conventional commit format
