#!/usr/bin/env node
/**
 * Convert Noir Field value to hex string
 * 
 * Usage:
 *   node scripts/convert-field-to-hex.js <field_value>
 * 
 * Example:
 *   node scripts/convert-field-to-hex.js 1234567890123456789012345678901234567890
 *   Output: 0x0000000000000000000000000000000000000000000000000000000000000000
 */

const fieldValue = process.argv[2];

if (!fieldValue) {
  console.error('Usage: node convert-field-to-hex.js <field_value>');
  console.error('Example: node convert-field-to-hex.js 1234567890123456789012345678901234567890');
  process.exit(1);
}

try {
  // Convert to BigInt
  const bigIntValue = BigInt(fieldValue);
  
  // Convert to hex (remove 0x if present)
  let hex = bigIntValue.toString(16);
  
  // Pad to 64 hex characters (32 bytes)
  hex = hex.padStart(64, '0');
  
  // Add 0x prefix
  const hexString = `0x${hex}`;
  
  console.log('Field value:', fieldValue);
  console.log('Hex string:', hexString);
  console.log('Length:', hexString.length, 'characters (should be 66: 0x + 64 hex chars)');
  
  // Validate length
  if (hexString.length !== 66) {
    console.warn('⚠️  Warning: Expected 66 characters (0x + 64 hex chars)');
  }
  
} catch (error) {
  console.error('Error converting field value:', error.message);
  console.error('Make sure the field value is a valid number or big integer string');
  process.exit(1);
}

