/**
 * LeaderboardEntry Component
 *
 * Displays a single leaderboard entry with rank, user info, tier, and proof status.
 */

type LeaderboardEntryProps = {
  rank: number;
  displayName: string;
  address: string;
  tier: number;
  proofOfHuman: boolean;
  viewMode: 'white-hat' | 'black-hat';
  onClick?: () => void;
};

function getTierName(tier: number): string {
  const tierMap: Record<number, string> = {
    1: 'Bronze',
    2: 'Silver',
    3: 'Gold',
    4: 'Master',
  };
  return tierMap[tier] || `Tier ${tier}`;
}

function getTierColor(tier: number): string {
  const colorMap: Record<number, string> = {
    1: 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-700',
    2: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600',
    3: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700',
    4: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 border-purple-300 dark:border-purple-700',
  };
  return colorMap[tier] || 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600';
}

export function LeaderboardEntry({
  rank,
  displayName,
  address,
  tier,
  proofOfHuman,
  viewMode,
  onClick,
}: LeaderboardEntryProps) {
  const tierName = getTierName(tier);
  const tierColor = getTierColor(tier);

  return (
    <tr
      className={`border-b border-gray-200 dark:border-gray-700 transition-colors ${
        onClick
          ? 'hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer'
          : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
      }`}
      onClick={onClick}
    >
      <td className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">
        #{rank}
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {displayName}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
            {address}
          </span>
        </div>
      </td>
      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${tierColor}`}
        >
          {tierName}
        </span>
      </td>
      <td className="px-4 py-3">
        {proofOfHuman ? (
          <span className="inline-flex items-center gap-1 text-xs text-green-700 dark:text-green-400">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            {viewMode === 'white-hat' ? 'Verified Human' : 'Human Only'}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
            {viewMode === 'white-hat' ? 'Open to All' : 'Agent Allowed'}
          </span>
        )}
      </td>
    </tr>
  );
}

