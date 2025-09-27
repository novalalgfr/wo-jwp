import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	images: {
		domains: ['images.unsplash.com', 'localhost']
	},
	output: 'standalone'
};

export default nextConfig;
