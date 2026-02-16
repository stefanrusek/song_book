# Node.js Version Management

## Critical Requirement: Node 24 Only

**This project requires Node.js 24.x. Never assume the node in PATH is correct - always use nvm or Docker.**

Node.js version mismatches cause:
- Incompatible dependency installations
- Silent failures with cryptic error messages
- Breaking changes in built-in modules
- Inconsistent behavior across development environments
- Production deployment failures

This rule eliminates these problems by enforcing explicit version management.

## Required Node.js Version

- **Node.js**: 24.x (latest 24.x stable)
- **npm** (bundled with Node): Managed by Node.js
- **pnpm**: Installed globally or via corepack (see Package Manager section)

## Never Trust Node in PATH

**DO NOT** assume that typing `node` or `npm` will use the correct version.

**WRONG:**
```bash
# ❌ This might use Node 18, 20, 22, or 24 - you don't know
node --version
npm test
pnpm install
```

**RIGHT:**
```bash
# ✅ Explicitly use nvm to ensure Node 24
nvm use
nvm exec node --version
nvm run 24 npm test
```

### Why This Matters

Your development environment might have:
- Multiple Node versions installed
- A system Node.js from Homebrew, apt, or similar
- A different Node in an IDE or Docker container
- A version set by a previous project's `.nvmrc`

Without explicit version management, any command might use the wrong version silently.

## Development Workflow: nvm

### Installation

If you don't have nvm installed, follow the [official nvm installation guide](https://github.com/nvm-sh/nvm):

```bash
# macOS / Linux
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload shell configuration
source ~/.bashrc  # or ~/.zshrc
```

### `.nvmrc` File

This repository includes a `.nvmrc` file at the root that specifies Node 24:

```
24
```

If `.nvmrc` is missing, create it:
```bash
echo "24" > .nvmrc
```

### Common nvm Commands

**Check Node version before running anything:**
```bash
nvm use
node --version  # Should output v24.x.x
```

**Run npm/pnpm commands with correct Node:**
```bash
# Method 1: Set shell environment, then run commands
nvm use
pnpm test
pnpm lint

# Method 2: Run specific command with correct Node
nvm exec pnpm test

# Method 3: Run Node 24 explicitly
nvm run 24 pnpm test
```

**Install dependencies:**
```bash
nvm use
pnpm install
```

**Start development server:**
```bash
nvm use
pnpm dev
```

**Run tests:**
```bash
nvm use
pnpm test
```

### Shell Integration

**Add to your shell configuration** (`~/.bashrc`, `~/.zshrc`, or similar):

```bash
# Automatically use correct Node version when entering directory
if [[ -f .nvmrc ]]; then
  nvm use
fi
```

