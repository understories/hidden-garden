

# Arkiv Integration Plan – Hidden Garden / Aztecbat

**Goal**

Add Arkiv as a lightweight, neutral data layer for **public skill profiles**, while keeping:

- **Aztec** → private quest data + ZK tier proofs  
- **Self SBT** → “human / allow agents” switch  
- **Arkiv** → public snapshot store + queryable leaderboard data (no central DB)

This document is written for Cursor. Follow the steps in order; each step is self-contained.

---

## 0. Constraints & Design

- Do **not** reuse code from last week’s MentorGraph hack.
- All new Arkiv logic lives under `packages/core-logic/src/arkiv/`.
- Arkiv stores ** snapshots ** (public view of a skill profile), not private quest details.
- Trigger Arkiv writes **after** a successful tier publish, so the on-chain state and Arkiv snapshot match.

---

## 1. Dependencies & Environment

### 1.1 Add Arkiv SDK

In the monorepo root:

```bash
pnpm add @arkiv-network/sdk
````

### 1.2 Env vars

In `apps/aztecbat-ui/.env.local` add:

```bash
# Arkiv RPC – use the public Mendoza testnet
ARKIV_RPC_URL=https://mendoza.hoodi.arkiv.network/rpc
ARKIV_CHAIN_ID=60138453056

# Wallet key for writes from Next API routes (dev/test only)
ARKIV_PRIVATE_KEY=0xYOUR_TEST_PRIVATE_KEY

# Optional feature flag to make Arkiv usage explicit
NEXT_PUBLIC_USE_ARKIV=true
```

> Cursor: do **not** check `.env.local` into git. Assume the developer will fill real values.

---

## 2. Arkiv Types

**File:** `packages/core-logic/src/arkiv/types.ts` (NEW)

Create a minimal payload format for what we publish to Arkiv.

```ts
// Public profile snapshot stored in Arkiv.
// This is intentionally "public only" – no private quest details.
export interface ArkivSkillProfilePayload {
  address: string;          // user wallet
  chainId: number;          // L1 chain where SBT / leaderboard live

  // Identity / participation mode
  humanVerified: boolean;   // has Self SBT?
  allowAgents: boolean;     // if false -> "humans only", if true -> "humans + agents"

  // Aztec builder state (from your existing skill profile)
  aztecBuilderTier: number | null;
  aztecBuilderSkillHash: string | null;

  // Optional badges for “white-hat” leaderboard flavor
  externalBadges: {
    id: string;
    label: string;
    source: string; // 'hackathon', 'ctf', 'other', etc.
  }[];

  lastUpdated: number;      // unix ms timestamp
}
```

Export this type from `packages/core-logic/src/index.ts` later (Step 5).

---

## 3. Arkiv Client Setup

**File:** `packages/core-logic/src/arkiv/client.ts` (NEW)

Create a thin wrapper around Arkiv’s wallet + public clients.

```ts
import {
  createWalletClient,
  createPublicClient,
  http,
} from '@arkiv-network/sdk';
import { privateKeyToAccount } from '@arkiv-network/sdk/accounts';
import { mendoza } from '@arkiv-network/sdk/chains';

const rpcUrl = process.env.ARKIV_RPC_URL;
const chainIdFromEnv = process.env.ARKIV_CHAIN_ID
  ? Number(process.env.ARKIV_CHAIN_ID)
  : undefined;

// Default to Mendoza testnet if env not set
const chain = {
  ...mendoza,
  id: chainIdFromEnv ?? mendoza.id,
};

if (!rpcUrl) {
  console.warn('[arkiv] ARKIV_RPC_URL not set; Arkiv public client will be disabled.');
}

// Public client – read only
export const arkivPublicClient = rpcUrl
  ? createPublicClient({
      chain,
      transport: http(rpcUrl),
    })
  : null;

// Wallet client – write operations (create entities)
export const arkivWalletClient =
  rpcUrl && process.env.ARKIV_PRIVATE_KEY
    ? createWalletClient({
        chain,
        transport: http(rpcUrl),
        account: privateKeyToAccount(
          process.env.ARKIV_PRIVATE_KEY as `0x${string}`,
        ),
      })
    : null;
