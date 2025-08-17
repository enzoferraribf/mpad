/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
        // Ensure Y.js is treated as a single module to prevent duplication issues
        config.resolve.alias = {
            ...config.resolve.alias,
            yjs: require.resolve('yjs'),
        };

        // Add Y.js to externals for server-side to prevent duplication
        if (isServer) {
            config.externals = config.externals || [];
            config.externals.push({
                yjs: 'commonjs yjs'
            });
        }

        // Optimize Y.js for proper singleton behavior
        config.optimization = {
            ...config.optimization,
            splitChunks: {
                ...config.optimization.splitChunks,
                cacheGroups: {
                    ...config.optimization.splitChunks?.cacheGroups,
                    yjs: {
                        test: /[\\/]node_modules[\\/](yjs|y-monaco|y-webrtc)[\\/]/,
                        name: 'yjs-bundle',
                        chunks: 'all',
                        enforce: true,
                        priority: 10,
                    },
                },
            },
        };

        // Ensure consistent module resolution
        config.resolve.symlinks = false;

        return config;
    },
    
    // Disable webpack cache to ensure clean builds
    experimental: {
        webpackBuildWorker: false,
    },
};

module.exports = nextConfig;
