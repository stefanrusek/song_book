# pnpm Package Manager Requirement

## Critical Requirement: pnpm Only

**This project uses pnpm 10+ exclusively. npm and yarn are forbidden - never use them.**

Using npm or yarn causes:
- Dependency resolution issues (phantom dependencies, duplicate installs)
- Incompatible lock file formats
- Disk space waste (npm/yarn duplicate entire dependency trees)
- Slower installation times
- Monorepo workspace issues (pnpm workspaces are superior)
- CI/CD pipeline failures
- Development environment inconsistencies

This rule eliminates these problems by enforcing pnpm exclusively.

## Required Package Manager

- **pnpm**: 10.x or greater (latest stable 10.x)
- **npm**: Forbidden (never use)
- **yarn**: Forbidden (never use)

## Lock Files

**Only committed lock file:**
- `pnpm-lock.yaml` - Always commit this
- DO NOT commit: `package-lock.json` (npm)
- DO NOT commit: `yarn.lock` (yarn)

## Installation

### First Time Setup

If pnpm is not installed, install it globally:

```bash
# Using npm (only time npm is allowed)
npm install -g pnpm@10

# Or using Homebrew (macOS)
brew install pnpm

# Or using other package managers
# See: https://pnpm.io/installation

# Verify installation
pnpm --version  # Should output 10.x.x or higher
```

### After Installation

```bash
# Enable corepack (modern Node.js package management)
corepack enable

# Verify pnpm is ready
pnpm --version
```

## Common Commands

### Installation and Dependency Management

**Never use:**
```bash
npm install              # ❌ FORBIDDEN
npm install package      # ❌ FORBIDDEN
npm install --save       # ❌ FORBIDDEN
npm install --save-dev   # ❌ FORBIDDEN

yarn install             # ❌ FORBIDDEN
yarn add package         # ❌ FORBIDDEN
```

**Always use:**
```bash
# Install all dependencies
pnpm install

# Add production dependency
pnpm add package-name

# Add development dependency
pnpm add -D package-name

# Remove dependency
pnpm remove package-name

# Update dependencies
pnpm update

# List installed packages
pnpm list
```

### Running Scripts

**Never use:**
```bash
npm test                 # ❌ FORBIDDEN
npm run build            # ❌ FORBIDDEN
npm run dev              # ❌ FORBIDDEN

yarn test                # ❌ FORBIDDEN
yarn build               # ❌ FORBIDDEN
yarn dev                 # ❌ FORBIDDEN
```

**Always use:**
```bash
# Run test script
pnpm test

# Run build script (no 'run' keyword for common scripts)
pnpm build

# Run dev script
pnpm dev

# Run any custom script
pnpm run custom-script

# List all available scripts
pnpm run
```

### Workspace Commands (Monorepo)

```bash
# Install dependencies in all packages
pnpm install

# Run test in all packages
pnpm -r test

# Run test in specific package
pnpm -w @songbook/web test

# Add dependency to specific package
pnpm add -D --filter @songbook/web package-name

# Add internal dependency (workspace protocol)
pnpm add -D --filter @songbook/web @songbook/shared

# Build all packages
pnpm -r build
```

## package.json Scripts

All scripts in `package.json` MUST use pnpm:

**DO:**
```json
{
  "scripts": {
    "install": "pnpm install",
    "test": "pnpm test",
    "build": "pnpm build",
    "dev": "pnpm dev",
    "lint": "pnpm lint",
    "coverage": "pnpm coverage"
  }
}
```

**DON'T:**
```json
{
  "scripts": {
    "install": "npm install",     // ❌ npm
    "test": "npm test",           // ❌ npm
    "build": "npm run build",     // ❌ npm
    "install": "yarn install",    // ❌ yarn
    "test": "yarn test"           // ❌ yarn
  }
}
```

## CI/CD Pipeline Integration

### GitHub Actions

**DO:**
```yaml
name: CI
on: [pull_request, push]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 24

      # Setup pnpm
      - uses: pnpm/action-setup@v2
        with:
          version: 10

      # Install dependencies with pnpm
      - run: pnpm install

      # Run tests with pnpm
      - run: pnpm test
      - run: pnpm lint
      - run: pnpm coverage
```

**DON'T:**
```yaml
# ❌ WRONG - using npm or yarn
- run: npm install
- run: npm test

# ❌ WRONG - using yarn
- run: yarn install
- run: yarn test
```

### Docker

**DO:**
```dockerfile
FROM node:24

WORKDIR /app

# Copy pnpm lock file
COPY pnpm-lock.yaml .
COPY package.json .

# Install pnpm
RUN npm install -g pnpm@10

# Install dependencies with pnpm
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# Run with pnpm
CMD ["pnpm", "dev"]
```

**DON'T:**
```dockerfile
# ❌ WRONG - using npm or yarn
RUN npm install
RUN yarn install
```

### GitLab CI

**DO:**
```yaml
image: node:24

stages:
  - test

test:
  stage: test
  before_script:
    - npm install -g pnpm@10
    - pnpm install
  script:
    - pnpm test
    - pnpm lint
    - pnpm coverage
```

## Pre-Commit Quality Gates

