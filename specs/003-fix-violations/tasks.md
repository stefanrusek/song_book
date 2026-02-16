---
description: "Task list for fixing rule and constitutional violations"
---

# Tasks: Fix Rule and Constitutional Violations

**Input**: Design documents from `/specs/003-fix-violations/`
**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Tests**: NO TESTS REQUESTED - This is a compliance-fixing feature. Tests are outcomes of Phase 2, not test tasks themselves.

**Organization**: Tasks are grouped by implementation phase and user story outcomes.

**Note**: Intermediate commits allowed per user exception - final deliverable must pass all quality gates.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which outcome this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions
- Single project structure: `packages/web/` and `packages/shared/`

---

## Phase 1: Configuration Fixes (Foundation)

**Purpose**: Update configuration files to enforce standards (no tests needed - config-only changes)

**Outcomes**:
- jest.config.js enforces 100% coverage threshold
- ESLint configured consistently across packages
- Ready for Phase 2 test file creation

- [x] T001 Update jest.config.js coverage thresholds in packages/web/jest.config.js (lines 18-24: change 80→100 for statements, branches, functions, lines)
- [x] T002 Create ESLint configuration in packages/shared/eslint.config.mjs (copy from packages/web/eslint.config.mjs)

**Checkpoint**: Configuration complete - ready for test file creation

---

## Phase 2: Test File Creation (Core Work - 17 Files)

**Purpose**: Create test files for all untested components, hooks, and pages to achieve 100% coverage

**Outcomes**:
- All components have corresponding test files
- All hooks have corresponding test files
- All page content has corresponding test files
- 100% code coverage achieved
- All tests pass
- All linting passes

### Component Tests (14 files)

*Each component test MUST achieve 100% coverage (line, branch, function, statement)*

- [x] T003 [P] [US1] Create category-accordion.test.tsx in packages/web/components/category/ (test CategoryAccordion component)
- [x] T004 [P] [US1] Create category-item.test.tsx in packages/web/components/category/ (test CategoryItem component)
- [x] T005 [P] [US1] Create language-toggle.test.tsx in packages/web/components/common/ (test LanguageToggle component)
- [x] T006 [P] [US1] Create offline-indicator.test.tsx in packages/web/components/common/ (test OfflineIndicator component)
- [x] T007 [P] [US1] Create header.test.tsx in packages/web/components/layout/ (test Header component)
- [x] T008 [P] [US1] Create search-box.test.tsx in packages/web/components/search/ (test SearchBox component)
- [x] T009 [P] [US1] Create search-results.test.tsx in packages/web/components/search/ (test SearchResults component)
- [x] T010 [P] [US1] Create category-badge.test.tsx in packages/web/components/song/ (test CategoryBadge component)
- [x] T011 [P] [US1] Create song-card.test.tsx in packages/web/components/song/ (test SongCard component)
- [x] T012 [P] [US1] Create song-details.test.tsx in packages/web/components/song/ (test SongDetails component)
- [x] T013 [P] [US1] Create verse-display.test.tsx in packages/web/components/song/ (test VerseDisplay component)

### Hook Tests (3 files)

*Each hook test MUST achieve 100% coverage for all code paths and edge cases*

- [x] T014 [P] [US1] Create use-debounce.test.ts in packages/web/hooks/ (test useDebounce hook with renderHook)
- [x] T015 [P] [US1] Create use-offline.test.ts in packages/web/hooks/ (test useOffline hook with renderHook)
- [x] T016 [P] [US1] Create use-search.test.ts in packages/web/hooks/ (test useSearch hook with renderHook)

### Page Content Tests (3 files)

*Each page test MUST achieve 100% coverage for rendered content*

- [x] T017 [P] [US1] Create content.test.tsx in packages/web/app/song/[number]/ (test song detail page content)
- [x] T018 [P] [US1] Create content.test.tsx in packages/web/app/category/subcategory/[number]/ (test category detail page content)
- [x] T019 [P] [US1] Create page.test.tsx in packages/web/app/ (test home page content)

### Verification Tasks (Sequential)

- [x] T020 [US1] Run pnpm test and verify all tests pass (100% success rate)
- [ ] T021 [US1] Run pnpm lint and verify zero errors/warnings across all packages
- [ ] T022 [US1] Run pnpm coverage and verify 100% coverage (statements, branches, functions, lines)

