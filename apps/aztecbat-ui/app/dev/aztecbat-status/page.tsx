'use client';

import { useState, useMemo } from 'react';
import {
  questRegistry,
  listAllQuests,
  getQuestDefinition,
  type QuestDefinition,
  type QuestSubmission,
  type ValidationResult,
  type QuestId,
} from '@hidden-garden/game-engine';
import { computeQuestIdHash } from '@hidden-garden/core-logic';

// Dev guard
const isDevEnabled = process.env.NEXT_PUBLIC_ENABLE_DEV_UI === 'true';

type QuestStatus = 'implemented' | 'stubbed' | 'error';

interface QuestStatusInfo {
  quest: QuestDefinition;
  status: QuestStatus;
  errorMessage?: string;
}

/**
 * Determine quest validation status by attempting to call validate
 */
function getQuestStatus(quest: QuestDefinition): QuestStatusInfo {
  const testSubmission: QuestSubmission = { selectedOptionId: '0' };
  
  try {
    const result = quest.validate(testSubmission);
    
    // If it's a promise, we can't check synchronously, so assume stubbed
    if (result instanceof Promise) {
      return {
        quest,
        status: 'stubbed',
        errorMessage: 'Async validation (may be implemented)',
      };
    }
    
    // If it returns a ValidationResult, it's implemented
    if (result && typeof result === 'object' && 'success' in result) {
      return {
        quest,
        status: 'implemented',
      };
    }
    
    return {
      quest,
      status: 'stubbed',
      errorMessage: 'Unknown return type',
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    // Check if it's the known "not implemented" error
    if (
      errorMessage.includes('not implemented') ||
      errorMessage.includes('Quest validation not implemented')
    ) {
      return {
        quest,
        status: 'stubbed',
        errorMessage,
      };
    }
    
    // Unexpected error
    return {
      quest,
      status: 'error',
      errorMessage,
    };
  }
}

/**
 * Check if ZK tier proof client is available
 */
function checkTierProofClient(): { available: boolean; error?: string } {
  try {
    // Try to import or check for tier proof client
    // This is a placeholder - adjust based on actual implementation
    if (typeof window !== 'undefined') {
      // Check if there's a global or module available
      // For now, assume it's not wired yet
      return {
        available: false,
        error: 'Tier proof client not found. Expected: requestTierProof(minTier, minAverageScore)',
      };
    }
    return { available: false, error: 'Client-side only' };
  } catch (error) {
    return {
      available: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export default function AztecBatStatusPage() {
  const [selectedQuestId, setSelectedQuestId] = useState<QuestId | null>(null);
  const [submissionText, setSubmissionText] = useState<string>('{"selectedOptionId": "0"}');
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  // Guard: Only show in dev mode
  if (!isDevEnabled) {
    return (
      <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
        <h1>Dev UI Disabled</h1>
        <p>Set <code>NEXT_PUBLIC_ENABLE_DEV_UI=true</code> to enable.</p>
      </div>
    );
  }

  // Get all quests with their status
  const questStatuses = useMemo(() => {
    const allQuests = listAllQuests();
    return allQuests.map(getQuestStatus);
  }, []);

  const selectedQuest = selectedQuestId ? getQuestDefinition(selectedQuestId) : null;
  const tierProofClient = checkTierProofClient();

  // Status counts
  const statusCounts = useMemo(() => {
    const counts = { implemented: 0, stubbed: 0, error: 0 };
    questStatuses.forEach(({ status }) => {
      counts[status]++;
    });
    return counts;
  }, [questStatuses]);

  // Handle quest validation test
  const handleValidate = async () => {
    if (!selectedQuest) return;

    setIsValidating(true);
    setValidationResult(null);
    setValidationError(null);

    try {
      let submission: QuestSubmission;
      
      // Try to parse submission JSON
      try {
        submission = JSON.parse(submissionText);
      } catch {
        throw new Error('Invalid JSON submission');
      }

      const result = selectedQuest.validate(submission);
      
      // Handle async validation
      if (result instanceof Promise) {
        const resolved = await result;
        setValidationResult(resolved);
      } else {
        setValidationResult(result);
      }
    } catch (error) {
      setValidationError(error instanceof Error ? error.message : String(error));
    } finally {
      setIsValidating(false);
    }
  };

  // Get status emoji and color
  const getStatusDisplay = (status: QuestStatus) => {
    switch (status) {
      case 'implemented':
        return { emoji: '✅', color: '#4CAF50' };
      case 'stubbed':
        return { emoji: '🟡', color: '#FF9800' };
      case 'error':
        return { emoji: '🔴', color: '#F44336' };
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔧 AztecBat Dev Status</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Debug control panel for quest validation and ZK tier proof flow
      </p>

      {/* Status Summary */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '1rem', 
        marginBottom: '2rem' 
      }}>
        <div style={{ padding: '1rem', backgroundColor: '#E8F5E9', borderRadius: '4px' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#4CAF50' }}>
            ✅ {statusCounts.implemented}
          </div>
          <div style={{ color: '#666' }}>Implemented</div>
        </div>
        <div style={{ padding: '1rem', backgroundColor: '#FFF3E0', borderRadius: '4px' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#FF9800' }}>
            🟡 {statusCounts.stubbed}
          </div>
          <div style={{ color: '#666' }}>Stubbed</div>
        </div>
        <div style={{ padding: '1rem', backgroundColor: '#FFEBEE', borderRadius: '4px' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#F44336' }}>
            🔴 {statusCounts.error}
          </div>
          <div style={{ color: '#666' }}>Error</div>
        </div>
      </div>

      {/* Quest List */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Quest Registry</h2>
        <div style={{ 
          border: '1px solid #ddd', 
          borderRadius: '4px', 
          maxHeight: '400px', 
          overflowY: 'auto' 
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5', position: 'sticky', top: 0 }}>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Status</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Quest ID</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Name</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Tier</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Type</th>
              </tr>
            </thead>
            <tbody>
              {questStatuses.map(({ quest, status, errorMessage }) => {
                const { emoji, color } = getStatusDisplay(status);
                const isSelected = selectedQuestId === quest.questId;
                
                return (
                  <tr
                    key={quest.questId}
                    onClick={() => setSelectedQuestId(quest.questId)}
                    style={{
                      cursor: 'pointer',
                      backgroundColor: isSelected ? '#E3F2FD' : 'white',
                      borderBottom: '1px solid #eee',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = isSelected ? '#BBDEFB' : '#f9f9f9';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = isSelected ? '#E3F2FD' : 'white';
                    }}
                  >
                    <td style={{ padding: '0.75rem', color }}>{emoji}</td>
                    <td style={{ padding: '0.75rem', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                      <div>{quest.questId}</div>
                      <div style={{ fontSize: '0.75rem', color: '#999', marginTop: '0.25rem' }}>
                        Hash: {computeQuestIdHash(quest.questId).slice(0, 10)}...
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem' }}>{quest.name}</td>
                    <td style={{ padding: '0.75rem' }}>Tier {quest.tier}</td>
                    <td style={{ padding: '0.75rem', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                      {quest.type}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quest Validation Test */}
      {selectedQuest && (
        <div style={{ marginBottom: '2rem', padding: '1.5rem', border: '1px solid #ddd', borderRadius: '4px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
            Test Quest: {selectedQuest.name}
          </h2>
          
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>Quest Details:</div>
            <div style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
              <div>ID: {selectedQuest.questId}</div>
              <div>Tier: {selectedQuest.tier}</div>
              <div>Type: {selectedQuest.type}</div>
              <div>Category: {selectedQuest.category}</div>
            </div>
            
            <div style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>Prompt:</div>
            <div style={{ 
              padding: '1rem', 
              backgroundColor: '#f5f5f5', 
              borderRadius: '4px', 
              whiteSpace: 'pre-wrap',
              marginBottom: '1rem'
            }}>
              {selectedQuest.prompt}
            </div>
            
            {selectedQuest.expectedAnswerDescription && (
              <>
                <div style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>Expected Answer:</div>
                <div style={{ 
                  padding: '1rem', 
                  backgroundColor: '#E3F2FD', 
                  borderRadius: '4px',
                  marginBottom: '1rem',
                  fontSize: '0.9rem'
                }}>
                  {selectedQuest.expectedAnswerDescription}
                </div>
              </>
            )}
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Submission (JSON):
            </label>
            <textarea
              value={submissionText}
              onChange={(e) => setSubmissionText(e.target.value)}
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
            }}
          >
            {isValidating ? 'Validating...' : 'Run validate()'}
          </button>

          {validationResult && (
            <div style={{ 
              padding: '1rem', 
              backgroundColor: '#E8F5E9', 
              borderRadius: '4px',
              marginTop: '1rem'
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Validation Result:</div>
              <pre style={{ 
                fontFamily: 'monospace', 
                fontSize: '0.9rem',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}>
                {JSON.stringify(validationResult, null, 2)}
              </pre>
            </div>
          )}

          {validationError && (
            <div style={{ 
              padding: '1rem', 
              backgroundColor: '#FFEBEE', 
              borderRadius: '4px',
              marginTop: '1rem'
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: '#F44336' }}>Error:</div>
              <pre style={{ 
                fontFamily: 'monospace', 
                fontSize: '0.9rem',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                color: '#F44336'
              }}>
                {validationError}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* ZK Tier Proof Test Section */}
      <div style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: '4px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>ZK Tier Proof Flow</h2>
        
        {tierProofClient.available ? (
          <div>
            <div style={{ 
              padding: '1rem', 
              backgroundColor: '#E8F5E9', 
              borderRadius: '4px',
              marginBottom: '1rem'
            }}>
              ✅ Tier proof client is available
            </div>
            <div style={{ color: '#666', fontStyle: 'italic' }}>
              TODO: Add UI for requesting and submitting tier proofs
            </div>
          </div>
        ) : (
          <div>
            <div style={{ 
              padding: '1rem', 
              backgroundColor: '#FFF3E0', 
              borderRadius: '4px',
              marginBottom: '1rem'
            }}>
              🟡 Tier proof client not wired yet
            </div>
            <div style={{ 
              fontFamily: 'monospace', 
              fontSize: '0.9rem', 
              color: '#666',
              padding: '1rem',
              backgroundColor: '#f5f5f5',
              borderRadius: '4px'
            }}>
              <div style={{ marginBottom: '0.5rem' }}>Expected API:</div>
              <div style={{ marginLeft: '1rem' }}>
                <div>requestTierProof(minTier: number, minAverageScore: number)</div>
                <div style={{ marginTop: '0.5rem', color: '#999' }}>
                  → Returns: {'{'} proof, publicInputs {'}'}
                </div>
              </div>
              {tierProofClient.error && (
                <div style={{ marginTop: '1rem', color: '#F44336' }}>
                  Error: {tierProofClient.error}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

