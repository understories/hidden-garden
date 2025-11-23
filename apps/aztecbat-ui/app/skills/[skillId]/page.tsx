/**
 * Skill Detail Page
 *
 * Shows details for a specific skill and provides the "Attempt challenge" entry point.
 * This is step 1 of the user flow: Attempt Challenge (Private Compute)
 */

import { Suspense } from 'react';

type SkillDetailPageProps = {
  params: Promise<{
    skillId: string;
  }>;
  searchParams: Promise<{
    private?: string;
  }>;
};

async function SkillDetailContent({
  skillId,
  isPrivate,
}: {
  skillId: string;
  isPrivate: boolean;
}) {
  return (
    <main className="max-w-2xl mx-auto space-y-6 py-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Skill Detail – Attempt Challenge</h1>
        <p className="text-gray-600 dark:text-gray-400">Skill ID: {skillId}</p>
      </div>

      {isPrivate && (
        <div className="border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <p className="text-sm text-green-800 dark:text-green-200">
            ✓ Kept private. Your attempt remains private and won't appear on leaderboards.
          </p>
        </div>
      )}

      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <p className="text-gray-600 dark:text-gray-400">
          Challenge interface will be implemented here.
        </p>
      </div>
    </main>
  );
}

export default async function SkillDetailPage({
  params,
  searchParams,
}: SkillDetailPageProps) {
  const { skillId: rawSkillId } = await params;
  const skillId = decodeURIComponent(rawSkillId);
  const { private: privateParam } = await searchParams;
  const isPrivate = privateParam === 'true';

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SkillDetailContent skillId={skillId} isPrivate={isPrivate} />
    </Suspense>
  );
}

