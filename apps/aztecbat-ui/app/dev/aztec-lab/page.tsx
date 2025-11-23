'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import type { SkillProfile } from '@hidden-garden/core-logic';
import type { LeaderboardEntry } from '@hidden-garden/core-logic';

/**
 * Aztec Lab - Developer Testing UI
 * 
 * This is a developer-only lab UI for testing the Aztec integration flow.
 * It calls:
 * - /api/dev/skill-profile → getSkillProfile()
 * - /api/dev/publish-and-fetch → publishAndFetchAztecBuilderLeaderboard()
 */
export default function AztecLabPage() {
  const { address: connectedAddress, isConnected } = useAccount();
  
  // Skill Profile Section
  const [profileAddress, setProfileAddress] = useState<string>(
    connectedAddress || ''
  );
  const [profileChainId, setProfileChainId] = useState<string>('11155111');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileResult, setProfileResult] = useState<SkillProfile | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Reveal Tier Section
  const [revealAddress, setRevealAddress] = useState<string>(
    connectedAddress || ''
  );
  const [revealChainId, setRevealChainId] = useState<string>('11155111');
  const [minTier, setMinTier] = useState<string>('1');
  const [minAverageScore, setMinAverageScore] = useState<string>('60');
  const [revealLoading, setRevealLoading] = useState(false);
  const [revealResult, setRevealResult] = useState<{
    txHash: string;
    skillHash: string;
    leaderboard: LeaderboardEntry[];
  } | null>(null);
  const [revealError, setRevealError] = useState<string | null>(null);

  // Update address when wallet connects/disconnects
  useEffect(() => {
    if (connectedAddress) {
      setProfileAddress(connectedAddress);
      setRevealAddress(connectedAddress);
    }
  }, [connectedAddress]);

  const handleLoadSkillProfile = async () => {
    setProfileLoading(true);
    setProfileError(null);
    setProfileResult(null);

    try {
      const params = new URLSearchParams({
        address: profileAddress,
        chainId: profileChainId,
      });

      const response = await fetch(`/api/dev/skill-profile?${params}`);
      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      setProfileResult(data.profile);
    } catch (error) {
      setProfileError(
        error instanceof Error ? error.message : String(error)
      );
    } finally {
      setProfileLoading(false);
    }
  };

  const handleRevealTier = async () => {
    setRevealLoading(true);
    setRevealError(null);
    setRevealResult(null);

    try {
      const response = await fetch('/api/dev/publish-and-fetch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: revealAddress,
          chainId: parseInt(revealChainId, 10),
          minTier: parseInt(minTier, 10),
          minAverageScore: parseInt(minAverageScore, 10),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      setRevealResult({
        txHash: data.txHash,
        skillHash: data.skillHash,
        leaderboard: data.leaderboard,
      });
    } catch (error) {
      setRevealError(
        error instanceof Error ? error.message : String(error)
      );
    } finally {
      setRevealLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Aztec Lab - Developer Testing UI</h1>
      
      <div style={{ 
        background: '#f0f0f0', 
        padding: '1rem', 
        marginBottom: '2rem',
        borderRadius: '4px'
      }}>
        <p><strong>Note:</strong> This is a developer-only lab UI for testing the Aztec integration flow.</p>
        <p>It calls:</p>
        <ul>
          <li><code>/api/dev/skill-profile</code> → <code>getSkillProfile()</code></li>
          <li><code>/api/dev/publish-and-fetch</code> → <code>publishAndFetchAztecBuilderLeaderboard()</code></li>
        </ul>
        <p>Wallet Status: {isConnected ? `Connected: ${connectedAddress}` : 'Not connected'}</p>
      </div>

      {/* Section 1: Skill Profile */}
      <section style={{ 
        border: '1px solid #ccc', 
        padding: '1.5rem', 
        marginBottom: '2rem',
        borderRadius: '4px'
      }}>
        <h2>Section 1: Skill Profile</h2>
        <p>Tests: <code>getSkillProfile()</code></p>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Address:
            <input
              type="text"
              value={profileAddress}
              onChange={(e) => setProfileAddress(e.target.value)}
              placeholder="0x..."
              style={{
                width: '100%',
                padding: '0.5rem',
                marginTop: '0.25rem',
                fontFamily: 'monospace',
              }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Chain ID:
            <input
              type="text"
              value={profileChainId}
              onChange={(e) => setProfileChainId(e.target.value)}
              placeholder="11155111"
              style={{
                width: '100%',
                padding: '0.5rem',
                marginTop: '0.25rem',
              }}
            />
          </label>
        </div>

        <button
          onClick={handleLoadSkillProfile}
          disabled={profileLoading || !profileAddress}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            cursor: profileLoading || !profileAddress ? 'not-allowed' : 'pointer',
            backgroundColor: profileLoading || !profileAddress ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
          }}
        >
          {profileLoading ? 'Loading...' : 'Load Skill Profile'}
        </button>

        {profileError && (
          <div style={{
            marginTop: '1rem',
            padding: '1rem',
            background: '#fee',
            border: '1px solid #fcc',
            borderRadius: '4px',
          }}>
            <strong>Error:</strong> {profileError}
          </div>
        )}

        {profileResult && (
          <div style={{ marginTop: '1rem' }}>
            <h3>Result:</h3>
            <pre style={{
              background: '#f5f5f5',
              padding: '1rem',
              overflow: 'auto',
              border: '1px solid #ddd',
              borderRadius: '4px',
            }}>
              {JSON.stringify(profileResult, null, 2)}
            </pre>
          </div>
        )}
      </section>

      {/* Section 2: Reveal Tier */}
      <section style={{ 
        border: '1px solid #ccc', 
        padding: '1.5rem',
        borderRadius: '4px'
      }}>
        <h2>Section 2: Reveal Tier (Aztec → Self SBT → L1 → Indexer → Leaderboard)</h2>
        <p>Tests: <code>publishAndFetchAztecBuilderLeaderboard()</code></p>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Address:
            <input
              type="text"
              value={revealAddress}
              onChange={(e) => setRevealAddress(e.target.value)}
              placeholder="0x..."
              style={{
                width: '100%',
                padding: '0.5rem',
                marginTop: '0.25rem',
                fontFamily: 'monospace',
              }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Chain ID:
            <input
              type="text"
              value={revealChainId}
              onChange={(e) => setRevealChainId(e.target.value)}
              placeholder="11155111"
              style={{
                width: '100%',
                padding: '0.5rem',
                marginTop: '0.25rem',
              }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Min Tier:
            <input
              type="number"
              value={minTier}
              onChange={(e) => setMinTier(e.target.value)}
              min="1"
              max="4"
              style={{
                width: '100%',
                padding: '0.5rem',
                marginTop: '0.25rem',
              }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Min Average Score:
            <input
              type="number"
              value={minAverageScore}
              onChange={(e) => setMinAverageScore(e.target.value)}
              min="0"
              max="100"
              style={{
                width: '100%',
                padding: '0.5rem',
                marginTop: '0.25rem',
              }}
            />
          </label>
        </div>

        <button
          onClick={handleRevealTier}
          disabled={revealLoading || !revealAddress}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            cursor: revealLoading || !revealAddress ? 'not-allowed' : 'pointer',
            backgroundColor: revealLoading || !revealAddress ? '#ccc' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
          }}
        >
          {revealLoading ? 'Processing...' : 'Reveal Tier + Fetch Leaderboard'}
        </button>

        {revealError && (
          <div style={{
            marginTop: '1rem',
            padding: '1rem',
            background: '#fee',
            border: '1px solid #fcc',
            borderRadius: '4px',
          }}>
            <strong>Error:</strong> {revealError}
          </div>
        )}

        {revealResult && (
          <div style={{ marginTop: '1rem' }}>
            <h3>Result:</h3>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Transaction Hash:</strong>{' '}
              <code style={{ fontFamily: 'monospace' }}>{revealResult.txHash}</code>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Skill Hash:</strong>{' '}
              <code style={{ fontFamily: 'monospace' }}>{revealResult.skillHash}</code>
            </div>
            
            <h4>Leaderboard Entries:</h4>
            {revealResult.leaderboard.length === 0 ? (
              <p>No entries found.</p>
            ) : (
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                marginTop: '0.5rem',
              }}>
                <thead>
                  <tr style={{ background: '#f0f0f0' }}>
                    <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'left' }}>Rank</th>
                    <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'left' }}>Address</th>
                    <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'left' }}>Tier</th>
                    <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'left' }}>ENS Name</th>
                    <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'left' }}>Tx Hash</th>
                  </tr>
                </thead>
                <tbody>
                  {revealResult.leaderboard.map((entry, index) => (
                    <tr key={entry.id}>
                      <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{index + 1}</td>
                      <td style={{ padding: '0.5rem', border: '1px solid #ddd', fontFamily: 'monospace', fontSize: '0.9em' }}>
                        {entry.user_address}
                      </td>
                      <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{entry.tier}</td>
                      <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{entry.ensName || '-'}</td>
                      <td style={{ padding: '0.5rem', border: '1px solid #ddd', fontFamily: 'monospace', fontSize: '0.8em' }}>
                        {entry.tx_hash.slice(0, 10)}...
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

