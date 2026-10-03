"use client";

import { Component, Suspense, useEffect, useImperativeHandle, useMemo, useRef, type ReactNode, type Ref } from "react";
import { Canvas, useFrame, useLoader, useThree, type ThreeEvent } from "@react-three/fiber";
import { Environment, Html, Lightformer, Line, OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { EARTH_KM, cameraFlightStep, geographicVector, orbitPath, propagatedPosition, solarPoint, vectorGeographic, type GeoPoint } from "@/lib/explore/astronomy";
import { type Mission, MISSION_SPANS, NORAD_IDS } from "@/lib/explore/missions";
import { globeDistance, missionColor } from "@/lib/explore/model-assets";
import { earthFragment, earthVertex } from "@/lib/explore/earth-shaders";
import type { TLESatellite } from "@/lib/types/nasa";
import type { Observation } from "./useExplorerData";
import { SizeReference } from "./SpacecraftModel";
import { MissionModel, releaseModelDecoders, type ModelStatus } from "./MissionModel";
import styles from "./explorer-console.module.css";

export type SceneCommands = { flyTo: (point: GeoPoint, distance?: number) => void; rotate: (latitude: number, longitude: number) => void; zoom: (factor: number) => void; reset: () => void; snapshot: () => void };
export type GlobeEvent = { id: string; title: string; point: GeoPoint; color: string; date: string };
type Props = {
  apiRef: Ref<SceneCommands>; time: number; playing: boolean; reduced: boolean;
  missions: Mission[]; records: Record<number, TLESatellite>; selectedMission: Mission | null; follow: boolean;
  observation?: Observation; opacity: number; showSatellites: boolean; showOrbits: boolean; showGroundTrack: boolean;
  showCities: boolean; showGrid: boolean; dayNight: boolean; autoRotate: boolean;
  events: GlobeEvent[]; selectedEvent: string | null;
  inspector: boolean; comparison: "none" | "person" | "bus";
  onMission: (mission: Mission) => void; onEvent: (id: string) => void; onPoint: (point: GeoPoint) => void;
  onReady: () => void; onError: (message: string) => void;
  onModelStatus: (status: ModelStatus) => void;
  onInteract: () => void;
};

class SceneBoundary extends Component<{ children: ReactNode; onError: (message: string) => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError("The 3D renderer could not start. Enable WebGL in your browser, then reload the scene."); }
  render() { return this.state.failed ? <div className={styles.sceneFallback}><span>3D view unavailable</span><p>The data panels and archive remain available.</p></div> : this.props.children; }
}
const CITIES: [string, number, number][] = [["New York", 40.7, -74], ["London", 51.5, -.12], ["New Delhi", 28.6, 77.2], ["Tokyo", 35.7, 139.7], ["Sydney", -33.9, 151.2], ["Cape Town", -33.9, 18.4], ["São Paulo", -23.5, -46.6], ["Singapore", 1.3, 103.8], ["Los Angeles", 34, -118.2], ["Cairo", 30, 31.2]];
function starPositions() {
  let seed = 12345;
  const random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const points = new Float32Array(750 * 3);
  for (let i = 0; i < points.length; i += 3) { const y = random() * 2 - 1, angle = random() * Math.PI * 2, radius = 25 + random() * 35; points.set([Math.sqrt(1 - y * y) * Math.cos(angle) * radius, y * radius, Math.sqrt(1 - y * y) * Math.sin(angle) * radius], i); }
  return points;
}

