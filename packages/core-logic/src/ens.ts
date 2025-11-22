// packages/common/src/ens.ts

export function shortenAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

// Minimal interface for any client that can resolve ENS.
// We intentionally keep this generic so `@hidden-garden/common`
// doesn't need a hard dependency on `viem`.
export interface EnsPublicClient {
  getEnsName(args: { address: `0x${string}` }): Promise<string | null>;
}

export async function getEnsName(
  client: EnsPublicClient,
  address: `0x${string}`,
): Promise<string | null> {
  return client.getEnsName({ address });
}

