# GitHub CLI (gh) Usage

## Tool Availability

The GitHub CLI tool (`gh`) is available and should be used to interact with GitHub for repository operations, data retrieval, and Pull Request management.

## Preferred Uses

Use `gh` instead of web browser interactions or manual API calls for:

### Pull Request Operations

```bash
# View PR details
gh pr view <number>
gh pr view <url>

# List PRs
gh pr list
gh pr list --state open
gh pr list --author <username>

# Create a PR
gh pr create --title "Title" --body "Description"
gh pr create --title "Title" --body "Description" --base main --head feature-branch

# Create PR with body from file or heredoc
gh pr create --title "feat(pages): add song search" --body "$(cat <<'EOF'
## Summary
- Add search functionality for songs
- Include filters for book and chapter
- Implement debounced search input

## Test plan
- [ ] Test search with various queries
- [ ] Verify filters work correctly
- [ ] Check mobile responsiveness

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"

# Check PR status
gh pr status

# View PR checks
gh pr checks <number>

# View PR diff
gh pr diff <number>

# Merge a PR
gh pr merge <number>

# Close a PR
gh pr close <number>

# Reopen a PR
gh pr reopen <number>
```

### Issue Operations

```bash
# View issue details
gh issue view <number>

# List issues
gh issue list
gh issue list --label bug
gh issue list --assignee @me

# Create an issue
gh issue create --title "Title" --body "Description"

# Close an issue
gh issue close <number>

# Add comment to issue
gh issue comment <number> --body "Comment text"
```

### Repository Information

```bash
# View repository details
gh repo view

# View repo in browser
gh repo view --web

# Clone repository
gh repo clone <owner>/<repo>

# Fork repository
gh repo fork <owner>/<repo>
```

### Workflow/Actions

```bash
# List workflow runs
gh run list

# View workflow run details
gh run view <run-id>

# View workflow run logs
gh run view <run-id> --log

# Re-run a workflow
gh run rerun <run-id>

# Watch a workflow run
gh run watch <run-id>
```

### API Access

Use `gh api` for direct GitHub API access:

```bash
# Fetch PR comments
gh api repos/{owner}/{repo}/pulls/{number}/comments

# Fetch PR reviews
gh api repos/{owner}/{repo}/pulls/{number}/reviews

# Fetch specific issue data
gh api repos/{owner}/{repo}/issues/{number}

# List releases
gh api repos/{owner}/{repo}/releases
```

## Integration with Git Workflow

When working with branches and PRs (per rule 610-git-workflow.md):

1. **Create feature branch** (git)
   ```bash
   git checkout -b feature/description
   ```

2. **Make commits** (git)
   ```bash
   git add .
   git commit -m "feat: description"
   ```

3. **Push branch** (git)
   ```bash
   git push -u origin feature/description
   ```

4. **Create PR** (gh)
   ```bash
   gh pr create --title "feat: add feature" --body "Description of changes"
   ```

5. **Check PR status** (gh)
   ```bash
   gh pr status
   gh pr checks
   ```

6. **Merge PR** (gh)
   ```bash
   gh pr merge --squash  # or --merge or --rebase
   ```

## When Viewing GitHub URLs

If the user provides a GitHub URL (e.g., PR link, issue link), use `gh` to fetch the data instead of attempting to use WebFetch:

**DO:**
```bash
# User provides: https://github.com/owner/repo/pull/123
gh pr view https://github.com/owner/repo/pull/123

# Or just the number if in the same repo
gh pr view 123
```

**DON'T:**
```bash
# Avoid WebFetch for GitHub URLs - use gh instead
WebFetch(url: "https://github.com/owner/repo/pull/123")
```

## Authentication

The `gh` tool handles GitHub authentication automatically. If authentication is required and not configured, `gh` will prompt for it or provide instructions.

## Output Formats

`gh` supports multiple output formats for scripting:

```bash
# JSON output for parsing
gh pr list --json number,title,state,author

# Template output for custom formatting
gh pr list --json number,title --template '{{range .}}{{.number}}: {{.title}}{{"\n"}}{{end}}'

# Human-readable output (default)
gh pr list
```

## Best Practices

### DO:
- Use `gh` for all GitHub interactions when possible
- Leverage `--json` flag for structured data
- Use `gh api` for advanced GitHub API needs
- Check `gh pr status` regularly when working on PRs
- Use `gh pr checks` to verify CI status before requesting review

### DON'T:
- Parse human-readable output - use `--json` instead
- Bypass `gh` for operations it supports
- Hardcode repository details - let `gh` infer from git context
- Ignore failed checks when creating PRs

## Examples

### Creating a PR from task completion:
```bash
# After implementing a feature in a branch
git push -u origin feature/song-search

# Create PR with detailed body
gh pr create --title "feat(pages): add song search functionality" --body "$(cat <<'EOF'
## Summary
- Add search page with query input
- Implement fuzzy search across song titles
- Add filters for book and chapter
- Include keyboard navigation support

## Test plan
- [x] Unit tests pass
- [x] Manual testing on desktop
- [x] Manual testing on mobile
- [x] Verified search performance with large dataset

Closes #42

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

### Checking PR before requesting review:
```bash
# View PR details
gh pr view

# Check CI status
gh pr checks

# View diff to confirm changes
gh pr diff
```

### Fetching PR data for analysis:
```bash
# Get PR data as JSON
gh pr view 123 --json number,title,body,state,author,reviews,comments

# Get PR comments
gh api repos/owner/repo/pulls/123/comments
```

## Rationale

- **Efficiency**: `gh` provides quick access to GitHub data without leaving terminal
- **Authentication**: Handles GitHub auth automatically
- **Consistency**: Standardizes GitHub interactions across the project
- **Automation**: Enables scripting of GitHub operations
- **Integration**: Works seamlessly with git workflow
- **API Access**: Provides direct access to GitHub API with proper authentication
