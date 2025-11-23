# Architecture Overview

## Package Structure

```
hidden-garden/
├── packages/
│   ├── core-logic/          # Team A: Core Aztec/Noir logic, quest interfaces
│   ├── game-engine/         # Shared: Quest registry, validators, orchestration
│   ├── contracts-public/    # Team A: Solidity contracts
│   └── common/              # Legacy (being phased out)
│
├── apps/
│   └── aztecbat-ui/         # Team B: Frontend application
│
├── zk/
│   └── private_skill_tree/  # Legacy (moved to packages/core-logic)
│
└── docs/
    ├── team_split_and_ownership.md  # Ownership definitions
    ├── teamA_phase2_phase3_summary.md  # Team A handoff
    ├── WHITE_HAT_OCTALYSIS_REFERENCE.md  # UX design principles
    └── WHITE_HAT_UX_GUIDE.md  # Implementation guide for UI components
```

## Package Dependencies

```
apps/aztecbat-ui
  └── @hidden-garden/game-engine
       └── @hidden-garden/core-logic
```

**Rule:** Dependencies only flow downward. Team B packages can depend on Team A packages, but never the reverse.

## Migration Status

- ✅ `packages/core-logic/` - Created, Team A files moved
- ✅ `packages/game-engine/` - Created, quest registry moved
- ✅ `apps/aztecbat-ui/` - Renamed from `apps/web/`, imports updated
- ⚠️ `packages/common/` - Legacy package, being phased out
- ⚠️ `zk/private_skill_tree/` - Legacy location, moved to `packages/core-logic/`

## Next Steps

1. Update remaining imports from `@hidden-garden/common` to new packages
2. Deprecate `packages/common/` package
3. Remove `zk/private_skill_tree/` (already copied to core-logic)

