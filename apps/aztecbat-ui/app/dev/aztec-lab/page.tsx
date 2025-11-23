'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import type { SkillProfile, LeaderboardEntry } from '@hidden-garden/core-logic';
import { CHAINS, getSelfHumanSBTAddress, SelfHumanSBTAbi, createAztecClient } from '@hidden-garden/core-logic';
import { listAllQuests, getQuestDefinition, type QuestDefinition, type QuestSubmission } from '@hidden-garden/game-engine';
import { ethers } from 'ethers';

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
    isHumanVerified?: boolean;
  } | null>(null);
  const [revealError, setRevealError] = useState<string | null>(null);
  const [humanOnlyFilter, setHumanOnlyFilter] = useState<boolean>(false);
  const [filteredLeaderboard, setFilteredLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [enrichingLeaderboard, setEnrichingLeaderboard] = useState<boolean>(false);

  // Quest Testing Section
  const [selectedQuestId, setSelectedQuestId] = useState<string | null>(null);
  const [selectedQuest, setSelectedQuest] = useState<QuestDefinition | null>(null);
  const [questSubmission, setQuestSubmission] = useState<string>('{"selectedOptionId": "0"}');
  const [questValidating, setQuestValidating] = useState<boolean>(false);
  const [questValidationResult, setQuestValidationResult] = useState<any>(null);
  const [questValidationError, setQuestValidationError] = useState<string | null>(null);
  const [questStoring, setQuestStoring] = useState<boolean>(false);
  const [questStorageResult, setQuestStorageResult] = useState<any>(null);

  // Update address when wallet connects/disconnects
  useEffect(() => {
    if (connectedAddress) {
      setProfileAddress(connectedAddress);
      setRevealAddress(connectedAddress);
    }
  }, [connectedAddress]);

  // Set default test address
  useEffect(() => {
    const defaultAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
    if (!profileAddress) {
      setProfileAddress(defaultAddress);
    }
    if (!revealAddress) {
      setRevealAddress(defaultAddress);
    }
  }, []);

  const handleValidateQuest = async () => {
    if (!selectedQuest || !questSubmission) return;

    setQuestValidating(true);
    setQuestValidationError(null);
    setQuestValidationResult(null);

    try {
      const submission: QuestSubmission = JSON.parse(questSubmission);
      const result = selectedQuest.validate(submission);
      
      // Handle async validation
      const validationResult = result instanceof Promise ? await result : result;
      setQuestValidationResult(validationResult);
    } catch (error) {
      setQuestValidationError(
        error instanceof Error ? error.message : 'Invalid JSON or validation failed'
      );
    } finally {
      setQuestValidating(false);
    }
  };

  const handleStoreInAztec = async () => {
    if (!selectedQuest || !questValidationResult || !questValidationResult.success) return;

    setQuestStoring(true);
    setQuestStorageResult(null);

    try {
      // Create Aztec client (mock mode for now)
      const useRealAztec = process.env.NEXT_PUBLIC_USE_REAL_AZTEC === 'true';
      const aztecMode = useRealAztec ? 'real' : 'mock';
      const aztecClient = createAztecClient(aztecMode, {
        pxeUrl: process.env.NEXT_PUBLIC_PXE_URL || 'http://localhost:8080',
      });

      // Store quest completion
      // Use addQuestCompletion with quest ID hash
      const { computeQuestIdHash } = await import('@hidden-garden/core-logic');
      const questIdHash = computeQuestIdHash(selectedQuest.questId);
      const result = await aztecClient.addQuestCompletion(
        questIdHash,
        questValidationResult.score
      );

      setQuestStorageResult(result);
    } catch (error) {
      setQuestStorageResult({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to store in Aztec',
      });
    } finally {
      setQuestStoring(false);
    }
  };

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
          humanOnly: humanOnlyFilter,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      const result = {
        txHash: data.txHash,
        skillHash: data.skillHash,
        leaderboard: data.leaderboard,
        isHumanVerified: data.isHumanVerified,
      };
      setRevealResult(result);
      // Initialize filtered leaderboard with all entries
      setFilteredLeaderboard(data.leaderboard);
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
        <h2>Section 2: Reveal Tier (Aztec → L1 → Indexer → Leaderboard)</h2>
        <p>Tests: <code>publishAndFetchAztecBuilderLeaderboard()</code></p>
        <div style={{ 
          background: '#e3f2fd', 
          padding: '1rem', 
          marginBottom: '1rem',
          borderRadius: '4px',
          fontSize: '0.9rem'
        }}>
          <strong>Mode Selection:</strong> You can compete in:
          <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
            <li><strong>Anon/Agent Mode:</strong> No SBT required (anyone can publish)</li>
            <li><strong>Human-Only Mode:</strong> SBT required (only verified humans can publish)</li>
          </ul>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: '#666' }}>
            Note: SBT verification is optional. The leaderboard can be filtered to show only human-verified entries.
          </p>
        </div>
        
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

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={humanOnlyFilter}
              onChange={(e) => setHumanOnlyFilter(e.target.checked)}
              style={{ width: 'auto' }}
            />
            <span>
              <strong>Filter Leaderboard:</strong> Show only human-verified entries
            </span>
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
            {revealResult.isHumanVerified !== undefined && (
              <div style={{ 
                marginBottom: '1rem',
                padding: '0.75rem',
                background: revealResult.isHumanVerified ? '#e8f5e9' : '#fff3e0',
                border: `1px solid ${revealResult.isHumanVerified ? '#4caf50' : '#ff9800'}`,
                borderRadius: '4px',
              }}>
                <strong>Mode:</strong>{' '}
                {revealResult.isHumanVerified ? (
                  <span style={{ color: '#4caf50' }}>✅ Human-Verified Mode</span>
                ) : (
                  <span style={{ color: '#ff9800' }}>🤖 Anon/Agent Mode</span>
                )}
              </div>
            )}
            
            <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <h4 style={{ margin: 0 }}>Leaderboard Entries ({humanOnlyFilter ? 'Human-Only' : 'All'}):</h4>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={humanOnlyFilter}
                  onChange={async (e) => {
                    const checked = e.target.checked;
                    setHumanOnlyFilter(checked);
                    
                    if (checked && revealResult) {
                      // Enrich leaderboard with SBT status and filter
                      setEnrichingLeaderboard(true);
                      try {
                        const chainId = parseInt(revealChainId, 10);
                        const chainConfig = CHAINS[chainId as any];
                        if (!chainConfig) {
                          throw new Error(`Chain ID ${chainId} is not supported`);
                        }
                        
                        const rpcUrl = chainConfig.rpcUrl || `https://rpc.ankr.com/eth_sepolia`;
                        const provider = new ethers.JsonRpcProvider(rpcUrl);
                        
                        // Enrich entries with human verification status
                        const enrichedEntries = await Promise.all(
                          revealResult.leaderboard.map(async (entry) => {
                            try {
                              const sbtAddress = getSelfHumanSBTAddress(chainId);
                              if (!sbtAddress) {
                                return { ...entry, isHumanVerified: false };
                              }
                              const sbtContract = new ethers.Contract(sbtAddress, SelfHumanSBTAbi, provider);
                              const isHumanVerified = await sbtContract.hasValidSBT(entry.user_address);
                              return { ...entry, isHumanVerified };
                            } catch (error) {
                              return { ...entry, isHumanVerified: false };
                            }
                          })
                        );
                        
                        // Filter to only human-verified entries
                        const filtered = enrichedEntries.filter((entry) => entry.isHumanVerified === true);
                        setFilteredLeaderboard(filtered);
                      } catch (error) {
                        console.error('Failed to enrich leaderboard:', error);
                        setFilteredLeaderboard(revealResult.leaderboard);
                      } finally {
                        setEnrichingLeaderboard(false);
                      }
                    } else {
                      // Show all entries
                      setFilteredLeaderboard(revealResult?.leaderboard || []);
                    }
                  }}
                  style={{ width: 'auto' }}
                />
                <span>
                  <strong>Show only human-verified</strong>
                </span>
              </label>
              {enrichingLeaderboard && (
                <span style={{ color: '#666', fontSize: '0.9rem' }}>Checking SBT status...</span>
              )}
            </div>
            {filteredLeaderboard.length === 0 ? (
              <p>No entries found{humanOnlyFilter ? ' (no human-verified entries)' : ''}.</p>
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
                    <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'left' }}>Verified</th>
                    <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'left' }}>ENS Name</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeaderboard.map((entry, index) => (
                    <tr key={entry.id || index}>
                      <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{index + 1}</td>
                      <td style={{ padding: '0.5rem', border: '1px solid #ddd', fontFamily: 'monospace', fontSize: '0.9em' }}>
                        {entry.user_address}
                      </td>
                      <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{entry.tier}</td>
                      <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>
                        {entry.isHumanVerified ? (
                          <span style={{ color: '#4caf50' }}>✅ Human</span>
                        ) : (
                          <span style={{ color: '#999' }}>🤖 Anon</span>
                        )}
                      </td>
                      <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{entry.ensName || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </section>

      {/* Section 3: Quest Testing */}
      <section style={{ 
        border: '1px solid #ccc', 
        padding: '1.5rem',
        marginTop: '2rem',
        borderRadius: '4px'
      }}>
        <h2>Section 3: Quest Testing (Validate & Store in Aztec)</h2>
        <p>Tests: Quest validation and Aztec quest completion storage</p>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Select Quest:
            <select
              value={selectedQuestId || ''}
              onChange={(e) => {
                const questId = e.target.value;
                setSelectedQuestId(questId || null);
                if (questId) {
                  const quest = getQuestDefinition(questId);
                  if (quest) {
                    setSelectedQuest(quest);
                    // Set default submission based on quest type
                    if (quest.type === 'multiple_choice') {
                      setQuestSubmission('{"selectedOptionId": "0"}');
                    } else if (quest.type === 'numeric_input') {
                      setQuestSubmission('{"numericValue": 0}');
                    } else {
                      setQuestSubmission('{}');
                    }
                  } else {
                    setSelectedQuest(null);
                  }
                } else {
                  setSelectedQuest(null);
                }
              }}
              style={{
                width: '100%',
                padding: '0.5rem',
                marginTop: '0.25rem',
              }}
            >
              <option value="">-- Select a quest --</option>
              {listAllQuests().map((quest) => (
                <option key={quest.questId} value={quest.questId}>
                  {quest.name} (Tier {quest.tier}, {quest.type})
                </option>
              ))}
            </select>
          </label>
        </div>

        {selectedQuest && (
          <>
            <div style={{ 
              background: '#f5f5f5', 
              padding: '1rem', 
              marginBottom: '1rem',
              borderRadius: '4px',
              fontSize: '0.9rem'
            }}>
              <div><strong>Quest:</strong> {selectedQuest.name}</div>
              <div><strong>Tier:</strong> {selectedQuest.tier}</div>
              <div><strong>Type:</strong> {selectedQuest.type}</div>
              <div style={{ marginTop: '0.5rem' }}><strong>Prompt:</strong></div>
              <div style={{ whiteSpace: 'pre-wrap', marginTop: '0.25rem' }}>{selectedQuest.prompt}</div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                Submission (JSON):
                <textarea
                  value={questSubmission}
                  onChange={(e) => setQuestSubmission(e.target.value)}
                  style={{
                    width: '100%',
                    minHeight: '100px',
                    padding: '0.5rem',
                    fontFamily: 'monospace',
                    fontSize: '0.9rem',
                    marginTop: '0.25rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                  }}
                  placeholder='{"selectedOptionId": "0"} or {"numericValue": 42}'
                />
              </label>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <button
                onClick={handleValidateQuest}
                disabled={questValidating || !selectedQuest || !questSubmission}
                style={{
                  padding: '0.75rem 1.5rem',
                  fontSize: '1rem',
                  cursor: questValidating || !selectedQuest || !questSubmission ? 'not-allowed' : 'pointer',
                  backgroundColor: questValidating || !selectedQuest || !questSubmission ? '#ccc' : '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                }}
              >
                {questValidating ? 'Validating...' : 'Validate Quest'}
              </button>

              <button
                onClick={handleStoreInAztec}
                disabled={questStoring || !selectedQuest || !questValidationResult || !questValidationResult.success}
                style={{
                  padding: '0.75rem 1.5rem',
                  fontSize: '1rem',
                  cursor: questStoring || !selectedQuest || !questValidationResult || !questValidationResult.success ? 'not-allowed' : 'pointer',
                  backgroundColor: questStoring || !selectedQuest || !questValidationResult || !questValidationResult.success ? '#ccc' : '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                }}
              >
                {questStoring ? 'Storing...' : 'Store in Aztec'}
              </button>
            </div>

            {questValidationError && (
              <div style={{
                marginTop: '1rem',
                padding: '1rem',
                background: '#fee',
                border: '1px solid #fcc',
                borderRadius: '4px',
              }}>
                <strong>Validation Error:</strong> {questValidationError}
              </div>
            )}

            {questValidationResult && (
              <div style={{
                marginTop: '1rem',
                padding: '1rem',
                background: questValidationResult.success ? '#e8f5e9' : '#fff3e0',
                border: `1px solid ${questValidationResult.success ? '#4caf50' : '#ff9800'}`,
                borderRadius: '4px',
              }}>
                <div><strong>Success:</strong> {questValidationResult.success ? '✅ Yes' : '❌ No'}</div>
                <div><strong>Score:</strong> {questValidationResult.score}%</div>
                <div><strong>Feedback:</strong> {questValidationResult.feedback}</div>
              </div>
            )}

            {questStorageResult && (
              <div style={{
                marginTop: '1rem',
                padding: '1rem',
                background: questStorageResult.success ? '#e8f5e9' : '#fee',
                border: `1px solid ${questStorageResult.success ? '#4caf50' : '#fcc'}`,
                borderRadius: '4px',
              }}>
                {questStorageResult.success ? (
                  <>
                    <div><strong>✅ Stored in Aztec!</strong></div>
                    <div><strong>Transaction Hash:</strong> <code style={{ fontFamily: 'monospace' }}>{questStorageResult.transactionHash}</code></div>
                    <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
                      Quest completion is now stored privately in your Aztec vault.
                    </div>
                  </>
                ) : (
                  <div><strong>❌ Storage Failed:</strong> {questStorageResult.error}</div>
                )}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

