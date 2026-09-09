'use client';

import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { SATELLITE_CONSTELLATION, getSatellitePosition, latLonToVector3 } from '@/lib/explore/orbits';

interface CameraControllerProps {
  trackedSatellite: string | null;
  time: Date;
}

export function CameraController({ trackedSatellite, time }: CameraControllerProps) {
  const { camera } = useThree();
  const EARTH_RADIUS = 5;

  useFrame(() => {
    if (!trackedSatellite) return;

    // Find the tracked satellite
    const sat = SATELLITE_CONSTELLATION.find(s => s.id === trackedSatellite);
    if (!sat) return;

    // Get its real-time position
    const position = getSatellitePosition(sat.tle1, sat.tle2, time);
    if (!position) return;

    const [x, y, z] = latLonToVector3(position.latitude, position.longitude, position.height, EARTH_RADIUS);
    const targetPos = new THREE.Vector3(x, y, z);
    
    // We want the camera to fly to a point slightly 'above' and 'behind' the satellite relative to the Earth.
    // Since the Earth is at (0,0,0), the vector from center to satellite is `targetPos`.
    // We multiply it by a factor (e.g. 1.2x) to push the camera further out.
    const idealCameraPos = targetPos.clone().normalize().multiplyScalar(targetPos.length() + 0.5);
    
    // Smoothly fly the camera to the ideal position
    camera.position.lerp(idealCameraPos, 0.05);
    
    // Keep the camera looking directly at the satellite
    camera.lookAt(targetPos);
  });

  return null;
}
