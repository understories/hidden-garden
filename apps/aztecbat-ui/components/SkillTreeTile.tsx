/**
 * SkillTreeTile Component
 *
 * A bioluminescent tree tile representing a skill in the forest view.
 * Uses gradient-based styling to create a lunar-punk aesthetic.
 */

import Link from 'next/link';

type PrivacyMode = 'public-heavy' | 'mixed' | 'mostly-private';

type SkillTreeTileProps = {
  skillId: string;
  skillName: string;
  participantCount: number;
  privacyMode: PrivacyMode;
  privacyStats?: {
    public: number;
    mixed: number;
    private: number;
  };
};

function getPrivacyGradient(privacyMode: PrivacyMode): string {
  switch (privacyMode) {
    case 'public-heavy':
      // Bright bioluminescent greens/cyans
      return 'from-emerald-400/20 via-cyan-400/15 to-teal-400/20 dark:from-emerald-400/30 dark:via-cyan-400/25 dark:to-teal-400/30';
    case 'mixed':
      // Amber/orange transitional hues
      return 'from-amber-400/20 via-orange-400/15 to-yellow-400/20 dark:from-amber-400/30 dark:via-orange-400/25 dark:to-yellow-400/30';
    case 'mostly-private':
      // Pale, moonlit blues/purples
      return 'from-blue-300/15 via-indigo-300/10 to-purple-300/15 dark:from-blue-400/25 dark:via-indigo-400/20 dark:to-purple-400/25';
  }
}

function getPrivacyBorder(privacyMode: PrivacyMode): string {
  switch (privacyMode) {
    case 'public-heavy':
      return 'border-emerald-400/30 dark:border-emerald-400/40';
    case 'mixed':
      return 'border-amber-400/30 dark:border-amber-400/40';
    case 'mostly-private':
      return 'border-blue-400/20 dark:border-indigo-400/30';
  }
}

function getPrivacyGlow(privacyMode: PrivacyMode): string {
  switch (privacyMode) {
    case 'public-heavy':
      return 'shadow-emerald-400/20 dark:shadow-emerald-400/30';
    case 'mixed':
      return 'shadow-amber-400/20 dark:shadow-amber-400/30';
    case 'mostly-private':
      return 'shadow-blue-400/10 dark:shadow-indigo-400/20';
  }
}

export function SkillTreeTile({
  skillId,
  skillName,
  participantCount,
  privacyMode,
  privacyStats,
}: SkillTreeTileProps) {
  const gradientClasses = getPrivacyGradient(privacyMode);
  const borderClasses = getPrivacyBorder(privacyMode);
  const glowClasses = getPrivacyGlow(privacyMode);

  // Default privacy stats if not provided
  const stats = privacyStats || {
    public: privacyMode === 'public-heavy' ? 70 : privacyMode === 'mixed' ? 40 : 20,
    mixed: privacyMode === 'mixed' ? 40 : 20,
    private: privacyMode === 'mostly-private' ? 70 : privacyMode === 'mixed' ? 20 : 10,
  };

  return (
    <div className="relative group">
      <Link
        href={`/leaderboard/${skillId}`}
        className={`block relative overflow-hidden rounded-xl p-6 border-2 ${borderClasses} bg-gradient-to-br ${gradientClasses} transition-all duration-300 hover:scale-[1.02] focus:scale-[1.02] hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 dark:focus:ring-blue-500 ${glowClasses} group`}
      >
        {/* Enhanced glow effect on hover/focus */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/5 dark:from-white/0 dark:to-white/10 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300 rounded-xl" />
        
        <div className="relative z-10">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-white dark:group-hover:text-white transition-colors duration-300">
            {skillName}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-200 dark:group-hover:text-gray-300 transition-colors duration-300">
            {participantCount.toLocaleString()} participants
          </p>
        </div>
      </Link>

      {/* Tooltip on hover/focus */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-800 text-white text-xs rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-focus-within:opacity-100 group-hover:visible group-focus-within:visible transition-all duration-200 pointer-events-none z-20 whitespace-nowrap">
        <div className="font-medium mb-1">{skillName}</div>
        <div className="space-y-0.5 text-gray-300 dark:text-gray-400">
          <div>{participantCount.toLocaleString()} participants</div>
          <div className="text-xs">
            {stats.public}% public, {stats.mixed}% mixed, {stats.private}% private
          </div>
        </div>
        {/* Tooltip arrow */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-gray-900 dark:bg-gray-800 rotate-45" />
      </div>
    </div>
  );
}

