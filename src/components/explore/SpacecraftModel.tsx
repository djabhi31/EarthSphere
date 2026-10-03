"use client";

import { MISSION_SPANS, type Mission } from "@/lib/explore/missions";

function Wing({ x, width = 2.1, depth = 1.7 }: { x: number; width?: number; depth?: number }) {
  return <group position={[x, 0, 0]}>
    <mesh><boxGeometry args={[width, .035, depth]} /><meshStandardMaterial color="#193d75" metalness={.6} roughness={.32} /></mesh>
    {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[(i / 8 - .5) * width, .025, 0]}><boxGeometry args={[.015, .009, depth]} /><meshBasicMaterial color="#668fb4" /></mesh>)}
    {[-.5, 0, .5].map(z => <mesh key={z} position={[0, .026, z * depth]}><boxGeometry args={[width, .009, .01]} /><meshBasicMaterial color="#668fb4" /></mesh>)}
  </group>;
}

export function SpacecraftModel({ mission, comparison = "none" }: { mission: Mission; comparison?: "none" | "person" | "bus" }) {
  const iss = mission.target_entity === "sc_iss";
  const dish = ["sc_smap", "sc_nisar"].includes(mission.target_entity);
  return <group>
    <group rotation={[.14, -.2, .18]}>
      {iss ? <>
        <mesh><boxGeometry args={[5.8, .12, .12]} /><meshStandardMaterial color="#c8d4df" metalness={.6} roughness={.4} /></mesh>
        {[-2.35, -1.35, 1.35, 2.35].map(x => <Wing key={x} x={x} width={.7} depth={2.8} />)}
        {[-.7, 0, .7].map(z => <mesh key={z} position={[0, .2, z]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[.22, .22, .65, 24]} /><meshStandardMaterial color="#e2e6e7" metalness={.45} roughness={.4} /></mesh>)}
        {[-.7, .7].map(x => <mesh key={x} position={[x, .14, 0]}><boxGeometry args={[.4, .04, 1.4]} /><meshStandardMaterial color="#d9e5e9" /></mesh>)}
      </> : <>
        <mesh><boxGeometry args={[.95, 1.15, .85]} /><meshStandardMaterial color="#d0ac65" metalness={.68} roughness={.38} /></mesh>
        <mesh position={[0, -.64, 0]}><cylinderGeometry args={[.25, .35, .18, 32]} /><meshStandardMaterial color="#bfd4de" metalness={.5} roughness={.2} /></mesh>
        <mesh position={[0, -.74, 0]}><cylinderGeometry args={[.18, .18, .03, 32]} /><meshStandardMaterial color="#1e3141" metalness={.9} roughness={.15} /></mesh>
        <mesh><boxGeometry args={[3.6, .05, .06]} /><meshStandardMaterial color="#dce2e8" /></mesh>
        <Wing x={-1.85} /><Wing x={1.85} />
        {dish && <mesh position={[0, 1.25, 0]} rotation={[.4, 0, 0]}><sphereGeometry args={[1.2, 32, 16, 0, Math.PI * 2, 0, .65]} /><meshStandardMaterial color="#a3becb" wireframe transparent opacity={.65} /></mesh>}
        <mesh position={[.15, .76, .05]}><cylinderGeometry args={[.018, .018, .65, 8]} /><meshStandardMaterial color="#e1e6e8" /></mesh>
      </>}
    </group>
    <SizeReference mission={mission} comparison={comparison} />
  </group>;
}

export function SizeReference({ mission, comparison = "none" }: { mission: Mission; comparison?: "none" | "person" | "bus" }) {
  const span = MISSION_SPANS[mission.target_entity];
  const comparisonSize = span ? 6 / span : 0;
  return <>    {comparison !== "none" && !!span && <group position={[0, -2.1, 0]} scale={comparisonSize}>
      {comparison === "bus" ? <group>
        <mesh position={[0, 1.65, 0]}><boxGeometry args={[12, 2.5, 2.5]} /><meshStandardMaterial color="#e8bb5d" roughness={.6} /></mesh>
        <mesh position={[0, 2.15, 1.26]}><boxGeometry args={[10.4, .9, .03]} /><meshStandardMaterial color="#20384b" /></mesh>
        {[-4, 4].flatMap(x => [-1.25, 1.25].map(z => <mesh key={`${x}-${z}`} position={[x, .7, z]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[.65, .65, .24, 20]} /><meshStandardMaterial color="#16212b" /></mesh>))}
      </group> : <group>
        <mesh position={[0, 1.57, 0]}><sphereGeometry args={[.13, 20, 20]} /><meshStandardMaterial color="#c9e6ed" /></mesh>
        <mesh position={[0, 1.1, 0]}><boxGeometry args={[.4, .58, .22]} /><meshStandardMaterial color="#c9e6ed" /></mesh>
        {[-.12, .12].map(x => <mesh key={x} position={[x, .4, 0]}><boxGeometry args={[.14, .8, .18]} /><meshStandardMaterial color="#c9e6ed" /></mesh>)}
        {[-.3, .3].map(x => <mesh key={x} position={[x, 1.04, 0]}><boxGeometry args={[.13, .6, .16]} /><meshStandardMaterial color="#c9e6ed" /></mesh>)}
      </group>}
    </group>}
</>;
}
