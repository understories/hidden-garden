/**
 * Mock Wallet Configuration
 * 
 * Provides mock wallet functionality for development and testing.
 * Allows the app to work without requiring a real browser wallet extension.
 */

// Mock wallet address for development
export const MOCK_WALLET_ADDRESS = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb' as `0x${string}`;

// Check if mock wallet is enabled
export function isMockWalletEnabled(): boolean {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_MOCK_WALLET === 'true';
  }
  
  return (
    process.env.NEXT_PUBLIC_MOCK_WALLET === 'true' ||
    localStorage.getItem('mockWallet') === 'true' ||
    (window.ethereum as any)?.isMockWallet === true
  );
}

// Enable mock wallet
export function enableMockWallet(): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('mockWallet', 'true');
  }
}

// Disable mock wallet
export function disableMockWallet(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('mockWallet');
  }
}

// Toggle mock wallet
export function toggleMockWallet(): void {
  if (isMockWalletEnabled()) {
    disableMockWallet();
  } else {
    enableMockWallet();
  }
  window.location.reload();
}

