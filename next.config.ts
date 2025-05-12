
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true, // Keep existing setting, but be aware of implications
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true, // Keep existing setting
  },
  images: {
    // Configure allowed remote image domains
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**', // Allow any path on picsum.photos
      },
      // Add other domains if necessary
    ],
  },
   // No specific API configuration needed by default for App Router Route Handlers
   // Ensure environment variables like NEXT_PUBLIC_APP_URL, ADMIN_EMAIL, ADMIN_PASSWORD
   // are accessible (e.g., defined in .env.local)
};

export default nextConfig;
