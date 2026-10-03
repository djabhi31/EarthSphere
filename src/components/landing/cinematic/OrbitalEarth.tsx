"use client";

import { useEffect, useRef, useState } from "react";
import type { MotionValue } from "motion/react";
import * as THREE from "three";
import styles from "./cinematic.module.css";

export default function OrbitalEarth({ progress, animated }: {
  progress: MotionValue<number>;
  animated: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "low-power" });
    } catch {
      // Keep the CSS planet visible on devices without WebGL.
      return;
    }

    let disposed = false;
    let frame = 0;
    let visible = true;
    let lastTime = 0;
    let rotation = -0.5;
    let pointerX = 0;
    let pointerY = 0;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 40);
    camera.position.z = 7.8;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    const planet = new THREE.Group();
    planet.rotation.z = 0.14;
    scene.add(planet);
    scene.add(new THREE.AmbientLight(0x8ab9f4, 0.32));
    const sunlight = new THREE.DirectionalLight(0xe1eeff, 3.2);
    sunlight.position.set(-4, 3, 5);
    scene.add(sunlight);
    const rimLight = new THREE.DirectionalLight(0x166bff, 1.4);
    rimLight.position.set(3, 1, -3);
    scene.add(rimLight);

    const textures: THREE.Texture[] = [];
    const loader = new THREE.TextureLoader();
    const render = () => {
      if (!disposed) renderer.render(scene, camera);
    };
    const load = (url: string, color = false) => {
      const texture = loader.load(url, () => {
        if (disposed) { texture.dispose(); return; }
        render();
        if (color) setReady(true);
      });
      if (color) texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 4);
      textures.push(texture);
      return texture;
    };
    const surface = new THREE.Mesh(
      new THREE.SphereGeometry(2.18, 80, 64),
      new THREE.MeshPhongMaterial({
        map: load("/textures/earth-blue-marble.jpg", true),
        bumpMap: load("/textures/earth-topology.png"),
        bumpScale: 0.018,
        specularMap: load("/textures/earth-water.png"),
        specular: new THREE.Color(0x172735),
        shininess: 35,
      }),
    );
    planet.add(surface);
    const clouds = new THREE.Mesh(
      new THREE.SphereGeometry(2.197, 64, 48),
      new THREE.MeshPhongMaterial({
        map: load("/textures/earth-clouds.png"),
        transparent: true,
        opacity: 0.28,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    planet.add(clouds);

    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(2.215, 64, 48),
      new THREE.ShaderMaterial({
        vertexShader: `varying vec3 vNormal; varying vec3 vPosition;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vec4 p = modelViewMatrix * vec4(position, 1.0);
            vPosition = p.xyz;
            gl_Position = projectionMatrix * p;
          }`,
        fragmentShader: `varying vec3 vNormal; varying vec3 vPosition;
          void main() {
            float rim = pow(1.0 - max(dot(normalize(vNormal), normalize(-vPosition)), 0.0), 4.0);
            gl_FragColor = vec4(0.16, 0.48, 1.0, rim * 0.75);
          }`,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    planet.add(atmosphere);
    surface.rotation.y = rotation;
    clouds.rotation.y = rotation;

    const resize = () => {
      if (disposed) return;
      const { width, height } = canvas.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      render();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    const tick = (time: number) => {
      frame = 0;
      if (disposed || !visible || document.hidden || !animated) return;
      const delta = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;
      rotation += delta * 0.028;
      const scroll = progress.get();
      surface.rotation.y = rotation + scroll * 0.55;
      clouds.rotation.y = rotation * 1.08 + scroll * 0.58;
      planet.rotation.x = THREE.MathUtils.lerp(planet.rotation.x, pointerY * 0.045 + scroll * 0.1, 0.025);
      planet.rotation.z = THREE.MathUtils.lerp(planet.rotation.z, 0.14 + pointerX * 0.025, 0.025);
      render();
      frame = requestAnimationFrame(tick);
    };
    const resume = () => {
      if (!frame && visible && !document.hidden && animated && !disposed) {
        lastTime = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) { cancelAnimationFrame(frame); frame = 0; }
      else resume();
    }, { rootMargin: "100px" });
    intersection.observe(canvas);
    const visibility = () => {
      if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
      else resume();
    };
    const pointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !visible) return;
      pointerX = event.clientX / window.innerWidth - 0.5;
      pointerY = event.clientY / window.innerHeight - 0.5;
    };
    const contextLost = (event: Event) => {
      event.preventDefault();
      cancelAnimationFrame(frame);
      frame = 0;
      setReady(false);
    };
    const contextRestored = () => { render(); setReady(true); resume(); };
    canvas.addEventListener("webglcontextlost", contextLost);
    canvas.addEventListener("webglcontextrestored", contextRestored);
    document.addEventListener("visibilitychange", visibility);
    if (animated) window.addEventListener("pointermove", pointer, { passive: true });
    resize();
    resume();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      intersection.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("pointermove", pointer);
      canvas.removeEventListener("webglcontextlost", contextLost);
      canvas.removeEventListener("webglcontextrestored", contextRestored);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material: THREE.Material) => material.dispose());
        }
      });
      textures.forEach((texture) => texture.dispose());
      renderer.dispose();
    };
  }, [animated, progress]);

  return <>
    <div className={styles.planetFallback} style={{ opacity: ready ? 0 : 1 }} />
    <canvas ref={canvasRef} className={styles.earthCanvas} style={{ opacity: ready ? 1 : 0 }} aria-hidden="true" />
  </>;
}
