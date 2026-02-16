# Quickstart Guide: Polish SDA Hymnal Songbook

**Feature**: 001-polish-songbook-app
**Date**: 2026-02-15
**Audience**: Developers implementing this feature

## Prerequisites

Before starting implementation, ensure you have:

- **Node.js**: v20+ (LTS recommended)
- **pnpm**: v10+ (required by constitution)
  ```bash
  npm install -g pnpm@latest
  pnpm --version  # Should be 10.0.0 or higher
  ```
- **Git**: For version control
- **Editor**: VS Code recommended (TypeScript support)
- **Source File**: Access to `/Users/stefanrusek/Downloads/spiewajmy_panu_2005.md`

## Project Setup

### 1. Initialize Monorepo Structure

Create the constitutional pnpm workspace monorepo:

```bash
# Navigate to repository root
cd /Users/stefanrusek/Code/song_book

# Create pnpm workspace configuration
cat > pnpm-workspace.yaml <<EOF
packages:
  - 'packages/*'
EOF

# Create root package.json
cat > package.json <<EOF
{
  "name": "@songbook/root",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "pnpm --filter @songbook/web dev",
    "build": "pnpm --filter @songbook/web build",
    "start": "pnpm --filter @songbook/web start",
    "lint": "pnpm --filter @songbook/web lint",
    "type-check": "pnpm --recursive run type-check",
    "convert-hymns": "tsx scripts/convert-markdown-to-json.ts"
  },
  "devDependencies": {
    "tsx": "^4.7.0",
    "typescript": "^5.3.3"
  }
}
EOF

# Create directory structure
mkdir -p packages/web packages/shared/types packages/shared/utils scripts

# Remove existing package-lock.json if present (constitution requirement)
rm -f package-lock.json
```

### 2. Create Shared Package

```bash
# Create shared package.json
cat > packages/shared/package.json <<EOF
{
  "name": "@songbook/shared",
  "version": "0.1.0",
  "private": true,
  "main": "./types/index.ts",
  "types": "./types/index.ts",
  "exports": {
    "./types": "./types/index.ts",
    "./utils": "./utils/text-normalize.ts"
  },
  "devDependencies": {
    "typescript": "^5.3.3"
  }
}
EOF

# Create tsconfig for shared package
cat > packages/shared/tsconfig.json <<EOF
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "lib": ["ES2022"],
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["**/*.ts"],
  "exclude": ["node_modules"]
}
EOF
```

### 3. Initialize Next.js Web Application

```bash
# Create Next.js app in packages/web
cd packages/web
pnpm create next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*"

# Install additional dependencies
pnpm add next-pwa
pnpm add -D @types/node

# Update package.json name
# Edit packages/web/package.json and change "name" to "@songbook/web"
```

### 4. Configure Next.js for PWA

Edit `packages/web/next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https?:\/\/localhost.*\.json$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'hymn-data-cache',
        expiration: {
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
        },
      },
    },
  ],
})

const nextConfig = {
  reactStrictMode: true,
}

module.exports = withPWA(nextConfig)
```

### 5. Configure TypeScript (Strict Mode)

Edit `packages/web/tsconfig.json` to enforce constitutional requirements:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"],
      "@songbook/shared/*": ["../shared/*"]
    },
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## Hymn Data Conversion

### Step 1: Create Conversion Script

Create `scripts/convert-markdown-to-json.ts`:

```typescript
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

// TODO: Implement markdown parsing logic
// 1. Read markdown file
// 2. Parse table of contents (categories)
// 3. Parse each hymn (number, title, key, verses, chorus, author)
// 4. Map hymns to categories
// 5. Generate fullText for each hymn
// 6. Validate data structure
// 7. Write to packages/web/public/data/hymns.json

console.log('Converting markdown to JSON...')
// Implementation will be in tasks phase
```

### Step 2: Run Conversion

```bash
# From repository root
pnpm convert-hymns

# Verify output
ls -lh packages/web/public/data/hymns.json
```

### Step 3: Validate JSON Schema

```bash
# Install AJV (JSON Schema validator)
pnpm add -D ajv ajv-cli

# Validate generated JSON against schema
npx ajv validate \
  -s specs/001-polish-songbook-app/contracts/hymn-data-schema.json \
  -d packages/web/public/data/hymns.json
```

## Development Workflow

### Start Development Server

```bash
# From repository root
pnpm dev

# Or from packages/web
cd packages/web
pnpm dev
```

Application will be available at `http://localhost:3000`

### Build for Production

```bash
# From repository root
pnpm build

# Output in packages/web/.next
```

### Type Checking

```bash
# Check all packages
pnpm type-check

# Check specific package
pnpm --filter @songbook/web type-check
```

## Directory Structure Reference

After setup, your structure should match:

