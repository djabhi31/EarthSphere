import { useRef, useMemo } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getGibsWmsUrl, GIBS_LAYERS } from '@/lib/explore/nasaGibs';

interface EarthProps {
  activeLayer: string;
  time: Date;
}

export function Earth({ activeLayer, time }: EarthProps) {
  const meshRef = useRef<THREE.Group>(null);

  // Load high-res 4K base textures
  const [colorMap, bumpMap, specularMap] = useLoader(THREE.TextureLoader, [
    '/textures/earth-blue-marble.jpg',
    '/textures/earth-topology.png',
    '/textures/earth-water.png',
  ]);
  
  colorMap.colorSpace = THREE.SRGBColorSpace;

  // Determine URL for the current GIBS vital sign layer
  const gibsTextureUrl = useMemo(() => {
    if (activeLayer === 'visual') return null;
    return getGibsWmsUrl(activeLayer as keyof typeof GIBS_LAYERS, time);
  }, [activeLayer, time]);

  // Load GIBS texture if activeLayer is not 'visual'
  // using useLoader for conditional is tricky, so we use it with a fallback or load it dynamically.
  // Actually, useLoader suspends, which is fine. To avoid issues with conditional hooks, we can render a separate component for the overlay.

  return (
    <group ref={meshRef}>
      {/* Base 4K Earth */}
      <mesh>
        <sphereGeometry args={[5, 64, 64]} />
        <meshPhongMaterial 
          map={colorMap}
          bumpMap={bumpMap}
          bumpScale={0.15}
          specularMap={specularMap}
          specular={new THREE.Color('grey')}
          shininess={35}
        />
      </mesh>

      {/* GIBS Data Overlay */}
      {gibsTextureUrl && <GibsOverlay url={gibsTextureUrl} />}
    </group>
  );
}

function GibsOverlay({ url }: { url: string }) {
  const texture = useLoader(THREE.TextureLoader, url);
  texture.colorSpace = THREE.SRGBColorSpace;
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);

  // Smooth fade-in animation for data layers
  useFrame(() => {
    if (materialRef.current && materialRef.current.opacity < 0.85) {
      materialRef.current.opacity += 0.02;
    }
  });

  // Custom shader hook to remove the black "no data" swaths from GIBS imagery
  const handleBeforeCompile = (shader: any) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <dithering_fragment>',
      `
      #include <dithering_fragment>
      // Discard black pixels to let the Earth show through
      if (gl_FragColor.r < 0.02 && gl_FragColor.g < 0.02 && gl_FragColor.b < 0.02) {
        discard;
      }
      `
    );
  };
  
  return (
    <mesh>
      {/* Slightly larger than base earth to avoid z-fighting */}
      <sphereGeometry args={[5.01, 64, 64]} />
      <meshBasicMaterial 
        ref={materialRef}
        map={texture} 
        transparent={true} 
        opacity={0} 
        blending={THREE.NormalBlending}
        onBeforeCompile={handleBeforeCompile}
      />
    </mesh>
  );
}
