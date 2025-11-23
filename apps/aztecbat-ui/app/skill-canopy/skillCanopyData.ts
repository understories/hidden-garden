/**
 * Skill Canopy Data Model
 *
 * Mock data for the isometric skill canopy visualization.
 * In production, this would come from the backend/Aztec.
 */

export type PrivacyMode = 'public-heavy' | 'mixed' | 'private-heavy';

export type Cluster = {
  id: string;
  name: string;
};

export type SkillTreeNode = {
  id: string;
  name: string;
  clusterId: string;
  privacy: PrivacyMode;
  participants: number;
};

// Mock clusters - groups of related skills
export const clusters: Cluster[] = [
  {
    id: 'core-protocol',
    name: 'Core Protocol',
  },
  {
    id: 'rust-noir',
    name: 'Rust & Noir',
  },
  {
    id: 'zk-foundations',
    name: 'ZK Foundations',
  },
  {
    id: 'infrastructure',
    name: 'Infrastructure',
  },
];

// Mock skill tree nodes - skills organized by cluster
export const skillTreeNodes: SkillTreeNode[] = [
  // Core Protocol cluster
  {
    id: 'aztec-protocol',
    name: 'Aztec Protocol',
    clusterId: 'core-protocol',
    privacy: 'private-heavy',
    participants: 1247,
  },
  {
    id: 'zero-knowledge-basics',
    name: 'Zero-Knowledge Basics',
    clusterId: 'core-protocol',
    privacy: 'mixed',
    participants: 892,
  },
  {
    id: 'privacy-circuits',
    name: 'Privacy Circuits',
    clusterId: 'core-protocol',
    privacy: 'private-heavy',
    participants: 634,
  },

  // Rust & Noir cluster
  {
    id: 'rust-foundations',
    name: 'Rust Foundations',
    clusterId: 'rust-noir',
    privacy: 'public-heavy',
    participants: 2156,
  },
  {
    id: 'noir-basics',
    name: 'Aztec Noir Basics',
    clusterId: 'rust-noir',
    privacy: 'public-heavy',
    participants: 1123,
  },
  {
    id: 'advanced-noir',
    name: 'Advanced Noir',
    clusterId: 'rust-noir',
    privacy: 'mixed',
    participants: 445,
  },
  {
    id: 'rust-advanced',
    name: 'Rust Advanced',
    clusterId: 'rust-noir',
    privacy: 'public-heavy',
    participants: 789,
  },

  // ZK Foundations cluster
  {
    id: 'zk-proofs',
    name: 'ZK Proof Systems',
    clusterId: 'zk-foundations',
    privacy: 'mixed',
    participants: 567,
  },
  {
    id: 'circuit-design',
    name: 'Circuit Design',
    clusterId: 'zk-foundations',
    privacy: 'private-heavy',
    participants: 423,
  },
  {
    id: 'zk-applications',
    name: 'ZK Applications',
    clusterId: 'zk-foundations',
    privacy: 'mixed',
    participants: 312,
  },

  // Infrastructure cluster
  {
    id: 'l1-l2-bridging',
    name: 'L1 → L2 Bridging',
    clusterId: 'infrastructure',
    privacy: 'mixed',
    participants: 445,
  },
  {
    id: 'rollup-mechanics',
    name: 'Rollup Mechanics',
    clusterId: 'infrastructure',
    privacy: 'public-heavy',
    participants: 678,
  },
];

// Helper function to get skills by cluster
export function getSkillsByCluster(clusterId: string): SkillTreeNode[] {
  return skillTreeNodes.filter((skill) => skill.clusterId === clusterId);
}

// Helper function to get cluster by ID
export function getClusterById(clusterId: string): Cluster | undefined {
  return clusters.find((cluster) => cluster.id === clusterId);
}

