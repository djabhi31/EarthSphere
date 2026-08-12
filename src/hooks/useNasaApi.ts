// =============================================================================
// EarthSphere — NASA API React Query Hooks
// TanStack Query hooks for all NASA APIs with caching and type safety
// =============================================================================

'use client';

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import {
  fetchAPOD,
  fetchNeoFeed,
  fetchNeoById,
  fetchDONKISolarFlares,
  fetchDONKICME,
  fetchDONKIGST,
  fetchDONKINotifications,
  fetchEPIC,
  fetchEPICByDate,
  fetchEPICDates,
  fetchMarsPhotos,
  fetchMarsLatestPhotos,
  fetchRoverManifest,
  fetchEarthAssets,
  searchNASAMedia,
  fetchFireballs,
  fetchTLESearch,
  fetchTLEById,
  fetchTechportProjects,
  fetchTechportProject,
  queryExoplanets,
} from '@/lib/nasa-api';
import type {
  APODResponse,
  APODParams,
  NeoFeedResponse,
  NearEarthObject,
  DONKISolarFlare,
  DONKICME,
  DONKIGeomagneticStorm,
  DONKINotification,
  EPICImage,
  EPICImageType,
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
} from '@/lib/types/nasa';

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const STALE_5MIN = 5 * 60 * 1000;
const STALE_30MIN = 30 * 60 * 1000;
const STALE_1HR = 60 * 60 * 1000;

// -----------------------------------------------------------------------------
// Query Key Factories
// -----------------------------------------------------------------------------

export const nasaQueryKeys = {
  apod: {
    all: ['nasa', 'apod'] as const,
    single: (date?: string) => ['nasa', 'apod', 'single', date] as const,
    range: (start?: string, end?: string) => ['nasa', 'apod', 'range', start, end] as const,
    random: (count?: number) => ['nasa', 'apod', 'random', count] as const,
  },
  neo: {
    all: ['nasa', 'neo'] as const,
    feed: (start: string, end: string) => ['nasa', 'neo', 'feed', start, end] as const,
    detail: (id: string) => ['nasa', 'neo', 'detail', id] as const,
  },
  donki: {
    flares: (start?: string, end?: string) => ['nasa', 'donki', 'flares', start, end] as const,
    cme: (start?: string, end?: string) => ['nasa', 'donki', 'cme', start, end] as const,
    gst: (start?: string, end?: string) => ['nasa', 'donki', 'gst', start, end] as const,
    notifications: (start?: string, end?: string) => ['nasa', 'donki', 'notifications', start, end] as const,
  },
  epic: {
    latest: (type: EPICImageType) => ['nasa', 'epic', 'latest', type] as const,
    byDate: (type: EPICImageType, date: string) => ['nasa', 'epic', 'date', type, date] as const,
    dates: (type: EPICImageType) => ['nasa', 'epic', 'dates', type] as const,
  },
  mars: {
    photos: (rover: string, params?: MarsPhotosParams) => ['nasa', 'mars', 'photos', rover, params] as const,
    latest: (rover: string) => ['nasa', 'mars', 'latest', rover] as const,
    manifest: (rover: string) => ['nasa', 'mars', 'manifest', rover] as const,
  },
  earth: {
    assets: (lat: number, lon: number, date?: string) => ['nasa', 'earth', 'assets', lat, lon, date] as const,
  },
  media: {
    search: (params?: NASAMediaSearchParams) => ['nasa', 'media', 'search', params] as const,
  },
  fireballs: {
    list: (params?: FireballParams) => ['nasa', 'fireballs', 'list', params] as const,
  },
  tle: {
    search: (query: string) => ['nasa', 'tle', 'search', query] as const,
    detail: (id: number) => ['nasa', 'tle', 'detail', id] as const,
  },
  techport: {
    list: (params?: TechportParams) => ['nasa', 'techport', 'list', params] as const,
    detail: (id: number) => ['nasa', 'techport', 'detail', id] as const,
  },
  exoplanets: {
    list: (query?: string) => ['nasa', 'exoplanets', 'list', query] as const,
  },
} as const;

// =============================================================================
// APOD Hooks
// =============================================================================

