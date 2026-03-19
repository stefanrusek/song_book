# Research: Fix Text Readability in Night Mode

**Feature**: `005-fix-night-mode`
**Date**: 2026-03-19

## Summary

This document resolves all technical unknowns required to implement dark mode support for the song book app.

---

## Decision 1: Tailwind CSS v4 Dark Mode Mechanism

**Decision**: Use Tailwind CSS v4 `dark:` variant with `@media (prefers-color-scheme: dark)` strategy, configured via `@variant dark` in `globals.css`.

**Rationale**:
- Tailwind CSS v4 (`^4.0.0`) uses a new CSS-first configuration approach.
- In v4, `dark:` variant is **not** automatically wired to `prefers-color-scheme`; it must be explicitly configured via `@variant dark { @media (prefers-color-scheme: dark) { ... } }` in the global CSS, OR the existing `@media (prefers-color-scheme: dark)` block must be used alongside Tailwind's built-in class-based toggle.
- The existing `globals.css` already uses `@media (prefers-color-scheme: dark)` for CSS custom properties. The same strategy should be applied to Tailwind's `dark:` variant.
- Tailwind v4 supports a `@custom-variant` directive (or the `darkMode: 'media'` setting is no longer in JS config — instead configured in CSS). To enable `prefers-color-scheme` dark mode for `dark:` utilities, add to `globals.css`:
  ```css
  @variant dark (&:where(.dark, .dark *));
  ```
  This is the v4 way to configure dark mode via a class. Alternatively, since CSS custom properties + `@media` is already working, we extend that approach.
- **Chosen approach**: Apply `dark:` Tailwind utility classes throughout components. These work in Tailwind v4 with `prefers-color-scheme` media strategy when configured. Add the following to `globals.css`:
  ```css
  @media (prefers-color-scheme: dark) {
    /* Extend dark CSS variables and ensure Tailwind dark: utilities fire */
  }
  ```
  In Tailwind v4, add to `globals.css` (or configure via `@variant`):
  ```css
  @variant dark (&:where(.dark, .dark *)) {}
  ```
  But since we want **automatic** `prefers-color-scheme` behavior (no manual `.dark` class toggling), we use:
  ```css
  @media (prefers-color-scheme: dark) { ... }
  ```
  for CSS custom property overrides AND use Tailwind v4's built-in media strategy by adding to globals.css:
  ```css
  @import "tailwindcss" dark(media);
  ```
  This enables `dark:` utilities to fire on `prefers-color-scheme: dark`.

**Final approach confirmed**: Change `@import "tailwindcss"` to `@import "tailwindcss" dark(media)` in `globals.css` to activate Tailwind v4's media-query dark mode for all `dark:` utility classes. Then add `dark:` variants to all components.

**Alternatives considered**:
- Class-based dark mode (`@variant dark (&:where(.dark, .dark *))`): Would require a JavaScript toggle to add/remove `.dark` class. More complex, not needed — user's system preference should drive dark mode automatically.
- CSS custom properties only (no Tailwind `dark:` classes): Would require all colors to be defined as custom properties. More verbose for components; mixes two approaches. Rejected in favor of consistent `dark:` usage.

---

## Decision 2: Color Token Strategy

**Decision**: Extend the existing CSS custom property system in `globals.css` with additional semantic tokens for card surfaces, borders, muted text, inputs, and accent colors. Use these tokens alongside `dark:` utility classes in components.

**Rationale**:
- The existing tokens (`--background`, `--foreground`) are insufficient — they only cover the page background and body text. Components need surface-level tokens (cards, inputs) and border tokens.
- Adding new tokens keeps the approach consistent with existing globals.css design.
- Most component colors will be handled with direct `dark:` Tailwind classes (simpler for Tailwind-heavy components). CSS tokens are added for the `.verse` CSS class which cannot use Tailwind directly.

**New tokens to add** (light → dark):
- `--border`: `#e5e7eb` → `#374151` (gray-200 → gray-700)
- `--card`: `#ffffff` → `#1f2937` (white → gray-800)
- `--card-foreground`: `#111827` → `#f9fafb` (gray-900 → gray-50)
- `--muted`: `#6b7280` → `#9ca3af` (gray-500 → gray-400)
- `--verse-border`: `#d1d5db` → `#4b5563` (gray-300 → gray-600)

