// =============================================================================
// EarthSphere — Root Layout
// Next.js 15 App Router root layout with fonts, providers, and dark theme
// =============================================================================

import type { Metadata, Viewport } from 'next';
import { Inter, IBM_Plex_Sans, JetBrains_Mono } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

// -----------------------------------------------------------------------------
// Font Configuration
// -----------------------------------------------------------------------------

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-ibm-plex-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
});

// -----------------------------------------------------------------------------
// Metadata & Viewport
// -----------------------------------------------------------------------------

export const metadata: Metadata = {
  metadataBase: new URL('https://earthsphere.in'),
  title: {
    default: 'EarthSphere — Real-time Earth Event Intelligence',
    template: '%s | EarthSphere',
  },
  applicationName: 'EarthSphere',
  description:
    'Track wildfires, storms, volcanoes, earthquakes, and other natural events worldwide in real time with EarthSphere. Powered by NASA EONET data with AI-driven insights. Visit earthsphere.in for more.',
  keywords: [
    'NASA',
    'EONET',
    'natural events',
    'wildfires',
    'earthquakes',
    'volcanoes',
    'severe storms',
    'earth observation',
    'satellite data',
    'real-time tracker',
  ],
  authors: [{ name: 'EarthSphere' }],
  creator: 'EarthSphere',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'EarthSphere — Real-time Earth Event Intelligence',
    description:
      'Track natural events worldwide in real time with NASA EONET data, AI insights, and cinematic visualizations.',
    siteName: 'EarthSphere',
    url: 'https://earthsphere.in',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EarthSphere — Real-time Earth Event Intelligence',
    description:
      'Track natural events worldwide in real time with NASA EONET data.',
    site: '@earthsphere',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#0a0e17',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

// -----------------------------------------------------------------------------
// Root Layout
// -----------------------------------------------------------------------------

import { CustomCursor } from '@/components/ui/CustomCursor';
import { ScrollProgress } from '@/components/ui/ScrollProgress';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${ibmPlexSans.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const storedTheme = localStorage.getItem('earthsphere-theme');
                if (storedTheme === 'dark' || (storedTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches) || !storedTheme) {
                  document.documentElement.classList.add('dark');
                } else if (storedTheme === 'light' || (storedTheme === 'system' && !window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('light');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="relative flex min-h-dvh flex-col overflow-x-hidden bg-canvas text-[var(--text-primary)] antialiased noise-bg">
        <ScrollProgress />
        <Providers>
          <CustomCursor />
          {children}
        </Providers>
      </body>
    </html>
  );
}
