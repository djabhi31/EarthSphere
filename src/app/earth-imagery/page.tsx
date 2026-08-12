import type { Metadata } from 'next';
import EarthImageryPageClient from './EarthImageryPageClient';

export const metadata: Metadata = {
  title: 'Earth Imagery — Landsat Satellite',
  description: 'Explore Landsat satellite imagery of any location on Earth. View historical satellite photos and compare changes over time.',
  keywords: ['Landsat', 'satellite imagery', 'NASA', 'Earth observation', 'remote sensing'],
};

export default function EarthImageryPage() {
  return <EarthImageryPageClient />;
}
