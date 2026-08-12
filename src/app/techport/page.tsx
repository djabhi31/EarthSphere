import { Metadata } from 'next';
import TechportPageClient from './TechportPageClient';

export const metadata: Metadata = {
  title: 'Technology Portfolio | EarthSphere',
  description: 'Explore NASA\'s Technology Portfolio (Techport) of active projects.',
};

export default function TechportPage() {
  return <TechportPageClient />;
}
