// =============================================================================
// EarthSphere — NASA API Type Definitions
// Complete TypeScript interfaces for all NASA Open APIs
// =============================================================================

// -----------------------------------------------------------------------------
// APOD — Astronomy Picture of the Day
// -----------------------------------------------------------------------------

export interface APODResponse {
  readonly copyright?: string;
  readonly date: string;
  readonly explanation: string;
  readonly hdurl?: string;
  readonly media_type: 'image' | 'video';
  readonly service_version: string;
  readonly title: string;
  readonly url: string;
  readonly thumbnail_url?: string;
}

// -----------------------------------------------------------------------------
// Asteroids — NeoWs (Near Earth Object Web Service)
// -----------------------------------------------------------------------------

export interface NeoEstimatedDiameter {
  readonly estimated_diameter_min: number;
  readonly estimated_diameter_max: number;
}

export interface NeoCloseApproachData {
  readonly close_approach_date: string;
  readonly close_approach_date_full: string;
  readonly epoch_date_close_approach: number;
  readonly relative_velocity: {
    readonly kilometers_per_second: string;
    readonly kilometers_per_hour: string;
    readonly miles_per_hour: string;
  };
  readonly miss_distance: {
    readonly astronomical: string;
    readonly lunar: string;
    readonly kilometers: string;
    readonly miles: string;
  };
  readonly orbiting_body: string;
}

export interface NearEarthObject {
  readonly id: string;
  readonly neo_reference_id: string;
  readonly name: string;
  readonly nasa_jpl_url: string;
  readonly absolute_magnitude_h: number;
  readonly estimated_diameter: {
    readonly kilometers: NeoEstimatedDiameter;
    readonly meters: NeoEstimatedDiameter;
    readonly miles: NeoEstimatedDiameter;
    readonly feet: NeoEstimatedDiameter;
  };
  readonly is_potentially_hazardous_asteroid: boolean;
  readonly close_approach_data: readonly NeoCloseApproachData[];
  readonly is_sentry_object: boolean;
}

export interface NeoFeedResponse {
  readonly element_count: number;
  readonly near_earth_objects: Record<string, readonly NearEarthObject[]>;
}

// -----------------------------------------------------------------------------
// DONKI — Space Weather Database of Notifications
// -----------------------------------------------------------------------------

export interface DONKISolarFlare {
  readonly flrID: string;
  readonly instruments: readonly { readonly displayName: string }[];
  readonly beginTime: string;
  readonly peakTime: string;
  readonly endTime: string | null;
  readonly classType: string;
  readonly sourceLocation: string;
  readonly activeRegionNum: number | null;
  readonly linkedEvents: readonly { readonly activityID: string }[] | null;
  readonly link: string;
}

export interface DONKICME {
  readonly activityID: string;
  readonly catalog: string;
  readonly startTime: string;
  readonly sourceLocation: string;
  readonly activeRegionNum: number | null;
  readonly instruments: readonly { readonly displayName: string }[];
  readonly cmeAnalyses: readonly DONKICMEAnalysis[] | null;
  readonly linkedEvents: readonly { readonly activityID: string }[] | null;
  readonly link: string;
  readonly note: string;
}

export interface DONKICMEAnalysis {
  readonly isMostAccurate: boolean;
  readonly time21_5: string;
  readonly latitude: number;
  readonly longitude: number;
  readonly halfAngle: number;
  readonly speed: number;
  readonly type: string;
  readonly note: string;
  readonly link: string;
}

export interface DONKIGeomagneticStorm {
  readonly gstID: string;
  readonly startTime: string;
  readonly allKpIndex: readonly {
    readonly observedTime: string;
    readonly kpIndex: number;
    readonly source: string;
  }[];
  readonly linkedEvents: readonly { readonly activityID: string }[] | null;
  readonly link: string;
}

export interface DONKINotification {
  readonly messageType: string;
  readonly messageID: string;
  readonly messageURL: string;
  readonly messageIssueTime: string;
  readonly messageBody: string;
}

// -----------------------------------------------------------------------------
// EPIC — Earth Polychromatic Imaging Camera
// -----------------------------------------------------------------------------

