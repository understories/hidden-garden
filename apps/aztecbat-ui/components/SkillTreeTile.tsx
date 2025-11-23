/**
 * SkillTreeTile Component
 *
 * A bioluminescent tree tile representing a skill in the forest view.
 * Uses gradient-based styling to create a lunar-punk aesthetic.
 */

import Link from 'next/link';
import { TreeIcon } from './TreeIcon';
import {
  SpringCanopyTree,
  AutumnBlendTree,
  MoonlitBranchesTree,
  BaseTree,
  BioluminescentMushroom,
  MiniShrub,
} from './CustomTreeIcons';

type PrivacyMode = 'public-heavy' | 'mixed' | 'mostly-private';

type Quest = {
  id: string;
  name: string;
  participantCount: number;
  privacyMode: 'public-heavy' | 'mixed' | 'private-heavy';
};

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
  quests?: Quest[];
  treeType?: 'conifer' | 'round' | 'mushroom';
  customTreeType?: 'spring' | 'autumn' | 'moonlit' | 'base' | 'mushroom' | 'shrub';
};

function getPrivacyGradient(privacyMode: PrivacyMode): string {
  switch (privacyMode) {
    case 'public-heavy':
      // Soft spring green (Ghibli style)
      return 'from-green-50 via-emerald-50/80 to-teal-50 dark:from-gray-800/60 dark:via-gray-700/50 dark:to-gray-800/60';
    case 'mixed':
      // Soft sandy amber (Ghibli style)
      return 'from-amber-50 via-orange-50/80 to-yellow-50 dark:from-gray-800/60 dark:via-gray-700/50 dark:to-gray-800/60';
    case 'mostly-private':
      // Soft sky blue (Ghibli style)
      return 'from-blue-50 via-cyan-50/80 to-indigo-50 dark:from-gray-800/60 dark:via-gray-700/50 dark:to-gray-800/60';
  }
}

function getPrivacyBorder(privacyMode: PrivacyMode): string {
  switch (privacyMode) {
    case 'public-heavy':
      return 'border-green-200/50 dark:border-gray-600/30';
    case 'mixed':
      return 'border-amber-200/50 dark:border-gray-600/30';
    case 'mostly-private':
      return 'border-blue-200/50 dark:border-gray-600/30';
  }
}

function getPrivacyGlow(privacyMode: PrivacyMode): string {
  switch (privacyMode) {
    case 'public-heavy':
      return 'shadow-lg';
    case 'mixed':
      return 'shadow-lg';
    case 'mostly-private':
      return 'shadow-lg';
  }
}

// Helper to get tree type based on quest index
function getTreeType(index: number): 'conifer' | 'round' | 'mushroom' {
  const types: ('conifer' | 'round' | 'mushroom')[] = ['conifer', 'round', 'mushroom'];
  return types[index % types.length];
}

// Helper to get tree size based on participant count
function getTreeSize(participants: number): 'sm' | 'md' | 'lg' {
  if (participants > 500) return 'md';
  if (participants > 200) return 'sm';
  return 'sm';
}

// Render custom tree based on type
function renderCustomTree(
  customTreeType: 'spring' | 'autumn' | 'moonlit' | 'base' | 'mushroom' | 'shrub',
  privacy: 'public-heavy' | 'mixed' | 'private-heavy',
  size: 'sm' | 'md' | 'lg' = 'sm'
) {
  switch (customTreeType) {
    case 'spring':
      return <SpringCanopyTree privacy={privacy} size={size} />;
    case 'autumn':
      return <AutumnBlendTree privacy={privacy} size={size} />;
    case 'moonlit':
      return <MoonlitBranchesTree privacy={privacy} size={size} />;
    case 'base':
      return <BaseTree privacy={privacy} size={size} />;
    case 'mushroom':
      return <BioluminescentMushroom privacy={privacy} size={size} />;
    case 'shrub':
      return <MiniShrub privacy={privacy} size={size} />;
    default:
      return <BaseTree privacy={privacy} size={size} />;
  }
}

export function SkillTreeTile({
  skillId,
  skillName,
  participantCount,
  privacyMode,
  privacyStats,
  quests = [],
  treeType,
  customTreeType,
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

  // Helper to convert skill privacy mode to tree privacy mode
  const convertPrivacyMode = (mode: PrivacyMode): 'public-heavy' | 'mixed' | 'private-heavy' => {
    return mode === 'mostly-private' ? 'private-heavy' : mode;
  };

  // If customTreeType is provided, use custom trees; otherwise use legacy TreeIcon
  const useCustomTree = customTreeType !== undefined;
  const showSingleTree = treeType !== undefined || customTreeType !== undefined;
  
  // Default quests if not provided
  const defaultQuests: Quest[] = quests.length > 0 ? quests : [
    { id: 'quest-1', name: 'Quest 1', participantCount: Math.floor(participantCount * 0.4), privacyMode: convertPrivacyMode(privacyMode) },
    { id: 'quest-2', name: 'Quest 2', participantCount: Math.floor(participantCount * 0.35), privacyMode: convertPrivacyMode(privacyMode) },
    { id: 'quest-3', name: 'Quest 3', participantCount: Math.floor(participantCount * 0.25), privacyMode: convertPrivacyMode(privacyMode) },
  ];

  // All trees are the same size (small for custom trees)
  const treeSize = useCustomTree ? 'sm' : 'md';
  
  // Use skill's privacy mode to determine tree color (predominant reveal type)
  const treePrivacy = convertPrivacyMode(privacyMode);

  return (
    <div className="relative group">
      <Link
        href={`/leaderboard/${skillId}`}
        className={`block relative overflow-hidden rounded-xl p-6 border-2 ${borderClasses} bg-gradient-to-br ${gradientClasses} transition-all duration-300 hover:scale-[1.02] focus:scale-[1.02] hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 dark:focus:ring-blue-500 ${glowClasses} group`}
      >
        {/* Enhanced glow effect on hover/focus */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/5 dark:from-white/0 dark:to-white/10 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300 rounded-xl" />
        
        <div className="relative z-10">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 group-hover:text-white dark:group-hover:text-white transition-colors duration-300">
                  {skillName}
                </h3>
                {/* Tree next to the name */}
                {showSingleTree && (
                  <>
                    {useCustomTree && customTreeType ? (
                      renderCustomTree(customTreeType, treePrivacy, treeSize)
                    ) : (
                      <TreeIcon
                        type={treeType}
                        privacy={treePrivacy}
                        size={treeSize}
                      />
                    )}
                  </>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-200 dark:group-hover:text-gray-300 transition-colors duration-300">
                {participantCount.toLocaleString()} participants
              </p>
            </div>
          </div>
          
          {/* Multiple trees (if not showing single tree) */}
          {!showSingleTree && (
            <div className="flex items-end justify-center gap-3 flex-wrap mt-4">
              {defaultQuests.map((quest, index) => (
                <div key={quest.id} className="flex flex-col items-center">
                  <TreeIcon
                    type={getTreeType(index)}
                    privacy={quest.privacyMode}
                    size={getTreeSize(quest.participantCount)}
                  />
                </div>
              ))}
            </div>
          )}
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