```

---

## 4. Arkiv Skill Profile Helpers

**File:** `packages/core-logic/src/arkiv/skillProfiles.ts` (NEW)

Implements three operations:

* `upsertArkivSkillProfile` – write a new snapshot (append-only)
* `getArkivSkillProfile` – fetch latest snapshot for a specific address
* `listArkivSkillProfiles` – list snapshots for leaderboard view

```ts
import {
  jsonToPayload,
  payloadToJson,
  ExpirationTime,
} from '@arkiv-network/sdk/utils';
import { eq } from '@arkiv-network/sdk/query';
import { arkivWalletClient, arkivPublicClient } from './client';
import type { ArkivSkillProfilePayload } from './types';

const PROFILE_TYPE = 'skill_profile';
const SKILL_PATH = 'aztec_builder';

// Create a new snapshot entity (append-only). For demo we don't dedupe.
export async function upsertArkivSkillProfile(
  snapshot: ArkivSkillProfilePayload,
) {
  if (!arkivWalletClient) {
    console.warn('[arkiv] wallet client not configured; skipping write');
    return null;
  }

  const payload = jsonToPayload(snapshot);

  const { entityKey, txHash } = await arkivWalletClient.createEntity({
    payload,
    contentType: 'application/json',
    // Long-ish TTL; not important for demo
    expiresIn: ExpirationTime.fromDays(180),
    attributes: [
      { key: 'type', value: PROFILE_TYPE },
      { key: 'skill_path', value: SKILL_PATH },
      { key: 'address', value: snapshot.address.toLowerCase() },
      { key: 'human', value: snapshot.humanVerified ? 1 : 0 },
      { key: 'allow_agents', value: snapshot.allowAgents ? 1 : 0 },
    ],
  });

  return { entityKey, txHash };
}

// Fetch the latest snapshot for a specific address (or null)
export async function getArkivSkillProfile(
  address: string,
): Promise<ArkivSkillProfilePayload | null> {
  if (!arkivPublicClient) {
    console.warn('[arkiv] public client not configured; cannot read profiles');
    return null;
  }

  const query = arkivPublicClient.buildQuery();

  const res = await query
    .where(
      eq('type', PROFILE_TYPE)
        .and(eq('skill_path', SKILL_PATH))
        .and(eq('address', address.toLowerCase())),
    )
    .orderBy('created', 'desc')
    .limit(1)
    .withAttributes(false)
    .withPayload(true)
    .fetch();

  const first = res.entities[0];
  if (!first?.payload) return null;

  return payloadToJson(first.payload) as ArkivSkillProfilePayload;
}

