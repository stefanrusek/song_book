# Tasks: Fix Search Diacritical Matching

**Input**: Design documents from `/specs/002-fix-search/`
**Branch**: `002-fix-search`
**Status**: Ready for implementation
**Date Created**: 2026-02-16

**Note**: This task list focuses on comprehensive test implementation for Polish diacritical character normalization. Tests are EXPLICITLY REQUESTED in the feature specification (SC-003 and SC-004 require 100% test coverage). Task organization follows user stories to enable independent implementation and testing.

---

## Format: `- [ ] [ID] [P?] [Story?] Description with file path`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story this task belongs to (US1, US2, US3)
- **Story Labels**:
  - US1 = Accented query finds accented content (P1) ← Foundation & MVP
  - US2 = Unaccented query finds accented content (P1) ← Core issue reported
  - US3 = Accented query finds unaccented content (P2)

---

## Phase 1: Setup (Test Infrastructure)

**Purpose**: Initialize test environment and fixtures shared across all test suites

**Deliverable**: Reusable test fixtures for Polish diacritical testing

### Infrastructure Tasks

- [ ] T001 Create test fixtures file at `packages/shared/utils/__tests__/fixtures.ts` with Polish character constants and mock hymn data
- [ ] T002 [P] Create test utilities file at `packages/shared/utils/__tests__/test-utils.ts` with helper functions for assertion testing
- [ ] T003 Verify Jest configuration supports TypeScript with strict mode in `packages/shared/jest.config.js` and `packages/web/jest.config.js`

**Checkpoint**: Test infrastructure ready - can now implement user story tests in parallel

---

## Phase 2: Foundational Tests (All User Stories Depend On)

**Purpose**: Core test coverage for `normalizeText()` function - BLOCKING prerequisite for all search functionality tests

**⚠️ CRITICAL**: This phase MUST be complete before any search integration tests (Phase 3+) can pass

**Independent Test**: normalizeText() correctly handles all Polish diacritical characters

### Normalization Test Suite - Individual Character Tests

- [ ] T004 [P] Create base test file structure at `packages/shared/utils/__tests__/text-normalize.test.ts` with describe blocks for each test category
- [ ] T005 [P] Implement 9 individual lowercase character tests (ą, ć, ę, ł, ń, ó, ś, ź, ż) in `packages/shared/utils/__tests__/text-normalize.test.ts` verifying each normalizes to base character
- [ ] T006 [P] Implement 9 individual uppercase character tests (Ą, Ć, Ę, Ł, Ń, Ó, Ś, Ź, Ż) in `packages/shared/utils/__tests__/text-normalize.test.ts` verifying case-insensitive normalization
- [ ] T007 [P] Implement 8 word normalization tests (Polish words with single/multiple diacriticals: "było"→"bylo", "Jeżeli"→"jezeli", etc.) in `packages/shared/utils/__tests__/text-normalize.test.ts`
- [ ] T008 [P] Implement 4 phrase normalization tests (multi-word Polish phrases with mixed accented/unaccented) in `packages/shared/utils/__tests__/text-normalize.test.ts`
- [ ] T009 [P] Implement 4 edge case tests (empty string, non-Polish chars, numbers, special chars, mixed content) in `packages/shared/utils/__tests__/text-normalize.test.ts`
- [ ] T010 [P] Implement 2 idempotency tests (double normalization, case variation consistency) in `packages/shared/utils/__tests__/text-normalize.test.ts`

**Subtotal**: 36+ tests for normalizeText() covering all Polish characters

- [ ] T011 Run normalization tests and verify all pass: `pnpm --filter @songbook/shared test text-normalize.test.ts`
- [ ] T012 Verify 100% code coverage for normalizeText(): `pnpm --filter @songbook/shared test --coverage text-normalize.test.ts`

**Checkpoint**: normalizeText() fully tested with 100% coverage - foundation ready for search integration tests

---

## Phase 3: User Story 1 - Accented Query Finds Accented Content (Priority: P1)

**Goal**: Verify that Polish users can search using accented diacritical marks and find matching hymns

**Independent Test**: Query "Było" successfully finds hymns with "Było" in title/verses/chorus with correct relevance scoring

### Search Integration Tests - Accented Query Scenarios

- [ ] T013 [P] [US1] Implement 4 search integration tests for accented queries in `packages/web/lib/__tests__/search-utils.test.ts`:
  - Test: Query "Było" finds hymn with title "Było" (relevance 0.8)
  - Test: Query "ąćęłńóśźż" finds any hymns containing these characters
  - Test: Query "Ł" (uppercase) finds both "Ł" and "ł" variants (case-insensitive)
  - Test: Query "Święty" finds hymns with "Święty" in chorus (relevance 0.3)

