'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  getQuestDefinition,
  type QuestDefinition,
  type QuestSubmission,
  type ValidationResult,
} from '@hidden-garden/game-engine';
import {
  type AztecClient,
  MockAztecClient,
  RealAztecClient,
  createAztecClient,
  type QuestCompletionResult,
  computeQuestIdHash,
} from '@hidden-garden/core-logic';
import {
  SkillLeaderboardAbi,
  getSkillLeaderboardAddress,
  hashSkillName,
  type Address,
} from '@hidden-garden/core-logic';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseAbiParameters } from 'viem';

/**
 * Quest Completion Page
 * 
 * Implements the core ZK-enabled selective skill sharing flow:
 * 1. User completes quiz → validation
 * 2. Store completion in Aztec private vault
 * 3. Generate tier proof (when ready)
 * 4. Publish proof to L1 (selective sharing)
 */
export default function QuestPage() {
  const params = useParams();
  const questId = params.questId as string;
  
  const [quest, setQuest] = useState<QuestDefinition | undefined>(undefined);
  const [submission, setSubmission] = useState<string>('');
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isStoring, setIsStoring] = useState(false);
  const [storageResult, setStorageResult] = useState<QuestCompletionResult | null>(null);
  const [aztecMode, setAztecMode] = useState<'real' | 'mock'>('mock');
  const [aztecClient, setAztecClient] = useState<AztecClient | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [tierProofResult, setTierProofResult] = useState<{ proof: string; publicInputs: string } | null>(null);
  const [isGeneratingProof, setIsGeneratingProof] = useState(false);
  
  const { address, isConnected } = useAccount();
  const { writeContract, data: hash, isPending, error: contractError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (questId) {
      const questDef = getQuestDefinition(questId);
      setQuest(questDef);
      // Set default submission based on quest type
      if (questDef?.type === 'multiple_choice') {
        setSubmission('{"selectedOptionId": ""}');
      }

      // For aztec_concept_quiz, use real Aztec client if enabled
      const useRealAztec = process.env.NEXT_PUBLIC_USE_REAL_AZTEC === 'true' && questId === 'aztec_concept_quiz';
      
      if (useRealAztec) {
        setIsInitializing(true);
        const client = createAztecClient('real', {
          pxeUrl: process.env.NEXT_PUBLIC_PXE_URL || 'http://localhost:8080',
        });
        
        // Initialize the client (async)
        if (client instanceof RealAztecClient) {
          client.initialize()
            .then(() => {
              setAztecClient(client);
              setAztecMode('real');
              setIsInitializing(false);
            })
            .catch((error) => {
              console.warn('Failed to initialize real Aztec client, falling back to mock:', error);
              setAztecClient(new MockAztecClient());
              setAztecMode('mock');
              setIsInitializing(false);
            });
        } else {
          setAztecClient(client);
          setAztecMode('mock');
          setIsInitializing(false);
        }
      } else {
        setAztecClient(new MockAztecClient());
        setAztecMode('mock');
      }
    }
  }, [questId]);

  const handleValidate = async () => {
    if (!quest) return;

    setIsValidating(true);
    setValidationResult(null);
    setStorageResult(null);

    try {
      let parsedSubmission: QuestSubmission;
      try {
        parsedSubmission = JSON.parse(submission);
      } catch {
        setValidationResult({
          success: false,
          score: 0,
          feedback: 'Invalid JSON format. Please check your submission.',
        });
        return;
      }

      const result = quest.validate(parsedSubmission);
      const finalResult = result instanceof Promise ? await result : result;
      setValidationResult(finalResult);
    } catch (error) {
      setValidationResult({
        success: false,
        score: 0,
        feedback: error instanceof Error ? error.message : 'Validation error',
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleStoreInAztec = async () => {
    if (!quest || !validationResult || !validationResult.success || !aztecClient) {
      return;
    }

    setIsStoring(true);
    setStorageResult(null);

    try {
      // For aztec_concept_quiz with real client, use addQuestCompletionByQuestId
      // Otherwise, use the hash-based method
      let result: QuestCompletionResult;
      
      if (quest.questId === 'aztec_concept_quiz' && aztecClient instanceof RealAztecClient) {
        // Use the quest ID string directly (client computes hash internally)
        result = await (aztecClient as RealAztecClient).addQuestCompletionByQuestId(
          quest.questId,
          validationResult.score
        );
      } else {
        // Fallback: compute hash and use standard method
        const questIdHash = computeQuestIdHash(quest.questId);
        result = await aztecClient.addQuestCompletion(
          questIdHash,
          validationResult.score
        );
      }

      setStorageResult(result);

      if (result.success) {
        // Quest completion is now stored privately in Aztec
        // The user can later generate a tier proof without revealing individual quest details
      }
    } catch (error) {
      setStorageResult({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to store in Aztec',
      });
    } finally {
      setIsStoring(false);
    }
  };

  const handlePublishTierProof = async () => {
    if (!isConnected || !address || !aztecClient) {
      if (!isConnected || !address) {
        alert('Please connect your wallet first');
      }
      return;
    }

    setIsGeneratingProof(true);
    setTierProofResult(null);

    try {
      // Generate tier proof (for Tier 1 with the first quest)
      const result = await aztecClient.proveAztecBuilderTier(1, 60);

      if (!result.success || !result.proof) {
        alert('Failed to generate tier proof: ' + (result.error || 'Unknown error'));
        setIsGeneratingProof(false);
        return;
      }

      // Store proof result for display
      setTierProofResult({
        proof: result.proof.proof,
        publicInputs: result.proof.publicInputs,
      });

      // Get contract address
      const chainId = 31337; // Hardhat local
      const contractAddress = getSkillLeaderboardAddress(chainId);
      if (!contractAddress) {
        alert('Contract not deployed on this chain');
        setIsGeneratingProof(false);
        return;
      }

      // Compute skill hash for "aztec_builder_path"
      const skillHash = hashSkillName('aztec_builder_path');

      // Submit proof to L1 contract
      writeContract({
        address: contractAddress,
        abi: SkillLeaderboardAbi,
        functionName: 'submitSkillTierWithProof',
        args: [
          skillHash,
          1, // minLevel (tier 1)
          result.proof.proof,
          result.proof.publicInputs,
        ],
      });
    } catch (error) {
      console.error('Error publishing tier proof:', error);
      alert('Failed to publish tier proof: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsGeneratingProof(false);
    }
  };

  if (!quest) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Quest not found: {questId}</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{quest.name}</h1>
      <p style={{ color: '#666', marginBottom: '1rem' }}>Tier {quest.tier} • {quest.type}</p>
      
      {/* Aztec Mode Indicator - Only show for aztec_concept_quiz */}
      {quest.questId === 'aztec_concept_quiz' && (
        <div style={{
          padding: '0.5rem 1rem',
          backgroundColor: aztecMode === 'real' ? '#E8F5E9' : '#FFF3E0',
          border: `1px solid ${aztecMode === 'real' ? '#4CAF50' : '#FF9800'}`,
          borderRadius: '4px',
          marginBottom: '1rem',
          fontSize: '0.9rem',
        }}>
          <strong>Aztec mode:</strong> {aztecMode === 'real' ? '🟢 REAL devnet' : '🟡 MOCK'}
          {isInitializing && ' (initializing...)'}
          {aztecMode === 'real' && !isInitializing && (
            <span style={{ marginLeft: '0.5rem', fontSize: '0.85rem', color: '#666' }}>
              Connected to Aztec devnet
            </span>
          )}
          {aztecMode === 'mock' && quest.questId === 'aztec_concept_quiz' && (
            <span style={{ marginLeft: '0.5rem', fontSize: '0.85rem', color: '#666' }}>
              (Set NEXT_PUBLIC_USE_REAL_AZTEC=true to use real devnet)
            </span>
          )}
        </div>
      )}

      {/* Quest Prompt */}
      <div style={{ 
        padding: '1.5rem', 
        backgroundColor: '#f5f5f5', 
        borderRadius: '8px',
        marginBottom: '2rem',
        whiteSpace: 'pre-wrap'
      }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Question</h2>
        <p>{quest.prompt}</p>
      </div>

      {/* Submission Input */}
      <div style={{ marginBottom: '2rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
          Your Answer (JSON):
        </label>
        <textarea
          value={submission}
          onChange={(e) => setSubmission(e.target.value)}
          style={{
            width: '100%',
            minHeight: '100px',
            padding: '0.75rem',
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            border: '1px solid #ddd',
            borderRadius: '4px',
          }}
          placeholder='{"selectedOptionId": "0"}'
        />
      </div>

      {/* Validate Button */}
      <button
        onClick={handleValidate}
        disabled={isValidating}
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: isValidating ? '#ccc' : '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isValidating ? 'not-allowed' : 'pointer',
          fontSize: '1rem',
          marginBottom: '1rem',
          marginRight: '1rem',
        }}
      >
        {isValidating ? 'Validating...' : 'Validate Answer'}
      </button>

      {/* Validation Result */}
      {validationResult && (
        <div style={{ 
          padding: '1rem', 
          backgroundColor: validationResult.success ? '#E8F5E9' : '#FFEBEE',
          borderRadius: '4px',
          marginBottom: '2rem'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
            {validationResult.success ? '✅ Correct!' : '❌ Incorrect'}
          </div>
          <div>Score: {validationResult.score}%</div>
          {validationResult.feedback && (
            <div style={{ marginTop: '0.5rem' }}>{validationResult.feedback}</div>
          )}
        </div>
      )}

      {/* Store in Aztec Button (only if validation passed) */}
      {validationResult?.success && aztecClient && (
        <>
          <button
            onClick={handleStoreInAztec}
            disabled={isStoring || isInitializing}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: (isStoring || isInitializing) ? '#ccc' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: (isStoring || isInitializing) ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              marginBottom: '1rem',
              marginRight: '1rem',
            }}
          >
            {isInitializing 
              ? 'Initializing Aztec client...' 
              : isStoring 
                ? 'Storing in Aztec...' 
                : '🔒 Store Privately in Aztec'
            }
          </button>

          {/* Storage Result */}
          {storageResult && (
            <div style={{ 
              padding: '1rem', 
              backgroundColor: storageResult.success ? '#E8F5E9' : '#FFEBEE',
              borderRadius: '4px',
              marginBottom: '2rem'
            }}>
              {storageResult.success ? (
                <div>
                  <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    ✅ Stored in Private Vault
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>
                    Your quest completion is now stored privately. No one can see your individual scores.
                  </div>
                  {storageResult.transactionHash && (
                    <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', fontFamily: 'monospace' }}>
                      TX: {storageResult.transactionHash}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div style={{ fontWeight: 'bold', color: '#F44336' }}>❌ Storage Failed</div>
                  <div>{storageResult.error}</div>
                </div>
              )}
            </div>
          )}

          {/* Publish Tier Proof Button (only if stored) */}
          {storageResult?.success && (
            <div style={{ marginTop: '2rem', padding: '1.5rem', border: '2px solid #2196F3', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
                🎯 Selective Skill Sharing
              </h3>
              <p style={{ marginBottom: '1rem', color: '#666' }}>
                Generate a ZK proof that you've achieved Tier 1 without revealing which specific quests you completed or your scores.
              </p>
              <button
                onClick={handlePublishTierProof}
                disabled={!isConnected || isPending || isConfirming || isGeneratingProof}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: (!isConnected || isPending || isConfirming || isGeneratingProof) ? '#ccc' : '#9C27B0',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: (!isConnected || isPending || isConfirming || isGeneratingProof) ? 'not-allowed' : 'pointer',
                  fontSize: '1rem',
                }}
              >
                {!isConnected 
                  ? 'Connect Wallet First' 
                  : isGeneratingProof
                    ? 'Generating Proof...'
                  : isPending 
                    ? 'Publishing...' 
                    : isConfirming
                      ? 'Confirming...'
                      : '🔓 Generate & Publish Tier Proof'
                }
              </button>

              {/* Proof Result Display */}
              {tierProofResult && (
                <div style={{ 
                  marginTop: '1rem', 
                  padding: '1rem', 
                  backgroundColor: '#E3F2FD',
                  borderRadius: '4px',
                  border: '1px solid #2196F3'
                }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: '#1976D2' }}>
                    ✅ Tier Proof Generated
                  </div>
                  <details style={{ marginTop: '0.5rem' }}>
                    <summary style={{ cursor: 'pointer', fontSize: '0.9rem', color: '#666' }}>
                      View Public Inputs (what is revealed)
                    </summary>
                    <div style={{ 
                      marginTop: '0.5rem', 
                      padding: '0.75rem', 
                      backgroundColor: '#fff',
                      borderRadius: '4px',
                      fontFamily: 'monospace',
                      fontSize: '0.85rem',
                      overflow: 'auto',
                      maxHeight: '200px'
                    }}>
                      <div style={{ marginBottom: '0.5rem' }}>
                        <strong>Public Inputs (hex):</strong>
                        <pre style={{ marginTop: '0.25rem', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                          {tierProofResult.publicInputs}
                        </pre>
                      </div>
                      <div style={{ 
                        marginTop: '0.5rem', 
                        padding: '0.5rem', 
                        backgroundColor: '#FFF3E0',
                        borderRadius: '4px',
                        fontSize: '0.8rem'
                      }}>
                        <strong>What is public:</strong>
                        <ul style={{ marginTop: '0.25rem', paddingLeft: '1.5rem' }}>
                          <li>Owner (Aztec address)</li>
                          <li>min_tier: 1</li>
                          <li>min_average_score: 60</li>
                          <li>path_hash: aztec_builder_path</li>
                        </ul>
                        <strong style={{ display: 'block', marginTop: '0.5rem' }}>What stays private:</strong>
                        <ul style={{ marginTop: '0.25rem', paddingLeft: '1.5rem' }}>
                          <li>Individual quest IDs</li>
                          <li>Individual scores</li>
                          <li>Completion timestamps</li>
                          <li>Number of attempts</li>
                        </ul>
                      </div>
                    </div>
                  </details>
                </div>
              )}

              {isConfirmed && (
                <div style={{ 
                  marginTop: '1rem', 
                  padding: '1rem', 
                  backgroundColor: '#E8F5E9',
                  borderRadius: '4px'
                }}>
                  ✅ Tier proof published! Your competence is now verifiable on-chain without revealing your learning journey.
                </div>
              )}

              {contractError && (
                <div style={{ 
                  marginTop: '1rem', 
                  padding: '1rem', 
                  backgroundColor: '#FFEBEE',
                  borderRadius: '4px',
                  color: '#F44336'
                }}>
                  ❌ Error: {contractError.message}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

