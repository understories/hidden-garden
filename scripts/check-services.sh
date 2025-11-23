#!/bin/bash
# Quick service health check for real-mode dry run

echo "=== Service Health Check ==="
echo ""

# Check Aztec PXE
echo -n "Aztec PXE (http://localhost:8080): "
if curl -s http://localhost:8080 > /dev/null 2>&1; then
  echo "✅ Reachable"
else
  echo "❌ Not reachable"
fi

# Check Hardhat RPC
echo -n "Hardhat RPC (http://localhost:8545): "
if curl -s -X POST http://localhost:8545 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' 2>/dev/null | grep -q result; then
  echo "✅ Reachable"
else
  echo "❌ Not reachable"
fi

# Check Indexer
echo -n "Indexer (http://localhost:3001): "
if curl -s http://localhost:3001/health 2>/dev/null | grep -q ok; then
  echo "✅ Reachable"
else
  echo "⚠️  Not reachable (optional)"
fi

# Check UI
echo -n "UI (http://localhost:3000): "
if curl -s http://localhost:3000 > /dev/null 2>&1; then
  echo "✅ Reachable"
else
  echo "❌ Not reachable"
fi

echo ""
echo "=== Next Steps ==="
echo "If all services are ✅, proceed to:"
echo "1. Navigate to http://localhost:3000/dev/aztec-lab"
echo "2. Complete a quest (Section 4: Quest Testing)"
echo "3. Use selective reveal (Section 2: Select What to Reveal)"
echo "4. Verify transaction and leaderboard"

