/**
 * Quest Validation Tests
 * 
 * Tests for quest validation logic in the game-engine.
 * These tests verify that quest validators work correctly without
 * requiring Aztec client or circuit integration.
 */

import { describe, it, expect } from '@jest/globals';
import { getQuestDefinition } from '../src/registry';
import type { MultipleChoiceSubmission, QuestSubmission } from '@hidden-garden/core-logic';

describe('Quest Validation', () => {
  describe('noir_syntax_basics', () => {
    const quest = getQuestDefinition('noir_syntax_basics');
    
    it('should exist in registry', () => {
      expect(quest).toBeDefined();
      expect(quest?.questId).toBe('noir_syntax_basics');
      expect(quest?.type).toBe('multiple_choice');
      expect(quest?.tier).toBe(2);
    });

    it('should accept correct answer (option 1)', () => {
      const submission: MultipleChoiceSubmission = { selectedOptionId: '1' };
      const result = quest!.validate(submission);
      
      // Handle both sync and async results
      if (result instanceof Promise) {
        throw new Error('Expected synchronous result but got Promise');
      }
      
      expect(result.success).toBe(true);
      expect(result.score).toBe(100);
      expect(result.feedback).toContain('Correct');
    });

    it('should accept correct answer (option B)', () => {
      const submission: MultipleChoiceSubmission = { selectedOptionId: 'B' };
      const result = quest!.validate(submission);
      
      if (result instanceof Promise) {
        throw new Error('Expected synchronous result but got Promise');
      }
      
      expect(result.success).toBe(true);
      expect(result.score).toBe(100);
    });

    it('should accept correct answer (option b lowercase)', () => {
      const submission: MultipleChoiceSubmission = { selectedOptionId: 'b' };
      const result = quest!.validate(submission);
      
      if (result instanceof Promise) {
        throw new Error('Expected synchronous result but got Promise');
      }
      
      expect(result.success).toBe(true);
      expect(result.score).toBe(100);
    });

    it('should reject incorrect answer (option 0)', () => {
      const submission: MultipleChoiceSubmission = { selectedOptionId: '0' };
      const result = quest!.validate(submission);
      
      if (result instanceof Promise) {
        throw new Error('Expected synchronous result but got Promise');
      }
      
      expect(result.success).toBe(false);
      expect(result.score).toBe(0);
      expect(result.feedback).toContain('Incorrect');
    });

    it('should reject incorrect answer (option 2)', () => {
      const submission: MultipleChoiceSubmission = { selectedOptionId: '2' };
      const result = quest!.validate(submission);
      
      if (result instanceof Promise) {
        throw new Error('Expected synchronous result but got Promise');
      }
      
      expect(result.success).toBe(false);
      expect(result.score).toBe(0);
    });

    it('should reject incorrect answer (option 3)', () => {
      const submission: MultipleChoiceSubmission = { selectedOptionId: '3' };
      const result = quest!.validate(submission);
      
      if (result instanceof Promise) {
        throw new Error('Expected synchronous result but got Promise');
      }
      
      expect(result.success).toBe(false);
      expect(result.score).toBe(0);
    });

    it('should handle invalid submission type gracefully', () => {
      const invalidSubmission = { someOtherField: 'value' } as unknown as QuestSubmission;
      const result = quest!.validate(invalidSubmission);
      
      if (result instanceof Promise) {
        throw new Error('Expected synchronous result but got Promise');
      }
      
      expect(result.success).toBe(false);
      expect(result.score).toBe(0);
      expect(result.feedback).toContain('Invalid submission type');
    });
  });

  describe('aztec_storage_intro', () => {
    const quest = getQuestDefinition('aztec_storage_intro');
    
    it('should exist in registry', () => {
      expect(quest).toBeDefined();
      expect(quest?.questId).toBe('aztec_storage_intro');
      expect(quest?.type).toBe('multiple_choice');
      expect(quest?.tier).toBe(2);
    });

    it('should accept correct answer (option 1)', () => {
      const submission: MultipleChoiceSubmission = { selectedOptionId: '1' };
      const result = quest!.validate(submission);
      
      if (result instanceof Promise) {
        throw new Error('Expected synchronous result but got Promise');
      }
      
      expect(result.success).toBe(true);
      expect(result.score).toBe(100);
      expect(result.feedback).toContain('Correct');
      expect(result.feedback).toContain('private note');
    });

    it('should accept correct answer (option B)', () => {
      const submission: MultipleChoiceSubmission = { selectedOptionId: 'B' };
      const result = quest!.validate(submission);
      
      if (result instanceof Promise) {
        throw new Error('Expected synchronous result but got Promise');
      }
      
      expect(result.success).toBe(true);
      expect(result.score).toBe(100);
    });

    it('should accept correct answer (option b lowercase)', () => {
      const submission: MultipleChoiceSubmission = { selectedOptionId: 'b' };
      const result = quest!.validate(submission);
      
      if (result instanceof Promise) {
        throw new Error('Expected synchronous result but got Promise');
      }
      
      expect(result.success).toBe(true);
      expect(result.score).toBe(100);
    });

    it('should reject incorrect answer (option 0)', () => {
      const submission: MultipleChoiceSubmission = { selectedOptionId: '0' };
      const result = quest!.validate(submission);
      
      if (result instanceof Promise) {
        throw new Error('Expected synchronous result but got Promise');
      }
      
      expect(result.success).toBe(false);
      expect(result.score).toBe(0);
      expect(result.feedback).toContain('Incorrect');
    });

    it('should reject incorrect answer (option 2)', () => {
      const submission: MultipleChoiceSubmission = { selectedOptionId: '2' };
      const result = quest!.validate(submission);
      
      if (result instanceof Promise) {
        throw new Error('Expected synchronous result but got Promise');
      }
      
      expect(result.success).toBe(false);
      expect(result.score).toBe(0);
    });

    it('should reject incorrect answer (option 3)', () => {
      const submission: MultipleChoiceSubmission = { selectedOptionId: '3' };
      const result = quest!.validate(submission);
      
      if (result instanceof Promise) {
        throw new Error('Expected synchronous result but got Promise');
      }
      
      expect(result.success).toBe(false);
      expect(result.score).toBe(0);
    });

    it('should handle invalid submission type gracefully', () => {
      const invalidSubmission = { wrongField: 'value' } as unknown as QuestSubmission;
      const result = quest!.validate(invalidSubmission);
      
      if (result instanceof Promise) {
        throw new Error('Expected synchronous result but got Promise');
      }
      
      expect(result.success).toBe(false);
      expect(result.score).toBe(0);
      expect(result.feedback).toContain('Invalid submission type');
    });
  });

  describe('aztec_concept_quiz (reference implementation)', () => {
    const quest = getQuestDefinition('aztec_concept_quiz');
    
    it('should exist and have working validation', () => {
      expect(quest).toBeDefined();
      
      const correctSubmission: MultipleChoiceSubmission = { selectedOptionId: '0' };
      const result = quest!.validate(correctSubmission);
      
      if (result instanceof Promise) {
        throw new Error('Expected synchronous result but got Promise');
      }
      
      expect(result.success).toBe(true);
      expect(result.score).toBe(100);
    });
  });

  describe('aztec_privacy_basics', () => {
    const quest = getQuestDefinition('aztec_privacy_basics');
    
    it('should exist in registry', () => {
      expect(quest).toBeDefined();
      expect(quest?.questId).toBe('aztec_privacy_basics');
      expect(quest?.type).toBe('multiple_choice');
      expect(quest?.tier).toBe(1);
    });

    it('should accept correct answer (option 0)', () => {
      const submission: MultipleChoiceSubmission = { selectedOptionId: '0' };
      const result = quest!.validate(submission);
      
      if (result instanceof Promise) {
        throw new Error('Expected synchronous result but got Promise');
      }
      
      expect(result.success).toBe(true);
      expect(result.score).toBe(100);
      expect(result.feedback).toContain('Correct');
    });

    it('should accept correct answer (option A)', () => {
      const submission: MultipleChoiceSubmission = { selectedOptionId: 'A' };
      const result = quest!.validate(submission);
      
      if (result instanceof Promise) {
        throw new Error('Expected synchronous result but got Promise');
      }
      
      expect(result.success).toBe(true);
      expect(result.score).toBe(100);
    });

    it('should reject incorrect answer', () => {
      const submission: MultipleChoiceSubmission = { selectedOptionId: '1' };
      const result = quest!.validate(submission);
      
      if (result instanceof Promise) {
        throw new Error('Expected synchronous result but got Promise');
      }
      
      expect(result.success).toBe(false);
      expect(result.score).toBe(0);
    });
  });

  describe('aztec_notes_concept', () => {
    const quest = getQuestDefinition('aztec_notes_concept');
    
    it('should exist in registry', () => {
      expect(quest).toBeDefined();
      expect(quest?.questId).toBe('aztec_notes_concept');
      expect(quest?.type).toBe('multiple_choice');
      expect(quest?.tier).toBe(1);
    });

    it('should accept correct answer (option 0)', () => {
      const submission: MultipleChoiceSubmission = { selectedOptionId: '0' };
      const result = quest!.validate(submission);
      
      if (result instanceof Promise) {
        throw new Error('Expected synchronous result but got Promise');
      }
      
      expect(result.success).toBe(true);
      expect(result.score).toBe(100);
      expect(result.feedback).toContain('Correct');
    });

    it('should reject incorrect answer', () => {
      const submission: MultipleChoiceSubmission = { selectedOptionId: '1' };
      const result = quest!.validate(submission);
      
      if (result instanceof Promise) {
        throw new Error('Expected synchronous result but got Promise');
      }
      
      expect(result.success).toBe(false);
      expect(result.score).toBe(0);
    });
  });

  describe('aztec_public_vs_private', () => {
    const quest = getQuestDefinition('aztec_public_vs_private');
    
    it('should exist in registry', () => {
      expect(quest).toBeDefined();
      expect(quest?.questId).toBe('aztec_public_vs_private');
      expect(quest?.type).toBe('multiple_choice');
      expect(quest?.tier).toBe(1);
    });

    it('should accept correct answer (option 0)', () => {
      const submission: MultipleChoiceSubmission = { selectedOptionId: '0' };
      const result = quest!.validate(submission);
      
      if (result instanceof Promise) {
        throw new Error('Expected synchronous result but got Promise');
      }
      
      expect(result.success).toBe(true);
      expect(result.score).toBe(100);
      expect(result.feedback).toContain('Correct');
    });

    it('should reject incorrect answer', () => {
      const submission: MultipleChoiceSubmission = { selectedOptionId: '1' };
      const result = quest!.validate(submission);
      
      if (result instanceof Promise) {
        throw new Error('Expected synchronous result but got Promise');
      }
      
      expect(result.success).toBe(false);
      expect(result.score).toBe(0);
    });
  });
});