function Earth({ observation, opacity, showGrid, showCities, dayNight, time, onPoint }: Pick<Props, "observation" | "opacity" | "showGrid" | "showCities" | "dayNight" | "time" | "onPoint">) {
  const [source, water, clouds, nightSource] = useLoader(THREE.TextureLoader, ["/textures/earth-blue-marble.jpg", "/textures/earth-water.png", "/textures/earth-clouds.png", "/textures/explore/earth-night.webp"]);
  const map = useMemo(() => { const texture = source.clone(); texture.colorSpace = THREE.SRGBColorSpace; texture.anisotropy = 8; texture.needsUpdate = true; return texture; }, [source]);
  useEffect(() => () => map.dispose(), [map]);
  const nightMap = useMemo(() => { const texture = nightSource.clone(); texture.colorSpace = THREE.SRGBColorSpace; texture.anisotropy = 8; texture.needsUpdate = true; return texture; }, [nightSource]);
  useEffect(() => () => nightMap.dispose(), [nightMap]);
  const overlay = useMemo(() => { if (!observation) return null; const texture = new THREE.CanvasTexture(observation.canvas); texture.colorSpace = THREE.SRGBColorSpace; texture.anisotropy = 4; return texture; }, [observation]);
  useEffect(() => () => overlay?.dispose(), [overlay]);
  const sun = solarPoint(time);
  const position = geographicVector(sun.latitude, sun.longitude, 10);
  const surface = { uDay: { value: map }, uNight: { value: nightMap }, uWater: { value: water }, uSun: { value: new THREE.Vector3(...position).normalize() }, uSunlight: { value: dayNight ? 1 : 0 } };
  const onClick = (event: ThreeEvent<MouseEvent>) => { if (event.delta > 5) return; event.stopPropagation(); onPoint(vectorGeographic(event.point.x, event.point.y, event.point.z)); };
  const grid = useMemo(() => {
    const lines: [number, number, number][][] = [];
    for (let latitude = -60; latitude <= 60; latitude += 30) lines.push(Array.from({ length: 181 }, (_, i) => geographicVector(latitude, -180 + i * 2, 1.007)));
    for (let longitude = -180; longitude < 180; longitude += 30) lines.push(Array.from({ length: 91 }, (_, i) => geographicVector(-90 + i * 2, longitude, 1.007)));
    return lines;
  }, []);
  return <>
    <ambientLight intensity={dayNight ? .09 : 1.7} />
    <directionalLight position={position} intensity={dayNight ? 2.2 : .7} color="#f1f6ff" />
    <mesh onClick={onClick}>
      <sphereGeometry args={[1, 128, 96]} />
      <shaderMaterial uniforms={surface} vertexShader={earthVertex} fragmentShader={earthFragment} />
    </mesh>
    {overlay && <mesh onClick={onClick}><sphereGeometry args={[1.003, 128, 96]} /><meshBasicMaterial map={overlay} transparent opacity={opacity} depthWrite={false} /></mesh>}
    {!overlay && <mesh><sphereGeometry args={[1.004, 96, 64]} /><meshPhongMaterial color="#f6f9ff" alphaMap={clouds} transparent opacity={.48} depthWrite={false} /></mesh>}
    <mesh scale={1.014}>
      <sphereGeometry args={[1, 96, 64]} />
      <shaderMaterial transparent depthWrite={false} side={THREE.BackSide} blending={THREE.AdditiveBlending}
        vertexShader="varying vec3 vN; varying vec3 vP; void main(){vN=normalize(normalMatrix*normal);vec4 p=modelViewMatrix*vec4(position,1.0);vP=p.xyz;gl_Position=projectionMatrix*p;}"
        fragmentShader="varying vec3 vN; varying vec3 vP; void main(){float rim=pow(1.0-abs(dot(normalize(vN),normalize(-vP))),4.6);gl_FragColor=vec4(.22,.48,1.0,rim*.55);}" />
    </mesh>
    {showGrid && grid.map((line, i) => <Line key={i} points={line} lineWidth={.5} color="#b4d4e6" transparent opacity={.2} />)}
    {showCities && CITIES.map(([name, lat, lon]) => <Html key={name} position={geographicVector(lat, lon, 1.012)} center occlude zIndexRange={[3, 0]}><span className={styles.city}>{name}</span></Html>)}
  </>;
}