// List many profiles with simple filters for the leaderboard page
export async function listArkivSkillProfiles(opts?: {
  humanOnly?: boolean;
  allowAgentsOnly?: boolean;
}): Promise<ArkivSkillProfilePayload[]> {
  if (!arkivPublicClient) {
    console.warn('[arkiv] public client not configured; cannot list profiles');
    return [];
  }

  let q = arkivPublicClient
    .buildQuery()
    .where(eq('type', PROFILE_TYPE).and(eq('skill_path', SKILL_PATH)))
    .withAttributes(true)
    .withPayload(true);

  if (opts?.humanOnly) {
    q = q.where(eq('human', 1));
  }
  if (opts?.allowAgentsOnly) {
    q = q.where(eq('allow_agents', 1));
  }

  const res = await q.fetch();

  return res.entities
    .filter((e) => e.payload)
    .map((e) => payloadToJson(e.payload!) as ArkivSkillProfilePayload);
}
```

---

## 5. Export Arkiv helpers from core-logic

Update `packages/core-logic/src/index.ts` to re-export:

```ts
// Arkiv exports
export * from './arkiv/types';
export {
  upsertArkivSkillProfile,
  getArkivSkillProfile,
  listArkivSkillProfiles,
} from './arkiv/skillProfiles';
```

This allows the Next API routes to import from `@hidden-garden/core-logic`.

---

## 6. Wire Arkiv into the tier-publish flow

Goal: whenever we successfully publish a tier proof to L1 + leaderboard, we also push a fresh snapshot to Arkiv.

**File:** `packages/core-logic/src/leaderboardOrchestrator.ts`

1. Import the helpers:

```ts
import { upsertArkivSkillProfile } from './arkiv/skillProfiles';
import { getSkillProfile } from './skillProfile';
```

2. After the existing `publishAndFetchAztecBuilderLeaderboard()` logic completes successfully, call Arkiv:

```ts
export async function publishAndFetchAztecBuilderLeaderboard(
  params: PublishAndFetchParams,
): Promise<PublishAndFetchResult> {
  const result = await internalPublishAndFetch(params); // existing logic

  // Feature flag – if Arkiv is disabled, skip
  if (process.env.NEXT_PUBLIC_USE_ARKIV === 'false') {
    return result;
  }

  try {
    const skillProfile = await getSkillProfile({
      chainId: params.chainId,
      address: params.userAddress,
      indexerBaseUrl: params.indexerBaseUrl,
      // aztecClient is optional; use existing signature
    });

    await upsertArkivSkillProfile({
      address: skillProfile.address,
      chainId: params.chainId,
      humanVerified: skillProfile.humanVerified,
      allowAgents: skillProfile.allowAgents,
      aztecBuilderTier: skillProfile.aztecBuilderTier,
      aztecBuilderSkillHash: skillProfile.aztecBuilderSkillHash,
      externalBadges: skillProfile.externalBadges ?? [],
      lastUpdated: Date.now(),
    });
  } catch (err) {
    console.warn('[arkiv] failed to upsert profile snapshot', err);
    // non-fatal – demo should still work even if Arkiv write fails
  }

  return result;
}
```

This guarantees Arkiv always holds the most recent *public* view of a profile right after a tier reveal.

---

## 7. Next API routes for Arkiv

### 7.1 List Arkiv profiles

**File:** `apps/aztecbat-ui/app/api/dev/arkiv-profiles/route.ts` (NEW)

```ts
import { NextResponse } from 'next/server';
import {
  listArkivSkillProfiles,
} from '@hidden-garden/core-logic';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const humanOnly = url.searchParams.get('humanOnly') === 'true';
  const allowAgentsOnly = url.searchParams.get('allowAgentsOnly') === 'true';

  try {
    const profiles = await listArkivSkillProfiles({ humanOnly, allowAgentsOnly });
    return NextResponse.json({ ok: true, profiles });
  } catch (error: any) {
    console.error('[api/dev/arkiv-profiles]', error);
    return NextResponse.json(
      { ok: false, error: error?.message ?? 'Unknown error' },
      { status: 500 },
    );
  }
}
```

### 7.2 (Optional) Get a single Arkiv profile

**File:** `apps/aztecbat-ui/app/api/dev/arkiv-profile/route.ts` (NEW, OPTIONAL)

```ts
import { NextResponse } from 'next/server';
import { getArkivSkillProfile } from '@hidden-garden/core-logic';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const address = url.searchParams.get('address');

  if (!address) {
    return NextResponse.json(
      { ok: false, error: 'Missing address' },
      { status: 400 },
    );
  }

  try {
    const profile = await getArkivSkillProfile(address);
    return NextResponse.json({ ok: true, profile });
  } catch (error: any) {
    console.error('[api/dev/arkiv-profile]', error);
    return NextResponse.json(
      { ok: false, error: error?.message ?? 'Unknown error' },
      { status: 500 },
    );
  }
}
```

---

## 8. UI: Arkiv profiles section in `/dev/aztec-lab`

Extend the existing dev page to **Section 3** for Arkiv.

**File:** `apps/aztecbat-ui/app/dev/aztec-lab/page.tsx`

1. Define a TS type (or import from core-logic if exposed):

```ts
type ArkivSkillProfilePayload = import('@hidden-garden/core-logic').ArkivSkillProfilePayload;
```

2. Add a new React component inside this file:

```tsx
function ArkivProfilesSection() {
  const [profiles, setProfiles] = React.useState<ArkivSkillProfilePayload[]>([]);
  const [humanOnly, setHumanOnly] = React.useState(false);
  const [allowAgentsOnly, setAllowAgentsOnly] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function loadProfiles() {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (humanOnly) params.set('humanOnly', 'true');
    if (allowAgentsOnly) params.set('allowAgentsOnly', 'true');

    try {
      const res = await fetch(`/api/dev/arkiv-profiles?${params.toString()}`);
      const json = await res.json();
      if (!json.ok) throw new Error(json.error ?? 'Request failed');
      setProfiles(json.profiles ?? []);
    } catch (err: any) {
      setError(err.message ?? 'Failed to load profiles');
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    loadProfiles();
  }, []); // initial load

  return (
    <section className="mt-8 border rounded-md p-4 space-y-4">
      <h2 className="font-semibold text-lg">
        Section 3: Arkiv Profiles (Public Snapshot Layer)
      </h2>
      <p className="text-sm text-gray-600">
        Shows public skill profile snapshots stored on Arkiv. This data NEVER
        includes individual quest details – only tier, human status, and badges.
      </p>

      <div className="flex gap-4 items-center text-sm">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={humanOnly}
            onChange={(e) => setHumanOnly(e.target.checked)}
          />
          Humans only (require Self SBT)
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={allowAgentsOnly}
            onChange={(e) => setAllowAgentsOnly(e.target.checked)}
          />
          Allow agents (opt-out of KYC)
        </label>

        <button
          onClick={loadProfiles}
          disabled={loading}
          className="px-3 py-1 border rounded text-sm bg-black text-white disabled:opacity-50"
        >
          {loading ? 'Loading…' : 'Reload Profiles'}
        </button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="border rounded-md overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 py-1 text-left">Address</th>
              <th className="px-2 py-1 text-left">Human</th>
              <th className="px-2 py-1 text-left">Allow Agents</th>
              <th className="px-2 py-1 text-left">Tier</th>
              <th className="px-2 py-1 text-left">Badges</th>
              <th className="px-2 py-1 text-left">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {profiles.length === 0 && !loading && (
              <tr>
                <td colSpan={6} className="px-2 py-3 text-center text-gray-500">
                  No profiles found yet – publish a tier first, then try again.
                </td>
              </tr>
            )}
            {profiles.map((p) => (
              <tr key={`${p.address}-${p.lastUpdated}`} className="border-t">
                <td className="px-2 py-1 font-mono text-xs">
                  {p.address.slice(0, 6)}…{p.address.slice(-4)}
                </td>
                <td className="px-2 py-1">
                  {p.humanVerified ? '✅' : '❌'}
                </td>
                <td className="px-2 py-1">
                  {p.allowAgents ? '🧠 (agents allowed)' : '🧍 humans only'}
                </td>
                <td className="px-2 py-1">
                  {p.aztecBuilderTier ?? '–'}
                </td>
                <td className="px-2 py-1">
                  {p.externalBadges?.map((b) => b.label).join(', ') || '—'}
                </td>
                <td className="px-2 py-1">
                  {new Date(p.lastUpdated).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
```

3. Render `ArkivProfilesSection` near the bottom of the page:

```tsx
export default function AztecLabPage() {
  // existing sections…

  return (
    <main className="p-6 space-y-8">
      {/* Section 1: Skill Profile */}
      {/* Section 2: Reveal Tier + Fetch Leaderboard */}
      <ArkivProfilesSection />
    </main>
  );
}
```

---

## 9. Demo Script (for humans + Cursor to sanity-check)

Once this integration is wired:

1. **Run services in MOCK Aztec mode** (simpler for local demo):

   * `pnpm dev:web`
   * Ensure `NEXT_PUBLIC_USE_REAL_AZTEC=false` but `NEXT_PUBLIC_USE_ARKIV=true`.
   * Make sure `ARKIV_*` env vars are set.

2. **In `/dev/aztec-lab`:**

   * Use Section 1 to load your SkillProfile (mocked).
   * Use Section 2 to run `Reveal Tier + Fetch Leaderboard` once.
   * This should also call `upsertArkivSkillProfile()` under the hood.

3. **Scroll to Section 3: Arkiv Profiles**

   * Click “Reload Profiles”.
   * You should see at least one row with:

     * Your address
     * Human vs allowAgents status
     * Tier
     * Badges
   * Toggle “Humans only” / “Allow agents” to demonstrate narrative:

     * *“If I prove I’m human with Self, I can enter the ‘humans only’ leaderboard.
       If I opt out (cypherpunk mode), I play in the mixed humans+agents arena.”*

4. **Privacy story**

   * Show that Arkiv only has:

     * address, human/agent flag, tier, badges
   * Show that individual quest completions and scores remain on the **Aztec private layer** and never leave it.

---

## 10. What NOT to touch

* Do **not** change core Aztec circuit / Noir code for this integration.
* Do **not** add private quest data to Arkiv payloads.
* Do **not** reuse any MentorGraph-specific code or schemas.

Keep Arkiv as a **thin public snapshot tool** that sits on top of the already-working Aztec + Self flow.

---

```
::contentReference[oaicite:0]{index=0}
```
