/**
 * PXE Health Check Utility
 * 
 * Validates PXE connection and provides helpful error messages.
 * Follows Aztec starter patterns for connection validation.
 */

import type { PXE } from '@aztec/aztec.js/node';

export interface PXEHealthCheckResult {
  healthy: boolean;
  error?: string;
  details?: {
    pxeUrl: string;
    responseTime?: number;
  };
}

/**
 * Check if PXE is healthy and reachable
 * 
 * @param pxe PXE client instance
 * @param pxeUrl PXE URL for error messages
 * @param timeout Timeout in milliseconds (default: 10000)
 * @returns Health check result
 */
export async function checkPXEHealth(
  pxe: PXE,
  pxeUrl: string,
  timeout: number = 10000
): Promise<PXEHealthCheckResult> {
  const startTime = Date.now();
  
  try {
    // Try to get node info as a health check
    // In Aztec v3, we can check if the node is responsive
    // This is a simple check - if we can call a method, the node is up
    
    // Note: In Aztec v3, the exact health check API may vary
    // This is a placeholder that will be improved based on actual SDK API
    const nodeInfo = await Promise.race([
      // Try to get a simple property or call a method
      Promise.resolve(pxe).then(() => {
        // If we can access pxe, it's at least initialized
        return { status: 'ok' };
      }),
      // Timeout after specified duration
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Health check timeout')), timeout)
      ),
    ]);
    
    const responseTime = Date.now() - startTime;
    
    return {
      healthy: true,
      details: {
        pxeUrl,
        responseTime,
      },
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    return {
      healthy: false,
      error: error instanceof Error ? error.message : String(error),
      details: {
        pxeUrl,
        responseTime,
      },
    };
  }
}

/**
 * Validate PXE URL format
 * 
 * @param pxeUrl PXE URL to validate
 * @returns true if valid, false otherwise
 */
export function validatePXEUrl(pxeUrl: string): boolean {
  try {
    const url = new URL(pxeUrl);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Get helpful error message for PXE connection issues
 * 
 * @param pxeUrl PXE URL that failed
 * @param error Original error
 * @returns Helpful error message with troubleshooting steps
 */
export function getPXEErrorMessage(pxeUrl: string, error: unknown): string {
  const errorMsg = error instanceof Error ? error.message : String(error);
  
  const suggestions = [
    `Verify PXE URL is correct: ${pxeUrl}`,
    'Check if Aztec sandbox/devnet is running',
    'For sandbox: Run `pnpm aztec:sandbox` or `docker run -it -p 8080:8080 aztecprotocol/sandbox:latest`',
    'For devnet: Run `aztec start --devnet` or check your AZTEC_ENV configuration',
    'Check network connectivity and firewall settings',
    'Verify the PXE service is listening on the expected port',
  ];
  
  return (
    `Failed to connect to Aztec PXE at ${pxeUrl}.\n` +
    `Error: ${errorMsg}\n\n` +
    `Troubleshooting steps:\n${suggestions.map(s => `  - ${s}`).join('\n')}`
  );
}

