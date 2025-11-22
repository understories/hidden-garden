import type { PublicSkillTier } from '@hidden-garden/core-logic';
import { shortenAddress } from '@hidden-garden/core-logic';
import { mockLeaderboardApi } from '../../../lib/mockLeaderboardClient';
import { mainnetPublicClient } from '../../../lib/viemClients';
import Link from 'next/link';

type UserProfilePageProps = {
  params: Promise<{
    identifier: string;
  }>;
};

async function resolveIdentifierToAddress(identifier: string): Promise<{
  address: `0x${string}` | null;
  primaryEnsName: string | null;
}> {
  const trimmed = identifier.trim();

  // ENS name path: foo.eth → resolve to address
  if (trimmed.toLowerCase().endsWith('.eth')) {
    const ensName = trimmed.toLowerCase();
    const address = await mainnetPublicClient.getEnsAddress({ name: ensName });
    if (!address) {
      return { address: null, primaryEnsName: null };
    }
    return {
      address,
      primaryEnsName: ensName,
    };
  }

  // Otherwise, assume it's an address.
  // In a production app, we would validate, but for now we trust the input.
  const addr = trimmed as `0x${string}`;

  // Try reverse ENS lookup for nicer display, but it's optional.
  let reverseName: string | null = null;
  try {
    reverseName = await mainnetPublicClient.getEnsName({ address: addr });
  } catch {
    reverseName = null;
  }

  return {
    address: addr,
    primaryEnsName: reverseName,
  };
}

export default async function UserProfilePage({ params }: UserProfilePageProps) {
  const { identifier: rawIdentifier } = await params;
  const decodedIdentifier = decodeURIComponent(rawIdentifier);

  const { address, primaryEnsName } = await resolveIdentifierToAddress(decodedIdentifier);

  if (!address) {
    return (
      <main className="max-w-3xl mx-auto p-4 space-y-4">
        <header className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Profile not found</h1>
            <p className="text-sm text-gray-500">
              Could not resolve <code>{decodedIdentifier}</code> to an address.
            </p>
          </div>
          <Link href="/" className="text-sm underline text-gray-600">
            ← Back home
          </Link>
        </header>
      </main>
    );
  }

  const publicSkills: PublicSkillTier[] = await mockLeaderboardApi.getUserSkills(address);

  const displayLabel =
    primaryEnsName ??
    (publicSkills[0]?.ensName ?? shortenAddress(address));

  return (
    <main className="max-w-3xl mx-auto p-4 space-y-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{displayLabel}</h1>
          <p className="text-xs text-gray-500">
            {shortenAddress(address)} • Public skill profile
          </p>
        </div>
        <Link href="/" className="text-sm underline text-gray-600">
          ← Back home
        </Link>
      </header>

      <section className="space-y-2">
        <p className="text-sm text-gray-600">
          These are selectively revealed skills from this garden, not the full private skill tree.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Public skills</h2>
        {publicSkills.length === 0 ? (
          <p className="text-sm text-gray-500">
            No public skills have been revealed yet.
          </p>
        ) : (
          <div className="space-y-3">
            {publicSkills.map((skill) => {
              const date = new Date(skill.updatedAt);
              return (
                <div
                  key={`${skill.userAddress}-${skill.skillName ?? skill.skillHash ?? ''}`}
                  className="border rounded-md p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                >
                  <div>
                    <div className="font-medium">
                      {skill.skillName ?? 'Unknown skill'}
                    </div>
                    <div className="text-xs text-gray-500">
                      Last updated: {date.toLocaleDateString()} {date.toLocaleTimeString()}
                    </div>
                  </div>
                  <div className="text-sm">
                    <span className="inline-block px-2 py-1 rounded border">
                      Tier {skill.tier}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

