/**
 * Hook to check if a user has a valid Self Human SBT
 *
 * This hook queries the SelfHumanSBT contract on-chain to check
 * if the given address has a valid SBT.
 *
 * @param address - The Ethereum address to check (optional, defaults to connected wallet)
 * @returns Object with isLoading, isVerified, error, and refetch function
 */

import { useReadContract, useChainId } from 'wagmi';
import { SelfHumanSBTAbi, getSelfHumanSBTAddress } from '@hidden-garden/core-logic';
import type { Address } from '@hidden-garden/core-logic';

export function useHasValidSBT(address?: Address) {
  const chainId = useChainId();
  const sbtAddress = getSelfHumanSBTAddress(chainId);

  const {
    data: hasSBT,
    isLoading,
    error,
    refetch,
  } = useReadContract({
    address: sbtAddress,
    abi: SelfHumanSBTAbi,
    functionName: 'hasValidSBT',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!sbtAddress, // Only query if address and contract address are available
    },
  });

  // Determine if we're in a loading state
  const isLoadingState = isLoading || (!sbtAddress && !!address);

  // Determine error state
  const errorState = error || (!sbtAddress && !!address ? new Error(`SelfHumanSBT contract not deployed on chain ${chainId}`) : null);

  return {
    isLoading: isLoadingState,
    isVerified: hasSBT === true,
    error: errorState,
    refetch,
  };
}