function SatelliteMarker({ mission, tle, time, selected, reduced, onClick }: { mission: Mission; tle: TLESatellite; time: number; selected: boolean; reduced: boolean; onClick: () => void }) {
  const group = useRef<THREE.Group>(null);
  const { invalidate } = useThree();
  const position = propagatedPosition(tle, time);
  useFrame((_, delta) => {
    if (!position || !group.current) return;
    const target = geographicVector(position.latitude, position.longitude, 1 + position.altitude / EARTH_KM);
    if (group.current.position.length() < .5) group.current.position.set(...target);
    else group.current.position.set(...cameraFlightStep(group.current.position.toArray(), target, reduced ? 1 : 1 - Math.exp(-delta * 14)));
    group.current.lookAt(0, 0, 0);
    if (Math.hypot(...target.map((value, i) => value - group.current!.position.getComponent(i))) > .00001) invalidate();
  });
  if (!position) return null;
  return <group ref={group}>
    <group scale={selected ? .027 : .021} rotation={[.5, .3, .35]} onClick={event => { event.stopPropagation(); onClick(); }}>
      {selected ? <MissionModel mission={mission} /> : <>
        <mesh><boxGeometry args={[.85, 1.1, .85]} /><meshStandardMaterial color="#d7b76b" metalness={.55} roughness={.45} /></mesh>
        <mesh><boxGeometry args={[5.7, .045, .07]} /><meshStandardMaterial color="#d3dce5" metalness={.3} roughness={.5} /></mesh>
        {[-1.8, 1.8].map(x => <mesh key={x} position={[x, 0, 0]}><boxGeometry args={[2.5, .045, mission.target_entity === "sc_iss" ? 2.7 : 1.3]} /><meshStandardMaterial color="#426aa8" metalness={.3} roughness={.48} /></mesh>)}
      </>}
    </group>
    <Html center position={[.06, .055, 0]} occlude zIndexRange={[4, 0]}><button style={{ color: selected ? "#ffedbe" : missionColor(mission) }} className={`${styles.satelliteTag} ${selected ? styles.tagSelected : ""}`} onClick={onClick}>{mission.title}</button></Html>
  </group>;
}

