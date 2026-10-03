"use client";

import { Component, Suspense, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame, useLoader, useThree, type ThreeEvent } from "@react-three/fiber";
import type { MotionValue } from "motion/react";
import * as THREE from "three";
import { ISSSatellite } from "@/components/explore/canvas/models/ISSSatellite";
import { GenericSatellite } from "@/components/explore/canvas/models/GenericSatellite";
import { getCategoryColor } from "@/lib/utils";
import type { EONETEvent } from "@/lib/types";
import { chapterWeight, eventCoordinates, geographicPoint, sampleFlight } from "./flight";
import styles from "./journey.module.css";

type Props = {
  progress: MotionValue<number>;
  events: readonly EONETEvent[];
  category: string;
  focusedEvent: EONETEvent | null;
  onSelect: (event: EONETEvent) => void;
  animated: boolean;
  visible: boolean;
  reduced: boolean;
};

const atmosphereVertex = `varying vec3 vNormal; varying vec3 vPosition;
void main() { vNormal = normalize(normalMatrix * normal); vec4 p = modelViewMatrix * vec4(position,1.0); vPosition = p.xyz; gl_Position = projectionMatrix * p; }`;
const atmosphereFragment = `uniform vec3 tint; uniform float strength; varying vec3 vNormal; varying vec3 vPosition;
void main() { float rim = pow(1.0 - max(dot(normalize(vNormal), normalize(-vPosition)),0.0), 3.6); gl_FragColor = vec4(tint, rim * strength); }`;
const marsVertex = `varying vec3 vPoint; varying vec3 vNormal;
void main() { vPoint = position; vNormal = normal; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`;
const marsFragment = `varying vec3 vPoint; varying vec3 vNormal;
float hash(vec3 p) { return fract(sin(dot(p,vec3(127.1,311.7,74.7))) * 43758.5453); }
float noise(vec3 p) { vec3 i=floor(p),f=fract(p); f=f*f*(3.0-2.0*f);
return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z); }
void main() { vec3 p=vPoint*3.0; float n=0.0; float a=.5; for(int i=0;i<5;i++){ n+=a*noise(p); p=p*2.1+vec3(1.2,4.1,2.3); a*=.5; }
vec3 land=mix(vec3(.19,.064,.028),vec3(.75,.36,.17),smoothstep(.15,.8,n));
float light=max(dot(normalize(vNormal),normalize(vec3(-.7,.55,1.0))),0.0);
float ice=smoothstep(.94,.99,normalize(vPoint).y); land=mix(land,vec3(.77,.72,.63),ice*.65);
gl_FragColor=vec4(land*(.12+light*1.2),1.0); }`;

function makeStars(count: number) {
  let seed = 73;
  const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const points = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = random() * Math.PI * 2, z = random() * 2 - 1, radius = 28 + random() * 40;
    const r = Math.sqrt(1 - z * z);
    points.set([Math.cos(theta) * r * radius, z * radius, Math.sin(theta) * r * radius], i * 3);
  }
  return points;
}

