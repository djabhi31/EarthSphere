import type { Metadata } from 'next';
import { ExploreClient } from '@/components/explore/ExploreClient';

export const metadata: Metadata = {
  title: 'Earth Explorer',
  description: 'An original 3D Earth explorer. Follow spacecraft, explore NASA Earth science observations, travel through the archive, and discover our changing planet.',
};

export default function ExplorePage() {
  return <main className="h-dvh overflow-hidden bg-black"><ExploreClient /></main>;
}