function Controls(props: Props) {
  const { onError, inspector, time } = props;
  const { camera, gl, scene, invalidate, size } = useThree();
  const controls = useRef<OrbitControlsImpl>(null);
  const destination = useRef<THREE.Vector3 | null>(null);
  const initial = useMemo(() => new THREE.Vector3(...geographicVector(17, -88, globeDistance(size.width, size.height))), [size.width, size.height]);
  const inspectionPosition = useMemo(() => new THREE.Vector3(5, 3, 9).normalize().multiplyScalar(3.4 * globeDistance(size.width, size.height, 44)), [size.width, size.height]);
  const previousFollow = useRef(false);
  useEffect(() => { camera.position.copy(inspector ? inspectionPosition : initial); camera.lookAt(0, 0, 0); controls.current?.target.set(0, 0, 0); controls.current?.update(); destination.current = null; invalidate(); }, [camera, inspector, initial, inspectionPosition, invalidate]);
  useEffect(() => {
    const loss = (event: Event) => { event.preventDefault(); onError("The browser lost its graphics context. Reload the scene to reconnect."); };
    gl.domElement.addEventListener("webglcontextlost", loss);
    return () => gl.domElement.removeEventListener("webglcontextlost", loss);
  }, [gl, onError]);
  useImperativeHandle(props.apiRef, () => ({
    flyTo: (point, distance = 2.55) => { destination.current = new THREE.Vector3(...geographicVector(point.latitude, point.longitude, distance)); invalidate(); },
    rotate: (latitude, longitude) => { const current = vectorGeographic(camera.position.x, camera.position.y, camera.position.z); destination.current = new THREE.Vector3(...geographicVector(Math.max(-85, Math.min(85, current.latitude + latitude)), current.longitude + longitude, camera.position.length())); invalidate(); },
    zoom: factor => { destination.current = camera.position.clone().normalize().multiplyScalar(THREE.MathUtils.clamp(camera.position.length() * factor, inspector ? 4 : 1.15, inspector ? 60 : 16)); invalidate(); },
    reset: () => { controls.current?.target.set(0, 0, 0); destination.current = inspector ? inspectionPosition.clone() : initial.clone(); invalidate(); },
    snapshot: () => {
      try { gl.render(scene, camera); const canvas = document.createElement("canvas"); canvas.width = gl.domElement.width; canvas.height = gl.domElement.height + 48; const context = canvas.getContext("2d"); if (!context) return; context.fillStyle = "#03070d"; context.fillRect(0, 0, canvas.width, canvas.height); context.drawImage(gl.domElement, 0, 0); context.fillStyle = "#b8cbe0"; context.font = "12px sans-serif"; context.fillText(`EarthSphere · NASA / JPL data · ${new Date(time).toISOString()}`, 18, canvas.height - 19); const link = document.createElement("a"); link.download = `earthsphere-${new Date(time).toISOString().slice(0, 10)}.png`; link.href = canvas.toDataURL("image/png"); link.click(); } catch { onError("The browser could not export this view."); }
    },
  }), [camera, gl, scene, initial, inspectionPosition, invalidate, inspector, time, onError]);
  useFrame((_, delta) => {
    if (destination.current) {
      camera.position.set(...cameraFlightStep(camera.position.toArray(), destination.current.toArray(), props.reduced ? 1 : 1 - Math.exp(-delta * 5)));
      controls.current?.update();
      if (camera.position.distanceTo(destination.current) < .003) destination.current = null;
      else invalidate();
    }
    if (!inspector && props.follow && props.selectedMission) {
      const tle = props.records[NORAD_IDS[props.selectedMission.target_entity]];
      const point = tle && propagatedPosition(tle, time);
      if (point) { const target = geographicVector(point.latitude, point.longitude, Math.max(2.5 + point.altitude / EARTH_KM, camera.position.length())); camera.position.set(...cameraFlightStep(camera.position.toArray(), target, props.reduced ? 1 : 1 - Math.exp(-delta * (previousFollow.current ? 8 : 3)))); controls.current?.update(); }
    }
    previousFollow.current = props.follow;
  });
  const perspective = camera as THREE.PerspectiveCamera;
  useEffect(() => { const fov = inspector ? 44 : 42; perspective.setFocalLength(perspective.getFilmHeight() / (2 * Math.tan(fov * Math.PI / 360))); invalidate(); }, [perspective, inspector, invalidate]);
  return <OrbitControls ref={controls} enablePan={false} enableDamping={!props.reduced} dampingFactor={.08} rotateSpeed={.55} zoomSpeed={.75} minDistance={inspector ? 4 : 1.15} maxDistance={inspector ? 60 : 16} autoRotate={props.autoRotate && !props.follow && !props.reduced} autoRotateSpeed={.3} onStart={() => { destination.current = null; props.onInteract(); }} />;
}

function Inspection({ mission, comparison, onStatus }: { mission: Mission; comparison: Props["comparison"]; onStatus: Props["onModelStatus"] }) {
  const span = MISSION_SPANS[mission.target_entity];
  const referenceWidth = comparison !== "none" && span ? (comparison === "bus" ? 12 : .8) * 6 / span : 0;
  const scale = referenceWidth ? 7.4 / (6.6 + referenceWidth) : 1;
  return <group scale={scale}>
    <group position={[referenceWidth ? -(referenceWidth + .6) / 2 : 0, 0, 0]}><MissionModel key={mission.target_entity} mission={mission} onStatus={onStatus} /></group>
    {!!referenceWidth && <group position={[3.3, 0, 0]}><SizeReference mission={mission} comparison={comparison} /></group>}
  </group>;
}

