import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
            {
                protocol: 'http',
                hostname: '**',
            },
        ],
        unoptimized: false,
    },
    turbopack: {
        root: __dirname,
    },
};

export default nextConfig;
