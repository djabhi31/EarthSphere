import type { Metadata } from 'next';
import type { ReactNode } from 'react';
export const metadata: Metadata = { title: 'Earth Observatory Map', description: 'Follow NASA natural events on an interactive satellite map. Explore observation histories, archive playback, Earth’s daylight and tectonic plate boundaries.' };
export default function RouteLayout({ children }: { children: ReactNode }) { return children; }