export function useAPOD(params?: APODParams): UseQueryResult<APODResponse | APODResponse[]> {
  return useQuery({
    queryKey: params?.count
      ? nasaQueryKeys.apod.random(params.count)
      : params?.start_date
      ? nasaQueryKeys.apod.range(params.start_date, params.end_date)
      : nasaQueryKeys.apod.single(params?.date),
    queryFn: () => fetchAPOD(params),
    staleTime: STALE_1HR,
    placeholderData: keepPreviousData,
    retry: 2,
  });
}

export function useAPODSingle(date?: string): UseQueryResult<APODResponse> {
  return useQuery({
    queryKey: nasaQueryKeys.apod.single(date),
    queryFn: async () => {
      const result = await fetchAPOD(date ? { date } : undefined);
      return (Array.isArray(result) ? result[0] : result) as APODResponse;
    },
    staleTime: STALE_1HR,
    retry: 2,
  });
}

// =============================================================================
// Asteroid / NEO Hooks
// =============================================================================

export function useNeoFeed(startDate: string, endDate: string): UseQueryResult<NeoFeedResponse> {
  return useQuery({
    queryKey: nasaQueryKeys.neo.feed(startDate, endDate),
    queryFn: () => fetchNeoFeed(startDate, endDate),
    staleTime: STALE_30MIN,
    placeholderData: keepPreviousData,
    enabled: !!startDate && !!endDate,
    retry: 2,
  });
}

export function useNeoLookup(asteroidId: string): UseQueryResult<NearEarthObject> {
  return useQuery({
    queryKey: nasaQueryKeys.neo.detail(asteroidId),
    queryFn: () => fetchNeoById(asteroidId),
    staleTime: STALE_1HR,
    enabled: !!asteroidId,
    retry: 2,
  });
}

// =============================================================================
// DONKI Hooks
// =============================================================================

export function useDONKISolarFlares(startDate?: string, endDate?: string): UseQueryResult<DONKISolarFlare[]> {
  return useQuery({
    queryKey: nasaQueryKeys.donki.flares(startDate, endDate),
    queryFn: () => fetchDONKISolarFlares(startDate, endDate),
    staleTime: STALE_30MIN,
    placeholderData: keepPreviousData,
    retry: 2,
  });
}

export function useDONKICME(startDate?: string, endDate?: string): UseQueryResult<DONKICME[]> {
  return useQuery({
    queryKey: nasaQueryKeys.donki.cme(startDate, endDate),
    queryFn: () => fetchDONKICME(startDate, endDate),
    staleTime: STALE_30MIN,
    placeholderData: keepPreviousData,
    retry: 2,
  });
}

export function useDONKIGST(startDate?: string, endDate?: string): UseQueryResult<DONKIGeomagneticStorm[]> {
  return useQuery({
    queryKey: nasaQueryKeys.donki.gst(startDate, endDate),
    queryFn: () => fetchDONKIGST(startDate, endDate),
    staleTime: STALE_30MIN,
    placeholderData: keepPreviousData,
    retry: 2,
  });
}

export function useDONKINotifications(startDate?: string, endDate?: string): UseQueryResult<DONKINotification[]> {
  return useQuery({
    queryKey: nasaQueryKeys.donki.notifications(startDate, endDate),
    queryFn: () => fetchDONKINotifications(startDate, endDate),
    staleTime: STALE_5MIN,
    retry: 2,
  });
}

// =============================================================================
// EPIC Hooks
// =============================================================================

export function useEPIC(type: EPICImageType = 'natural'): UseQueryResult<EPICImage[]> {
  return useQuery({
    queryKey: nasaQueryKeys.epic.latest(type),
    queryFn: () => fetchEPIC(type),
    staleTime: STALE_1HR,
    retry: 2,
  });
}

export function useEPICByDate(type: EPICImageType, date: string): UseQueryResult<EPICImage[]> {
  return useQuery({
    queryKey: nasaQueryKeys.epic.byDate(type, date),
    queryFn: () => fetchEPICByDate(type, date),
    staleTime: STALE_1HR,
    enabled: !!date,
    retry: 2,
  });
}

export function useEPICDates(type: EPICImageType = 'natural'): UseQueryResult<{ date: string }[]> {
  return useQuery({
    queryKey: nasaQueryKeys.epic.dates(type),
    queryFn: () => fetchEPICDates(type),
    staleTime: STALE_1HR,
    retry: 2,
  });
}

// =============================================================================
// Mars Rover Hooks
// =============================================================================

