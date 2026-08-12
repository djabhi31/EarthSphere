import type { Metadata } from 'next';
import APODPageClient from './APODPageClient';

export const metadata: Metadata = {
  title: 'Astronomy Picture of the Day | EarthSphere',
  description: 'Explore the cosmos with NASA\'s Astronomy Picture of the Day.',
};

export default function APODPage() {
  return <APODPageClient />;
}
