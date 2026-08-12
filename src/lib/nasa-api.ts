// =============================================================================
// EarthSphere — NASA API Client
// Unified client for all NASA Open APIs with type safety and error handling
// =============================================================================

import type {
  APODResponse,
  APODParams,
  NeoFeedResponse,
  NearEarthObject,
  DONKISolarFlare,
  DONKICME,
  DONKIGeomagneticStorm,
  DONKINotification,
  DONKIEventType,
  EPICImage,
  EPICImageType,
  MarsRoverPhoto,
  MarsPhotosResponse,
  MarsLatestPhotosResponse,
  MarsManifestResponse,
  MarsPhotosParams,
  MarsRoverName,
  EarthAssetsResponse,
  NASAMediaSearchResponse,
  NASAMediaSearchParams,
  FireballResponse,
  FireballParams,
  TLESearchResponse,
  TLESatellite,
  TechportProjectListResponse,
  TechportProjectDetailResponse,
  TechportParams,
  Exoplanet,
} from './types/nasa';

// -----------------------------------------------------------------------------
// Configuration
// -----------------------------------------------------------------------------

const NASA_API_KEY = process.env.NEXT_PUBLIC_NASA_API_KEY || 'DEMO_KEY';
const NASA_BASE = 'https://api.nasa.gov';
const REQUEST_TIMEOUT = 20_000;

// -----------------------------------------------------------------------------
// Internal Helpers
// -----------------------------------------------------------------------------

async function nasaFetch<T>(url: string, options?: { timeout?: number }): Promise<T> {
  const controller = new AbortController();
  const timeoutMs = options?.timeout ?? REQUEST_TIMEOUT;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(
        `NASA API error ${response.status}: ${response.statusText} — ${errorText}`
      );
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error(`NASA API request timed out after ${timeoutMs}ms: ${url}`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

function withKey(url: string): string {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}api_key=${NASA_API_KEY}`;
}

function buildParams(params: Record<string, string | number | boolean | undefined | null>): string {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value));
    }
  }
  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}

// =============================================================================
// APOD — Astronomy Picture of the Day
// =============================================================================

export async function fetchAPOD(params?: APODParams): Promise<APODResponse | APODResponse[]> {
  const queryParams = buildParams({
    date: params?.date,
    start_date: params?.start_date,
    end_date: params?.end_date,
    count: params?.count,
    thumbs: params?.thumbs,
  });
  return nasaFetch<APODResponse | APODResponse[]>(
    withKey(`${NASA_BASE}/planetary/apod${queryParams}`)
  );
}

// =============================================================================
// Asteroids — NeoWs
// =============================================================================

export async function fetchNeoFeed(startDate: string, endDate: string): Promise<NeoFeedResponse> {
  return nasaFetch<NeoFeedResponse>(
    withKey(`${NASA_BASE}/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}`)
  );
}

export async function fetchNeoById(asteroidId: string): Promise<NearEarthObject> {
  return nasaFetch<NearEarthObject>(
    withKey(`${NASA_BASE}/neo/rest/v1/neo/${asteroidId}`)
  );
}

export async function fetchNeoBrowse(page = 0, size = 20): Promise<{ near_earth_objects: NearEarthObject[]; page: { total_elements: number } }> {
  return nasaFetch(
    withKey(`${NASA_BASE}/neo/rest/v1/neo/browse?page=${page}&size=${size}`)
  );
}

// =============================================================================
// DONKI — Space Weather
// =============================================================================

export async function fetchDONKISolarFlares(startDate?: string, endDate?: string): Promise<DONKISolarFlare[]> {
  const params = buildParams({ startDate, endDate });
  return nasaFetch<DONKISolarFlare[]>(withKey(`${NASA_BASE}/DONKI/FLR${params}`));
}

export async function fetchDONKICME(startDate?: string, endDate?: string): Promise<DONKICME[]> {
  const params = buildParams({ startDate, endDate });
  return nasaFetch<DONKICME[]>(withKey(`${NASA_BASE}/DONKI/CME${params}`));
}

export async function fetchDONKIGST(startDate?: string, endDate?: string): Promise<DONKIGeomagneticStorm[]> {
  const params = buildParams({ startDate, endDate });
  return nasaFetch<DONKIGeomagneticStorm[]>(withKey(`${NASA_BASE}/DONKI/GST${params}`));
}

export async function fetchDONKINotifications(startDate?: string, endDate?: string, type?: string): Promise<DONKINotification[]> {
  const params = buildParams({ startDate, endDate, type });
  return nasaFetch<DONKINotification[]>(withKey(`${NASA_BASE}/DONKI/notifications${params}`));
}

export async function fetchDONKI(eventType: DONKIEventType, startDate?: string, endDate?: string): Promise<unknown[]> {
  const params = buildParams({ startDate, endDate });
  return nasaFetch<unknown[]>(withKey(`${NASA_BASE}/DONKI/${eventType}${params}`));
}

// =============================================================================
// EPIC — Earth Polychromatic Imaging Camera
// =============================================================================

export async function fetchEPIC(type: EPICImageType = 'natural'): Promise<EPICImage[]> {
  return nasaFetch<EPICImage[]>(withKey(`${NASA_BASE}/EPIC/api/${type}`));
}

export async function fetchEPICByDate(type: EPICImageType, date: string): Promise<EPICImage[]> {
  return nasaFetch<EPICImage[]>(withKey(`${NASA_BASE}/EPIC/api/${type}/date/${date}`));
}

export async function fetchEPICDates(type: EPICImageType = 'natural'): Promise<{ date: string }[]> {
  return nasaFetch<{ date: string }[]>(withKey(`${NASA_BASE}/EPIC/api/${type}/all`));
}

export function getEPICImageUrl(type: EPICImageType, date: string, imageName: string): string {
  const [year, month, day] = date.split('-');
  return `https://epic.gsfc.nasa.gov/archive/${type}/${year}/${month}/${day}/png/${imageName}.png`;
}

