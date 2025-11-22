# Contributing to Hidden Garden

This document outlines the contribution workflow and branching model for the Hidden Garden project.

## Branching Model

### Long-Lived Branches

- **`main`** - Integration branch where all work eventually lands. This is the stable, production-ready branch.
- **`team-a/core`** - Team A's integration branch for core logic work (Aztec/Noir circuits, quest interfaces, evaluation engine).
- **`team-b/game-ui`** - Team B's integration branch for UI/game layer work (frontend, validators, orchestration).

### Branch Naming Conventions

**Team A Feature Branches:**
```
feat/team-a/<short-description>
```

Examples:
- `feat/team-a/add-quest-validation-interface`
- `feat/team-a/update-tier-proof-circuit`
- `feat/team-a/fix-contract-abi`

**Team B Feature Branches:**
```
feat/team-b/<short-description>
```

Examples:
- `feat/team-b/implement-multiple-choice-validator`
- `feat/team-b/add-quest-progress-ui`
- `feat/team-b/fix-leaderboard-display`

### Rebase Strategy

1. **Long-Lived Branches:**
   - Each team regularly rebases their long-lived branch on top of `main`:
     ```bash
     git checkout team-a/core
     git rebase main
     # or
     git checkout team-b/game-ui
     git rebase main
     ```

2. **Feature Branches:**
   - Feature branches are created from their respective team branch:
     ```bash
     # Team A
     git checkout team-a/core
     git pull
     git checkout -b feat/team-a/my-feature
     
     # Team B
     git checkout team-b/game-ui
     git pull
     git checkout -b feat/team-b/my-feature
     ```
   - Feature branches should be rebased on their team branch before creating a PR:
     ```bash
     git checkout feat/team-a/my-feature
     git rebase team-a/core
     ```

### Pull Request (PR) Rules

#### Path-Based PR Targeting

**Changes to `packages/core-logic/**`:**
1. Create feature branch from `team-a/core`
2. Open PR targeting `team-a/core` (not `main` directly)
3. After review and approval, merge into `team-a/core`
4. Team A periodically merges `team-a/core` → `main` via small, reviewed PRs

**Changes to `apps/aztecbat-ui/**`:**
1. Create feature branch from `team-b/game-ui`
2. Open PR targeting `team-b/game-ui` (not `main` directly)
3. After review and approval, merge into `team-b/game-ui`
4. Team B periodically merges `team-b/game-ui` → `main` via small, reviewed PRs

**Changes to `packages/game-engine/**`:**
- Can be opened by either team
- Target the appropriate team branch based on who's making the change
- Requires review from both teams if it affects shared interfaces

#### PR Workflow Example

**Team A Example:**
```bash
# 1. Start from team branch
git checkout team-a/core
git pull

# 2. Create feature branch
git checkout -b feat/team-a/add-quest-type

# 3. Make changes, commit
git add packages/core-logic/src/quests/types.ts
git commit -m "feat(team-a): add new quest type to interface"

# 4. Rebase on team branch
git rebase team-a/core

# 5. Push and open PR targeting team-a/core
git push origin feat/team-a/add-quest-type
# Open PR: feat/team-a/add-quest-type → team-a/core
```

**Team B Example:**
```bash
# 1. Start from team branch
git checkout team-b/game-ui
git pull

# 2. Create feature branch
git checkout -b feat/team-b/implement-validator

# 3. Make changes, commit
git add packages/game-engine/src/validators/
git commit -m "feat(team-b): implement multiple choice validator"

# 4. Rebase on team branch
git rebase team-b/game-ui

# 5. Push and open PR targeting team-b/game-ui
git push origin feat/team-b/implement-validator
# Open PR: feat/team-b/implement-validator → team-b/game-ui
```

#### Merging Team Branches to Main

When ready to integrate team work into `main`:

1. **Team A merges `team-a/core` → `main`:**
   ```bash
   git checkout main
   git pull
   git merge team-a/core --no-ff
   # Or create PR: team-a/core → main
   ```

2. **Team B merges `team-b/game-ui` → `main`:**
   ```bash
   git checkout main
   git pull
   git merge team-b/game-ui --no-ff
   # Or create PR: team-b/game-ui → main
   ```

**Best Practices:**
- Keep team → main PRs small and focused
- Rebase team branch on `main` before creating PR
- Resolve conflicts in team branch, not in `main`
- Coordinate with other team if there are cross-team dependencies

## Code Ownership

See `.github/CODEOWNERS` for path-based code ownership rules. GitHub will automatically request reviews from code owners.

## Commit Message Conventions

Use conventional commit format with team prefix:

```
feat(team-a): add new quest validation interface
fix(team-b): correct validator scoring logic
docs: update team split documentation
refactor(team-a): simplify circuit logic
```

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd hidden-garden
   ```

2. **Set up your team branch:**
   ```bash
   # Team A
   git checkout team-a/core
   git pull
   
   # Team B
   git checkout team-b/game-ui
   git pull
   ```

3. **Create a feature branch:**
   ```bash
   git checkout -b feat/team-a/my-feature  # or feat/team-b/my-feature
   ```

4. **Make your changes and commit:**
   ```bash
   git add <files>
   git commit -m "feat(team-a): description"
   ```

5. **Rebase on your team branch:**
   ```bash
   git rebase team-a/core  # or team-b/game-ui
   ```

6. **Push and open PR:**
   ```bash
   git push origin feat/team-a/my-feature
   # Open PR targeting your team branch
   ```

## Questions?

- For Team A questions: @vrnvrn
- For Team B questions: @kosmostasis
- For general questions: Open an issue or discussion