**Alternatives considered**:
- No CSS tokens, only `dark:` classes: Could not address `.verse` CSS class without refactoring it to an inline style or Tailwind class. CSS token for `.verse` border is the simplest solution.

---

## Decision 3: Component-by-Component Dark Mode Mapping

**Decision**: Add `dark:` Tailwind utility classes to each component inline — no new component abstraction, no separate style file.

**Rationale**:
- The feature is a targeted fix; adding `dark:` variants is additive and does not change component logic.
- No component restructuring needed — all changes are string additions to `className` props.
- Per Principle IV, components must remain presentational, and this change keeps them so.
- Abstraction into theme tokens or CSS-only approach would be premature given the scope.

### Complete Color Mapping Per File

#### `globals.css`
| Element | Light | Dark |
|---------|-------|------|
| `.verse` border-left | `#ccc` | `var(--verse-border)` |
| New `--border` token | `#e5e7eb` | `#374151` |
| New `--card` token | `#ffffff` | `#1f2937` |
| New `--muted` token | `#6b7280` | `#9ca3af` |
| New `--verse-border` token | `#d1d5db` | `#4b5563` |

#### `header.tsx`
| Element | Light class | Add dark: class |
|---------|-------------|-----------------|
| `<header>` | `bg-white` | `dark:bg-gray-900` |
| Nav links | `text-gray-700` | `dark:text-gray-300` |

#### `category-accordion.tsx`
| Element | Light class | Add dark: class |
|---------|-------------|-----------------|
| Card wrapper | `bg-white` | `dark:bg-gray-800` |
| Button | `text-gray-900` | `dark:text-gray-100` |
| Button bg | `from-blue-50 to-indigo-50` | `dark:from-blue-950 dark:to-indigo-950` |
| Button hover | `hover:from-blue-100 hover:to-indigo-100` | `dark:hover:from-blue-900 dark:hover:to-indigo-900` |
| Divider | `border-gray-200` | `dark:border-gray-700` |

#### `category-item.tsx`
| Element | Light class | Add dark: class |
|---------|-------------|-----------------|
| Link border | `border-gray-100` | `dark:border-gray-700` |
| Link hover | `hover:bg-blue-50` | `dark:hover:bg-blue-950` |
| Title | `text-gray-900` | `dark:text-gray-100` |
| Count | `text-gray-500` | `dark:text-gray-400` |
| Arrow | `text-gray-400` | `dark:text-gray-500` |

#### `song-card.tsx`
| Element | Light class | Add dark: class |
|---------|-------------|-----------------|
| Card (default) | `bg-white border-gray-200` | `dark:bg-gray-800 dark:border-gray-700` |
| Card (highlighted) | `bg-blue-50 border-blue-400` | `dark:bg-blue-950 dark:border-blue-500` |
| Number | `text-gray-500` | `dark:text-gray-400` |
| Title | `text-gray-900` | `dark:text-gray-100` |
| Author | `text-gray-600` | `dark:text-gray-300` |
| Key | `text-gray-500` | `dark:text-gray-400` |

#### `song-details.tsx`
| Element | Light class | Add dark: class |
|---------|-------------|-----------------|
| Article | `bg-white` | `dark:bg-gray-800` |
| Number | `text-gray-500` | `dark:text-gray-400` |
| Title | `text-gray-900` | `dark:text-gray-100` |
| Metadata | `text-gray-600` | `dark:text-gray-300` |
| Section labels | `text-gray-700` | `dark:text-gray-300` |
| Chorus bg | `bg-blue-50` | `dark:bg-blue-950` |

#### `verse-display.tsx`
| Element | Light class | Add dark: class |
|---------|-------------|-----------------|
| Verse text | `text-gray-800` | `dark:text-gray-200` |

#### `search-box.tsx`
| Element | Light class | Add dark: class |
|---------|-------------|-----------------|
| Input | `border-gray-300 bg-white` | `dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400` |
| Clear button | `text-gray-500 hover:text-gray-700` | `dark:text-gray-400 dark:hover:text-gray-200` |
| Search icon | `text-gray-400` | `dark:text-gray-500` |

