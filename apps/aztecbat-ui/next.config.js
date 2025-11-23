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
    return config;
  },
  // Turbopack config (Next.js 16 uses Turbopack by default)
  turbopack: {
    // Turbopack handles Node.js module exclusions automatically
    // No additional config needed for fs/path exclusion
  },
};

module.exports = nextConfig;

