/**
 * AchievementCard Component
 *
 * Displays a single public achievement/skill on a user's profile.
 */

type AchievementCardProps = {
  skillName: string;
  tier: number;
  dateRevealed: string;
  proofOfHuman: boolean;
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

export function AchievementCard({
  skillName,
  tier,
  dateRevealed,
  proofOfHuman,
}: AchievementCardProps) {
  const tierName = getTierName(tier);
  const tierColor = getTierColor(tier);
  const date = new Date(dateRevealed);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800/50 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">
            {skillName}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            Revealed on {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
          <div className="flex items-center gap-2">
            {proofOfHuman ? (
              <span className="inline-flex items-center gap-1 text-xs text-green-700 dark:text-green-400">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                Verified Human
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                Open to All
              </span>
            )}
          </div>
        </div>
        <span
          className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium border ${tierColor}`}
        >
          {tierName}
        </span>
      </div>
    </div>
  );
}

