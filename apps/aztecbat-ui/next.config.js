const webpack = require('webpack');

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Exclude Node.js modules from client bundle
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }
    
    // Ignore ALL optional wagmi connector dependencies (both server and client)
    const optionalWagmiDeps = [
      '@base-org/account',
      '@coinbase/wallet-sdk',
      '@gemini-wallet/core',
      '@metamask/sdk',
      '@walletconnect/ethereum-provider',
      '@walletconnect/modal',
      '@walletconnect/types',
      '@safe-global/safe-apps-sdk',
      '@safe-global/safe-apps-provider',
      'porto',
    ];
    
    const depPattern = optionalWagmiDeps.map(dep => dep.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: new RegExp(`^(${depPattern})$`),
      })
    );
    
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        ...optionalWagmiDeps.reduce((acc, dep) => {
          acc[dep] = false;
          return acc;
        }, {}),
      };
    }
    
    // Ignore test dependencies (both server and client)
    const testDeps = ['tap', 'desm', 'fastbench', 'pino-elasticsearch', 'why-is-node-running'];
    testDeps.forEach(dep => {
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: new RegExp(`^${dep.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`),
        })
      );
    });
    
    // Aggressively ignore test files and directories in node_modules (both server and client)
    config.plugins.push(
      new webpack.IgnorePlugin({
        checkResource(resource, context) {
          if (!context || !resource) return false;
          const contextStr = String(context);
          const resourceStr = String(resource);
          
          // Ignore test files and test directories in node_modules
          if (contextStr.includes('node_modules')) {
            if (resourceStr.includes('/test/') || 
                resourceStr.includes('/tests/') ||
                resourceStr.match(/\.(test|spec)\.(js|mjs|ts|tsx|mts|cts)$/i)) {
              return true;
            }
          }
          return false;
        },
      })
    );
    
    // Ignore specific problematic test files from thread-stream
    config.plugins.push(
      new webpack.IgnorePlugin({
        checkResource(resource) {
          const resourceStr = String(resource);
          if (resourceStr.includes('thread-stream') && 
              (resourceStr.includes('/test/') || resourceStr.includes('/bench'))) {
            return true;
          }
          return false;
        },
      })
    );
    
    return config;
  },
  // Use webpack instead of turbopack for better control over module resolution
  // This helps with excluding test files from Aztec dependencies
  experimental: {
    turbo: {
      resolveAlias: {
        // Exclude test files
        'tap': false,
        'desm': false,
        'fastbench': false,
        'pino-elasticsearch': false,
        'why-is-node-running': false,
      },
      resolveExtensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    },
  },
};

module.exports = nextConfig;

