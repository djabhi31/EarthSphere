import type { Metadata } from 'next';
import type { ReactNode } from 'react';
export const metadata: Metadata = { title: 'Natural Events', description: 'Explore NASA EONET natural events by category, date, source, and location.' };
export default function RouteLayout({ children }: { children: ReactNode }) { return children; }
