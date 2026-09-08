import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export function GenericSatellite() {
  const groupRef = useRef<THREE.Group>(null);

  // Rotate slowly
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
    }
  });

  const goldMaterial = new THREE.MeshStandardMaterial({ 
    color: '#fbbf24', 
    metalness: 0.9, 
    roughness: 0.4 
  });
  
  const solarPanelMaterial = new THREE.MeshStandardMaterial({ 
    color: '#1e3a8a', 
    metalness: 0.5, 
    roughness: 0.5,
    side: THREE.DoubleSide
  });

  const instrumentMaterial = new THREE.MeshStandardMaterial({ 
    color: '#d4d4d4', 
    metalness: 0.6, 
    roughness: 0.3 
  });

  return (
    <group ref={groupRef} scale={[0.02, 0.02, 0.02]}>
      {/* Central Bus (Gold foil) */}
      <mesh material={goldMaterial}>
        <boxGeometry args={[1, 1.5, 1]} />
      </mesh>

      {/* Earth-facing Instruments */}
      <mesh material={instrumentMaterial} position={[0, -0.8, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 0.3, 16]} />
      </mesh>
      
      {/* Single large solar array wing (Typical for Terra/Aqua) */}
      <mesh material={solarPanelMaterial} position={[1.5, 0.5, 0]}>
        <boxGeometry args={[2, 0.05, 1]} />
      </mesh>
      
      {/* Array connector */}
      <mesh material={instrumentMaterial} position={[0.6, 0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 1, 8]} />
      </mesh>
    </group>
  );
}