**Checkpoint**: User Story 1 functionality verified - accented query search working

**Acceptance Criteria for US1**:
- ✅ All 4 test scenarios pass
- ✅ Relevance scores correct (0.8 for title, 0.3 for chorus)
- ✅ Case-insensitive matching confirmed
- ✅ Can search across title, verses, chorus fields

---

## Phase 4: User Story 2 - Unaccented Query Finds Accented Content (Priority: P1) 🎯 MVP

**Goal**: Fix the reported issue - enable users without Polish keyboard layout to find hymns using unaccented queries

**Independent Test**: Query "bylo" (unaccented) successfully finds hymns with "Było" (accented) and other Polish diacritical variants

**WHY THIS IS MVP**: This is the core issue reported by the user. Single unaccented query matching accented content delivers immediate value.

### Search Integration Tests - Unaccented Query Scenarios (Core Issue)

- [ ] T014 [P] [US2] Implement 4 search integration tests for unaccented queries in `packages/web/lib/__tests__/search-utils.test.ts`:
  - Test: Query "bylo" (unaccented) finds hymn #1 with title "Było" (with ł) - relevance 0.8
  - Test: Query "zal" (unaccented) finds hymn #42 with title "żal" (with ż) - relevance 0.8
  - Test: Query "swieci" (unaccented) finds hymns with "świeci" (with ś) in verses - relevance 0.4
  - Test: Query "piesn" (unaccented) finds hymns with "piesń" (with ń) - relevance varies by field

- [ ] T015 [P] [US2] Implement bidirectional equivalence test in `packages/web/lib/__tests__/search-utils.test.ts`:
  - Verify: searchHymns(hymns, "bylo").length === searchHymns(hymns, "Było").length
  - Verify: Relevance scores identical for accented and unaccented queries

**Checkpoint**: User Story 2 functionality verified - CORE ISSUE FIXED

**Acceptance Criteria for US2**:
- ✅ All 4 test scenarios pass
- ✅ Unaccented query "bylo" returns same results as "Było"
- ✅ All test hymns found correctly regardless of accent on query
- ✅ Relevance scoring preserved (same as accented query)
- ✅ **DELIVERABLE**: Resolves user-reported issue "bylo" not matching "Było"

---

## Phase 5: User Story 3 - Accented Query Finds Unaccented Content (Priority: P2)

**Goal**: Handle edge case where accented queries match unaccented content (data consistency scenario)

**Independent Test**: Query "Było" (accented) successfully finds hymns containing "bylo" (unaccented)

### Search Integration Tests - Accented Query Against Unaccented Content

- [ ] T016 [P] [US3] Implement 2 search integration tests for accented queries matching unaccented content in `packages/web/lib/__tests__/search-utils.test.ts`:
  - Test: Query "Było" (accented) finds hymn with title "bylo" (unaccented)
  - Test: Query "żal" (accented ż) finds hymn with title "zal" (unaccented)

**Checkpoint**: User Story 3 functionality verified - bidirectional completeness achieved

**Acceptance Criteria for US3**:
- ✅ Both test scenarios pass
- ✅ Accented and unaccented variations of same word find each other
- ✅ Symmetrical matching confirmed in both directions

---

## Phase 6: Regression & Performance Testing

**Purpose**: Ensure existing search functionality not broken and performance targets met

**Verification**: No regressions introduced by new test suite

### Regression Test Suite

