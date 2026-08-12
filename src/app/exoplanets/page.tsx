import type { Metadata } from 'next';
import ExoplanetsPageClient from './ExoplanetsPageClient';

export const metadata: Metadata = {
  title: 'Exoplanet Explorer | EarthSphere',
  description: 'Explore the vast database of confirmed exoplanets discovered by NASA missions.',
};

export default function ExoplanetsPage() {
  return <ExoplanetsPageClient />;
}
