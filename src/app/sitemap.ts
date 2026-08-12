import { MetadataRoute } from 'next';

export const revalidate = 3600; // Revalidate sitemap every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://earthsphere.in';
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/map`,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/analytics`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/space-weather`,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/apod`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/asteroids`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/epic`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/mars`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/exoplanets`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/earth-imagery`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/media`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/fireballs`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/satellites`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/techport`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];

  // Dynamically fetch open NASA EONET events for deep search indexing
  try {
    const res = await fetch(
      'https://eonet.gsfc.nasa.gov/api/v3/events?limit=50&status=open',
      { next: { revalidate: 3600 } }
    );
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.events)) {
        const eventRoutes: MetadataRoute.Sitemap = data.events.map(
          (event: { id: string; geometry?: Array<{ date?: string }> }) => ({
            url: `${baseUrl}/events/${event.id}`,
            lastModified: event.geometry?.[0]?.date
              ? new Date(event.geometry[0].date)
              : now,
            changeFrequency: 'daily' as const,
            priority: 0.7,
          })
        );
        return [...staticRoutes, ...eventRoutes];
      }
    }
  } catch (error) {
    console.error('Failed to fetch EONET events for sitemap:', error);
  }

  return staticRoutes;
}
