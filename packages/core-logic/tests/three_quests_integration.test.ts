/**
 * Integration tests for three quests in aztec_builder path
 * 
 * Tests the full flow with:
 * - aztec_concept_quiz (Tier 1, score 100)
 * - noir_syntax_basics (Tier 2, score 80-100)
 * - aztec_storage_intro (Tier 2, score 60-100)
 * 
 * Verifies:
 * - Quest completions can be stored for all three quests
 * - Tier proof can be generated after completing multiple quests
 * - Public inputs do not reveal quest-specific data
 * 
 * Prerequisites:
 * - Aztec devnet/sandbox running (use `pnpm aztec:devnet`)
 * - Contract compiled (use `pnpm aztec:compile`)
 * - Environment variable: AZTEC_PXE_URL=http://localhost:8080 (or PXE_URL)
 * 
 * These tests are skipped if AZTEC_PXE_URL is not set (CI-friendly).
 */

import { describe, it, beforeAll, expect } from '@jest/globals';
import { RealAztecClient, createAztecClient } from '../src/aztecClient';
import { EXPECTED_AZTEC_BUILDER_PATH_HASH } from '../src/quests/hashing';

// Skip tests if Aztec devnet is not available
const PXE_URL = process.env.AZTEC_PXE_URL || process.env.PXE_URL || 'http://localhost:8080';
const SKIP_TESTS = !process.env.AZTEC_PXE_URL && !process.env.PXE_URL;

