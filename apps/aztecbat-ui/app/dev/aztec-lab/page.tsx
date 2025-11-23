'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import type { SkillProfile, LeaderboardEntry, ArkivSkillProfilePayload } from '@hidden-garden/core-logic';
import { 
  CHAINS, 
  getSelfHumanSBTAddress, 
  SelfHumanSBTAbi, 
  createAztecClient,
  computeQuestIdHash,
  computeCategoryHash,
  computePathHash,
  stringToBytes,
  encodeTierProofPublicInputs,
  hashSkillName,
  getExplorerTxUrl,
} from '@hidden-garden/core-logic';
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
  
  // Sample wallet address (Hardhat default test account)
  const SAMPLE_WALLET_ADDRESS = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
  
  // Skill Profile Section
  const [profileAddress, setProfileAddress] = useState<string>(
    connectedAddress || ''
  );
  const [profileChainId, setProfileChainId] = useState<string>('31337');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileResult, setProfileResult] = useState<SkillProfile | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Reveal Tier Section
  const [revealAddress, setRevealAddress] = useState<string>(
    connectedAddress || ''
  );
  const [revealChainId, setRevealChainId] = useState<string>('31337');
  const [selectedTier, setSelectedTier] = useState<string>('1');
  const [minAverageScore, setMinAverageScore] = useState<string>('60');
  const [requireSelf, setRequireSelf] = useState<boolean>(false);
  const [revealLoading, setRevealLoading] = useState(false);
  const [revealResult, setRevealResult] = useState<{
    txHash: string;
    skillHash: string;
    leaderboard: LeaderboardEntry[];
    isHumanVerified?: boolean;
    indexerAvailable?: boolean;
    warning?: string;
  } | null>(null);
  const [revealError, setRevealError] = useState<string | null>(null);
  const [humanOnlyFilter, setHumanOnlyFilter] = useState<boolean>(false);
  const [filteredLeaderboard, setFilteredLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [enrichingLeaderboard, setEnrichingLeaderboard] = useState<boolean>(false);

  // Public Profile Modal
  const [publicProfileAddress, setPublicProfileAddress] = useState<string | null>(null);
  const [publicProfile, setPublicProfile] = useState<{
    address: string;
    humanVerified: boolean;
    aztecBuilderTier: number | null;
    aztecBuilderSkillHash: string | null;
  } | null>(null);
  const [loadingPublicProfile, setLoadingPublicProfile] = useState(false);

  // Cryptographic Computations Section
  const [cryptoQuestId, setCryptoQuestId] = useState<string>('aztec_concept_quiz');
  const [cryptoCategory, setCryptoCategory] = useState<string>('aztec_builder');
  const [cryptoPath, setCryptoPath] = useState<string>('aztec_builder_path');
  const [cryptoUserAddress, setCryptoUserAddress] = useState<string>(connectedAddress || '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
  const [cryptoMinTier, setCryptoMinTier] = useState<string>('1');
  const [cryptoComputations, setCryptoComputations] = useState<any>(null);

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
      // Require real Aztec PXE connection
      const pxeUrl = process.env.NEXT_PUBLIC_PXE_URL || 'http://localhost:8080';
      
      // Verify PXE is reachable
      try {
        const response = await fetch(pxeUrl, { 
          method: 'GET',
          signal: AbortSignal.timeout(3000)
        });
        if (!response.ok) {
          throw new Error(`PXE returned status ${response.status}`);
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        setQuestStorageResult({
          success: false,
          error: `Aztec PXE is not available at ${pxeUrl}.\n\n` +
                 `Error: ${errorMsg}\n\n` +
                 `To start Aztec sandbox:\n` +
                 `  pnpm aztec:sandbox\n\n` +
                 `Or with Docker:\n` +
                 `  docker run -it -p 8080:8080 aztecprotocol/sandbox:latest\n\n` +
                 `Please ensure the Aztec sandbox is running.`
        });
        return;
      }

      const aztecClient = createAztecClient('real', {
        pxeUrl,
      });

      // Store quest completion
      // Use addQuestCompletion with quest ID hash
      const { computeQuestIdHash } = await import('@hidden-garden/core-logic');
      
      let questIdHash;
      try {
        questIdHash = computeQuestIdHash(selectedQuest.questId);
      } catch (error) {
        // If hash computation fails (placeholder), show helpful error
        const errorMsg = error instanceof Error ? error.message : String(error);
        setQuestStorageResult({
          success: false,
          error: `${errorMsg}\n\n💡 For demo, use quests with computed hashes:\n- aztec_concept_quiz\n- noir_syntax_basics\n- aztec_storage_intro`,
        });
        return;
      }

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
          minTier: parseInt(selectedTier, 10),
          minAverageScore: parseInt(minAverageScore, 10),
          requireSBT: requireSelf,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      const result = {
        txHash: data.txHash,
        skillHash: data.skillHash,
        leaderboard: data.leaderboard || [],
        isHumanVerified: data.isHumanVerified,
        indexerAvailable: data.indexerAvailable !== false, // Default to true if not specified
        warning: data.warning,
      };
      setRevealResult(result);
      // Initialize filtered leaderboard with all entries
      setFilteredLeaderboard(data.leaderboard || []);
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
        
        {/* Connect Sample Wallet Button */}
        <div style={{ 
          marginTop: '0.75rem',
          padding: '0.75rem',
          background: '#e3f2fd',
          borderRadius: '4px',
          border: '1px solid #90caf9'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <strong>🧪 Dev Testing:</strong> Connect sample wallet for quick testing
              <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>
                Sample wallet: <code style={{ fontFamily: 'monospace' }}>{SAMPLE_WALLET_ADDRESS}</code>
              </div>
            </div>
            <button
              onClick={() => {
                // Set all address fields to sample wallet
                setProfileAddress(SAMPLE_WALLET_ADDRESS);
                setRevealAddress(SAMPLE_WALLET_ADDRESS);
                setCryptoUserAddress(SAMPLE_WALLET_ADDRESS);
                // Also set chain ID to local Hardhat
                setProfileChainId('31337');
                setRevealChainId('31337');
              }}
              style={{
                padding: '0.5rem 1rem',
                background: '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 'bold',
              }}
            >
              {profileAddress === SAMPLE_WALLET_ADDRESS && revealAddress === SAMPLE_WALLET_ADDRESS ? '✅ Sample Wallet Connected' : 'Connect Sample Wallet'}
            </button>
          </div>
        </div>
        
        <div style={{ 
          background: '#e8f5e9', 
          padding: '0.75rem', 
          marginTop: '0.5rem',
          borderRadius: '4px',
          border: '1px solid #81c784'
        }}>
          <strong>🔐 Real Aztec Mode:</strong> This dev UI <strong>always uses real Aztec</strong> to demonstrate privacy-preserving cryptographic operations. 
          Ensure Aztec devnet is running at <code>http://localhost:8080</code>.
        </div>
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
            
            {/* My Private Progress Card */}
            {profileResult.questSummaries && profileResult.questSummaries.length > 0 && (
              <div style={{
                marginTop: '1.5rem',
                padding: '1.5rem',
                background: '#f0f4ff',
                border: '1px solid #b3c9ff',
                borderRadius: '4px',
              }}>
                <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>
                  🔒 My Private Progress
                </h3>
                <p style={{
                  fontSize: '0.85rem',
                  color: '#666',
                  marginBottom: '1rem',
                  fontStyle: 'italic',
                }}>
                  This mirrors what we store privately in Aztec. Only the tier proof below ever leaves the garden.
                </p>
                
                <div style={{
                  display: 'grid',
                  gap: '0.5rem',
                }}>
                  {profileResult.questSummaries.map((quest) => (
                    <div
                      key={quest.id}
                      style={{
                        padding: '0.75rem',
                        background: quest.status === 'completed' ? '#e8f5e9' : '#fafafa',
                        border: `1px solid ${quest.status === 'completed' ? '#81c784' : '#ddd'}`,
                        borderRadius: '4px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                          {quest.title}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#666' }}>
                          {quest.status === 'completed' ? (
                            <>✅ Completed {quest.score !== null && `(Score: ${quest.score}%)`}</>
                          ) : (
                            <>⏳ Not started</>
                          )}
                        </div>
                      </div>
                      {quest.status === 'completed' && quest.score !== null && (
                        <div style={{
                          fontSize: '1.25rem',
                          fontWeight: 'bold',
                          color: quest.score >= 60 ? '#4caf50' : '#ff9800',
                        }}>
                          {quest.score}%
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div style={{
                  marginTop: '1rem',
                  padding: '0.75rem',
                  background: '#fff',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                }}>
                  <strong>Summary:</strong> {profileResult.questsCompleted || 0} of {profileResult.questSummaries.length} quests completed
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Section 2: Select What to Reveal */}
      <section style={{ 
        border: '1px solid #ccc', 
        padding: '1.5rem',
        marginTop: '2rem',
        borderRadius: '4px'
      }}>
        <h2>Section 2: Select What to Reveal</h2>
        <p>Choose which tier and score to reveal to the leaderboard</p>
        
        <div style={{ 
          background: '#fff3e0', 
          padding: '1rem', 
          marginBottom: '1rem',
          borderRadius: '4px',
          fontSize: '0.9rem'
        }}>
          <strong>💡 How it works:</strong> Select a tier and minimum score to prove. This generates a ZK proof that you've achieved at least that tier without revealing individual quest completions or scores.
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Tier Selection:
          </label>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {[1, 2].map((tier) => (
              <label key={tier} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="tier"
                  value={tier.toString()}
                  checked={selectedTier === tier.toString()}
                  onChange={(e) => setSelectedTier(e.target.value)}
                  style={{ marginRight: '0.5rem', width: 'auto' }}
                />
                <span>
                  Tier {tier}
                  {tier === 1 && ' (Aztec Explorer)'}
                  {tier === 2 && ' (Noir Novice)'}
                </span>
              </label>
            ))}
          </div>
          <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>
            Max Tier 2 available for now (hardcoded for demo)
          </p>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Minimum Average Score: {minAverageScore}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={minAverageScore}
            onChange={(e) => setMinAverageScore(e.target.value)}
            style={{ width: '100%' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={requireSelf}
              onChange={(e) => setRequireSelf(e.target.checked)}
              style={{ marginRight: '0.5rem', width: 'auto' }}
            />
            <span style={{ fontWeight: 'bold' }}>
              Require Self proof of human
            </span>
          </label>
          <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem', marginLeft: '1.75rem' }}>
            {requireSelf 
              ? 'Only verified humans can publish (Human-Only Mode)'
              : 'Anyone can publish, including anons and agents (Anon/Agent Mode)'}
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
              placeholder="31337"
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
          disabled={revealLoading || !revealAddress || !selectedTier || !minAverageScore}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            cursor: revealLoading || !revealAddress || !selectedTier || !minAverageScore ? 'not-allowed' : 'pointer',
            backgroundColor: revealLoading || !revealAddress || !selectedTier || !minAverageScore ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
          }}
        >
          {revealLoading ? 'Revealing...' : '🔓 Reveal Selected Tier'}
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
            <h3>✅ Reveal Successful!</h3>
            <div style={{ marginBottom: '1rem', padding: '0.75rem', background: '#e8f5e9', border: '1px solid #4caf50', borderRadius: '4px' }}>
              <strong>Revealed Tier:</strong> {selectedTier} | <strong>Min Score:</strong> {minAverageScore}%
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Transaction Hash:</strong>{' '}
              {(() => {
                const chainId = parseInt(revealChainId, 10);
                const explorerUrl = getExplorerTxUrl(chainId, revealResult.txHash);
                if (explorerUrl) {
                  return (
                    <a
                      href={explorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontFamily: 'monospace',
                        color: '#2196F3',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                      }}
                    >
                      {revealResult.txHash}
                      <span style={{ marginLeft: '0.25rem' }}>🔗</span>
                    </a>
                  );
                }
                return (
                  <code style={{ fontFamily: 'monospace' }}>
                    {revealResult.txHash}
                    {chainId === 31337 && (
                      <span style={{ marginLeft: '0.5rem', fontSize: '0.85rem', color: '#666' }}>
                        (Local Hardhat - no explorer available)
                      </span>
                    )}
                  </code>
                );
              })()}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Skill Hash:</strong>{' '}
              <code style={{ fontFamily: 'monospace' }}>{revealResult.skillHash}</code>
            </div>
            
            {/* Show warning if indexer timed out but transaction succeeded */}
            {revealResult.warning && (
              <div style={{
                marginBottom: '1rem',
                padding: '1rem',
                background: '#fff3e0',
                border: '1px solid #ffb74d',
                borderRadius: '4px',
              }}>
                <strong>⚠️ Indexer Status:</strong>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>
                  {revealResult.warning}
                </p>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: '#666' }}>
                  <strong>✅ Transaction Successful:</strong> Your tier proof was submitted to the blockchain. 
                  The indexer may need more time to process the event, or it may not be running.
                </p>
              </div>
            )}
            
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
              <h4 style={{ margin: 0 }}>
              Leaderboard Entries ({humanOnlyFilter ? 'Human-Only' : 'All'})
              {revealResult.indexerAvailable === false && (
                <span style={{ fontSize: '0.85rem', color: '#ff9800', marginLeft: '0.5rem' }}>
                  (Indexer not available - showing empty)
                </span>
              )}
            </h4>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={humanOnlyFilter}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setHumanOnlyFilter(checked);
                    
                    // Filter entries based on human verification status
                    // Entries are already enriched with isHumanVerified from the orchestrator
                    if (checked && revealResult) {
                      const filtered = revealResult.leaderboard.filter((entry) => entry.isHumanVerified === true);
                      setFilteredLeaderboard(filtered);
                    } else {
                      // Show all entries
                      setFilteredLeaderboard(revealResult?.leaderboard || []);
                    }
                  }}
                  style={{ width: 'auto' }}
                />
                <span>
                  <strong>[{humanOnlyFilter ? 'x' : ' '}] Humans only (require Self SBT)</strong>
                </span>
              </label>
              {!humanOnlyFilter && (
                <span style={{ fontSize: '0.85rem', color: '#666', marginLeft: '1.5rem' }}>
                  [ ] Include agents
                </span>
              )}
              {enrichingLeaderboard && (
                <span style={{ color: '#666', fontSize: '0.9rem' }}>Checking SBT status...</span>
              )}
            </div>
            {filteredLeaderboard.length === 0 ? (
              <div>
                <p>No entries found{humanOnlyFilter ? ' (no human-verified entries)' : ''}.</p>
                {revealResult.indexerAvailable === false && (
                  <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
                    💡 <strong>Tip:</strong> The transaction was successful, but the indexer hasn't processed it yet. 
                    You can check the transaction on the blockchain explorer using the transaction hash above.
                  </p>
                )}
              </div>
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
                    <tr 
                      key={entry.id || index}
                      onClick={async () => {
                        setPublicProfileAddress(entry.user_address);
                        setLoadingPublicProfile(true);
                        try {
                          const response = await fetch(
                            `/api/dev/public-profile?address=${encodeURIComponent(entry.user_address)}&chainId=${revealChainId}`
                          );
                          const data = await response.json();
                          if (data.ok && data.profile) {
                            setPublicProfile(data.profile);
                          } else {
                            console.error('Failed to load public profile:', data.error);
                            setPublicProfile(null);
                          }
                        } catch (error) {
                          console.error('Error loading public profile:', error);
                          setPublicProfile(null);
                        } finally {
                          setLoadingPublicProfile(false);
                        }
                      }}
                      style={{ 
                        cursor: 'pointer',
                        transition: 'background-color 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f5f5f5';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '';
                      }}
                    >
                      <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{index + 1}</td>
                      <td style={{ padding: '0.5rem', border: '1px solid #ddd', fontFamily: 'monospace', fontSize: '0.9em' }}>
                        {entry.user_address}
                      </td>
                      <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{entry.tier}</td>
                      <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>
                        {entry.isHumanVerified ? (
                          <span style={{ color: '#4caf50' }}>✅ Human (Self SBT)</span>
                        ) : (
                          <span style={{ color: '#999' }}>🤖 Agent / Anon</span>
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

      {/* Public Profile Modal */}
      {(publicProfileAddress || publicProfile) && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => {
            setPublicProfileAddress(null);
            setPublicProfile(null);
          }}
        >
          <div
            style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '8px',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '90vh',
              overflow: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0 }}>Public Profile</h2>
              <button
                onClick={() => {
                  setPublicProfileAddress(null);
                  setPublicProfile(null);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  padding: '0.25rem 0.5rem',
                }}
              >
                ×
              </button>
            </div>

            {loadingPublicProfile ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <p>Loading public profile...</p>
              </div>
            ) : publicProfile ? (
              <div>
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Address:</strong>{' '}
                  <code style={{ fontFamily: 'monospace', fontSize: '0.9em' }}>
                    {publicProfile.address}
                  </code>
                </div>

                <div style={{ marginBottom: '1rem', padding: '0.75rem', background: '#f0f0f0', borderRadius: '4px' }}>
                  <strong>Human verified:</strong>{' '}
                  {publicProfile.humanVerified ? (
                    <span style={{ color: '#4caf50' }}>✅ Yes (Self SBT)</span>
                  ) : (
                    <span style={{ color: '#999' }}>❌ No</span>
                  )}
                </div>

                <div style={{ marginBottom: '1rem', padding: '0.75rem', background: '#f0f0f0', borderRadius: '4px' }}>
                  <strong>Revealed Aztec builder tier:</strong>{' '}
                  {publicProfile.aztecBuilderTier !== null ? (
                    <span style={{ fontWeight: 'bold', color: '#2196F3' }}>{publicProfile.aztecBuilderTier}</span>
                  ) : (
                    <span style={{ color: '#999' }}>Not revealed</span>
                  )}
                </div>

                <div style={{ 
                  marginTop: '2rem', 
                  padding: '1rem', 
                  background: '#fff3e0', 
                  border: '1px solid #ffb74d',
                  borderRadius: '4px',
                }}>
                  <h3 style={{ marginTop: 0, marginBottom: '0.75rem' }}>Private data:</h3>
                  <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                    <li>🔒 Individual quest scores</li>
                    <li>🔒 Quest list</li>
                    <li>🔒 Average score</li>
                  </ul>
                  <p style={{ marginTop: '0.75rem', marginBottom: 0, fontSize: '0.9rem', color: '#666', fontStyle: 'italic' }}>
                    This data is stored privately in Aztec and never revealed publicly.
                  </p>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <p>Failed to load public profile</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Section 3: Cryptographic Computations */}
      <section style={{ 
        border: '1px solid #ccc', 
        padding: '1.5rem',
        marginTop: '2rem',
        borderRadius: '4px',
        background: '#f9f9f9'
      }}>
        <h2>Section 3: Cryptographic Computations (Real Aztec)</h2>
        <p>See cryptographic operations in real-time: Pedersen hashing, proof generation, and ABI encoding.</p>
        
        <div style={{ 
          background: '#e3f2fd', 
          padding: '1rem', 
          marginBottom: '1rem',
          borderRadius: '4px',
          fontSize: '0.9rem'
        }}>
          <strong>🔐 Real Aztec Privacy:</strong> This section demonstrates actual cryptographic computations:
          <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
            <li><strong>Pedersen Hashing:</strong> Quest IDs, categories, and paths → Pedersen hash (matches Noir circuit)</li>
            <li><strong>ZK Proof Generation:</strong> Private quest completions → Zero-knowledge proof (when using real Aztec)</li>
            <li><strong>Public Inputs Encoding:</strong> ABI encoding for L1 contract verification</li>
            <li><strong>Skill Hash Computation:</strong> Skill path → Pedersen hash</li>
          </ul>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              Quest ID:
              <input
                type="text"
                value={cryptoQuestId}
                onChange={(e) => setCryptoQuestId(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                placeholder="aztec_concept_quiz"
              />
            </label>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              Category:
              <input
                type="text"
                value={cryptoCategory}
                onChange={(e) => setCryptoCategory(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                placeholder="aztec_builder"
              />
            </label>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              Path:
              <input
                type="text"
                value={cryptoPath}
                onChange={(e) => setCryptoPath(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                placeholder="aztec_builder_path"
              />
            </label>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              User Address:
              <input
                type="text"
                value={cryptoUserAddress}
                onChange={(e) => setCryptoUserAddress(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem', fontFamily: 'monospace' }}
                placeholder="0x..."
              />
            </label>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              Min Tier:
              <input
                type="number"
                value={cryptoMinTier}
                onChange={(e) => setCryptoMinTier(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                min="1"
                max="4"
              />
            </label>
          </div>
        </div>

        <button
          onClick={() => {
            try {
              // Compute quest ID hash
              const questBytes = stringToBytes(cryptoQuestId);
              const questHash = computeQuestIdHash(cryptoQuestId);
              
              // Compute category hash
              const categoryBytes = stringToBytes(cryptoCategory);
              const categoryHash = computeCategoryHash(cryptoCategory as any);
              
              // Compute path hash
              const pathBytes = stringToBytes(cryptoPath);
              const pathHash = computePathHash(cryptoPath);
              
              // Compute skill hash (for tier proof)
              const skillHash = hashSkillName(cryptoPath);
              
              // Encode public inputs for L1 contract
              const publicInputs = encodeTierProofPublicInputs(
                cryptoUserAddress as `0x${string}`,
                skillHash,
                parseInt(cryptoMinTier, 10)
              );
              
              setCryptoComputations({
                quest: {
                  id: cryptoQuestId,
                  bytes: questBytes,
                  bytesHex: questBytes.map(b => `0x${b.toString(16).padStart(2, '0')}`).join(', '),
                  hash: questHash,
                },
                category: {
                  id: cryptoCategory,
                  bytes: categoryBytes,
                  bytesHex: categoryBytes.map(b => `0x${b.toString(16).padStart(2, '0')}`).join(', '),
                  hash: categoryHash,
                },
                path: {
                  id: cryptoPath,
                  bytes: pathBytes,
                  bytesHex: pathBytes.map(b => `0x${b.toString(16).padStart(2, '0')}`).join(', '),
                  hash: pathHash,
                },
                skillHash: skillHash,
                publicInputs: {
                  userAddress: cryptoUserAddress,
                  skillHash: skillHash,
                  minTier: parseInt(cryptoMinTier, 10),
                  encoded: publicInputs,
                  abiTypes: ['address', 'bytes32', 'uint8'],
                },
              });
            } catch (error) {
              alert(`Error computing: ${error instanceof Error ? error.message : String(error)}`);
            }
          }}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold',
          }}
        >
          Compute Cryptographic Operations
        </button>

        {cryptoComputations && (
          <div style={{ marginTop: '2rem', background: 'white', padding: '1.5rem', borderRadius: '4px', border: '1px solid #ddd' }}>
            <h3 style={{ marginTop: 0 }}>🔐 Cryptographic Computations</h3>
            
            {/* Quest ID Hash */}
            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f5f5f5', borderRadius: '4px' }}>
              <h4 style={{ marginTop: 0, color: '#1976D2' }}>1. Quest ID → Pedersen Hash</h4>
              <div style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
                <div><strong>Input:</strong> "{cryptoComputations.quest.id}"</div>
                <div style={{ marginTop: '0.5rem' }}>
                  <strong>Bytes (ASCII):</strong> [{cryptoComputations.quest.bytes.join(', ')}]
                </div>
                <div style={{ marginTop: '0.5rem' }}>
                  <strong>Bytes (Hex):</strong> [{cryptoComputations.quest.bytesHex}]
                </div>
                <div style={{ marginTop: '0.5rem', color: '#4caf50', fontWeight: 'bold' }}>
                  <strong>Pedersen Hash:</strong> {cryptoComputations.quest.hash}
                </div>
                <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#666' }}>
                  <em>Noir: hash::pedersen_hash([{cryptoComputations.quest.bytes.join(', ')}])</em>
                </div>
              </div>
            </div>

            {/* Category Hash */}
            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f5f5f5', borderRadius: '4px' }}>
              <h4 style={{ marginTop: 0, color: '#1976D2' }}>2. Category → Pedersen Hash</h4>
              <div style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
                <div><strong>Input:</strong> "{cryptoComputations.category.id}"</div>
                <div style={{ marginTop: '0.5rem' }}>
                  <strong>Bytes (ASCII):</strong> [{cryptoComputations.category.bytes.join(', ')}]
                </div>
                <div style={{ marginTop: '0.5rem' }}>
                  <strong>Bytes (Hex):</strong> [{cryptoComputations.category.bytesHex}]
                </div>
                <div style={{ marginTop: '0.5rem', color: '#4caf50', fontWeight: 'bold' }}>
                  <strong>Pedersen Hash:</strong> {cryptoComputations.category.hash}
                </div>
                <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#666' }}>
                  <em>Noir: hash::pedersen_hash([{cryptoComputations.category.bytes.join(', ')}])</em>
                </div>
              </div>
            </div>

            {/* Path Hash */}
            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f5f5f5', borderRadius: '4px' }}>
              <h4 style={{ marginTop: 0, color: '#1976D2' }}>3. Path → Pedersen Hash (Skill Hash)</h4>
              <div style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
                <div><strong>Input:</strong> "{cryptoComputations.path.id}"</div>
                <div style={{ marginTop: '0.5rem' }}>
                  <strong>Bytes (ASCII):</strong> [{cryptoComputations.path.bytes.join(', ')}]
                </div>
                <div style={{ marginTop: '0.5rem' }}>
                  <strong>Bytes (Hex):</strong> [{cryptoComputations.path.bytesHex}]
                </div>
                <div style={{ marginTop: '0.5rem', color: '#4caf50', fontWeight: 'bold' }}>
                  <strong>Pedersen Hash (Skill Hash):</strong> {cryptoComputations.skillHash}
                </div>
                <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#666' }}>
                  <em>Noir: hash::pedersen_hash([{cryptoComputations.path.bytes.join(', ')}])</em>
                </div>
              </div>
            </div>

            {/* Public Inputs Encoding */}
            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#fff3e0', borderRadius: '4px', border: '1px solid #ffb74d' }}>
              <h4 style={{ marginTop: 0, color: '#F57C00' }}>4. Public Inputs Encoding (ABI Encoding)</h4>
              <div style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>For L1 Contract Verification:</strong>
                </div>
                <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: 'white', borderRadius: '2px' }}>
                  <div><strong>User Address:</strong> {cryptoComputations.publicInputs.userAddress}</div>
                  <div style={{ marginTop: '0.25rem' }}><strong>Skill Hash:</strong> {cryptoComputations.publicInputs.skillHash}</div>
                  <div style={{ marginTop: '0.25rem' }}><strong>Min Tier:</strong> {cryptoComputations.publicInputs.minTier} (uint8)</div>
                </div>
                <div style={{ marginTop: '0.5rem' }}>
                  <strong>ABI Types:</strong> {cryptoComputations.publicInputs.abiTypes.join(', ')}
                </div>
                <div style={{ marginTop: '0.5rem', color: '#4caf50', fontWeight: 'bold', wordBreak: 'break-all' }}>
                  <strong>Encoded (abi.encode):</strong> {cryptoComputations.publicInputs.encoded}
                </div>
                <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#666' }}>
                  <em>This encoded data is sent to SkillLeaderboard.submitSkillTierWithProof() for L1 verification</em>
                </div>
              </div>
            </div>

            {/* ZK Proof Note */}
            <div style={{ padding: '1rem', background: '#e8f5e9', borderRadius: '4px', border: '1px solid #81c784' }}>
              <h4 style={{ marginTop: 0, color: '#2e7d32' }}>5. Zero-Knowledge Proof Generation</h4>
              <div style={{ fontSize: '0.9rem' }}>
                <p style={{ margin: '0.5rem 0' }}>
                  <strong>When using Real Aztec Client:</strong>
                </p>
                <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
                  <li>Private quest completions are stored in Aztec private vault</li>
                  <li>Noir circuit generates ZK proof that proves tier ≥ {cryptoMinTier} without revealing quest details</li>
                  <li>Proof is verified on L1 using the encoded public inputs above</li>
                  <li>Privacy: Quest IDs, scores, and completion details remain private</li>
                </ul>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: '#666' }}>
                  <em>To see actual proof generation, use "Reveal Tier" section with Real Aztec client enabled.</em>
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Section 4: Quest Testing */}
      <section style={{ 
        border: '1px solid #ccc', 
        padding: '1.5rem',
        marginTop: '2rem',
        borderRadius: '4px'
      }}>
        <h2>Section 4: Quest Testing (Validate & Store in Aztec)</h2>
        <p>Tests: Quest validation and Aztec quest completion storage</p>
        <div style={{ 
          background: '#fff3e0', 
          padding: '1rem', 
          marginBottom: '1rem',
          borderRadius: '4px',
          fontSize: '0.9rem'
        }}>
          <strong>💡 Demo Tip:</strong> Use quests with computed hashes for best results:
          <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
            <li><strong>aztec_concept_quiz</strong> - Tier 1, multiple_choice</li>
            <li><strong>noir_syntax_basics</strong> - Tier 2, multiple_choice</li>
            <li><strong>aztec_storage_intro</strong> - Tier 2, multiple_choice</li>
          </ul>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: '#666' }}>
            Other quests use placeholder hashes and cannot be stored in Aztec until hashes are computed.
          </p>
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Select Quest:
            <select
              value={selectedQuestId || ''}
              onChange={(e) => {
                const questId = e.target.value;
                if (!questId) {
                  setSelectedQuestId(null);
                  setSelectedQuest(null);
                  return;
                }
                
                const quest = getQuestDefinition(questId);
                if (!quest) {
                  setSelectedQuestId(null);
                  setSelectedQuest(null);
                  return;
                }
                
                // Check if quest is fully implemented before allowing selection
                const hasRealHash = quest.questIdHash !== '0xPLACEHOLDER';
                if (!hasRealHash) {
                  // Don't allow selection of quests with placeholder hashes
                  setSelectedQuestId(null);
                  setSelectedQuest(null);
                  return;
                }
                
                // Check if validate function is implemented (doesn't throw)
                try {
                  const dummySubmission = quest.type === 'multiple_choice' 
                    ? { selectedOptionId: '0' }
                    : quest.type === 'numeric_input'
                    ? { value: 0 }
                    : {};
                  const result = quest.validate(dummySubmission as any);
                  if (!result || typeof result !== 'object' || !('success' in result)) {
                    // Validate function not properly implemented
                    setSelectedQuestId(null);
                    setSelectedQuest(null);
                    return;
                  }
                } catch (e) {
                  // Validate function throws - not implemented
                  setSelectedQuestId(null);
                  setSelectedQuest(null);
                  return;
                }
                
                // Quest is fully implemented - allow selection
                setSelectedQuestId(questId);
                setSelectedQuest(quest);
                // Set default submission based on quest type
                if (quest.type === 'multiple_choice') {
                  setQuestSubmission('{"selectedOptionId": "0"}');
                } else if (quest.type === 'numeric_input') {
                  setQuestSubmission('{"numericValue": 0}');
                } else {
                  setQuestSubmission('{}');
                }
              }}
              style={{
                width: '100%',
                padding: '0.5rem',
                marginTop: '0.25rem',
              }}
            >
              <option value="">-- Select a quest --</option>
              {listAllQuests().map((quest) => {
                // Check if quest is fully implemented:
                // 1. Has a real questIdHash (not placeholder)
                // 2. Has a validate function that doesn't throw
                const hasRealHash = quest.questIdHash !== '0xPLACEHOLDER';
                const isImplemented = hasRealHash && (() => {
                  try {
                    // Try to call validate with a dummy submission to check if it throws
                    const dummySubmission = quest.type === 'multiple_choice' 
                      ? { selectedOptionId: '0' }
                      : quest.type === 'numeric_input'
                      ? { value: 0 }
                      : {};
                    const result = quest.validate(dummySubmission as any);
                    // If it returns a result (not a promise), it's implemented
                    return result && typeof result === 'object' && 'success' in result;
                  } catch (e) {
                    // If it throws, it's not implemented
                    return false;
                  }
                })();
                
                return (
                  <option 
                    key={quest.questId} 
                    value={quest.questId}
                    disabled={!isImplemented}
                    style={{
                      color: isImplemented ? 'inherit' : '#999',
                      fontStyle: isImplemented ? 'normal' : 'italic',
                    }}
                  >
                    {quest.name} (Tier {quest.tier}, {quest.type})
                    {!isImplemented && ' - Not implemented yet'}
                  </option>
                );
              })}
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
                    <div><strong>Transaction Hash:</strong>{' '}
                      {(() => {
                        const chainId = parseInt(revealChainId, 10); // Use same chain ID as reveal section
                        const explorerUrl = getExplorerTxUrl(chainId, questStorageResult.transactionHash);
                        if (explorerUrl) {
                          return (
                            <a
                              href={explorerUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                fontFamily: 'monospace',
                                color: '#2196F3',
                                textDecoration: 'underline',
                                cursor: 'pointer',
                              }}
                            >
                              {questStorageResult.transactionHash}
                              <span style={{ marginLeft: '0.25rem' }}>🔗</span>
                            </a>
                          );
                        }
                        return (
                          <code style={{ fontFamily: 'monospace' }}>
                            {questStorageResult.transactionHash}
                            {chainId === 31337 && (
                              <span style={{ marginLeft: '0.5rem', fontSize: '0.85rem', color: '#666' }}>
                                (Local Hardhat - no explorer available)
                              </span>
                            )}
                          </code>
                        );
                      })()}
                    </div>
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

      {/* Section 3: Arkiv Profiles (Public Snapshot Layer) */}
      <ArkivProfilesSection />
    </div>
  );
}

// Arkiv Profiles Section Component
function ArkivProfilesSection() {
  const [profiles, setProfiles] = useState<ArkivSkillProfilePayload[]>([]);
  const [humanOnly, setHumanOnly] = useState(false);
  const [allowAgentsOnly, setAllowAgentsOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadProfiles() {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (humanOnly) params.set('humanOnly', 'true');
    if (allowAgentsOnly) params.set('allowAgentsOnly', 'true');

    try {
      const res = await fetch(`/api/dev/arkiv-profiles?${params.toString()}`);
      const json = await res.json();
      if (!json.ok) throw new Error(json.error ?? 'Request failed');
      setProfiles(json.profiles ?? []);
    } catch (err: any) {
      setError(err.message ?? 'Failed to load profiles');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfiles();
  }, []); // initial load

  return (
    <section style={{ 
      marginTop: '2rem', 
      border: '1px solid #ddd', 
      borderRadius: '4px', 
      padding: '1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      <h2 style={{ fontSize: '1.125rem', fontWeight: '600' }}>
        Section 3: Arkiv Profiles (Public Snapshot Layer)
      </h2>
      <p style={{ fontSize: '0.875rem', color: '#666' }}>
        Shows public skill profile snapshots stored on Arkiv. This data NEVER
        includes individual quest details – only tier, human status, and badges.
      </p>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '0.875rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="checkbox"
            checked={humanOnly}
            onChange={(e) => setHumanOnly(e.target.checked)}
          />
          Humans only (require Self SBT)
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="checkbox"
            checked={allowAgentsOnly}
            onChange={(e) => setAllowAgentsOnly(e.target.checked)}
          />
          Allow agents (opt-out of KYC)
        </label>

        <button
          onClick={loadProfiles}
          disabled={loading}
          style={{
            padding: '0.25rem 0.75rem',
            border: '1px solid #000',
            borderRadius: '4px',
            fontSize: '0.875rem',
            background: '#000',
            color: '#fff',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.5 : 1
          }}
        >
          {loading ? 'Loading…' : 'Reload Profiles'}
        </button>
      </div>

      {error && <p style={{ fontSize: '0.875rem', color: '#dc2626' }}>{error}</p>}

      <div style={{ border: '1px solid #ddd', borderRadius: '4px', overflowX: 'auto' }}>
        <table style={{ width: '100%', fontSize: '0.875rem' }}>
          <thead style={{ background: '#f9fafb' }}>
            <tr>
              <th style={{ padding: '0.25rem 0.5rem', textAlign: 'left' }}>Address</th>
              <th style={{ padding: '0.25rem 0.5rem', textAlign: 'left' }}>Human</th>
              <th style={{ padding: '0.25rem 0.5rem', textAlign: 'left' }}>Allow Agents</th>
              <th style={{ padding: '0.25rem 0.5rem', textAlign: 'left' }}>Tier</th>
              <th style={{ padding: '0.25rem 0.5rem', textAlign: 'left' }}>Badges</th>
              <th style={{ padding: '0.25rem 0.5rem', textAlign: 'left' }}>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {profiles.length === 0 && !loading && (
              <tr>
                <td colSpan={6} style={{ padding: '0.75rem', textAlign: 'center', color: '#666' }}>
                  No profiles found yet – publish a tier first, then try again.
                </td>
              </tr>
            )}
            {profiles.map((p) => (
              <tr key={`${p.address}-${p.lastUpdated}`} style={{ borderTop: '1px solid #ddd' }}>
                <td style={{ padding: '0.25rem 0.5rem', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                  {p.address.slice(0, 6)}…{p.address.slice(-4)}
                </td>
                <td style={{ padding: '0.25rem 0.5rem' }}>
                  {p.humanVerified ? '✅' : '❌'}
                </td>
                <td style={{ padding: '0.25rem 0.5rem' }}>
                  {p.allowAgents ? '🧠 (agents allowed)' : '🧍 humans only'}
                </td>
                <td style={{ padding: '0.25rem 0.5rem' }}>
                  {p.aztecBuilderTier ?? '–'}
                </td>
                <td style={{ padding: '0.25rem 0.5rem' }}>
                  {p.externalBadges?.map((b) => b.label).join(', ') || '—'}
                </td>
                <td style={{ padding: '0.25rem 0.5rem' }}>
                  {new Date(p.lastUpdated).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

