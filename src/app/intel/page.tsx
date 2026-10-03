import { Metadata } from 'next';
import IntelPageClient from './IntelPageClient';

export const metadata: Metadata = {
  title: 'World Monitor — Global Intelligence Dashboard',
  description: 'Real-time AI-powered global intelligence, geopolitical conflict tracking, subsea cables, and critical infrastructure monitoring.',
};

export default function IntelPage() {
  return <IntelPageClient />;
}
