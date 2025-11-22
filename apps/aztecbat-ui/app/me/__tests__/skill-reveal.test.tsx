/**
 * Test for skill reveal flow in /me page
 *
 * This test verifies that:
 * - SkillProofProvider.generateProof is called with correct arguments
 * - wagmi contract call is made with correct arguments
 * - UI shows success state after successful submission
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyGardenPage from '../page';

// Mock the SkillProofProvider
const mockGenerateProof = jest.fn();
jest.mock('@hidden-garden/game-engine', () => ({
  stubSkillProofProvider: {
    generateProof: mockGenerateProof,
  },
}));

// Mock wagmi hooks
const mockWriteContract = jest.fn();
const mockUseWriteContract = jest.fn(() => ({
  writeContract: mockWriteContract,
  data: null,
  isPending: false,
  error: null,
}));

const mockUseWaitForTransactionReceipt = jest.fn(() => ({
  isLoading: false,
  isSuccess: false,
}));

jest.mock('wagmi', () => ({
  useAccount: jest.fn(() => ({
    address: '0x1234567890123456789012345678901234567890',
    isConnected: true,
  })),
  useChainId: jest.fn(() => 31337),
  useWriteContract: mockUseWriteContract,
  useWaitForTransactionReceipt: mockUseWaitForTransactionReceipt,
}));

// Mock other dependencies
jest.mock('../../hooks/useHasValidSBT', () => ({
  useHasValidSBT: jest.fn(() => ({
    isLoading: false,
    isVerified: true,
    error: null,
    refetch: jest.fn(),
  })),
}));

jest.mock('../../lib/selfVerification', () => ({
  startSelfVerificationFlow: jest.fn(),
}));

jest.mock('../../lib/viemClients', () => ({
  mainnetPublicClient: {
    getEnsName: jest.fn(),
  },
}));

jest.mock('@hidden-garden/core-logic', () => ({
  normalizeSkillId: jest.fn((name: string) => name.toLowerCase().replace(/\s+/g, '-')),
  shortenAddress: jest.fn((addr: string) => `${addr.slice(0, 6)}…${addr.slice(-4)}`),
  getEnsName: jest.fn(),
  hashSkillName: jest.fn((name: string) => `0x${'a'.repeat(64)}` as `0x${string}`),
  SkillLeaderboardAbi: [],
  getSkillLeaderboardAddress: jest.fn(() => '0xSkillLeaderboardAddress' as `0x${string}`),
}));

describe('MyGardenPage - Skill Reveal Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGenerateProof.mockResolvedValue({
      proofData: '0x1234567890abcdef',
      claimedTier: 3,
    });
    mockUseWriteContract.mockReturnValue({
      writeContract: mockWriteContract,
      data: null,
      isPending: false,
      error: null,
    });
    mockUseWaitForTransactionReceipt.mockReturnValue({
      isLoading: false,
      isSuccess: false,
    });
  });

  it('should call SkillProofProvider.generateProof with correct arguments', async () => {
    const user = userEvent.setup();
    render(<MyGardenPage />);

    // Click "Reveal this skill" button
    const revealButton = screen.getByText(/Reveal this skill/i);
    await user.click(revealButton);

    // Click "Generate proof & publish" button
    const generateButton = screen.getByText(/Generate proof & publish/i);
    await user.click(generateButton);

    // Wait for proof generation to be called
    await waitFor(() => {
      expect(mockGenerateProof).toHaveBeenCalledWith({
        skillHash: expect.stringMatching(/^0x[a-f0-9]+$/),
        minTier: 3, // Default tier
      });
    });
  });

  it('should call writeContract with correct arguments', async () => {
    const user = userEvent.setup();
    render(<MyGardenPage />);

    // Click "Reveal this skill" button
    const revealButton = screen.getByText(/Reveal this skill/i);
    await user.click(revealButton);

    // Click "Generate proof & publish" button
    const generateButton = screen.getByText(/Generate proof & publish/i);
    await user.click(generateButton);

    // Wait for contract call
    await waitFor(() => {
      expect(mockWriteContract).toHaveBeenCalled();
    });

    const callArgs = mockWriteContract.mock.calls[0][0];
    expect(callArgs).toMatchObject({
      address: '0xSkillLeaderboardAddress',
      abi: [],
      functionName: 'submitSkillTierWithProof',
    });
    expect(callArgs.args).toHaveLength(4);
    expect(callArgs.args[0]).toMatch(/^0x[a-f0-9]+$/); // skillHash
    expect(callArgs.args[1]).toBe(3); // minLevel
    expect(callArgs.args[2]).toBe('0x1234567890abcdef'); // proof
    expect(callArgs.args[3]).toBeDefined(); // publicInputs
  });

  it('should show success state when transaction is confirmed', async () => {
    // Mock successful transaction
    mockUseWaitForTransactionReceipt.mockReturnValue({
      isLoading: false,
      isSuccess: true,
    });

    const user = userEvent.setup();
    render(<MyGardenPage />);

    // Click "Reveal this skill" button
    const revealButton = screen.getByText(/Reveal this skill/i);
    await user.click(revealButton);

    // Click "Generate proof & publish" button
    const generateButton = screen.getByText(/Generate proof & publish/i);
    await user.click(generateButton);

    // Wait for success message
    await waitFor(() => {
      expect(screen.getByText(/Published to leaderboard/i)).toBeInTheDocument();
    });
  });
});

