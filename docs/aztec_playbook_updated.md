Aztec Integration Playbook UPDATED
Aligning Hidden Garden with aztec-starter and the Noir ecosystem
Last updated: 2025-11-23
This document is for Cursor to reconcile our backend/UI code with the official Aztec starter patterns, the Noir learning ecosystem, and the hackathon-ready devnet setup.
It lists the required fixes, discrepancies, and step-by-step implementation tasks.
1. Goals
Make Hidden Garden’s Aztec integration align with supported patterns from:
https://github.com/AztecProtocol/aztec-starter
https://github.com/noir-lang/awesome-noir
Ensure:
Stable local sandbox and devnet experience
Clean ENV-based configuration
Proper wallet creation, fee handling, and proof extraction
Consistent UI/backend PXE connectivity
Integration points for Aztecbat curriculum
Cursor should use this document as the canonical reference when updating the backend and frontend code.
2. Required Runtime Environment
2.1 Node Version (critical)
The Aztec starter requires:
Node.js v22.15.0
Tasks for Cursor:
Add .nvmrc file:
22.15.0
Update documentation & scripts to use:
nvm use
Ensure that any Node-based Aztec tooling expects Node ≥22.
2.2 CLI Installation Pattern (official)
Aztec starter uses:
bash -i <(curl -s https://install.aztec.network)
and then pins the version:
export VERSION=3.0.0-devnet.5
aztec-up && docker pull aztecprotocol/aztec:$VERSION && docker tag aztecprotocol/aztec:$VERSION aztecprotocol/aztec:latest
Tasks for Cursor:
Add docs/INSTALL_AZTEC_LOCALLY.md explaining official installation steps.
Update package.json scripts to call the Aztec CLI where appropriate.
3. Devnet / PXE Setup
3.1 Local Sandbox vs Devnet
Aztec starter uses two explicit modes:
sandbox
devnet
Each mode has its own JSON config file:
config/sandbox.json
config/devnet.json
Tasks for Cursor:
Create the two config files based on Hidden Garden’s current env:
pxeUrl
timeouts
polling intervals
wallet behavior
Add an ENV selector:
AZTEC_ENV=sandbox  (default)
AZTEC_ENV=devnet
Ensure backend and frontend use:
AZTEC_ENV
AZTEC_PXE_URL
NEXT_PUBLIC_AZTEC_PXE_URL
3.2 Docker-based Devnet (recommended for demo)
Use the public sandbox image:
docker run -it -p 8080:8080 aztecprotocol/sandbox:latest
Tasks for Cursor:
Add scripts/start-devnet-docker.sh
Add a health check script:
scripts/check-pxe.js
4. Wallet, Accounts & Fees
Aztec starter provides utilities:
create_account_from_env.ts
setup_wallet.ts
sponsored_fpc.ts
Why it matters:
Our backend audit identified hardcoded private keys (critical)
Starter uses env-based Schnorr key creation
Starter uses Sponsored Fee Payment Contract (FPC) for devnet
Tasks for Cursor:
Add a folder:
packages/core-logic/src/aztec/utils/
Implement:
createAccountFromEnv.ts
setupWallet.ts
sponsoredFPC.ts
Mirror Aztec starter behavior
Replace current ad-hoc fee handling
Replace all backend uses of:
new Wallet(hardcodedKey...)
with:
const wallet = await setupWallet(config)
5. PXE Client Initialization
Aztec starter uses:
import { createPXEClient } from "@aztec/aztec.js";
const pxe = createPXEClient(config.pxeUrl);
Tasks for Cursor:
Replace our multiple dynamic import patterns with a single Aztec client wrapper:
packages/core-logic/src/aztec/aztecClient.ts
The wrapper must:
Load configs via AZTEC_ENV
Validate PXE connection on startup
Provide typed methods (no any)
Expose unified API for proofs, contract interaction, and account retrieval
6. Proof Extraction & Encoding (critical)
Audit Findings:
Proofs are extracted incorrectly
Public inputs are JSON-stringified (wrong)
Expected ABI-encoding is missing
Contract verification will fail
Tasks for Cursor:
Replace current extraction with:
Proper proof type from Aztec SDK:
receipt.proof
ABI-encoded public inputs using:
@aztec/aztec.js` ABI utilities
Add:
validateProofFormat(proof)
encodePublicInputs(inputs)
Write tests in:
packages/core-logic/tests/proofExtraction.test.ts
7. Script Conventions (Starter-Compatible)
Starter uses:
yarn deploy          # sandbox
yarn deploy::devnet  # devnet
yarn test::devnet
Tasks for Cursor:
Add ::devnet variants for:
Compiling Noir circuits
Deploying contracts
Running tests
Publishing tier proofs
8. Frontend Integration
8.1 ENV variables
Frontend should read:
NEXT_PUBLIC_AZTEC_PXE_URL
NEXT_PUBLIC_AZTEC_ENV
Tasks for Cursor:
Refactor our useAztecClient() hook to load ENV + config.json
Ensure the “Reveal Tier” button:
Uses the unified client wrapper
Displays accurate error messages if PXE is unreachable
Shows proof summary in UI before submission
9. Noir Learning & Aztecbat Integration
We want our “Aztecbat” learning flow to align with:
awesome-noir
Official Noir starter templates
Noir documentation
Tasks for Cursor:
Add docs/noir-resources.md containing:
Links from awesome-noir
Links to npx create-noir
Beginner → advanced examples
Integrate these into the UI as:
“Learn Noir” panel
Quest progression
10. Final Checklist for Cursor
Critical
 Replace hardcoded private keys with env-based account creation
 Fix proof extraction and ABI encoding
 Ensure Node 22.15.0
 Add unified Aztec client wrapper
 Add sponsored FPC fee handling
 Implement sandbox + devnet configs
High Priority
 Add ::devnet scripts
 Improve type safety (remove any, ts-ignore)
 Add tests for proof extraction
UI
 Update PXE client hookup
 Show improved error messages
 Add Noir resources section
11. Notes for the Team
This file is the single source of truth for how Hidden Garden should integrate Aztec tooling. Any new backend or UI component that touches Aztec must align to the patterns described here.