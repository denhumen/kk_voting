import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'rwlayzanlbexsfqtgfwn.supabase.co', // Your specific project ID
                port: '',
                pathname: '/storage/v1/object/public/**', // Allow access to public storage buckets
            },
        ],
    },
};

export default nextConfig;