// =============================================================================
// Mars Rover Photos
// =============================================================================

export async function fetchMarsPhotos(
  rover: MarsRoverName,
  params?: MarsPhotosParams
): Promise<MarsPhotosResponse> {
  const queryParams = buildParams({
    sol: params?.sol,
    earth_date: params?.earth_date,
    camera: params?.camera,
    page: params?.page,
  });
  return nasaFetch<MarsPhotosResponse>(
    withKey(`${NASA_BASE}/mars-photos/api/v1/rovers/${rover}/photos${queryParams}`)
  );
}

export async function fetchMarsLatestPhotos(rover: MarsRoverName): Promise<MarsLatestPhotosResponse> {
  return nasaFetch<MarsLatestPhotosResponse>(
    withKey(`${NASA_BASE}/mars-photos/api/v1/rovers/${rover}/latest_photos`)
  );
}

export async function fetchRoverManifest(rover: MarsRoverName): Promise<MarsManifestResponse> {
  return nasaFetch<MarsManifestResponse>(
    withKey(`${NASA_BASE}/mars-photos/api/v1/manifests/${rover}`)
  );
}

// =============================================================================
// Earth Imagery — Landsat
// =============================================================================

export async function fetchEarthImagery(lat: number, lon: number, date?: string, dim?: number): Promise<string> {
  const params = buildParams({ lat, lon, date, dim });
  return withKey(`${NASA_BASE}/planetary/earth/imagery${params}`);
}

export async function fetchEarthAssets(lat: number, lon: number, date?: string, dim?: number): Promise<EarthAssetsResponse> {
  const params = buildParams({ lat, lon, date, dim });
  return nasaFetch<EarthAssetsResponse>(
    withKey(`${NASA_BASE}/planetary/earth/assets${params}`)
  );
}

// =============================================================================
// NASA Image and Video Library
// =============================================================================

export async function searchNASAMedia(params?: NASAMediaSearchParams): Promise<NASAMediaSearchResponse> {
  const queryParams = buildParams({
    q: params?.q,
    media_type: params?.media_type,
    year_start: params?.year_start,
    year_end: params?.year_end,
    center: params?.center,
    keywords: params?.keywords,
    page: params?.page,
  });
  // Note: NASA Image Library does NOT need an API key
  return nasaFetch<NASAMediaSearchResponse>(
    `https://images-api.nasa.gov/search${queryParams}`
  );
}

// =============================================================================
// Fireballs — SSD/CNEOS
// =============================================================================

export async function fetchFireballs(params?: FireballParams): Promise<FireballResponse> {
  const queryParams = buildParams({
    'date-min': params?.['date-min'],
    'date-max': params?.['date-max'],
    'energy-min': params?.['energy-min'],
    'vel-min': params?.['vel-min'],
    limit: params?.limit,
    sort: params?.sort,
    'req-loc': 'true', // Always request location data
  });
  return nasaFetch<FireballResponse>(
    `https://ssd-api.jpl.nasa.gov/fireball.api${queryParams}`
  );
}

// =============================================================================
// TLE API — Satellite Tracking
// =============================================================================

export async function fetchTLESearch(search: string, page = 1, pageSize = 20): Promise<TLESearchResponse> {
  const params = buildParams({ search, page, page_size: pageSize });
  return nasaFetch<TLESearchResponse>(
    `https://tle.ivanstanojevic.me/api/tle${params}`
  );
}

export async function fetchTLEById(noradId: number): Promise<TLESatellite> {
  return nasaFetch<TLESatellite>(
    `https://tle.ivanstanojevic.me/api/tle/${noradId}`
  );
}

// =============================================================================
// Techport — NASA Technology Portfolio
// =============================================================================

export async function fetchTechportProjects(params?: TechportParams): Promise<TechportProjectListResponse> {
  const queryParams = buildParams({ updatedSince: params?.updatedSince });
  return nasaFetch<TechportProjectListResponse>(
    withKey(`${NASA_BASE}/techport/api/projects${queryParams}`)
  );
}

export async function fetchTechportProject(projectId: number): Promise<TechportProjectDetailResponse> {
  return nasaFetch<TechportProjectDetailResponse>(
    withKey(`${NASA_BASE}/techport/api/projects/${projectId}`)
  );
}

// =============================================================================
// Exoplanet Archive (TAP)
// =============================================================================

export async function queryExoplanets(
  adqlQuery?: string,
  format: 'json' | 'csv' = 'json'
): Promise<Exoplanet[]> {
  const defaultQuery = `SELECT pl_name,hostname,discoverymethod,disc_year,pl_orbper,pl_rade,pl_bmasse,pl_eqt,st_teff,st_rad,st_mass,sy_dist,disc_facility,pl_orbsmax,st_spectype,sy_snum,sy_pnum FROM ps WHERE default_flag=1 ORDER BY disc_year DESC`;
  const query = adqlQuery || defaultQuery;
  const params = buildParams({ query, format });
  return nasaFetch<Exoplanet[]>(
    `https://exoplanetarchive.ipac.caltech.edu/TAP/sync${params}`,
    { timeout: 30_000 }
  );
}
