import * as satellite from 'satellite.js';

export interface SatelliteData {
  id: string;
  name: string;
  tle1: string;
  tle2: string;
}

// Sample TLEs for MVP (usually fetched from CelesTrak or Space-Track)
export const SATELLITE_CONSTELLATION: SatelliteData[] = [
  {
    id: 'iss',
    name: 'ISS (ZARYA)',
    tle1: '1 25544U 98067A   23277.53443324  .00015525  00000-0  28135-3 0  9997',
    tle2: '2 25544  51.6416 329.9868 0004550  29.5601  73.1973 15.50059529418873'
  },
  {
    id: 'terra',
    name: 'TERRA',
    tle1: '1 25994U 99068A   23277.51909852  .00000940  00000-0  23611-3 0  9991',
    tle2: '2 25994  98.1278 123.3644 0001293  89.4796 270.6558 14.57111009265902'
  },
  {
    id: 'aqua',
    name: 'AQUA',
    tle1: '1 27424U 02022A   23277.51659914  .00001229  00000-0  28795-3 0  9995',
    tle2: '2 27424  98.2257 149.2319 0002131  64.4449 295.6946 14.57106093138805'
  },
  {
    id: 'suomi-npp',
    name: 'SUOMI NPP',
    tle1: '1 37849U 11061A   23277.54516334  .00000244  00000-0  44456-4 0  9998',
    tle2: '2 37849  98.7188 344.2091 0001402  93.8569 266.2759 14.19575807619223'
  }
];

export function getSatellitePosition(tle1: string, tle2: string, date: Date) {
  try {
    const satrec = satellite.twoline2satrec(tle1, tle2);
    const positionAndVelocity = satellite.propagate(satrec, date);
    
    if (!positionAndVelocity || !positionAndVelocity.position) return null;

    const positionEci = positionAndVelocity.position as satellite.EciVec3<number>;

    const gmst = satellite.gstime(date);
    const positionGd = satellite.eciToGeodetic(positionEci, gmst);
    
    // Convert to degrees
    const longitude = satellite.degreesLong(positionGd.longitude);
    const latitude = satellite.degreesLat(positionGd.latitude);
    const height = positionGd.height; // in km
    
    return { latitude, longitude, height };
  } catch (err) {
    return null;
  }
}

/**
 * Converts lat/lon/altitude into Three.js 3D coordinates on a sphere.
 * @param lat Latitude in degrees
 * @param lon Longitude in degrees
 * @param alt Altitude in km
 * @param radius Base radius of the sphere
 */
export function latLonToVector3(lat: number, lon: number, alt: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  // Approximate Earth radius is ~6371km. 
  // We scale the altitude relative to the visual sphere radius.
  const scaledAlt = (alt / 6371) * radius;
  const r = radius + scaledAlt;

  const x = -(r * Math.sin(phi) * Math.cos(theta));
  const z = (r * Math.sin(phi) * Math.sin(theta));
  const y = (r * Math.cos(phi));

  return [x, y, z] as [number, number, number];
}
