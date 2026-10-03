import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire, Module } from 'node:module';
import { test } from 'node:test';
import ts from 'typescript';

const require = createRequire(import.meta.url);
Module._extensions['.ts'] = (module, filename) => {
  const source = readFileSync(filename, 'utf8');
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } });
  module._compile(outputText, filename);
};
const { availableDates, nearestDate, validDate, rawRasterUrl, gibsGlobeUrl, gibsCalendar, decodeMeasurement, formatMeasurement, SCIENCE_LAYERS, DATASETS, paletteColor } = require('../src/lib/explore/science.ts');
const { geographicVector, vectorGeographic, solarPoint, tleEpoch, propagatedPosition, orbitPath, cameraFlightStep } = require('../src/lib/explore/astronomy.ts');
const { missionStatus, missionUrl, plainText, parseCelestrakElements, NORAD_IDS } = require('../src/lib/explore/missions.ts');
const { globeDistance, spacecraftAsset, missionThumbnail } = require('../src/lib/explore/model-assets.ts');
const dataset = id => DATASETS.find(item => item.id === id);

test('the globe fits the narrowest viewport axis in portrait, landscape and desktop views', () => {
  for (const [width, height] of [[1440, 650], [768, 750], [390, 620], [320, 530], [844, 240]]) {
    const distance = globeDistance(width, height);
    const angularRadius = Math.asin(1 / distance);
    const projectedRadius = Math.tan(angularRadius) / Math.tan(42 * Math.PI / 360);
    assert.ok(projectedRadius <= .780001, `vertical crop at ${width}x${height}`);
    assert.ok(projectedRadius / (width / height) <= .820001, `horizontal crop at ${width}x${height}`);
    assert.ok(distance > 1.15 && distance < 16);
  }
});

test('spacecraft asset selection never turns untrusted mission metadata into an arbitrary URL', () => {
  assert.equal(spacecraftAsset('sc_aqua'), 'https://eyes.nasa.gov/assets/static/models/sc_aqua/Aqua.gltf');
  assert.equal(spacecraftAsset('sc_iss_emit'), null);
  assert.equal(spacecraftAsset('../../private'), null);
  assert.equal(missionThumbnail({ thumb_name: 'https://example.com/track' }), null);
  assert.equal(missionThumbnail({ thumb_name: '../secret' }), null);
  assert.equal(missionThumbnail({ thumb_name: 'aqua' }), 'https://eyes.nasa.gov/assets/dynamic/earth/api/thumbnail/aqua.webp');
});

