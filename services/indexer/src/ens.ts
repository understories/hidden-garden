import { ethers } from 'ethers';

/**
 * ENS resolver with in-memory caching and timeout support
 */
export class EnsResolver {
  private cache: Map<string, string | null> = new Map();
  private provider: ethers.Provider;
  private timeoutMs: number;
  private enabled: boolean;

  constructor(
    provider: ethers.Provider,
    options: {
      timeoutMs?: number;
      enabled?: boolean;
    } = {}
  ) {
    this.provider = provider;
    this.timeoutMs = options.timeoutMs ?? 2000; // 2 second default timeout
    this.enabled = options.enabled ?? true;
  }

  /**
   * Resolve an address to an ENS name
   * @param address The Ethereum address to resolve
   * @returns The ENS name if found, null otherwise
   */
  async lookupAddress(address: string): Promise<string | null> {
    if (!this.enabled) {
      return null;
    }

    // Normalize address to lowercase for cache key
    const normalizedAddress = address.toLowerCase();

    // Check cache first
    if (this.cache.has(normalizedAddress)) {
      return this.cache.get(normalizedAddress) ?? null;
    }

    // Perform lookup with timeout
    try {
      const ensName = await Promise.race([
        this.provider.lookupAddress(address),
        new Promise<string | null>((_, reject) =>
          setTimeout(() => reject(new Error('ENS lookup timeout')), this.timeoutMs)
        ),
      ]);

      // Cache the result (even if null, to avoid repeated lookups)
      this.cache.set(normalizedAddress, ensName);
      return ensName;
    } catch (error) {
      // On error (timeout or other), cache null to avoid repeated failures
      console.warn(`ENS lookup failed for ${address}:`, error instanceof Error ? error.message : error);
      this.cache.set(normalizedAddress, null);
      return null;
    }
  }

  /**
   * Resolve multiple addresses to ENS names in parallel (with batching)
   * @param addresses Array of addresses to resolve
   * @returns Map of address -> ENS name (or null)
   */
  async lookupAddresses(addresses: string[]): Promise<Map<string, string | null>> {
    if (!this.enabled || addresses.length === 0) {
      return new Map();
    }

    // Deduplicate addresses
    const uniqueAddresses = Array.from(new Set(addresses.map((a) => a.toLowerCase())));

    // Check cache for all addresses first
    const results = new Map<string, string | null>();
    const addressesToLookup: string[] = [];

    for (const address of uniqueAddresses) {
      if (this.cache.has(address)) {
        results.set(address, this.cache.get(address) ?? null);
      } else {
        addressesToLookup.push(address);
      }
    }

    // Lookup remaining addresses in parallel (with concurrency limit)
    if (addressesToLookup.length > 0) {
      const lookupPromises = addressesToLookup.map((address) =>
        this.lookupAddress(address).then((name) => {
          results.set(address, name);
        })
      );

      // Wait for all lookups to complete (or timeout)
      await Promise.allSettled(lookupPromises);
    }

    return results;
  }

  /**
   * Clear the cache (useful for testing or manual refresh)
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache size (for monitoring)
   */
  getCacheSize(): number {
    return this.cache.size;
  }
}

