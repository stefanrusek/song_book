# Rule of Rules

This document establishes the hierarchy and enforcement levels for all rules in this project.

## Enforcement Levels

### 000-099: Critical Rules (Strict Enforcement)

Rules in this range **MUST** be strictly enforced at all times. These are non-negotiable foundational requirements that ensure project integrity, security, and stability. Violation of these rules is never acceptable.

### Other Rules: Standard Enforcement

Rules outside the 000-099 range should be enforced by default. However, it is **ONLY VERY RARELY** safe to deviate from these rules. Deviation should be assumed to require explicit permission unless there is clear, documented justification.

**Default assumption: Follow all rules unless explicitly granted permission to deviate.**

## Rule Ranges

Rules are organized into the following ranges:

### 000-099: Critical Rules
- Core principles and non-negotiable requirements
- Security and safety requirements
- Legal and licensing constraints
- Data integrity and privacy requirements

### 100-199: Code Quality Rules
- Code style and formatting standards
- Naming conventions
- Code organization patterns
- Comment and documentation requirements
- Language-specific best practices

### 200-299: Architecture Rules
- System design principles
- Component boundaries and responsibilities
- State management patterns
- Context and hooks usage
- Data flow architecture
- API design and implementation

### 300-399: Structure Rules
- File and directory organization
- Module and package structure
- Import/export conventions
- Asset organization
- Configuration file structure

### 400-499: Testing Rules
- Test coverage requirements
- Testing patterns and practices
- Test organization and naming
- Mock and fixture usage
- Integration vs unit test guidelines

### 500-599: Build and Deployment Rules
- Build configuration requirements
- Dependency management
- Version management
- Release and deployment processes
- Environment-specific configurations

### 600-699: Git and Version Control Rules
- Commit message standards
- Branch naming and workflow
- Pull request requirements
- Code review guidelines

### 700-799: Documentation Rules
- Code documentation standards
- Architecture documentation requirements
- API documentation
- README and setup documentation
- CLAUDE.md maintenance

### 800-899: Development Workflow Rules
- Development environment setup
- Local development practices
- Debugging practices
- Performance profiling
- Tooling requirements

### 900-999: Reserved for Future Use
- Available for project-specific extensions

## Rule Numbering Convention

Within each range, use the following pattern:
- X00-X09: Overview and general principles
- X10-X89: Specific rules
- X90-X99: Exceptions and edge cases

## Creating New Rules

When creating a new rule:
1. Determine the appropriate category and range
2. Choose the next available number in that range
3. Use descriptive filenames: `NNN-description.md`
4. Include clear rationale and examples
5. Reference related rules where applicable

## Modifying Rules

- Rules 000-099 require project-wide consensus to modify
- Other rules can be updated through standard PR process
- Rule modifications should be documented in git history
- Breaking changes to rules should be announced to the team
