'use client';

import * as React from 'react';
import type { SkillNode } from '@hidden-garden/core-logic';
import { normalizeSkillId, shortenAddress, getEnsName } from '@hidden-garden/core-logic';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { mainnetPublicClient } from '../../lib/viemClients';
import { startSelfVerificationFlow } from '../../lib/selfVerification';
import { useHasValidSBT } from '../../hooks/useHasValidSBT';

const initialSkills: SkillNode[] = [
  {
    id: normalizeSkillId('Rust'),
    name: 'Rust',
    level: 2,
    xp: 120,
    children: [],
  },
  {
    id: normalizeSkillId('Zero-Knowledge Proofs'),
    name: 'Zero-Knowledge Proofs',
    level: 1,
    xp: 30,
    children: [],
  },
];

export default function MyGardenPage() {
  const [skills, setSkills] = React.useState<SkillNode[]>(initialSkills);
  const [newSkillName, setNewSkillName] = React.useState('');

  const { address, isConnected } = useAccount();
  const [ensName, setEnsName] = React.useState<string | null>(null);
  const [ensLoading, setEnsLoading] = React.useState(false);

  // Check SBT status using on-chain contract call
  const { isLoading: sbtLoading, isVerified, error: sbtError, refetch: refetchSBT } = useHasValidSBT(
    address as `0x${string}` | undefined,
  );

  // Track if user has manually completed verification (for hackathon demo)
  const [verificationCompleted, setVerificationCompleted] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;

    async function resolveEns() {
      if (!address || !isConnected) {
        setEnsName(null);
        return;
      }

      setEnsLoading(true);
      try {
        const name = await getEnsName(
          mainnetPublicClient as any,
          address as `0x${string}`,
        );
        if (!cancelled) {
          setEnsName(name);
        }
      } catch {
        if (!cancelled) {
          setEnsName(null);
        }
      } finally {
        if (!cancelled) {
          setEnsLoading(false);
        }
      }
    }

    resolveEns();

    return () => {
      cancelled = true;
    };
  }, [address, isConnected]);

  const profileIdentifier =
    ensName && ensName.length > 0
      ? ensName
      : address
      ? address
      : null;

  const profileHref = profileIdentifier ? `/u/${profileIdentifier}` : null;

  const profileLabel = !isConnected
    ? 'Connect your wallet to view your public profile'
    : ensLoading
    ? 'Resolving ENS…'
    : ensName
    ? `View my public profile (${ensName})`
    : address
    ? `View my public profile (${shortenAddress(address)})`
    : 'View my public profile';

  function updateSkill(id: string, updates: Partial<Pick<SkillNode, 'level' | 'xp'>>) {
    setSkills((prev) =>
      prev.map((skill) =>
        skill.id === id
          ? {
              ...skill,
              ...updates,
            }
          : skill,
      ),
    );
  }

  function handleAddSkill(e: React.FormEvent) {
    e.preventDefault();
    const name = newSkillName.trim();
    if (!name) return;

    const id = normalizeSkillId(name);

    // Avoid duplicates for now.
    const exists = skills.some((s) => s.id === id);
    if (exists) {
      // Simple UX: just clear input; later we can show a toast.
      setNewSkillName('');
      return;
    }

    const next: SkillNode = {
      id,
      name,
      level: 1,
      xp: 0,
      children: [],
    };

    setSkills((prev) => [...prev, next]);
    setNewSkillName('');
  }

  return (
    <main className="max-w-3xl mx-auto p-4 space-y-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Garden</h1>
          <p className="text-sm text-gray-500">
            This is your local skill tree sandbox. Later, parts of this garden can be revealed to
            the public leaderboard.
          </p>
        </div>
        <Link href="/" className="text-sm underline text-gray-600">
          ← Back home
        </Link>
      </header>

      <section className="space-y-3 border-b pb-4 mb-4">
        <h2 className="text-lg font-semibold">Identity Verification</h2>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-3">
              Verify your identity with Self to prove you&apos;re human and unlock additional features.
            </p>
            
            {/* Status Display */}
            <div className="flex items-center gap-2">
              {sbtLoading && (
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <span className="inline-block w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
                  <span>Checking verification…</span>
                </div>
              )}
              
              {!sbtLoading && isVerified && (
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-200">
                    <span>✅</span>
                    <span>Verified Human</span>
                  </span>
                </div>
              )}
              
              {!sbtLoading && !isVerified && !sbtError && (
                <span className="text-sm text-gray-500">Not verified yet</span>
              )}
              
              {sbtError && !sbtLoading && (
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-gray-500">Not verified yet</span>
                  <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-200">
                    ⚠️ {sbtError.message || 'Error checking verification status'}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            {!isVerified && (
              <button
                type="button"
                onClick={() => {
                  if (!address) return;
                  startSelfVerificationFlow(address as `0x${string}`);
                }}
                disabled={!isConnected || sbtLoading}
                className="px-4 py-2 rounded border text-sm font-medium bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Verify with Self
              </button>
            )}
            
            {verificationCompleted && !isVerified && (
              <button
                type="button"
                onClick={() => {
                  refetchSBT();
                }}
                disabled={sbtLoading}
                className="px-4 py-2 rounded border text-sm font-medium bg-blue-50 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sbtLoading ? 'Checking…' : 'Check Verification Status'}
              </button>
            )}
            
            {!isVerified && !verificationCompleted && (
              <button
                type="button"
                onClick={() => {
                  setVerificationCompleted(true);
                  // Auto-refetch after a short delay
                  setTimeout(() => {
                    refetchSBT();
                  }, 1000);
                }}
                className="text-xs text-blue-600 underline hover:text-blue-800 text-left"
              >
                I&apos;ve completed verification
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Skills</h2>
        {skills.length === 0 ? (
          <p className="text-sm text-gray-500">
            No skills yet. Plant your first one below.
          </p>
        ) : (
          <div className="space-y-3">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="border rounded-md p-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="font-medium">{skill.name}</div>
                  <div className="text-xs text-gray-500">
                    id: <code>{skill.id}</code>
                  </div>
                </div>
                <div className="flex gap-4 items-center">
                  <label className="flex flex-col text-xs text-gray-600">
                    Level
                    <input
                      type="number"
                      min={0}
                      value={skill.level}
                      onChange={(e) =>
                        updateSkill(skill.id, { level: Number(e.target.value) || 0 })
                      }
                      className="border rounded px-2 py-1 text-sm w-20"
                    />
                  </label>
                  <label className="flex flex-col text-xs text-gray-600">
                    XP
                    <input
                      type="number"
                      min={0}
                      value={skill.xp}
                      onChange={(e) =>
                        updateSkill(skill.id, { xp: Number(e.target.value) || 0 })
                      }
                      className="border rounded px-2 py-1 text-sm w-24"
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Plant a new skill</h2>
        <form onSubmit={handleAddSkill} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="e.g. Mentoring, ZK, Rust"
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
            className="flex-1 border rounded px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded border text-sm font-medium bg-white hover:bg-gray-50"
          >
            Add skill
          </button>
        </form>
        <p className="text-xs text-gray-500">
          We&apos;ll normalize the name into a stable id (e.g. &quot;Zero-Knowledge Proofs&quot; →{' '}
          <code>zero-knowledge-proofs</code>).
        </p>
      </section>

      <section className="space-y-2 border-t pt-4 mt-4">
        <h2 className="text-lg font-semibold">Public profile</h2>
        <p className="text-sm text-gray-600">
          Your public profile shows only the skills you&apos;ve chosen to reveal to the leaderboard,
          not your full private garden.
        </p>
        <div>
          {profileHref && isConnected ? (
            <Link
              href={profileHref}
              className="inline-flex items-center px-4 py-2 rounded border text-sm font-medium bg-white hover:bg-gray-50"
            >
              {profileLabel}
            </Link>
          ) : (
            <button
              type="button"
              disabled
              className="inline-flex items-center px-4 py-2 rounded border text-sm text-gray-400 bg-gray-50 cursor-not-allowed"
            >
              {profileLabel}
            </button>
          )}
        </div>
      </section>
    </main>
  );
}

