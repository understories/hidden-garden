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
      
      // Ignore ALL optional wagmi connector dependencies
      // We only use injected() connector which works with browser extensions (window.ethereum)
      // All other connectors require optional SDKs that we don't need for MVP
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
        'porto', // Porto wallet connector
      ];
      
      // Use IgnorePlugin to prevent webpack from trying to resolve these modules
      // This handles dynamic imports that wagmi connectors try to load
      // Create regex pattern that matches any of the optional dependencies
      const depPattern = optionalWagmiDeps.map(dep => dep.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: new RegExp(`^(${depPattern})$`),
        })
      );
      
      // Also set them as false in resolve.alias as a fallback
      config.resolve.alias = {
        ...config.resolve.alias,
        ...optionalWagmiDeps.reduce((acc, dep) => {
          acc[dep] = false;
          return acc;
        }, {}),
      };
    }
    
    // Ignore test files and test dependencies from node_modules
    // This prevents Next.js from trying to bundle test files from Aztec dependencies
    const testDeps = ['tap', 'desm', 'fastbench', 'pino-elasticsearch', 'why-is-node-running'];
    testDeps.forEach(dep => {
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: new RegExp(`^${dep.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`),
        })
      );
    });
    
    // Ignore test directories and test files in node_modules
    config.plugins.push(
      new webpack.IgnorePlugin({
        checkResource(resource, context) {
          // Ignore test files and test directories in node_modules
          if (context.includes('node_modules')) {
            if (resource.includes('/test/') || 
                resource.includes('/tests/') ||
                resource.match(/\.(test|spec)\.(js|mjs|ts|tsx)$/)) {
              return true;
            }
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

