import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'EarthSphere',
    short_name: 'EarthSphere',
    description: 'Real-time Earth Event Intelligence',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0e17',
    theme_color: '#00d4aa',
    icons: [{ src: '/favicon.ico', sizes: 'any', type: 'image/x-icon' }]
  };
}
