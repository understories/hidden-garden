/**
 * Test for Self verification status display in /me page
 *
 * This test verifies that the "Verified Human ✅" badge renders
 * when the useHasValidSBT hook returns isVerified = true.
 */

import { render, screen } from '@testing-library/react';
import React from 'react';
import MyGardenPage from '../page';

// Mock the useHasValidSBT hook
jest.mock('../../../hooks/useHasValidSBT', () => ({
  useHasValidSBT: jest.fn(),
}));

// Mock other dependencies
jest.mock('wagmi', () => ({
  useAccount: jest.fn(() => ({
    address: '0x1234567890123456789012345678901234567890',
    isConnected: true,
  })),
  useChainId: jest.fn(() => 31337),
}));

jest.mock('../../../lib/selfVerification', () => ({
  startSelfVerificationFlow: jest.fn(),
}));

jest.mock('../../../lib/viemClients', () => ({
  mainnetPublicClient: {
    getEnsName: jest.fn(),
  },
}));

jest.mock('@hidden-garden/core-logic', () => ({
  normalizeSkillId: jest.fn((name: string) => name.toLowerCase().replace(/\s+/g, '-')),
  shortenAddress: jest.fn((addr: string) => `${addr.slice(0, 6)}…${addr.slice(-4)}`),
  getEnsName: jest.fn(),
}));

import { useHasValidSBT } from '../../../hooks/useHasValidSBT';

describe('MyGardenPage - Verification Status', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render "Verified Human ✅" badge when isVerified is true', () => {
    // Mock hook to return verified state
    (useHasValidSBT as jest.Mock).mockReturnValue({
      isLoading: false,
      isVerified: true,
      error: null,
      refetch: jest.fn(),
    });

    render(<MyGardenPage />);

    // Check that the verified badge is displayed
    const verifiedBadge = screen.getByText(/Verified Human/i);
    expect(verifiedBadge).toBeInTheDocument();
    expect(verifiedBadge).toHaveTextContent('Verified Human');
  });

  it('should not show "Verify with Self" button when isVerified is true', () => {
    // Mock hook to return verified state
    (useHasValidSBT as jest.Mock).mockReturnValue({
      isLoading: false,
      isVerified: true,
      error: null,
      refetch: jest.fn(),
    });

    render(<MyGardenPage />);

    // Verify button should not be present
    const verifyButton = screen.queryByText(/Verify with Self/i);
    expect(verifyButton).not.toBeInTheDocument();
  });

  it('should show "Not verified yet" when isVerified is false', () => {
    // Mock hook to return not verified state
    (useHasValidSBT as jest.Mock).mockReturnValue({
      isLoading: false,
      isVerified: false,
      error: null,
      refetch: jest.fn(),
    });

    render(<MyGardenPage />);

    // Check that "Not verified yet" is displayed
    const notVerifiedText = screen.getByText(/Not verified yet/i);
    expect(notVerifiedText).toBeInTheDocument();

    // Verify button should be present
    const verifyButton = screen.getByText(/Verify with Self/i);
    expect(verifyButton).toBeInTheDocument();
  });

  it('should show loading state when isLoading is true', () => {
    // Mock hook to return loading state
    (useHasValidSBT as jest.Mock).mockReturnValue({
      isLoading: true,
      isVerified: false,
      error: null,
      refetch: jest.fn(),
    });

    render(<MyGardenPage />);

    // Check that loading text is displayed
    const loadingText = screen.getByText(/Checking verification/i);
    expect(loadingText).toBeInTheDocument();
  });
});