export function useMarsPhotos(rover: MarsRoverName, params?: MarsPhotosParams): UseQueryResult<MarsPhotosResponse> {
  return useQuery({
    queryKey: nasaQueryKeys.mars.photos(rover, params),
    queryFn: () => fetchMarsPhotos(rover, params),
    staleTime: STALE_30MIN,
    placeholderData: keepPreviousData,
    enabled: !!(params?.sol !== undefined || params?.earth_date),
    retry: 2,
  });
}

export function useMarsLatestPhotos(rover: MarsRoverName): UseQueryResult<MarsLatestPhotosResponse> {
  return useQuery({
    queryKey: nasaQueryKeys.mars.latest(rover),
    queryFn: () => fetchMarsLatestPhotos(rover),
    staleTime: STALE_30MIN,
    retry: 2,
  });
}

export function useRoverManifest(rover: MarsRoverName): UseQueryResult<MarsManifestResponse> {
  return useQuery({
    queryKey: nasaQueryKeys.mars.manifest(rover),
    queryFn: () => fetchRoverManifest(rover),
    staleTime: STALE_1HR,
    retry: 2,
  });
}

// =============================================================================
// Earth Imagery Hooks
// =============================================================================

export function useEarthAssets(lat: number, lon: number, date?: string): UseQueryResult<EarthAssetsResponse> {
  return useQuery({
    queryKey: nasaQueryKeys.earth.assets(lat, lon, date),
    queryFn: () => fetchEarthAssets(lat, lon, date),
    staleTime: STALE_1HR,
    enabled: !!(lat && lon),
    retry: 2,
  });
}

// =============================================================================
// NASA Media Library Hooks
// =============================================================================

export function useNASAMedia(params?: NASAMediaSearchParams): UseQueryResult<NASAMediaSearchResponse> {
  return useQuery({
    queryKey: nasaQueryKeys.media.search(params),
    queryFn: () => searchNASAMedia(params),
    staleTime: STALE_30MIN,
    placeholderData: keepPreviousData,
    enabled: !!params?.q,
    retry: 2,
  });
}

// =============================================================================
// Fireball Hooks
// =============================================================================

export function useFireballs(params?: FireballParams): UseQueryResult<FireballResponse> {
  return useQuery({
    queryKey: nasaQueryKeys.fireballs.list(params),
    queryFn: () => fetchFireballs(params),
    staleTime: STALE_1HR,
    placeholderData: keepPreviousData,
    retry: 2,
  });
}

// =============================================================================
// TLE / Satellite Hooks
// =============================================================================

export function useTLESearch(search: string): UseQueryResult<TLESearchResponse> {
  return useQuery({
    queryKey: nasaQueryKeys.tle.search(search),
    queryFn: () => fetchTLESearch(search),
    staleTime: STALE_30MIN,
    enabled: search.length >= 2,
    placeholderData: keepPreviousData,
    retry: 2,
  });
}

export function useTLEDetail(noradId: number): UseQueryResult<TLESatellite> {
  return useQuery({
    queryKey: nasaQueryKeys.tle.detail(noradId),
    queryFn: () => fetchTLEById(noradId),
    staleTime: STALE_30MIN,
    enabled: noradId > 0,
    retry: 2,
  });
}

// =============================================================================
// Techport Hooks
// =============================================================================

export function useTechportProjects(params?: TechportParams): UseQueryResult<TechportProjectListResponse> {
  return useQuery({
    queryKey: nasaQueryKeys.techport.list(params),
    queryFn: () => fetchTechportProjects(params),
    staleTime: STALE_1HR,
    retry: 2,
  });
}

export function useTechportProject(projectId: number): UseQueryResult<TechportProjectDetailResponse> {
  return useQuery({
    queryKey: nasaQueryKeys.techport.detail(projectId),
    queryFn: () => fetchTechportProject(projectId),
    staleTime: STALE_1HR,
    enabled: projectId > 0,
    retry: 2,
  });
}

// =============================================================================
// Exoplanet Archive Hooks
// =============================================================================

export function useExoplanets(query?: string): UseQueryResult<Exoplanet[]> {
  return useQuery({
    queryKey: nasaQueryKeys.exoplanets.list(query),
    queryFn: () => queryExoplanets(query),
    staleTime: STALE_1HR,
    placeholderData: keepPreviousData,
    retry: 2,
  });
}
