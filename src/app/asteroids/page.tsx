import { Metadata } from 'next';
import AsteroidsPageClient from './AsteroidsPageClient';

export const metadata: Metadata = {
  title: 'Near-Earth Object Tracker',
  description: 'Track and visualize near-Earth asteroids using dated NASA NeoWs close-approach records.',
};

export default function AsteroidsPage() {
  return <AsteroidsPageClient />;
}
