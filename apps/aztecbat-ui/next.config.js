const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Transpile the package to ensure it's processed correctly
  transpilePackages: ['@walletconnect/ethereum-provider', '@hidden-garden/core-logic'],
  webpack: (config, { isServer, webpack }) => {
    // Add IgnorePlugin for optional dependencies at the top level
    config.plugins = config.plugins || [];
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^(porto|porto\/internal)$/,
      })
    );
    
    // Ensure webpack can resolve packages from pnpm's node_modules structure
    // This is critical for optional dependencies that are dynamically imported
    // Server-side also needs proper resolution for ESM packages like @aztec/aztec.js
    if (isServer) {
      // Server-side: Handle ESM packages and pnpm symlinks
      config.resolve.symlinks = true;
      config.resolve.modules = [
        path.resolve(__dirname, 'node_modules'),
        path.resolve(__dirname, '../../node_modules'),
        ...(config.resolve.modules || []),
      ];
    }
    
    if (!isServer) {
      // Enable symlink resolution (pnpm uses symlinks)
      config.resolve.symlinks = true;
      
      // Ensure webpack looks in the right places for modules
      // This helps resolve pnpm's nested node_modules structure
      config.resolve.modules = [
        path.resolve(__dirname, 'node_modules'),
        path.resolve(__dirname, '../../node_modules'),
        ...(config.resolve.modules || []),
      ];
      
      // Ensure proper resolution of @walletconnect packages
      // This helps webpack find the package when it's dynamically imported
      // Resolve the symlink to the actual package location in pnpm's store
      const fs = require('fs');
      const walletConnectPath = path.resolve(
        __dirname,
        'node_modules/@walletconnect/ethereum-provider'
      );
      try {
        // Resolve symlink to actual location in pnpm store
        const realPath = fs.realpathSync(walletConnectPath);
        config.resolve.alias = {
          ...config.resolve.alias,
          '@walletconnect/ethereum-provider': realPath,
        };
      } catch (e) {
        // Fallback to symlink path if resolution fails
        config.resolve.alias = {
          ...config.resolve.alias,
          '@walletconnect/ethereum-provider': walletConnectPath,
        };
      }
      
      // Handle Node.js built-in modules that shouldn't be bundled for browser
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
      
      // Handle optional peer dependencies for wagmi connectors
      // These are dynamically imported and may not be installed
      const optionalDeps = [
        '@base-org/account',
        '@coinbase/wallet-sdk',
        '@gemini-wallet/core',
        '@metamask/sdk',
        '@safe-global/safe-apps-sdk',
        '@safe-global/safe-apps-provider',
      ];
      
      optionalDeps.forEach((dep) => {
        config.resolve.alias = {
          ...config.resolve.alias,
          [dep]: false,
        };
      });
    }
    return config;
  },
};

module.exports = nextConfig;

