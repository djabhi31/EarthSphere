import type { Metadata } from 'next';
import HomePageClient from './HomePageClient';

export const metadata: Metadata = {
  title: 'EarthSphere | Live NASA EONET Data',
  description: 'Watch Earth Breathe in Real Time. Live monitoring of natural events including wildfires, severe storms, and volcanoes using NASA EONET data.',
  keywords: ['NASA', 'EONET', 'Earth', 'Events', 'Wildfires', 'Storms', 'Volcanoes', 'Live Tracking'],
  openGraph: {
    title: 'EarthSphere | Live NASA EONET Data',
    description: 'Watch Earth Breathe in Real Time. Live monitoring of natural events including wildfires, severe storms, and volcanoes using NASA EONET data.',
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
  return (
    <>
      <h1 className="sr-only">Watch Earth Breathe in Real Time</h1>
      <p className="sr-only">
        EarthSphere brings NASA's Earth Observatory Natural Event Tracker (EONET) 
        to life. Monitor wildfires, severe storms, volcanoes, and other natural 
        phenomena across the globe as they happen.
      </p>
      <HomePageClient />
    </>
  );
}
