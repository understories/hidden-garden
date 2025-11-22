#!/bin/bash
# Simple script to get pedersen hashes once Aztec CLI is installed
# Run: ./scripts/get-hashes.sh

echo "Running Noir test to compute hashes..."
aztec-nargo test tests/compute_pedersen_hashes.nr 2>&1 | tee /tmp/hash_output.txt

echo ""
echo "Look for Field values in the output above"
echo "Then convert each to hex: node scripts/convert-field-to-hex.js <field_value>"
