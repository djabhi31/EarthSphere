// =============================================================================
// EarthSphere — Client Providers
// QueryClientProvider wrapper for Next.js App Router
// =============================================================================

'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { ThemeProvider } from '@/components/providers/ThemeProvider';

/**
 * Creates a QueryClient with sensible defaults for the app.
 * - Default stale time of 2 minutes prevents excessive refetches
 * - Retry with exponential backoff (3 attempts)
 * - GC time of 10 minutes keeps data in cache longer
 */
function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 2 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10_000),
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
      },
    },
  });
}

/**
 * Client-side providers wrapper.
 * Creates a stable QueryClient instance per component lifecycle to prevent
 * re-creating the client on every render (important for SSR/RSC).
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(makeQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="earthsphere-theme">
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
