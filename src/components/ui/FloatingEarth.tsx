"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useScroll, useTransform, useReducedMotion, useSpring, useVelocity } from "motion/react";
import * as THREE from "three";
import type { EONETEvent } from "@/lib/types";
import { getCategoryColor, getLatestGeometry } from "@/lib/utils";
import { audioSynth } from "@/lib/audio";
import { useTheme } from "@/components/providers/ThemeProvider";

interface FloatingEarthProps {
  events: EONETEvent[];
  className?: string;
  interactive?: boolean;
  focusCoords?: [number, number] | null; // [lng, lat]
}

export function FloatingEarth({ events, className, interactive = true, focusCoords = null }: FloatingEarthProps) {
  const prefersReduced = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  const isLight =
    theme === "light" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      !window.matchMedia("(prefers-color-scheme: dark)").matches);

  // Drag rotation states
  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const rotation = useRef({ x: 0.3, y: 0 }); // start with slight tilt
  const targetRotation = useRef({ x: 0.3, y: 0 });
  const [hoveredEvent, setHoveredEvent] = useState<EONETEvent | null>(null);

  // Refs to prevent useEffect re-run lag on hover and scroll coordinates updates
  const hoveredEventRef = useRef<EONETEvent | null>(null);
  const focusCoordsRef = useRef<[number, number] | null>(null);
  // eslint-disable-next-line react-hooks/refs -- TODO: Avoid ref access during render
  focusCoordsRef.current = focusCoords;

  // Hook into scroll to control scale/rotation (Scroll Camera System Scenes)
  const { scrollYProgress } = useScroll();
  const scrollSmooth = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });
  const scrollVelocity = useVelocity(scrollSmooth);
  
  // Camera distance scaler (inverse of scale value)
  const globeScale = useTransform(
    scrollSmooth,
    [0, 0.15, 0.35, 0.55, 0.75, 0.9, 1.0],
    [0.85, 1.0, 2.2, 2.2, 1.2, 1.0, 0.65]
  );
  
  const globeTiltX = useTransform(
    scrollSmooth,
    [0, 0.35, 0.75, 1.0],
    [0.3, 0.1, 0.5, 0.3]
  );

  const globeShift3DX = useTransform(
    scrollSmooth,
    [0, 0.75, 0.9, 1.0],
    [0, 0, -3.2, 0] // shifts left in 3D units for Analytics (Scene 5)
  );

  // Convert lat/lng to 3D Cartesian coordinates on a sphere of radius R
  const getCoords = (lng: number, lat: number, radius = 3): THREE.Vector3 => {
    const latRad = (lat * Math.PI) / 180;
    const lngRad = (lng * Math.PI) / 180;

    // Standard right-handed coordinate mapping matching 2D texture coordinates
    const x = radius * Math.cos(latRad) * Math.sin(lngRad);
    const y = radius * Math.sin(latRad);
    const z = radius * Math.cos(latRad) * Math.cos(lngRad);
    return new THREE.Vector3(x, y, z);
  };

  // Cache events to prevent full scene rebuilds when event references change but IDs don't
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const eventIdsString = useMemo(() => events.map(e => e.id).sort().join(','), [events]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stableEvents = useMemo(() => events, [eventIdsString]);

  // Boot sequence state
  const bootProgress = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── Three.js Scene Setup ───────────────────────────────────────────
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    
    const scene = new THREE.Scene();
    
    // Transparent background to show the ParticleField stars behind
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 10;

    // ── Lighting Setup ────────────────────────────────────────────────
    // Ambient light - bright daylight in light mode, deep space in dark mode
    const ambientLight = new THREE.AmbientLight(isLight ? 0xffffff : 0x0a1024, isLight ? 1.5 : 0.95);
    scene.add(ambientLight);

    // Directional light - Sunlight
    const sunLight = new THREE.DirectionalLight(0xffffff, isLight ? 2.2 : 1.8);
    sunLight.position.set(10, 5, 10);
    scene.add(sunLight);

    // Subtle blue fill light from the opposite side
    const fillLight = new THREE.DirectionalLight(isLight ? 0x0284c7 : 0x38bdf8, isLight ? 0.8 : 0.5);
    fillLight.position.set(-10, -5, -10);
    scene.add(fillLight);

    // ── Earth Setup ───────────────────────────────────────────────────
    const earthGroup = new THREE.Group();
    scene.add(earthGroup);

    // parent globeGroup rotated Y by Math.PI to align texture coordinate wrap
    const globeGroup = new THREE.Group();
    globeGroup.rotation.y = Math.PI;
    earthGroup.add(globeGroup);

    const earthRadius = 3;
    const earthGeometry = new THREE.SphereGeometry(earthRadius, 64, 64);
    
    // Textures Loader
    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin("anonymous");

    // Load High-Res Earth Textures from unpkg CDN
    const colorMap = textureLoader.load("https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg");
    const bumpMap = textureLoader.load("https://unpkg.com/three-globe/example/img/earth-topology.png");
    const specularMap = textureLoader.load("https://unpkg.com/three-globe/example/img/earth-water.png");
    const cloudsMap = textureLoader.load("https://unpkg.com/three-globe/example/img/earth-clouds.png");

    const earthMaterial = new THREE.MeshPhongMaterial({
      map: colorMap,
      bumpMap: bumpMap,
      bumpScale: 0.08, // 3D mountain reliefs
      specularMap: specularMap,
      specular: new THREE.Color("grey"),
      shininess: 12, // ocean reflection
    });

    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    // Remove earthMesh.rotation.y = Math.PI since parent globeGroup has it
    globeGroup.add(earthMesh);

    // ── Clouds Setup ──────────────────────────────────────────────────
    const cloudsGeometry = new THREE.SphereGeometry(earthRadius + 0.04, 64, 64);
    const cloudsMaterial = new THREE.MeshPhongMaterial({
      map: cloudsMap,
      transparent: true,
      opacity: 0.4,
      depthWrite: false, // Prevents sorting artifacts
    });
    const cloudsMesh = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
    globeGroup.add(cloudsMesh);

    // ── Atmosphere Glow Setup ──────────────────────────────────────────
    const atmosphereGeometry = new THREE.SphereGeometry(earthRadius + 0.02, 64, 64);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x00d4aa,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    globeGroup.add(atmosphereMesh);

    // ── Event Hotspots & Spikes Setup ──────────────────────────────────
    const markersGroup = new THREE.Group();
    globeGroup.add(markersGroup);

    // Keep track of resources to dispose later
    const meshesToDispose: THREE.Object3D[] = [];
    const materialsToDispose: THREE.Material[] = [];
    const geometriesToDispose: THREE.BufferGeometry[] = [];

    const activeEventsList = stableEvents
      .map((event: EONETEvent) => {
        const geo = getLatestGeometry(event);
        if (!geo || !geo.coordinates) return null;
        const coords = geo.coordinates as number[];
        const categoryId = event.categories[0]?.id || "manmade";
        return {
          event,
          color: getCategoryColor(categoryId),
          coords: [coords[0], coords[1]] as [number, number], // [lng, lat]
        };
      })
      .filter(Boolean) as Array<{
      event: EONETEvent;
      color: string;
      coords: [number, number];
    }>;

    // Plot markers and spikes
    activeEventsList.forEach(({ event, color, coords }) => {
      const position = getCoords(coords[0], coords[1], earthRadius);
      const direction = position.clone().normalize();
      
      const categoryColor = new THREE.Color(color);

      // 1. Core Surface Dot
      const dotGeo = new THREE.SphereGeometry(0.045, 8, 8);
      const dotMat = new THREE.MeshBasicMaterial({ color: categoryColor });
      const dotMesh = new THREE.Mesh(dotGeo, dotMat);
      dotMesh.position.copy(position);
      dotMesh.userData = { event };
      markersGroup.add(dotMesh);

      geometriesToDispose.push(dotGeo);
      materialsToDispose.push(dotMat);
      meshesToDispose.push(dotMesh);

      // 2. Glowing Transparent Spike (3D data cylinder pointing outwards)
      const spikeHeight = 0.7;
      const spikeGeo = new THREE.CylinderGeometry(0, 0.04, spikeHeight, 8, 1, true);
      const spikeMat = new THREE.MeshBasicMaterial({
        color: categoryColor,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending,
      });
      const spikeMesh = new THREE.Mesh(spikeGeo, spikeMat);
      
      // Position the cylinder center so its base sits on the surface
      const spikePos = position.clone().add(direction.clone().multiplyScalar(spikeHeight / 2));
      spikeMesh.position.copy(spikePos);
      
      // Rotate the cylinder (which points along Y axis by default) to align with normal vector
      const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
      spikeMesh.setRotationFromQuaternion(quaternion);
      spikeMesh.userData = { event };
      markersGroup.add(spikeMesh);

      geometriesToDispose.push(spikeGeo);
      materialsToDispose.push(spikeMat);
      meshesToDispose.push(spikeMesh);

      // Save animation data on the meshes
      spikeMesh.userData.originalScaleY = 1.0;
      spikeMesh.userData.phaseOffset = Math.random() * Math.PI * 2;
    });

    // ── Data Constellations Setup (3D Bézier curves) ───────────────────
    const curvesList: Array<{ curve: THREE.QuadraticBezierCurve3; pulseMesh: THREE.Mesh }> = [];

    // Connect close events of the same category
    for (let i = 0; i < activeEventsList.length; i++) {
      const ptA = activeEventsList[i];
      const posA = getCoords(ptA.coords[0], ptA.coords[1], earthRadius);
      
      let nearestIdx = -1;
      let minDist = 10;

      for (let j = i + 1; j < activeEventsList.length; j++) {
        const ptB = activeEventsList[j];
        if (ptA.event.categories[0]?.id !== ptB.event.categories[0]?.id) continue;
        
        const posB = getCoords(ptB.coords[0], ptB.coords[1], earthRadius);
        const dist = posA.distanceTo(posB);
        if (dist < 2.0 && dist < minDist) {
          minDist = dist;
          nearestIdx = j;
        }
      }

      if (nearestIdx !== -1) {
        const ptB = activeEventsList[nearestIdx];
        const posB = getCoords(ptB.coords[0], ptB.coords[1], earthRadius);

        // Calculate arched midpoint
        const midPoint = new THREE.Vector3().addVectors(posA, posB).multiplyScalar(0.5);
        midPoint.normalize().multiplyScalar(earthRadius + minDist * 0.35); // Arched outwards

        const curve = new THREE.QuadraticBezierCurve3(posA, midPoint, posB);
        const points = curve.getPoints(20);

        const curveGeo = new THREE.BufferGeometry().setFromPoints(points);
        const curveMat = new THREE.LineBasicMaterial({
          color: new THREE.Color(ptA.color),
          transparent: true,
          opacity: 0.18,
          blending: THREE.AdditiveBlending,
        });
        const line = new THREE.Line(curveGeo, curveMat);
        globeGroup.add(line);

        geometriesToDispose.push(curveGeo);
        materialsToDispose.push(curveMat);
        meshesToDispose.push(line);

        // Traveling pulse mesh along the curve
        const pulseGeo = new THREE.SphereGeometry(0.025, 6, 6);
        const pulseMat = new THREE.MeshBasicMaterial({
          color: new THREE.Color(ptA.color),
          transparent: true,
          opacity: 0.8,
        });
        const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
        globeGroup.add(pulseMesh);
        curvesList.push({ curve, pulseMesh });

        geometriesToDispose.push(pulseGeo);
        materialsToDispose.push(pulseMat);
        meshesToDispose.push(pulseMesh);
      }
    }

    // ── Raycasting (Hover Detection) ──────────────────────────────────
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-9999, -9999);

    const onMouseMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      // Normalized device coordinates
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      // Keep track of absolute cursor coordinates for cursor component tracking
      previousMousePosition.current.x = e.clientX - rect.left;
      previousMousePosition.current.y = e.clientY - rect.top;
    };

    renderer.domElement.addEventListener("mousemove", onMouseMove);

    // ── Window Resize ─────────────────────────────────────────────────
    const handleResize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // ── Animation Loop ────────────────────────────────────────────────
    let animationId = 0;
    let time = 0;

    const render = () => {
      time += 0.05;

      // 1. Get Framer Motion transforms
      const scaleValue = globeScale.get();
      const tiltXValue = globeTiltX.get();
      const shiftXValue = window.innerWidth < 768 ? 0 : globeShift3DX.get();

      // Cinematic Boot Sequence
      if (bootProgress.current < 1.0) {
        bootProgress.current += 0.012; // Approx 1.5 seconds at 60fps
        if (bootProgress.current > 1.0) bootProgress.current = 1.0;
      }
      
      // Easing function for boot (easeOutQuart)
      const easeBoot = 1 - Math.pow(1 - bootProgress.current, 4);

      // 2. Update camera distance and viewport shift with Boot-up Tween
      const targetZ = 9.0 / scaleValue;
      const startZ = 25.0; // Start far away
      camera.position.z = startZ + (targetZ - startZ) * easeBoot;
      
      earthGroup.position.x = shiftXValue;
      // Slight rise up effect during boot
      earthGroup.position.y = -2.0 * (1 - easeBoot);

      // 3. Auto-rotation or Coordinate Locking
      if (focusCoordsRef.current && !isDragging.current) {
        // [lng, lat]
        const targetX = (focusCoordsRef.current[1] * Math.PI) / 180;
        const targetY = (-focusCoordsRef.current[0] * Math.PI) / 180 - Math.PI;

        targetRotation.current.x = targetX;
        
        // Wrap Y rotation difference smoothly to the shortest path
        let diffY = targetY - targetRotation.current.y;
        diffY = Math.atan2(Math.sin(diffY), Math.cos(diffY));
        targetRotation.current.y += diffY * 0.08;
      } else if (!isDragging.current && !prefersReduced) {
        const scrollVal = scrollSmooth.get();
        // Spin Y faster in the middle transitions
        const baseSpeed = scrollVal > 0.35 && scrollVal < 0.55 ? 0.015 : 0.003;
        // Add a fast spin during boot sequence
        const bootSpin = (1 - easeBoot) * 0.05;
        // Calculate scroll velocity and apply it as Y rotation burst spin
        const velocityVal = Math.abs(scrollVelocity.get());
        const velocitySpin = Math.min(velocityVal * 0.12, 0.08); // cap it
        targetRotation.current.y += baseSpeed + velocitySpin + bootSpin;
      }

      // Smooth interpolation
      rotation.current.x += (targetRotation.current.x - rotation.current.x) * 0.1;
      rotation.current.y += (targetRotation.current.y - rotation.current.y) * 0.1;

      // Clamp X rotation to prevent flipping upside down
      rotation.current.x = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, rotation.current.x));

      // Apply rotations
      earthGroup.rotation.y = rotation.current.y;
      earthGroup.rotation.x = rotation.current.x + tiltXValue;

      // Slow drift rotation of clouds relative to Earth
      if (!prefersReduced) {
        cloudsMesh.rotation.y += 0.0006;
      }

      // 4. Animate Event Spikes (pulsing height)
      if (!prefersReduced) {
        markersGroup.children.forEach((child) => {
          if (child instanceof THREE.Mesh && child.geometry instanceof THREE.CylinderGeometry) {
            const offset = child.userData.phaseOffset || 0;
            const scaleY = 1.0 + Math.sin(time * 2.5 + offset) * 0.2;
            child.scale.set(1.0, scaleY, 1.0);
          }
        });
      }

      // 5. Animate Constellation Pulses
      curvesList.forEach(({ curve, pulseMesh }, idx) => {
        const t = (time * 0.08 + idx * 0.2) % 1.0;
        const pt = curve.getPointAt(t);
        pulseMesh.position.copy(pt);
      });

      // 6. Raycast Hover Checks
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(markersGroup.children, true);
      let hoveredObj: EONETEvent | null = null;
      if (intersects.length > 0) {
        const firstIntersect = intersects[0].object;
        if (firstIntersect.userData && firstIntersect.userData.event) {
          hoveredObj = firstIntersect.userData.event;
        }
      }

      // Update state and trigger hover sound once on enter
      if (hoveredObj !== hoveredEventRef.current) {
        hoveredEventRef.current = hoveredObj;
        setHoveredEvent(hoveredObj);
        if (hoveredObj) {
          audioSynth.playHover();
        }
      }

      // 7. Atmosphere Swell & Pulse from Scroll Velocity
      if (!prefersReduced) {
        const velocityVal = Math.abs(scrollVelocity.get());
        const swell = 1.0 + Math.min(velocityVal * 0.08, 0.06); // swell up to 6% larger
        atmosphereMesh.scale.set(swell, swell, swell);
        
        // Also increase brightness/opacity of the atmosphere when scrolling fast, starting at 0 during boot
        const targetOpacity = 0.08 + Math.min(velocityVal * 0.12, 0.10); 
        atmosphereMaterial.opacity = targetOpacity * easeBoot;
        
        // Fade in Earth material during boot
        earthMaterial.opacity = easeBoot;
        earthMaterial.transparent = easeBoot < 1.0;
        
      } else {
        atmosphereMesh.scale.set(1.0, 1.0, 1.0);
        atmosphereMaterial.opacity = 0.08;
      }

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(render);
    };

    render();

    // ── Clean Up on Unmount ───────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      renderer.domElement.removeEventListener("mousemove", onMouseMove);

      // Dispose all Three.js elements to prevent WebGL memory leaks
      renderer.dispose();
      earthGeometry.dispose();
      earthMaterial.dispose();
      cloudsGeometry.dispose();
      cloudsMaterial.dispose();
      atmosphereGeometry.dispose();
      atmosphereMaterial.dispose();

      geometriesToDispose.forEach((g) => g.dispose());
      materialsToDispose.forEach((m) => m.dispose());
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((m: THREE.Material) => m.dispose());
            } else {
              child.material.dispose();
            }
          }
        }
      });
    };
  }, [stableEvents, prefersReduced, isLight]);

  // ── Drag rotation mouse event handlers ─────────────────────────────
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!interactive) return;
    isDragging.current = true;
    previousMousePosition.current = {
      x: e.clientX,
      y: e.clientY,
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging.current) return;

    const deltaX = e.clientX - previousMousePosition.current.x;
    const deltaY = e.clientY - previousMousePosition.current.y;

    const dragSpeed = 0.007;
    targetRotation.current.y += deltaX * dragSpeed;
    targetRotation.current.x += deltaY * dragSpeed;

    previousMousePosition.current = {
      x: e.clientX,
      y: e.clientY,
    };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  return (
    <div 
      className={`relative w-full h-full ${className}`}
      // eslint-disable-next-line react-hooks/refs -- TODO: Avoid ref access during render
      data-cursor-label={isDragging.current ? "Rotating" : hoveredEvent ? "Track" : "Explore"}
      data-cursor-color={hoveredEvent ? getCategoryColor(hoveredEvent.categories[0]?.id || "") : "#00d4aa"}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing outline-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />

      {/* Floating details overlay on globe marker hover */}
      {hoveredEvent && (
        <div className="absolute top-[8%] left-1/2 -translate-x-1/2 z-20 pointer-events-none animate-slide-up">
          <div className="rounded-xl border border-white/10 bg-[#0f1420]/90 px-4 py-2 text-center shadow-2xl backdrop-blur-xl max-w-sm">
            <span 
              className="text-[10px] font-bold uppercase tracking-wider block mb-0.5"
              style={{ color: getCategoryColor(hoveredEvent.categories[0]?.id || "") }}
            >
              {hoveredEvent.categories[0]?.title}
            </span>
            <p className="text-xs font-semibold text-white/90 line-clamp-1">
              {hoveredEvent.title}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