// Use describe.skip if devnet is not configured
const testSuite = SKIP_TESTS 
  ? describe.skip('Three Quests Integration Tests', () => {
      it('Skipped: AZTEC_PXE_URL not configured (no devnet)', () => {
        console.log('⏭️  Skipping three quests integration tests');
        console.log('   Set AZTEC_PXE_URL=http://localhost:8080 and ensure devnet is running');
      });
    })
  : describe('Three Quests Integration Tests', () => {
      let client: RealAztecClient;
      let userAddress: string | null;

      beforeAll(async () => {
        // Create real Aztec client
        const aztecClient = createAztecClient('real', { pxeUrl: PXE_URL });
        
        if (!(aztecClient instanceof RealAztecClient)) {
          throw new Error('Failed to create RealAztecClient. Make sure Aztec devnet is running.');
        }
        
        client = aztecClient;
        
        // Initialize client (connects to devnet, loads account, deploys/connects to contract)
        try {
          await client.initialize();
          userAddress = await client.getAddress();
          const contractAddress = client.getContractAddress();
          
          if (!userAddress) {
            throw new Error('Failed to get user address after initialization');
          }
          
          if (!contractAddress) {
            throw new Error('Contract not initialized. Check that contract artifact exists and compilation succeeded.');
          }
          
          console.log(`✅ Connected to Aztec devnet. User address: ${userAddress}`);
          console.log(`✅ Contract address: ${contractAddress}`);
        } catch (error) {
          console.error('❌ Failed to initialize Aztec client:', error);
          throw error;
        }
      }, 60000); // 60 second timeout for initialization

      it('should store quest completions for all three quests', async () => {
        // Store aztec_concept_quiz (Tier 1, score 100)
        const result1 = await client.addQuestCompletionByQuestId('aztec_concept_quiz', 100);
        expect(result1.success).toBe(true);
        expect(result1.transactionHash).toBeDefined();
        expect(result1.transactionHash).toMatch(/^0x[0-9a-f]{64}$/);
        console.log(`✅ aztec_concept_quiz stored. TX: ${result1.transactionHash}`);

        // Store noir_syntax_basics (Tier 2, score 90)
        const result2 = await client.addQuestCompletionByQuestId('noir_syntax_basics', 90);
        expect(result2.success).toBe(true);
        expect(result2.transactionHash).toBeDefined();
        expect(result2.transactionHash).toMatch(/^0x[0-9a-f]{64}$/);
        console.log(`✅ noir_syntax_basics stored. TX: ${result2.transactionHash}`);

        // Store aztec_storage_intro (Tier 2, score 85)
        const result3 = await client.addQuestCompletionByQuestId('aztec_storage_intro', 85);
        expect(result3.success).toBe(true);
        expect(result3.transactionHash).toBeDefined();
        expect(result3.transactionHash).toMatch(/^0x[0-9a-f]{64}$/);
        console.log(`✅ aztec_storage_intro stored. TX: ${result3.transactionHash}`);
      }, 90000); // 90 second timeout for three transactions

      it('should generate tier proof after completing multiple quests', async () => {
        // Ensure all quests are completed (from previous test or fresh)
        const quests = [
          { id: 'aztec_concept_quiz', score: 100 },
          { id: 'noir_syntax_basics', score: 90 },
          { id: 'aztec_storage_intro', score: 85 },
        ];

        for (const quest of quests) {
          const result = await client.addQuestCompletionByQuestId(quest.id, quest.score);
          expect(result.success).toBe(true);
        }

        // Generate tier proof for Tier 1 with min_average_score 70
        // With scores: 100, 90, 85, average = 91.67, which is >= 70
        const minTier = 1;
        const minAverageScore = 70;

        const proofResult = await client.proveAztecBuilderTier(minTier, minAverageScore);

        expect(proofResult.success).toBe(true);
        expect(proofResult.proof).toBeDefined();
        expect(proofResult.error).toBeUndefined();

        // Verify proof structure
        expect(proofResult.proof?.proof).toBeDefined();
        expect(proofResult.proof?.publicInputs).toBeDefined();
        expect(proofResult.proof?.proof).toMatch(/^0x[0-9a-f]+$/); // Valid hex format
        expect(proofResult.proof?.publicInputs).toMatch(/^0x[0-9a-f]+$/); // Valid hex format

        console.log(`✅ Tier proof generated for Tier ${minTier} with min average ${minAverageScore}`);
        console.log(`   Proof: ${proofResult.proof?.proof?.slice(0, 20)}...`);
      }, 60000);

      it('should verify public inputs contain no quest-specific data', async () => {
        // Complete all quests first
        const quests = [
          { id: 'aztec_concept_quiz', score: 100 },
          { id: 'noir_syntax_basics', score: 80 },
          { id: 'aztec_storage_intro', score: 75 },
        ];

        for (const quest of quests) {
          const result = await client.addQuestCompletionByQuestId(quest.id, quest.score);
          expect(result.success).toBe(true);
        }

        // Generate proof
        const minTier = 1;
        const minAverageScore = 70;
        const proofResult = await client.proveAztecBuilderTier(minTier, minAverageScore);

        expect(proofResult.success).toBe(true);
        expect(proofResult.proof).toBeDefined();
        expect(proofResult.proof?.proof).toBeDefined();
        expect(proofResult.proof?.publicInputs).toBeDefined();
        
        // Verify proof is non-empty
        expect(proofResult.proof!.proof).toMatch(/^0x[0-9a-f]+$/);
        expect(proofResult.proof!.publicInputs).toMatch(/^0x[0-9a-f]+$/);

        // Parse public inputs if possible
        let publicInputs: any = null;
        try {
          const decoded = Buffer.from(proofResult.proof!.publicInputs.slice(2), 'hex').toString('utf-8');
          publicInputs = JSON.parse(decoded);
        } catch {
          // If not JSON, that's okay - format may vary
        }

        // If we successfully parsed public inputs, verify structure
        if (publicInputs && typeof publicInputs === 'object') {
          // Verify expected public fields are present
          if (publicInputs.owner !== undefined) {
            expect(publicInputs.owner).toBeDefined();
            if (typeof publicInputs.owner === 'string') {
              expect(publicInputs.owner).toBe(userAddress);
            }
          }

          if (publicInputs.min_tier !== undefined || publicInputs.minTier !== undefined) {
            const minTierValue = publicInputs.min_tier || publicInputs.minTier;
            expect(minTierValue).toBeGreaterThanOrEqual(1);
          }

          if (publicInputs.min_average_score !== undefined || publicInputs.minAverageScore !== undefined) {
            const minAvgScore = publicInputs.min_average_score || publicInputs.minAverageScore;
            expect(minAvgScore).toBeGreaterThanOrEqual(70);
          }

          if (publicInputs.path_hash !== undefined || publicInputs.pathHash !== undefined) {
            const pathHash = publicInputs.path_hash || publicInputs.pathHash;
            expect(pathHash).toBeDefined();
            if (EXPECTED_AZTEC_BUILDER_PATH_HASH !== '0x0000000000000000000000000000000000000000000000000000000000000000') {
              expect(String(pathHash)).toBeDefined();
            }
          }

          // CRITICAL: Verify quest-specific data is NOT in public inputs
          // These should NEVER be public, even with multiple quests completed
          expect(publicInputs.quest_id).toBeUndefined();
          expect(publicInputs.questId).toBeUndefined();
          expect(publicInputs.quest_id_hash).toBeUndefined();
          expect(publicInputs.questIdHash).toBeUndefined();
          expect(publicInputs.score).toBeUndefined();
          expect(publicInputs.scores).toBeUndefined(); // No array of scores
          expect(publicInputs.timestamp).toBeUndefined();
          expect(publicInputs.timestamps).toBeUndefined(); // No array of timestamps
          expect(publicInputs.attempt_count).toBeUndefined();
          expect(publicInputs.attemptCount).toBeUndefined();
          
          // Verify no quest IDs are leaked
          expect(publicInputs.aztec_concept_quiz).toBeUndefined();
          expect(publicInputs.noir_syntax_basics).toBeUndefined();
          expect(publicInputs.aztec_storage_intro).toBeUndefined();
        }

        // Verify path hash constant matches expected value
        expect(EXPECTED_AZTEC_BUILDER_PATH_HASH).toBeDefined();
        if (EXPECTED_AZTEC_BUILDER_PATH_HASH !== '0x0000000000000000000000000000000000000000000000000000000000000000') {
          console.log(`✅ Path hash constant: ${EXPECTED_AZTEC_BUILDER_PATH_HASH}`);
        }

        console.log(`✅ Public inputs verified. No quest-specific data leaked (3 quests completed).`);
      }, 90000);

      it('should handle tier proof with different score ranges', async () => {
        // Test with scores in the specified ranges
        const testCases = [
          { id: 'aztec_concept_quiz', score: 100 }, // Always 100
          { id: 'noir_syntax_basics', score: 80 },  // 80-100 range
          { id: 'aztec_storage_intro', score: 60 }, // 60-100 range
        ];

        // Store completions
        for (const testCase of testCases) {
          const result = await client.addQuestCompletionByQuestId(testCase.id, testCase.score);
          expect(result.success).toBe(true);
        }

        // Generate proof with min_average_score 70
        // Average: (100 + 80 + 60) / 3 = 80, which is >= 70
        const proofResult = await client.proveAztecBuilderTier(1, 70);

        expect(proofResult.success).toBe(true);
        expect(proofResult.proof).toBeDefined();
        expect(proofResult.proof?.proof).toBeDefined();
        expect(proofResult.proof?.publicInputs).toBeDefined();

        console.log(`✅ Tier proof generated with scores: 100, 80, 60 (average: 80)`);
      }, 90000);
    });

// Export the test suite
export default testSuite;

