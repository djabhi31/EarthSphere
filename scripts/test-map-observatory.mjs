import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire, Module } from 'node:module';
import { test } from 'node:test';
import ts from 'typescript';

const require = createRequire(import.meta.url);
Module._extensions['.ts'] = (module, filename) => {
  const { outputText } = ts.transpileModule(readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } });
  module._compile(outputText, filename);
};
const { geometryPoint, observationsAt, rangeDates, shiftDate, dailyActivity, observationTrack, geographicBounds, nightGeometry, safeMapLink, distanceKm, recordedMovement } = require('../src/lib/map-observatory.ts');
const { solarPoint } = require('../src/lib/explore/astronomy.ts');
const { mapStyle } = require('../src/components/map/observatory/map-style.ts');
const { validateStyleMin } = require('@maplibre/maplibre-gl-style-spec');
const geometry = (date, point, type = 'Point') => ({ date, type, coordinates: point, magnitudeValue: null, magnitudeUnit: null });
const event = (overrides = {}) => ({ id: 'EONET_01', title: 'Pacific storm', closed: null, categories: [{ id: 'severeStorms', title: 'Severe Storms' }], sources: [], link: 'https://eonet.gsfc.nasa.gov/api/v3/events/EONET_01', description: null, geometry: [geometry('2026-10-01T01:00:00Z', [120, 20]), geometry('2026-10-03T23:59:59Z', [124, 24]), geometry('2026-10-04T01:00:00Z', [125, 25])], ...overrides });
const range = { start: '2026-10-01', end: '2026-10-04' };

