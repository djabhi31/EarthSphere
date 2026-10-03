import type { Metadata } from 'next';
import EarthImageryPageClient from './EarthImageryPageClient';

export const metadata: Metadata = {
  title: 'Earth Imagery — NASA GIBS',
  description: 'Explore dated Terra and Aqua satellite composites with NASA GIBS. Search coordinates or discover remarkable places on Earth.',
  keywords: ['Landsat', 'satellite imagery', 'NASA', 'Earth observation', 'remote sensing'],
};

export default function EarthImageryPage() {
  return <EarthImageryPageClient />;
}
