import { Metadata } from 'next';
import MediaPageClient from './MediaPageClient';

export const metadata: Metadata = {
  title: 'NASA Media Library | EarthSphere',
  description: 'Search and explore the vast NASA Image and Video Library.',
};

export default function MediaPage() {
  return <MediaPageClient />;
}
