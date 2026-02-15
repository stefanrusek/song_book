<!--
SYNC IMPACT REPORT
==================
Version: 1.0.0 → 1.1.0 (MINOR bump - new principle added)
Type: Amendment
Date: 2026-02-15

Added Principles:
- VI. Root Cause Analysis (user requirement - spec research phase)

Modified Principles:
- None

Removed Principles:
- None

Template Updates:
✅ spec-template.md - added mandatory "Root Cause Analysis" section with systematic analysis framework
⚠️ plan-template.md - no changes required (root cause analysis is spec-phase activity)
⚠️ tasks-template.md - no changes required (root cause analysis is spec-phase activity)

Follow-up Actions:
- None

Deferred Items:
- None

Previous Versions:
- 1.0.0 (2026-02-15): Initial constitution with five core principles
-->

# Song Book Constitution

## Core Principles

### I. Type Safety First

**All TypeScript code MUST enforce strict type safety without exception.**

- The `any` type is absolutely forbidden - no exceptions
- The `unknown` type should only be used when concrete types are genuinely impossible to determine
- All function return types MUST be explicitly declared
- Strict mode MUST be enabled in `tsconfig.json`
- Type guards MUST include comprehensive validation, not blind assertions
- Prefer `type` over `interface` for all type definitions

**Rationale**: Type safety catches errors at compile-time, enables reliable refactoring, improves IDE support, and serves as living documentation. The `any` type creates type system holes that eliminate TypeScript's benefits and can propagate bugs throughout the application.

### II. Visual Documentation

**All specifications MUST include high-level sequence diagrams. All implementation plans MUST include detailed sequence diagrams.**

- Feature specifications (`spec.md`) MUST contain high-level sequence diagrams showing user interactions and system flows
- Implementation plans (`plan.md`) MUST contain detailed sequence diagrams showing component interactions, data flows, and technical implementation
- Sequence diagrams MUST use standard Mermaid syntax for consistency and renderability
- Diagrams MUST be updated whenever requirements or designs change
- Complex interactions (>3 components) MUST be visualized before implementation

**Rationale**: Visual documentation accelerates understanding, reveals design flaws early, facilitates communication between team members, and serves as authoritative design artifacts that reduce misunderstandings during implementation.

### III. Phased Development

**Development MUST proceed in phases with commits after each phase completion.**

Phases and commit requirements:
1. **After Specification** - Commit feature specifications with `docs(spec): ` prefix
2. **After Planning** - Commit implementation plans with `docs(spec): ` prefix
3. **After Task Breakdown** - Commit task lists with `docs(spec): ` prefix
4. **After Implementation** - Commit implementation work following conventional commit format
5. **Within Implementation** - Commit after completing each distinct task or logical unit

