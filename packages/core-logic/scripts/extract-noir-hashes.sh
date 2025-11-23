#!/bin/bash
# Script to extract Pedersen hash values from Noir test output
# 
# Prerequisites:
#   1. Install Aztec CLI: bash -i <(curl -s https://install.aztec.network)
#   2. Run: cd packages/core-logic && aztec-nargo test tests/compute_pedersen_hashes.nr
#
# Usage:
#   ./scripts/extract-noir-hashes.sh <test_output_file>
#   OR pipe directly: aztec-nargo test tests/compute_pedersen_hashes.nr | ./scripts/extract-noir-hashes.sh

if [ -z "$1" ]; then
    # Read from stdin if no file provided
    INPUT="-"
else
    INPUT="$1"
fi

echo "Extracting Pedersen hash values from Noir test output..."
echo ""

# Look for Field values in the output
# Noir test output typically shows: Field(<big_integer>)
# We need to extract the big integer and convert to hex

grep -i "field\|constrain\|q1\|q2\|q3\|cat\|path" "$INPUT" | head -30

echo ""
echo "=== Manual Extraction Steps ==="
echo "1. Look for Field values in the output above"
echo "2. For each Field value, extract the big integer"
echo "3. Convert to hex using: node scripts/convert-field-to-hex.js <field_value>"
echo "4. Update PEDERSEN_HASH_LOOKUP in src/quests/hashing.ts"
echo ""
echo "Expected hashes to extract:"
echo "  - q1: aztec_concept_quiz"
echo "  - q2: noir_syntax_basics"
echo "  - q3: aztec_storage_intro"
echo "  - cat: aztec_builder"
echo "  - path: aztec_builder_path"