test('archive selection uses the last observation on the selected UTC day, never a future position', () => {
  assert.deepEqual(observationsAt([event()], range, '2026-10-03', 'all')[0].point, [124, 24]);
  assert.deepEqual(observationsAt([event()], range, '2026-10-02', 'all')[0].point, [120, 20]);
  assert.equal(observationsAt([event()], range, '2026-09-30', 'all').length, 0);
  assert.deepEqual(observationsAt([event()], { ...range, end: '2026-10-03' }, '2026-10-05', 'all')[0].point, [124, 24]);
});
test('event status is historical and all map/list filters combine consistently', () => {
  const closed = event({ closed: '2026-10-04T00:00:00Z' });
  assert.equal(observationsAt([closed], range, '2026-10-03', 'open').length, 1);
  assert.equal(observationsAt([closed], range, '2026-10-04', 'open').length, 0);
  assert.equal(observationsAt([closed], range, '2026-10-04', 'closed', ['severeStorms'], ' PACIFIC ').length, 1);
  assert.equal(observationsAt([closed], range, '2026-10-04', 'closed', ['wildfires'], 'Pacific').length, 0);
  assert.equal(observationsAt([closed], range, '2026-10-04', 'closed', [], 'unrelated').length, 0);
  assert.equal(observationsAt([closed], range, '2026-10-04', 'all', [], 'EONET_01').length, 1);
});
test('coordinates stay in longitude/latitude order and malformed records never become map markers', () => {
  assert.deepEqual(geometryPoint(geometry('', [80, 30, 100])), [80, 30]);
  for (const point of [[200, 20], [20, 97], [NaN, 10], [null, 4], [], ['20', 5]]) assert.equal(geometryPoint(geometry('', point)), null);
  const bad = event({ geometry: [geometry('2026-10-04T00:00:00Z', [20, 97]), geometry('invalid', [0, 0])] });
  assert.deepEqual(observationsAt([bad], range, range.end, 'all'), []);
});
test('a polygon crossing the antimeridian is represented in the Pacific rather than at Greenwich', () => {
  const point = geometryPoint(geometry('', [[[179, 10], [-179, 10], [-179, 12], [179, 12], [179, 10]]], 'Polygon'));
  assert.equal(Math.abs(point[0]), 180);
  assert.equal(point[1], 11);
  assert.equal(geometryPoint(geometry('', [], 'Polygon')), null);
});
test('date ranges include both boundaries, leap days and reject malformed or unbounded windows', () => {
  assert.deepEqual(rangeDates({ start: '2024-02-28', end: '2024-03-01' }), ['2024-02-28', '2024-02-29', '2024-03-01']);
  for (const bad of [{ start: '2026-02-29', end: '2026-03-01' }, { start: '2026-10-04', end: '2026-10-01' }, { start: '2024-01-01', end: '2026-10-04' }, { start: '', end: '' }]) assert.deepEqual(rangeDates(bad), []);
  assert.equal(shiftDate('2026-01-01', -1), '2025-12-31');
});
test('daily activity counts distinct events per day and excludes invalid coordinates', () => {
  const a = event({ geometry: [geometry('2026-10-01T01:00:00Z', [0, 0]), geometry('2026-10-01T23:59:59Z', [1, 1]), geometry('2026-10-02T01:00:00Z', [1, 91])] });
  const b = event({ id: 'EONET_02', geometry: [geometry('2026-10-03T12:00:00Z', [2, 2])] });
  assert.deepEqual(dailyActivity([a, b], rangeDates(range)), [1, 0, 1, 0]);
});
test('observation trails exclude future locations and split at the antimeridian', () => {
  const moving = event({ geometry: [geometry('2026-10-01T01:00:00Z', [177, 10]), geometry('2026-10-01T02:00:00Z', [179, 11]), geometry('2026-10-02T01:00:00Z', [-179, 12]), geometry('2026-10-03T01:00:00Z', [-177, 13]), geometry('2026-10-04T01:00:00Z', [-170, 14])] });
  const track = observationTrack(moving, range, '2026-10-03');
  assert.deepEqual(track.features.map(f => f.geometry.coordinates), [[[177, 10], [179, 11]], [[-179, 12], [-177, 13]]]);
});
test('fit bounds take the shortest longitude span and remain valid at both poles', () => {
  assert.deepEqual(geographicBounds([]), null);
  const across = geographicBounds([[179, 10], [-179, 20]]);
  assert.equal(across[1][0] - across[0][0], 2);
  assert.deepEqual(geographicBounds([[10, 90]]), [[10, 85], [10, 85]]);
  assert.deepEqual(geographicBounds([[10, -90]]), [[10, -85], [10, -85]]);
});
test('distance and movement use valid historical positions, including a dateline crossing', () => {
  assert.equal(distanceKm([0, 0], [0, 0]), 0);
  assert.ok(Math.abs(distanceKm([179, 0], [-179, 0]) - 222.39) < .1);
  const moving = event({ geometry: [geometry('2026-10-03T00:00:00Z', [-179, 0]), geometry('2026-10-01T00:00:00Z', [179, 0]), geometry('2026-10-04T00:00:00Z', [-150, 0]), geometry('invalid', [0, 0])] });
  const result = recordedMovement(moving, '2026-10-03');
  assert.equal(result.count, 2);
  assert.equal(result.durationHours, 48);
  assert.ok(Math.abs(result.km - 222.39) < .1);
  assert.equal(recordedMovement(moving, '2026-10-01'), null);
});
test('night boundary is geographic, follows the Sun and shades the correct seasonal pole', () => {
  const rad = Math.PI / 180;
  for (const date of ['2026-06-21T12:00:00Z', '2026-12-21T00:00:00Z', '2026-03-20T18:00:00Z']) {
    const time = Date.parse(date), sun = solarPoint(time), polygon = nightGeometry(time).features[0].geometry.coordinates[0];
    assert.deepEqual(polygon[0], polygon.at(-1));
    assert.equal(polygon[0][1], sun.latitude > 0 ? -90 : 90);
    for (const [lon, lat] of polygon.slice(1, -2)) {
      assert.ok(Number.isFinite(lon) && Number.isFinite(lat));
      const illumination = Math.sin(lat * rad) * Math.sin(sun.latitude * rad) + Math.cos(lat * rad) * Math.cos(sun.latitude * rad) * Math.cos((lon - sun.longitude) * rad);
      assert.ok(Math.abs(illumination) < 1e-5, `boundary is not on the terminator at ${lon}, ${lat}`);
    }
  }
});
test('external event sources only accept ordinary HTTP(S) links without credentials', () => {
  assert.equal(safeMapLink('https://eonet.gsfc.nasa.gov/api/v3/events'), 'https://eonet.gsfc.nasa.gov/api/v3/events');
  for (const link of ['javascript:alert(1)', 'data:text/html,hi', '/relative', 'https://user:secret@example.com']) assert.equal(safeMapLink(link), null);
});
test('each selectable basemap conforms to MapLibre’s style specification', () => {
  for (const mode of ['satellite', 'dark', 'terrain']) assert.deepEqual(validateStyleMin(mapStyle(mode)), []);
});
