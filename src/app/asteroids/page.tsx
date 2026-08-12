import { Metadata } from 'next';
import AsteroidsPageClient from './AsteroidsPageClient';

export const metadata: Metadata = {
  title: 'Near-Earth Object Tracker | EarthSphere',
  description: 'Track and visualize near-Earth asteroids using real-time NASA NeoWs data.',
};

export default function AsteroidsPage() {
  return <AsteroidsPageClient />;
}
