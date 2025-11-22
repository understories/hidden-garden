# ENS Resolution in Indexer

The indexer service optionally enriches API responses with ENS (Ethereum Name Service) names for user addresses.

## Configuration

Environment variables:

- `ENS_ENABLED` (default: `true`): Enable or disable ENS resolution
- `ENS_TIMEOUT_MS` (default: `2000`): Timeout in milliseconds for ENS lookups

## Features

- **In-memory caching**: ENS lookups are cached for the duration of the process to avoid repeated RPC calls
- **Best-effort**: If ENS lookup fails or times out, responses are returned without ENS names (no blocking)
- **Parallel lookups**: Multiple addresses are resolved in parallel for efficiency
- **Timeout protection**: Each lookup has a configurable timeout to prevent hanging requests

## API Response Format

When ENS resolution is enabled and successful, API responses include an optional `ensName` field:

### GET /leaderboard?skillHash=...

```json
[
  {
    "id": 1,
    "user_address": "0x1234...",
    "skill_hash": "0xabcd...",
    "tier": 5,
    "block_number": 12345,
    "tx_hash": "0x5678...",
    "timestamp": 1234567890,
    "created_at": 1234567890,
    "ensName": "vitalik.eth"  // Optional, only present if resolved
  }
]
```

### GET /user/:address/skills

Same format as above - each skill reveal may include `ensName` if available.

## Testing

### Manual Test on Sepolia Testnet

1. Start the indexer with Sepolia RPC:
   ```bash
   RPC_URL=https://rpc.sepolia.org pnpm dev:indexer
   ```

2. Query an address with a known ENS name (e.g., `vitalik.eth`):
   ```bash
   curl "http://localhost:4000/user/0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045/skills"
   ```

3. Check if `ensName` is included in the response.

### Known ENS Addresses for Testing

- `vitalik.eth` → `0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045` (Ethereum mainnet)
- `ens.eth` → `0x4f3a120E72C76c22ae802D129F419BFb3CACd35B` (Ethereum mainnet)

**Note**: ENS names are only resolvable on Ethereum mainnet. For testnets, you may need to use a mainnet RPC endpoint for ENS resolution while indexing testnet data.

## Implementation Details

- Uses `ethers.Provider.lookupAddress()` for reverse resolution
- Cache is in-memory only (cleared on process restart)
- Failed lookups are cached as `null` to avoid repeated failures
- Timeout errors are logged as warnings but don't block responses