export interface EPICImage {
  readonly identifier: string;
  readonly caption: string;
  readonly image: string;
  readonly version: string;
  readonly date: string;
  readonly centroid_coordinates: {
    readonly lat: number;
    readonly lon: number;
  };
  readonly dscovr_j2000_position: {
    readonly x: number;
    readonly y: number;
    readonly z: number;
  };
  readonly lunar_j2000_position: {
    readonly x: number;
    readonly y: number;
    readonly z: number;
  };
  readonly sun_j2000_position: {
    readonly x: number;
    readonly y: number;
    readonly z: number;
  };
  readonly attitude_quaternions: {
    readonly q0: number;
    readonly q1: number;
    readonly q2: number;
    readonly q3: number;
  };
}

// -----------------------------------------------------------------------------
// Mars Rover Photos
// -----------------------------------------------------------------------------

export interface MarsRoverCamera {
  readonly id: number;
  readonly name: string;
  readonly rover_id: number;
  readonly full_name: string;
}

export interface MarsRoverInfo {
  readonly id: number;
  readonly name: string;
  readonly landing_date: string;
  readonly launch_date: string;
  readonly status: 'active' | 'complete';
  readonly max_sol: number;
  readonly max_date: string;
  readonly total_photos: number;
  readonly cameras: readonly MarsRoverCamera[];
}

export interface MarsRoverPhoto {
  readonly id: number;
  readonly sol: number;
  readonly camera: MarsRoverCamera;
  readonly img_src: string;
  readonly earth_date: string;
  readonly rover: MarsRoverInfo;
}

export interface MarsPhotosResponse {
  readonly photos: readonly MarsRoverPhoto[];
}

export interface MarsLatestPhotosResponse {
  readonly latest_photos: readonly MarsRoverPhoto[];
}

export interface MarsManifestPhoto {
  readonly sol: number;
  readonly earth_date: string;
  readonly total_photos: number;
  readonly cameras: readonly string[];
}

export interface MarsManifestResponse {
  readonly photo_manifest: {
    readonly name: string;
    readonly landing_date: string;
    readonly launch_date: string;
    readonly status: string;
    readonly max_sol: number;
    readonly max_date: string;
    readonly total_photos: number;
    readonly photos: readonly MarsManifestPhoto[];
  };
}

// -----------------------------------------------------------------------------
// Earth Imagery — Landsat
// -----------------------------------------------------------------------------

export interface EarthAssetsResponse {
  readonly date: string;
  readonly id: string;
  readonly resource: {
    readonly dataset: string;
    readonly planet: string;
  };
  readonly service_version: string;
  readonly url: string;
}

// -----------------------------------------------------------------------------
// NASA Image and Video Library
// -----------------------------------------------------------------------------

export interface NASAMediaItem {
  readonly center: string;
  readonly title: string;
  readonly nasa_id: string;
  readonly date_created: string;
  readonly media_type: 'image' | 'video' | 'audio';
  readonly description?: string;
  readonly keywords?: readonly string[];
  readonly photographer?: string;
}

export interface NASAMediaLink {
  readonly href: string;
  readonly rel: string;
  readonly render?: string;
}

export interface NASAMediaCollectionItem {
  readonly href: string;
  readonly data: readonly NASAMediaItem[];
  readonly links?: readonly NASAMediaLink[];
}

export interface NASAMediaSearchResponse {
  readonly collection: {
    readonly version: string;
    readonly href: string;
    readonly items: readonly NASAMediaCollectionItem[];
    readonly metadata?: {
      readonly total_hits: number;
    };
    readonly links?: readonly {
      readonly rel: string;
      readonly prompt: string;
      readonly href: string;
    }[];
  };
}

// -----------------------------------------------------------------------------
// Fireballs — SSD/CNEOS
// -----------------------------------------------------------------------------

export interface FireballEvent {
  readonly date: string;
  readonly energy: string | null;
  readonly impact_e: string | null;
  readonly lat: string | null;
  readonly lat_dir: string | null;
  readonly lon: string | null;
  readonly lon_dir: string | null;
  readonly alt: string | null;
  readonly vel: string | null;
  readonly vx: string | null;
  readonly vy: string | null;
  readonly vz: string | null;
}