test('archive dates skip missing leap days and find the previous available observation', () => {
  const dates = availableDates({ startDate: '2024-02-27', endDate: '2024-03-02', frequency: 'daily', missingDates: ['2024-02-29'] });
  assert.deepEqual(dates, ['2024-02-27','2024-02-28','2024-03-01','2024-03-02']);
  assert.equal(nearestDate(dates,'2024-02-29'),'2024-02-28');
  assert.equal(nearestDate(dates,'2024-01-01'),'2024-02-27');
  assert.equal(nearestDate(dates),'2024-03-02');
});
test('monthly and irregular imagery availability do not invent days', () => {
  assert.deepEqual(availableDates({ startDate:'2023-11-01', endDate:'2024-03-01', frequency:'monthly', missingDates:['2024-01-01'] }),['2023-11-01','2023-12-01','2024-02-01','2024-03-01']);
  assert.deepEqual(availableDates({ startDate:'2024-01-01',endDate:'2024-02-01',frequency:'daily',availableDates:{'2024-01-19':{},'2024-01-03':{},invalid:{}} }),['2024-01-03','2024-01-19']);
  assert.deepEqual(availableDates({startDate:'invalid',endDate:'2024-02-01'}),[]);
  assert.equal(nearestDate([], '2024-02-01'),null);
});
test('GIBS publication dates and gaps take precedence over a newer upstream archive date', () => {
  const xml='<Layer><Name>ozone</Name><Dimension name="time" default="2026-09-29">2026-09-25/2026-09-26/P1D,2026-09-28/2026-09-29/P1D</Dimension></Layer>';
  const calendar=gibsCalendar(xml,'ozone','omiOzoneToday');
  assert.equal(calendar.endDate,'2026-09-29');
  assert.deepEqual(availableDates(calendar),['2026-09-25','2026-09-26','2026-09-28','2026-09-29']);
  assert.equal(nearestDate(availableDates(calendar),'2026-09-30'),'2026-09-29');
  assert.equal(gibsCalendar(xml,'missing','omiOzoneToday'),null);
});
test('dataset requests validate IDs, actual calendar dates and WMS axis order', () => {
  assert.equal(validDate('2026-02-29'),false);
  assert.equal(rawRasterUrl('../secret','2026-10-01'),null);
  assert.equal(rawRasterUrl('airSurfaceDayTempToday','2026-02-30'),null);
  assert.equal(rawRasterUrl('airSurfaceDayTempToday','2026-10-03'),'https://eyes.nasa.gov/assets/dynamic/earth/data/airSurfaceDayTempToday/26/1003_6.png');
  const url = new URL(gibsGlobeUrl('MODIS_Terra_CorrectedReflectance_TrueColor','2024-02-29'));
  assert.equal(url.searchParams.get('BBOX'),'-90,-180,90,180');
  assert.equal(url.searchParams.get('TIME'),'2024-02-29');
  assert.equal(gibsGlobeUrl('https://example.com','2024-02-29'),null);
});
test('numeric science rasters honor NASA byte order, scale, offset and missing-data flags', () => {
  assert.equal(decodeMeasurement(0,1,65,dataset('airSurfaceDayTempToday')).value,21);
  assert.equal(formatMeasurement(decodeMeasurement(0,1,76,dataset('airSurfaceDayTempToday')),true),'0.0 °C');
  assert.equal(decodeMeasurement(1,1,65,dataset('airSurfaceDayTempToday')),null);
  assert.equal(decodeMeasurement(0,1,244,dataset('smapSoilMoisture8Day')).value,.5);
  assert.equal(decodeMeasurement(0,3,232,dataset('akikoMonthly')).value,0);
  assert.equal(decodeMeasurement(0,156,64,dataset('oco216Day')).value,400);
});
test('precipitation and combined soil/salinity use their distinct encodings and units', () => {
  assert.equal(decodeMeasurement(0,100,1,dataset('precipitationToday')).value,3.56);
  assert.equal(decodeMeasurement(2,100,1,dataset('precipitationToday')).kind,'Snow');
  const ocean = decodeMeasurement(0,13,133,dataset('smapSmSalinity8Day'));
  assert.equal(ocean.units,'psu'); assert.equal(ocean.value,35);
  const soil = decodeMeasurement(0,1,205,dataset('smapSmSalinity8Day'));
  assert.equal(soil.units,'cm³/cm³'); assert.equal(soil.value,.5);
});
test('all catalog variants are unique and EarthSphere palettes preserve their endpoints', () => {
  assert.equal(SCIENCE_LAYERS.length,18);
  assert.equal(DATASETS.length,44);
  assert.equal(new Set(DATASETS.map(item=>item.id)).size,44);
  assert.deepEqual(paletteColor(['#000000','#ffffff'],0),[0,0,0]);
  assert.deepEqual(paletteColor(['#000000','#ffffff'],1),[255,255,255]);
});
test('geographic coordinates align texture longitude with the globe and round-trip at zero', () => {
  assert.deepEqual(geographicVector(0,0),[1,0,-0]);
  for(const [lat,lon] of [[0,0],[23,90],[-48,-130],[89,179],[-89,-179]]){
    const point=vectorGeographic(...geographicVector(lat,lon));
    assert.ok(Math.abs(point.latitude-lat)<1e-9);assert.ok(Math.abs(point.longitude-lon)<1e-9);
  }
});
test('solar declination changes hemispheres at the solstices and rotates with UTC', () => {
  const june=solarPoint(Date.parse('2026-06-21T12:00:00Z'));
  const december=solarPoint(Date.parse('2026-12-21T12:00:00Z'));
  assert.ok(june.latitude>23&&june.latitude<24);assert.ok(december.latitude < -23&&december.latitude > -24);
  assert.ok(Math.abs(june.longitude)<5);
  const midnight=solarPoint(Date.parse('2026-06-21T00:00:00Z'));
  assert.ok(Math.abs(midnight.longitude)>175);
});
const iss={line1:'1 25544U 98067A   23277.53443324  .00015525  00000-0  28135-3 0  9997',line2:'2 25544  51.6416 329.9868 0004550  29.5601  73.1973 15.50059529418873',satelliteId:25544,name:'ISS'};
test('SGP4 positions and ground tracks use the TLE epoch and never extrapolate years', () => {
  const epoch=tleEpoch(iss.line1),position=propagatedPosition(iss,epoch);
  assert.ok(position.altitude>300&&position.altitude<500);assert.ok(position.speed>7&&position.speed<8);
  assert.equal(propagatedPosition(iss,Date.parse('2026-10-04')),null);
  assert.equal(propagatedPosition({...iss,line1:'malformed'},epoch),null);
  for(const point of orbitPath(iss,epoch))assert.ok(Math.hypot(...point)>1.04);
  for(const point of orbitPath(iss,epoch,true))assert.ok(Math.abs(Math.hypot(...point)-1.004)<1e-9);
});
test('orbital fallback parsing validates the requested spacecraft and both element lines', () => {
  const text=`ISS (ZARYA)\r\n${iss.line1}\r\n${iss.line2}\r\n`;
  const record=parseCelestrakElements(25544,text);
  assert.equal(record.source,'CelesTrak');assert.equal(record.satelliteId,25544);assert.equal(record.name,'ISS (ZARYA)');
  assert.equal(parseCelestrakElements(12345,text),null);
  assert.equal(parseCelestrakElements(25544,'No GP data found'),null);
  assert.equal(parseCelestrakElements(25544,`${iss.line1}\n2 12345 invalid`),null);
  assert.equal(NORAD_IDS.sc_cygnss_1,41887);
});
test('camera transitions stay outside Earth even for antipodal flights and close zooms', () => {
  for(const [from,to] of [[[3,0,0],[-2,0,0]],[[0,1.2,0],[0,-1.2,0]],[[2,1,3],[2,1,3]]])for(let i=0;i<=100;i++){
    const point=cameraFlightStep(from,to,i/100);
    assert.ok(point.every(Number.isFinite));assert.ok(Math.hypot(...point)>=1.199999);
    if(i===100)point.forEach((value,index)=>assert.ok(Math.abs(value-to[index])<1e-7));
  }
});
test('mission metadata handles ordinal launch dates and rejects unsafe external URLs', () => {
  const now=Date.parse('2026-10-04');
  assert.equal(missionStatus({launch_date:'July 30th, 2025',end_date:''},now),'Current');
  assert.equal(missionStatus({launch_date:'July 30th, 2027'},now),'Future');
  assert.equal(missionStatus({launch_date:'2002-01-01',end_date:'2023-01-01'},now),'Past');
  assert.equal(missionUrl('javascript:alert(1)'),null);
  assert.equal(missionUrl('https://nasa.gov.example.com'),null);
  assert.equal(missionUrl('http://aqua.nasa.gov/'),'https://aqua.nasa.gov/');
  assert.equal(plainText('An <a href="bad">Earth</a> &amp; space mission'),'An Earth & space mission');
});
