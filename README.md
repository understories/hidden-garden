# 🌱 Hidden Garden

> A privacy-preserving skill tree and leaderboard built with Aztec Protocol. Learn, prove, and selectively reveal your skills while maintaining full privacy control.

[![TypeScript](https://img.shields.io/badge/TypeScript-77.6%25-blue)](https://www.typescriptlang.org/)
[![Noir](https://img.shields.io/badge/Noir-13.0%25-orange)](https://noir-lang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)

## ✨ Features

- 🔒 **Privacy-First**: Store your learning progress privately in Aztec Protocol
- 🎯 **Selective Disclosure**: Choose what skills to reveal publicly using zero-knowledge proofs
- 🌳 **Skill Forest**: Interactive visualization of skills clustered by privacy preferences
- 📊 **Leaderboards**: Public leaderboards for skills you choose to reveal
- 🎮 **Quest System**: Complete quests and prove your knowledge privately
- 🎨 **White-Hat UX**: Empowering, non-manipulative design focused on growth and mastery
- 🌙 **Dark Mode**: Full dark mode support with smooth transitions

## 🏗️ Architecture

Hidden Garden is a monorepo built with a clear separation of concerns:

```
hidden-garden/
├── packages/
│   ├── core-logic/          # Aztec/Noir circuits, quest interfaces, core logic
│   ├── game-engine/         # Quest registry, validators, orchestration
│   ├── contracts-public/    # Solidity contracts (SkillLeaderboard, SelfHumanSBT)
│   └── common/              # Shared utilities (legacy, being phased out)
│
├── apps/
│   └── aztecbat-ui/         # Next.js frontend application
│
├── services/
│   └── indexer/             # Indexing service for on-chain data
│
└── docs/                    # Comprehensive documentation
```

### Tech Stack

**Frontend:**
- [Next.js 16](https://nextjs.org/) - React framework
- [React 19](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Wagmi](https://wagmi.sh/) & [Viem](https://viem.sh/) - Ethereum integration

**Backend & Smart Contracts:**
- [Aztec Protocol](https://aztec.network/) - Private smart contracts
- [Noir](https://noir-lang.org/) - Zero-knowledge proof circuits
- [Solidity](https://soliditylang.org/) - Public smart contracts
- [Hardhat](https://hardhat.org/) - Development environment

**Infrastructure:**
- [pnpm](https://pnpm.io/) - Package manager
- [Turborepo](https://turbo.build/) - Monorepo build system
- [Vercel](https://vercel.com/) - Deployment platform

## 🚀 Getting Started

### Prerequisites

- **Node.js 20+** (required for Next.js 16)
- **pnpm 10.23.0+** (package manager)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/understories/hidden-garden.git
   cd hidden-garden
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Start the development server:**
   ```bash
   pnpm dev:web
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

```bash
# Development
pnpm dev:web              # Start Next.js dev server
pnpm dev:indexer          # Start indexer service
pnpm dev:playground       # Start contract playground

# Building
pnpm build                # Build all packages
pnpm build --filter @hidden-garden/aztecbat-ui  # Build UI only

# Testing
pnpm test                 # Run all tests
pnpm aztec:test           # Run Aztec circuit tests

# Aztec Development
pnpm aztec:devnet         # Start Aztec devnet
pnpm aztec:compile        # Compile Aztec circuits
```

For more detailed setup instructions, see [LOCAL_SETUP.md](./LOCAL_SETUP.md).

## 📖 Documentation

Comprehensive documentation is available in the [`docs/`](./docs/) directory:

- **[Architecture](./docs/ARCHITECTURE.md)** - System architecture and package structure
- **[Core Flow](./docs/CORE_FLOW.md)** - End-to-end user flow and ZK proof generation
- **[Route Structure](./docs/ROUTE_STRUCTURE.md)** - Application routes and navigation
- **[White-Hat UX Guide](./docs/WHITE_HAT_UX_GUIDE.md)** - UX principles and implementation
- **[Aztec Integration](./docs/aztec-integration.md)** - Aztec Protocol integration details
- **[Self Integration](./docs/self-integration.md)** - Human verification integration
- **[Vercel Deployment](./docs/VERCEL_DEPLOYMENT_CHECKLIST.md)** - Deployment guide

## 🎨 Design Philosophy

Hidden Garden follows **White-Hat Octalysis** principles:

- ✅ **Empowerment**: Users control what to reveal
- ✅ **Transparency**: Clear rules and scoring
- ✅ **Growth Focus**: Emphasis on progress, not just rank
- ✅ **No Dark Patterns**: No urgency, fear, or manipulation
- ✅ **Meaningful**: Skills represent real competence, not brand worship

Learn more in [WHITE_HAT_OCTALYSIS_REFERENCE.md](./docs/WHITE_HAT_OCTALYSIS_REFERENCE.md).

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details on:

- Branching model and workflow
- Code ownership and review process
- Commit message conventions
- Team collaboration guidelines

### Quick Start for Contributors

1. Fork the repository
2. Check out the appropriate team branch:
   - `team-a/core` for core logic work
   - `team-b/game-ui` for UI/frontend work
3. Create a feature branch: `feat/team-a/your-feature` or `feat/team-b/your-feature`
4. Make your changes and commit
5. Open a pull request targeting your team branch

## 📁 Project Structure

```
hidden-garden/
├── apps/
│   └── aztecbat-ui/          # Next.js frontend application
│       ├── app/              # Next.js App Router pages
│       ├── components/       # React components
│       └── lib/              # Utility functions
│
├── packages/
│   ├── core-logic/           # Core Aztec/Noir logic
│   │   ├── src/quests/       # Quest definitions and hashing
│   │   └── src/main.nr       # Aztec Noir circuit
│   ├── game-engine/          # Quest registry and validators
│   └── contracts-public/    # Solidity smart contracts
│
├── services/
│   └── indexer/              # On-chain data indexing service
│
└── docs/                     # Documentation
```

## 🔐 Privacy & Security

- **Private State**: Learning progress stored privately in Aztec Protocol
- **Zero-Knowledge Proofs**: Prove skill levels without revealing details
- **Selective Disclosure**: Choose exactly what to reveal publicly
- **No Data Leakage**: Private quest completions never exposed

## 🌐 Deployment

The application can be deployed to Vercel. See [VERCEL_DEPLOYMENT_CHECKLIST.md](./docs/VERCEL_DEPLOYMENT_CHECKLIST.md) for detailed deployment instructions.

## 📊 Repository Stats

- **Languages**: TypeScript (77.6%), Noir (13.0%), Solidity (3.7%), JavaScript (2.7%)
- **Commits**: 288+ commits
- **Contributors**: 2+ contributors

## 🔗 Links

- **Repository**: [https://github.com/understories/hidden-garden](https://github.com/understories/hidden-garden)
- **Aztec Protocol**: [https://aztec.network](https://aztec.network)
- **Noir Language**: [https://noir-lang.org](https://noir-lang.org)

## 🙏 Acknowledgments

- Built with [Aztec Protocol](https://aztec.network/) for private smart contracts
- Uses [Noir](https://noir-lang.org/) for zero-knowledge proof circuits
- Inspired by White-Hat Octalysis design principles

---

**Made with 🌱 by the Hidden Garden team**

For questions or support, please open an [issue](https://github.com/understories/hidden-garden/issues).
