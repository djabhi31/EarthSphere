import { NextResponse } from "next/server";
import { nasaUpstream } from "@/lib/nasa-upstream";

export async function GET(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const key = process.env.NASA_API_KEY || process.env.NEXT_PUBLIC_NASA_API_KEY || "DEMO_KEY";
  const url = nasaUpstream(path, new URL(request.url).searchParams, key);
  if (!url) return NextResponse.json({ error: "This data request is not supported." }, { status: 400 });
  try {
    const response = await fetch(url, { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(25000), redirect: "error", next: { revalidate: 300 } });
    if (!response.ok) {
      const status = response.status === 429 ? 429 : response.status === 404 ? 404 : 502;
      return NextResponse.json({ error: status === 429 ? "The source has reached its request limit. Please try again later." : status === 404 ? "The requested record is unavailable at this source." : "The data provider is temporarily unavailable." }, { status });
    }
    const data: unknown = await response.json();
    return NextResponse.json(data, { headers: { "Cache-Control": "public, max-age=300, s-maxage=300, stale-while-revalidate=600" } });
  } catch {
    return NextResponse.json({ error: "The source did not respond. Please try again shortly." }, { status: 503 });
  }
}
