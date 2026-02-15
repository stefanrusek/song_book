# TypeScript Standards

## Strict Mode

**All TypeScript code MUST use strict mode.** This is enforced through `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

This enables:
- `noImplicitAny`: Disallow implicit `any` types
- `strictNullChecks`: Enable strict null checking
- `strictFunctionTypes`: Enable strict function type checking
- `strictBindCallApply`: Enable strict bind/call/apply methods
- `strictPropertyInitialization`: Ensure class properties are initialized
- `noImplicitThis`: Disallow implicit `this` types
- `alwaysStrict`: Parse in strict mode and emit "use strict"

## Critical Type Safety Rules

### The `any` Type is Absolutely Forbidden

**Using the `any` type is forbidden without exception.** This is a critical rule (000-099 level enforcement). The `any` type:
- Defeats the entire purpose of TypeScript
- Creates type safety holes that can propagate throughout the codebase
- Eliminates compile-time error checking
- Removes IDE autocomplete and type hints
- Makes refactoring dangerous and error-prone

There are **no valid use cases** for `any` in this codebase.

### The `unknown` Type Should Be Rare

**The `unknown` type should only be used when a concrete type is genuinely impossible to determine.** Before using `unknown`:

1. Try to define the actual shape of the data
2. Consider using union types for known variants
3. Use generics to preserve type information
4. Look for properly typed third-party libraries
5. Create a specific type definition, even if it's verbose

Valid uses of `unknown` are limited to:
- Unvalidated external data (before validation and parsing)
- Truly generic utility functions that work with any type after validation
- Temporary interfacing with legacy untyped JavaScript (should be resolved)

## Code Style

### Quotes

**Always use single quotes** for strings unless the string contains a single quote:

**DO:**
```typescript
const title = 'Song Title'
const message = 'Hello, world!'
const withQuote = "It's a beautiful day"
```

**DON'T:**
```typescript
const title = "Song Title"
const message = "Hello, world!"
```

### Semicolons

Use semicolons consistently. Follow the project's existing pattern (check `.prettierrc` or ESLint config).

## Types vs Interfaces

**Prefer `type` over `interface`** for all type definitions:

**DO:**
```typescript
type User = {
  id: string
  name: string
  email: string
}

type Song = {
  id: number
  title: string
  book: string
  chapter: number
}

type ApiResponse<T> = {
  data: T
  error?: string
}
```

**DON'T:**
```typescript
interface User {
  id: string
  name: string
  email: string
}
```

### Rationale:
- `type` is more flexible (can represent unions, intersections, primitives)
- `type` has more consistent behavior
- `type` prevents accidental declaration merging
- Consistency across the codebase

### When Interfaces Are Acceptable:
Only use `interface` when:
- You specifically need declaration merging (rare)
- Extending third-party library types that use interfaces
- Working with existing code that heavily uses interfaces

## Type Definitions

### Explicit Return Types

**Always specify return types** for functions, especially exported ones:

**DO:**
```typescript
function getSong(id: number): Song | null {
  // ...
}

const formatTitle = (title: string): string => {
  // ...
}

async function fetchSongs(): Promise<Song[]> {
  // ...
}
```

**DON'T:**
```typescript
function getSong(id: number) {
  // Return type inferred
}
```

### Type Assertions

Avoid type assertions (`as`) when possible. Prefer type guards and proper validation:

**DO:**
```typescript
// Comprehensive type guard with proper validation
function isSong(value: unknown): value is Song {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'title' in value &&
    'book' in value &&
    'chapter' in value &&
    typeof (value as Record<string, unknown>).id === 'number' &&
    typeof (value as Record<string, unknown>).title === 'string' &&
    typeof (value as Record<string, unknown>).book === 'string' &&
    typeof (value as Record<string, unknown>).chapter === 'number'
  )
}

// Use with proper error handling
function parseSong(data: unknown): Song {
  if (isSong(data)) {
    return data
  }
  throw new Error('Invalid song data')
}
```

**DON'T:**
```typescript
// Blindly asserting types without validation
const song = data as Song
console.log(song.title)

// Using assertion to bypass type checking
const result = (response as any).data
```

### Nullable Types

Use explicit null/undefined handling with strict null checks:

**DO:**
```typescript
type User = {
  id: string
  name: string
  email: string | null  // Explicitly nullable
  avatar?: string        // Optional property
}

function getUser(id: string): User | null {
  // ...
}

const user = getUser('123')
if (user !== null) {
  console.log(user.name)
}
```

## React + TypeScript

### Component Props

Define prop types explicitly:

**DO:**
```typescript
type SongCardProps = {
  song: Song
  onSelect?: (id: number) => void
  className?: string
}

