import type { Metadata } from 'next';
import HomePageClient from './HomePageClient';

export const metadata: Metadata = {
  title: { absolute: 'EarthSphere — Your world. A new dimension.' },
  description: 'Scroll through a living 3D Earth, explore real NASA observations, travel through satellite orbits, and discover Mars. Your world, in a new dimension.',
  keywords: ['NASA', 'EONET', 'Earth', 'Events', 'Wildfires', 'Storms', 'Volcanoes', 'Live Tracking'],
  openGraph: {
    title: 'EarthSphere — Your world. A new dimension.',
    description: 'A scroll-driven expedition through Earth, satellite orbits, Mars, and planetary intelligence. Powered by NASA open data.',
    url: 'https://earthsphere.in',
    siteName: 'EarthSphere',
    images: [
      {
        url: '/og-image.jpg', // Placeholder for OG image
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function Page() {
  return <HomePageClient />;
}
