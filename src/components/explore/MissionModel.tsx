"use client";

import { Component, Suspense, useEffect, useMemo, type ReactNode } from "react";
import { useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { KTX2Loader } from "three-stdlib";
import { Box3, Vector3, type WebGLRenderer } from "three";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
import { spacecraftAsset } from "@/lib/explore/model-assets";
import type { Mission } from "@/lib/explore/missions";
import { SpacecraftModel } from "./SpacecraftModel";

export type ModelStatus = "loading" | "ready" | "fallback";
const textureDecoders = new WeakMap<WebGLRenderer, KTX2Loader>();
function textureDecoder(renderer: WebGLRenderer) {
  let loader = textureDecoders.get(renderer);
  if (!loader) {
    loader = new KTX2Loader().setTranscoderPath("/explore/decoders/basis/").setWorkerLimit(2).detectSupport(renderer);
    textureDecoders.set(renderer, loader);
  }
  return loader;
}
export function releaseModelDecoders(renderer: WebGLRenderer) {
  textureDecoders.get(renderer)?.dispose();
  textureDecoders.delete(renderer);
}

class ModelBoundary extends Component<{ children: ReactNode; fallback: ReactNode; onStatus?: (status: ModelStatus) => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onStatus?.("fallback"); }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

function PublicModel({ url, onStatus }: { url: string; onStatus?: (status: ModelStatus) => void }) {
  const renderer = useThree(state => state.gl);
  const { scene } = useGLTF(url, "/explore/decoders/draco/", true, loader => loader.setKTX2Loader(textureDecoder(renderer)));
  const normalized = useMemo(() => {
    const copy = clone(scene);
    const bounds = new Box3().setFromObject(copy);
    const extent = bounds.getSize(new Vector3());
    const span = Math.max(extent.x, extent.y, extent.z);
    if (!Number.isFinite(span) || span <= 0) throw new Error("Empty spacecraft model");
    copy.position.sub(bounds.getCenter(new Vector3()));
    return { copy, scale: 6 / span };
  }, [scene]);
  useEffect(() => { onStatus?.("ready"); }, [onStatus]);
  // Materials and geometry remain owned by useGLTF's cache; never dispose the shared assets.
  return <group scale={normalized.scale}><primitive object={normalized.copy} dispose={null} /></group>;
}

export function MissionModel({ mission, onStatus }: { mission: Mission; onStatus?: (status: ModelStatus) => void }) {
  const url = spacecraftAsset(mission.target_entity);
  useEffect(() => { if (!url) onStatus?.("fallback"); }, [url, onStatus]);
  const fallback = <SpacecraftModel mission={mission} />;
  return url ? <ModelBoundary key={url} fallback={fallback} onStatus={onStatus}>
    <Suspense fallback={fallback}><PublicModel url={url} onStatus={onStatus} /></Suspense>
  </ModelBoundary> : fallback;
}
