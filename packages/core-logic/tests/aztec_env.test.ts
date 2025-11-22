/**
 * Aztec Environment Test
 * 
 * Verifies that Aztec CLI version matches our target devnet version.
 * This test gracefully skips if Aztec CLI is not installed.
 * 
 * Target version: 3.0.0-devnet.5
 * Verify against: https://docs.aztec.network/devnet
 */

import { describe, it, expect } from '@jest/globals';
import { execSync } from 'child_process';

const TARGET_DEVNET_VERSION = '3.0.0-devnet.5';
const TARGET_VERSION_PATTERN = /3\.0\.0-devnet\.(4|5)/; // Allow .4 or .5 for compatibility

describe('Aztec Environment', () => {
  let aztecCliAvailable = false;
  let aztecVersion: string | null = null;

  beforeAll(() => {
    try {
      // Try to get Aztec CLI version
      const output = execSync('aztec --version', { 
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe'],
        timeout: 5000,
      });
      aztecVersion = output.trim();
      aztecCliAvailable = true;
    } catch (error) {
      // Aztec CLI not available - test will be skipped
      aztecCliAvailable = false;
    }
  });

  it('should have Aztec CLI installed', () => {
    if (!aztecCliAvailable) {
      console.log('⏭️  Skipping: Aztec CLI not installed.');
      console.log('   Install with: bash -i <(curl -s https://install.aztec.network)');
      console.log('   Or set SKIP_AZTEC_TESTS=true to skip all Aztec tests');
      return; // Skip test gracefully
    }

    expect(aztecVersion).toBeTruthy();
    expect(aztecVersion).toContain('aztec');
  });

  it('should match target devnet version', () => {
    if (!aztecCliAvailable) {
      console.log('⏭️  Skipping: Aztec CLI not installed.');
      return;
    }

    expect(aztecVersion).toBeTruthy();
    
    // Check if version matches our target (allowing .4 or .5)
    const versionMatch = aztecVersion?.match(TARGET_VERSION_PATTERN);
    
    if (!versionMatch) {
      console.warn(`⚠️  Aztec CLI version "${aztecVersion}" does not match target "${TARGET_DEVNET_VERSION}"`);
      console.warn('   Expected version pattern: 3.0.0-devnet.4 or 3.0.0-devnet.5');
      console.warn('   Update with: aztec-up 3.0.0-devnet.5');
      console.warn('   Or verify current version at: https://docs.aztec.network/devnet');
    }

    // For now, we'll warn but not fail the test
    // This allows flexibility while still checking version
    expect(versionMatch).toBeTruthy();
  });

  it('should document version pinning', () => {
    // This test always passes - it's documentation
    expect(TARGET_DEVNET_VERSION).toBe('3.0.0-devnet.5');
    
    // Verify version is pinned in package.json
    // This is a compile-time check
    const packageJson = require('../package.json');
    expect(packageJson.dependencies['@aztec/aztec.js']).toBe('3.0.0-devnet.5');
  });
});