export interface FireballResponse {
  readonly signature: { readonly source: string; readonly version: string };
  readonly count: string;
  readonly fields: readonly string[];
  readonly data: readonly (readonly (string | null)[])[];
}

// -----------------------------------------------------------------------------
// TLE API — Two-Line Element Sets
// -----------------------------------------------------------------------------

export interface TLESatellite {
  readonly satelliteId: number;
  readonly name: string;
  readonly date: string;
  readonly line1: string;
  readonly line2: string;
}

export interface TLESearchResponse {
  readonly '@context': string;
  readonly '@id': string;
  readonly '@type': string;
  readonly totalItems: number;
  readonly member: readonly TLESatellite[];
}

// -----------------------------------------------------------------------------
// Techport — NASA Technology Portfolio
// -----------------------------------------------------------------------------

export interface TechportProject {
  readonly projectId: number;
  readonly lastUpdated: string;
  readonly title: string;
  readonly acronym?: string;
  readonly statusDescription: string;
  readonly description?: string;
  readonly benefits?: string;
  readonly startDateString?: string;
  readonly endDateString?: string;
  readonly startTrl?: number;
  readonly currentTrl?: number;
  readonly endTrl?: number;
  readonly responsibleProgram?: string;
  readonly responsibleMissionDirectorateOrOffice?: string;
  readonly leadOrganization?: { readonly name: string; readonly type: string };
  readonly supportingOrganizations?: readonly { readonly name: string; readonly type: string }[];
  readonly primaryTaxonomyNodes?: readonly { readonly taxonomyNodeId: number; readonly taxonomyRootId: number; readonly title: string }[];
  readonly website?: string;
}

export interface TechportProjectListResponse {
  readonly projects: readonly { readonly projectId: number; readonly lastUpdated: string }[];
  readonly totalCount: number;
}

export interface TechportProjectDetailResponse {
  readonly project: TechportProject;
}

// -----------------------------------------------------------------------------
// Exoplanet Archive
// -----------------------------------------------------------------------------

export interface Exoplanet {
  readonly pl_name: string;
  readonly hostname: string;
  readonly discoverymethod: string;
  readonly disc_year: number;
  readonly pl_orbper: number | null;
  readonly pl_rade: number | null;
  readonly pl_bmasse: number | null;
  readonly pl_eqt: number | null;
  readonly st_teff: number | null;
  readonly st_rad: number | null;
  readonly st_mass: number | null;
  readonly sy_dist: number | null;
  readonly disc_facility: string | null;
  readonly pl_orbsmax: number | null;
  readonly st_spectype: string | null;
  readonly sy_snum: number | null;
  readonly sy_pnum: number | null;
}

// -----------------------------------------------------------------------------
// API Query Parameter Types
// -----------------------------------------------------------------------------

export interface APODParams {
  readonly date?: string;
  readonly start_date?: string;
  readonly end_date?: string;
  readonly count?: number;
  readonly thumbs?: boolean;
}

export interface MarsPhotosParams {
  readonly sol?: number;
  readonly earth_date?: string;
  readonly camera?: string;
  readonly page?: number;
}

export interface NASAMediaSearchParams {
  readonly q?: string;
  readonly media_type?: 'image' | 'video' | 'audio';
  readonly year_start?: string;
  readonly year_end?: string;
  readonly center?: string;
  readonly keywords?: string;
  readonly page?: number;
}

export interface FireballParams {
  readonly 'date-min'?: string;
  readonly 'date-max'?: string;
  readonly 'energy-min'?: number;
  readonly 'vel-min'?: number;
  readonly limit?: number;
  readonly sort?: string;
}

export interface TechportParams {
  readonly updatedSince?: string;
}

export type DONKIEventType = 'CME' | 'CMEAnalysis' | 'GST' | 'IPS' | 'FLR' | 'SEP' | 'MPC' | 'RBE' | 'HSS' | 'WSAEnlilSimulations' | 'notifications';

export type MarsRoverName = 'curiosity' | 'opportunity' | 'spirit' | 'perseverance';

export type EPICImageType = 'natural' | 'enhanced';
