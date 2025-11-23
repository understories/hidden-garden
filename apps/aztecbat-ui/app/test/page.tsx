/**
 * Skill Forest Test Page
 *
 * Testing biological/organic network graph visualization
 * inspired by Obsidian's graph view, with privacy-based color palette.
 */

'use client';

import { useMemo } from 'react';
import { clusters, getSkillsByCluster, skillTreeNodes } from '../skill-canopy/skillCanopyData';

type PrivacyMode = 'public-heavy' | 'mixed' | 'private-heavy';

// Get Ghibli-style privacy colors (matching our design system)
function getPrivacyColor(privacy: PrivacyMode): string {
  switch (privacy) {
    case 'public-heavy':
      return '#7dd87d'; // Soft spring green
    case 'mixed':
      return '#f4a460'; // Soft sandy amber
    case 'private-heavy':
      return '#87ceeb'; // Soft sky blue
  }
}

// Generate node positions in an organic, biological cluster pattern
function generateOrganicLayout(skills: typeof skillTreeNodes) {
  const nodes = skills.map((skill, index) => {
    // Create organic clustering - skills in same cluster are closer together
    const clusterIndex = clusters.findIndex(c => c.id === skill.clusterId);
    const clusterOffset = clusterIndex * (Math.PI * 2 / clusters.length);
    
    // Radial positioning with organic variation
    const baseRadius = 150 + (clusterIndex * 80);
    const angle = clusterOffset + (index % 5) * 0.3 + Math.random() * 0.2;
    const radiusVariation = 30 + Math.random() * 40;
    
    const x = baseRadius * Math.cos(angle) + radiusVariation * (Math.random() - 0.5);
    const y = baseRadius * Math.sin(angle) + radiusVariation * (Math.random() - 0.5);
    
    return {
      id: skill.id,
      name: skill.name,
      privacy: skill.privacy,
      clusterId: skill.clusterId,
      x: x,
      y: y,
      size: skill.participants > 1000 ? 8 : skill.participants > 500 ? 6 : 4,
      connections: [] as string[],
    };
  });
  
  // Generate organic connections - skills in same cluster connect more, some cross-cluster
  const connections: Array<{ from: string; to: string }> = [];
  
  // Within-cluster connections (dense, organic)
  clusters.forEach(cluster => {
    const clusterSkills = nodes.filter(n => n.clusterId === cluster.id);
    clusterSkills.forEach((skill, i) => {
      // Connect to nearby skills in same cluster
      const nearby = clusterSkills.slice(i + 1, i + 3);
      nearby.forEach(other => {
        if (Math.random() > 0.3) { // 70% connection rate within cluster
          connections.push({ from: skill.id, to: other.id });
          skill.connections.push(other.id);
          other.connections.push(skill.id);
        }
      });
    });
  });
  
  // Cross-cluster connections (sparse, like biological bridges)
  nodes.forEach(skill => {
    if (Math.random() > 0.85) { // 15% chance of cross-cluster connection
      const otherCluster = clusters.find(c => c.id !== skill.clusterId);
      if (otherCluster) {
        const otherSkills = nodes.filter(n => n.clusterId === otherCluster.id);
        if (otherSkills.length > 0) {
          const target = otherSkills[Math.floor(Math.random() * otherSkills.length)];
          connections.push({ from: skill.id, to: target.id });
          skill.connections.push(target.id);
          target.connections.push(skill.id);
        }
      }
    }
  });
  
  return { nodes, connections };
}

export default function SkillForestTestPage() {
  const { nodes, connections } = useMemo(() => generateOrganicLayout(skillTreeNodes), []);
  
  // Center the graph
  const centerX = 400;
  const centerY = 400;
  
  return (
    <main className="min-h-screen bg-gray-900 dark:bg-black p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Skill Forest - Biological Network Test</h1>
          <p className="text-gray-400">
            Organic, biological network visualization with privacy-based colors
          </p>
          <div className="mt-4 flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#7dd87d]" />
              <span className="text-gray-300">Public-heavy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#f4a460]" />
              <span className="text-gray-300">Mixed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#87ceeb]" />
              <span className="text-gray-300">Private-heavy</span>
            </div>
          </div>
        </div>
        
        {/* Network Graph Canvas */}
        <div className="relative bg-gray-950 dark:bg-black rounded-lg border border-gray-800 overflow-hidden">
          <svg
            width="100%"
            height="800"
            viewBox="0 0 800 800"
            className="w-full"
            style={{ background: 'radial-gradient(circle at center, #1a1a2e 0%, #0a0a0a 100%)' }}
          >
            {/* Connections (edges) - drawn first so nodes appear on top */}
            <g className="connections">
              {connections.map((conn, i) => {
                const fromNode = nodes.find(n => n.id === conn.from);
                const toNode = nodes.find(n => n.id === conn.to);
                if (!fromNode || !toNode) return null;
                
                return (
                  <line
                    key={`edge-${i}`}
                    x1={centerX + fromNode.x}
                    y1={centerY + fromNode.y}
                    x2={centerX + toNode.x}
                    y2={centerY + toNode.y}
                    stroke="#4a5568"
                    strokeWidth="0.5"
                    opacity="0.4"
                    className="hover:stroke-blue-400 hover:opacity-80 transition-all"
                  />
                );
              })}
            </g>
            
            {/* Nodes */}
            <g className="nodes">
              {nodes.map((node) => {
                const color = getPrivacyColor(node.privacy);
                return (
                  <g key={node.id}>
                    {/* Glow effect */}
                    <circle
                      cx={centerX + node.x}
                      cy={centerY + node.y}
                      r={node.size + 2}
                      fill={color}
                      opacity="0.2"
                      className="animate-pulse"
                    />
                    {/* Main node */}
                    <circle
                      cx={centerX + node.x}
                      cy={centerY + node.y}
                      r={node.size}
                      fill={color}
                      stroke={color}
                      strokeWidth="1"
                      opacity="0.9"
                      className="cursor-pointer hover:r-2 transition-all"
                    >
                      <title>{node.name} ({node.privacy})</title>
                    </circle>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="text-2xl font-bold text-white">{nodes.length}</div>
            <div className="text-sm text-gray-400">Skills</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="text-2xl font-bold text-white">{connections.length}</div>
            <div className="text-sm text-gray-400">Connections</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="text-2xl font-bold text-white">{clusters.length}</div>
            <div className="text-sm text-gray-400">Clusters</div>
          </div>
        </div>
      </div>
    </main>
  );
}

