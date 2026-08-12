import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // NASA APOD images
      { protocol: 'https', hostname: 'apod.nasa.gov' },
      // EPIC Earth images
      { protocol: 'https', hostname: 'epic.gsfc.nasa.gov' },
      // Mars Rover photos
      { protocol: 'http', hostname: 'mars.jpl.nasa.gov' },
      { protocol: 'https', hostname: 'mars.nasa.gov' },
      // NASA Image Library
      { protocol: 'https', hostname: 'images-assets.nasa.gov' },
      { protocol: 'https', hostname: 'images-api.nasa.gov' },
      // General NASA domains
      { protocol: 'https', hostname: '*.nasa.gov' },
      // YouTube thumbnails (for video APODs)
      { protocol: 'https', hostname: 'img.youtube.com' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
      // Vimeo thumbnails
      { protocol: 'https', hostname: 'i.vimeocdn.com' },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
