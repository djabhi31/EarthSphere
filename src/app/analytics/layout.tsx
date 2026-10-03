import type { Metadata } from 'next';
import type { ReactNode } from 'react';
export const metadata: Metadata = { title: 'Event Analytics', description: 'Discover patterns across a year of NASA EONET observations.' };
export default function RouteLayout({ children }: { children: ReactNode }) { return children; }
