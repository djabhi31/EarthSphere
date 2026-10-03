import { Metadata } from 'next';
import FireballsPageClient from './FireballsPageClient';

export const metadata: Metadata = {
  title: 'Fireball & Bolide Tracker',
  description: 'Explore NASA JPL fireball observations, reported radiant energy, altitude, and velocity.',
};

export default function FireballsPage() {
  return <FireballsPageClient />;
}