#### `search-results.tsx`
| Element | Light class | Add dark: class |
|---------|-------------|-----------------|
| Loading / no-results text | `text-gray-600` | `dark:text-gray-300` |
| Count text | `text-gray-600` | `dark:text-gray-300` |
| Result card | `bg-white border-gray-200` | `dark:bg-gray-800 dark:border-gray-700` |
| Song title | `text-gray-900` | `dark:text-gray-100` |
| Match type | `text-gray-500` | `dark:text-gray-400` |
| Relevance badge | `bg-blue-100 text-blue-800` | `dark:bg-blue-900 dark:text-blue-200` |
| Match context | `text-gray-600` | `dark:text-gray-300` |

#### `category-badge.tsx`
| Element | Light class | Add dark: class |
|---------|-------------|-----------------|
| Badge | `bg-indigo-100 text-indigo-800 hover:bg-indigo-200` | `dark:bg-indigo-900 dark:text-indigo-200 dark:hover:bg-indigo-800` |

#### `language-toggle.tsx`
| Element | Light class | Add dark: class |
|---------|-------------|-----------------|
| Inactive button | `bg-gray-200 text-gray-700 hover:bg-gray-300` | `dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600` |

#### `app/page.tsx`
| Element | Light class | Add dark: class |
|---------|-------------|-----------------|
| Hero title | `text-gray-900` | `dark:text-gray-100` |
| Hero subtitle | `text-gray-600` | `dark:text-gray-300` |
| Categories heading | `text-gray-900` | `dark:text-gray-100` |

#### `app/song/[number]/content.tsx`
| Element | Light class | Add dark: class |
|---------|-------------|-----------------|
| "Not Found" title | `text-gray-900` | `dark:text-gray-100` |
| Error / not-found text | `text-gray-600` | `dark:text-gray-300` |
| Back button | `bg-gray-200 text-gray-800 hover:bg-gray-300` | `dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600` |

#### `app/category/subcategory/[number]/content.tsx`
| Element | Light class | Add dark: class |
|---------|-------------|-----------------|
| Breadcrumb separator | `text-gray-400` | `dark:text-gray-500` |
| Breadcrumb middle | `text-gray-600` | `dark:text-gray-300` |
| Breadcrumb current | `text-gray-900` | `dark:text-gray-100` |
| Page title | `text-gray-900` | `dark:text-gray-100` |
| Subtitle | `text-gray-600` | `dark:text-gray-300` |
| Back button | `bg-gray-200 text-gray-800 hover:bg-gray-300` | `dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600` |

---

## Decision 4: Testing Strategy

**Decision**: Update existing component tests to verify dark mode class presence, and ensure snapshot tests (if any) reflect new `dark:` classes. No new test files needed — existing test files already cover component rendering.

**Rationale**:
- The changes are purely additive to `className` strings; existing logic tests remain valid.
- Tests should verify that dark mode classes are present in rendered output to prevent regressions.
- 100% code coverage must be maintained (Principle VII).

**Alternatives considered**:
- Visual regression testing (Playwright/Chromatic): Out of scope for this fix. Not part of existing test setup.
- Integration tests for dark mode: Not feasible in Jest/jsdom, which does not support `prefers-color-scheme` media query simulation natively.

---

## Decision 5: `globals.css` Dark Mode Activation for Tailwind v4

**Decision**: Change `@import "tailwindcss"` to `@import "tailwindcss" dark(media)` in globals.css.

**Rationale**:
- In Tailwind CSS v4, the `dark:` variant must be explicitly configured. The `dark(media)` modifier on the `@import` statement activates `@media (prefers-color-scheme: dark)` as the dark mode trigger for all `dark:` utility classes.
- This is the v4-canonical way to enable media-based dark mode.
- Without this, `dark:` utility classes are compiled but may not apply correctly.

**References**:
- Tailwind CSS v4 documentation: Dark mode configuration via CSS `@import "tailwindcss" dark(media)` or `@variant dark` directive.

---

## Conclusion

All unknowns resolved. No NEEDS CLARIFICATION items remain. The implementation is a purely additive styling change across 13 files:
- 1 global CSS file (`globals.css`)
- 12 component/page TSX files

No new dependencies, no API changes, no data model changes, no new components needed.
