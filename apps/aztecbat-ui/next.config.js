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
      
      // Ignore optional wagmi connector dependencies that aren't needed
      // These are dynamically imported by wagmi connectors but not required for basic functionality
      // We only use injected() connector (MetaMask/browser wallets via window.ethereum)
      // The injected connector works with browser extensions without needing these SDKs
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^@base-org\/account$|^@coinbase\/wallet-sdk$|^@gemini-wallet\/core$|^@metamask\/sdk$/,
        })
      );
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

