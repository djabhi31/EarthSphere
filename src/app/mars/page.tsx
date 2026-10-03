import type { Metadata } from 'next';
import MarsPageClient from './MarsPageClient';

export const metadata: Metadata = {
  title: 'Mars Image Archive',
  description: 'Explore Mars through the NASA Image and Video Library: rover photographs, landscapes, and mission stories.',
};

export default function MarsPage() {
  return <MarsPageClient />;
}
