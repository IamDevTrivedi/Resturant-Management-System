import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
    turbopack: {
        root: __dirname,
    },
};

export default nextConfig;
