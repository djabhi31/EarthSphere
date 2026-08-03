import { NextResponse } from 'next/server';

export const runtime = 'edge';

const EONET_API_BASE = 'https://eonet.gsfc.nasa.gov/api/v3';

/**
 * Proxy route for NASA EONET v3 API
 * Handles CORS and adds caching for all EONET endpoints
 */
export async function GET(request: Request, { params }: { params: Promise<{ path: string[] }> | { path: string[] } }) {
  try {
    const { searchParams } = new URL(request.url);
    const apiParams = new URLSearchParams();

    // Forward allowed query parameters
    const allowedParams = ['status', 'limit', 'days', 'source', 'start', 'end', 'category', 'magID', 'magMin', 'magMax', 'bbox'];
    allowedParams.forEach((param) => {
      const value = searchParams.get(param);
      if (value) {
        apiParams.append(param, value);
      }
    });

    const resolvedParams = await params;
    const endpointPath = resolvedParams.path.join('/');
    const queryString = apiParams.toString();
    const apiUrl = `${EONET_API_BASE}/${endpointPath}${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
      },
      // Ensure Next.js doesn't cache fetch too aggressively if we want custom control,
      // but we will add standard Cache-Control headers to the response.
      next: { revalidate: 300 } 
    });

    if (!response.ok) {
      throw new Error(`EONET API responded with status: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Error proxying EONET API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from NASA EONET' },
      { status: 500 }
    );
  }
}
