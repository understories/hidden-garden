#!/bin/bash
# Check Aztec Services Status
# Verifies that required services are running for the Aztec integration

echo "🔍 Checking Aztec Services Status..."
echo ""

# Check Aztec PXE
echo "1. Aztec PXE (http://localhost:8080):"
if curl -s http://localhost:8080 > /dev/null 2>&1; then
    echo "   ✅ Running"
else
    echo "   ❌ NOT RUNNING"
    echo ""
    echo "   To start Aztec sandbox:"
    echo "     pnpm aztec:sandbox"
    echo ""
    echo "   Or with Docker:"
    echo "     docker run -d -p 8080:8080 --name aztec-sandbox aztecprotocol/sandbox:latest"
    echo ""
    echo "   Wait 10-30 seconds for it to fully start."
fi

echo ""

# Check Hardhat RPC
echo "2. Hardhat RPC (http://localhost:8545):"
if curl -s http://localhost:8545 > /dev/null 2>&1; then
    echo "   ✅ Running"
else
    echo "   ❌ NOT RUNNING"
    echo ""
    echo "   To start Hardhat:"
    echo "     cd packages/contracts-public"
    echo "     pnpm hardhat node"
fi

echo ""

# Check Docker containers
echo "3. Docker Containers:"
if docker ps | grep -q aztec; then
    echo "   ✅ Aztec container is running"
    docker ps | grep aztec
else
    echo "   ❌ No Aztec containers found"
fi

echo ""
echo "📋 Service Requirements:"
echo "   Aztec PXE and Hardhat RPC must be running for the demo to work."

