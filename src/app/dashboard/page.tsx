import { Metadata } from 'next';
import DashboardPageClient from './DashboardPageClient';

export const metadata: Metadata = {
  title: 'Mission Control Dashboard | EarthSphere',
  description: 'Unified NASA Mission Control combining data from multiple APIs.',
};

export default function DashboardPage() {
  return <DashboardPageClient />;
}