```
song_book/
├── pnpm-workspace.yaml
├── package.json
├── pnpm-lock.yaml
│
├── packages/
│   ├── web/                  # Next.js application
│   │   ├── app/
│   │   │   ├── page.tsx      # Home page
│   │   │   ├── layout.tsx
│   │   │   ├── song/
│   │   │   │   └── [number]/
│   │   │   │       └── page.tsx
│   │   │   └── category/
│   │   │       └── [id]/
│   │   │           └── page.tsx
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   ├── song/
│   │   │   ├── search/
│   │   │   ├── category/
│   │   │   └── common/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── providers/
│   │   ├── public/
│   │   │   └── data/
│   │   │       └── hymns.json
│   │   ├── translations/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── next.config.js
│   │
│   └── shared/               # Shared types/utils
│       ├── types/
│       │   ├── hymn.ts
│       │   ├── category.ts
│       │   ├── guards.ts
│       │   └── index.ts
│       ├── utils/
│       │   └── text-normalize.ts
│       ├── package.json
│       └── tsconfig.json
│
├── scripts/
│   ├── convert-markdown-to-json.ts
│   └── validate-hymn-data.ts
│
└── specs/
    └── 001-polish-songbook-app/
        ├── spec.md
        ├── plan.md
        ├── research.md
        ├── data-model.md
        ├── quickstart.md
        └── contracts/
            └── hymn-data-schema.json
```

## Key Implementation Files

### Shared Types (packages/shared/types/)

1. **hymn.ts**: Hymn, HymnKey, Subcategory types
2. **category.ts**: Category, SubcategoryInfo types
3. **guards.ts**: Type guards (isHymn, isCategory, isHymnData)
4. **index.ts**: Barrel exports

### Web Application (packages/web/)

#### Pages (app/)
- `app/page.tsx`: Home with search + categories
- `app/song/[number]/page.tsx`: Individual hymn display
- `app/category/[id]/page.tsx`: Category hymn listing

#### Components (components/)
- `layout/header.tsx`: App header with language toggle
- `song/song-details.tsx`: Full hymn display
- `song/verse-display.tsx`: Individual verse formatting
- `search/search-box.tsx`: Debounced search input
- `search/search-results.tsx`: Search results list
- `category/category-accordion.tsx`: Expandable categories
- `common/language-toggle.tsx`: Polish/English switcher

#### Hooks (hooks/)
- `use-hymns.ts`: Hymn data loading
- `use-search.ts`: Search with debounce + normalization
- `use-language.ts`: Language preference
- `use-offline.ts`: Offline detection

#### Utilities (lib/)
- `hymn-data.ts`: Load/parse hymns.json
- `search-utils.ts`: Text normalization, diacritic removal
- `category-utils.ts`: Category grouping
- `pwa-utils.ts`: Service worker registration

## Testing the Application

### Manual Testing Checklist

1. **Home Page**:
   - [ ] Search box visible
   - [ ] Categories display in 3 columns (desktop) or 1 column (mobile)
   - [ ] Language toggle works (PL/EN)

2. **Search**:
   - [ ] Type "Bog" → finds hymns with "Bóg"
   - [ ] Debounce works (300ms delay)
   - [ ] Results show hymn number + title
   - [ ] Click result navigates to hymn

3. **Hymn Page**:
   - [ ] Title, number, key display
   - [ ] All verses display
   - [ ] Chorus displays (if present)
   - [ ] Author displays (if present)
   - [ ] Category badge shows category/subcategory
   - [ ] Link to view all in category works

4. **Category Browsing**:
   - [ ] Major categories expand/collapse
   - [ ] Subcategories show hymn range
   - [ ] Click subcategory shows all hymns

5. **Bilingual**:
   - [ ] Toggle to English changes UI text
   - [ ] Hymn content stays in Polish
   - [ ] Language preference persists after refresh

6. **Offline (PWA)**:
   - [ ] Visit site online first
   - [ ] Turn off network
   - [ ] Navigate to previously viewed hymn → works
   - [ ] Search works offline

7. **Mobile**:
   - [ ] Responsive layout (1 column categories)
   - [ ] Touch-friendly controls
   - [ ] Readable text size

## Troubleshooting

### pnpm not found
```bash
npm install -g pnpm@latest
```

### Type errors with shared package
```bash
# Rebuild shared package
pnpm --filter @songbook/shared run type-check
```

### PWA not working in development
- PWA is disabled in development mode (by design)
- Test PWA in production build: `pnpm build && pnpm start`

### Service Worker not updating
- Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
- Clear cache in DevTools → Application → Clear Storage

## Next Steps

After setup is complete:

1. Run `/speckit.tasks` to generate task breakdown
2. Implement tasks in priority order (P1, then P2, then P3)
3. Test each user story independently
4. Commit after each phase completion (per constitutional requirement)

## Resources

- **Constitution**: `.specify/memory/constitution.md`
- **Spec**: `specs/001-polish-songbook-app/spec.md`
- **Plan**: `specs/001-polish-songbook-app/plan.md`
- **Data Model**: `specs/001-polish-songbook-app/data-model.md`
- **Research**: `specs/001-polish-songbook-app/research.md`
- **Next.js Docs**: https://nextjs.org/docs
- **PWA Docs**: https://web.dev/progressive-web-apps/
- **Tailwind CSS**: https://tailwindcss.com/docs