function Contents(props: Props) {
  const { time, inspector, onReady } = props;
  const renderer = useThree(state => state.gl);
  const stars = useMemo(() => starPositions(), []);
  const uniqueMissions = props.missions.filter((mission, index, all) => NORAD_IDS[mission.target_entity] === 25544 ? mission.target_entity === "sc_iss" : NORAD_IDS[mission.target_entity] && all.findIndex(other => NORAD_IDS[other.target_entity] === NORAD_IDS[mission.target_entity]) === index);
  const minute = Math.floor(time / 60000) * 60000;
  const selectedId = props.selectedMission ? NORAD_IDS[props.selectedMission.target_entity] : undefined;
  const tracks = useMemo(() => Object.entries(props.records).filter(([id]) => props.showOrbits || Number(id) === selectedId).map(([id, tle]) => ({ id: Number(id), orbit: orbitPath(tle, minute), ground: Number(id) === selectedId && props.showGroundTrack ? orbitPath(tle, minute, true) : [] })), [props.records, props.showOrbits, selectedId, minute, props.showGroundTrack]);
  useEffect(() => onReady(), [onReady]);
  useEffect(() => () => releaseModelDecoders(renderer), [renderer]);
  return <>
    <color attach="background" args={["#000000"]} />
    <points><bufferGeometry><bufferAttribute attach="attributes-position" args={[stars, 3]} /></bufferGeometry><pointsMaterial color="#acbad1" size={.018} sizeAttenuation transparent opacity={.42} /></points>
    {inspector && props.selectedMission ? <>
      <ambientLight intensity={1.5} /><directionalLight position={[4, 7, 5]} intensity={3} color="#c8e2ff" /><directionalLight position={[-6, -3, 2]} intensity={2} color="#c99859" />
      <Environment resolution={64}><Lightformer intensity={3} color="white" position={[0, 6, 3]} scale={[10, 8, 1]} /><Lightformer intensity={2} color="#a5cfff" position={[-6, 1, 2]} rotation={[0, Math.PI / 2, 0]} scale={[8, 5, 1]} /><Lightformer intensity={1} color="#efd6ae" position={[4, -3, -4]} scale={[7, 7, 1]} /></Environment>
      <Inspection mission={props.selectedMission} comparison={props.comparison} onStatus={props.onModelStatus} />
    </> : <>
      <Earth {...props} />
      {props.showSatellites && uniqueMissions.map(mission => { const tle = props.records[NORAD_IDS[mission.target_entity]]; return tle && <SatelliteMarker key={mission.target_entity} mission={mission} tle={tle} time={time} reduced={props.reduced} selected={NORAD_IDS[mission.target_entity] === selectedId} onClick={() => props.onMission(mission)} />; })}
      {props.showSatellites && tracks.map(track => <group key={track.id}>
        {track.orbit.length > 1 && <Line points={track.orbit} lineWidth={track.id === selectedId ? 1.2 : .55} color={track.id === selectedId ? "#ffdfa2" : missionColor(uniqueMissions.find(mission => NORAD_IDS[mission.target_entity] === track.id))} transparent opacity={track.id === selectedId ? .85 : .33} />}
        {track.ground.length > 1 && <Line points={track.ground} lineWidth={1} color="#e8c681" transparent opacity={.7} dashed dashSize={.016} gapSize={.008} />}
      </group>)}
      {props.events.map(event => <mesh key={event.id} position={geographicVector(event.point.latitude, event.point.longitude, 1.012)} onClick={pointer => { pointer.stopPropagation(); props.onEvent(event.id); }}><sphereGeometry args={[props.selectedEvent === event.id ? .016 : .009, 12, 12]} /><meshBasicMaterial color={event.color} /></mesh>)}
    </>}
    <Controls {...props} />
  </>;
}

export default function ExplorerScene(props: Props) {
  return <SceneBoundary onError={props.onError}><Canvas camera={{ position: geographicVector(22, 40, 3.65), fov: 42, near: .005, far: 120 }} dpr={[1, 1.7]} gl={{ antialias: true, alpha: false, preserveDrawingBuffer: true }} frameloop={(!props.inspector && props.playing) || props.autoRotate || props.follow ? "always" : "demand"} aria-label="Interactive 3D Earth. Use the adjacent controls to rotate, zoom, and select observations."><Suspense fallback={null}><Contents {...props} /></Suspense></Canvas></SceneBoundary>;
}
