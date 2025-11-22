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
  const [aztecClient] = useState<AztecClient>(new MockAztecClient());
  
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
    if (!quest || !validationResult || !validationResult.success) {
      return;
    }

    setIsStoring(true);
    setStorageResult(null);

    try {
      // Compute quest ID hash
      const questIdHash = computeQuestIdHash(quest.questId);
      
      // Store in Aztec private vault
      const result = await aztecClient.addQuestCompletion(
        questIdHash,
        validationResult.score
      );

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
    if (!isConnected || !address) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      // Generate tier proof (for Tier 1 with the first quest)
      const tierProofResult = await aztecClient.proveAztecBuilderTier(1, 60);

      if (!tierProofResult.success || !tierProofResult.proof) {
        alert('Failed to generate tier proof: ' + (tierProofResult.error || 'Unknown error'));
        return;
      }

      // Get contract address
      const chainId = 31337; // Hardhat local
      const contractAddress = getSkillLeaderboardAddress(chainId);
      if (!contractAddress) {
        alert('Contract not deployed on this chain');
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
          tierProofResult.proof.proof,
          tierProofResult.proof.publicInputs,
        ],
      });
    } catch (error) {
      console.error('Error publishing tier proof:', error);
      alert('Failed to publish tier proof: ' + (error instanceof Error ? error.message : 'Unknown error'));
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
      <p style={{ color: '#666', marginBottom: '2rem' }}>Tier {quest.tier} • {quest.type}</p>

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
      {validationResult?.success && (
        <>
          <button
            onClick={handleStoreInAztec}
            disabled={isStoring}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: isStoring ? '#ccc' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isStoring ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              marginBottom: '1rem',
              marginRight: '1rem',
            }}
          >
            {isStoring ? 'Storing in Aztec...' : '🔒 Store Privately in Aztec'}
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
                disabled={!isConnected || isPending || isConfirming}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: (!isConnected || isPending || isConfirming) ? '#ccc' : '#9C27B0',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: (!isConnected || isPending || isConfirming) ? 'not-allowed' : 'pointer',
                  fontSize: '1rem',
                }}
              >
                {!isConnected 
                  ? 'Connect Wallet First' 
                  : isPending 
                    ? 'Generating Proof...' 
                    : isConfirming
                      ? 'Confirming...'
                      : '🔓 Generate & Publish Tier Proof'
                }
              </button>

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

