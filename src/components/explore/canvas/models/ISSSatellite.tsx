import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export function ISSSatellite() {
  const groupRef = useRef<THREE.Group>(null);

  // Rotate slowly to simulate stabilization in orbit
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
      groupRef.current.rotation.x += 0.0005;
    }
  });

  const metallicMaterial = new THREE.MeshStandardMaterial({ 
    color: '#d4d4d4', 
    metalness: 0.8, 
    roughness: 0.2 
  });
  
  const solarPanelMaterial = new THREE.MeshStandardMaterial({ 
    color: '#1e3a8a', 
    metalness: 0.5, 
    roughness: 0.5,
    side: THREE.DoubleSide
  });

  return (
    <group ref={groupRef} scale={[0.015, 0.015, 0.015]}>
      {/* Central Truss */}
      <mesh material={metallicMaterial} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.1, 0.1, 8, 16]} />
      </mesh>

      {/* Main Pressurized Modules (Zarya, Unity, Destiny) */}
      <mesh material={metallicMaterial} position={[0, 0, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 2, 32]} />
      </mesh>
      <mesh material={metallicMaterial} position={[0, 0, 1.8]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 1.5, 32]} />
      </mesh>
      
      {/* Solar Arrays - Left */}
      <group position={[-3, 0, 0]}>
        <mesh material={solarPanelMaterial} position={[0, 0, 1]}>
          <boxGeometry args={[1.5, 0.05, 3]} />
        </mesh>
        <mesh material={solarPanelMaterial} position={[0, 0, -1]}>
          <boxGeometry args={[1.5, 0.05, 3]} />
        </mesh>
      </group>
      
      {/* Solar Arrays - Right */}
      <group position={[3, 0, 0]}>
        <mesh material={solarPanelMaterial} position={[0, 0, 1]}>
          <boxGeometry args={[1.5, 0.05, 3]} />
        </mesh>
        <mesh material={solarPanelMaterial} position={[0, 0, -1]}>
          <boxGeometry args={[1.5, 0.05, 3]} />
        </mesh>
      </group>
      
      {/* Radiators (White panels) */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[0.1, 3, 0.5]} />
        <meshStandardMaterial color="#ffffff" roughness={1} />
      </mesh>
    </group>
  );
}
