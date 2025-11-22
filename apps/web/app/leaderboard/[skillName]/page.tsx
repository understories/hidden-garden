import * as React from 'react';
import type { PublicSkillTier } from '@hidden-garden/common';
import { mockLeaderboardApi } from '../../../lib/mockLeaderboardClient';

type LeaderboardPageProps = {
  params: Promise<{
    skillName: string;
  }>;
};

export default async function LeaderboardPage({ params }: LeaderboardPageProps) {
  const { skillName: rawSkillName } = await params;
  const skillName = decodeURIComponent(rawSkillName);
  const entries: PublicSkillTier[] = await mockLeaderboardApi.getLeaderboard(skillName);

  return (
    <main className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Leaderboard: {skillName}
      </h1>
      {entries.length === 0 ? (
        <p className="text-gray-500">No entries yet for this skill.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border px-2 py-1 text-left">Rank</th>
              <th className="border px-2 py-1 text-left">User</th>
              <th className="border px-2 py-1 text-left">Tier</th>
              <th className="border px-2 py-1 text-left">Last updated</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => {
              const label =
                entry.ensName && entry.ensName.length > 0
                  ? entry.ensName
                  : `${entry.userAddress.slice(0, 6)}…${entry.userAddress.slice(-4)}`;

              const date = new Date(entry.updatedAt);
              return (
                <tr key={`${entry.userAddress}-${entry.skillName ?? skillName}`}>
                  <td className="border px-2 py-1">{index + 1}</td>
                  <td className="border px-2 py-1">{label}</td>
                  <td className="border px-2 py-1">Tier {entry.tier}</td>
                  <td className="border px-2 py-1">
                    {date.toLocaleDateString()} {date.toLocaleTimeString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </main>
  );
}