**Checkpoint**: All 17 tests created, all tests pass, coverage at 100%

---

## Phase 3: Type Definition Fixes

**Purpose**: Ensure TypeScript standard compliance (Rule 110)

**Outcomes**:
- All type definitions use `type` keyword (no interfaces)
- TypeScript strict mode compliance

- [ ] T023 [US1] Convert interface to type in packages/shared/utils/__tests__/test-utils.ts (line 156: interface SearchResultValidator → type SearchResultValidator)

**Checkpoint**: Type definition compliant with Rule 110

---

## Phase 4: Final Verification & Documentation

**Purpose**: Verify all quality gates pass and document fixes

**Outcomes**:
- All 23 violations fixed
- All quality gates pass
- Documentation reflects fixed state
- Ready for PR and merge

### Final Quality Gate Checks

- [ ] T024 [US1] Run complete quality gate sequence: `pnpm test && pnpm lint && pnpm coverage` (exit code 0)
- [ ] T025 [US1] Verify all 9 functional requirements met (FR-001 through FR-009 in spec.md)
- [ ] T026 [US1] Verify all 8 success criteria achieved (SC-001 through SC-008 in spec.md)

### Compliance Verification (for US2 - Code Reviewer)

- [ ] T027 [US2] Verify jest.config.js has 100% threshold (Requirement: FR-001)
- [ ] T028 [US2] Verify all 14 component test files exist (Requirement: FR-002)
- [ ] T029 [US2] Verify all 3 hook test files exist (Requirement: FR-003)
- [ ] T030 [US2] Verify all 3 page test files exist (Requirement: FR-004)
- [ ] T031 [US2] Verify ESLint configured in shared package (Requirement: FR-005)
- [ ] T032 [US2] Verify interface converted to type in test-utils.ts (Requirement: FR-006)
- [ ] T033 [US2] Confirm all 23 violations documented as fixed (Requirement: FR-009)

### Documentation (for US3 - New Developer Onboarding)

- [ ] T034 [P] [US3] Verify CLAUDE.md documents Node.js 24 requirement (Rule 510)
- [ ] T035 [P] [US3] Verify CLAUDE.md documents pnpm 10+ requirement (Rule 520)
- [ ] T036 [P] [US3] Verify CLAUDE.md documents 100% coverage requirement (Rule 410)
- [ ] T037 [P] [US3] Verify CLAUDE.md documents TypeScript type standards (Rule 110)
- [ ] T038 [P] [US3] Verify .claude/rules/410-testing-and-quality-gates.md is complete and current
- [ ] T039 [P] [US3] Verify .claude/rules/510-node-version-management.md is complete and current
- [ ] T040 [P] [US3] Verify .claude/rules/520-pnpm-package-manager.md is complete and current
- [ ] T041 [P] [US3] Verify Constitution documents all 7 principles with Principle VII pre-commit gates

### Final Commit

- [ ] T042 [US1] Create final commit: `git commit -m "docs(spec): complete violation fixes achieving 100% compliance..."`
  - Include list of all fixes
  - Include quality gate pass confirmations
  - Add Co-Authored-By trailer

**Checkpoint**: All violations fixed, all quality gates pass, ready for PR

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1** (Configuration): No dependencies - start immediately
- **Phase 2** (Test Files): Depends on Phase 1 completion (needs jest.config.js updated)
- **Phase 3** (Type Fixes): Can run in parallel with Phase 2 (independent file)
- **Phase 4** (Verification): Depends on Phases 1-3 completion

### Task Dependencies Within Phases

**Phase 1**: Sequential (configuration must be done before tests)
- T001 → T002

**Phase 2**: Mostly parallel within story
- T003-T022 can mostly run in parallel (different components/hooks)
- T020-T022 must run after all test files created (sequential verification)

**Phase 3**: Independent
- T023 can run anytime after Phase 1

**Phase 4**: Mostly parallel verification
- T024-T026: Must run last (after all previous phases)
- T027-T041: Can run in parallel during code review
- T042: Final commit after all verification complete

### User Story Completion Order

1. **User Story 1 (P1)**: Developer Runs Quality Gates
   - ALL test creation tasks (T003-T019)
   - Verification tasks (T020-T026)
   - Achieves: All quality gates pass, all violations fixed