Before any commit, quality gates use pnpm:

```bash
# Using nvm
nvm use
pnpm test && pnpm lint && pnpm coverage

# Or using Docker
docker run --rm -v "$(pwd):/app" -w /app node:24 \
  sh -c "pnpm install && pnpm test && pnpm lint && pnpm coverage"
```

See Rule 410 (Testing and Pre-Commit Quality Gates) and Rule 510 (Node.js Version Management).

## Monorepo Structure with pnpm

This project uses pnpm workspaces for monorepo management:

```
packages/
├── web/              # Main Next.js application
├── shared/           # Shared code across packages
└── [future-packages]/

pnpm-workspace.yaml   # pnpm workspace configuration
```

### pnpm-workspace.yaml

```yaml
packages:
  - 'packages/*'
```

### Workspace Features

pnpm workspaces provide:
- **Efficient dependency management** - shared dependencies installed once at root
- **Phantom dependency prevention** - strict dependency resolution
- **Workspace protocol** - reference internal packages with `workspace:*`
- **Atomic operations** - install/update all packages consistently
- **Disk efficiency** - hard-linked dependencies (content-addressable storage)

### Adding Dependencies to Packages

```bash
# Add to specific package
pnpm add lodash --filter @songbook/web

# Add to all packages
pnpm add -r lodash

# Add development dependency
pnpm add -D -r jest

# Reference another workspace package
pnpm add @songbook/shared --filter @songbook/web
```

## Troubleshooting

### "command not found: pnpm"

pnpm is not installed. Install it:

```bash
npm install -g pnpm@10
# or
brew install pnpm
```

Then verify:
```bash
pnpm --version
```

### "npm command not found"

Good! npm should not be used directly in this project except for initially installing pnpm.

If you need npm for something, that's a sign the workflow is wrong. Use `pnpm` instead.

### Lock File Conflicts

If you see merge conflicts in `pnpm-lock.yaml`:

```bash
# Never edit lock files manually
# Regenerate the lock file:
pnpm install
```

Then commit the updated `pnpm-lock.yaml`.

### "Can't find pnpm in PATH"

If pnpm works locally but fails in CI/CD:

1. Verify `pnpm/action-setup@v2` is used in GitHub Actions
2. Verify `npm install -g pnpm@10` is in Docker/GitLab CI before_script
3. Verify Node.js is installed before pnpm

### Wrong pnpm Version

```bash
# Check version
pnpm --version

# If version is not 10.x, update:
npm install -g pnpm@10
# or
brew upgrade pnpm
```

### "npm ERR" or "yarn error"

If you see errors from npm or yarn:

1. Check you didn't run `npm install` or `yarn install` by mistake
2. Check CI/CD configuration doesn't use npm/yarn
3. Check `package.json` scripts don't call npm/yarn
4. Run quality gates with correct tools: `pnpm test && pnpm lint && pnpm coverage`

## Enforcement

### Local Development

- All developers MUST use pnpm for all package operations
- Running `npm install` or `yarn install` is a violation of this rule
- If you see `package-lock.json` or `yarn.lock`, delete them immediately

### Code Review

Pull request reviewers MUST verify:
- No `npm install` or `yarn install` commands in scripts
- No `package-lock.json` or `yarn.lock` files committed
- All dependency changes use pnpm commands
- CI/CD uses pnpm exclusively

### Pre-Commit Hooks (Optional)

To prevent accidental npm/yarn usage, add to `.husky/pre-commit`:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Prevent npm/yarn from being run
if git diff --cached --name-only | grep -E "package-lock\.json|yarn\.lock"; then
  echo "❌ Error: npm or yarn lock files detected"
  echo "❌ This project uses pnpm exclusively"
  echo ""
  echo "To fix:"
  echo "  1. Run: git rm package-lock.json yarn.lock"
  echo "  2. Run: pnpm install"
  echo "  3. Commit pnpm-lock.yaml instead"
  exit 1
fi

# Run quality gates with pnpm
nvm use 2>/dev/null || true
pnpm test && pnpm lint && pnpm coverage
```

## Rationale

- **pnpm efficiency** - Content-addressable storage saves disk space and installation time
- **Strict dependency resolution** - pnpm prevents phantom dependencies that cause unexpected behavior
- **Monorepo support** - pnpm workspaces are designed for monorepos with atomic operations
- **Consistency** - All developers use identical package management
- **Reproducibility** - pnpm-lock.yaml ensures exact dependency versions across environments
- **Modern standard** - pnpm is the modern replacement for npm with superior performance and correctness
- **Yarn deprecation** - Yarn is being phased out; pnpm is the future

## Related Rules

- **Rule 410-testing-and-quality-gates**: Pre-commit quality gates use pnpm commands
- **Rule 510-node-version-management**: Node.js 24 required to run pnpm
- **Rule 520-pnpm-package-manager**: This file - pnpm 10+ exclusive requirement
- **Rule 610-git-workflow**: Commit guidelines (no package-lock.json or yarn.lock)
- **Constitution - Monorepo and Package Management**: pnpm 10+ and workspace requirements
- **Constitution - Technology Constraints**: pnpm 10+ and monorepo structure
