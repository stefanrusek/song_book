# Next.js and React Architecture

## Core Principle: Separation of Concerns

**The most important architectural principle is proper separation of concerns.** Components should be presentational and testable, with all logic and data management hoisted to the appropriate level.

## Component Organization

### Directory Structure

All UI components **MUST** reside in the `components` directory or its subdirectories:

```
components/
├── layout/
│   ├── header.tsx
│   ├── footer.tsx
│   └── sidebar.tsx
├── song/
│   ├── song-card.tsx
│   ├── song-list.tsx
│   └── song-details.tsx
├── common/
│   ├── button.tsx
│   ├── input.tsx
│   └── modal.tsx
└── providers/
    └── app-provider.tsx
```

### One Component Per File

**Each file MUST contain exactly one component.** This rule is absolute.

**DO:**
```typescript
// components/song/song-card.tsx
type SongCardProps = {
  song: Song
  onSelect: (id: number) => void
  isSelected: boolean
}

export function SongCard({ song, onSelect, isSelected }: SongCardProps) {
  return (
    <div onClick={() => onSelect(song.id)}>
      <h3>{song.title}</h3>
      <p>{song.book} - Chapter {song.chapter}</p>
    </div>
  )
}
```

**DON'T:**
```typescript
// Multiple components in one file - FORBIDDEN
export function SongCard() { /* ... */ }
export function SongList() { /* ... */ }
export function SongDetails() { /* ... */ }
```

### Type Definitions

**Component prop types MUST be declared and exported from the same file as the component.**

**DO:**
```typescript
// components/song/song-card.tsx
export type SongCardProps = {
  song: Song
  onSelect: (id: number) => void
  isSelected: boolean
  className?: string
}

export function SongCard({ song, onSelect, isSelected, className }: SongCardProps) {
  // ...
}
```

This allows:
- Easy imports of both component and its prop types for testing
- Clear documentation of component interface
- Type reuse when needed

## Presentational Components

### Components Must Not Perform Actions

**Components MUST be presentational.** They should render UI based on props and emit events through callbacks. They **MUST NOT**:
- Fetch data directly
- Perform business logic
- Mutate application state
- Make API calls
- Handle complex computations

**DO:**
```typescript
// components/song/song-card.tsx
type SongCardProps = {
  song: Song
  onSelect: (id: number) => void
  onDelete: (id: number) => void
  onEdit: (id: number) => void
}

export function SongCard({ song, onSelect, onDelete, onEdit }: SongCardProps) {
  return (
    <div>
      <h3>{song.title}</h3>
      <button onClick={() => onSelect(song.id)}>View</button>
      <button onClick={() => onEdit(song.id)}>Edit</button>
      <button onClick={() => onDelete(song.id)}>Delete</button>
    </div>
  )
}
```

**DON'T:**
```typescript
// Component performing actions directly - FORBIDDEN
export function SongCard({ song }: { song: Song }) {
  async function handleDelete() {
    await fetch(`/api/songs/${song.id}`, { method: 'DELETE' })
    // This is wrong - action logic in component
  }

  return (
    <div>
      <h3>{song.title}</h3>
      <button onClick={handleDelete}>Delete</button>
    </div>
  )
}
```

### Rationale

Presentational components are:
- **Testable** - Can be tested with simple prop inputs without mocking APIs or state
- **Reusable** - Can be used in different contexts with different behaviors
- **Maintainable** - Easy to understand and modify
- **Composable** - Can be combined to build complex UIs

## Logic Hoisting to Pages

### Next.js Pages are Containers

**All business logic, data fetching, and state management MUST be hoisted to Next.js pages** (or dedicated container components when necessary).

**DO:**
```typescript
// app/songs/page.tsx
'use client'

import { useState } from 'react'
import { SongCard } from '@/components/song/song-card'
import { useSongs } from '@/hooks/use-songs'

export default function SongsPage() {
  const { songs, deleteSong, isLoading } = useSongs()
  const [selectedId, setSelectedId] = useState<number | null>(null)

  async function handleDelete(id: number) {
    if (confirm('Are you sure?')) {
      await deleteSong(id)
    }
  }

  function handleSelect(id: number) {
    setSelectedId(id)
  }

  function handleEdit(id: number) {
    router.push(`/songs/${id}/edit`)
  }

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      {songs.map(song => (
        <SongCard
          key={song.id}
          song={song}
          onSelect={handleSelect}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      ))}
    </div>
  )
}
```

