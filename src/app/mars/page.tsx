import type { Metadata } from 'next';
import MarsPageClient from './MarsPageClient';

export const metadata: Metadata = {
  title: 'Mars Rover Explorer | EarthSphere',
  description: 'Explore the latest photos from NASA Mars Rovers (Curiosity, Perseverance, Opportunity, Spirit).',
};

export default function MarsPage() {
  return <MarsPageClient />;
}
