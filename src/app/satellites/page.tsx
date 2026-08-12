import { Metadata } from 'next';
import SatellitesPageClient from './SatellitesPageClient';

export const metadata: Metadata = {
  title: 'Satellite Tracker | EarthSphere',
  description: 'Search and track Earth-orbiting satellites with TLE data.',
};

export default function SatellitesPage() {
  return <SatellitesPageClient />;
}