### Page Responsibilities

Next.js pages should:
- Fetch data (Server Components) or manage data fetching (Client Components)
- Handle routing and navigation
- Manage page-level state
- Coordinate actions between components
- Handle error boundaries
- Pass data and callbacks to presentational components

**DO:**
```typescript
// app/songs/[id]/page.tsx - Server Component
import { getSong } from '@/lib/api/songs'
import { SongDetails } from '@/components/song/song-details'
import { SongActions } from '@/components/song/song-actions'

type PageProps = {
  params: { id: string }
}

export default async function SongPage({ params }: PageProps) {
  const song = await getSong(parseInt(params.id))

  if (!song) {
    return <div>Song not found</div>
  }

  return (
    <div>
      <SongDetails song={song} />
      <SongActions songId={song.id} />
    </div>
  )
}
```

## Data Management

### Data Must Be Hoisted

**Components MUST NOT fetch their own data.** Data should be:
1. Passed down as props from pages
2. Accessed via Context/Provider pattern
3. Fetched at the page level (Server Components)
4. Managed through custom hooks (Client Components)

### Passing Data via Props

For simple, localized data needs:

**DO:**
```typescript
// app/songs/page.tsx
export default function SongsPage() {
  const songs = await getSongs()

  return <SongList songs={songs} onSongSelect={handleSelect} />
}

// components/song/song-list.tsx
type SongListProps = {
  songs: Song[]
  onSongSelect: (id: number) => void
}

export function SongList({ songs, onSongSelect }: SongListProps) {
  return (
    <div>
      {songs.map(song => (
        <SongCard key={song.id} song={song} onSelect={onSongSelect} />
      ))}
    </div>
  )
}
```

### Context/Provider Pattern

For data needed across many components or deep in the component tree:

**DO:**
```typescript
// components/providers/app-provider.tsx
'use client'

import { createContext, useContext, ReactNode } from 'react'

type AppContextType = {
  user: User | null
  settings: AppSettings
  updateSettings: (settings: Partial<AppSettings>) => void
}

const AppContext = createContext<AppContextType | null>(null)

type AppProviderProps = {
  children: ReactNode
  initialUser: User | null
  initialSettings: AppSettings
}

export function AppProvider({ children, initialUser, initialSettings }: AppProviderProps) {
  const [settings, setSettings] = useState(initialSettings)
  const [user] = useState(initialUser)

  function updateSettings(newSettings: Partial<AppSettings>) {
    setSettings(prev => ({ ...prev, ...newSettings }))
  }

  return (
    <AppContext.Provider value={{ user, settings, updateSettings }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp(): AppContextType {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}
```

**Usage in component:**
```typescript
// components/layout/header.tsx
import { useApp } from '@/components/providers/app-provider'

export function Header() {
  const { user, settings } = useApp()

  return (
    <header>
      <h1>Song Book</h1>
      {user && <span>Welcome, {user.name}</span>}
    </header>
  )
}
```

### When to Use Props vs Context

**Use Props when:**
- Data is needed by a component and its immediate children
- The data flow is clear and direct
- You want to keep components loosely coupled

**Use Context when:**
- Data is needed by many components at different nesting levels
- Passing props would require excessive prop drilling (>2-3 levels)
- The data is truly global (user, theme, language, app settings)

## Custom Hooks for Data Logic

**Extract data fetching and state management logic into custom hooks** for reusability and testability.

**DO:**
```typescript
// hooks/use-songs.ts
import { useState, useEffect } from 'react'

export function useSongs() {
  const [songs, setSongs] = useState<Song[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadSongs()
  }, [])

  async function loadSongs() {
    try {
      setIsLoading(true)
      const response = await fetch('/api/songs')
      const data = await response.json()
      setSongs(data.songs)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load songs')
    } finally {
      setIsLoading(false)
    }
  }

  async function deleteSong(id: number) {
    await fetch(`/api/songs/${id}`, { method: 'DELETE' })
    setSongs(songs.filter(song => song.id !== id))
  }

  return { songs, isLoading, error, loadSongs, deleteSong }
}

// Usage in page
export default function SongsPage() {
  const { songs, deleteSong, isLoading } = useSongs()

  return <SongList songs={songs} onDelete={deleteSong} />
}
```

