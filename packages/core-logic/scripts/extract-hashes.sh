#!/bin/bash
# Script to extract Pedersen hash values from Noir test output
# 
# Usage:
#   1. Run: aztec-nargo test tests/compute_pedersen_hashes.nr > test_output.txt
#   2. Run: ./scripts/extract-hashes.sh test_output.txt
#   3. Copy the output values into hashing.ts

if [ -z "$1" ]; then
    echo "Usage: $0 <test_output_file>"
    echo "Example: $0 test_output.txt"
    exit 1
fi

echo "Extracting Pedersen hash values from test output..."
echo ""

# Look for Field values in the output
# This is a simple extraction - you may need to adjust based on actual output format
grep -i "field\|hash\|pedersen" "$1" | head -20

echo ""
echo "Manual extraction steps:"
echo "1. Find the Field values in the output above"
echo "2. Convert each Field (big integer) to hex"
echo "3. Pad to 64 hex characters (32 bytes)"
echo "4. Add 0x prefix"
echo "5. Update PEDERSEN_HASH_LOOKUP in src/quests/hashing.ts"
echo ""
echo "Example conversion (using Node.js):"
echo "  node -e \"console.log('0x' + BigInt('<field_value>').toString(16).padStart(64, '0'))\""

