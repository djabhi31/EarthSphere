import { Metadata } from 'next';
import SpaceWeatherPageClient from './SpaceWeatherPageClient';

export const metadata: Metadata = {
  title: 'Space Weather Dashboard | EarthSphere',
  description: 'Monitor solar flares, coronal mass ejections, and geomagnetic storms with NASA DONKI data.',
};

export default function SpaceWeatherPage() {
  return <SpaceWeatherPageClient />;
}
