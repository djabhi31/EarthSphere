import { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';

export function Atmosphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const cloudMap = useLoader(THREE.TextureLoader, '/textures/earth-clouds.png');
  
  // Slowly rotate the clouds over time for realism
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.0002;
    }
  });

  return (
    <group>
      {/* Cloud Layer */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[5.03, 64, 64]} />
        <meshPhongMaterial 
          map={cloudMap} 
          transparent={true} 
          opacity={0.6} 
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      
      {/* Atmospheric Glow */}
      <mesh>
        <sphereGeometry args={[5.1, 64, 64]} />
        <meshPhysicalMaterial 
          color="#4b80b6" 
          transparent={true} 
          opacity={0.15} 
          roughness={1}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}