Or use the [automatic nvm switching](https://github.com/nvm-sh/nvm#calling-nvm-use-automatically-in-a-directory-with-a-nvmrc-file) feature:

```bash
# Add to ~/.bashrc or ~/.zshrc
load-nvmrc() {
  local node_version="$(cat .nvmrc 2> /dev/null)"
  local nvmrc_path="$(nvm_find_nvmrc)"

  if [[ -n "$nvmrc_path" ]]; then
    local dir="$(dirname "$nvmrc_path")"
    ( cd "$dir" && nvm use --silent )
  elif [[ -n "$node_version" ]]; then
    echo "Found .nvmrc with version <$node_version>"
    nvm use "$node_version"
  fi
}

# Load on cd
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# Call load-nvmrc() on cd (add to end of ~/.bashrc or ~/.zshrc)
cd() { builtin cd "$@"; load-nvmrc; }
```

## Docker Workflow: docker run

If you prefer Docker or don't have nvm installed, use Docker instead.

### Docker Command Pattern

**DO NOT** run node commands directly - always specify Node 24:

```bash
# ❌ WRONG - uses whatever node is in PATH
node script.js

# ✅ RIGHT - uses Docker with Node 24
docker run --rm -v "$(pwd):/app" -w /app node:24 node script.js
```

### Common Docker Commands

**Run pnpm commands:**
```bash
# Install dependencies
docker run --rm -v "$(pwd):/app" -w /app node:24 pnpm install

# Run tests
docker run --rm -v "$(pwd):/app" -w /app node:24 pnpm test

# Run linting
docker run --rm -v "$(pwd):/app" -w /app node:24 pnpm lint

# Development server (with port mapping)
docker run --rm -p 3000:3000 -v "$(pwd):/app" -w /app node:24 pnpm dev
```

### Docker Compose (Optional)

For convenience, create a `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    image: node:24
    working_dir: /app
    volumes:
      - .:/app
    ports:
      - "3000:3000"
    command: pnpm install && pnpm dev
```

Then run:
```bash
docker-compose up
```

### Pre-Commit with Docker

For CI/CD or shared environments, use Docker in the pre-commit quality gates:

```bash
docker run --rm -v "$(pwd):/app" -w /app node:24 \
  sh -c "pnpm install && pnpm test && pnpm lint && pnpm coverage"
```

## CI/CD Pipeline Integration

### GitHub Actions Example

```yaml
name: Quality Gates
on: [pull_request, push]

jobs:
  quality:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [24]  # Always Node 24
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}

      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 10

      - name: Install dependencies
        run: pnpm install

      - name: Run linting
        run: pnpm lint

      - name: Run tests
        run: pnpm test

      - name: Check coverage
        run: pnpm coverage
```

### Docker in CI/CD

If using Docker in CI/CD:

```yaml
# GitLab CI example
default:
  image: node:24

stages:
  - test

quality_gates:
  stage: test
  script:
    - pnpm install
    - pnpm test
    - pnpm lint
    - pnpm coverage
```

## Troubleshooting

### "Command not found: nvm"

nvm is not installed. Install it following the [official guide](https://github.com/nvm-sh/nvm#installing-and-updating).

### "nvm: command not found" in new terminal

Your shell hasn't loaded the nvm initialization script. Add this to `~/.bashrc` or `~/.zshrc`:

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
```

### "node version does not match .nvmrc"

Run `nvm use` to switch to the correct version:

```bash
nvm use
node --version  # Should now match .nvmrc
```

### Version mismatch in IDE

Configure your IDE to use nvm's Node:

**VS Code (.vscode/settings.json):**
```json
{
  "nodejs.path": "/Users/[username]/.nvm/versions/node/v24.0.0/bin/node"
}
```

Or use the [VSCode Node Version Switcher](https://marketplace.visualstudio.com/items?itemName=panayotis.vscode-nvm).

**WebStorm:**
- Settings → Languages & Frameworks → Node.js
- Set Node interpreter to nvm's Node 24 installation

## Development Checklist

Before starting development:

- [ ] Run `nvm use` or verify Docker is configured
- [ ] Verify `node --version` shows v24.x.x
- [ ] Run `pnpm install` to install dependencies
- [ ] Run `pnpm test && pnpm lint && pnpm coverage` to verify setup
- [ ] Commit all code must pass quality gates (Principle VII)

## Enforcement

- **Local development**: Use nvm or Docker before running any commands
- **CI/CD**: GitHub Actions and other pipelines enforce Node 24 via `setup-node` or Docker image
- **Code reviews**: Verify CI/CD shows all checks passing with Node 24
- **Deployment**: Production deployments use Node 24 (Docker image or nvm in deployment scripts)

## Rationale

- **Single version eliminates surprises** - everyone develops with exactly the same Node version
- **nvm eliminates PATH issues** - explicit version selection prevents silent failures
- **Docker provides isolation** - containerization ensures consistency across machines
- **Reproducibility** - bugs that occur only with specific versions are caught immediately
- **CI/CD alignment** - local environment matches CI/CD environment exactly
- **Early detection** - version mismatches are caught during development, not in production

## Related Rules

- **Rule 410-testing-and-quality-gates**: Pre-commit quality gates must run with correct Node
- **Rule 200-nextjs-react-architecture**: Next.js 16+ requires Node 24
- **Constitution - Monorepo and Package Management**: pnpm requires compatible Node version
