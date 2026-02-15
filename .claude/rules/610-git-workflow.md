# Git Workflow and Commit Standards

## Branch Protection

**Never commit directly to the `main` branch.** All work must be done in feature branches and merged via Pull Requests.

### Workflow:
1. Create a feature branch from `main`
2. Make changes and commits on the feature branch
3. Push the feature branch to remote
4. Create a Pull Request for review
5. Merge to `main` only after PR approval

### Branch Naming:
Use descriptive branch names that indicate the type of work:
- `feature/description` - New features
- `fix/description` - Bug fixes
- `refactor/description` - Code refactoring
- `docs/description` - Documentation updates
- `test/description` - Test additions or fixes

Example: `feature/song-search`, `fix/navigation-crash`

## Commit Message Format

All commits **MUST** follow the [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types:
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring without changing functionality
- `docs`: Documentation changes
- `test`: Adding or updating tests
- `chore`: Maintenance tasks, dependency updates
- `style`: Code style changes (formatting, no logic changes)
- `perf`: Performance improvements
- `ci`: CI/CD configuration changes
- `build`: Build system or dependency changes

### Scope:
Optional but recommended. Indicates the area of change:
- `pages`: Page components and routing
- `components`: React components
- `api`: API routes and backend logic
- `lib`: Library and utility code
- `hooks`: Custom React hooks
- `styles`: CSS/styling files
- `config`: Configuration files
- `db`: Database schema and queries
- `auth`: Authentication logic
- `types`: TypeScript type definitions

### Examples:
```
feat(pages): add song detail page
fix(api): correct verse offset calculation
refactor(components): simplify navigation component
docs(claude): update architecture documentation
test(lib): add tokenizer edge case tests
chore(deps): update next to 14.2.0
```

### Breaking Changes:
For breaking changes, add `!` after the type/scope or include `BREAKING CHANGE:` in the footer:
```
feat(api)!: change verse endpoint to use query parameters

BREAKING CHANGE: /api/verses now requires query params instead of path params
```

## Commit Frequency

### Task-Based Development

When working from a task list, **commit after completing each distinct phase or task**. This creates a clear history of incremental progress.

Example task workflow:
1. Complete Task 1: Add data model → Commit
2. Complete Task 2: Add API endpoint → Commit
3. Complete Task 3: Add UI component → Commit
4. Complete Task 4: Add tests → Commit

**DO NOT** wait to commit everything at once. Frequent, focused commits are preferred.

### Speckit Workflow

When using speckit (specification-driven development), **commit after each phase**:

1. **After Specify Phase** - Commit specifications/requirements
   ```
   docs(spec): add verse navigation feature specification
   ```

2. **After Plan Phase** - Commit the implementation plan
   ```
   docs(spec): add implementation plan for verse navigation
   ```

3. **After Tasks Phase** - Commit task breakdown
   ```
   docs(spec): add task breakdown for verse navigation
   ```

4. **After Implementation** - Commit implementation work following the tasks
   ```
   feat(pages): implement verse navigation controls
   ```

This creates a clear audit trail from specification through completion.

## Commit Best Practices

### DO:
- Write clear, concise commit messages
- Commit logical units of work
- Commit frequently during development
- Keep commits focused on a single concern
- Include context in the commit body when needed
- Reference issue numbers when applicable

### DON'T:
- Commit unrelated changes together
- Use vague messages like "fix stuff" or "updates"
- Commit broken code (code should compile/pass tests)
- Commit sensitive information (credentials, keys)
- Commit large binary files unless necessary
- Force push to shared branches without coordination

## Pull Request Guidelines

When creating a PR:
- Use a descriptive title following conventional commit format
- Provide a clear description of changes
- Reference related issues or tasks
- Ensure CI checks pass before requesting review
- Keep PRs focused and reasonably sized
- Respond to review feedback promptly

## Rationale

- **Branch protection** prevents accidental commits to main and ensures code review
- **Conventional commits** enable automated changelog generation and semantic versioning
- **Frequent commits** create clear history and make code review easier
- **Phased commits** document the development process and decision-making
- **Focused commits** make it easier to find, understand, and revert changes if needed
