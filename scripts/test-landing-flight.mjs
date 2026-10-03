import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import ts from 'typescript';
import * as THREE from 'three';

const source = await readFile(new URL('../src/components/landing/journey/flight.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } });
const { sampleFlight, eventCoordinates, geographicPoint, CHAPTERS } = await import(`data:text/javascript;base64,${Buffer.from(compiled.outputText).toString('base64')}`);

test('the complete forward and reverse flight clears Earth and Mars on desktop and mobile', () => {
  for (const mobile of [false, true]) {
    for (let i = 0; i <= 1000; i++) {
      const p = i / 1000, frame = sampleFlight(p, mobile);
      assert.ok([...frame.position, ...frame.target, frame.rotation].every(Number.isFinite));
      const camera = new THREE.Vector3(...frame.position);
      assert.ok(camera.length() > 2.65, `Earth clipping at ${p}`);
      assert.ok(camera.distanceTo(new THREE.Vector3(12, 0, -3)) > 2.35, `Mars clipping at ${p}`);
      const reverse = sampleFlight(1 - (1 - p), mobile);
      assert.ok(camera.distanceTo(new THREE.Vector3(...reverse.position)) < 1e-10);
    }
  }
});

test('camera positions and aim remain continuous at every chapter boundary', () => {
  for (const mobile of [false, true]) {
    for (let i = 1; i < CHAPTERS.length - 1; i++) {
      const a = sampleFlight(i / 5 - 1e-6, mobile), b = sampleFlight(i / 5 + 1e-6, mobile);
      assert.ok(new THREE.Vector3(...a.position).distanceTo(new THREE.Vector3(...b.position)) < .001);
      assert.ok(new THREE.Vector3(...a.target).distanceTo(new THREE.Vector3(...b.target)) < .001);
    }
  }
});

test('each destination remains in the camera view at its chapter stop', () => {
  for (const [width, height] of [[1440, 900], [1280, 720], [390, 844], [320, 740]]) {
    for (let i = 0; i < 6; i++) {
      const frame = sampleFlight(i / 5, width < 700);
      const camera = new THREE.PerspectiveCamera(42, width / height, .1, 160);
      camera.position.set(...frame.position); camera.lookAt(...frame.target); camera.updateMatrixWorld();
      const center = new THREE.Vector3(...(i === 3 ? [12, 0, -3] : [0, 0, 0])).project(camera);
      assert.ok(Math.abs(center.x) < 1 && Math.abs(center.y) < 1, `World outside view: chapter ${i}, ${width}×${height}`);
    }
  }
});

test('invalid progress clamps to safe endpoints', () => {
  assert.deepEqual(sampleFlight(-1), sampleFlight(0));
  assert.deepEqual(sampleFlight(4), sampleFlight(1));
  assert.deepEqual(sampleFlight(NaN), sampleFlight(0));
});

test('event focus uses the newest valid point without mutating or trusting geometry order', () => {
  const event = { geometry: [
    { type: 'Point', date: '2026-10-03', coordinates: [30, 10] },
    { type: 'Point', date: '2026-10-04', coordinates: [NaN, 100] },
    { type: 'Point', date: '2026-09-01', coordinates: [90, 30] },
    { type: 'Polygon', date: '2026-10-05', coordinates: [[[1, 2], [3, 4]]] },
  ] };
  const before = structuredClone(event);
  assert.deepEqual(eventCoordinates(event), [30, 10]);
  assert.deepEqual(event, before);
  assert.equal(eventCoordinates({ geometry: [] }), null);
  assert.equal(eventCoordinates({ geometry: [{ type: 'Point', date: '2026-10-03', coordinates: [190, 10] }] }), null);
});

test('geographic markers align with the project’s Earth texture convention', () => {
  assert.deepEqual(geographicPoint(0, 0, 1), [1, 0, -0]);
  const west = geographicPoint(-90, 0, 1);
  assert.ok(Math.abs(west[0]) < 1e-10 && west[2] === 1);
  const north = geographicPoint(0, 90, 1);
  assert.ok(Math.abs(north[0]) < 1e-10 && north[1] === 1);
});
