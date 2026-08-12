import type { Metadata } from 'next';
import EPICPageClient from './EPICPageClient';

export const metadata: Metadata = {
  title: 'EPIC — Earth from Deep Space | EarthSphere',
  description: 'View full-disc imagery of the Earth from NASA\'s EPIC camera on the DSCOVR satellite.',
};

export default function EPICPage() {
  return <EPICPageClient />;
}
