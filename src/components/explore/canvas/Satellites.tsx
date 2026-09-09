'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { SATELLITE_CONSTELLATION, getSatellitePosition, latLonToVector3 } from '@/lib/explore/orbits';
import { ISSSatellite } from './models/ISSSatellite';
import { GenericSatellite } from './models/GenericSatellite';

interface SatellitesProps {
  time: Date;
  trackedSatellite: string | null;
}

export function Satellites({ time, trackedSatellite }: SatellitesProps) {
  const EARTH_RADIUS = 5;

  return (
    <group>
      {SATELLITE_CONSTELLATION.map((sat) => {
        const position = getSatellitePosition(sat.tle1, sat.tle2, time);
        if (!position) return null;

        const [x, y, z] = latLonToVector3(position.latitude, position.longitude, position.height, EARTH_RADIUS);
        const isTracked = trackedSatellite === sat.id;

        return (
          <group key={sat.id} position={[x, y, z]}>
            {/* Render Detailed 3D Model if tracked, else a glowing dot */}
            {isTracked ? (
              sat.id === 'iss' ? <ISSSatellite /> : <GenericSatellite />
            ) : (
              <mesh onClick={() => window.dispatchEvent(new CustomEvent('track-satellite', { detail: sat.id }))}>
                <sphereGeometry args={[0.05, 16, 16]} />
                <meshBasicMaterial color="#00ffaa" />
              </mesh>
            )}
            
            {/* Aerospace-style minimalist label */}
            <Html distanceFactor={15}>
              <div className="flex items-center select-none pointer-events-none group">
                {/* Connector line */}
                <div className={`h-[1px] w-8 transition-colors ${isTracked ? 'bg-emerald-400' : 'bg-white/40 group-hover:bg-white/80'}`} />
                {/* Text label */}
                <div className={`px-2 py-0.5 text-[10px] tracking-widest font-mono uppercase whitespace-nowrap transition-colors border-l-2 ${
                  isTracked ? 'border-emerald-400 text-emerald-300 bg-emerald-900/20' : 'border-white/40 text-white/70 bg-black/40 group-hover:border-white group-hover:text-white'
                }`}>
                  {sat.name}
                </div>
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}