- [ ] T017 [P] Implement 10 regression tests in `packages/web/lib/__tests__/search-utils.test.ts`:
  - Test: Exact number match still works (query "42" returns hymn #42 with relevance 1.0)
  - Test: Title substring match works without diacriticals
  - Test: Author name matching preserved
  - Test: Verse content matching with correct snippet extraction
  - Test: Chorus content matching with relevance 0.3
  - Test: Multiple matches ranked correctly by relevance
  - Test: Empty query returns empty array
  - Test: Whitespace-only query returns empty array
  - Test: Special characters handled gracefully
  - Test: Relevance scoring order: number (1.0) > title (0.8) > author (0.6) > verse (0.4) > chorus (0.3)

### Performance Testing

- [ ] T018 [P] Implement performance baseline test in `packages/shared/utils/__tests__/text-normalize.test.ts`:
  - Measure: 1000 normalizeText() calls should complete in <1 second
  - Verify: Average execution time <1ms per call
  - Check: ±20% variance acceptable

- [ ] T019 [P] Implement search performance test in `packages/web/lib/__tests__/search-utils.test.ts`:
  - Measure: Search across 1000 mock hymns should complete in <100ms
  - Verify: Performance within specification
  - Check: ±30% variance acceptable

**Checkpoint**: Regression and performance requirements validated

---

## Phase 7: Final Validation & Documentation

**Purpose**: Verify all tests pass, coverage complete, and documentation ready

### Validation Tasks

- [ ] T020 Run full test suite and verify all 72+ tests pass:
  ```bash
  pnpm --filter @songbook/shared test
  pnpm --filter @songbook/web test
  ```

- [ ] T021 Generate coverage report and verify 100% coverage for both functions:
  ```bash
  pnpm --filter @songbook/shared test --coverage
  pnpm --filter @songbook/web test --coverage
  ```

- [ ] T022 Verify test output documentation at `specs/002-fix-search/TEST_RESULTS.md` (auto-generated from coverage)

- [ ] T023 Run integration test to verify no conflicts with existing search UI in `packages/web/app/page.tsx`

**Checkpoint**: All tests passing, coverage verified, ready for merge

---

## Task Summary by Phase

| Phase | Purpose | Task Count | Status |
|-------|---------|-----------|--------|
| Phase 1 | Test Infrastructure | 3 | Foundational |
| Phase 2 | Normalization Tests | 9 | Blocking (must complete first) |
| Phase 3 | US1: Accented→Accented | 1 | User Story (can parallel with US2/3) |
| Phase 4 | US2: Unaccented→Accented | 2 | User Story - MVP (core issue) |
| Phase 5 | US3: Accented→Unaccented | 1 | User Story (lower priority) |
| Phase 6 | Regression & Performance | 3 | Validation |
| Phase 7 | Final Validation | 4 | Merge-ready |
| **TOTAL** | **All Phases** | **23 tasks** | |

---

## Total Test Count

| Test Category | Count | Coverage |
|---|---|---|
| Normalization - Individual Characters | 18 | All 9 lowercase + 9 uppercase Polish diacriticals |
| Normalization - Words | 8 | Polish words with single/multiple diacriticals |
| Normalization - Phrases | 4 | Multi-word Polish phrases |
| Normalization - Edge Cases | 4 | Empty, non-Polish, numbers, special chars |
| Normalization - Idempotency | 2 | Double call consistency, case variation |
| **Subtotal Normalization** | **36+** | **100% normalizeText() coverage** |
| Search - US1 (Accented→Accented) | 4 | All diacritical search scenarios |
| Search - US2 (Unaccented→Accented) | 5 | Core issue + bidirectional equivalence |
| Search - US3 (Accented→Unaccented) | 2 | Edge case data consistency |
| Search - Regression | 10 | All search field types & relevance scoring |
| Performance | 2 | normalizeText() & searchHymns() baselines |
| **Subtotal Search** | **23** | **100% searchHymns() coverage** |
| **GRAND TOTAL** | **59+ tests** | **Full coverage achieved** |

---

## Parallel Execution Opportunities

Tasks can be executed in parallel within each phase, following this strategy:

### Phase 1 (Sequential - Infrastructure First)
```
T001 → T002, T003 (parallel)
```

### Phase 2 (Parallel After Base Setup)
```
T004 (base structure first)
T005-T010 (all parallel - same file)
T011-T012 (sequential - need T005-T010 complete)
```

### Phase 3-5 (Fully Parallel - Different Stories)
```
T013 (US1) ║ T014-T015 (US2) ║ T016 (US3)
(All can run simultaneously after Phase 2)
```

### Phase 6 (Parallel - Different Concerns)
```
T017 (regression) ║ T018-T019 (performance)
```

### Phase 7 (Sequential - Validation)
```
T020 → T021 → T022 → T023
```

---

## Implementation Strategy: MVP-First Incremental Delivery

### MVP Scope (Minimum Viable Product)
**Implements**: User Story 2 (Unaccented query finds accented content)
**Deliverable**: Addresses the reported issue "bylo" not matching "Było"
**Tasks**: T001-T012 (Phases 1-2) + T014-T015 (Phase 4 US2)
**Estimated**: 50% of full scope but 100% of user value
**Delivery**: Can be released after Phase 4 complete

```
✅ Phase 1: Setup (T001-T003)
✅ Phase 2: Foundation - Normalization tests (T004-T012)
✅ Phase 4: MVP - User Story 2 (T014-T015) ← Can merge here
⏭️ Phase 3: User Story 1 (T013) - After MVP
⏭️ Phase 5: User Story 3 (T016) - After MVP
⏭️ Phase 6: Regression & Performance (T017-T019) - Before final merge
⏭️ Phase 7: Validation (T020-T023) - Final quality gate
```

### Full Feature Delivery
**Implements**: All 3 user stories + regression + performance
**Scope**: Complete implementation plan
**Tasks**: All 23 tasks across all phases
**Coverage**: 59+ tests, 100% code coverage
**Delivery**: After Phase 7 complete - production ready

---

## Dependencies & Prerequisites

```
Phase 1 (Setup)
    ↓
Phase 2 (Foundation - normalizeText tests)
    ↓
Phase 3 (US1) ← Can start here (parallel with 4,5)
Phase 4 (US2) ← MVP can release here (parallel with 3,5)
Phase 5 (US3) ← Parallel with 3,4
    ↓
Phase 6 (Regression & Performance)
    ↓
Phase 7 (Final Validation) → Ready for merge
```

**Critical Path**: Phase 1 → Phase 2 → Phase 4 → Phase 6 → Phase 7

**Parallel Paths**: After Phase 2, US1/US2/US3 tests can proceed simultaneously

---

## Definition of Done - Per User Story

### User Story 1 (Accented→Accented): Complete When
- [ ] T013 tests pass (4 scenarios)
- [ ] No regression in existing accented searches
- [ ] Relevance scoring correct

### User Story 2 (Unaccented→Accented): Complete When ← MVP MARKER
- [ ] T014-T015 tests pass (5 scenarios)
- [ ] Core issue "bylo"→"Było" resolved
- [ ] Bidirectional equivalence proven

### User Story 3 (Accented→Unaccented): Complete When
- [ ] T016 tests pass (2 scenarios)
- [ ] Edge case handling validated

### Final Release: Complete When
- [ ] T020: All 59+ tests passing
- [ ] T021: 100% code coverage achieved
- [ ] T022: Test documentation generated
- [ ] T023: Integration verified (no UI regressions)
- [ ] Branch merged to main

---

## Success Metrics

### Test Coverage
- ✅ **Target**: 100% of normalizeText() and searchHymns() functions
- ✅ **Verification**: `pnpm test --coverage` shows 100%
- ✅ **Baseline**: 36+ normalization tests + 23+ search tests = 59+ total

### Performance
- ✅ **normalizeText()**: <1ms per call (1000 calls = <1 second)
- ✅ **searchHymns()**: <100ms for 1000 hymns
- ✅ **Verification**: T018-T019 performance tests

### Functional Coverage
- ✅ **All Polish characters**: 32 variants tested (9 lowercase + 9 uppercase)
- ✅ **All user stories**: 3 stories with all scenarios
- ✅ **All search fields**: Number, title, author, verses, chorus
- ✅ **Bidirectional**: Accented ↔ Unaccented in both directions
- ✅ **Regression**: 10 regression tests ensuring no existing functionality broken

### Acceptance Criteria Met
- ✅ SC-001: All 32 Polish diacritical variants normalize correctly
- ✅ SC-002: Query "bylo" returns hymns with "Było"
- ✅ SC-003: 100% test coverage for normalizeText()
- ✅ SC-004: Tests for all 16 lowercase + 16 uppercase variants
- ✅ SC-005: No search regressions (regression test suite)
- ✅ SC-006: Users can search without removing diacriticals (all user stories)

---

## Next Steps After Task Completion

1. **After T023 passes**: Feature is production-ready
2. **Create Pull Request**: Title `test(lib): add comprehensive search diacritical matching tests`
3. **Code Review**: Reference this tasks.md, spec.md, and plan.md
4. **Merge to main**: Enables future Polish language improvements without regressions
5. **Document**: Add test results to project wiki/changelog

---

## Notes for Implementation

- All tests use TypeScript with strict mode (no `any` type)
- Tests follow Jest conventions (`describe`, `test`, `expect`)
- Co-located tests in `__tests__/` subdirectories per Jest standard
- Mock data (fixtures) centralized in `fixtures.ts` for reusability
- Tests are independent and can run in any order
- No external dependencies beyond Jest (use built-in Node.js Unicode APIs)
- Performance tests are included to ensure no degradation

---

## References

- **Specification**: `specs/002-fix-search/spec.md`
- **Implementation Plan**: `specs/002-fix-search/plan.md`
- **Data Model**: `specs/002-fix-search/data-model.md`
- **Test Contracts**: `specs/002-fix-search/contracts/test-contracts.md`
- **Quick Start Guide**: `specs/002-fix-search/quickstart.md`
- **Research Findings**: `specs/002-fix-search/research.md`
