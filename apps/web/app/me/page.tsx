'use client';

import * as React from 'react';
import type { SkillNode } from '@hidden-garden/common';
import { normalizeSkillId } from '@hidden-garden/common';
import Link from 'next/link';

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
    </main>
  );
}

