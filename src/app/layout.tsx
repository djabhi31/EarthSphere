// =============================================================================
// EarthSphere — Root Layout
// Next.js 15 App Router root layout with fonts, providers, and dark theme
// =============================================================================

import type { Metadata, Viewport } from 'next';
import { Inter, IBM_Plex_Sans, JetBrains_Mono } from 'next/font/google';
import Script from 'next/script';
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
    default: 'EarthSphere — NASA Data Explorer & Earth Intelligence',
    template: '%s | EarthSphere',
  },
  applicationName: 'EarthSphere',
  description:
    'Explore NASA\'s universe of data — track natural events, browse Mars rover photos, discover exoplanets, monitor space weather, and more. Powered by 13+ NASA APIs.',
  keywords: [
    'NASA',
    'EONET',
    'APOD',
    'Mars Rover',
    'exoplanets',
    'space weather',
    'asteroids',
    'EPIC',
    'natural events',
    'satellite tracker',
    'earth observation',
    'NASA API',
    'space exploration',
    'astronomy',
  ],
  authors: [{ name: 'EarthSphere' }],
  creator: 'EarthSphere',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'EarthSphere — Real-time Earth Event Intelligence',
    description:
      'Track wildfires, storms, earthquakes, and natural events worldwide in real time with NASA EONET data.',
    siteName: 'EarthSphere',
    url: 'https://earthsphere.in',
    images: [
      {
        url: 'https://earthsphere.in/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'EarthSphere — Real-time Earth Event Intelligence',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EarthSphere — Real-time Earth Event Intelligence',
    description:
      'Track wildfires, storms, earthquakes, and natural events worldwide in real time with NASA EONET data.',
    site: '@earthsphere',
    images: ['https://earthsphere.in/opengraph-image'],
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
                if (storedTheme === 'light') {
                  document.documentElement.classList.add('light');
                } else {
                  document.documentElement.classList.add('dark');
                }

                const storedAccent = localStorage.getItem('earthsphere-accent-theme');
                if (storedAccent) {
                  document.documentElement.setAttribute('data-accent', storedAccent);
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="relative flex min-h-dvh flex-col overflow-x-hidden bg-canvas text-[var(--text-primary)] antialiased noise-bg">
        {/* Google Tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-JDE5MJ43HB"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-JDE5MJ43HB');
          `}
        </Script>
        <ScrollProgress />
        <Providers>
          <CustomCursor />
          {children}
        </Providers>
      </body>
    </html>
  );
}