export function SongCard({ song, onSelect, className }: SongCardProps) {
  // ...
}
```

**DON'T:**
```typescript
export function SongCard(props: any) {
  // ...
}
```

### React Hooks

Type hooks explicitly when TypeScript can't infer:

**DO:**
```typescript
const [songs, setSongs] = useState<Song[]>([])
const [user, setUser] = useState<User | null>(null)

const contextValue = useContext<AppContextType>(AppContext)
```

### Event Handlers

Use specific event types:

**DO:**
```typescript
function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
  // ...
}

function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
  // ...
}

function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault()
  // ...
}
```

## API and Data Types

### API Response Types

Define explicit types for API responses:

**DO:**
```typescript
type GetSongsResponse = {
  songs: Song[]
  total: number
  page: number
}

type ApiError = {
  message: string
  code: string
  details?: Record<string, string | number | boolean>
}

async function getSongs(): Promise<GetSongsResponse> {
  const response = await fetch('/api/songs')
  if (!response.ok) {
    throw new Error('Failed to fetch songs')
  }
  return response.json()
}
```

### Discriminated Unions

Use discriminated unions for variants:

**DO:**
```typescript
type Result<T> =
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }
  | { status: 'loading' }

function handleResult(result: Result<Song[]>) {
  switch (result.status) {
    case 'success':
      return result.data
    case 'error':
      return result.error
    case 'loading':
      return 'Loading...'
  }
}
```

## Utility Types

Use built-in utility types effectively:

```typescript
// Pick specific properties
type SongPreview = Pick<Song, 'id' | 'title'>

// Omit properties
type SongWithoutId = Omit<Song, 'id'>

// Make all properties optional
type PartialSong = Partial<Song>

// Make all properties required
type RequiredSong = Required<Song>

// Make properties readonly
type ReadonlySong = Readonly<Song>

// Extract from union
type Status = 'pending' | 'success' | 'error'
type SuccessStatus = Extract<Status, 'success'>

// Record type
type SongMap = Record<number, Song>
```

## Naming Conventions

### Types
- Use PascalCase for type names
- Be descriptive and specific

```typescript
type UserProfile = { /* ... */ }
type SongMetadata = { /* ... */ }
type ApiResponse<T> = { /* ... */ }
```

### Generic Type Parameters
- Use descriptive names for complex generics
- Use `T` only for simple, single generic parameter

```typescript
// Simple
function identity<T>(value: T): T {
  return value
}

// Complex - use descriptive names with proper types
type PaginationMeta = {
  page: number
  total: number
  hasNext: boolean
}

type Paginated<TData> = {
  data: TData[]
  metadata: PaginationMeta
}
```

## Imports and Exports

### Type-only imports
Use `type` keyword for type-only imports:

```typescript
import type { Song, User } from '@/types'
import { getSongs } from '@/lib/api'
```

### Explicit exports
Export types explicitly:

```typescript
export type { Song, SongMetadata }
export { getSongs, formatSong }
```

## Best Practices

### DO:
- Use strict mode always
- Prefer `type` over `interface`
- Use single quotes for strings
- Specify explicit return types for functions
- Define concrete types whenever possible
- Use type guards with comprehensive validation
- Leverage utility types (Pick, Omit, etc.)
- Use discriminated unions for variants
- Define explicit types for API responses
- Use generics to preserve type information
- Use unions and intersections instead of loose types

### DON'T:
- **NEVER use `any` type** - it is absolutely forbidden
- Use `unknown` as a lazy substitute for proper typing
- Use type assertions without validation
- Mix `interface` and `type` unnecessarily
- Leave return types implicit on exported functions
- Use double quotes for strings (except when necessary)
- Disable strict mode
- Use implicit `any` in function parameters
- Rely on `unknown` when you could define the actual type

## Configuration

Ensure `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

## Rationale

- **Strict mode** catches errors early and prevents common bugs
- **Single quotes** provide consistency and cleaner code
- **Types over interfaces** offer more flexibility and prevent declaration merging issues
- **Explicit types** improve code documentation and catch errors at compile time
- **Type guards** provide runtime safety and better type inference
- **Forbidding `any`** maintains complete type safety throughout the application - `any` creates type system holes that can propagate bugs and eliminate the benefits of TypeScript
- **Sparing use of `unknown`** forces developers to think about actual types and create proper type definitions, leading to more maintainable and self-documenting code
- **Concrete types** make refactoring safer, improve IDE autocomplete, and catch bugs at compile time rather than runtime