All commits MUST follow [Conventional Commits](https://www.conventionalcommits.org/) format:
- Format: `<type>(<scope>): <description>`
- Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `style`, `perf`, `ci`, `build`
- Scopes: `pages`, `components`, `api`, `lib`, `hooks`, `styles`, `config`, `db`, `auth`, `types`, `spec`

**Rationale**: Phased commits create clear audit trails from specification through completion, enable granular rollback if needed, facilitate code review by breaking changes into digestible units, and document the decision-making process for future reference.

### IV. Component Separation

**UI components MUST be presentational. Business logic MUST be hoisted to pages, hooks, or providers.**

- All UI components MUST reside in `components/` directory or subdirectories
- Each file MUST contain exactly one component - no exceptions
- Component prop types MUST be declared and exported from the same file as the component
- Components MUST NOT fetch data, perform business logic, mutate state, or make API calls directly
- Components receive data and callbacks via props and emit events through those callbacks
- Business logic, data fetching, and state management MUST be in Next.js pages or custom hooks
- Use props for local data needs (1-2 levels deep), Context for truly global state (user, theme, settings)

**Rationale**: Presentational components are testable with simple prop inputs (no API mocking), reusable across different contexts, maintainable with clear responsibilities, and composable to build complex UIs. Separation of concerns makes refactoring safer and code easier to understand.

### V. Conventional Commits

**All commits MUST follow Conventional Commits format. All work MUST occur in feature branches merged via Pull Requests.**

- Never commit directly to `main` branch
- Branch naming: `feature/description`, `fix/description`, `refactor/description`, `docs/description`
- Commit format: `<type>(<scope>): <description>` with optional body and footer
- Breaking changes: add `!` after type/scope or include `BREAKING CHANGE:` in footer
- Commit frequently during development - after each logical unit of work
- Keep commits focused on a single concern

**Rationale**: Branch protection prevents accidental commits to main and ensures code review. Conventional commits enable automated changelog generation and semantic versioning. Frequent focused commits create clear history, make code review easier, and simplify finding/reverting specific changes.

### VI. Root Cause Analysis

**All feature specifications MUST include root cause analysis before proposing solutions.**

- Document problem symptoms clearly and separately from underlying causes
- Use systematic techniques (5 Whys, fishbone diagrams, etc.) to identify root causes
- Distinguish between what users observe (symptoms) and why problems exist (causes)
- Research and document existing solutions and analyze why they don't address root causes
- Validate assumptions through data, user research, or documentation when possible
- Solutions MUST address identified root causes, not just treat symptoms
- Mark unvalidated assumptions explicitly for future research

**Rationale**: Understanding root causes prevents building features that address symptoms while leaving problems unsolved. Root cause analysis ensures development effort targets actual problems, reduces rework from misunderstood requirements, prevents solution churn, and leads to more effective features that provide lasting value rather than temporary fixes.

## Development Workflow

### Feature Development Process

1. **Create feature branch** from `main` using descriptive name
2. **Specify** - Create `spec.md` with user stories and high-level sequence diagrams → Commit
3. **Plan** - Create `plan.md` with technical approach and detailed sequence diagrams → Commit
4. **Break Down** - Create `tasks.md` with ordered, dependency-tracked tasks → Commit
5. **Implement** - Complete tasks, committing after each logical unit
6. **Review** - Create Pull Request with conventional commit title and clear description
7. **Merge** - Squash and merge to `main` after approval and passing CI

### Code Organization

```
components/           # UI components only (presentational)
├── layout/          # Header, footer, navigation
├── song/            # Song-related components
├── common/          # Shared UI components (buttons, inputs)
└── providers/       # Context providers for global state

app/                 # Next.js App Router pages (containers)
├── songs/           # Song pages with data fetching and logic
├── api/             # API routes
└── layout.tsx       # Root layout

lib/                 # Utility functions and shared logic
hooks/               # Custom React hooks for data/state logic
types/               # Shared TypeScript type definitions
```

### File Naming Conventions

- **All files**: kebab-case (lowercase with hyphens)
- **Components**: `song-card.tsx`, `user-profile.tsx` (export PascalCase names)
- **Hooks**: `use-songs.ts`, `use-auth.ts`
- **Providers**: `app-provider.tsx`, `auth-provider.tsx`
- **Pages**: `page.tsx`, `layout.tsx` (Next.js convention)
- **API Routes**: `route.ts` (Next.js convention)

## Technology Constraints

### Required Stack

- **Framework**: Next.js 16+ with App Router
- **Language**: TypeScript 5+ with strict mode enabled
- **UI Library**: React 19+
- **Styling**: Tailwind CSS 4+
- **Package Manager**: npm (per package.json)

### Server vs Client Components

- **Server Components (default)**: Use for static content, data fetching, SEO-critical content
- **Client Components (`'use client'`)**: Use for interactivity, React hooks, browser APIs, event handlers

### Testing Strategy (when tests are required)

- **Unit Tests**: For utility functions, hooks, and pure logic
- **Component Tests**: For presentational components with mock props
- **Integration Tests**: For page-level flows and API interactions
- **Contract Tests**: For API endpoints and data contracts

## Governance

### Amendment Process

This constitution supersedes all other development practices for the Song Book project. To amend:

1. Propose changes with clear rationale and impact analysis
2. Review impact on existing templates and documentation
3. Update constitution with version bump following semantic versioning:
   - **MAJOR**: Backward incompatible changes (principle removal/redefinition)
   - **MINOR**: New principles or materially expanded guidance
   - **PATCH**: Clarifications, wording fixes, non-semantic refinements
4. Propagate changes to all dependent templates and documentation
5. Document changes in Sync Impact Report (HTML comment at top of file)
6. Create migration plan for existing code if needed
7. Commit with `docs(constitution): ` prefix

### Compliance

- All Pull Requests MUST verify compliance with these principles
- Code reviews MUST check for type safety, component separation, and commit format adherence
- Any violation MUST be justified in writing before merge
- Complexity that violates simplicity principles MUST document why simpler alternatives were rejected

### Version Control

**Version**: 1.1.0 | **Ratified**: 2026-02-15 | **Last Amended**: 2026-02-15