function Scene({ progress, events, category, focusedEvent, onSelect, animated, reduced, onReady }: Props & { onReady: () => void }) {
  const { camera, size, invalidate } = useThree();
  const earth = useRef<THREE.Group>(null);
  const clouds = useRef<THREE.Mesh>(null);
  const stars = useRef<THREE.Points>(null);
  const orbits = useRef<THREE.Group>(null);
  const orbitalCraft = useRef<THREE.Group>(null);
  const mars = useRef<THREE.Mesh>(null);
  const markers = useRef<THREE.Points>(null);
  const arcs = useRef<THREE.Group>(null);
  const atmosphere = useRef<THREE.ShaderMaterial>(null);
  const grid = useRef<THREE.Mesh>(null);
  const last = useRef({ time: 0, ready: false });
  const working = useMemo(() => ({ quaternion: new THREE.Quaternion(), point: new THREE.Vector3(), destination: new THREE.Vector3(), tint: new THREE.Color(), euler: new THREE.Euler() }), []);
  const [map, bump, water, cloud] = useLoader(THREE.TextureLoader, ["/textures/earth-blue-marble.jpg", "/textures/earth-topology.png", "/textures/earth-water.png", "/textures/earth-clouds.png"]);
  const colorMap = useMemo(() => { const texture = map.clone(); texture.colorSpace = THREE.SRGBColorSpace; texture.anisotropy = 4; texture.needsUpdate = true; return texture; }, [map]);
  useEffect(() => () => colorMap.dispose(), [colorMap]);
  useEffect(() => progress.on("change", () => invalidate()), [progress, invalidate]);
  const starPositions = useMemo(() => makeStars(1400), []);
  const ringPositions = useMemo(() => [3.1, 3.8, 4.55].map(radius => {
    const positions = new Float32Array(193 * 3);
    for (let i = 0; i <= 192; i++) { const t = i / 192 * Math.PI * 2; positions.set([Math.cos(t) * radius, 0, Math.sin(t) * radius], i * 3); }
    return positions;
  }), []);
  const points = useMemo(() => events.flatMap(event => {
    const coords = eventCoordinates(event);
    if (!coords || (category !== "all" && !event.categories.some(item => item.id === category))) return [];
    return [{ event, coords, position: geographicPoint(...coords) }];
  }).slice(0, 80), [events, category]);
  const markerData = useMemo(() => {
    const positions = new Float32Array(points.length * 3), colors = new Float32Array(points.length * 3);
    points.forEach((point, i) => { positions.set(point.position, i * 3); new THREE.Color(getCategoryColor(point.event.categories[0]?.id ?? "")).toArray(colors, i * 3); });
    return { positions, colors };
  }, [points]);
  const networks = useMemo(() => points.slice(0, 16).map((point, i, list) => {
    const end = list[(i + 3) % list.length];
    const a = new THREE.Vector3(...point.position), b = new THREE.Vector3(...end.position);
    const midpoint = a.clone().add(b).normalize().multiplyScalar(2.8 + a.distanceTo(b) * .16);
    return new THREE.QuadraticBezierCurve3(a, midpoint, b).getPoints(48).flatMap(p => p.toArray());
  }), [points]);
  const glowUniforms = useMemo(() => ({ tint: { value: new THREE.Color("#5085ff") }, strength: { value: .85 } }), []);

  useFrame((state, delta) => {
    const p = reduced ? 0 : progress.get();
    const mobile = size.width < 700;
    const frame = sampleFlight(p, mobile);
    const mouseX = animated && !mobile ? state.pointer.x * .13 : 0;
    const mouseY = animated && !mobile ? state.pointer.y * .07 : 0;
    camera.position.set(frame.position[0] + mouseX, frame.position[1] + mouseY, frame.position[2]);
    camera.lookAt(...frame.target);
    if (animated) last.current.time += Math.min(delta, .05);
    const time = last.current.time;
    const observation = chapterWeight(p, 1), orbital = chapterWeight(p, 2), network = chapterWeight(p, 4);
    if (earth.current) {
      const focused = focusedEvent && observation > .65 ? eventCoordinates(focusedEvent) : null;
      if (focused) {
        working.point.set(...geographicPoint(...focused, 1));
        working.destination.copy(camera.position).normalize();
        working.quaternion.setFromUnitVectors(working.point, working.destination);
      } else {
        working.euler.set(.05, frame.rotation + time * .012, .10);
        working.quaternion.setFromEuler(working.euler);
      }
      earth.current.quaternion.slerp(working.quaternion, animated ? 1 - Math.exp(-delta * 4.5) : 1);
    }
    if (clouds.current) clouds.current.rotation.y = time * .008;
    if (stars.current) stars.current.rotation.y = p * .2;
    if (mars.current) mars.current.rotation.y = p * 2.5 + time * .015;
    if (orbits.current) {
      orbits.current.visible = orbital > .015 || p < .14 || network > .02;
      orbits.current.rotation.y = p * 1.8 + time * .008;
      orbits.current.children.forEach(child => {
        const line = child as THREE.Line;
        if (line.material instanceof THREE.LineBasicMaterial) line.material.opacity = .08 + orbital * .34 + network * .1;
      });
    }
    if (orbitalCraft.current) {
      orbitalCraft.current.visible = orbital > .01;
      orbitalCraft.current.rotation.y = time * .10 + p * 6;
      const scale = .35 + orbital * .65;
      orbitalCraft.current.scale.setScalar(scale);
    }
    if (markers.current) {
      markers.current.visible = observation > .015 || network > .015;
      const material = markers.current.material as THREE.PointsMaterial;
      material.size = .045 + (Math.sin(time * 2) * .006 + .012) * Math.max(observation, network);
      material.opacity = Math.max(observation, network) * .95;
    }
    if (arcs.current) {
      arcs.current.visible = network > .01;
      arcs.current.children.forEach(child => { ((child as THREE.Line).material as THREE.LineBasicMaterial).opacity = network * .55; });
    }
    if (grid.current) {
      grid.current.visible = network > .01;
      (grid.current.material as THREE.MeshBasicMaterial).opacity = network * .08;
    }
    if (atmosphere.current) {
      const color = category !== "all" && observation > .5 ? getCategoryColor(category) : "#528eff";
      working.tint.set(color);
      atmosphere.current.uniforms.tint.value.lerp(working.tint, animated ? .05 : 1);
      atmosphere.current.uniforms.strength.value = .65 + network * .4;
    }
    if (!last.current.ready) { last.current.ready = true; onReady(); }
  });

  const selectPoint = (event: ThreeEvent<MouseEvent>) => {
    if (event.index === undefined || !points[event.index] || !earth.current || !markers.current?.visible) return;
    const point = new THREE.Vector3(...points[event.index].position).applyQuaternion(earth.current.quaternion);
    // Points are raycast independently of the globe. Ignore locations on its far side.
    if (point.dot(camera.position.clone().sub(point)) <= 0) return;
    event.stopPropagation();
    onSelect(points[event.index].event);
  };

  return <>
    <ambientLight color="#7196bf" intensity={.34} />
    <directionalLight position={[-5, 4, 7]} color="#dceaff" intensity={3} />
    <directionalLight position={[6, 1, -3]} color="#276fff" intensity={1.6} />
    <points ref={stars} frustumCulled={false}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[starPositions, 3]} /></bufferGeometry>
      <pointsMaterial color="#bccbdb" size={.045} sizeAttenuation transparent opacity={.68} depthWrite={false} />
    </points>
    <group ref={earth}>
      <mesh><sphereGeometry args={[2.35, 96, 72]} /><meshPhongMaterial map={colorMap} bumpMap={bump} bumpScale={.027} specularMap={water} specular="#162534" shininess={28} /></mesh>
      <mesh ref={clouds}><sphereGeometry args={[2.367, 64, 48]} /><meshPhongMaterial map={cloud} transparent opacity={.3} blending={THREE.AdditiveBlending} depthWrite={false} /></mesh>
      <mesh><sphereGeometry args={[2.395, 64, 48]} /><shaderMaterial ref={atmosphere} uniforms={glowUniforms} vertexShader={atmosphereVertex} fragmentShader={atmosphereFragment} transparent blending={THREE.AdditiveBlending} depthWrite={false} /></mesh>
      <mesh ref={grid}><sphereGeometry args={[2.38, 40, 24]} /><meshBasicMaterial color="#74dbed" wireframe transparent opacity={0} depthWrite={false} /></mesh>
      <points ref={markers} onClick={selectPoint} onPointerOver={event => { const target = event.nativeEvent.target; if (target instanceof HTMLCanvasElement) target.style.cursor = "pointer"; }} onPointerOut={event => { const target = event.nativeEvent.target; if (target instanceof HTMLCanvasElement) target.style.cursor = "auto"; }}>
        <bufferGeometry key={points.map(p => p.event.id).join(",")}><bufferAttribute attach="attributes-position" args={[markerData.positions, 3]} /><bufferAttribute attach="attributes-color" args={[markerData.colors, 3]} /></bufferGeometry>
        <pointsMaterial vertexColors size={.055} sizeAttenuation transparent depthWrite={false} />
      </points>
      <group ref={arcs}>{networks.map((positions, i) => <lineLoop key={i}><bufferGeometry><bufferAttribute attach="attributes-position" args={[new Float32Array(positions), 3]} /></bufferGeometry><lineBasicMaterial color="#7edbe2" transparent opacity={0} depthWrite={false} /></lineLoop>)}</group>
    </group>
    <group ref={orbits}>{ringPositions.map((positions, i) => <lineLoop key={i} rotation={[.25 + i * .48, i * .4, .28 + i * .36]}><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry><lineBasicMaterial color={i === 1 ? "#83aeff" : "#a4d8e6"} transparent opacity={.1} depthWrite={false} /></lineLoop>)}</group>
    <group ref={orbitalCraft} rotation={[.28, 0, .35]}>
      <group position={[3.6, 0, .2]} scale={7} rotation={[.5, .8, .2]}><ISSSatellite /></group>
      <group position={[-2.7, 1.5, 1.6]} scale={7}><GenericSatellite /></group>
      <group position={[.3, -1.8, -3.4]} scale={5}><GenericSatellite /></group>
    </group>
    <mesh ref={mars} position={[12, 0, -3]}><sphereGeometry args={[2.05, 80, 64]} /><shaderMaterial vertexShader={marsVertex} fragmentShader={marsFragment} /></mesh>
    <mesh position={[7.1, 1.4, -2.7]}><sphereGeometry args={[.4, 32, 24]} /><meshStandardMaterial color="#8b7c70" roughness={1} flatShading /></mesh>
  </>;
}

class CanvasBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

export default function JourneyCanvas(props: Props) {
  const [ready, setReady] = useState(false);
  const [foreground, setForeground] = useState(true);
  const onReady = useCallback(() => setReady(true), []);
  useEffect(() => {
    const update = () => setForeground(!document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  return <div className={styles.canvasWrap} aria-label="Scroll-controlled 3D journey through Earth, satellite orbits, and Mars">
    <div className={styles.earthPoster} style={{ opacity: ready ? 0 : 1 }} aria-hidden="true" />
    <CanvasBoundary fallback={<div className={styles.earthPoster} />}>
      <Canvas camera={{ position: [0, 1.2, 8.9], fov: 42, near: .1, far: 160 }} dpr={[1, 1.5]}
        onCreated={({ raycaster }) => { raycaster.params.Points.threshold = .09; }}
        frameloop={props.animated && props.visible && foreground ? "always" : "demand"}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power", toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
        fallback={<div className={styles.earthPoster} />}>
        <Suspense fallback={null}><Scene {...props} onReady={onReady} /></Suspense>
      </Canvas>
    </CanvasBoundary>
  </div>;
}
