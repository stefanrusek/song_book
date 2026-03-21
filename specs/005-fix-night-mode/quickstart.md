# Quickstart: Fix Text Readability in Night Mode

**Feature**: `005-fix-night-mode`
**Branch**: `005-fix-night-mode`

## Overview

This feature fixes dark/night mode text readability by adding Tailwind CSS `dark:` variants to all UI components and activating Tailwind v4's media-based dark mode.

## What Changes

- **`packages/web/app/globals.css`**: Enable Tailwind v4 dark mode + extend CSS tokens
- **12 component/page TSX files**: Add `dark:` Tailwind utility classes

## Development Environment

```bash
# Ensure Node 24 is active
nvm use

# Install dependencies (from repo root)
pnpm install

# Start dev server
cd packages/web
pnpm dev
```

Open `http://localhost:3000` and toggle your OS dark mode to verify changes.

## Testing Dark Mode Locally

**macOS**: System Preferences → Appearance → Dark
**Windows**: Settings → Personalization → Colors → Dark
**Linux**: Depends on desktop environment (e.g., GNOME: Settings → Appearance → Dark)
**Browser DevTools**: Chrome/Firefox allow emulating dark mode via DevTools → Rendering → prefers-color-scheme

## Quality Gates (MUST pass before every commit)

```bash
nvm use
pnpm test && pnpm lint && pnpm coverage
```

All three must exit with code 0. 100% code coverage is mandatory.

## Files To Modify (in order)

1. `packages/web/app/globals.css` — Enable `dark(media)` + CSS tokens
2. `packages/web/components/layout/header.tsx` — Header bg + nav colors
3. `packages/web/components/category/category-accordion.tsx` — Card bg + gradient
4. `packages/web/components/category/category-item.tsx` — Border + hover + text
5. `packages/web/components/song/song-card.tsx` — Card + all text colors
6. `packages/web/components/song/song-details.tsx` — Article + all text colors
7. `packages/web/components/song/verse-display.tsx` — Verse text color
8. `packages/web/components/song/category-badge.tsx` — Badge color
9. `packages/web/components/search/search-box.tsx` — Input + icon colors
10. `packages/web/components/search/search-results.tsx` — Cards + text + badge
11. `packages/web/components/common/language-toggle.tsx` — Inactive button
12. `packages/web/app/page.tsx` — Hero title + subtitle
13. `packages/web/app/song/[number]/content.tsx` — States + back button
14. `packages/web/app/category/subcategory/[number]/content.tsx` — Breadcrumb + back button

## Key Technical Detail: Tailwind v4 Dark Mode Activation

In Tailwind v4, `dark:` classes require explicit configuration. Change line 1 of `globals.css`:

```css
/* Before */
@import "tailwindcss";

/* After */
@import "tailwindcss" dark(media);
```

Without this, `dark:` utility classes will not activate on `prefers-color-scheme: dark`.

## No New Dependencies

This feature requires no new packages, API endpoints, database changes, or new components.