## Testing Benefits

This architecture makes testing straightforward:

**Component Testing:**
```typescript
// components/song/song-card.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { SongCard } from './song-card'

test('calls onSelect when clicked', () => {
  const mockSong = { id: 1, title: 'Test Song', book: 'Book 1', chapter: 1 }
  const mockOnSelect = jest.fn()

  render(<SongCard song={mockSong} onSelect={mockOnSelect} />)

  fireEvent.click(screen.getByText('Test Song'))

  expect(mockOnSelect).toHaveBeenCalledWith(1)
})
```

**Hook Testing:**
```typescript
// hooks/use-songs.test.ts
import { renderHook, waitFor } from '@testing-library/react'
import { useSongs } from './use-songs'

test('loads songs on mount', async () => {
  const { result } = renderHook(() => useSongs())

  expect(result.current.isLoading).toBe(true)

  await waitFor(() => {
    expect(result.current.isLoading).toBe(false)
    expect(result.current.songs).toHaveLength(3)
  })
})
```

## File Naming Conventions

**All files MUST use kebab-case (lowercase with hyphens).**

- **Components**: kebab-case (e.g., `song-card.tsx`, `user-profile.tsx`)
- **Hooks**: kebab-case with `use-` prefix (e.g., `use-songs.ts`, `use-auth.ts`)
- **Providers**: kebab-case with `-provider` suffix (e.g., `app-provider.tsx`, `auth-provider.tsx`)
- **Types**: Export from component file or centralized `types/` directory
- **Pages**: kebab-case (e.g., `song-details/page.tsx`)
- **API Routes**: kebab-case (e.g., `api/song-metadata/route.ts`)

**Component names in code remain PascalCase** (React/TypeScript convention), but the file names are kebab-case:

```typescript
// File: components/song/song-card.tsx
export function SongCard({ song }: SongCardProps) {
  // Component code in PascalCase
}
```

## Server vs Client Components (Next.js App Router)

### Server Components (Default)

Use for:
- Static content
- Data fetching from APIs or databases
- SEO-critical content
- Pages that don't need interactivity

```typescript
// app/songs/page.tsx - Server Component
import { getSongs } from '@/lib/api/songs'
import { SongList } from '@/components/song/song-list'

export default async function SongsPage() {
  const songs = await getSongs()

  return <SongList songs={songs} />
}
```

### Client Components

Use `'use client'` directive for:
- Components with interactivity (onClick, onChange, etc.)
- Components using React hooks (useState, useEffect, useContext)
- Components using browser APIs
- Event handlers

```typescript
// components/song/song-list.tsx
'use client'

import { useState } from 'react'

type SongListProps = {
  songs: Song[]
}

export function SongList({ songs }: SongListProps) {
  const [filter, setFilter] = useState('')

  const filteredSongs = songs.filter(song =>
    song.title.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter songs..."
      />
      {filteredSongs.map(song => (
        <div key={song.id}>{song.title}</div>
      ))}
    </div>
  )
}
```

## Summary of Rules

### MUST:
- Store all UI components in `components/` directory or subdirectories
- Have exactly one component per file
- Export prop types from the same file as the component
- Make components presentational (no actions, no data fetching)
- Hoist all logic to Next.js pages or custom hooks
- Pass actions to components as callbacks
- Hoist data management to pages or context providers
- Use props for local data needs, context for global data needs

### MUST NOT:
- Put multiple components in a single file
- Have components fetch their own data
- Have components perform business logic
- Have components make API calls directly
- Have components manage complex application state

## Rationale

- **Separation of concerns** makes code easier to understand and maintain
- **Presentational components** are simple, testable, and reusable
- **Hoisted logic** centralizes complexity at the page level where it's easier to manage
- **One component per file** makes code easy to find and navigate
- **Prop types in same file** provides clear component interfaces
- **Context for global state** prevents excessive prop drilling
- **Custom hooks** encapsulate data logic for reusability
- **Testability** is dramatically improved when components are pure and logic is separate
