/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV === 'development';

const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  // Removed Next built-in i18n (handled manually via dynamic [lang] segment + middleware)
  images: {
    // Keep remote patterns as-is, but disable Next's image optimizer caching during development
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
    // When developing on a machine with limited disk space, avoid writing optimized images to disk
    unoptimized: isDev,
  },
  reactStrictMode: true,
  // Use an in-memory webpack cache during development to avoid filesystem writes that can fail
  // with ENOSPC (no space left on device). This keeps dev fast while preventing disk exhaustion.
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = { type: 'memory' };
    }
    return config;
  },
};

export default nextConfig;
