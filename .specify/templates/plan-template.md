# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: [e.g., Python 3.11, Swift 5.9, Rust 1.75 or NEEDS CLARIFICATION]  
**Primary Dependencies**: [e.g., FastAPI, UIKit, LLVM or NEEDS CLARIFICATION]  
**Storage**: [if applicable, e.g., PostgreSQL, CoreData, files or N/A]  
**Testing**: [e.g., pytest, XCTest, cargo test or NEEDS CLARIFICATION]  
**Target Platform**: [e.g., Linux server, iOS 15+, WASM or NEEDS CLARIFICATION]
**Project Type**: [single/web/mobile - determines source structure]  
**Performance Goals**: [domain-specific, e.g., 1000 req/s, 10k lines/sec, 60 fps or NEEDS CLARIFICATION]  
**Constraints**: [domain-specific, e.g., <200ms p95, <100MB memory, offline-capable or NEEDS CLARIFICATION]  
**Scale/Scope**: [domain-specific, e.g., 10k users, 1M LOC, 50 screens or NEEDS CLARIFICATION]

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

[Gates determined based on constitution file]

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
# [REMOVE IF UNUSED] Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [REMOVE IF UNUSED] Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [REMOVE IF UNUSED] Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure: feature modules, UI flows, platform tests]
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Detailed Sequence Diagrams *(mandatory)*

<!--
  CONSTITUTION REQUIREMENT (Principle II): All implementation plans MUST include detailed sequence diagrams.

  These diagrams should show:
  - Component-level interactions with actual component names
  - Data flows including data structures and transformations
  - API calls and database queries
  - State changes and side effects
  - Error handling paths
  - Asynchronous operations and callbacks

  Use Mermaid sequenceDiagram syntax for consistency and renderability.
  Create separate diagrams for:
  - Each major user story implementation flow
  - Complex component interactions
  - API endpoint request/response cycles
  - Data persistence and retrieval flows
-->

### User Story 1 Implementation Flow

```mermaid
sequenceDiagram
    actor User
    participant Page as [PageName]
    participant Hook as [HookName]
    participant API as [APIEndpoint]
    participant Service as [ServiceName]
    participant DB as Database

    User->>Page: [User action, e.g., clicks button]
    Page->>Hook: [Function call with params]
    Hook->>API: POST /api/[endpoint]<br/>{data: [structure]}
    API->>Service: [service.method(params)]
    Service->>DB: [Query description]
    DB-->>Service: [Result set]
    Service-->>API: [Processed data]
    API-->>Hook: {success: true, data: [...]}
    Hook->>Hook: setState([newState])
    Hook-->>Page: [Updated state]
    Page-->>User: [UI update description]

    Note over Page,DB: [Technical notes: caching, validation, etc.]
```

### Error Handling Flow

```mermaid
sequenceDiagram
    participant Component
    participant API
    participant ErrorBoundary

    Component->>API: [Request]
    alt Success
        API-->>Component: [Success response]
        Component->>Component: Update UI
    else Validation Error
        API-->>Component: 400 {error: "..."}
        Component->>Component: Show inline error
    else Server Error
        API-->>Component: 500 {error: "..."}
        Component->>ErrorBoundary: Throw error
        ErrorBoundary-->>Component: Fallback UI
    end
```

### Data Flow Diagram

```mermaid
sequenceDiagram
    participant Client
    participant Server
    participant Cache
    participant Storage

    Client->>Cache: Check cache
    alt Cache Hit
        Cache-->>Client: Return cached data
    else Cache Miss
        Client->>Server: Fetch data
        Server->>Storage: Query
        Storage-->>Server: Results
        Server-->>Client: Response
        Client->>Cache: Update cache
    end
```

[Add more sequence diagrams as needed for each complex flow, API integration, or component interaction]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
