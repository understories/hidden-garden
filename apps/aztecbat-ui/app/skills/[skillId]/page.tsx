/**
 * Skill Detail Page
 * 
 * Shows details for a specific skill and provides the "Attempt challenge" entry point.
 * This is step 1 of the user flow: Attempt Challenge (Private Compute)
 */

type SkillDetailPageProps = {
  params: Promise<{
    skillId: string;
  }>;
};

export default async function SkillDetailPage({ params }: SkillDetailPageProps) {
  const { skillId: rawSkillId } = await params;
  const skillId = decodeURIComponent(rawSkillId);

  return (
    <main>
      <h1>Skill Detail – Attempt Challenge</h1>
      <p>Skill ID: {skillId}</p>
    </main>
  );
}

