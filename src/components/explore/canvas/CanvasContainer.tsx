import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { Suspense } from 'react';
import { Earth } from './Earth';
import { Satellites } from './Satellites';
import { Atmosphere } from './Atmosphere';
import { CameraController } from './CameraController';

interface CanvasContainerProps {
  activeLayer: string;
  time: Date;
  trackedSatellite: string | null;
}

export function CanvasContainer({ activeLayer, time, trackedSatellite }: CanvasContainerProps) {
  return (
    <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
      {/* Space Background */}
      <color attach="background" args={['#000000']} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {/* Lighting */}
      <ambientLight intensity={0.1} />
      <directionalLight position={[5, 3, 5]} intensity={2} />

      {/* Earth and Orbits */}
      <Suspense fallback={null}>
        <group>
          <Earth activeLayer={activeLayer} time={time} />
          <Atmosphere />
          <Satellites time={time} trackedSatellite={trackedSatellite} />
        </group>
      </Suspense>

      {/* Cinematic Camera Tracking */}
      <CameraController trackedSatellite={trackedSatellite} time={time} />

      {/* Controls */}
      <OrbitControls 
        enablePan={false} 
        enableZoom={true} 
        minDistance={6} 
        maxDistance={50}
        autoRotate={!trackedSatellite}
        autoRotateSpeed={0.5}
        enabled={!trackedSatellite}
      />
    </Canvas>
  );
}
