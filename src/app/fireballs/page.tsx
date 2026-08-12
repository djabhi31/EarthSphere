import { Metadata } from 'next';
import FireballsPageClient from './FireballsPageClient';

export const metadata: Metadata = {
  title: 'Fireball & Bolide Tracker | EarthSphere',
  description: 'Track near-Earth objects and fireballs reporting their kinetic energy and atmospheric entry.',
};

export default function FireballsPage() {
  return <FireballsPageClient />;
}
