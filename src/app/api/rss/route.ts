import { NextResponse } from 'next/server';
import { fetchEvents } from '@/lib/api';

export async function GET() {
  try {
    const data = await fetchEvents({ status: 'open', limit: 20 });
    const events = data?.events || [];

    const itemsXml = events
      .map((e) => {
        const latestGeo = e.geometry[e.geometry.length - 1];
        const coords = latestGeo?.coordinates as number[] | undefined;
        const geoPoint = coords && coords.length >= 2 ? `${coords[1]} ${coords[0]}` : '';

        return `
    <item>
      <title><![CDATA[${e.title}]]></title>
      <link>https://earthsphere.in/events/${e.id}</link>
      <guid>${e.id}</guid>
      <pubDate>${latestGeo ? new Date(latestGeo.date).toUTCString() : new Date().toUTCString()}</pubDate>
      <description><![CDATA[Category: ${e.categories[0]?.title || 'Natural Event'} | Status: Active]]></description>
      ${geoPoint ? `<georss:point>${geoPoint}</georss:point>` : ''}
    </item>`;
      })
      .join('');

    const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:georss="http://www.georss.org/georss">
  <channel>
    <title>EarthSphere Real-Time Disaster Feed</title>
    <link>https://earthsphere.in</link>
    <description>Live natural hazard alerts sourced from NASA EONET</description>
    ${itemsXml}
  </channel>
</rss>`;

    return new NextResponse(rssXml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 's-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate GeoRSS feed' }, { status: 500 });
  }
}
