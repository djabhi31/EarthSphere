import { ExploreClient } from '@/components/explore/ExploreClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Eyes on the Earth Explorer',
  description: 'Interactive 3D visualization of Earth, Vital Signs, and Satellite Orbits',
};

export default function ExplorePage() {
  return (
    <main className="fixed inset-0 z-50 bg-black overflow-hidden">
      <ExploreClient />
    </main>
  );
}