2. **User Story 2 (P2)**: Code Reviewer Verifies (DEPENDS ON US1)
   - Verification tasks (T027-T033)
   - Achieves: Confirms all fixes validated

3. **User Story 3 (P3)**: New Developer Onboarding (INDEPENDENT)
   - Documentation verification (T034-T041)
   - Achieves: Standards documented and discoverable

---

## Parallel Execution Examples

### Phase 2 - Component Tests (Can Run in Parallel)

```bash
# All 14 component tests can be created in parallel (different files):
Task: T003 Create category-accordion.test.tsx
Task: T004 Create category-item.test.tsx
Task: T005 Create language-toggle.test.tsx
[... continue for all 14 components ...]
# Then run T020 (pnpm test) sequentially after all created
```

### Phase 2 - Hook Tests (Can Run in Parallel)

```bash
# All 3 hook tests can be created in parallel:
Task: T014 Create use-debounce.test.ts
Task: T015 Create use-offline.test.ts
Task: T016 Create use-search.test.ts
# Then run T020 (pnpm test) sequentially after all created
```

### Phase 2 - Page Tests (Can Run in Parallel)

```bash
# All 3 page tests can be created in parallel:
Task: T017 Create song detail content.test.tsx
Task: T018 Create category detail content.test.tsx
Task: T019 Create home page.test.tsx
# Then run T020 (pnpm test) sequentially after all created
```

### Phase 4 - Verification (Can Run in Parallel During Review)

```bash
# Code review verification tasks (T027-T033) can run in parallel:
Task: T027 Verify jest.config.js threshold
Task: T028 Verify component test files
Task: T029 Verify hook test files
[... continue for all verification ...]
# All can run in parallel - they're checking, not modifying
```

---

## Implementation Strategy

### MVP First (User Story 1 Only - Recommended Start)

1. Complete Phase 1: Configuration fixes (2 tasks, 15 min)
2. Complete Phase 2: Create 17 test files (17 tasks, variable)
3. Complete Phase 3: Type fix (1 task, 5 min)
4. **STOP and VALIDATE**: Run all quality gates (T024-T026)
5. If all pass: Story 1 complete ✓

**At this point**: Repository passes all quality gates, developer can commit code

### Incremental Validation (After Each Phase)

After Phase 1:
- Jest configuration updated
- ESLint configured
- Ready for test file creation

After Phase 2:
- All 17 test files created
- All tests passing
- Coverage at 100%

After Phase 3:
- Type definitions compliant
- All rules aligned

After Phase 4:
- All violations fixed
- Documentation complete
- Ready for merge

### Quality Gate Checkpoints

**Critical**: Run quality gates after each major phase:

```bash
# After Phase 2 completion - before moving to Phase 3
pnpm test          # Should pass
pnpm lint          # Should pass
pnpm coverage      # Should show 100%

# After Phase 3 completion
pnpm test          # Should still pass
pnpm lint          # Should still pass
pnpm coverage      # Should still be 100%

# Final verification before commit
pnpm test && pnpm lint && pnpm coverage
echo $?             # Should output 0
```

---

## Notes

- [P] tasks = different files, no blocking dependencies
- [Story] label maps task to user story outcome for traceability
- Each user story independently testable after completion
- Verify tests pass after implementing, before moving to next task
- Configuration must be updated before test files created
- Final commit must pass ALL quality gates per Principle VII
- Intermediate commits allowed per user exception, but final state must be fully compliant

---

## Task Summary

**Total Tasks**: 42 tasks across 4 phases

**By Phase**:
- Phase 1 (Configuration): 2 tasks
- Phase 2 (Test Files): 20 tasks
- Phase 3 (Type Fix): 1 task
- Phase 4 (Verification & Documentation): 19 tasks

**By User Story**:
- User Story 1 (Developer Quality Gates): 26 core implementation tasks
- User Story 2 (Code Reviewer): 7 verification tasks
- User Story 3 (New Developer Onboarding): 8 documentation verification tasks
- Shared across stories: 1 final commit task

**Parallelizable Tasks**: 25 tasks marked [P] can run concurrently

**MVP Scope**: Complete User Story 1 (Tasks T001-T026) to achieve all quality gates passing

**Full Completion**: Complete all 4 phases (Tasks T001-T042) for comprehensive fix with governance enablement
